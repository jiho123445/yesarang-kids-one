import React from 'react';
import { Link } from 'react-router-dom';
import { IconCuteBook, IconCuteClock, IconCuteMeal, MascotSun, MascotSprout } from './common/Illustrations';
import { ArrowRight, Heart, Calendar, FileText, Utensils } from 'lucide-react';

interface QuickLinkItem {
  id: string;
  title: string;
  subtitle: string;
  path: string;
  badge: string;
  bgColor: string;
  borderColor: string;
  icon: React.ReactNode;
}

const QUICK_LINKS: QuickLinkItem[] = [
  {
    id: 'intro',
    title: '어린이집 소개',
    subtitle: '원장인사말 & 교육철학',
    path: '/intro/greeting',
    badge: 'ABOUT US',
    bgColor: 'bg-amber-50 hover:bg-amber-100/80',
    borderColor: 'border-amber-200',
    icon: <MascotSun className="w-12 h-12" />,
  },
  {
    id: 'events',
    title: '이달의 행사',
    subtitle: '학사일정 & 숲체험 일정',
    path: '/events/monthly',
    badge: 'CALENDAR',
    bgColor: 'bg-orange-50 hover:bg-orange-100/80',
    borderColor: 'border-orange-200',
    icon: <IconCuteClock className="w-12 h-12" />,
  },
  {
    id: 'newsletter',
    title: '알림장 · 통신문',
    subtitle: '가정통신문 & 주간소식',
    path: '/board/newsletter',
    badge: 'NOTICE',
    bgColor: 'bg-teal-50 hover:bg-teal-100/80',
    borderColor: 'border-teal-200',
    icon: <IconCuteBook className="w-12 h-12" />,
  },
  {
    id: 'meal',
    title: '오늘의 식단표',
    subtitle: '친환경 영양 급식식단',
    path: '/meal/monthly',
    badge: 'NUTRITION',
    bgColor: 'bg-rose-50 hover:bg-rose-100/80',
    borderColor: 'border-rose-200',
    icon: <IconCuteMeal className="w-12 h-12" />,
  },
];

export const QuickLinks: React.FC = () => {
  return (
    <section className="py-10 sm:py-14 bg-gradient-to-b from-amber-100/60 via-amber-50/40 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section title */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white text-amber-800 text-xs font-extrabold shadow-2xs border border-amber-200 mb-2">
            <MascotSprout className="w-4 h-4 inline-block" />
            <span>자주 찾는 주요 서비스 바로가기</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            예사랑 퀵 서비스
          </h2>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {QUICK_LINKS.map(item => (
            <Link
              key={item.id}
              to={item.path}
              className={`group relative p-5 sm:p-6 rounded-3xl ${item.bgColor} border ${item.borderColor} shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-1 flex flex-col items-center text-center`}
            >
              {/* Badge */}
              <span className="absolute top-4 right-4 text-[10px] font-black tracking-wider text-stone-400 group-hover:text-stone-700 transition-colors">
                {item.badge}
              </span>

              {/* Icon in circular wrapper */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white shadow-xs flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200 border border-white/60">
                {item.icon}
              </div>

              {/* Title & Subtitle */}
              <h3 className="text-base sm:text-lg font-black text-stone-900 group-hover:text-[#F0935C] transition-colors mb-1">
                {item.title}
              </h3>
              <p className="text-xs text-stone-500 font-medium">
                {item.subtitle}
              </p>

              {/* Little cute arrow badge */}
              <div className="mt-4 inline-flex items-center text-xs font-bold text-[#F0935C] group-hover:translate-x-0.5 transition-transform">
                <span>자세히 보기</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
