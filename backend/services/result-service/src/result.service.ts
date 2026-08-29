import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

import {
  Result,
  ResultDocument,
  ResultFlag,
  ResultStatus,
} from './result.schema';

@Injectable()
export class ResultService {
  constructor(
    @InjectModel(Result.name)
    private readonly resultModel: Model<ResultDocument>,
    private readonly configService: ConfigService,
  ) {}

  private calculateFlag(
    value: number,
    referenceMin: number,
    referenceMax: number,
  ): ResultFlag {
    if (value < referenceMin) return ResultFlag.LOW;
    if (value > referenceMax) return ResultFlag.HIGH;
    return ResultFlag.NORMAL;
  }

  async create(data: {
    sampleId: string;
    bookingId: string;
    patientId: string;
    testId: string;
    doctorId?: string;
    enteredBy?: string;
  }) {
    const baseUrl = this.configService.get<string>('TEST_SERVICE_URL');

    if (!baseUrl) {
      throw new BadRequestException(
        'TEST_SERVICE_URL is not configured',
      );
    }

    let testResponse;

    try {
      testResponse = await axios.get(
        `${baseUrl}/${data.testId}`,
      );
    } catch {
      throw new NotFoundException(
        `Test ${data.testId} not found`,
      );
    }

    const test = testResponse.data;

    if (
      !test ||
      !Array.isArray(test.parameters) ||
      test.parameters.length === 0
    ) {
      throw new NotFoundException(
        `No parameters defined for test ${data.testId}`,
      );
    }

    const values = test.parameters.map((parameter: any) => ({
      parameterName: parameter.name,
      unit: parameter.unit,
      referenceMin: parameter.referenceMin,
      referenceMax: parameter.referenceMax,
      value: null,
      flag: ResultFlag.PENDING,
    }));

    const result = new this.resultModel({
      sampleId: data.sampleId,
      bookingId: data.bookingId,
      patientId: data.patientId,
      testId: data.testId,
      doctorId: data.doctorId,
      enteredBy: data.enteredBy,
      values,
      status: ResultStatus.DRAFT,
    });

    return result.save();
  }

  async findAll(filters?: {
    sampleId?: string;
    patientId?: string;
    status?: string;
  }) {
    const query: Record<string, string> = {};

    if (filters?.sampleId) {
      query.sampleId = filters.sampleId;
    }

    if (filters?.patientId) {
      query.patientId = filters.patientId;
    }

    if (filters?.status) {
      query.status = filters.status;
    }

    return this.resultModel.find(query).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string) {
    const result = await this.resultModel.findById(id).exec();

    if (!result) {
      throw new NotFoundException(
        `Result ${id} not found`,
      );
    }

    const total = result.values.length;

    const entered = result.values.filter(
      (item) => item.value !== null && item.value !== undefined,
    ).length;

    const abnormalValues = result.values
      .filter(
        (item) =>
          item.flag !== ResultFlag.NORMAL &&
          item.flag !== ResultFlag.PENDING,
      )
      .map((item) => ({
        parameterName: item.parameterName,
        value: item.value,
        unit: item.unit,
        flag: item.flag,
        referenceMin: item.referenceMin,
        referenceMax: item.referenceMax,
      }));

    return {
      ...result.toObject(),
      entryProgress: `${entered} of ${total} entered`,
      abnormalValues,
    };
  }

  async updateValues(
    id: string,
    values: Array<{
      parameterName: string;
      value: number;
    }>,
  ) {
    const result = await this.resultModel.findById(id).exec();

    if (!result) {
      throw new NotFoundException(
        `Result ${id} not found`,
      );
    }

    for (const update of values) {
      const parameter = result.values.find(
        (item) =>
          item.parameterName === update.parameterName,
      );

      if (!parameter) {
        throw new BadRequestException(
          `Parameter "${update.parameterName}" not found in this result`,
        );
      }

      parameter.value = update.value;

      parameter.flag = this.calculateFlag(
        update.value,
        parameter.referenceMin,
        parameter.referenceMax,
      );
    }

    return result.save();
  }

  async updateRemarks(id: string, remarks: string) {
    const result = await this.resultModel.findById(id).exec();

    if (!result) {
      throw new NotFoundException(
        `Result ${id} not found`,
      );
    }

    result.remarks = remarks;

    return result.save();
  }

  async submit(id: string) {
    const result = await this.resultModel.findById(id).exec();

    if (!result) {
      throw new NotFoundException(
        `Result ${id} not found`,
      );
    }

    const missing = result.values
      .filter(
        (item) =>
          item.value === null ||
          item.value === undefined,
      )
      .map((item) => item.parameterName);

    if (missing.length > 0) {
      throw new BadRequestException(
        `Missing values for: ${missing.join(', ')}`,
      );
    }

    result.status = ResultStatus.SUBMITTED;
    result.submittedAt = new Date();

    return result.save();
  }

  async remove(id: string) {
    const result = await this.resultModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException(
        `Result ${id} not found`,
      );
    }

    return {
      message: 'Result deleted successfully',
    };
  }
}