import React from 'react';
import { X, Calendar, User, Eye, Download, Paperclip, Share2 } from 'lucide-react';
import { NoticeItem, NewsletterItem } from '../types';

interface PostDetailModalProps {
  item: NoticeItem | NewsletterItem | null;
  type: 'notice' | 'newsletter';
  onClose: () => void;
}

export const PostDetailModal: React.FC<PostDetailModalProps> = ({ item, type, onClose }) => {
  if (!item) return null;

  const isNotice = type === 'notice';
  const categoryOrClass = isNotice
    ? (item as NoticeItem).category
    : (item as NewsletterItem).targetClass;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200 flex flex-col max-h-[85vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-stone-100 bg-amber-50/50">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#F0935C] text-white">
                {isNotice ? `공지 · ${categoryOrClass}` : `통신문 · ${categoryOrClass}`}
              </span>
              <span className="text-xs text-stone-400 font-medium">홍천 예사랑어린이집</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white hover:bg-stone-100 text-stone-500 border border-stone-200 transition-colors"
              aria-label="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h3 className="text-lg sm:text-xl font-black text-stone-900 leading-snug">
            {item.title}
          </h3>

          <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 mt-3 pt-3 border-t border-amber-200/50">
            <span className="flex items-center">
              <User className="w-3.5 h-3.5 mr-1 text-stone-400" />
              {item.author}
            </span>
            <span className="flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1 text-stone-400" />
              {item.createdAt}
            </span>
            <span className="flex items-center">
              <Eye className="w-3.5 h-3.5 mr-1 text-stone-400" />
              조회수 {item.views}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 leading-relaxed text-sm sm:text-base text-stone-800">
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs sm:text-sm text-stone-600 font-medium italic">
            요약: {item.summary}
          </div>

          <div className="whitespace-pre-line text-stone-800 leading-loose">
            {item.content}
          </div>

          {/* Attachment Box if any */}
          {item.hasAttachment && item.attachmentName && (
            <div className="mt-6 p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center justify-between gap-3">
              <div className="flex items-center space-x-2.5 truncate">
                <div className="w-8 h-8 rounded-lg bg-amber-200 flex items-center justify-center text-amber-800 shrink-0">
                  <Paperclip className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <span className="text-xs text-stone-500 block font-medium">첨부파일</span>
                  <span className="text-xs sm:text-sm font-bold text-stone-800 truncate">
                    {item.attachmentName}
                  </span>
                </div>
              </div>

              <button
                onClick={() => alert(`[안내] '${item.attachmentName}' 파일 다운로드를 준비 중입니다.`)}
                className="inline-flex items-center px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold text-xs shadow-2xs transition-colors shrink-0"
              >
                <Download className="w-3.5 h-3.5 mr-1" />
                <span>다운로드</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
