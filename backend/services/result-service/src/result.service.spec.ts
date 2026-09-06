import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';
import { Result, ResultFlag, ResultStatus } from './result.schema';
import { ResultService } from './result.service';

jest.mock('axios', () => ({ get: jest.fn() }));

describe('ResultService', () => {
  let service: ResultService;
  const save = jest.fn();
  const model: any = jest.fn(function (data) { return { ...data, save }; });
  model.findById = jest.fn();
  model.find = jest.fn();
  model.findByIdAndDelete = jest.fn();
  const config = { get: jest.fn().mockReturnValue('http://test-service/') };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResultService,
        { provide: getModelToken(Result.name), useValue: model },
        { provide: ConfigService, useValue: config },
      ],
    }).compile();
    service = module.get(ResultService);
  });

  it('creates draft values from a mocked test-service response', async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: { parameters: [{ name: 'Haemoglobin', unit: 'g/dL', referenceMin: 12, referenceMax: 16 }] } });
    save.mockResolvedValue('saved');

    await expect(service.create({ sampleId: 'sample-1', bookingId: 'booking-1', patientId: 'patient-1', testId: 'test-1' })).resolves.toBe('saved');
    expect(axios.get).toHaveBeenCalledWith('http://test-service/tests/test-1', expect.objectContaining({ headers: expect.objectContaining({ 'x-internal-service-key': expect.any(String) }) }));
    expect(model).toHaveBeenCalledWith(expect.objectContaining({ status: ResultStatus.DRAFT, values: [expect.objectContaining({ value: null, flag: ResultFlag.PENDING })] }));
  });

  it('sets normal, low, and high flags when values are entered', async () => {
    const result: any = { values: [
      { parameterName: 'A', value: null, referenceMin: 10, referenceMax: 20, flag: ResultFlag.PENDING },
      { parameterName: 'B', value: null, referenceMin: 10, referenceMax: 20, flag: ResultFlag.PENDING },
      { parameterName: 'C', value: null, referenceMin: 10, referenceMax: 20, flag: ResultFlag.PENDING },
    ], save: jest.fn().mockResolvedValue('saved') };
    model.findById.mockReturnValue({ exec: jest.fn().mockResolvedValue(result) });

    await service.updateValues('result-1', [{ parameterName: 'A', value: 15 }, { parameterName: 'B', value: 8 }, { parameterName: 'C', value: 22 }]);
    expect(result.values.map((value: any) => value.flag)).toEqual([ResultFlag.NORMAL, ResultFlag.LOW, ResultFlag.HIGH]);
  });

  it('only submits a result after every value is entered', async () => {
    const result: any = { values: [{ parameterName: 'A', value: null }], status: ResultStatus.DRAFT, save: jest.fn() };
    model.findById.mockReturnValue({ exec: jest.fn().mockResolvedValue(result) });
    await expect(service.submit('result-1')).rejects.toBeInstanceOf(BadRequestException);

    result.values[0].value = 15;
    result.save.mockResolvedValue('submitted');
    await expect(service.submit('result-1')).resolves.toBe('submitted');
    expect(result.status).toBe(ResultStatus.SUBMITTED);
  });

  it('allows verification only from submitted status', async () => {
    const result: any = { status: ResultStatus.SUBMITTED, save: jest.fn().mockResolvedValue('verified') };
    model.findById.mockReturnValue({ exec: jest.fn().mockResolvedValue(result) });
    await expect(service.updateStatus('result-1', 'verified', 'looks good')).resolves.toBe('verified');
    expect(result).toMatchObject({ status: ResultStatus.VERIFIED, verificationComment: 'looks good' });

    result.status = ResultStatus.DRAFT;
    await expect(service.updateStatus('result-1', 'rejected')).rejects.toBeInstanceOf(BadRequestException);
  });
});
