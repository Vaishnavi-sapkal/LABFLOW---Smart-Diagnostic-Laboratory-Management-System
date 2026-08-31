import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Patient, PatientDocument } from './patient.schema';

@Injectable()
export class PatientService {
  constructor(
    @InjectModel(Patient.name)
    private readonly patientModel: Model<PatientDocument>,
  ) {}

  async create(createPatientDto: CreatePatientDto) {
    // Retry once on the very unlikely random patient-ID unique-index collision.
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        return await this.patientModel.create(createPatientDto);
      } catch (error: any) {
        if (error?.code !== 11000 || attempt === 1) {
          if (error?.code === 11000) {
            throw new ConflictException('Could not generate a unique patient ID');
          }
          throw error;
        }
      }
    }
  }

  async findAll(search?: string) {
    const filter = search
      ? {
          $or: [
            { fullName: { $regex: this.escapeRegex(search), $options: 'i' } },
            { patientId: { $regex: this.escapeRegex(search), $options: 'i' } },
          ],
        }
      : {};

    return this.patientModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string) {
    const patient = await this.patientModel.findById(id).exec();
    if (!patient) {
      throw new NotFoundException(`Patient ${id} was not found`);
    }
    return patient;
  }

  async update(id: string, updatePatientDto: UpdatePatientDto) {
    const patient = await this.patientModel
      .findByIdAndUpdate(id, updatePatientDto, { new: true, runValidators: true })
      .exec();
    if (!patient) {
      throw new NotFoundException(`Patient ${id} was not found`);
    }
    return patient;
  }

  async remove(id: string) {
    const patient = await this.patientModel.findByIdAndDelete(id).exec();
    if (!patient) {
      throw new NotFoundException(`Patient ${id} was not found`);
    }
    return { deleted: true, id };
  }

  private escapeRegex(value: string) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
