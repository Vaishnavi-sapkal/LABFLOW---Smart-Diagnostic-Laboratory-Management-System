import type { InputHTMLAttributes } from 'react';

export function Checkbox(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className="h-4 w-4 rounded border-border text-brand-600 focus:ring-brand-600" type="checkbox" {...props} />;
}
