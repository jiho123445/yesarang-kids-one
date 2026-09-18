import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Utensils, Info, CheckCircle2 } from 'lucide-react';
import { MealItem } from '../types';
import { MascotBear, IconCuteMeal } from './common/Illustrations';

interface TodayMealWidgetProps {
  meal: MealItem | null;
}

export const TodayMealWidget: React.FC<TodayMealWidgetProps> = ({ meal }) => {
  if (!meal) return null;

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-md border border-stone-200/80 flex flex-col h-full hover:shadow-lg transition-shadow">
      {/* Widget Header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
            <Utensils className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-black text-stone-900 tracking-tight">오늘의 안심 식단</h3>
            <span className="text-[11px] text-stone-400 font-medium">
              {meal.date} ({meal.dayOfWeek}) 식단표
            </span>
          </div>
        </div>

        <Link
          to="/meal/monthly"
          className="inline-flex items-center text-xs font-bold text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-full transition-colors group"
        >
          <span>식단표 전체</span>
          <Plus className="w-3.5 h-3.5 ml-1 group-hover:rotate-90 transition-transform" />
        </Link>
      </div>

      {/* Mascot Icon + Calories Pill Badge */}
      <div className="flex items-center justify-between mt-4 mb-3 p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50/60 border border-amber-200/60">
        <div className="flex items-center space-x-3">
          <MascotBear className="w-10 h-10 shrink-0 drop-shadow-xs" />
          <div>
            <span className="text-xs font-bold text-stone-800 block">영양 밸런스 안심 급식</span>
            <span className="text-[11px] text-[#F0935C] font-semibold">전문 영양사 지도 식단</span>
          </div>
        </div>

        {/* Calories Pill Badge */}
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-[#F0935C] text-stone-900 font-black text-xs shadow-xs">
          <span>{meal.calories}</span>
          <span className="text-[10px] font-bold ml-1 opacity-90">kcal</span>
        </div>
      </div>

      {/* Menu breakdown */}
      <div className="flex-1 space-y-3">
        {/* Morning Snack */}
        <div className="flex items-start text-xs">
          <span className="shrink-0 px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 font-bold mr-2">
            오전간식
          </span>
          <span className="text-stone-700 font-medium pt-0.5">{meal.morningSnack}</span>
        </div>

        {/* Lunch Main Menu */}
        <div className="p-3 rounded-2xl bg-stone-50 border border-stone-100">
          <div className="flex items-center justify-between mb-1.5">
            <span className="px-2 py-0.5 rounded-md bg-[#F0935C] text-white text-[11px] font-bold">
              점심 급식
            </span>
            <span className="text-[10px] text-emerald-700 font-bold flex items-center">
              <CheckCircle2 className="w-3 h-3 mr-0.5" />
              친환경 국내산 쌀/식재료
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {meal.lunch.map((dish, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-xl bg-white border border-stone-200 text-stone-800 font-bold text-xs shadow-2xs"
              >
                {dish}
              </span>
            ))}
          </div>
        </div>

        {/* Afternoon Snack */}
        <div className="flex items-start text-xs">
          <span className="shrink-0 px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 font-bold mr-2">
            오후간식
          </span>
          <span className="text-stone-700 font-medium pt-0.5">{meal.afternoonSnack}</span>
        </div>
      </div>

      {/* Allergy & Origin info tooltip footer */}
      <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
        <span className="truncate pr-2">
          알레르기 유발 정보: {meal.allergyInfo}
        </span>
        <Link to="/meal/nutrition" className="text-amber-700 font-bold hover:underline shrink-0">
          영양소식
        </Link>
      </div>
    </div>
  );
};
