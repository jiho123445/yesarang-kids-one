import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar as CalendarIcon, Camera, Video, ChevronLeft, ChevronRight, Clock, MapPin, Heart, Plus, Edit2, Trash2 } from 'lucide-react';
import { CalendarEvent, GalleryItem } from '../types';
import { useData } from '../context/DataContext';

interface EventsPageProps {
  events: CalendarEvent[];
  gallery: GalleryItem[];
  onSelectGalleryItem: (item: GalleryItem) => void;
}

const TABS = [
  { id: 'monthly', label: '월간 행사', path: '/events/monthly' },
  { id: 'gallery', label: '행사 사진첩', path: '/events/gallery' },
  { id: 'media', label: '홍보 영상', path: '/events/media' },
];

export const EventsPage: React.FC<EventsPageProps> = ({
  events,
  gallery,
  onSelectGalleryItem,
}) => {
  const { subtab = 'monthly' } = useParams<{ subtab?: string }>();
  const [selectedMonth, setSelectedMonth] = useState<number>(3);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const { isAdmin, openAdminWithTab, deleteEvent, deleteGalleryItem } = useData();

  const filteredEvents = events.filter(e => e.month === selectedMonth);

  const filteredGallery = gallery.filter(g => {
    if (selectedCategory === '전체') return true;
    return g.category === selectedCategory;
  });

  const handleDeleteEvent = (e: React.MouseEvent, id: string, title: string) => {
    e.stopPropagation();
    if (window.confirm(`"${title}" 일정을 삭제하시겠습니까?`)) {
      deleteEvent(id);
    }
  };

  const handleDeleteGallery = (e: React.MouseEvent, id: string, title: string) => {
    e.stopPropagation();
    if (window.confirm(`"${title}" 사진을 삭제하시겠습니까?`)) {
      deleteGalleryItem(id);
    }
  };

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb & Title */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center text-xs font-bold text-[#F0935C] bg-orange-50 px-3 py-1 rounded-full mb-2">
            <span>행사와 일정</span>
            <span className="mx-1.5">/</span>
            <span className="text-stone-800">
              {TABS.find(t => t.id === subtab)?.label || '월간 행사'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-stone-900 tracking-tight">
            예사랑 행사와 일정
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            다채로운 활동과 행복한 추억이 가득한 행사 소식입니다.
          </p>
        </div>

        {/* Admin Quick Action Button */}
        {isAdmin && (
          <button
            onClick={() => openAdminWithTab(subtab === 'gallery' ? 'gallery' : 'events')}
            className="self-start sm:self-auto inline-flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{subtab === 'gallery' ? '사진 업로드' : '새 행사/일정 등록'}</span>
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

      {/* Subtab 1: 월간 행사 달력 뷰 */}
      {subtab === 'monthly' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Month Selector bar */}
          <div className="bg-white rounded-3xl p-6 shadow-md border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-[#F0935C]/20 text-[#F0935C] flex items-center justify-center font-bold">
                <CalendarIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-stone-900">2026년 {selectedMonth}월 일정표</h3>
                <span className="text-xs text-stone-400">월별 상세 행사 계획</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {[3, 4, 5, 6].map(m => (
                <button
                  key={m}
                  onClick={() => setSelectedMonth(m)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedMonth === m
                      ? 'bg-[#F0935C] text-white shadow-xs'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  {m}월
                </button>
              ))}
            </div>
          </div>

          {/* Event items list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEvents.length === 0 ? (
              <div className="col-span-2 p-12 text-center text-stone-400 bg-white rounded-3xl border border-stone-200">
                <p className="text-sm font-semibold">{selectedMonth}월에 등록된 행사가 없습니다.</p>
              </div>
            ) : (
              filteredEvents.map(ev => (
                <div
                  key={ev.id}
                  className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800">
                        {ev.month}월 {ev.day}일
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-stone-100 text-stone-600">
                          {ev.category}
                        </span>
                        {isAdmin && (
                          <div className="flex items-center space-x-1 pl-1 border-l border-stone-200">
                            <button
                              onClick={() => openAdminWithTab('events')}
                              className="p-1 rounded text-stone-400 hover:text-amber-700 hover:bg-amber-100"
                              title="수정"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => handleDeleteEvent(e, ev.id, ev.title)}
                              className="p-1 rounded text-stone-400 hover:text-rose-600 hover:bg-rose-100"
                              title="삭제"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <h4 className="text-base font-black text-stone-900 mb-1">{ev.title}</h4>
                    {ev.description && (
                      <p className="text-xs text-stone-600 leading-relaxed mt-1">
                        {ev.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
                    <span className="flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1 text-stone-400" />
                      {ev.time || '시간 미정'}
                    </span>
                    <span className="flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-stone-400" />
                      {ev.location || '원내'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Subtab 2: 행사 사진첩 */}
      {subtab === 'gallery' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {['전체', '체험학습', '활동사진', '급식사진', '행사'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-stone-700 hover:bg-emerald-50 border border-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGallery.map(item => (
              <div
                key={item.id}
                onClick={() => onSelectGalleryItem(item)}
                className="group relative rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white border border-stone-200 cursor-pointer flex flex-col aspect-4/3"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full text-xs font-black backdrop-blur-xs bg-white/90 text-stone-800">
                    {item.category}
                  </span>
                </div>
                <div className="absolute top-3 right-3 flex items-center space-x-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-black/40 text-white backdrop-blur-xs">
                    <Heart className="w-3 h-3 text-rose-400 fill-rose-400 mr-1" />
                    {item.likeCount}
                  </span>
                  {isAdmin && (
                    <button
                      onClick={(e) => handleDeleteGallery(e, item.id, item.title)}
                      className="p-1 rounded-full bg-rose-600/90 text-white hover:bg-rose-700 transition-colors shadow-xs"
                      title="사진 삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 text-white">
                  <span className="text-[11px] text-stone-300 block mb-0.5">{item.date}</span>
                  <h4 className="text-sm font-bold text-white group-hover:text-amber-300 line-clamp-1">
                    {item.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab 3: 홍보 영상 */}
      {subtab === 'media' && (
        <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-stone-200 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Video className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-stone-900">
              홍천 예사랑어린이집 홍보 및 교육활동 영상
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
              아이들의 하루 일과와 숲체험, 음악 활동을 담은 홍보 영상입니다. 영상은 원아 초상권 보호를 위해 학부모 인증 후 열람하실 수 있습니다.
            </p>

            <div className="relative rounded-2xl overflow-hidden aspect-video bg-stone-900 flex items-center justify-center shadow-inner mt-4">
              <img
                src="https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=1200&auto=format&fit=crop&q=80"
                alt="영상 썸네일"
                className="w-full h-full object-cover opacity-50"
              />
              <div className="absolute flex flex-col items-center">
                <button
                  onClick={() => alert('학부모 전용 영상 뷰어는 추후 키즈노트 및 Firebase 연동 시 제공됩니다.')}
                  className="w-16 h-16 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-pointer"
                  aria-label="영상 재생"
                >
                  <Video className="w-7 h-7 fill-current ml-0.5" />
                </button>
                <span className="text-white text-xs font-bold mt-2 drop-shadow-md">
                  영상 재생하기 (학부모 인증)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
