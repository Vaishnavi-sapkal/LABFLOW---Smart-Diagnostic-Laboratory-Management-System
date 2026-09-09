import { ConflictException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Patient } from './patient.schema';
import { PatientService } from './patient.service';

describe('PatientService', () => {
  let service: PatientService;
  const model = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatientService,
        { provide: getModelToken(Patient.name), useValue: model },
        { provide: ConfigService, useValue: { get: jest.fn() } },
      ],
    }).compile();
    service = module.get(PatientService);
  });

  it('creates a patient with the supplied data', async () => {
    const dto = { fullName: 'Asha Singh', mobile: '9876543210' } as any;
    const patient = { _id: 'patient-1', ...dto };
    model.create.mockResolvedValue(patient);

    await expect(service.create(dto)).resolves.toBe(patient);
    expect(model.create).toHaveBeenCalledWith(dto);
  });

  it('retries a duplicate generated patient ID once', async () => {
    const dto = { fullName: 'Asha Singh' } as any;
    const patient = { _id: 'patient-1', ...dto };
    model.create.mockRejectedValueOnce({ code: 11000 }).mockResolvedValueOnce(patient);

    await expect(service.create(dto)).resolves.toBe(patient);
    expect(model.create).toHaveBeenCalledTimes(2);
  });

  it('turns two duplicate ID collisions into a conflict', async () => {
    model.create.mockRejectedValue({ code: 11000 });

    await expect(service.create({} as any)).rejects.toBeInstanceOf(ConflictException);
  });

  it('escapes search text and returns patients newest first', async () => {
    const exec = jest.fn().mockResolvedValue([{ _id: 'patient-1' }]);
    const sort = jest.fn().mockReturnValue({ exec });
    model.find.mockReturnValue({ sort });

    await expect(service.findAll('Asha.+')).resolves.toEqual([{ _id: 'patient-1' }]);
    expect(model.find).toHaveBeenCalledWith({
      $or: expect.arrayContaining([
        { fullName: { $regex: 'Asha\\.\\+', $options: 'i' } },
        { patientId: { $regex: 'Asha\\.\\+', $options: 'i' } },
        { mobile: { $regex: 'Asha\\.\\+', $options: 'i' } },
      ]),
    });
    expect(sort).toHaveBeenCalledWith({ createdAt: -1 });
  });

  it('updates an existing patient and rejects a missing one', async () => {
    const exec = jest.fn().mockResolvedValueOnce({ _id: 'patient-1', city: 'Pune' }).mockResolvedValueOnce(null);
    model.findByIdAndUpdate.mockReturnValue({ exec });

    await expect(service.update('patient-1', { city: 'Pune' } as any)).resolves.toMatchObject({ city: 'Pune' });
    expect(model.findByIdAndUpdate).toHaveBeenCalledWith('patient-1', { city: 'Pune' }, { new: true, runValidators: true });
    await expect(service.update('missing', {} as any)).rejects.toBeInstanceOf(NotFoundException);
  });
});
