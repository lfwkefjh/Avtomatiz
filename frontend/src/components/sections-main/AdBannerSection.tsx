'use client';

import React from 'react';
import AdBanner from '@/components/ui/AdBanner';

interface AdBannerSectionProps {
  page?: string;
}

export default function AdBannerSection({ page = "home" }: AdBannerSectionProps) {
  return (
    <div className="absolute left-[136px] top-[4706px] w-[1673px] h-[363px]">
      <div className="w-full h-full bg-[#1B1431] border border-[#0184F8] rounded-[44px] overflow-hidden">
        <AdBanner className="w-full h-full" page={page} />
      </div>
    </div>
  );
} 