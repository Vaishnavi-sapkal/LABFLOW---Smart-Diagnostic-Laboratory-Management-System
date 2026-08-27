import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking, BookingDocument } from './booking.schema';

@Injectable()
export class BookingService {
  constructor(@InjectModel(Booking.name) private readonly model: Model<BookingDocument>) {}
  create(payload: Record<string, unknown>) { return this.model.create(payload); }
  findAll() { return this.model.find().exec(); }
  async findOne(id: string) { const entity = await this.model.findById(id).exec(); if (!entity) throw new NotFoundException('Booking not found'); return entity; }
  async update(id: string, payload: Record<string, unknown>) { const entity = await this.model.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).exec(); if (!entity) throw new NotFoundException('Booking not found'); return entity; }
  async remove(id: string) { const entity = await this.model.findByIdAndDelete(id).exec(); if (!entity) throw new NotFoundException('Booking not found'); return { deleted: true, id }; }
}
