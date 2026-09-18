import React from 'react';
import { Sparkles, ArrowRight, Heart, ShieldCheck, Smile, PhoneCall } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MascotBear, MascotSun } from './common/Illustrations';

interface HeroSectionProps {
  onOpenConsultation: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenConsultation }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#F5C451] via-[#F7CF6B] to-[#FCE6A2] pt-8 sm:pt-12 pb-20 sm:pb-24 px-4 sm:px-6 lg:px-8 border-b border-amber-200/50">
      {/* Decorative background geometric shapes & playful dots */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute -top-12 -left-12 w-64 h-64 rounded-full bg-white/40 blur-2xl" />
        <div className="absolute top-1/2 -right-20 w-80 h-80 rounded-full bg-amber-300/50 blur-3xl" />
        {/* Dotted pattern */}
        <div className="absolute top-8 right-1/4 w-32 h-32 bg-[radial-gradient(#d97706_1.5px,transparent_1.5px)] [background-size:16px_16px] opacity-40" />
        <div className="absolute bottom-10 left-12 w-24 h-24 bg-[radial-gradient(#ea580c_1.5px,transparent_1.5px)] [background-size:14px_14px] opacity-40" />
        {/* Playful Floating Circles */}
        <div className="absolute top-16 left-1/3 w-4 h-4 rounded-full bg-rose-400 animate-bounce duration-1000" />
        <div className="absolute top-28 right-12 w-6 h-6 rounded-full border-2 border-dashed border-teal-600" />
        <div className="absolute bottom-24 left-1/4 w-5 h-5 rounded-full bg-violet-400" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left: Slogan Copy with Point Colored Accents */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            {/* Cute eyebrow pill */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-xs text-stone-800 text-xs sm:text-sm font-bold shadow-xs border border-amber-200/80">
              <span className="w-2 h-2 rounded-full bg-[#F0935C] animate-ping" />
              <span>강원도 홍천 연봉리</span>
              <span className="text-stone-400">·</span>
              <span className="text-[#F0935C]">사랑이 가득한 행복 놀이터</span>
            </div>

            {/* Main Slogan with Colorful Keyword Emphasis */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-stone-900 leading-[1.25] sm:leading-[1.2]">
              <span className="text-[#E11D48] relative inline-block">
                사랑
                <svg className="absolute -bottom-1 left-0 w-full h-2 text-rose-300 -z-10" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path d="M0 15 Q 50 0 100 15" stroke="currentColor" strokeWidth="6" fill="none" />
                </svg>
              </span>
              과{' '}
              <span className="text-[#0D9488] relative inline-block">
                신뢰
                <svg className="absolute -bottom-1 left-0 w-full h-2 text-teal-300 -z-10" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path d="M0 15 Q 50 0 100 15" stroke="currentColor" strokeWidth="6" fill="none" />
                </svg>
              </span>
              로 꿈을 키우는
              <br />
              <span className="text-stone-950 font-black tracking-tight">홍천 </span>
              <span className="text-[#8B5CF6] font-black underline decoration-wavy decoration-amber-400 decoration-3">
                예사랑어린이집
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-stone-800 text-base sm:text-lg font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
              맑고 푸른 자연 속에서 아이들의 눈높이에 맞춘 따뜻한 돌봄과 자율적인 놀이로 건강한 웃음과 바른 인성을 길러줍니다.
            </p>

            {/* Key feature pills */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-2 pt-1">
              <span className="inline-flex items-center px-3 py-1 rounded-xl bg-white/70 text-xs font-bold text-stone-800 shadow-2xs border border-amber-200/60">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 mr-1.5" />
                평가인증 안심보육
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-xl bg-white/70 text-xs font-bold text-stone-800 shadow-2xs border border-amber-200/60">
                <Heart className="w-3.5 h-3.5 text-rose-500 mr-1.5" />
                연봉산 유아 숲생태
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-xl bg-white/70 text-xs font-bold text-stone-800 shadow-2xs border border-amber-200/60">
                <Smile className="w-3.5 h-3.5 text-amber-600 mr-1.5" />
                유기농 친환경 안심급식
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-3">
              <button
                id="hero-consult-btn"
                onClick={onOpenConsultation}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-stone-900 text-white font-bold text-sm sm:text-base shadow-lg hover:bg-stone-800 active:scale-95 transition-all flex items-center justify-center space-x-2 group cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
                <span>입소 및 상담 안내</span>
                <ArrowRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <Link
                to="/intro/facility"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/90 hover:bg-white text-stone-800 font-bold text-sm sm:text-base shadow-sm border border-amber-200/80 active:scale-95 transition-all flex items-center justify-center space-x-1.5"
              >
                <span>시설 둘러보기</span>
              </Link>

              <a
                href="tel:033-435-6312"
                className="inline-flex sm:hidden w-full px-5 py-3 rounded-2xl bg-amber-200/80 text-stone-800 font-bold text-sm items-center justify-center space-x-1.5"
              >
                <PhoneCall className="w-4 h-4 text-[#F0935C]" />
                <span>전화상담 033-435-6312</span>
              </a>
            </div>
          </div>

          {/* Right: Child/Facility image placeholder area */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Mascot Bear peeking */}
            <div className="absolute -top-10 -right-4 z-20 hidden sm:block animate-pulse duration-3000">
              <MascotBear className="w-16 h-16 drop-shadow-md" />
            </div>

            {/* Mascot Sun on corner */}
            <div className="absolute -bottom-6 -left-6 z-20 hidden sm:block">
              <MascotSun className="w-16 h-16 drop-shadow-md" />
            </div>

            {/* Photo Card with Rounded-3xl and Playful Frame */}
            <div className="relative w-full max-w-md bg-white p-3 sm:p-4 rounded-3xl shadow-xl border-4 border-white/90 transform hover:-rotate-1 transition-transform duration-300">
              <div className="relative rounded-2xl overflow-hidden aspect-4/3 bg-amber-100">
                <img
                  src="https://images.unsplash.com/photo-1596464716127-f2a829822321?w=800&auto=format&fit=crop&q=80"
                  alt="홍천 예사랑어린이집 활동 모습"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#F0935C] text-[11px] font-bold mb-1 shadow-xs">
                    숲체험 & 오감놀이
                  </span>
                  <p className="text-sm font-bold drop-shadow-xs">
                    "자연 속에서 마음껏 웃고 뛰노는 우리 아이들"
                  </p>
                </div>
              </div>

              {/* Card Footer Badge */}
              <div className="mt-3 px-2 flex items-center justify-between text-xs text-stone-600 font-medium">
                <span className="flex items-center text-amber-800 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5" />
                  원아 모집 및 학부모 참관 상시 접수
                </span>
                <Link to="/intro/greeting" className="text-[#F0935C] font-bold hover:underline">
                  원장 인사말 &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
