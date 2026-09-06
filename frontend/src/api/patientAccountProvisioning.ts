import { registerAccount } from './auth';
import {
  createPatient,
  listPatients,
  updatePatient,
  type CreatedPatient,
  type CreatePatientDto,
} from './patients';

export interface PatientAccountProvisioningInput extends CreatePatientDto {
  password: string;
  rollbackAccount?: (userId: string) => Promise<void>;
}

function normalizedMobile(value: string) {
  return value.replace(/\D/g, '');
}

/**
 * Creates the portal user and either creates a patient profile or links that
 * user to the existing profile with the same mobile number.
 */
export async function createOrLinkPatientAccount(
  input: PatientAccountProvisioningInput,
): Promise<{ accountId: string; patient: CreatedPatient }> {
  if (!input.fullName.trim()) throw new Error('A patient name is required.');
  if (Number.isNaN(new Date(input.dateOfBirth).getTime())) throw new Error('A valid date of birth is required.');
  if (!/^\+?[1-9]\d{7,14}$/.test(input.mobile.trim())) throw new Error('A valid mobile number is required.');
  if (input.aadhaarNumber && !/^\d{12}$/.test(input.aadhaarNumber)) throw new Error('Government ID must contain exactly 12 digits.');
  if (!input.email || !input.password) {
    throw new Error('An email address and temporary password are required for a patient account.');
  }

  const mobileMatches = await listPatients(input.mobile);
  const existingPatient = mobileMatches.find(
    (patient) => normalizedMobile(patient.mobile) === normalizedMobile(input.mobile),
  );

  if (existingPatient?.userId) {
    throw new Error('This mobile number is already linked to a patient account.');
  }
  if (existingPatient && !existingPatient._id) {
    throw new Error('The matched patient profile cannot be linked because it has no database ID.');
  }
  const account = await registerAccount({
    name: input.fullName,
    email: input.email,
    password: input.password,
    role: 'patient',
  });
  const { password: _password, rollbackAccount, ...patientPayload } = input;
  const profilePayload: CreatePatientDto = { ...patientPayload, userId: account.id };

  try {
    const patient = existingPatient
      ? await updatePatient(existingPatient._id!, profilePayload)
      : await createPatient(profilePayload);

    return { accountId: account.id, patient };
  } catch (profileError) {
    if (rollbackAccount) {
      try {
        await rollbackAccount(account.id);
      } catch {
        throw new Error('The patient profile could not be created and the new login could not be rolled back. Delete the account from the account list before retrying.');
      }
    }
    throw profileError;
  }
}
