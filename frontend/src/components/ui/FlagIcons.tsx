import React from 'react';

interface FlagProps {
  className?: string;
}

export const RussiaFlag: React.FC<FlagProps> = ({ className = "w-6 h-4" }) => (
  <svg className={className} viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
    <rect width="3" height="2" fill="#ffffff"/>
    <rect width="3" height="1.33" y="0.67" fill="#0039A6"/>
    <rect width="3" height="0.67" y="1.33" fill="#D52B1E"/>
  </svg>
);

export const UzbekistanFlag: React.FC<FlagProps> = ({ className = "w-6 h-4" }) => (
  <svg className={className} viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
    {/* Фон */}
    <rect width="3" height="2" fill="#1EB53A"/>
    
    {/* Верхняя синяя полоса */}
    <rect width="3" height="0.5" fill="#0099B5"/>
    
    {/* Белая полоса */}
    <rect width="3" height="0.2" y="0.5" fill="#ffffff"/>
    
    {/* Красная полоса */}
    <rect width="3" height="0.3" y="0.7" fill="#CE1126"/>
    
    {/* Белая полоса */}
    <rect width="3" height="0.2" y="1.0" fill="#ffffff"/>
    
    {/* Нижняя синяя полоса */}
    <rect width="3" height="0.8" y="1.2" fill="#0099B5"/>
    
    {/* Полумесяц */}
    <circle cx="0.4" cy="0.25" r="0.12" fill="#ffffff"/>
    <circle cx="0.45" cy="0.22" r="0.09" fill="#0099B5"/>
    
    {/* 12 звезд */}
    <g fill="#ffffff">
      <polygon points="0.65,0.15 0.67,0.19 0.71,0.19 0.68,0.22 0.69,0.26 0.65,0.23 0.61,0.26 0.62,0.22 0.59,0.19 0.63,0.19" />
      <polygon points="0.85,0.15 0.87,0.19 0.91,0.19 0.88,0.22 0.89,0.26 0.85,0.23 0.81,0.26 0.82,0.22 0.79,0.19 0.83,0.19" />
      <polygon points="1.05,0.15 1.07,0.19 1.11,0.19 1.08,0.22 1.09,0.26 1.05,0.23 1.01,0.26 1.02,0.22 0.99,0.19 1.03,0.19" />
      <polygon points="1.25,0.2 1.27,0.24 1.31,0.24 1.28,0.27 1.29,0.31 1.25,0.28 1.21,0.31 1.22,0.27 1.19,0.24 1.23,0.24" />
      <polygon points="1.45,0.25 1.47,0.29 1.51,0.29 1.48,0.32 1.49,0.36 1.45,0.33 1.41,0.36 1.42,0.32 1.39,0.29 1.43,0.29" />
      <polygon points="1.65,0.3 1.67,0.34 1.71,0.34 1.68,0.37 1.69,0.41 1.65,0.38 1.61,0.41 1.62,0.37 1.59,0.34 1.63,0.34" />
      <polygon points="1.85,0.25 1.87,0.29 1.91,0.29 1.88,0.32 1.89,0.36 1.85,0.33 1.81,0.36 1.82,0.32 1.79,0.29 1.83,0.29" />
      <polygon points="2.05,0.2 2.07,0.24 2.11,0.24 2.08,0.27 2.09,0.31 2.05,0.28 2.01,0.31 2.02,0.27 1.99,0.24 2.03,0.24" />
      <polygon points="2.25,0.15 2.27,0.19 2.31,0.19 2.28,0.22 2.29,0.26 2.25,0.23 2.21,0.26 2.22,0.22 2.19,0.19 2.23,0.19" />
      <polygon points="2.45,0.15 2.47,0.19 2.51,0.19 2.48,0.22 2.49,0.26 2.45,0.23 2.41,0.26 2.42,0.22 2.39,0.19 2.43,0.19" />
      <polygon points="2.65,0.15 2.67,0.19 2.71,0.19 2.68,0.22 2.69,0.26 2.65,0.23 2.61,0.26 2.62,0.22 2.59,0.19 2.63,0.19" />
      <polygon points="2.85,0.15 2.87,0.19 2.91,0.19 2.88,0.22 2.89,0.26 2.85,0.23 2.81,0.26 2.82,0.22 2.79,0.19 2.83,0.19" />
    </g>
  </svg>
);

export const UKFlag: React.FC<FlagProps> = ({ className = "w-6 h-4" }) => (
  <svg className={className} viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
    <rect width="3" height="2" fill="#012169"/>
    {/* Белые диагонали */}
    <polygon points="0,0 0.3,0 3,1.7 3,2 2.7,2 0,0.3" fill="#ffffff"/>
    <polygon points="0,2 0,1.7 2.7,0 3,0 3,0.3 0.3,2" fill="#ffffff"/>
    {/* Красные диагонали */}
    <polygon points="0,0 0.15,0 3,1.85 3,2 2.85,2 0,0.15" fill="#C8102E"/>
    <polygon points="0,2 0,1.85 2.85,0 3,0 3,0.15 0.15,2" fill="#C8102E"/>
    {/* Белый крест */}
    <rect x="1.3" y="0" width="0.4" height="2" fill="#ffffff"/>
    <rect x="0" y="0.8" width="3" height="0.4" fill="#ffffff"/>
    {/* Красный крест */}
    <rect x="1.35" y="0" width="0.3" height="2" fill="#C8102E"/>
    <rect x="0" y="0.85" width="3" height="0.3" fill="#C8102E"/>
  </svg>
); 