import React from 'react';
import {
  Bell,
  Mail,
  Image,
  Utensils,
  Calendar,
  Building,
  Settings,
  X,
  ShieldCheck,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { AdminTab } from '../../types';
import { NoticesTab } from './tabs/NoticesTab';
import { NewslettersTab } from './tabs/NewslettersTab';
import { GalleryTab } from './tabs/GalleryTab';
import { MealsTab } from './tabs/MealsTab';
import { EventsTab } from './tabs/EventsTab';
import { IntroTab } from './tabs/IntroTab';
import { SettingsTab } from './tabs/SettingsTab';

interface TabItem {
  id: AdminTab;
  label: string;
  badgeCount?: number;
  icon: React.ComponentType<{ className?: string }>;
}

export const AdminDashboardModal: React.FC = () => {
  const {
    isAdminDashboardOpen,
    setIsAdminDashboardOpen,
    activeAdminTab,
    setActiveAdminTab,
    logout,
    notices,
    newsletters,
    gallery,
    meals,
    nutritionNewsletters,
    events,
  } = useData();

  if (!isAdminDashboardOpen) return null;

  const tabs: TabItem[] = [
    { id: 'notices', label: '공지사항 관리', icon: Bell, badgeCount: notices.length },
    { id: 'newsletters', label: '가정통신문 관리', icon: Mail, badgeCount: newsletters.length },
    { id: 'gallery', label: '갤러리 관리', icon: Image, badgeCount: gallery.length },
    { id: 'meals', label: '식단·영양 관리', icon: Utensils, badgeCount: meals.length + (nutritionNewsletters ? nutritionNewsletters.length : 0) },
    { id: 'events', label: '행사일정 관리', icon: Calendar, badgeCount: events.length },
    { id: 'intro', label: '원 소개 및 정보', icon: Building },
    { id: 'settings', label: '설정 및 보안', icon: Settings },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-stone-950/80 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={() => setIsAdminDashboardOpen(false)}
    >
      <div
        className="w-full max-w-7xl h-[94vh] bg-stone-50 rounded-3xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-stone-900 text-white px-5 sm:px-8 py-3.5 flex items-center justify-between border-b border-stone-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-400 text-stone-950 flex items-center justify-center font-black shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                  예사랑어린이집 CMS 통합 관리자센터
                </h2>
                <span className="hidden md:inline px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold border border-amber-400/30">
                  원장/교직원 인증됨
                </span>
              </div>
              <p className="text-[11px] text-stone-400 hidden sm:block">
                웹사이트의 모든 게시판, 식단, 갤러리 및 기본 정보를 실시간으로 수정·발행할 수 있습니다.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsAdminDashboardOpen(false)}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
              <span className="hidden sm:inline">사이트 보기</span>
            </button>

            <button
              onClick={() => {
                logout();
                setIsAdminDashboardOpen(false);
              }}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-rose-900/60 text-stone-300 hover:text-rose-200 text-xs font-bold transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">로그아웃</span>
            </button>

            <button
              onClick={() => setIsAdminDashboardOpen(false)}
              className="p-1.5 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors ml-1 cursor-pointer"
              aria-label="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Layout (Sidebar + Main View) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Navigation Sidebar / Horizontal bar on mobile */}
          <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-stone-200 p-3 sm:p-4 shrink-0 overflow-x-auto md:overflow-y-auto scrollbar-none">
            <div className="text-[11px] font-black text-stone-400 uppercase tracking-wider px-3 mb-2 hidden md:block">
              콘텐츠 관리 메뉴
            </div>

            <nav className="flex md:flex-col flex-nowrap space-x-1 md:space-x-0 md:space-y-1">
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeAdminTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveAdminTab(tab.id)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-amber-100 text-amber-900 shadow-2xs font-black'
                        : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon
                        className={`w-4 h-4 ${
                          isActive ? 'text-amber-700' : 'text-stone-400'
                        }`}
                      />
                      <span>{tab.label}</span>
                    </div>
                    {tab.badgeCount !== undefined && (
                      <span
                        className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isActive
                            ? 'bg-amber-200 text-amber-900'
                            : 'bg-stone-100 text-stone-500'
                        }`}
                      >
                        {tab.badgeCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Tab Main Container */}
          <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto bg-stone-50/50">
            <div className="max-w-5xl mx-auto">
              {activeAdminTab === 'notices' && <NoticesTab />}
              {activeAdminTab === 'newsletters' && <NewslettersTab />}
              {activeAdminTab === 'gallery' && <GalleryTab />}
              {activeAdminTab === 'meals' && <MealsTab />}
              {activeAdminTab === 'events' && <EventsTab />}
              {activeAdminTab === 'intro' && <IntroTab />}
              {activeAdminTab === 'settings' && <SettingsTab />}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
