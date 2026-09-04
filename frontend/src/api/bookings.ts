import { isAxiosError } from 'axios';
import client from './client';

export interface CreateBookingDto {
  patientId: string;
  doctorId: string;
  testIds: string[];
  scheduledDate: string;
  scheduledSlot: string;
  notes?: string;
}

export interface BookingItem {
  testId: string;
  code: string;
  name: string;
  price: number;
}

export interface CreatedBooking {
  _id?: string;
  bookingId: string;
  patientId: string;
  doctorId: string;
  items: BookingItem[];
  totalAmount: number;
  scheduledDate: string;
  scheduledSlot: string;
  status: string;
  notes?: string;
}

export class BookingRequestError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
    this.name = 'BookingRequestError';
  }
}

export async function createBooking(payload: CreateBookingDto): Promise<CreatedBooking> {
  try {
    const { data } = await client.post<CreatedBooking>('/bookings', payload);
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      const message = error.response?.data?.message;
      throw new BookingRequestError(
        typeof message === 'string' ? message : 'Unable to create booking. Please try again.',
        error.response?.status,
      );
    }

    throw error;
  }
}

export async function listBookings(filters?: { patientId?: string; doctorId?: string; status?: string; date?: string }): Promise<CreatedBooking[]> {
  try {
    const { data } = await client.get<CreatedBooking[]>('/bookings', { params: filters });
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      const message = error.response?.data?.message;
      throw new Error(typeof message === 'string' ? message : 'Unable to load bookings. Please try again.');
    }

    throw error;
  }
}

export async function getBooking(id: string): Promise<CreatedBooking> {
  try {
    const { data } = await client.get<CreatedBooking>(`/bookings/${id}`);
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      const message = error.response?.data?.message;
      throw new Error(typeof message === 'string' ? message : 'Unable to load booking details. Please try again.');
    }

    throw error;
  }
}
