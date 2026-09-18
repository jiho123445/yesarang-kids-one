import React, { useState, useEffect } from 'react';
import { Plus, Search, Pin, Trash2, Edit3, Paperclip, FileText, CheckCircle, Eye, Sparkles } from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { NoticeItem } from '../../../types';
import { FileUpload } from '../../common/FileUpload';
import { ConfirmDialog } from '../ConfirmDialog';

export const NoticesTab: React.FC = () => {
  const { notices, addNotice, updateNotice, deleteNotice, adminEditingItem, setAdminEditingItem } = useData();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('전체');
  const [isEditing, setIsEditing] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Form state
  const [formId, setFormId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<NoticeItem['category']>('공지');
  const [author, setAuthor] = useState('원무실');
  const [createdAt, setCreatedAt] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  });
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [isNew, setIsNew] = useState(true);
  const [hasAttachment, setHasAttachment] = useState(false);
  const [attachmentName, setAttachmentName] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');

  // Auto-fill if adminEditingItem is provided
  useEffect(() => {
    if (adminEditingItem && adminEditingItem._type === 'notice') {
      openEdit(adminEditingItem);
      setAdminEditingItem(null);
    }
  }, [adminEditingItem]);

  const openNew = () => {
    setFormId(null);
    setTitle('');
    setCategory('공지');
    setAuthor('원무실');
    const d = new Date();
    setCreatedAt(`${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`);
    setSummary('');
    setContent('');
    setIsPinned(false);
    setIsNew(true);
    setHasAttachment(false);
    setAttachmentName('');
    setAttachmentUrl('');
    setIsEditing(true);
  };

  const openEdit = (item: NoticeItem) => {
    setFormId(item.id);
    setTitle(item.title);
    setCategory(item.category);
    setAuthor(item.author);
    setCreatedAt(item.createdAt);
    setSummary(item.summary);
    setContent(item.content);
    setIsPinned(!!item.isPinned);
    setIsNew(!!item.isNew);
    setHasAttachment(!!item.hasAttachment);
    setAttachmentName(item.attachmentName || '');
    setAttachmentUrl(item.attachmentUrl || '');
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('제목과 상세 내용을 입력해 주세요.');
      return;
    }

    const itemPayload = {
      title,
      category,
      author,
      createdAt,
      summary: summary || title,
      content,
      isPinned,
      isNew,
      hasAttachment: !!attachmentUrl || hasAttachment,
      attachmentName: attachmentName || (attachmentUrl ? '첨부파일.pdf' : undefined),
      attachmentUrl: attachmentUrl || undefined,
    };

    if (formId) {
      updateNotice(formId, itemPayload);
    } else {
      addNotice(itemPayload);
    }

    setIsEditing(false);
  };

  const filteredNotices = notices.filter(n => {
    const matchesSearch = n.title.includes(search) || n.summary.includes(search);
    const matchesCat = categoryFilter === '전체' || n.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
        <div>
          <h3 className="text-lg font-black text-stone-900">공지사항 관리</h3>
          <p className="text-xs text-stone-500">
            총 {notices.length}건의 공지사항이 등록되어 있습니다.
          </p>
        </div>

        <button
          onClick={openNew}
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#F5C451] to-[#F0935C] text-stone-950 text-xs sm:text-sm font-bold shadow-xs hover:brightness-105 active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>새 공지 등록</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-stone-50 p-3 rounded-2xl border border-stone-200 text-xs">
        <div className="flex items-center space-x-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['전체', '공지', '안내', '모집', '행사'].map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors shrink-0 ${
                categoryFilter === cat
                  ? 'bg-amber-500 text-white'
                  : 'bg-white text-stone-600 hover:bg-stone-200/70 border border-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="공지 제목 검색..."
            className="w-full pl-8 pr-3 py-1.5 bg-white rounded-xl border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-amber-400 text-xs font-medium"
          />
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Notices List */}
      <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
        {filteredNotices.length === 0 ? (
          <div className="p-8 text-center text-xs text-stone-400">
            조건에 부합하는 공지사항이 없습니다.
          </div>
        ) : (
          filteredNotices.map(notice => (
            <div
              key={notice.id}
              className="p-4 hover:bg-amber-50/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                  {notice.isPinned && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-500 text-white font-bold">
                      <Pin className="w-3 h-3 mr-0.5 fill-white" />
                      중요
                    </span>
                  )}
                  {notice.isNew && (
                    <span className="px-1.5 py-0.5 rounded-md bg-rose-100 text-rose-700 font-bold">
                      NEW
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 font-semibold">
                    {notice.category}
                  </span>
                  <span className="text-stone-400">{notice.createdAt}</span>
                  <span className="text-stone-400">| {notice.author}</span>
                  {notice.hasAttachment && (
                    <span className="inline-flex items-center text-stone-500">
                      <Paperclip className="w-3 h-3 mr-0.5" />
                      {notice.attachmentName || '첨부파일'}
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-stone-900 truncate">
                  {notice.title}
                </h4>
                <p className="text-xs text-stone-500 line-clamp-1">{notice.summary}</p>
              </div>

              {/* Edit / Delete actions */}
              <div className="flex items-center space-x-1.5 shrink-0 self-end sm:self-center">
                <button
                  onClick={() => openEdit(notice)}
                  className="inline-flex items-center px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-amber-100 hover:text-amber-800 text-stone-700 text-xs font-bold transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5 mr-1" />
                  수정
                </button>
                <button
                  onClick={() => setDeleteTargetId(notice.id)}
                  className="inline-flex items-center px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  삭제
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create / Edit Form Modal */}
      {isEditing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs"
          onClick={() => setIsEditing(false)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto border border-stone-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-stone-200">
              <h4 className="text-lg font-black text-stone-900">
                {formId ? '공지사항 수정' : '새 공지사항 작성'}
              </h4>
              <button
                onClick={() => setIsEditing(false)}
                className="text-stone-400 hover:text-stone-700 text-sm font-bold"
              >
                닫기 ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">카테고리</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-white font-medium"
                  >
                    <option value="공지">공지</option>
                    <option value="안내">안내</option>
                    <option value="모집">모집</option>
                    <option value="행사">행사</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">작성자</label>
                  <input
                    type="text"
                    value={author}
                    onChange={e => setAuthor(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">작성일자</label>
                  <input
                    type="text"
                    value={createdAt}
                    onChange={e => setCreatedAt(e.target.value)}
                    placeholder="YYYY.MM.DD"
                    className="w-full p-2.5 rounded-xl border border-stone-200 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">공지 제목 *</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="공지사항 제목을 입력하세요"
                  required
                  className="w-full p-2.5 rounded-xl border border-stone-200 font-bold text-stone-900"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">한 줄 요약</label>
                <input
                  type="text"
                  value={summary}
                  onChange={e => setSummary(e.target.value)}
                  placeholder="대시보드 위젯에 노출될 간단한 요약문 (미입력 시 제목과 동일)"
                  className="w-full p-2.5 rounded-xl border border-stone-200 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">상세 내용 *</label>
                <textarea
                  rows={8}
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="공지 상세 내용을 작성해 주세요."
                  required
                  className="w-full p-3 rounded-xl border border-stone-200 font-medium leading-relaxed"
                />
              </div>

              {/* Pin & New options */}
              <div className="flex flex-wrap items-center gap-6 p-3 rounded-xl bg-stone-50 border border-stone-200">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPinned}
                    onChange={e => setIsPinned(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
                  />
                  <span className="font-bold text-stone-800">상단 고정 (중요 공지)</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isNew}
                    onChange={e => setIsNew(e.target.checked)}
                    className="w-4 h-4 rounded text-rose-500 focus:ring-rose-400"
                  />
                  <span className="font-bold text-stone-800">NEW 배지 표시</span>
                </label>
              </div>

              {/* Attachment upload */}
              <div>
                <FileUpload
                  value={attachmentUrl}
                  fileName={attachmentName}
                  label="첨부파일 업로드 (문서, 서식, PDF 등)"
                  helperText="클라우드/스토리지 연동 준비 완료 (Base64 변환 후 브라우저 보관)"
                  onChange={(url, name) => {
                    setAttachmentUrl(url);
                    setAttachmentName(name);
                    setHasAttachment(true);
                  }}
                  onClear={() => {
                    setAttachmentUrl('');
                    setAttachmentName('');
                    setHasAttachment(false);
                  }}
                />
              </div>

              <div className="pt-4 flex items-center justify-end space-x-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 font-bold hover:bg-stone-100 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F5C451] to-[#F0935C] text-stone-950 font-black shadow-md hover:brightness-105 active:scale-95 transition-all"
                >
                  {formId ? '수정 완료' : '등록하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        title="공지사항을 삭제하시겠습니까?"
        message="삭제된 공지사항은 복구할 수 없습니다."
        confirmLabel="삭제"
        isDanger={true}
        onConfirm={() => {
          if (deleteTargetId) {
            deleteNotice(deleteTargetId);
            setDeleteTargetId(null);
          }
        }}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
