import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { BookOpen, Trees, Sparkles, ShieldCheck, CheckCircle2, Calendar } from 'lucide-react';
import introDetails from '../data/introDetails.json';

const TABS = [
  { id: 'curriculum', label: '주요 교육과정', path: '/program/curriculum' },
  { id: 'special', label: '특별활동', path: '/program/special' },
  { id: 'schedule', label: '연간 학사일정', path: '/program/schedule' },
];

export const ProgramPage: React.FC = () => {
  const { subtab = 'curriculum' } = useParams<{ subtab?: string }>();

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb & Title */}
      <div className="mb-8 text-center sm:text-left">
        <div className="inline-flex items-center text-xs font-bold text-[#F0935C] bg-orange-50 px-3 py-1 rounded-full mb-2">
          <span>교육 프로그램</span>
          <span className="mx-1.5">/</span>
          <span className="text-stone-800">
            {TABS.find(t => t.id === subtab)?.label || '주요 교육과정'}
          </span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-stone-900 tracking-tight">
          예사랑 맞춤형 교육 프로그램
        </h1>
        <p className="text-sm text-stone-500 mt-1">
          아이 중심·놀이 중심으로 자발적인 호기심과 창의력을 꽃피웁니다.
        </p>
      </div>

      {/* Subtab Navigation Pills */}
      <div className="flex flex-wrap gap-2 pb-6 border-b border-stone-200/80 mb-8">
        {TABS.map(tab => {
          const isActive = subtab === tab.id;
          return (
            <Link
              key={tab.id}
              to={tab.path}
              className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                isActive
                  ? 'bg-[#F0935C] text-white shadow-md'
                  : 'bg-white text-stone-700 hover:bg-amber-50 hover:text-amber-800 border border-stone-200'
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Subtab 1: 주요 교육과정 */}
      {subtab === 'curriculum' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {introDetails.programs.map((prog, index) => (
              <div
                key={prog.id}
                className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-stone-200 flex flex-col justify-between hover:shadow-lg transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
                      {prog.targetAge}
                    </span>
                    <div className="flex gap-1">
                      {prog.tags.map((t, i) => (
                        <span key={i} className="text-[11px] font-semibold text-stone-400">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <h3 className="text-xl font-black text-stone-900 mb-1">{prog.title}</h3>
                  <span className="text-xs text-[#F0935C] font-bold block mb-3">{prog.subtitle}</span>
                  <p className="text-stone-600 text-sm leading-relaxed mb-4">{prog.description}</p>
                </div>

                <div className="space-y-1.5 pt-4 border-t border-stone-100">
                  <span className="text-xs font-bold text-stone-800 block mb-1">핵심 활동 포인트:</span>
                  {prog.features.map((feat, i) => (
                    <div key={i} className="flex items-center text-xs text-stone-600 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-1.5 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab 2: 특별활동 */}
      {subtab === 'special' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50/60 rounded-3xl p-6 sm:p-8 border border-amber-200 mb-6">
            <h3 className="text-xl font-black text-stone-900 mb-2">
              오감 쑥쑥! 예사랑 특별 프로그램 안내
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              정규 보육과정 외에 아이들의 창의성, 신체 조절력, 정서 안정을 위해 외부 전문 강사 및 원내 전담 교사가 연령별 맞춤 특별 프로그램을 주 단위로 진행합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl p-6 shadow-md border border-stone-200 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Trees className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-black text-stone-900">숲생태 놀이터</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                매주 1회 홍천 연봉산 유아숲체험원 나들이를 통해 자연 속 사계절 생태 변화를 오감으로 탐색합니다.
              </p>
              <div className="text-[11px] text-emerald-700 font-bold bg-emerald-50 p-2 rounded-xl">
                대상: 만 2세 ~ 만 5세
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-md border border-stone-200 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-black text-stone-900">조물조물 키즈쿠킹</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                월 2회 제철 식재료를 직접 씻고 썰고 반죽해보며 편식을 줄이고 식재료의 소중함을 배웁니다.
              </p>
              <div className="text-[11px] text-amber-700 font-bold bg-amber-50 p-2 rounded-xl">
                대상: 꽃잎반 / 열매반
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-md border border-stone-200 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-violet-100 text-violet-700 flex items-center justify-center font-bold">
                <BookOpen className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-black text-stone-900">오르프 음악 & 신체</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                타악기와 신체 리듬을 결합한 통합 음악 놀이로 풍부한 청각 자극과 정서적 카타르시스를 경험합니다.
              </p>
              <div className="text-[11px] text-violet-700 font-bold bg-violet-50 p-2 rounded-xl">
                대상: 전 연령
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 3: 연간 학사일정 */}
      {subtab === 'schedule' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-stone-200 space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center space-x-2 text-stone-900 font-black text-lg sm:text-xl">
            <Calendar className="w-5 h-5 text-[#F0935C]" />
            <h3>2026학년도 연간 학사 일정표 요약</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {[
              { m: '3월', t: '새로운 시작', d: '신학기 입학 및 오리엔테이션, 학부모 상담주간' },
              { m: '4월', t: '새싹과 봄꽃', d: '식목일 화분심기, 1학기 열린어린이집 참관, 숲체험' },
              { m: '5월', t: '사랑과 감사', d: '어린이날 꿈나무 대축제, 어버이날 카네이션, 봄소풍' },
              { m: '6월', t: '건강과 안전', d: '소방서 합동대피훈련, 영유아 구강검진, 단오맞이' },
              { m: '7월', t: '물과 여름', d: '신나는 원내 물놀이 페스티벌, 안전 위생 점검' },
              { m: '8월', t: '여름방학 돌봄', d: '맞춤형 하계 통합보육, 2학기 교재교구 준비' },
              { m: '9월', t: '풍성한 가을', d: '한가위 민속놀이 한마당, 텃밭 고구마 수확' },
              { m: '10월', t: '자연과 예술', d: '가을 가족 숲체험 및 나들이, 예사랑 작품 전시회' },
              { m: '11월', t: '감사와 나눔', d: '김장 담그기 체험, 소방안전 재점검' },
              { m: '12월', t: '따뜻한 겨울', d: '크리스마스 산타 잔치, 동지 팥죽 나눔' },
              { m: '1월', t: '새해 다짐', d: '새해 소원 카드 쓰기, 겨울철 실내 신체놀이' },
              { m: '2월', t: '수료와 졸업', d: '2026학년도 수료식 및 졸업식, 신학기 준비' },
            ].map(item => (
              <div key={item.m} className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-black text-sm text-[#F0935C]">{item.m}</span>
                    <span className="px-2 py-0.5 rounded-full bg-white text-stone-700 font-bold border border-amber-200">
                      {item.t}
                    </span>
                  </div>
                  <p className="text-stone-600 leading-relaxed">{item.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
