import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Utensils, CheckCircle2, ShieldCheck, Heart, AlertCircle, Info, Calendar } from 'lucide-react';
import { MealItem, GalleryItem } from '../types';
import { MascotBear, IconCuteMeal } from '../components/common/Illustrations';

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

  const activeMeal = meals.find(m => m.id === selectedMealId) || meals[0];
  const mealPhotos = gallery.filter(g => g.category === '급식사진');

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb & Title */}
      <div className="mb-8 text-center sm:text-left">
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

      {/* Subtab 1: 이달의 식단표 */}
      {subtab === 'monthly' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Daily selector pills */}
          <div className="flex flex-wrap gap-2">
            {meals.map(m => (
              <button
                key={m.id}
                onClick={() => setSelectedMealId(m.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
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
            <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-amber-100 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
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
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-stone-200 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Utensils className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-stone-900">
                  2026년 3월 영양 소식지: "봄철 입맛 돋우는 제철 채소와 건강 식습관"
                </h3>
                <span className="text-xs text-stone-400">발행: 홍천 예사랑어린이집 영양실</span>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                <h4 className="font-bold text-amber-900 mb-1">1. 제철 봄나물로 비타민 충전하기</h4>
                <p>
                  달래, 냉이, 쑥, 취나물 등 봄나물은 비타민 A, C와 칼슘, 철분이 풍부하여 아이들의 면역력 증진과 피로 회복에 탁월합니다. 어린이집에서는 맵지 않게 된장국이나 전, 부침으로 맛있게 조리하여 제공하고 있습니다.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200">
                <h4 className="font-bold text-teal-900 mb-1">2. 올바른 영유아 식사 예절과 편식 지도 팁</h4>
                <p>
                  낯선 식재료는 강요하기보다는 그림책이나 텃밭 관찰 활동을 통해 먼저 친숙해지는 과정을 가집니다. 가정에서도 "한 입만 맛볼까?" 하는 긍정적인 격려로 자신감을 북돋아 주세요.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
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
