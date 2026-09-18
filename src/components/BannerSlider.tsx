import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play, Bell, Calendar, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BannerSlide {
  id: string;
  tag: string;
  tagColor: string;
  title: string;
  subtitle: string;
  date: string;
  link: string;
  badge: string;
}

const SLIDES: BannerSlide[] = [
  {
    id: 'b-01',
    tag: '신학기 안내',
    tagColor: 'bg-[#F0935C] text-white',
    title: '2026학년도 신입 및 재원 원아 오리엔테이션 준비 안내',
    subtitle: '개인 준비물(낮잠이불, 양치세트) 및 등하원 차량 노선표를 확인해주세요.',
    date: '2026.03.23(월) 10:30',
    link: '/board/notice',
    badge: '필독공지',
  },
  {
    id: 'b-02',
    tag: '학부모 참여',
    tagColor: 'bg-emerald-500 text-white',
    title: '상반기 열린어린이집 학부모 급식 모니터링단 신청 접수',
    subtitle: '아이들의 건강한 먹거리 조리 과정과 급식 배식을 직접 참관하실 수 있습니다.',
    date: '신청마감: 03.27까지',
    link: '/board/notice',
    badge: '모집중',
  },
  {
    id: 'b-03',
    tag: '생태 체험',
    tagColor: 'bg-teal-600 text-white',
    title: '연봉산 유아 숲체험원 봄나들이 및 꼬마 텃밭 가꾸기',
    subtitle: '자연의 신비로움을 오감으로 느끼는 생태 놀이 프로그램이 시작됩니다.',
    date: '2026.04.14(화) 예정',
    link: '/events/monthly',
    badge: '체험학습',
  },
  {
    id: 'b-04',
    tag: '가정통신문',
    tagColor: 'bg-violet-600 text-white',
    title: '영유아 건강검진 및 구강검진 결과표 제출 요청',
    subtitle: '정기 검진 차수에 맞추어 결과서를 원무실 또는 키즈노트로 제출해주세요.',
    date: '제출기한: 03.31(화)',
    link: '/board/newsletter',
    badge: '안내',
  },
];

export const BannerSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const handlePrev = () => {
    setCurrentIndex(prev => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % SLIDES.length);
  };

  const togglePlay = () => {
    setIsPlaying(prev => !prev);
  };

  const currentSlide = SLIDES[currentIndex];

  return (
    <div className="relative -mt-10 sm:-mt-12 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-amber-200/90 p-4 sm:p-5 transition-all">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left badge & slide content */}
          <div className="flex items-center space-x-3 sm:space-x-4 w-full md:w-auto flex-1">
            <div className="shrink-0 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-100/80 text-amber-700">
              <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-[#F0935C]" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${currentSlide.tagColor}`}>
                  {currentSlide.tag}
                </span>
                <span className="text-xs text-stone-500 font-medium flex items-center">
                  <Calendar className="w-3 h-3 mr-1 text-stone-400" />
                  {currentSlide.date}
                </span>
              </div>

              <Link
                to={currentSlide.link}
                className="group flex items-center text-stone-900 hover:text-[#F0935C] transition-colors"
              >
                <h3 className="text-sm sm:text-base font-bold truncate group-hover:underline mr-1">
                  {currentSlide.title}
                </h3>
                <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-[#F0935C] shrink-0" />
              </Link>
              <p className="hidden sm:block text-xs text-stone-500 truncate mt-0.5">
                {currentSlide.subtitle}
              </p>
            </div>
          </div>

          {/* Right slider controls (Prev, Play/Pause, Next, Count) */}
          <div className="flex items-center justify-between w-full md:w-auto md:justify-end space-x-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-stone-100">
            {/* Slide Count Indicator */}
            <div className="px-3 py-1 bg-stone-100 rounded-full text-xs font-bold text-stone-700 select-none">
              <span className="text-[#F0935C] font-black">{currentIndex + 1}</span>
              <span className="text-stone-400 mx-1">/</span>
              <span>{SLIDES.length}</span>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center space-x-1">
              <button
                onClick={handlePrev}
                className="p-2 rounded-xl bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-900 transition-colors cursor-pointer"
                aria-label="이전 배너"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={togglePlay}
                className="p-2 rounded-xl bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-900 transition-colors cursor-pointer"
                aria-label={isPlaying ? '슬라이더 일시정지' : '슬라이더 재생'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              </button>

              <button
                onClick={handleNext}
                className="p-2 rounded-xl bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-900 transition-colors cursor-pointer"
                aria-label="다음 배너"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
