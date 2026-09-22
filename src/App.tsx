import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { MobileNavModal } from './components/MobileNavModal';
import { ConsultationModal } from './components/ConsultationModal';
import { PostDetailModal } from './components/PostDetailModal';
import { HomePage } from './pages/HomePage';
import { IntroPage } from './pages/IntroPage';
import { ProgramPage } from './pages/ProgramPage';
import { BoardPage } from './pages/BoardPage';
import { EventsPage } from './pages/EventsPage';
import { MealPage } from './pages/MealPage';
import { MaintenancePage } from './pages/MaintenancePage';

// Admin CMS Components
import { DataProvider, useData } from './context/DataContext';
import { AdminToolbar } from './components/admin/AdminToolbar';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminDashboardModal } from './components/admin/AdminDashboardModal';

// Types
import {
  NoticeItem,
  NewsletterItem,
  MealItem,
  GalleryItem,
  CalendarEvent,
  PartnerOrg,
} from './types';

// Mock Data Files
import partnersData from './data/partners.json';
import { recordVisitIfNeeded } from './utils/visitorStats';

// Modal and UI icons
import { X, Heart, Calendar as CalendarIcon } from 'lucide-react';

// Scroll to top upon route navigation
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
};

// Internal App Content connected to DataContext
const AppContent: React.FC = () => {
  const { notices, newsletters, meals, gallery, events, likeGalleryItem, maintenance, isAdmin } = useData();
  // 공사중 모드: 관리자로 로그인하지 않은 일반 방문자에게만 공사중 화면을 보여줍니다.
  // 헤더/푸터의 "관리자" 버튼은 이 화면에서도 그대로 노출되므로 로그인 후 정상 화면으로 전환됩니다.
  const showMaintenancePage = maintenance.enabled && !isAdmin;
  const [partners] = useState<PartnerOrg[]>(partnersData as PartnerOrg[]);

  // Modal states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

  // Post detail modal state
  const [selectedPost, setSelectedPost] = useState<NoticeItem | NewsletterItem | null>(null);
  const [postModalType, setPostModalType] = useState<'notice' | 'newsletter'>('notice');

  // Gallery image preview modal state
  const [selectedGalleryItem, setSelectedGalleryItem] = useState<GalleryItem | null>(null);

  // 방문자 통계 집계 — 앱이 처음 로드될 때 한 번만 시도 (하루 1회로 중복 방지됨)
  useEffect(() => {
    recordVisitIfNeeded();
  }, []);

  const handleSelectNotice = (item: NoticeItem) => {
    setSelectedPost(item);
    setPostModalType('notice');
  };

  const handleSelectNewsletter = (item: NewsletterItem) => {
    setSelectedPost(item);
    setPostModalType('newsletter');
  };

  const handleSelectGalleryItem = (item: GalleryItem) => {
    setSelectedGalleryItem(item);
  };

  const handleLikeGallery = (id: string) => {
    likeGalleryItem(id);
    if (selectedGalleryItem && selectedGalleryItem.id === id) {
      setSelectedGalleryItem(prev => (prev ? { ...prev, likeCount: prev.likeCount + 1 } : null));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-stone-900 selection:bg-amber-200 selection:text-amber-900">
      {/* 1. Admin Top Toolbar (visible when isAdmin === true) */}
      <AdminToolbar />

      {/* 2. Sticky Header with Navigation, Search, Consultation Call */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenMobileMenu={() => setIsMobileNavOpen(true)}
        onOpenConsultation={() => setIsConsultationOpen(true)}
      />

      {/* 3. Main Content Area */}
      <main className="flex-1">
        {showMaintenancePage ? (
          <MaintenancePage />
        ) : (
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                notices={notices}
                newsletters={newsletters}
                meals={meals}
                gallery={gallery}
                events={events}
                partners={partners}
                onSelectNotice={handleSelectNotice}
                onSelectNewsletter={handleSelectNewsletter}
                onSelectGalleryItem={handleSelectGalleryItem}
                onOpenConsultation={() => setIsConsultationOpen(true)}
              />
            }
          />

          {/* 어린이집 소개 */}
          <Route path="/intro" element={<Navigate to="/intro/greeting" replace />} />
          <Route path="/intro/:subtab" element={<IntroPage />} />

          {/* 교육 프로그램 */}
          <Route path="/program" element={<Navigate to="/program/curriculum" replace />} />
          <Route path="/program/:subtab" element={<ProgramPage />} />

          {/* 알림마당 */}
          <Route path="/board" element={<Navigate to="/board/notice" replace />} />
          <Route
            path="/board/:subtab"
            element={
              <BoardPage
                notices={notices}
                newsletters={newsletters}
                onSelectNotice={handleSelectNotice}
                onSelectNewsletter={handleSelectNewsletter}
              />
            }
          />

          {/* 행사와 일정 */}
          <Route path="/events" element={<Navigate to="/events/monthly" replace />} />
          <Route
            path="/events/:subtab"
            element={
              <EventsPage
                events={events}
                gallery={gallery}
                onSelectGalleryItem={handleSelectGalleryItem}
              />
            }
          />

          {/* 급식마당 */}
          <Route path="/meal" element={<Navigate to="/meal/monthly" replace />} />
          <Route path="/meal/:subtab" element={<MealPage meals={meals} gallery={gallery} />} />

          {/* Fallback to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        )}
      </main>

      {/* 4. Footer with policies, contact, and visitor statistics */}
      <Footer />

      {/* 5. Admin Authentication & Dashboard Modals */}
      <AdminLoginModal />
      <AdminDashboardModal />

      {/* 6. Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        notices={notices}
        newsletters={newsletters}
        meals={meals}
        gallery={gallery}
        onSelectNotice={handleSelectNotice}
        onSelectNewsletter={handleSelectNewsletter}
      />

      {/* 7. Mobile Full-Screen Navigation Modal */}
      <MobileNavModal
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        onOpenConsultation={() => {
          setIsMobileNavOpen(false);
          setIsConsultationOpen(true);
        }}
      />

      {/* 8. Admissions Consultation Request Modal */}
      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
      />

      {/* 9. Post Detail Modal (Notice or Newsletter) */}
      <PostDetailModal
        item={selectedPost}
        type={postModalType}
        onClose={() => setSelectedPost(null)}
      />

      {/* 10. Gallery Image Lightbox Modal */}
      {selectedGalleryItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-xs"
          onClick={() => setSelectedGalleryItem(null)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-stone-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative aspect-4/3 bg-black">
              <img
                src={selectedGalleryItem.imageUrl}
                alt={selectedGalleryItem.title}
                className="w-full h-full object-contain"
              />
              <button
                onClick={() => setSelectedGalleryItem(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors cursor-pointer"
                aria-label="닫기"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center space-x-2 text-xs font-semibold text-stone-500">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                    {selectedGalleryItem.category}
                  </span>
                  {selectedGalleryItem.targetClass && (
                    <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                      {selectedGalleryItem.targetClass}
                    </span>
                  )}
                  <span className="flex items-center">
                    <CalendarIcon className="w-3.5 h-3.5 mr-1" />
                    {selectedGalleryItem.date}
                  </span>
                </div>

                <button
                  onClick={() => handleLikeGallery(selectedGalleryItem.id)}
                  className="inline-flex items-center px-3 py-1 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors text-xs font-bold cursor-pointer active:scale-95"
                >
                  <Heart className="w-3.5 h-3.5 fill-rose-500 mr-1" />
                  <span>좋아요 {selectedGalleryItem.likeCount}</span>
                </button>
              </div>

              <h3 className="text-lg font-black text-stone-900 mb-2">
                {selectedGalleryItem.title}
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                {selectedGalleryItem.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <DataProvider>
        <ScrollToTop />
        <AppContent />
      </DataProvider>
    </BrowserRouter>
  );
}
