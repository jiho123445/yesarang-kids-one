import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Utensils, CheckCircle2, ShieldCheck, Heart, AlertCircle, Info, Calendar, Plus, Edit2, Trash2 } from 'lucide-react';
import { MealItem, GalleryItem } from '../types';
import { MascotBear, IconCuteMeal } from '../components/common/Illustrations';
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
  const { isAdmin, openAdminWithTab, deleteMeal } = useData();

  const activeMeal = meals.find(m => m.id === selectedMealId) || meals[0];
  const mealPhotos = gallery.filter(g => g.category === '급식사진');

  const handleDeleteMeal = (e: React.MouseEvent, id: string, date: string) => {
    e.stopPropagation();
    if (window.confirm(`${date} 식단 정보를 삭제하시겠습니까?`)) {
      deleteMeal(id);
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
            홍천군 어린이급식관리지원센터 영양 지침을 준수한 안심 식단입니다.
          </p>
        </div>

        {/* Admin Quick Action Button */}
        {isAdmin && (
          <button
            onClick={() => openAdminWithTab('meals')}
            className="self-start sm:self-auto inline-flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>식단 등록 및 관리</span>
          </button>
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
            </Link>
          );
        })}
      </div>

      {/* Subtab 1: 이달의 식단표 */}
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
                    onClick={() => openAdminWithTab('meals')}
                    className="p-1 rounded text-stone-600 hover:text-amber-700 hover:bg-amber-100"
                    title="식단 수정"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => handleDeleteMeal(e, activeMeal.id, activeMeal.date)}
                    className="p-1 rounded text-stone-600 hover:text-rose-600 hover:bg-rose-100"
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

                {/* Morning snack */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-stone-500 block mb-0.5">오전 간식</span>
                    <span className="text-sm sm:text-base font-bold text-stone-800">
                      {activeMeal.morningSnack}
                    </span>
                  </div>
                  <span className="text-xs text-amber-700 font-semibold bg-amber-100 px-2.5 py-1 rounded-full">
                    10:00 제공
                  </span>
                </div>

                {/* Lunch items */}
                <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/80">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-black text-stone-900">점심 식단 구성</span>
                    <span className="text-xs text-emerald-700 font-bold flex items-center">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      HACCP 안심 조리
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {activeMeal.lunch.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-white rounded-xl border border-amber-100 text-center shadow-2xs"
                      >
                        <span className="text-xs font-extrabold text-stone-800">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Afternoon snack */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-stone-500 block mb-0.5">오후 간식</span>
                    <span className="text-sm sm:text-base font-bold text-stone-800">
                      {activeMeal.afternoonSnack}
                    </span>
                  </div>
                  <span className="text-xs text-orange-700 font-semibold bg-orange-100 px-2.5 py-1 rounded-full">
                    15:30 제공
                  </span>
                </div>

                {/* Origin & Allergy Info */}
                <div className="pt-4 border-t border-stone-200 space-y-2 text-xs text-stone-500">
                  <p>
                    <span className="font-bold text-stone-700">식재료 원산지:</span>{' '}
                    {activeMeal.originInfo}
                  </p>
                  <p className="flex items-start">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-500 mr-1 shrink-0 mt-0.5" />
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

      {/* Subtab 2: 영양 소식지 */}
      {subtab === 'nutrition' && (
        <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-md border border-stone-200 space-y-6">
            <div className="flex items-center space-x-3 pb-6 border-b border-stone-200">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <Utensils className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-600 block">홍천군 어린이급식관리지원센터 자문</span>
                <h3 className="text-xl sm:text-2xl font-black text-stone-900">
                  성장기 우리 아이를 위한 봄철 영양 가이드
                </h3>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-emerald-950">
                <h4 className="font-bold text-emerald-900 mb-1">1. 저염·저당 건강 조리 원칙</h4>
                <p>
                  예사랑어린이집은 영유아의 미각 발달과 신장 건강을 위하여 국 염도 0.5% 이하, 천연 다시마와 멸치 육수만을 사용합니다.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-950">
                <h4 className="font-bold text-amber-900 mb-1">2. 강원 홍천 로컬푸드 제철 식자재</h4>
                <p>
                  강원 홍천 지역에서 재배된 친환경 쌀, 신선한 제철 채소와 국내산 무항생제 축산물을 매일 아침 직송받아 당일 소진을 원칙으로 조리합니다.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 text-rose-950">
                <h4 className="font-bold text-rose-900 mb-1">3. 영유아 식품 알레르기 안전 수칙</h4>
                <p>
                  계란, 우유, 땅콩, 갑각류 등 특정 식품에 알레르기 반응이 있는 경우 즉시 담임 선생님께 공유해 주시면, 안심 대체 식단(대체유, 알레르기 전용 반찬)을 철저히 배식합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 3: 급식/간식 사진첩 */}
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
