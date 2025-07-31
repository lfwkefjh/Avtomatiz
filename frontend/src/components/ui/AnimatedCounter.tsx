'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  label: string;
  delay?: number;
  className?: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ 
  value, 
  label, 
  delay = 0,
  className = "w-[87px] h-[75px]"
}) => {
  return (
    <motion.div 
      className={`${className} bg-[#3F3F3F] rounded-[8px] flex flex-col items-center justify-center overflow-hidden`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{
        scale: 1.05,
        backgroundColor: "#4F4F4F",
        boxShadow: "0 8px 25px -8px rgba(1, 132, 248, 0.3)",
        transition: { duration: 0.3 }
      }}
    >
      <motion.span 
        className="text-white text-[40px] font-franklin"
        key={value}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        {value.toString().padStart(2, '0')}
      </motion.span>
      <span className="text-white text-[12px] font-inter">{label}</span>
    </motion.div>
  );
};

export default AnimatedCounter;