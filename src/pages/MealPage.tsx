import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Utensils,
  CheckCircle2,
  Calendar,
  Plus,
  Edit2,
  Trash2,
  BookOpen,
  FileText,
  Download,
  Sparkles,
  Quote,
  ShieldCheck,
  Check,
  ExternalLink,
} from 'lucide-react';
import { MealItem, GalleryItem, NutritionNewsletter } from '../types';
import { useData } from '../context/DataContext';

interface MealPageProps {
  meals: MealItem[];
  gallery: GalleryItem[];
}

const TABS = [
  { id: 'monthly', label: '이달의 식단표', path: '/meal/monthly' },
  { id: 'nutrition', label: '영양 소식지', path: '/meal/nutrition' },
  { id: 'photos', label: '급식/간식 사진첩', path: '/meal/photos' },
];

export const MealPage: React.FC<MealPageProps> = ({ meals, gallery }) => {
  const { subtab = 'monthly' } = useParams<{ subtab?: string }>();
  const [selectedMealId, setSelectedMealId] = useState<string>(meals[0]?.id || '');
  const {
    isAdmin,
    openAdminWithTab,
    deleteMeal,
    nutritionNewsletters,
    deleteNutritionNewsletter,
  } = useData();

  // Active Meal
  const activeMeal = meals.find(m => m.id === selectedMealId) || meals[0];
  const mealPhotos = gallery.filter(g => g.category === '급식사진');

  // Active Nutrition Newsletter
  const [selectedNewsletterId, setSelectedNewsletterId] = useState<string>(
    nutritionNewsletters[0]?.id || ''
  );
  const activeNewsletter: NutritionNewsletter | undefined =
    nutritionNewsletters.find(nl => nl.id === selectedNewsletterId) ||
    nutritionNewsletters[0];

  // Simulated download feedback
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleDownload = (filename: string) => {
    setDownloadSuccess(filename);
    setTimeout(() => {
      setDownloadSuccess(null);
    }, 3000);
  };

  const handleDeleteMeal = (e: React.MouseEvent, id: string, date: string) => {
    e.stopPropagation();
    if (window.confirm(`${date} 식단 정보를 삭제하시겠습니까?`)) {
      deleteMeal(id);
    }
  };

  const handleDeleteNewsletter = (e: React.MouseEvent, id: string, period: string) => {
    e.stopPropagation();
    if (window.confirm(`${period} 영양 소식지를 삭제하시겠습니까?`)) {
      deleteNutritionNewsletter(id);
    }
  };

  // Color mapping helper for nutrition sections
  const getSectionColorClasses = (color?: string) => {
    switch (color) {
      case 'amber':
        return {
          wrapper: 'bg-amber-50/70 border-amber-200 text-amber-950',
          title: 'text-amber-900',
          badge: 'bg-amber-100 text-amber-800 border-amber-300',
        };
      case 'rose':
        return {
          wrapper: 'bg-rose-50/70 border-rose-200 text-rose-950',
          title: 'text-rose-900',
          badge: 'bg-rose-100 text-rose-800 border-rose-300',
        };
      case 'blue':
        return {
          wrapper: 'bg-blue-50/70 border-blue-200 text-blue-950',
          title: 'text-blue-900',
          badge: 'bg-blue-100 text-blue-800 border-blue-300',
        };
      case 'purple':
        return {
          wrapper: 'bg-purple-50/70 border-purple-200 text-purple-950',
          title: 'text-purple-900',
          badge: 'bg-purple-100 text-purple-800 border-purple-300',
        };
      case 'emerald':
      default:
        return {
          wrapper: 'bg-emerald-50/70 border-emerald-200 text-emerald-950',
          title: 'text-emerald-900',
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        };
    }
  };

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb & Title */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center text-xs font-bold text-[#F0935C] bg-orange-50 px-3 py-1 rounded-full mb-2">
            <span>급식마당</span>
            <span className="mx-1.5">/</span>
            <span className="text-stone-800">
              {TABS.find(t => t.id === subtab)?.label || '이달의 식단표'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-stone-900 tracking-tight">
            예사랑 안심 급식마당
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            홍천군 어린이급식관리지원센터 영양 지침을 준수한 안심 식단과 월간 영양소식지입니다.
          </p>
        </div>

        {/* Admin Quick Action Button */}
        {isAdmin && (
          <div className="flex items-center space-x-2">
            {subtab === 'nutrition' ? (
              <button
                onClick={() => openAdminWithTab('meals', { _subTab: 'nutrition' })}
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>영양소식지 등록 및 관리</span>
              </button>
            ) : subtab === 'photos' ? (
              <button
                onClick={() => openAdminWithTab('gallery')}
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>급식 사진 등록 및 관리</span>
              </button>
            ) : (
              <button
                onClick={() => openAdminWithTab('meals', { _subTab: 'daily' })}
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>식단 등록 및 관리</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Subtab Navigation Pills (Strictly 1 Single Line) */}
      <div className="flex flex-nowrap overflow-x-auto scrollbar-none gap-2 pb-4 border-b border-stone-200/80 mb-8">
        {TABS.map(tab => {
          const isActive = subtab === tab.id;
          return (
            <Link
              key={tab.id}
              to={tab.path}
              className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-[#F0935C] text-white shadow-md'
                  : 'bg-white text-stone-700 hover:bg-amber-50 hover:text-amber-800 border border-stone-200'
              }`}
            >
              {tab.label}
              {tab.id === 'nutrition' && nutritionNewsletters.length > 0 && (
                <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-white/20 text-white font-black">
                  {nutritionNewsletters[0].period.slice(-3)}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* Subtab 1: 이달의 식단표                                  */}
      {/* ======================================================== */}
      {subtab === 'monthly' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Daily selector pills (Strictly 1 Single Line) */}
          <div className="flex flex-nowrap overflow-x-auto scrollbar-none gap-2 pb-2">
            {meals.map(m => (
              <button
                key={m.id}
                onClick={() => setSelectedMealId(m.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  activeMeal?.id === m.id
                    ? 'bg-amber-400 text-stone-950 font-black shadow-xs'
                    : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                {m.date} ({m.dayOfWeek})
              </button>
            ))}
          </div>

          {activeMeal && (
            <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-amber-100 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
              {/* Admin actions for this meal */}
              {isAdmin && (
                <div className="absolute top-4 right-4 flex items-center space-x-2 bg-stone-100/90 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-stone-200">
                  <span className="text-[11px] font-bold text-stone-600">식단 관리:</span>
                  <button
                    onClick={() =>
                      openAdminWithTab('meals', { ...activeMeal, _type: 'meal', _subTab: 'daily' })
                    }
                    className="p-1 rounded text-stone-600 hover:text-amber-700 hover:bg-amber-100 cursor-pointer"
                    title="식단 수정"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={e => handleDeleteMeal(e, activeMeal.id, activeMeal.date)}
                    className="p-1 rounded text-stone-600 hover:text-rose-600 hover:bg-rose-100 cursor-pointer"
                    title="식단 삭제"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Left Photo & Highlight */}
              <div className="lg:col-span-5 space-y-4">
                <div className="relative rounded-2xl overflow-hidden aspect-4/3 shadow-md bg-stone-100">
                  <img
                    src={activeMeal.imageUrl}
                    alt={`${activeMeal.date} 식단`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[#F0935C] text-white font-black text-xs shadow-xs">
                    {activeMeal.calories} kcal
                  </div>
                </div>

                {activeMeal.todayHighlight && (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium leading-relaxed">
                    <span className="font-bold block mb-1">오늘의 영양사 한마디:</span>
                    {activeMeal.todayHighlight}
                  </div>
                )}
              </div>

              {/* Right Menu Details */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="flex items-center space-x-2 text-xs font-bold text-[#F0935C] mb-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {activeMeal.date} ({activeMeal.dayOfWeek}요일) 식단
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-stone-900">
                    건강과 균형을 담은 오늘의 밥상
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Lunch Main Menu */}
                  <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/70 space-y-2">
                    <div className="flex items-center space-x-2 text-amber-900 font-bold text-xs sm:text-sm">
                      <Utensils className="w-4 h-4 text-[#F0935C]" />
                      <span>중식 (점심)</span>
                    </div>
                    <ul className="space-y-1.5 text-xs sm:text-sm font-semibold text-stone-800">
                      {activeMeal.lunch.map((dish, i) => (
                        <li key={i} className="flex items-center space-x-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#F0935C]" />
                          <span>{dish}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Snacks */}
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-200/70 space-y-1">
                      <span className="text-xs font-bold text-orange-900 block">오전 간식</span>
                      <p className="text-xs sm:text-sm font-medium text-stone-800">
                        {activeMeal.morningSnack}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-200/70 space-y-1">
                      <span className="text-xs font-bold text-orange-900 block">오후 간식</span>
                      <p className="text-xs sm:text-sm font-medium text-stone-800">
                        {activeMeal.afternoonSnack}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Origin & Allergy Info */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 text-xs text-stone-600">
                  <p className="flex items-start space-x-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-stone-700">원산지 정보:</strong> {activeMeal.originInfo}
                    </span>
                  </p>
                  <p className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-stone-700">알레르기 정보:</strong>{' '}
                      {activeMeal.allergyInfo}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* Subtab 2: 영양 소식지 (관리자 정기 업데이트 지원)       */}
      {/* ======================================================== */}
      {subtab === 'nutrition' && (
        <div className="space-y-8 animate-in fade-in duration-200 max-w-4xl mx-auto">
          {/* Periodic Issue Selector (Strictly 1 Single Line) */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-nowrap overflow-x-auto scrollbar-none gap-2 pb-2 flex-1">
              {nutritionNewsletters.map((nl, idx) => (
                <button
                  key={nl.id}
                  onClick={() => setSelectedNewsletterId(nl.id)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center space-x-1.5 ${
                    activeNewsletter?.id === nl.id
                      ? 'bg-emerald-500 text-white font-black shadow-sm'
                      : 'bg-white text-stone-700 hover:bg-emerald-50 hover:text-emerald-900 border border-stone-200'
                  }`}
                >
                  <span>{nl.period}</span>
                  {idx === 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        activeNewsletter?.id === nl.id
                          ? 'bg-emerald-700 text-white'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      최신호
                    </span>
                  )}
                </button>
              ))}
            </div>

            {isAdmin && (
              <button
                onClick={() => openAdminWithTab('meals', { _subTab: 'nutrition' })}
                className="hidden sm:inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-colors shrink-0 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>소식지 추가</span>
              </button>
            )}
          </div>

          {activeNewsletter ? (
            <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-md border border-stone-200 space-y-6 relative">
              {/* Admin actions for this specific newsletter */}
              {isAdmin && (
                <div className="absolute top-4 right-4 flex items-center space-x-2 bg-stone-100/95 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-stone-200">
                  <span className="text-[11px] font-bold text-stone-600">소식지 관리:</span>
                  <button
                    onClick={() =>
                      openAdminWithTab('meals', {
                        ...activeNewsletter,
                        _type: 'nutritionNewsletter',
                        _subTab: 'nutrition',
                      })
                    }
                    className="p-1 rounded text-stone-600 hover:text-emerald-700 hover:bg-emerald-100 cursor-pointer"
                    title="소식지 수정"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={e =>
                      handleDeleteNewsletter(e, activeNewsletter.id, activeNewsletter.period)
                    }
                    className="p-1 rounded text-stone-600 hover:text-rose-600 hover:bg-rose-100 cursor-pointer"
                    title="소식지 삭제"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Newsletter Header */}
              <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 pb-6 border-b border-stone-200">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-800 flex items-center justify-center font-bold shrink-0 shadow-2xs">
                  <Utensils className="w-7 h-7" />
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 inline-block">
                      {activeNewsletter.supervisor || '홍천군 어린이급식관리지원센터 자문'}
                    </span>
                    <span className="text-xs font-bold text-stone-500">
                      발행: {activeNewsletter.date} ({activeNewsletter.period})
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-stone-900 leading-snug">
                    {activeNewsletter.title}
                  </h3>
                </div>
              </div>

              {/* Summary intro quote */}
              {activeNewsletter.summary && (
                <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-start space-x-3 text-stone-700">
                  <Quote className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm font-medium leading-relaxed">
                    {activeNewsletter.summary}
                  </p>
                </div>
              )}

              {/* Dynamic Theme Sections */}
              <div className="space-y-4 text-xs sm:text-sm leading-relaxed">
                {activeNewsletter.sections.map((sec, sIdx) => {
                  const colors = getSectionColorClasses(sec.color);
                  return (
                    <div
                      key={sIdx}
                      className={`p-5 rounded-2xl border transition-all ${colors.wrapper}`}
                    >
                      <h4 className={`font-black text-sm sm:text-base mb-2 ${colors.title}`}>
                        {sec.title}
                      </h4>
                      <p className="leading-relaxed whitespace-pre-line text-stone-800">
                        {sec.content}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Home Nutrition Tips Card */}
              {activeNewsletter.tips && activeNewsletter.tips.length > 0 && (
                <div className="p-5 sm:p-6 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3">
                  <div className="flex items-center space-x-2 text-amber-900 font-black text-sm sm:text-base">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>가정 연계 영양 꿀팁 & 식습관 실천 가이드</span>
                  </div>
                  <ul className="space-y-2 text-xs sm:text-sm text-stone-800">
                    {activeNewsletter.tips.map((tip, tIdx) => (
                      <li key={tIdx} className="flex items-start space-x-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Poster Photo Preview */}
              {activeNewsletter.imageUrl && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-stone-500 block">
                    소식지 카드뉴스 / 안내 포스터
                  </span>
                  <div className="rounded-2xl overflow-hidden border border-stone-200 bg-stone-50 max-h-[420px]">
                    <img
                      src={activeNewsletter.imageUrl}
                      alt={activeNewsletter.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Attachment Download Action */}
              {activeNewsletter.attachmentName && (
                <div className="p-4 sm:p-5 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-stone-900">
                        {activeNewsletter.attachmentName}
                      </p>
                      <p className="text-[11px] text-stone-500">
                        어린이급식관리지원센터 검수 공문서 및 가정통신 배부용 PDF
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDownload(activeNewsletter.attachmentName || '')}
                    className="inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold shadow-xs transition-colors shrink-0 cursor-pointer"
                  >
                    {downloadSuccess === activeNewsletter.attachmentName ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>다운로드 완료</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>소식지 다운로드 (PDF)</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Past issues navigation footer */}
              {nutritionNewsletters.length > 1 && (
                <div className="pt-4 border-t border-stone-200">
                  <span className="text-xs font-bold text-stone-500 block mb-3">
                    이전 호수 영양소식지 다시보기
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {nutritionNewsletters
                      .filter(nl => nl.id !== activeNewsletter.id)
                      .slice(0, 4)
                      .map(otherNl => (
                        <button
                          key={otherNl.id}
                          onClick={() => {
                            setSelectedNewsletterId(otherNl.id);
                            window.scrollTo({ top: 180, behavior: 'smooth' });
                          }}
                          className="p-3 rounded-xl bg-stone-50 hover:bg-emerald-50/60 border border-stone-200 hover:border-emerald-300 text-left transition-colors cursor-pointer flex items-center justify-between"
                        >
                          <div className="min-w-0 pr-2">
                            <span className="text-[10px] font-bold text-emerald-800 block">
                              {otherNl.period}
                            </span>
                            <span className="text-xs font-bold text-stone-900 line-clamp-1">
                              {otherNl.title}
                            </span>
                          </div>
                          <span className="text-xs text-stone-400 font-bold shrink-0">보기 →</span>
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 space-y-4">
              <BookOpen className="w-12 h-12 text-stone-300 mx-auto" />
              <p className="text-sm font-bold text-stone-600">등록된 영양소식지가 없습니다.</p>
              {isAdmin && (
                <button
                  onClick={() => openAdminWithTab('meals', { _subTab: 'nutrition' })}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>첫 영양소식지 등록하기</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* Subtab 3: 급식/간식 사진첩                                */}
      {/* ======================================================== */}
      {subtab === 'photos' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mealPhotos.length === 0 ? (
              <div className="col-span-3 p-12 text-center text-stone-400 bg-white rounded-3xl border border-stone-200">
                <p className="text-sm font-semibold">등록된 급식 사진이 없습니다.</p>
              </div>
            ) : (
              mealPhotos.map(item => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl overflow-hidden shadow-md border border-stone-200 flex flex-col group"
                >
                  <div className="aspect-4/3 overflow-hidden bg-stone-100">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 flex flex-col justify-between flex-1">
                    <div>
                      <span className="text-xs text-stone-400 block mb-1">{item.date}</span>
                      <h4 className="text-sm font-black text-stone-900 group-hover:text-[#F0935C] transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
