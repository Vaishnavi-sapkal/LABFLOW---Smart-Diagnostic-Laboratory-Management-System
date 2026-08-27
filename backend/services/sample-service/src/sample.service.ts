import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Sample, SampleDocument } from './sample.schema';

@Injectable()
export class SampleService {
  constructor(@InjectModel(Sample.name) private readonly model: Model<SampleDocument>) {}
  create(payload: Record<string, unknown>) { return this.model.create(payload); }
  findAll() { return this.model.find().exec(); }
  async findOne(id: string) { const entity = await this.model.findById(id).exec(); if (!entity) throw new NotFoundException('Sample not found'); return entity; }
  async update(id: string, payload: Record<string, unknown>) { const entity = await this.model.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).exec(); if (!entity) throw new NotFoundException('Sample not found'); return entity; }
  async remove(id: string) { const entity = await this.model.findByIdAndDelete(id).exec(); if (!entity) throw new NotFoundException('Sample not found'); return { deleted: true, id }; }
}
