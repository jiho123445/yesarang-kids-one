import React, { useState } from 'react';
import { X, ChevronDown, Phone, MapPin, Sparkles, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MascotSun } from './common/Illustrations';

interface MobileNavModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenConsultation?: () => void;
}

interface NavSection {
  id: string;
  title: string;
  iconColor: string;
  items: { label: string; path: string }[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    id: 'intro',
    title: '어린이집 소개',
    iconColor: 'bg-amber-400',
    items: [
      { label: '인사말', path: '/intro/greeting' },
      { label: '교육철학', path: '/intro/philosophy' },
      { label: '연혁', path: '/intro/history' },
      { label: '시설현황', path: '/intro/facility' },
      { label: '교직원 소개', path: '/intro/teachers' },
      { label: '오시는길', path: '/intro/location' },
    ],
  },
  {
    id: 'program',
    title: '교육 프로그램',
    iconColor: 'bg-[#F0935C]',
    items: [
      { label: '주요 교육과정', path: '/program/curriculum' },
      { label: '특별활동', path: '/program/special' },
      { label: '연간 학사일정', path: '/program/schedule' },
    ],
  },
  {
    id: 'board',
    title: '알림마당',
    iconColor: 'bg-emerald-400',
    items: [
      { label: '공지사항', path: '/board/notice' },
      { label: '가정통신문(알림장)', path: '/board/newsletter' },
      { label: '어린이집 소식', path: '/board/news' },
    ],
  },
  {
    id: 'events',
    title: '행사와 일정',
    iconColor: 'bg-violet-400',
    items: [
      { label: '월간 행사', path: '/events/monthly' },
      { label: '행사 사진첩', path: '/events/gallery' },
      { label: '홍보 영상', path: '/events/media' },
    ],
  },
  {
    id: 'meal',
    title: '급식마당',
    iconColor: 'bg-rose-400',
    items: [
      { label: '이달의 식단표', path: '/meal/monthly' },
      { label: '영양 소식지', path: '/meal/nutrition' },
      { label: '급식/간식 사진첩', path: '/meal/photos' },
    ],
  },
];

export const MobileNavModal: React.FC<MobileNavModalProps> = ({
  isOpen,
  onClose,
  onOpenConsultation,
}) => {
  const [openSection, setOpenSection] = useState<string | null>('intro');

  if (!isOpen) return null;

  const toggleSection = (id: string) => {
    setOpenSection(prev => (prev === id ? null : id));
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#0F172A]/95 backdrop-blur-md flex flex-col text-white transition-opacity animate-in fade-in duration-200"
      aria-label="전체 모바일 메뉴"
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <MascotSun className="w-10 h-10" />
          <div>
            <span className="text-xs text-amber-400 font-bold block">사랑과 믿음의 배움터</span>
            <span className="text-lg font-black tracking-tight text-white">홍천 예사랑어린이집</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
          aria-label="메뉴 닫기"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Accordion Menu Container */}
      <div className="flex-1 overflow-y-auto px-5 py-4 divide-y divide-slate-800/60">
        {NAV_SECTIONS.map(section => {
          const isExpanded = openSection === section.id;
          return (
            <div key={section.id} className="py-2">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between py-3.5 px-3 rounded-xl hover:bg-slate-800/50 text-left transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className={`w-2.5 h-2.5 rounded-full ${section.iconColor}`} />
                  <span className="text-base font-bold text-slate-100">{section.title}</span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                    isExpanded ? 'rotate-180 text-amber-400' : ''
                  }`}
                />
              </button>

              {/* Sub items */}
              {isExpanded && (
                <div className="pl-8 pr-3 pb-3 pt-1 grid grid-cols-1 gap-1.5 animate-in slide-in-from-top-2 duration-150">
                  {section.items.map(subItem => (
                    <Link
                      key={subItem.path}
                      to={subItem.path}
                      onClick={onClose}
                      className="flex items-center py-2.5 px-3 rounded-lg text-sm text-slate-300 hover:text-amber-300 hover:bg-slate-800/80 transition-colors"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mr-2.5" />
                      {subItem.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Action Footer in Modal */}
      <div className="p-5 bg-slate-900 border-t border-slate-800 space-y-3">
        <div className="flex gap-2">
          <button
            onClick={() => {
              onClose();
              if (onOpenConsultation) onOpenConsultation();
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#F5C451] to-[#F0935C] text-stone-900 font-bold text-sm shadow-md flex items-center justify-center space-x-1.5 hover:brightness-105 active:scale-[0.98] transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-900" />
            <span>입소 및 상담 신청</span>
          </button>
          <a
            href="tel:033-435-6312"
            className="py-3 px-4 rounded-xl bg-slate-800 text-white font-semibold text-sm flex items-center justify-center space-x-1 hover:bg-slate-700 transition-colors"
          >
            <Phone className="w-4 h-4 text-amber-400 mr-1" />
            <span>전화상담</span>
          </a>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 px-1 pt-1">
          <span className="flex items-center">
            <MapPin className="w-3.5 h-3.5 text-slate-500 mr-1 shrink-0" />
            홍천읍 연봉로 11
          </span>
          <span>원장 김희정</span>
        </div>
      </div>
    </div>
  );
};
