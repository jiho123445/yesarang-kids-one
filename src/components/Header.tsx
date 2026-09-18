import React, { useState } from 'react';
import { Menu, Search, Phone, ChevronDown, Sparkles, Lock, ShieldCheck } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { MascotSun } from './common/Illustrations';
import { useData } from '../context/DataContext';

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
  const { institution, isAdmin, setIsPasswordModalOpen, setIsAdminDashboardOpen } = useData();

  const handleAdminClick = () => {
    if (isAdmin) {
      setIsAdminDashboardOpen(true);
    } else {
      setIsPasswordModalOpen(true);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-100/80 shadow-xs transition-shadow">
      {/* Unified Single-Line Header Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4 flex-nowrap">
          {/* Left: Hamburger & Logo */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            <button
              id="header-hamburger-btn"
              onClick={onOpenMobileMenu}
              className="p-2 sm:p-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100/80 text-stone-700 hover:text-amber-800 transition-colors focus:outline-hidden focus:ring-2 focus:ring-amber-400 cursor-pointer"
              aria-label="전체 메뉴 열기"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <Link
              to="/"
              className="flex items-center space-x-2 sm:space-x-2.5 group"
              aria-label={`${institution.name} 홈으로 이동`}
            >
              <div className="relative shrink-0 group-hover:scale-105 transition-transform duration-200">
                <MascotSun className="w-8 h-8 sm:w-11 sm:h-11" />
              </div>
              <div className="flex flex-col">
                <span className="hidden sm:block text-[10px] font-semibold text-[#F0935C] tracking-tight leading-tight">
                  {institution.slogan}
                </span>
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-lg sm:text-2xl font-black tracking-tight text-stone-900 group-hover:text-amber-600 transition-colors whitespace-nowrap">
                    {institution.shortName || institution.name}
                  </span>
                  <span className="hidden xl:inline-block text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-md leading-none">
                    홍천
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Center: Desktop Navigation Tabs (Strictly 1 Single Line) */}
          <nav
            className="hidden lg:flex items-center space-x-1 xl:space-x-2 shrink-0 flex-nowrap"
            aria-label="주 메뉴"
          >
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
                    className={`flex items-center px-3 py-2 rounded-xl text-sm xl:text-[15px] font-bold transition-all whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'text-[#F0935C] bg-orange-50 font-black'
                        : 'text-stone-700 hover:text-amber-800 hover:bg-amber-50/70'
                    }`}
                  >
                    <span>{nav.title}</span>
                    <ChevronDown className="w-3.5 h-3.5 ml-1 text-stone-400" />
                  </Link>

                  {/* Dropdown Menu */}
                  {hoveredNav === nav.title && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 w-44 animate-in fade-in slide-in-from-top-1 duration-150 z-50">
                      <div className="bg-white rounded-2xl shadow-xl border border-amber-100/90 p-2 space-y-1">
                        {nav.subItems.map(sub => (
                          <Link
                            key={sub.path}
                            to={sub.path}
                            className={`block px-3.5 py-2 text-xs xl:text-sm rounded-xl font-medium transition-colors whitespace-nowrap ${
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

          {/* Right: Actions (Search, Phone, Consultation, Admin) strictly on 1 Line */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0 flex-nowrap">
            <button
              id="header-search-btn"
              onClick={onOpenSearch}
              className="p-2 sm:p-2.5 rounded-2xl text-stone-600 hover:text-amber-800 hover:bg-amber-50 transition-colors focus:outline-hidden focus:ring-2 focus:ring-amber-400 cursor-pointer"
              aria-label="게시물 및 식단 검색"
              title="검색"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <a
              id="header-call-btn"
              href={`tel:${institution.phone}`}
              className="p-2 sm:p-2.5 rounded-2xl text-[#F0935C] hover:bg-orange-50 transition-colors focus:outline-hidden focus:ring-2 focus:ring-orange-400"
              aria-label={`전화 문의: ${institution.phone}`}
              title={`문의 전화: ${institution.phone}`}
            >
              <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>

            <button
              id="header-consult-cta-btn"
              onClick={onOpenConsultation}
              className="hidden sm:inline-flex items-center space-x-1.5 py-2 px-3 sm:px-4 rounded-2xl bg-gradient-to-r from-[#F5C451] to-[#F0935C] text-stone-900 font-bold text-xs sm:text-sm shadow-2xs hover:shadow-xs hover:brightness-105 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-900" />
              <span>입소상담</span>
            </button>

            {/* Admin Login/Dashboard trigger button */}
            <button
              onClick={handleAdminClick}
              className={`inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                isAdmin
                  ? 'bg-amber-200 text-amber-900 hover:bg-amber-300'
                  : 'text-stone-500 hover:text-stone-800 hover:bg-stone-100 border border-stone-200/80'
              }`}
              title={isAdmin ? '관리자 대시보드' : '원장/교직원 관리자 로그인'}
            >
              {isAdmin ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                  <span className="hidden md:inline">관리자 모드</span>
                  <span className="md:hidden">CMS</span>
                </>
              ) : (
                <>
                  <Lock className="w-3 h-3 text-stone-400" />
                  <span>관리자</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
