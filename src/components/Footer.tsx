import React, { useState } from 'react';
import { MapPin, Phone, Users, Shield, Award, Heart, Sparkles, ArrowUp } from 'lucide-react';
import { MascotSun } from './common/Illustrations';

export const Footer: React.FC = () => {
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-stone-900 text-stone-300 pt-12 pb-10 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Top bar: Policies & Scroll to Top */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-stone-800 text-xs">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6 font-medium">
            <button
              onClick={() => setActiveModal('privacy')}
              className="text-amber-400 font-bold hover:underline cursor-pointer"
            >
              개인정보처리방침
            </button>
            <span className="text-stone-700">|</span>
            <button
              onClick={() => setActiveModal('terms')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              이용약관
            </button>
            <span className="text-stone-700">|</span>
            <span className="text-stone-400">영상정보처리기기 운영방침</span>
            <span className="text-stone-700">|</span>
            <span className="text-stone-400">이메일무단수집거부</span>
          </div>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors text-xs font-semibold cursor-pointer"
            aria-label="맨 위로 이동"
          >
            <span>맨 위로</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Middle: Institution Info & Visitor Counter Badges */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Institution Identity */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center space-x-3">
              <MascotSun className="w-10 h-10 shrink-0" />
              <div>
                <span className="text-xs text-[#F0935C] font-bold block">아이들의 따뜻한 배움터</span>
                <span className="text-lg font-black text-white">홍천 예사랑어린이집</span>
              </div>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              아이의 고유한 개성과 속도를 존중하며 부모님의 마음으로 돌보는 행복한 안심 어린이집입니다.
            </p>
            <div className="flex items-center space-x-2 text-xs text-stone-400 pt-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded bg-stone-800 text-stone-300 font-medium">
                보육시설 인가
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded bg-stone-800 text-stone-300 font-medium">
                보건복지부 평가인증
              </span>
            </div>
          </div>

          {/* Contact and address details */}
          <div className="lg:col-span-5 space-y-2 text-xs text-stone-400">
            <div className="flex items-start">
              <MapPin className="w-4 h-4 text-amber-400 mr-2 shrink-0 mt-0.5" />
              <div>
                <span className="text-stone-300 font-semibold">주소: </span>
                강원특별자치도 홍천군 홍천읍 연봉로 11 (우편번호 25134)
              </div>
            </div>
            <div className="flex items-center">
              <Phone className="w-4 h-4 text-amber-400 mr-2 shrink-0" />
              <div>
                <span className="text-stone-300 font-semibold">대표전화: </span>
                <a href="tel:033-435-6312" className="hover:text-amber-300 font-bold text-white">
                  033-435-6312
                </a>
                <span className="text-stone-600 mx-2">|</span>
                <span className="text-stone-300 font-semibold">팩스: </span>
                033-435-6315
              </div>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 text-amber-400 mr-2 shrink-0" />
              <div>
                <span className="text-stone-300 font-semibold">원장: </span>
                <span className="text-white font-medium">김희정</span>
                <span className="text-stone-600 mx-2">|</span>
                <span className="text-stone-300 font-semibold">고유번호: </span>
                223-82-71049
              </div>
            </div>
            <p className="text-[11px] text-stone-500 pt-1">
              운영시간: 평일 07:30 ~ 19:30 (기본보육 + 연장보육 포함)
            </p>
          </div>

          {/* Visitor Counter Badges */}
          <div className="lg:col-span-3 flex flex-col items-start lg:items-end justify-center space-y-2.5">
            <div className="text-xs font-bold text-stone-400">방문자 통계</div>
            <div className="flex items-center space-x-2">
              {/* Today Badge */}
              <div className="flex items-center px-3 py-1.5 rounded-xl bg-stone-800 border border-stone-700/80 shadow-xs">
                <span className="text-[11px] text-stone-400 font-medium mr-2">오늘 방문자</span>
                <span className="text-sm font-black text-amber-400">128</span>
                <span className="text-[10px] text-stone-500 ml-0.5">명</span>
              </div>

              {/* Total Badge */}
              <div className="flex items-center px-3 py-1.5 rounded-xl bg-stone-800 border border-stone-700/80 shadow-xs">
                <span className="text-[11px] text-stone-400 font-medium mr-2">누적 방문자</span>
                <span className="text-sm font-black text-[#F0935C]">48,290</span>
                <span className="text-[10px] text-stone-500 ml-0.5">명</span>
              </div>
            </div>
            <span className="text-[10px] text-stone-500">카운터 기준: 매일 00:00 갱신</span>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-2">
          <p>© 2026 홍천 예사랑어린이집. All Rights Reserved.</p>
          <p className="text-[11px] text-stone-600">
            본 웹사이트는 어린이집 정보 제공 목적으로 제작되었습니다.
          </p>
        </div>
      </div>

      {/* Privacy Policy Modal */}
      {activeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs text-stone-800"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-stone-200">
              <h3 className="text-lg font-bold text-stone-900">
                {activeModal === 'privacy' ? '개인정보처리방침 안내' : '웹사이트 이용약관'}
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-stone-400 hover:text-stone-700 text-sm font-bold"
              >
                닫기 ✕
              </button>
            </div>
            <div className="text-xs text-stone-600 space-y-3 leading-relaxed">
              <p>
                홍천 예사랑어린이집은 개인정보보호법에 의거하여 원아 및 학부모님의 소중한 개인정보를 안전하게 처리하고 보호하고 있습니다.
              </p>
              <h4 className="font-bold text-stone-800">1. 수집하는 개인정보 항목</h4>
              <p>입소 상담 및 알림장 서비스 제공을 위한 보호자 성명, 연락처, 원아명, 생년월일 등 최소한의 정보.</p>
              <h4 className="font-bold text-stone-800">2. 개인정보의 보유 및 이용 기간</h4>
              <p>보육 기간 종료 시 또는 관계 법령에 따른 의무 보존 기간 만료 후 지체 없이 안전하게 파기합니다.</p>
              <h4 className="font-bold text-stone-800">3. 개인정보 보호책임자</h4>
              <p>원장 김희정 (문의: 033-435-6312)</p>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
