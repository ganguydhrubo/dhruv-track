'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface SheetProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side?: 'left' | 'right';
}

export function Sheet({
  open,
  onOpenChange,
  side = 'right',
  className,
  children,
  ...props
}: SheetProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex" {...props}>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/80 transition-opacity" 
        onClick={() => onOpenChange(false)} 
      />
      {/* Panel */}
      <div
        className={cn(
          "fixed inset-y-0 z-50 flex w-3/4 flex-col border-slate-200 bg-white shadow-lg transition-transform sm:max-w-sm",
          side === 'left' ? "left-0 border-r" : "right-0 border-l",
          className
        )}
      >
        <button
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2"
          onClick={() => onOpenChange(false)}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        {children}
      </div>
    </div>
  );
}

export function SheetContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col h-full overflow-y-auto p-6", className)} {...props}>
      {children}
    </div>
  );
}

export function SheetHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />
  );
}

export function SheetTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 className={cn("text-lg font-semibold text-slate-950", className)} {...props} />
  );
}

export function SheetDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-slate-500", className)} {...props} />
  );
}
