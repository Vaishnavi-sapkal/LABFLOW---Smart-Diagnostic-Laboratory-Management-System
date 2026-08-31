import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { Doctor, DoctorDocument } from './doctor.schema';

@Injectable()
export class DoctorService {
  constructor(@InjectModel(Doctor.name) private readonly doctorModel: Model<DoctorDocument>) {}

  async create(createDoctorDto: CreateDoctorDto) {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        return await this.doctorModel.create(createDoctorDto);
      } catch (error: any) {
        if (error?.code === 11000 && attempt === 0) continue;
        if (error?.code === 11000) throw new ConflictException('Could not generate a unique doctor ID');
        throw error;
      }
    }
  }

  findAll(isActive?: string, search?: string) {
    const filter: FilterQuery<DoctorDocument> = {};
    if (isActive === 'true') filter.isActive = true;
    if (isActive === 'false') filter.isActive = false;
    if (search) filter.fullName = { $regex: this.escapeRegex(search), $options: 'i' };
    return this.doctorModel.find(filter).sort({ fullName: 1 }).exec();
  }

  async findOne(id: string) {
    const doctor = await this.doctorModel.findById(id).exec();
    if (!doctor) throw new NotFoundException(`Doctor ${id} was not found`);
    return doctor;
  }

  async update(id: string, updateDoctorDto: UpdateDoctorDto) {
    const doctor = await this.doctorModel.findByIdAndUpdate(id, updateDoctorDto, { new: true, runValidators: true }).exec();
    if (!doctor) throw new NotFoundException(`Doctor ${id} was not found`);
    return doctor;
  }

  async remove(id: string) {
    const doctor = await this.doctorModel.findByIdAndUpdate(id, { isActive: false }, { new: true }).exec();
    if (!doctor) throw new NotFoundException(`Doctor ${id} was not found`);
    return doctor;
  }

  private escapeRegex(value: string) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
