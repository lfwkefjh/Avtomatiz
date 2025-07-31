'use client';

import React from 'react';
import Image from 'next/image';
import { TrustItem } from '@/data/mock/trustData';
import { useLanguage } from '@/context/LanguageContext';
import { glowEffects } from '@/config/glowEffects';

interface TrustCardProps {
  trust: TrustItem;
  dimensions: {
    width: number;
    height: number;
    className: string;
  };
  position: {
    left: number;
    top: number;
  };
  className?: string;
}

export default function TrustCard({ trust, dimensions, position, className = "" }: TrustCardProps) {
  const { currentLocale } = useLanguage();

  return (
    <div 
      className={`group relative cursor-pointer rounded-[40px] overflow-hidden transition-all duration-${glowEffects.trustBlocks.duration} hover:scale-[1.02] hover:shadow-[inset_0_0_20px_1px_rgba(1,132,244,0.4)] hover:z-50 ${className}`}
      style={{
        position: 'absolute',
        left: `${position.left}px`,
        top: `${position.top}px`,
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
        '--glow-blur': `${glowEffects.trustBlocks.blurRadius}px`,
        '--glow-spread': `${glowEffects.trustBlocks.spreadRadius}px`,
        '--glow-color': glowEffects.trustBlocks.color,
        '--glow-opacity': glowEffects.trustBlocks.opacity
      } as React.CSSProperties}
      data-trust-id={trust.id}
    >
      {/* Изображение с фильтрами */}
      <Image
        src={trust.image}
        alt={trust.title[currentLocale as keyof typeof trust.title]}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
        style={{
          opacity: 0.6,
          filter: 'brightness(0.7) contrast(0.4) saturate(0)',
        }}
      />
      
      {/* Цветной overlay */}
      <div 
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          backgroundColor: 'rgba(32, 34, 159, 0.3)'
        }}
      ></div>

      {/* Контент - центрированный текст */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-[20px] text-center">
        <h3 className="text-white text-[30px] font-inter font-bold uppercase leading-tight transition-all duration-300 group-hover:scale-105">
          {trust.title[currentLocale as keyof typeof trust.title]}
        </h3>
      </div>

      {/* Hover glow effect overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20"
           style={{
             boxShadow: `inset 0 0 ${glowEffects.trustBlocks.blurRadius}px ${glowEffects.trustBlocks.spreadRadius}px ${glowEffects.trustBlocks.color}`
           }}>
      </div>
    </div>
  );
} 