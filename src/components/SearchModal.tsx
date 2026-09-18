import React, { useState } from 'react';
import { Search, X, Calendar, FileText, Utensils, Image as ImageIcon, ArrowRight } from 'lucide-react';
import { NoticeItem, NewsletterItem, MealItem, GalleryItem } from '../types';
import { Link } from 'react-router-dom';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  notices: NoticeItem[];
  newsletters: NewsletterItem[];
  meals: MealItem[];
  gallery: GalleryItem[];
  onSelectNotice?: (notice: NoticeItem) => void;
  onSelectNewsletter?: (newsletter: NewsletterItem) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  notices,
  newsletters,
  meals,
  gallery,
  onSelectNotice,
  onSelectNewsletter,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const trimmed = query.trim().toLowerCase();

  const filteredNotices = trimmed
    ? notices.filter(n => n.title.toLowerCase().includes(trimmed) || n.summary.toLowerCase().includes(trimmed))
    : [];

  const filteredNewsletters = trimmed
    ? newsletters.filter(n => n.title.toLowerCase().includes(trimmed) || n.summary.toLowerCase().includes(trimmed))
    : [];

  const filteredMeals = trimmed
    ? meals.filter(m => m.lunch.some(item => item.toLowerCase().includes(trimmed)) || m.date.includes(trimmed))
    : [];

  const filteredGallery = trimmed
    ? gallery.filter(g => g.title.toLowerCase().includes(trimmed) || g.description.toLowerCase().includes(trimmed))
    : [];

  const totalResults =
    filteredNotices.length + filteredNewsletters.length + filteredMeals.length + filteredGallery.length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24 bg-stone-900/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-amber-100 flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-5 py-4 border-b border-stone-100 bg-amber-50/50">
          <Search className="w-5 h-5 text-amber-500 mr-3 shrink-0" />
          <input
            type="text"
            className="w-full text-base sm:text-lg bg-transparent border-none outline-hidden text-stone-800 placeholder-stone-400"
            placeholder="공지, 가정통신문, 식단 메뉴, 활동 사진 검색..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-stone-400 hover:text-stone-600 p-1 mr-2 rounded-full"
              aria-label="입력 내용 지우기"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 text-stone-500 hover:text-stone-700 bg-white hover:bg-stone-100 rounded-full border border-stone-200 transition-colors"
            aria-label="검색창 닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results Area */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {!query ? (
            <div className="text-center py-10 text-stone-400">
              <p className="text-sm font-medium mb-3">자주 찾는 추천 검색어</p>
              <div className="flex flex-wrap justify-center gap-2">
                {['신학기 준비물', '숲체험', '건강검진', '떡갈비', '생일파티', '보육료', '오리엔테이션'].map(term => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1.5 bg-amber-100/60 hover:bg-amber-200/70 text-amber-800 text-xs font-semibold rounded-full transition-colors"
                  >
                    #{term}
                  </button>
                ))}
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div className="text-center py-12 text-stone-400">
              <p className="text-base font-medium text-stone-600">"{query}"에 대한 검색 결과가 없습니다.</p>
              <p className="text-xs text-stone-400 mt-1">다른 단어로 검색하시거나 단어 철자를 확인해 주세요.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Notices */}
              {filteredNotices.length > 0 && (
                <div>
                  <h4 className="flex items-center text-xs font-bold text-coral-600 text-[#F0935C] uppercase tracking-wider mb-2">
                    <FileText className="w-3.5 h-3.5 mr-1" />
                    공지사항 ({filteredNotices.length})
                  </h4>
                  <div className="space-y-2">
                    {filteredNotices.map(item => (
                      <button
                        key={item.id}
                        onClick={() => {
                          if (onSelectNotice) onSelectNotice(item);
                          onClose();
                        }}
                        className="w-full text-left p-3 rounded-xl bg-stone-50 hover:bg-amber-50/80 transition-colors border border-stone-100 flex items-start justify-between group"
                      >
                        <div>
                          <span className="inline-block text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full mr-2">
                            {item.category}
                          </span>
                          <span className="text-sm font-semibold text-stone-800 group-hover:text-amber-700">
                            {item.title}
                          </span>
                          <p className="text-xs text-stone-500 line-clamp-1 mt-1">{item.summary}</p>
                        </div>
                        <span className="text-[11px] text-stone-400 shrink-0 ml-3">{item.createdAt}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Newsletters */}
              {filteredNewsletters.length > 0 && (
                <div>
                  <h4 className="flex items-center text-xs font-bold text-teal-600 uppercase tracking-wider mb-2">
                    <FileText className="w-3.5 h-3.5 mr-1" />
                    가정통신문 / 알림장 ({filteredNewsletters.length})
                  </h4>
                  <div className="space-y-2">
                    {filteredNewsletters.map(item => (
                      <button
                        key={item.id}
                        onClick={() => {
                          if (onSelectNewsletter) onSelectNewsletter(item);
                          onClose();
                        }}
                        className="w-full text-left p-3 rounded-xl bg-stone-50 hover:bg-teal-50/80 transition-colors border border-stone-100 flex items-start justify-between group cursor-pointer"
                      >
                        <div>
                          <span className="inline-block text-[11px] font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full mr-2">
                            {item.targetClass}
                          </span>
                          <span className="text-sm font-semibold text-stone-800 group-hover:text-teal-700">
                            {item.title}
                          </span>
                          <p className="text-xs text-stone-500 line-clamp-1 mt-1">{item.summary}</p>
                        </div>
                        <span className="text-[11px] text-stone-400 shrink-0 ml-3">{item.createdAt}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Meals */}
              {filteredMeals.length > 0 && (
                <div>
                  <h4 className="flex items-center text-xs font-bold text-amber-600 uppercase tracking-wider mb-2">
                    <Utensils className="w-3.5 h-3.5 mr-1" />
                    식단 검색 ({filteredMeals.length})
                  </h4>
                  <div className="space-y-2">
                    {filteredMeals.map(m => (
                      <Link
                        key={m.id}
                        to="/meal/monthly"
                        onClick={onClose}
                        className="block p-3 rounded-xl bg-stone-50 hover:bg-amber-50 transition-colors border border-stone-100"
                      >
                        <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                          <span className="font-bold text-amber-700">{m.date} ({m.dayOfWeek}) 식단</span>
                          <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">{m.calories} kcal</span>
                        </div>
                        <p className="text-sm text-stone-700 font-medium">{m.lunch.join(', ')}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Gallery */}
              {filteredGallery.length > 0 && (
                <div>
                  <h4 className="flex items-center text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">
                    <ImageIcon className="w-3.5 h-3.5 mr-1" />
                    활동 갤러리 ({filteredGallery.length})
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {filteredGallery.map(g => (
                      <Link
                        key={g.id}
                        to="/events/gallery"
                        onClick={onClose}
                        className="group relative rounded-xl overflow-hidden aspect-video border border-stone-200"
                      >
                        <img
                          src={g.imageUrl}
                          alt={g.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-2 flex flex-col justify-end">
                          <span className="text-white text-xs font-medium line-clamp-1">{g.title}</span>
                          <span className="text-stone-300 text-[10px]">{g.date}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
