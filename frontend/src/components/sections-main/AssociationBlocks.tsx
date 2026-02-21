'use client';

import React from 'react';
import { motion } from 'framer-motion';

// Общая обёртка для анимационных блоков
const BlockWrapper = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ duration: 0.5, delay }}
    className="relative rounded-2xl bg-[rgba(35,30,50,0.6)] border border-white/10 p-6 backdrop-blur-sm hover:border-[#0184F4]/30 transition-colors duration-300"
  >
    {children}
  </motion.div>
);

// 1. Объединяет продавцов — люди собираются в центр, образуя сеть
const UniteIcon = () => (
  <svg viewBox="0 0 64 64" className="w-14 h-14">
    <defs>
      <linearGradient id="uniteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0283F7" />
        <stop offset="100%" stopColor="#850191" />
      </linearGradient>
    </defs>
    <motion.circle
      cx="32"
      cy="32"
      r="4"
      fill="url(#uniteGrad)"
      animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    {[
      { x: 12, y: 20 },
      { x: 52, y: 20 },
      { x: 12, y: 44 },
      { x: 52, y: 44 },
    ].map((pos, i) => (
      <React.Fragment key={i}>
        <motion.circle
          cx={pos.x}
          cy={pos.y}
          r="3"
          fill="#0283F7"
          animate={{
            cx: [pos.x, 32 - (32 - pos.x) * 0.3, pos.x],
            cy: [pos.y, 32 - (32 - pos.y) * 0.3, pos.y],
          }}
          transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.2 }}
        />
        <motion.path
          d={`M ${pos.x} ${pos.y} L 32 32`}
          fill="none"
          stroke="url(#uniteGrad)"
          strokeWidth="1"
          strokeOpacity="0.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.15 }}
        />
      </React.Fragment>
    ))}
  </svg>
);

// 2. Мероприятия — календарь с появляющейся датой, люди заполняют зал
const EventsIcon = () => (
  <svg viewBox="0 0 64 64" className="w-14 h-14">
    <defs>
      <linearGradient id="eventsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#850191" />
        <stop offset="100%" stopColor="#0283F7" />
      </linearGradient>
    </defs>
    <rect x="8" y="8" width="48" height="48" rx="6" fill="none" stroke="url(#eventsGrad)" strokeWidth="2" />
    <motion.rect
      x="8"
      y="8"
      width="48"
      height="16"
      rx="6"
      fill="url(#eventsGrad)"
      fillOpacity="0.3"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0.3] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    <motion.rect
      x="22"
      y="28"
      width="8"
      height="8"
      rx="2"
      fill="#850191"
      animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
    {/* Силюты людей в зале */}
    {[34, 42, 50].map((y, i) => (
      <motion.rect
        key={i}
        x={18 + i * 14}
        y={y}
        width="6"
        height="8"
        rx="2"
        fill="#0283F7"
        fillOpacity="0.7"
        animate={{ y: [y + 2, y, y + 2] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
      />
    ))}
  </svg>
);

// 3. Партнёрства — звенья цепи соединяются, рукопожатие
const PartnershipIcon = () => (
  <svg viewBox="0 0 64 64" className="w-14 h-14">
    <defs>
      <linearGradient id="partGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#850191" />
        <stop offset="100%" stopColor="#0283F7" />
      </linearGradient>
    </defs>
    <motion.path
      d="M18 32 L28 24 L38 32 L28 40 Z"
      fill="none"
      stroke="url(#partGrad)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      animate={{ pathLength: [0, 1], opacity: [0.5, 1] }}
      transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
    />
    <motion.path
      d="M26 32 L36 24 L46 32 L36 40 Z"
      fill="none"
      stroke="url(#partGrad)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      animate={{ pathLength: [0, 1], opacity: [0.5, 1] }}
      transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse', delay: 0.3 }}
    />
    <motion.circle
      cx="32"
      cy="32"
      r="4"
      fill="url(#partGrad)"
      animate={{ scale: [1, 1.3, 1] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
  </svg>
);

// 4. Развитие e-commerce — график растёт вверх
const GrowthIcon = () => (
  <svg viewBox="0 0 64 64" className="w-14 h-14">
    <defs>
      <linearGradient id="growthGrad" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#22C55E" stopOpacity="0" />
        <stop offset="100%" stopColor="#22C55E" stopOpacity="0.5" />
      </linearGradient>
    </defs>
    <motion.polyline
      points="12,48 24,36 36,28 48,16 56,8"
      fill="none"
      stroke="#22C55E"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: [0, 1] }}
      transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
    />
    <motion.polygon
      points="12,48 24,36 36,28 48,16 56,8 56,48 12,48"
      fill="url(#growthGrad)"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.6, 0] }}
      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
    />
    <motion.circle
      cx="56"
      cy="8"
      r="4"
      fill="#22C55E"
      animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
      transition={{ duration: 1, repeat: Infinity }}
    />
  </svg>
);

// 5. Начинающим — плюс с пульсацией, стрелка вперёд
const BeginnersIcon = () => (
  <svg viewBox="0 0 64 64" className="w-14 h-14">
    <defs>
      <linearGradient id="begGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0283F7" />
        <stop offset="100%" stopColor="#850191" />
      </linearGradient>
    </defs>
    <motion.g
      animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <rect x="26" y="16" width="12" height="32" rx="2" fill="url(#begGrad)" />
      <rect x="16" y="26" width="32" height="12" rx="2" fill="url(#begGrad)" />
    </motion.g>
    <motion.path
      d="M38 32 L50 32 L50 28 L58 36 L50 44 L50 40 L38 40 Z"
      fill="none"
      stroke="url(#begGrad)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: [0, 1], opacity: [0, 0.8] }}
      transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse', delay: 0.5 }}
    />
  </svg>
);

// 6. Действующим — молния даёт заряд
const ActiveIcon = () => (
  <svg viewBox="0 0 64 64" className="w-14 h-14">
    <defs>
      <linearGradient id="activeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0283F7" />
        <stop offset="100%" stopColor="#850191" />
      </linearGradient>
    </defs>
    <motion.path
      d="M36 8 L20 36 L32 36 L26 56 L48 26 L34 26 Z"
      fill="url(#activeGrad)"
      stroke="url(#activeGrad)"
      strokeWidth="1"
      initial={{ opacity: 0.5 }}
      animate={{
        opacity: [0.6, 1, 0.6],
        filter: ['drop-shadow(0 0 4px #0283F7)', 'drop-shadow(0 0 12px #0283F7)', 'drop-shadow(0 0 4px #0283F7)'],
      }}
      transition={{ duration: 1.2, repeat: Infinity }}
    />
  </svg>
);

// 7. Производителям — коробка движется по конвейеру
const ManufacturersIcon = () => (
  <svg viewBox="0 0 64 64" className="w-14 h-14">
    <defs>
      <linearGradient id="manufGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0283F7" />
        <stop offset="100%" stopColor="#850191" />
      </linearGradient>
    </defs>
    <rect x="8" y="40" width="48" height="8" rx="2" fill="rgba(255,255,255,0.1)" />
    <motion.g animate={{ x: [0, 20, 0] }} transition={{ duration: 3, repeat: Infinity }}>
      <rect x="20" y="24" width="24" height="20" rx="2" fill="none" stroke="url(#manufGrad)" strokeWidth="2" />
      <line x1="20" y1="32" x2="44" y2="32" stroke="url(#manufGrad)" strokeWidth="1" opacity="0.6" />
    </motion.g>
    <motion.circle
      cx="16"
      cy="44"
      r="3"
      fill="url(#manufGrad)"
      animate={{ rotate: 360 }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
    />
    <motion.circle
      cx="48"
      cy="44"
      r="3"
      fill="url(#manufGrad)"
      animate={{ rotate: 360 }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
    />
  </svg>
);

// 8. Сервисным компаниям — инструменты/шестерни
const ServicesIcon = () => (
  <svg viewBox="0 0 64 64" className="w-14 h-14">
    <defs>
      <linearGradient id="servGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0283F7" />
        <stop offset="100%" stopColor="#850191" />
      </linearGradient>
    </defs>
    <motion.g animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}>
      <circle cx="32" cy="32" r="14" fill="none" stroke="url(#servGrad)" strokeWidth="2" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect
          key={i}
          x="30"
          y="14"
          width="4"
          height="8"
          fill="url(#servGrad)"
          transform={`rotate(${i * 60} 32 32)`}
        />
      ))}
    </motion.g>
    <motion.g animate={{ rotate: -360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>
      <circle cx="32" cy="32" r="6" fill="none" stroke="url(#servGrad)" strokeWidth="2" strokeOpacity="0.8" />
    </motion.g>
  </svg>
);

const blocksActivity = [
  {
    icon: UniteIcon,
    text: 'Объединяет продавцов маркетплейсов со всей страны',
  },
  {
    icon: EventsIcon,
    text: 'Проводит профессиональные мероприятия, форумы и конференции',
  },
  {
    icon: PartnershipIcon,
    text: 'Развивает партнёрства между селлерами, производителями и сервисными компаниями',
  },
  {
    icon: GrowthIcon,
    text: 'Способствует развитию электронной коммерции и цифрового предпринимательства',
  },
];

const blocksAudience = [
  { icon: BeginnersIcon, text: 'Начинающим селлерам' },
  { icon: ActiveIcon, text: 'Действующим селлерам' },
  { icon: ManufacturersIcon, text: 'Производителям' },
  { icon: ServicesIcon, text: 'Сервисным компаниям' },
];

export default function AssociationBlocks() {
  return (
    <div className="w-full max-w-[1680px] mx-auto px-4 py-16">
      {/* Секция: Чем занимается */}
      <div className="mb-20">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-white text-[20px] font-inter uppercase mb-2"
        >
          Чем занимается ассоциация селлеров
        </motion.h2>
        <div className="w-16 h-[1px] bg-white mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blocksActivity.map((block, i) => (
            <BlockWrapper key={i} delay={i * 0.1}>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-[73px] h-[73px] rounded-xl bg-[rgba(40,35,55,0.8)] flex items-center justify-center">
                  <block.icon />
                </div>
                <p className="text-white/90 text-[18px] leading-relaxed font-inter">{block.text}</p>
              </div>
            </BlockWrapper>
          ))}
        </div>
      </div>

      {/* Секция: Для кого создана */}
      <div>
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-white text-[20px] font-inter uppercase mb-2"
        >
          Для кого создана ассоциация
        </motion.h2>
        <div className="w-16 h-[1px] bg-white mb-6" />
        <p className="text-white/70 text-[18px] mb-8 font-inter">Ассоциация будет полезна:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {blocksAudience.map((block, i) => (
            <BlockWrapper key={i} delay={i * 0.1}>
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-[73px] h-[73px] rounded-xl bg-[rgba(40,35,55,0.8)] flex items-center justify-center mx-auto">
                  <block.icon />
                </div>
                <p className="text-white/90 text-[18px] font-inter font-medium">{block.text}</p>
              </div>
            </BlockWrapper>
          ))}
        </div>
      </div>
    </div>
  );
}
