export type Status = 'success' | 'warning' | 'danger' | 'info' | 'neutral';
export type Role = 'Admin' | 'Doctor' | 'Receptionist' | 'Lab Technician' | 'Patient';

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  city: string;
  bloodGroup: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  status: 'Available' | 'In consultation' | 'Off duty';
}

export interface LabTest {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface Booking {
  id: string;
  patientId: string;
  testIds: string[];
  doctorId: string;
  status: string;
  slot: string;
  amount: number;
}

export interface Sample {
  id: string;
  patientId: string;
  testName: string;
  time: string;
  status: 'Collected' | 'In Transit' | 'Processing' | 'Completed' | 'Delayed';
}

export interface Result {
  parameter: string;
  value: string;
  unit: string;
  range: string;
  flag: 'Normal' | 'High' | 'Low' | 'Pending';
}

export interface Report {
  id: string;
  patientId: string;
  sampleId: string;
  doctorId: string;
  date: string;
  status: string;
  results: Result[];
}

export interface BillingItem {
  name: string;
  quantity: number;
  price: number;
  discount: number;
}

export interface User {
  name: string;
  role: Role;
  initials: string;
}

export interface Notification {
  id: string;
  role: Role | 'All';
  title: string;
  body: string;
  category: 'Urgent' | 'Task' | 'Billing' | 'Report' | 'System';
  time: string;
  unread: boolean;
}
