import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Edit3, Paperclip, Mail, FileText, CheckCircle, Eye, School, CheckCircle2 } from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { NewsletterItem } from '../../../types';
import { FileUpload } from '../../common/FileUpload';
import { ConfirmDialog } from '../ConfirmDialog';
import { ClassManageModal } from '../ClassManageModal';

export const NewslettersTab: React.FC = () => {
  const {
    newsletters,
    addNewsletter,
    updateNewsletter,
    deleteNewsletter,
    adminEditingItem,
    setAdminEditingItem,
    institution,
  } = useData();
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('전체');
  const [isEditing, setIsEditing] = useState(false);
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const classList = ['전체', ...(institution.classes?.map(c => c.name) || ['씨앗반', '새싹반', '줄기반', '꽃잎반', '열매반'])];

  // Helper to show temporary notification
  const showNotification = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 3500);
  };
  const [formId, setFormId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [targetClass, setTargetClass] = useState('전체');
  const [author, setAuthor] = useState('원무실');
  const [createdAt, setCreatedAt] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  });
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [isImportant, setIsImportant] = useState(false);
  const [hasAttachment, setHasAttachment] = useState(false);
  const [attachmentName, setAttachmentName] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');

  useEffect(() => {
    if (adminEditingItem && adminEditingItem._type === 'newsletter') {
      openEdit(adminEditingItem);
      setAdminEditingItem(null);
    }
  }, [adminEditingItem]);

  const openNew = () => {
    setFormId(null);
    setTitle('');
    setTargetClass('전체');
    setAuthor('원무실');
    const d = new Date();
    setCreatedAt(`${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`);
    setSummary('');
    setContent('');
    setIsImportant(false);
    setHasAttachment(false);
    setAttachmentName('');
    setAttachmentUrl('');
    setIsEditing(true);
  };

  const openEdit = (item: NewsletterItem) => {
    setFormId(item.id);
    setTitle(item.title);
    setTargetClass(item.targetClass);
    setAuthor(item.author);
    setCreatedAt(item.createdAt);
    setSummary(item.summary);
    setContent(item.content);
    setIsImportant(!!item.isImportant);
    setHasAttachment(!!item.hasAttachment);
    setAttachmentName(item.attachmentName || '');
    setAttachmentUrl(item.attachmentUrl || '');
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 입력해 주세요.');
      return;
    }

    const payload = {
      title,
      targetClass,
      author,
      createdAt,
      summary: summary || title,
      content,
      isImportant,
      hasAttachment: !!attachmentUrl || hasAttachment,
      attachmentName: attachmentName || (attachmentUrl ? '가정통신문_첨부.pdf' : undefined),
      attachmentUrl: attachmentUrl || undefined,
    };

    if (formId) {
      updateNewsletter(formId, payload);
    } else {
      addNewsletter(payload);
    }

    setIsEditing(false);
  };

  const filteredNewsletters = newsletters.filter(nl => {
    const matchesSearch = nl.title.includes(search) || nl.summary.includes(search);
    const matchesClass = classFilter === '전체' || nl.targetClass === classFilter;
    return matchesSearch && matchesClass;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notificationMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
        <div>
          <h3 className="text-lg font-black text-stone-900">가정통신문(알림장) 관리</h3>
          <p className="text-xs text-stone-500">
            총 {newsletters.length}건의 가정통신문이 등록되어 있습니다.
          </p>
        </div>

        <button
          onClick={openNew}
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#F5C451] to-[#F0935C] text-stone-950 text-xs sm:text-sm font-bold shadow-xs hover:brightness-105 active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>새 가정통신문 등록</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-stone-50 p-3 rounded-2xl border border-stone-200 text-xs">
        <div className="flex items-center space-x-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {classList.map(cls => (
            <button
              key={cls}
              onClick={() => setClassFilter(cls)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors shrink-0 cursor-pointer ${
                classFilter === cls
                  ? 'bg-amber-500 text-white shadow-2xs'
                  : 'bg-white text-stone-600 hover:bg-stone-200/70 border border-stone-200'
              }`}
            >
              {cls}
            </button>
          ))}

          {/* Direct Class Name Edit Button */}
          <button
            type="button"
            onClick={() => setIsClassModalOpen(true)}
            className="px-2.5 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-bold transition-all shrink-0 inline-flex items-center space-x-1 shadow-2xs cursor-pointer ml-1"
            title="학급(반) 이름 및 구성 변경"
          >
            <Edit3 className="w-3.5 h-3.5 text-amber-700" />
            <span>반 이름 변경</span>
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="통신문 제목 검색..."
            className="w-full pl-8 pr-3 py-1.5 bg-white rounded-xl border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-amber-400 text-xs font-medium"
          />
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Newsletter List */}
      <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
        {filteredNewsletters.length === 0 ? (
          <div className="p-8 text-center text-xs text-stone-400">
            등록된 가정통신문이 없습니다.
          </div>
        ) : (
          filteredNewsletters.map(nl => (
            <div
              key={nl.id}
              className="p-4 hover:bg-amber-50/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                  {nl.isImportant && (
                    <span className="px-2 py-0.5 rounded-md bg-rose-500 text-white font-bold">
                      필독
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold">
                    {nl.targetClass}
                  </span>
                  <span className="text-stone-400">{nl.createdAt}</span>
                  <span className="text-stone-400">| {nl.author}</span>
                  {nl.hasAttachment && (
                    <span className="inline-flex items-center text-stone-500">
                      <Paperclip className="w-3 h-3 mr-0.5" />
                      {nl.attachmentName || '첨부 문서'}
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-stone-900 truncate">
                  {nl.title}
                </h4>
                <p className="text-xs text-stone-500 line-clamp-1">{nl.summary}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-1.5 shrink-0 self-end sm:self-center">
                <button
                  onClick={() => openEdit(nl)}
                  className="inline-flex items-center px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-amber-100 hover:text-amber-800 text-stone-700 text-xs font-bold transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5 mr-1" />
                  수정
                </button>
                <button
                  onClick={() => setDeleteTargetId(nl.id)}
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

      {/* Edit / Create Form Modal */}
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
                {formId ? '가정통신문 수정' : '새 가정통신문 작성'}
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
                  <label className="block font-bold text-stone-700 mb-1">대상 학급</label>
                  <select
                    value={targetClass}
                    onChange={e => setTargetClass(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-white font-medium"
                  >
                    <option value="전체">전체 (전 연령)</option>
                    {(institution.classes || []).map(cls => (
                      <option key={cls.name} value={cls.name}>
                        {cls.name} ({cls.age})
                      </option>
                    ))}
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
                  <label className="block font-bold text-stone-700 mb-1">발행 일자</label>
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
                <label className="block font-bold text-stone-700 mb-1">통신문 제목 *</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="가정통신문 제목을 입력하세요"
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
                  placeholder="대시보드 위젯에 노출될 간단한 요약문"
                  className="w-full p-2.5 rounded-xl border border-stone-200 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">상세 안내 내용 *</label>
                <textarea
                  rows={8}
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="학부모님께 전달할 가정통신문 상세 내용을 작성해 주세요."
                  required
                  className="w-full p-3 rounded-xl border border-stone-200 font-medium leading-relaxed"
                />
              </div>

              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isImportant}
                    onChange={e => setIsImportant(e.target.checked)}
                    className="w-4 h-4 rounded text-rose-500 focus:ring-rose-400"
                  />
                  <span className="font-bold text-stone-800">필독 안내로 강조 표시</span>
                </label>
              </div>

              {/* Attachment upload */}
              <div>
                <FileUpload
                  value={attachmentUrl}
                  fileName={attachmentName}
                  folder="newsletters"
                  label="통신문 서식/신청서 PDF 문서 첨부"
                  helperText="PDF, HWP, DOCX 등 첨부 (Storage에 업로드)"
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

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        title="가정통신문을 삭제하시겠습니까?"
        message="삭제된 가정통신문은 복구할 수 없습니다."
        confirmLabel="삭제"
        isDanger={true}
        onConfirm={() => {
          if (deleteTargetId) {
            deleteNewsletter(deleteTargetId);
            setDeleteTargetId(null);
          }
        }}
        onCancel={() => setDeleteTargetId(null)}
      />

      {/* Class Manage Modal */}
      <ClassManageModal
        isOpen={isClassModalOpen}
        onClose={() => setIsClassModalOpen(false)}
        onSuccess={msg => showNotification(msg)}
      />
    </div>
  );
};
