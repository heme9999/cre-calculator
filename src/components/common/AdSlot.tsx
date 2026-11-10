'use client';

import React, { useEffect } from 'react';

interface AdSlotProps {
  slotId?: string;
  className?: string;
  format?: 'auto' | 'horizontal' | 'rectangle';
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export function AdSlot({ slotId = 'default-slot', className = '', format = 'auto' }: AdSlotProps) {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch {
      // Catch adsbygoogle initialization in environments with adblockers
    }
  }, []);

  return (
    <aside
      aria-label="Advertisement"
      data-testid="adsense-ad-container"
      className={`w-full overflow-hidden my-8 text-center ${className}`}
    >
      <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 block mb-1">
        Advertisement
      </span>
      <div className="min-h-[90px] flex items-center justify-center bg-slate-50/80 border border-dashed border-slate-200 rounded-xl p-2">
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', minHeight: '90px' }}
          data-ad-client="ca-pub-5365178989588106"
          data-ad-slot={slotId}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      </div>
    </aside>
  );
}
