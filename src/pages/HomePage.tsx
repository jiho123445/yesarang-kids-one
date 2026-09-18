import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { BannerSlider } from '../components/BannerSlider';
import { QuickLinks } from '../components/QuickLinks';
import { NoticeWidget } from '../components/NoticeWidget';
import { NewsletterWidget } from '../components/NewsletterWidget';
import { MonthlyCalendarWidget } from '../components/MonthlyCalendarWidget';
import { TodayMealWidget } from '../components/TodayMealWidget';
import { GalleryWidget } from '../components/GalleryWidget';
import { PartnerBanners } from '../components/PartnerBanners';
import { NoticeItem, NewsletterItem, MealItem, GalleryItem, CalendarEvent, PartnerOrg } from '../types';
import { Sparkles, Phone, ShieldCheck, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HomePageProps {
  notices: NoticeItem[];
  newsletters: NewsletterItem[];
  meals: MealItem[];
  gallery: GalleryItem[];
  events: CalendarEvent[];
  partners: PartnerOrg[];
  onSelectNotice: (notice: NoticeItem) => void;
  onSelectNewsletter: (newsletter: NewsletterItem) => void;
  onSelectGalleryItem: (item: GalleryItem) => void;
  onOpenConsultation: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  notices,
  newsletters,
  meals,
  gallery,
  events,
  partners,
  onSelectNotice,
  onSelectNewsletter,
  onSelectGalleryItem,
  onOpenConsultation,
}) => {
  const todayMeal = meals.length > 0 ? meals[0] : null;

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <HeroSection onOpenConsultation={onOpenConsultation} />

      {/* 2. Notice / Event Banner Slider */}
      <BannerSlider />

      {/* 3. 4 Quick Links */}
      <QuickLinks />

      {/* 4. Main Dashboard Widgets Grid */}
      <section className="py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Row 1: Notices, Newsletters, and Monthly Calendar (Desktop 3 cols) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* 5. 공지사항 위젯 */}
          <div className="h-full">
            <NoticeWidget notices={notices} onSelectNotice={onSelectNotice} />
          </div>

          {/* 6. 가정통신문(알림장) 위젯 */}
          <div className="h-full">
            <NewsletterWidget newsletters={newsletters} onSelectNewsletter={onSelectNewsletter} />
          </div>

          {/* 7. 이달의 행사 달력 위젯 */}
          <div className="h-full md:col-span-2 lg:col-span-1">
            <MonthlyCalendarWidget events={events} />
          </div>
        </div>

        {/* Row 2: Today's Meal + Admissions Quick Card (Desktop 2 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 8. 오늘의 식단 위젯 (7 cols) */}
          <div className="lg:col-span-7">
            <TodayMealWidget meal={todayMeal} />
          </div>

          {/* Special Admissions & Parent Center Banner (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-amber-50 via-orange-50/50 to-amber-100/60 rounded-3xl p-6 border border-amber-200/80 shadow-md flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white text-[#F0935C] text-xs font-bold shadow-2xs mb-3">
                <Heart className="w-3.5 h-3.5 fill-[#F0935C]" />
                <span>열린 어린이집 · 상시 상담</span>
              </div>
              <h3 className="text-xl font-black text-stone-900 tracking-tight mb-2">
                "사랑으로 자라는 우리 아이,<br />
                <span className="text-[#F0935C]">예사랑</span>과 함께 시작하세요"
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                홍천 연봉리에 위치한 예사랑어린이집은 자연과 호흡하는 숲놀이와 정성 가득한 유기농 식단으로 아이들의 건강하고 밝은 성장을 돕습니다.
              </p>

              <div className="mt-4 space-y-2 text-xs text-stone-700 font-medium">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>맞춤형 기본/연장보육 및 영아 안심 돌봄</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>연봉산 유아 숲체험원 주 1회 정기 프로그램</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-amber-200/60 flex flex-col sm:flex-row gap-2.5">
              <button
                onClick={onOpenConsultation}
                className="flex-1 py-3 px-4 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm shadow-sm flex items-center justify-center space-x-1.5 active:scale-95 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>입소상담 신청하기</span>
              </button>

              <a
                href="tel:033-435-6312"
                className="py-3 px-4 rounded-2xl bg-white hover:bg-amber-50 text-stone-800 font-bold text-xs sm:text-sm border border-stone-200 shadow-2xs flex items-center justify-center space-x-1.5 transition-all"
              >
                <Phone className="w-4 h-4 text-[#F0935C]" />
                <span>033-435-6312</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 9. 갤러리(급식/활동 사진 3열 카드) */}
      <GalleryWidget gallery={gallery} onSelectGalleryItem={onSelectGalleryItem} />

      {/* 10. 협력기관/파트너 배너 캐러셀 */}
      <PartnerBanners partners={partners} />
    </div>
  );
};
