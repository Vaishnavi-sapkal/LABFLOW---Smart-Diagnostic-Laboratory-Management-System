import { HttpService } from '@nestjs/axios';
import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { Invoice } from './billing.schema';
import { BillingService } from './billing.service';

describe('BillingService', () => {
  let service: BillingService;
  const model = { create: jest.fn(), find: jest.fn(), findOne: jest.fn(), findById: jest.fn(), findByIdAndDelete: jest.fn() };
  const http = { get: jest.fn() };
  const config = { get: jest.fn((key: string) => ({
    BOOKING_SERVICE_URL: 'http://booking', PATIENT_SERVICE_URL: 'http://patient/', DOCTOR_SERVICE_URL: 'http://doctor', INTERNAL_SERVICE_SECRET: 'test-internal-secret',
  }[key])) };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BillingService,
        { provide: getModelToken(Invoice.name), useValue: model },
        { provide: HttpService, useValue: http },
        { provide: ConfigService, useValue: config },
      ],
    }).compile();
    service = module.get(BillingService);
  });

  it('builds a draft invoice from mocked booking, patient, and doctor services', async () => {
    const latest = { sort: jest.fn().mockReturnThis(), select: jest.fn().mockReturnThis(), lean: jest.fn().mockReturnThis(), exec: jest.fn().mockResolvedValue({ invoiceNo: 'LF-INV-00041' }) };
    model.findOne.mockReturnValue(latest);
    http.get
      .mockReturnValueOnce(of({ data: { patientId: 'patient-1', doctorId: 'doctor-1', items: [{ testId: 'test-1', code: 'CBC', name: 'CBC', price: 500 }] } }))
      .mockReturnValueOnce(of({ data: { fullName: 'Asha Singh', patientId: 'LF-P-12345' } }))
      .mockReturnValueOnce(of({ data: { fullName: 'Dr Rao' } }));
    model.create.mockResolvedValue({ _id: 'invoice-1' });

    await expect(service.create({ bookingId: 'booking-1' } as any)).resolves.toEqual({ _id: 'invoice-1' });
    expect(http.get).toHaveBeenNthCalledWith(1, 'http://booking/bookings/booking-1', { headers: { 'x-internal-service-key': 'test-internal-secret' } });
    expect(model.create).toHaveBeenCalledWith(expect.objectContaining({
      invoiceNo: 'LF-INV-00042', subtotal: 500, discountAmount: 0, gstAmount: 25, totalAmount: 525, status: 'draft',
    }));
  });

  it('retries an invoice-number collision with the next generated number', async () => {
    const first = { sort: jest.fn().mockReturnThis(), select: jest.fn().mockReturnThis(), lean: jest.fn().mockReturnThis(), exec: jest.fn().mockResolvedValueOnce({ invoiceNo: 'LF-INV-00001' }).mockResolvedValueOnce({ invoiceNo: 'LF-INV-00002' }) };
    model.findOne.mockReturnValue(first);
    http.get.mockReturnValueOnce(of({ data: { patientId: 'p1', doctorId: 'd1', items: [] } })).mockReturnValueOnce(of({ data: { fullName: 'Asha', patientId: 'LF-P-1' } })).mockReturnValueOnce(of({ data: { fullName: 'Dr Rao' } }));
    model.create.mockRejectedValueOnce({ code: 11000 }).mockResolvedValueOnce({ _id: 'invoice-2' });

    await service.create({ bookingId: 'booking-1' } as any);
    expect(model.create.mock.calls.map(([invoice]) => invoice.invoiceNo)).toEqual(['LF-INV-00002', 'LF-INV-00003']);
  });

  it('recalculates draft totals when applying a discount', async () => {
    const invoice: any = { status: 'draft', subtotal: 1000, save: jest.fn().mockResolvedValue('saved') };
    model.findById.mockReturnValue({ exec: jest.fn().mockResolvedValue(invoice) });

    await expect(service.updateDiscount('invoice-1', 10)).resolves.toBe('saved');
    expect(invoice).toMatchObject({ discountPercent: 10, discountAmount: 100, gstAmount: 45, totalAmount: 945 });
  });

  it('does not allow payment confirmation for a non-draft invoice', async () => {
    model.findById.mockReturnValue({ exec: jest.fn().mockResolvedValue({ status: 'paid' }) });

    await expect(service.confirmPayment('invoice-1', { paymentMethod: 'cash' } as any)).rejects.toBeInstanceOf(BadRequestException);
  });
});
