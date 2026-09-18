import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin, Sparkles } from 'lucide-react';
import { CalendarEvent } from '../types';
import { Link } from 'react-router-dom';

interface MonthlyCalendarWidgetProps {
  events: CalendarEvent[];
}

export const MonthlyCalendarWidget: React.FC<MonthlyCalendarWidgetProps> = ({ events }) => {
  // Current month state: default to 3 (March, current school term in Korea)
  const [currentMonth, setCurrentMonth] = useState<number>(3);
  const [currentYear] = useState<number>(2026);

  const handlePrevMonth = () => {
    setCurrentMonth(prev => (prev === 1 ? 12 : prev - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => (prev === 12 ? 1 : prev + 1));
  };

  // Filter events for the selected month
  const monthEvents = events
    .filter(ev => ev.month === currentMonth)
    .sort((a, b) => a.day - b.day);

  const getCategoryColor = (cat: CalendarEvent['category']) => {
    switch (cat) {
      case '행사':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case '체험':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case '휴원':
        return 'bg-rose-100 text-rose-900 border-rose-300';
      case '보건/안전':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      default:
        return 'bg-purple-100 text-purple-900 border-purple-300';
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#F0935C] to-[#E27638] text-white rounded-3xl p-5 sm:p-6 shadow-md flex flex-col h-full border border-orange-400/40 relative overflow-hidden">
      {/* Background soft bubble circles */}
      <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/10 blur-xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-white/10 blur-lg pointer-events-none" />

      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/20">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-amber-200" />
          <h3 className="text-lg font-black tracking-tight">이달의 행사 달력</h3>
        </div>
        <Link
          to="/events/monthly"
          className="text-xs font-bold text-white/90 hover:text-white bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full transition-colors"
        >
          전체일정 &rarr;
        </Link>
      </div>

      {/* Central Month Navigator with Center White Circle */}
      <div className="my-5 flex items-center justify-center space-x-6">
        <button
          onClick={handlePrevMonth}
          className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white transition-all cursor-pointer hover:scale-105 active:scale-95"
          aria-label="이전 달 일정 보기"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Center White Circle with "Month" */}
        <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-white text-stone-900 shadow-lg flex flex-col items-center justify-center border-4 border-white/80 transform hover:scale-105 transition-transform select-none">
          <span className="text-[10px] sm:text-xs font-bold text-[#F0935C] uppercase tracking-wider">
            {currentYear}년
          </span>
          <span className="text-2xl sm:text-3xl font-black text-stone-900 leading-none">
            {currentMonth}
            <span className="text-sm sm:text-base font-bold text-stone-600 ml-0.5">월</span>
          </span>
        </div>

        <button
          onClick={handleNextMonth}
          className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white transition-all cursor-pointer hover:scale-105 active:scale-95"
          aria-label="다음 달 일정 보기"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Event list for the selected month */}
      <div className="flex-1 overflow-y-auto space-y-2.5 max-h-56 pr-1 custom-scrollbar">
        {monthEvents.length === 0 ? (
          <div className="h-full min-h-32 flex flex-col items-center justify-center text-center p-4 bg-white/10 rounded-2xl border border-white/15">
            <Sparkles className="w-6 h-6 text-amber-200 mb-1.5 opacity-80" />
            <p className="text-sm font-bold text-white">등록된 일정이 없습니다.</p>
            <p className="text-xs text-white/70 mt-0.5">세부 일정은 원무실로 문의바랍니다.</p>
          </div>
        ) : (
          monthEvents.map(ev => (
            <div
              key={ev.id}
              className="p-3 rounded-2xl bg-white/95 text-stone-900 shadow-xs border border-white/30 hover:bg-white transition-all"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-black text-[#F0935C]">
                    {currentMonth}월 {ev.day}일
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getCategoryColor(
                      ev.category
                    )}`}
                  >
                    {ev.category}
                  </span>
                </div>
                {ev.time && (
                  <span className="text-[10px] text-stone-400 flex items-center font-medium">
                    <Clock className="w-3 h-3 mr-0.5" />
                    {ev.time}
                  </span>
                )}
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-stone-900 truncate">{ev.title}</h4>
              {ev.description && (
                <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">{ev.description}</p>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-3 pt-2 border-t border-white/20 text-center">
        <span className="text-[11px] text-white/80">
          ※ 날씨 및 원내 사정에 따라 일정이 일부 변경될 수 있습니다.
        </span>
      </div>
    </div>
  );
};
