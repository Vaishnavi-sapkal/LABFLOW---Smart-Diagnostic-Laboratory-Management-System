import type { BillingItem, Booking, Doctor, LabTest, Notification, Patient, Report, Sample, User } from '../types/labflow';

export const user: User = { name: 'Kavya Nair', role: 'Admin', initials: 'KN' };

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
  { id: 'CBC', name: 'Complete Blood Count', description: 'Hematology screening panel', price: 480 },
  { id: 'LFT', name: 'Liver Function Test', description: 'Biochemistry liver enzyme panel', price: 850 },
  { id: 'KFT', name: 'Kidney Function Test', description: 'Biochemistry kidney function panel', price: 780 },
  { id: 'LIPID', name: 'Lipid Profile', description: 'Cardiac lipid screening panel', price: 760 },
  { id: 'TFT', name: 'Thyroid Function (T3/T4/TSH)', description: 'Endocrinology thyroid function panel', price: 890 },
  { id: 'HBA1C', name: 'HbA1c (Glycated Hemoglobin)', description: 'Long-term glucose marker', price: 580 },
  { id: 'FBS', name: 'Fasting Blood Sugar', description: 'Fasting glucose measurement', price: 180 },
  { id: 'PPBS', name: 'Post-Prandial Blood Sugar', description: 'Post-meal glucose measurement', price: 180 },
  { id: 'VIT_D', name: 'Vitamin D (25-OH)', description: 'Vitamin D deficiency screening', price: 1200 },
  { id: 'VIT_B12', name: 'Vitamin B12', description: 'Vitamin B12 deficiency screening', price: 980 },
  { id: 'CRP', name: 'C-Reactive Protein', description: 'Inflammation marker', price: 560 },
  { id: 'ESR', name: 'ESR (Erythrocyte Sedimentation Rate)', description: 'Hematology inflammation marker', price: 220 },
];

export const bookings: Booking[] = [
  { id: 'BK-2026-0831', patientId: 'PAT-2026-0142', testIds: ['T-CBC', 'T-LIP'], doctorId: 'DOC-01', status: 'Sample collected', slot: '25 Aug, 10:40 AM', amount: 3300 },
  { id: 'BK-2026-0832', patientId: 'PAT-2026-0143', testIds: ['T-THY'], doctorId: 'DOC-02', status: 'Awaiting payment', slot: '25 Aug, 11:20 AM', amount: 1250 },
  { id: 'BK-2026-0833', patientId: 'PAT-2026-0144', testIds: ['T-FULL'], doctorId: 'DOC-03', status: 'Report ready', slot: '25 Aug, 09:30 AM', amount: 4800 },
];

export const samples: Sample[] = [
  { id: 'LAB-2026-08421', patientId: 'PAT-2026-0142', testName: 'CBC + Lipid Profile', time: '10:42 AM', status: 'Processing' },
  { id: 'LAB-2026-08422', patientId: 'PAT-2026-0143', testName: 'Thyroid Profile', time: '11:18 AM', status: 'In Transit' },
  { id: 'LAB-2026-08423', patientId: 'PAT-2026-0144', testName: 'Executive Health Panel', time: '09:50 AM', status: 'Completed' },
  { id: 'LAB-2026-08424', patientId: 'PAT-2026-0145', testName: 'CBC', time: '10:12 AM', status: 'Delayed' },
];

export const notifications: Notification[] = [
  { id: 'NTF-01', role: 'Doctor', title: 'Verification waiting', body: 'Priya Joshi report has one abnormal marker.', category: 'Urgent', time: '2 min ago', unread: true },
  { id: 'NTF-02', role: 'Lab Technician', title: 'Sample moved to processing', body: 'LAB-2026-08421 is ready for result entry.', category: 'Task', time: '12 min ago', unread: true },
  { id: 'NTF-03', role: 'Receptionist', title: 'Payment pending', body: 'Rahul Patil booking BK-2026-0832 is awaiting payment.', category: 'Billing', time: '28 min ago', unread: true },
  { id: 'NTF-04', role: 'Patient', title: 'Report ready', body: 'Your CBC + Lipid Profile report is verified.', category: 'Report', time: '1 hr ago', unread: false },
  { id: 'NTF-05', role: 'Admin', title: 'Daily queue summary', body: '128 bookings and 24 pending results today.', category: 'System', time: 'Today', unread: false },
  { id: 'NTF-06', role: 'All', title: 'System backup completed', body: 'Diagnostic records backup completed successfully.', category: 'System', time: 'Yesterday', unread: false },
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
