import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Mail, Paperclip } from 'lucide-react';
import { NewsletterItem } from '../types';

interface NewsletterWidgetProps {
  newsletters: NewsletterItem[];
  onSelectNewsletter?: (newsletter: NewsletterItem) => void;
}

export const NewsletterWidget: React.FC<NewsletterWidgetProps> = ({
  newsletters,
  onSelectNewsletter,
}) => {
  const leadItem = newsletters[0];
  const listItems = newsletters.slice(1, 4);

  const getDayAndMonth = (dateStr: string) => {
    if (!dateStr) return { day: '01', month: '1월' };
    const parts = dateStr.split('.');
    if (parts.length >= 3) {
      return {
        month: `${parseInt(parts[1], 10)}월`,
        day: parts[2],
      };
    }
    return { day: '17', month: '3월' };
  };

  const leadDate = leadItem ? getDayAndMonth(leadItem.createdAt) : null;

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-md border border-stone-200/80 flex flex-col h-full hover:shadow-lg transition-shadow">
      {/* Widget Header */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-100">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-teal-100 flex items-center justify-center text-teal-600">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-black text-stone-900 tracking-tight">가정통신문 (알림장)</h3>
            <span className="text-[11px] text-stone-400 font-medium">가정 연계 활동 및 알림장</span>
          </div>
        </div>

        <Link
          to="/board/newsletter"
          className="inline-flex items-center text-xs font-bold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-full transition-colors group"
        >
          <span>더보기</span>
          <Plus className="w-3.5 h-3.5 ml-1 group-hover:rotate-90 transition-transform" />
        </Link>
      </div>

      {/* Featured Top Lead Post */}
      {leadItem && leadDate ? (
        <div
          onClick={() => onSelectNewsletter && onSelectNewsletter(leadItem)}
          className="my-4 p-4 rounded-2xl bg-gradient-to-br from-teal-50/70 to-emerald-50/40 border border-teal-200/60 cursor-pointer hover:border-teal-400/80 transition-colors group"
        >
          <div className="flex items-start gap-3 sm:gap-4">
            {/* Big Date Badge */}
            <div className="shrink-0 flex flex-col items-center justify-center w-14 sm:w-16 h-14 sm:h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-xs">
              <span className="text-xl sm:text-2xl font-black leading-none">{leadDate.day}</span>
              <span className="text-[11px] font-bold opacity-90 leading-tight mt-0.5">{leadDate.month}</span>
            </div>

            {/* Content Preview */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-teal-200/70 text-teal-800">
                  {leadItem.targetClass}
                </span>
                {leadItem.isImportant && (
                  <span className="px-1.5 py-0.5 rounded-md text-[10px] font-extrabold bg-rose-500 text-white">
                    중요
                  </span>
                )}
                {leadItem.hasAttachment && (
                  <span className="inline-flex items-center text-[10px] text-stone-500">
                    <Paperclip className="w-3 h-3 mr-0.5" />
                    서식첨부
                  </span>
                )}
              </div>
              <h4 className="text-sm sm:text-base font-bold text-stone-900 group-hover:text-teal-700 transition-colors line-clamp-1">
                {leadItem.title}
              </h4>
              <p className="text-xs text-stone-600 line-clamp-2 mt-1 leading-relaxed">
                {leadItem.summary}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {/* List items below lead post */}
      <div className="mt-auto divide-y divide-stone-100">
        {listItems.map(item => (
          <div
            key={item.id}
            onClick={() => onSelectNewsletter && onSelectNewsletter(item)}
            className="py-2.5 px-1 flex items-center justify-between group cursor-pointer hover:bg-stone-50 rounded-xl transition-colors"
          >
            <div className="flex items-center space-x-2 min-w-0 pr-2">
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-stone-100 text-stone-600 shrink-0">
                {item.targetClass}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-stone-800 group-hover:text-teal-700 truncate">
                {item.title}
              </span>
              {item.hasAttachment && (
                <Paperclip className="w-3 h-3 text-stone-400 shrink-0" />
              )}
            </div>
            <span className="text-[11px] text-stone-400 shrink-0 font-medium">{item.createdAt}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
