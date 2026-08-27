import type { ReactNode } from 'react';

export function PageContainer({ children }: { children: ReactNode }) {
  return <main className="mx-auto w-full max-w-[1204px] px-4 py-6 lg:px-6 lg:py-8">{children}</main>;
}
