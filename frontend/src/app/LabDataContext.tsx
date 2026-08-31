import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { bookings as bookingSeed, notifications as notificationSeed, patients as patientSeed, reports as reportSeed, samples as sampleSeed } from '../data/mockData';
import type { Booking, Notification, Patient, Report, Sample } from '../types/labflow';

interface LabDataContextValue {
  patients: Patient[];
  bookings: Booking[];
  samples: Sample[];
  reports: Report[];
  notifications: Notification[];
  addPatient: (patient: Patient) => void;
  addBooking: (booking: Booking) => void;
  updateSampleStatus: (sampleId: string, status: Sample['status']) => void;
  markNotificationRead: (notificationId: string) => void;
}

const LabDataContext = createContext<LabDataContextValue | undefined>(undefined);

export function LabDataProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>(patientSeed);
  const [bookings, setBookings] = useState<Booking[]>(bookingSeed);
  const [samples, setSamples] = useState<Sample[]>(sampleSeed);
  const [reports] = useState<Report[]>(reportSeed);
  const [notifications, setNotifications] = useState<Notification[]>(notificationSeed);

  const value = useMemo(
    () => ({
      patients,
      bookings,
      samples,
      reports,
      notifications,
      addPatient: (patient: Patient) => setPatients((current) => current.some((item) => item.id === patient.id) ? current : [patient, ...current]),
      addBooking: (booking: Booking) => {
        setBookings((current) => [booking, ...current]);
        setSamples((current) => [
          {
            id: `LAB-2026-${String(8425 + current.length).padStart(5, '0')}`,
            patientId: booking.patientId,
            testName: `${booking.testIds.length} selected tests`,
            time: 'Now',
            status: 'Collected',
          },
          ...current,
        ]);
      },
      updateSampleStatus: (sampleId: string, status: Sample['status']) => setSamples((current) => current.map((sample) => sample.id === sampleId ? { ...sample, status } : sample)),
      markNotificationRead: (notificationId: string) => setNotifications((current) => current.map((notification) => notification.id === notificationId ? { ...notification, unread: false } : notification)),
    }),
    [bookings, notifications, patients, reports, samples],
  );

  return <LabDataContext.Provider value={value}>{children}</LabDataContext.Provider>;
}

export function useLabData() {
  const context = useContext(LabDataContext);
  if (!context) throw new Error('useLabData must be used within LabDataProvider');
  return context;
}
