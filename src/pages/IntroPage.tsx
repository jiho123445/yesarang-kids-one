import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Heart,
  Sprout,
  Sparkles,
  Smile,
  MapPin,
  Phone,
  Bus,
  Car,
  Clock,
  Award,
  CheckCircle2,
  Building,
  Users,
  Edit2,
} from 'lucide-react';
import introDetails from '../data/introDetails.json';
import { MascotSun, MascotBear } from '../components/common/Illustrations';
import { useData } from '../context/DataContext';

const TABS = [
  { id: 'greeting', label: '인사말', path: '/intro/greeting' },
  { id: 'philosophy', label: '교육철학', path: '/intro/philosophy' },
  { id: 'history', label: '연혁', path: '/intro/history' },
  { id: 'facility', label: '시설현황', path: '/intro/facility' },
  { id: 'teachers', label: '교직원 소개', path: '/intro/teachers' },
  { id: 'location', label: '오시는길', path: '/intro/location' },
];

export const IntroPage: React.FC = () => {
  const { subtab = 'greeting' } = useParams<{ subtab?: string }>();
  const { institution, isAdmin, openAdminWithTab } = useData();

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb & Title */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center text-xs font-bold text-[#F0935C] bg-orange-50 px-3 py-1 rounded-full mb-2">
            <span>어린이집 소개</span>
            <span className="mx-1.5">/</span>
            <span className="text-stone-800">
              {TABS.find(t => t.id === subtab)?.label || '인사말'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-stone-900 tracking-tight">
            {institution.name} 소개
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            {institution.slogan} - {institution.subSlogan || '아이들의 따뜻한 배움터'}
          </p>
        </div>

        {/* Admin Intro Editor Trigger */}
        {isAdmin && (
          <button
            onClick={() => openAdminWithTab('intro')}
            className="self-start sm:self-auto inline-flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer"
          >
            <Edit2 className="w-4 h-4" />
            <span>어린이집 기본정보/인사말 편집</span>
          </button>
        )}
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

      {/* Subtab 1: 인사말 */}
      {subtab === 'greeting' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-amber-100 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4 flex flex-col items-center text-center">
              <div className="relative w-52 h-52 sm:w-60 sm:h-60 rounded-3xl overflow-hidden shadow-md border-4 border-amber-100 bg-amber-50">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80"
                  alt={`${institution.name} ${institution.director} 원장`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-4">
                <span className="text-xs font-bold text-[#F0935C] block">{institution.name} 원장</span>
                <span className="text-xl font-black text-stone-900">{institution.director}</span>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-4 text-stone-700 leading-relaxed text-sm sm:text-base">
              <h2 className="text-xl sm:text-2xl font-black text-stone-900 leading-snug">
                "{institution.greeting?.title || '아이들의 순수한 눈망울 속에 더 밝은 미래가 자라납니다'}"
              </h2>
              {(institution.greeting?.paragraphs || []).map((p, idx) => (
                <p key={idx} className="leading-loose">
                  {p}
                </p>
              ))}
              <p className="text-right font-bold text-stone-900 pt-4 text-sm sm:text-base">
                {institution.greeting?.sign || `${institution.name} 원장 ${institution.director} 배상`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 2: 교육철학 */}
      {subtab === 'philosophy' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 mb-2">
              예사랑 4대 핵심 교육 가치
            </h2>
            <p className="text-sm text-stone-600">
              아이들의 웃음과 행복이 피어나는 건강한 교육 철학을 실천합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(institution.philosophy || []).map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-stone-200 flex flex-col justify-between hover:shadow-lg transition-all"
              >
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-[#F0935C]">
                      {index === 0 && <Heart className="w-6 h-6 fill-[#F0935C]" />}
                      {index === 1 && <Sprout className="w-6 h-6 text-emerald-600" />}
                      {index === 2 && <Sparkles className="w-6 h-6 text-amber-500" />}
                      {index === 3 && <Smile className="w-6 h-6 text-rose-500" />}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-stone-400">VALUE 0{index + 1}</span>
                      <h3 className="text-lg sm:text-xl font-black text-stone-900">{item.title}</h3>
                    </div>
                  </div>
                  <p className="text-stone-600 text-sm sm:text-base leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Class organization list */}
          <div className="mt-12 bg-amber-50/70 rounded-3xl p-6 sm:p-8 border border-amber-200">
            <h3 className="text-lg sm:text-xl font-black text-stone-900 mb-4 text-center sm:text-left">
              연령별 학급 구성 현황 (총 정원: {institution.capacity}명)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {(institution.classes || []).map((cls, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-4 shadow-xs border border-amber-100 text-center">
                  <span className="text-xs font-bold text-[#F0935C] block">{cls.age}</span>
                  <h4 className="text-base font-black text-stone-900 my-1">{cls.name}</h4>
                  <span className="inline-block px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 text-xs font-semibold mb-2">
                    {cls.capacity}
                  </span>
                  <p className="text-[11px] text-stone-500 leading-tight">{cls.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Subtab 3: 연혁 */}
      {subtab === 'history' && (
        <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-10 shadow-md border border-stone-200 animate-in fade-in duration-200">
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 mb-6 text-center">
            {institution.name} 발자취
          </h2>
          <div className="relative border-l-2 border-[#F0935C]/30 ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-6">
            {introDetails.history.map((h, i) => (
              <div key={i} className="relative group">
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-[#F0935C] border-4 border-white shadow-xs" />
                <span className="text-base sm:text-lg font-black text-[#F0935C] block">{h.year}년</span>
                <p className="text-sm sm:text-base text-stone-800 font-medium mt-1 leading-relaxed">
                  {h.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab 4: 시설현황 */}
      {subtab === 'facility' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {introDetails.facilities.map(fac => (
              <div
                key={fac.id}
                className="bg-white rounded-3xl overflow-hidden shadow-md border border-stone-200 flex flex-col"
              >
                <div className="aspect-16/10 overflow-hidden bg-amber-100">
                  <img
                    src={fac.imageUrl}
                    alt={fac.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-stone-900 mb-2">
                      {fac.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-4">
                      {fac.description}
                    </p>
                  </div>
                  <div className="space-y-1 pt-3 border-t border-stone-100">
                    {fac.features.map((feat, i) => (
                      <div key={i} className="flex items-center text-xs text-stone-500 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-1.5 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab 5: 교직원 소개 */}
      {subtab === 'teachers' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {introDetails.teachers.map(t => (
              <div
                key={t.id}
                className="bg-white rounded-3xl p-6 shadow-md border border-stone-200 flex flex-col justify-between hover:shadow-lg transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800">
                      {t.role}
                    </span>
                    <span className="text-xs text-stone-400 font-medium">{t.className}</span>
                  </div>
                  <h3 className="text-xl font-black text-stone-900 mb-1">{t.name} 선생님</h3>
                  <span className="text-xs text-[#F0935C] font-bold block mb-3">{t.badge}</span>
                  <p className="text-xs sm:text-sm text-stone-600 italic bg-amber-50/50 p-3 rounded-2xl border border-amber-100/60 leading-relaxed">
                    "{t.message}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab 6: 오시는길 */}
      {subtab === 'location' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-stone-200 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
              <div>
                <span className="text-xs font-bold text-[#F0935C]">오시는 길 안내</span>
                <h2 className="text-xl sm:text-2xl font-black text-stone-900">
                  {institution.address}
                </h2>
              </div>
              <a
                href="https://map.naver.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
              >
                <MapPin className="w-3.5 h-3.5 mr-1" />
                <span>지도 앱에서 보기</span>
              </a>
            </div>

            {/* Interactive Map Graphic Card */}
            <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 shadow-inner flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&auto=format&fit=crop&q=80"
                alt="위치 안내 지도"
                className="w-full h-full object-cover opacity-60 filter saturate-150"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent" />
              <div className="absolute p-5 rounded-2xl bg-white/95 shadow-xl border border-amber-200 text-center max-w-xs">
                <div className="w-10 h-10 rounded-full bg-[#F0935C] text-white flex items-center justify-center mx-auto mb-2 shadow-xs">
                  <MapPin className="w-5 h-5" />
                </div>
                <h4 className="font-black text-stone-900 text-sm">{institution.name}</h4>
                <p className="text-xs text-stone-600 mt-1">{institution.address}</p>
                <span className="inline-block mt-2 text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                  연봉 현대아파트 인근
                </span>
              </div>
            </div>

            {/* Transportation Guide */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70">
                <div className="flex items-center space-x-2 text-stone-900 font-bold text-sm mb-2">
                  <Bus className="w-4 h-4 text-[#F0935C]" />
                  <span>대중교통 버스 안내</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  홍천 시내버스 연봉 현대아파트 정류장 하차 후 도보 2분 거리 (시내 순환 노선 수시 운행)
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70">
                <div className="flex items-center space-x-2 text-stone-900 font-bold text-sm mb-2">
                  <Car className="w-4 h-4 text-emerald-600" />
                  <span>자가용 및 주차 안내</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  어린이집 전용 등하원 승하차 안심존 및 원내 전용 지상 주차장 완비 (방문 학부모 무료 주차)
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70">
                <div className="flex items-center space-x-2 text-stone-900 font-bold text-sm mb-2">
                  <Phone className="w-4 h-4 text-teal-600" />
                  <span>문의 및 길안내</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  길 찾기가 어려우신 경우 원무실({institution.phone})로 전화 주시면 친절하게 안내해 드립니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
