'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface GradientButtonProps {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  external?: boolean;
}

const GradientButton: React.FC<GradientButtonProps> = ({ 
  href,
  onClick,
  children,
  className = "",
  variant = 'primary',
  size = 'md',
  disabled = false,
  external = false
}) => {
  const baseClasses = "group relative overflow-hidden rounded-[8px] flex items-center justify-center font-inter font-semibold uppercase transition-all duration-300";
  
  const sizeClasses = {
    sm: "h-[40px] px-4 text-[14px]",
    md: "h-[55px] px-6 text-[18px]",
    lg: "h-[60px] px-8 text-[20px]"
  };

  const variantClasses = {
    primary: "bg-gradient-to-r from-[#0283F7] to-[#850191]",
    secondary: "bg-gradient-to-r from-[#0396FF] to-[#9D05A8]"
  };

  const combinedClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className} ${
    disabled ? 'opacity-50 cursor-not-allowed' : ''
  }`;

  const content = (
    <>
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-[#0396FF] to-[#9D05A8]"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: disabled ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      />
      
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: "-100%" }}
        whileHover={{ x: disabled ? "-100%" : "100%" }}
        transition={{ duration: 0.8 }}
      />
      
      <motion.span 
        className="relative z-10 text-white"
        whileHover={{ 
          scale: disabled ? 1 : 1.05,
          textShadow: disabled ? "none" : "0 0 20px rgba(255, 255, 255, 0.5)"
        }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        {children}
      </motion.span>
    </>
  );

  if (href) {
    if (external) {
      return (
        <motion.a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={combinedClasses}
          whileHover={{ scale: disabled ? 1 : 1.02 }}
          whileTap={{ scale: disabled ? 1 : 0.98 }}
        >
          {content}
        </motion.a>
      );
    }
    
    return (
      <motion.div
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
      >
        <Link href={href} className={combinedClasses}>
          {content}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={combinedClasses}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      {content}
    </motion.button>
  );
};

export default GradientButton;