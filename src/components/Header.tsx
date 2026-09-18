import React, { useState } from 'react';
import { Menu, Search, Phone, ChevronDown, Sparkles } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { MascotSun } from './common/Illustrations';

interface HeaderProps {
  onOpenMobileMenu: () => void;
  onOpenSearch: () => void;
  onOpenConsultation: () => void;
}

interface NavItem {
  title: string;
  basePath: string;
  subItems: { label: string; path: string }[];
}

const NAV_ITEMS: NavItem[] = [
  {
    title: '어린이집 소개',
    basePath: '/intro',
    subItems: [
      { label: '인사말', path: '/intro/greeting' },
      { label: '교육철학', path: '/intro/philosophy' },
      { label: '연혁', path: '/intro/history' },
      { label: '시설현황', path: '/intro/facility' },
      { label: '교직원 소개', path: '/intro/teachers' },
      { label: '오시는길', path: '/intro/location' },
    ],
  },
  {
    title: '교육 프로그램',
    basePath: '/program',
    subItems: [
      { label: '주요 교육과정', path: '/program/curriculum' },
      { label: '특별활동', path: '/program/special' },
      { label: '연간 학사일정', path: '/program/schedule' },
    ],
  },
  {
    title: '알림마당',
    basePath: '/board',
    subItems: [
      { label: '공지사항', path: '/board/notice' },
      { label: '가정통신문(알림장)', path: '/board/newsletter' },
      { label: '어린이집 소식', path: '/board/news' },
    ],
  },
  {
    title: '행사와 일정',
    basePath: '/events',
    subItems: [
      { label: '월간 행사', path: '/events/monthly' },
      { label: '행사 사진첩', path: '/events/gallery' },
      { label: '홍보 영상', path: '/events/media' },
    ],
  },
  {
    title: '급식마당',
    basePath: '/meal',
    subItems: [
      { label: '이달의 식단표', path: '/meal/monthly' },
      { label: '영양 소식지', path: '/meal/nutrition' },
      { label: '급식/간식 사진첩', path: '/meal/photos' },
    ],
  },
];

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileMenu,
  onOpenSearch,
  onOpenConsultation,
}) => {
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-100/70 shadow-xs transition-shadow">
      {/* Top Banner Bar for contact & hours on desktop */}
      <div className="hidden lg:block bg-amber-50/80 border-b border-amber-100/60 py-1 px-6 text-xs text-stone-600">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="inline-flex items-center text-amber-700 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
              2026학년도 원아 상시 상담 중
            </span>
            <span>운영시간: 평일 07:30 ~ 19:30</span>
            <span className="text-stone-400">|</span>
            <span>홍천군 홍천읍 연봉로 11</span>
          </div>
          <div className="flex items-center space-x-3 text-stone-600">
            <a href="tel:033-435-6312" className="hover:text-amber-700 font-medium">
              대표전화: 033-435-6312
            </a>
            <span className="text-stone-300">|</span>
            <button
              onClick={onOpenConsultation}
              className="text-amber-800 font-bold hover:underline cursor-pointer"
            >
              온라인 입소 상담
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          {/* Left: Hamburger menu button */}
          <div className="flex items-center">
            <button
              id="header-hamburger-btn"
              onClick={onOpenMobileMenu}
              className="p-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100/70 text-stone-700 hover:text-amber-800 transition-colors focus:outline-hidden focus:ring-2 focus:ring-amber-400"
              aria-label="전체 메뉴 열기"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center ml-8 space-x-1" aria-label="주 메뉴">
              {NAV_ITEMS.map(nav => {
                const isActive = location.pathname.startsWith(nav.basePath);
                return (
                  <div
                    key={nav.title}
                    className="relative"
                    onMouseEnter={() => setHoveredNav(nav.title)}
                    onMouseLeave={() => setHoveredNav(null)}
                  >
                    <Link
                      to={nav.subItems[0].path}
                      className={`flex items-center px-3.5 py-2 rounded-xl text-[15px] font-bold transition-all ${
                        isActive
                          ? 'text-[#F0935C] bg-orange-50/70'
                          : 'text-stone-700 hover:text-amber-700 hover:bg-amber-50/60'
                      }`}
                    >
                      <span>{nav.title}</span>
                      <ChevronDown className="w-3.5 h-3.5 ml-1 text-stone-400" />
                    </Link>

                    {/* Dropdown Menu */}
                    {hoveredNav === nav.title && (
                      <div className="absolute left-0 top-full pt-1.5 w-48 animate-in fade-in slide-in-from-top-1 duration-150 z-50">
                        <div className="bg-white rounded-2xl shadow-xl border border-amber-100/80 p-2 space-y-1">
                          {nav.subItems.map(sub => (
                            <Link
                              key={sub.path}
                              to={sub.path}
                              className={`block px-3.5 py-2 text-sm rounded-xl font-medium transition-colors ${
                                location.pathname === sub.path
                                  ? 'bg-[#F0935C]/15 text-[#F0935C] font-bold'
                                  : 'text-stone-600 hover:bg-amber-50 hover:text-amber-800'
                              }`}
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Center: Logo and Slogan */}
          <Link
            to="/"
            className="flex items-center space-x-2.5 sm:space-x-3 text-center sm:text-left group"
            aria-label="홍천 예사랑어린이집 홈으로 이동"
          >
            <div className="relative shrink-0 group-hover:scale-105 transition-transform duration-200">
              <MascotSun className="w-10 h-10 sm:w-12 sm:h-12" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] sm:text-xs font-semibold text-[#F0935C] tracking-tight">
                사랑과 신뢰로 꿈을 키우는
              </span>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-stone-900 group-hover:text-amber-600 transition-colors">
                  예사랑어린이집
                </span>
                <span className="hidden sm:inline-block text-[11px] font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full">
                  홍천
                </span>
              </div>
            </div>
          </Link>

          {/* Right: Search & Phone & Consultation Action */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <button
              id="header-search-btn"
              onClick={onOpenSearch}
              className="p-2.5 rounded-2xl text-stone-600 hover:text-amber-800 hover:bg-amber-50 transition-colors focus:outline-hidden focus:ring-2 focus:ring-amber-400"
              aria-label="게시물 및 식단 검색"
              title="검색"
            >
              <Search className="w-5 h-5" />
            </button>

            <a
              id="header-call-btn"
              href="tel:033-435-6312"
              className="p-2.5 rounded-2xl text-[#F0935C] hover:bg-orange-50 transition-colors focus:outline-hidden focus:ring-2 focus:ring-orange-400"
              aria-label="전화 걸기 033-435-6312"
              title="전화 문의"
            >
              <Phone className="w-5 h-5" />
            </a>

            <button
              id="header-consult-cta-btn"
              onClick={onOpenConsultation}
              className="hidden md:flex items-center space-x-1.5 py-2.5 px-4 rounded-2xl bg-gradient-to-r from-[#F5C451] to-[#F0935C] text-stone-900 font-bold text-xs sm:text-sm shadow-xs hover:shadow-md hover:brightness-105 active:scale-95 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-900" />
              <span>입소상담</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
