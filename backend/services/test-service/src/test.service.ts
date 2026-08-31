import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { Test, TestDocument } from './test.schema';

@Injectable()
export class TestService {
  constructor(
    @InjectModel(Test.name)
    private readonly testModel: Model<TestDocument>,
  ) {}

  async create(createTestDto: CreateTestDto) {
    const data = this.normalizePackageFields(this.normalizeCode(createTestDto));
    await this.validateIncludedTests(data.isPackage, data.includedTestIds);
    return this.testModel.create(data);
  }

  findAll(category?: string, isPackage?: string, search?: string) {
    const filter: FilterQuery<TestDocument> = {};

    if (category) {
      filter.category = { $regex: this.escapeRegex(category), $options: 'i' };
    }
    if (isPackage === 'true') {
      filter.isPackage = true;
    } else if (isPackage === 'false') {
      filter.isPackage = false;
    }
    if (search) {
      const expression = { $regex: this.escapeRegex(search), $options: 'i' };
      filter.$or = [{ name: expression }, { code: expression }];
    }

    return this.testModel.find(filter).sort({ category: 1, name: 1 }).exec();
  }

  async findOne(id: string) {
    const test = await this.testModel.findById(id).exec();
    if (!test) {
      throw new NotFoundException(`Test ${id} was not found`);
    }
    return test;
  }

  async update(id: string, updateTestDto: UpdateTestDto) {
    const existingTest = await this.findOne(id);
    const data = this.normalizePackageFields(this.normalizeCode(updateTestDto));
    await this.validateIncludedTests(
      data.isPackage ?? existingTest.isPackage,
      data.includedTestIds ?? existingTest.includedTestIds,
    );
    const test = await this.testModel
      .findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      })
      .exec();
    if (!test) {
      throw new NotFoundException(`Test ${id} was not found`);
    }
    return test;
  }

  async getSavings(id: string) {
    const test = await this.findOne(id);
    if (!test.isPackage) {
      throw new BadRequestException('Savings are available only for packages');
    }

    const includedTests = await this.testModel
      .find({ _id: { $in: test.includedTestIds }, isPackage: false })
      .select('price')
      .exec();
    const individualTotal = includedTests.reduce((total, includedTest) => total + includedTest.price, 0);

    return {
      individualTotal,
      packagePrice: test.price,
      savings: individualTotal - test.price,
    };
  }

  async remove(id: string) {
    const test = await this.testModel.findByIdAndDelete(id).exec();
    if (!test) {
      throw new NotFoundException(`Test ${id} was not found`);
    }
    return { deleted: true, id };
  }

  private normalizePackageFields<T extends CreateTestDto | UpdateTestDto>(dto: T) {
    if (dto.isPackage === false) {
      return { ...dto, includedTestIds: [] };
    }
    return dto;
  }

  private normalizeCode<T extends CreateTestDto | UpdateTestDto>(dto: T) {
    return dto.code ? { ...dto, code: dto.code.trim().toUpperCase() } : dto;
  }

  private async validateIncludedTests(isPackage: boolean | undefined, includedTestIds?: string[]) {
    if (!isPackage || !includedTestIds?.length) {
      return;
    }

    const includedTests = await this.testModel
      .find({ _id: { $in: includedTestIds }, isPackage: false })
      .select('_id')
      .exec();
    if (includedTests.length !== new Set(includedTestIds).size) {
      throw new BadRequestException('Packages may include only existing individual tests');
    }
  }

  private escapeRegex(value: string) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
