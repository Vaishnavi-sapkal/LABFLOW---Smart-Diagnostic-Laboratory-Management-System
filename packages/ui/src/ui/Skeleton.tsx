import { cn } from '@labflow/utils/cn';
export function Skeleton({ className }: { className?: string }) { return <div className={cn('animate-pulse rounded-ui bg-slate-200', className)} />; }
