import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Search, Bell, Mail, FileText, Paperclip, Eye, Calendar, Sparkles, Plus, Edit2, Trash2 } from 'lucide-react';
import { NoticeItem, NewsletterItem } from '../types';
import { useData } from '../context/DataContext';

interface BoardPageProps {
  notices: NoticeItem[];
  newsletters: NewsletterItem[];
  onSelectNotice: (notice: NoticeItem) => void;
  onSelectNewsletter: (newsletter: NewsletterItem) => void;
}

const TABS = [
  { id: 'notice', label: '공지사항', path: '/board/notice' },
  { id: 'newsletter', label: '가정통신문(알림장)', path: '/board/newsletter' },
  { id: 'news', label: '어린이집 소식', path: '/board/news' },
];

export const BoardPage: React.FC<BoardPageProps> = ({
  notices,
  newsletters,
  onSelectNotice,
  onSelectNewsletter,
}) => {
  const { subtab = 'notice' } = useParams<{ subtab?: string }>();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const { isAdmin, openAdminWithTab, deleteNotice, deleteNewsletter } = useData();

  const filteredNotices = notices.filter(n => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      n.summary.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchesCat = selectedCategory === '전체' || n.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const filteredNewsletters = newsletters.filter(nl => {
    const matchesSearch =
      nl.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      nl.summary.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchesCat = selectedCategory === '전체' || nl.targetClass === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleCreateNew = () => {
    if (subtab === 'notice' || subtab === 'news') {
      openAdminWithTab('notices');
    } else {
      openAdminWithTab('newsletters');
    }
  };

  const handleDeleteNotice = (e: React.MouseEvent, id: string, title: string) => {
    e.stopPropagation();
    if (window.confirm(`"${title}" 공지사항을 삭제하시겠습니까?`)) {
      deleteNotice(id);
    }
  };

  const handleDeleteNewsletter = (e: React.MouseEvent, id: string, title: string) => {
    e.stopPropagation();
    if (window.confirm(`"${title}" 가정통신문을 삭제하시겠습니까?`)) {
      deleteNewsletter(id);
    }
  };

  const handleEditNotice = (e: React.MouseEvent) => {
    e.stopPropagation();
    openAdminWithTab('notices');
  };

  const handleEditNewsletter = (e: React.MouseEvent) => {
    e.stopPropagation();
    openAdminWithTab('newsletters');
  };

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb & Title */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center text-xs font-bold text-[#F0935C] bg-orange-50 px-3 py-1 rounded-full mb-2">
            <span>알림마당</span>
            <span className="mx-1.5">/</span>
            <span className="text-stone-800">
              {TABS.find(t => t.id === subtab)?.label || '공지사항'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-stone-900 tracking-tight">
            예사랑 알림마당
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            원내 중요한 공지사항과 가정통신문을 확인하실 수 있습니다.
          </p>
        </div>

        {/* Admin Quick Action Button */}
        {isAdmin && (
          <button
            onClick={handleCreateNew}
            className="self-start sm:self-auto inline-flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{subtab === 'newsletter' ? '가정통신문 등록' : '새 공지사항 등록'}</span>
          </button>
        )}
      </div>

      {/* Subtab Navigation Pills (Strictly 1 Single Line) */}
      <div className="flex flex-nowrap overflow-x-auto scrollbar-none gap-2 pb-4 border-b border-stone-200/80 mb-6">
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

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
        {/* Category filters */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {subtab === 'notice'
            ? ['전체', '공지', '안내', '행사', '모집'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-amber-500 text-stone-900 font-extrabold'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {cat}
                </button>
              ))
            : ['전체', '새싹반', '꽃잎·열매반'].map(cls => (
                <button
                  key={cls}
                  onClick={() => setSelectedCategory(cls)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                    selectedCategory === cls
                      ? 'bg-teal-500 text-white font-extrabold'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {cls}
                </button>
              ))}
        </div>

        {/* Keyword Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="제목 또는 내용 검색..."
            value={searchKeyword}
            onChange={e => setSearchKeyword(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm rounded-xl border border-stone-200 focus:outline-hidden focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
          />
        </div>
      </div>

      {/* Notice List */}
      {subtab === 'notice' && (
        <div className="bg-white rounded-3xl overflow-hidden shadow-md border border-stone-200 divide-y divide-stone-100">
          {filteredNotices.length === 0 ? (
            <div className="p-12 text-center text-stone-400">
              <p className="font-semibold text-sm">일치하는 공지사항이 없습니다.</p>
            </div>
          ) : (
            filteredNotices.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectNotice(item)}
                className="p-5 sm:p-6 hover:bg-amber-50/50 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="flex items-start space-x-3 flex-1 min-w-0">
                  <span className="shrink-0 px-2.5 py-1 rounded-full text-xs font-bold bg-[#F0935C]/20 text-[#F0935C] mt-0.5">
                    {item.category}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm sm:text-base font-bold text-stone-900 group-hover:text-[#F0935C] transition-colors line-clamp-1">
                        {item.title}
                      </h3>
                      {item.isNew && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-rose-500 text-white shrink-0">
                          NEW
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-500 line-clamp-1 mt-1 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-xs text-stone-400 shrink-0 self-end sm:self-center">
                  {item.hasAttachment && (
                    <span className="flex items-center text-stone-500">
                      <Paperclip className="w-3.5 h-3.5 mr-0.5" />
                      첨부
                    </span>
                  )}
                  <span className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1" />
                    {item.createdAt}
                  </span>
                  <span className="flex items-center">
                    <Eye className="w-3.5 h-3.5 mr-1" />
                    {item.views}
                  </span>

                  {/* Inline Admin Actions */}
                  {isAdmin && (
                    <div className="flex items-center space-x-1 pl-2 border-l border-stone-200">
                      <button
                        onClick={(e) => handleEditNotice(e)}
                        className="p-1 rounded text-stone-500 hover:text-amber-700 hover:bg-amber-100"
                        title="CMS에서 수정"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteNotice(e, item.id, item.title)}
                        className="p-1 rounded text-stone-500 hover:text-rose-600 hover:bg-rose-100"
                        title="삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Newsletter (가정통신문) List */}
      {subtab === 'newsletter' && (
        <div className="bg-white rounded-3xl overflow-hidden shadow-md border border-stone-200 divide-y divide-stone-100">
          {filteredNewsletters.length === 0 ? (
            <div className="p-12 text-center text-stone-400">
              <p className="font-semibold text-sm">일치하는 가정통신문이 없습니다.</p>
            </div>
          ) : (
            filteredNewsletters.map(item => (
              <div
                key={item.id}
                onClick={() => onSelectNewsletter(item)}
                className="p-5 sm:p-6 hover:bg-teal-50/50 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="flex items-start space-x-3 flex-1 min-w-0">
                  <span className="shrink-0 px-2.5 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800 mt-0.5">
                    {item.targetClass}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm sm:text-base font-bold text-stone-900 group-hover:text-teal-700 transition-colors line-clamp-1">
                        {item.title}
                      </h3>
                      {item.isImportant && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-rose-500 text-white shrink-0">
                          중요
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-500 line-clamp-1 mt-1 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-xs text-stone-400 shrink-0 self-end sm:self-center">
                  {item.hasAttachment && (
                    <span className="flex items-center text-stone-500">
                      <Paperclip className="w-3.5 h-3.5 mr-0.5" />
                      동의서
                    </span>
                  )}
                  <span className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1" />
                    {item.createdAt}
                  </span>
                  <span className="flex items-center">
                    <Eye className="w-3.5 h-3.5 mr-1" />
                    {item.views}
                  </span>

                  {/* Inline Admin Actions */}
                  {isAdmin && (
                    <div className="flex items-center space-x-1 pl-2 border-l border-stone-200">
                      <button
                        onClick={(e) => handleEditNewsletter(e)}
                        className="p-1 rounded text-stone-500 hover:text-amber-700 hover:bg-amber-100"
                        title="CMS에서 수정"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteNewsletter(e, item.id, item.title)}
                        className="p-1 rounded text-stone-500 hover:text-rose-600 hover:bg-rose-100"
                        title="삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* News (어린이집 소식) List */}
      {subtab === 'news' && (
        <div className="space-y-4">
          <div className="bg-amber-50/70 p-6 rounded-3xl border border-amber-200 flex items-center space-x-3">
            <Sparkles className="w-6 h-6 text-[#F0935C] shrink-0" />
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">
              홍천 예사랑어린이집의 활기찬 일상 소식과 지역사회 연계 소식을 실시간으로 전해드립니다.
            </p>
          </div>

          <div className="bg-white rounded-3xl overflow-hidden shadow-md border border-stone-200 divide-y divide-stone-100">
            {notices.map(item => (
              <div
                key={item.id}
                onClick={() => onSelectNotice(item)}
                className="p-5 hover:bg-stone-50 transition-colors cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center space-x-3 min-w-0 pr-4">
                  <span className="w-2 h-2 rounded-full bg-[#F0935C] shrink-0" />
                  <span className="text-sm font-bold text-stone-800 truncate">{item.title}</span>
                </div>
                <span className="text-xs text-stone-400 shrink-0">{item.createdAt}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
