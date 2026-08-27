import type { BillingItem, Booking, Doctor, LabTest, Patient, Report, Sample, User } from '../types/labflow';

export const user: User = { name: 'Kavya Nair', role: 'Operations Admin', initials: 'KN' };

export const patients: Patient[] = [
  { id: 'PAT-2026-0142', name: 'Priya Joshi', age: 34, gender: 'Female', phone: '+91 98765 42110', city: 'Pune', bloodGroup: 'B+' },
  { id: 'PAT-2026-0143', name: 'Rahul Patil', age: 42, gender: 'Male', phone: '+91 98220 85411', city: 'Mumbai', bloodGroup: 'O+' },
  { id: 'PAT-2026-0144', name: 'Sneha More', age: 29, gender: 'Female', phone: '+91 97654 10322', city: 'Nashik', bloodGroup: 'A+' },
  { id: 'PAT-2026-0145', name: 'Aditya Kulkarni', age: 51, gender: 'Male', phone: '+91 99870 55321', city: 'Pune', bloodGroup: 'AB+' },
];

export const doctors: Doctor[] = [
  { id: 'DOC-01', name: 'Dr. Ananya Sharma', specialization: 'Pathologist', status: 'Available' },
  { id: 'DOC-02', name: 'Dr. Rohan Kulkarni', specialization: 'Biochemistry', status: 'In consultation' },
  { id: 'DOC-03', name: 'Dr. Neha Patil', specialization: 'Microbiology', status: 'Available' },
  { id: 'DOC-04', name: 'Dr. Amit Deshmukh', specialization: 'Hematology', status: 'Off duty' },
];

export const tests: LabTest[] = [
  { id: 'T-CBC', name: 'Complete Blood Count', description: 'Hemoglobin, WBC, RBC and platelet indices', price: 850 },
  { id: 'T-THY', name: 'Thyroid Profile', description: 'T3, T4 and TSH screening panel', price: 1250 },
  { id: 'T-LIP', name: 'Lipid Profile', description: 'Cholesterol, HDL, LDL and triglycerides', price: 2450 },
  { id: 'T-FULL', name: 'Executive Health Panel', description: 'Comprehensive metabolic and preventive profile', price: 4800 },
];

export const bookings: Booking[] = [
  { id: 'BK-2026-0831', patientId: 'PAT-2026-0142', testIds: ['T-CBC', 'T-LIP'], doctorId: 'DOC-01', status: 'Sample collected', slot: '25 Aug, 10:40 AM', amount: 3300 },
  { id: 'BK-2026-0832', patientId: 'PAT-2026-0143', testIds: ['T-THY'], doctorId: 'DOC-02', status: 'Awaiting payment', slot: '25 Aug, 11:20 AM', amount: 1250 },
  { id: 'BK-2026-0833', patientId: 'PAT-2026-0144', testIds: ['T-FULL'], doctorId: 'DOC-03', status: 'Report ready', slot: '25 Aug, 09:30 AM', amount: 4800 },
];

export const samples: Sample[] = [
  { id: 'LAB-2026-08421', patientId: 'PAT-2026-0142', testName: 'CBC + Lipid Profile', time: '10:42 AM', status: 'Processing' },
  { id: 'LAB-2026-08422', patientId: 'PAT-2026-0143', testName: 'Thyroid Profile', time: '11:18 AM', status: 'Collected' },
  { id: 'LAB-2026-08423', patientId: 'PAT-2026-0144', testName: 'Executive Health Panel', time: '09:50 AM', status: 'Completed' },
  { id: 'LAB-2026-08424', patientId: 'PAT-2026-0145', testName: 'CBC', time: '10:12 AM', status: 'Delayed' },
];

export const reportResults = [
  { parameter: 'Hemoglobin', value: '12.8', unit: 'g/dL', range: '12-16', flag: 'Normal' as const },
  { parameter: 'WBC', value: '11.2', unit: '10^3/uL', range: '4-10', flag: 'High' as const },
  { parameter: 'Platelets', value: '220', unit: '10^3/uL', range: '150-450', flag: 'Normal' as const },
  { parameter: 'Total Cholesterol', value: '184', unit: 'mg/dL', range: '<200', flag: 'Normal' as const },
];

export const reports: Report[] = [
  { id: 'RPT-2026-3341', patientId: 'PAT-2026-0142', sampleId: 'LAB-2026-08421', doctorId: 'DOC-01', date: '25 Aug 2026', status: 'Verified', results: reportResults },
  { id: 'RPT-2026-3342', patientId: 'PAT-2026-0144', sampleId: 'LAB-2026-08423', doctorId: 'DOC-03', date: '24 Aug 2026', status: 'Ready', results: reportResults.slice(0, 3) },
];

export const billingItems: BillingItem[] = [
  { name: 'Complete Blood Count', quantity: 1, price: 850, discount: 0 },
  { name: 'Lipid Profile', quantity: 1, price: 2450, discount: 150 },
  { name: 'Home collection', quantity: 1, price: 250, discount: 0 },
];

export const formatInr = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

export const patientById = (id: string) => patients.find((patient) => patient.id === id) ?? patients[0];
export const doctorById = (id: string) => doctors.find((doctor) => doctor.id === id) ?? doctors[0];
