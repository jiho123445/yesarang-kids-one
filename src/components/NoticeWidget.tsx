import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Bell, Paperclip, ChevronRight } from 'lucide-react';
import { NoticeItem } from '../types';

interface NoticeWidgetProps {
  notices: NoticeItem[];
  onSelectNotice?: (notice: NoticeItem) => void;
}

export const NoticeWidget: React.FC<NoticeWidgetProps> = ({ notices, onSelectNotice }) => {
  const leadNotice = notices[0];
  const listNotices = notices.slice(1, 4);

  // Helper to extract day and year-month from "2026.03.18"
  const getDayAndMonth = (dateStr: string) => {
    if (!dateStr) return { day: '01', month: '1월', year: '2026' };
    const parts = dateStr.split('.');
    if (parts.length >= 3) {
      return {
        year: parts[0],
        month: `${parseInt(parts[1], 10)}월`,
        day: parts[2],
      };
    }
    return { day: '18', month: '3월', year: '2026' };
  };

  const leadDate = leadNotice ? getDayAndMonth(leadNotice.createdAt) : null;

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-md border border-stone-200/80 flex flex-col h-full hover:shadow-lg transition-shadow">
      {/* Widget Header */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-100">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-[#F0935C]">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-black text-stone-900 tracking-tight">공지사항</h3>
            <span className="text-[11px] text-stone-400 font-medium">원내 주요 소식 및 안내문</span>
          </div>
        </div>

        <Link
          to="/board/notice"
          className="inline-flex items-center text-xs font-bold text-[#F0935C] hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-full transition-colors group"
        >
          <span>더보기</span>
          <Plus className="w-3.5 h-3.5 ml-1 group-hover:rotate-90 transition-transform" />
        </Link>
      </div>

      {/* Featured Top Lead Post */}
      {leadNotice && leadDate ? (
        <div
          onClick={() => onSelectNotice && onSelectNotice(leadNotice)}
          className="my-4 p-4 rounded-2xl bg-gradient-to-br from-amber-50/60 to-orange-50/40 border border-amber-200/60 cursor-pointer hover:border-[#F0935C]/60 transition-colors group"
        >
          <div className="flex items-start gap-3 sm:gap-4">
            {/* Big Date Badge */}
            <div className="shrink-0 flex flex-col items-center justify-center w-14 sm:w-16 h-14 sm:h-16 rounded-2xl bg-gradient-to-br from-[#F0935C] to-orange-600 text-white shadow-xs">
              <span className="text-xl sm:text-2xl font-black leading-none">{leadDate.day}</span>
              <span className="text-[11px] font-bold opacity-90 leading-tight mt-0.5">{leadDate.month}</span>
            </div>

            {/* Content Preview */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#F0935C]/20 text-[#F0935C]">
                  {leadNotice.category}
                </span>
                {leadNotice.isNew && (
                  <span className="px-1.5 py-0.5 rounded-md text-[10px] font-extrabold bg-rose-500 text-white animate-pulse">
                    NEW
                  </span>
                )}
                {leadNotice.hasAttachment && (
                  <Paperclip className="w-3 h-3 text-stone-400" />
                )}
              </div>
              <h4 className="text-sm sm:text-base font-bold text-stone-900 group-hover:text-[#F0935C] transition-colors line-clamp-1">
                {leadNotice.title}
              </h4>
              <p className="text-xs text-stone-600 line-clamp-2 mt-1 leading-relaxed">
                {leadNotice.summary}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {/* List items below lead post */}
      <div className="mt-auto divide-y divide-stone-100">
        {listNotices.map(item => (
          <div
            key={item.id}
            onClick={() => onSelectNotice && onSelectNotice(item)}
            className="py-2.5 px-1 flex items-center justify-between group cursor-pointer hover:bg-stone-50 rounded-xl transition-colors"
          >
            <div className="flex items-center space-x-2 min-w-0 pr-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-stone-800 group-hover:text-[#F0935C] truncate">
                {item.title}
              </span>
              {item.isNew && (
                <span className="shrink-0 text-[10px] font-bold text-rose-500">N</span>
              )}
            </div>
            <span className="text-[11px] text-stone-400 shrink-0 font-medium">{item.createdAt}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
