import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Edit3, Image as ImageIcon, Heart, Calendar, Eye } from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { GalleryItem } from '../../../types';
import { FileUpload } from '../../common/FileUpload';
import { ConfirmDialog } from '../ConfirmDialog';

export const GalleryTab: React.FC = () => {
  const {
    gallery,
    addGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
    adminEditingItem,
    setAdminEditingItem,
    institution,
  } = useData();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('전체');
  const [isEditing, setIsEditing] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Form state
  const [formId, setFormId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<GalleryItem['category']>('활동사진');
  const [targetClass, setTargetClass] = useState('전체');
  const [date, setDate] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  });
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageName, setImageName] = useState('');

  useEffect(() => {
    if (adminEditingItem && adminEditingItem._type === 'gallery') {
      openEdit(adminEditingItem);
      setAdminEditingItem(null);
    }
  }, [adminEditingItem]);

  const openNew = () => {
    setFormId(null);
    setTitle('');
    setCategory('활동사진');
    setTargetClass('전체');
    const d = new Date();
    setDate(`${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`);
    setDescription('');
    setImageUrl('');
    setImageName('');
    setIsEditing(true);
  };

  const openEdit = (item: GalleryItem) => {
    setFormId(item.id);
    setTitle(item.title);
    setCategory(item.category);
    setTargetClass(item.targetClass || '전체');
    setDate(item.date);
    setDescription(item.description);
    setImageUrl(item.imageUrl);
    setImageName('등록된 사진');
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) {
      alert('앨범 제목과 사진을 등록해 주세요.');
      return;
    }

    const payload = {
      title,
      category,
      targetClass: targetClass === '전체' ? undefined : targetClass,
      date,
      description,
      imageUrl,
    };

    if (formId) {
      updateGalleryItem(formId, payload);
    } else {
      addGalleryItem(payload);
    }

    setIsEditing(false);
  };

  const filteredGallery = gallery.filter(g => {
    const matchesSearch = g.title.includes(search) || g.description.includes(search);
    const matchesCat = categoryFilter === '전체' || g.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
        <div>
          <h3 className="text-lg font-black text-stone-900">갤러리 사진 관리</h3>
          <p className="text-xs text-stone-500">
            총 {gallery.length}개의 사진 앨범이 등록되어 있습니다.
          </p>
        </div>

        <button
          onClick={openNew}
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#F5C451] to-[#F0935C] text-stone-950 text-xs sm:text-sm font-bold shadow-xs hover:brightness-105 active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>새 사진 등록</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-stone-50 p-3 rounded-2xl border border-stone-200 text-xs">
        <div className="flex items-center space-x-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['전체', '활동사진', '급식사진', '체험학습', '행사'].map(cat => (
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
            placeholder="사진 제목 검색..."
            className="w-full pl-8 pr-3 py-1.5 bg-white rounded-xl border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-amber-400 text-xs font-medium"
          />
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredGallery.length === 0 ? (
          <div className="col-span-full p-8 text-center text-xs text-stone-400 bg-white rounded-2xl border border-stone-200">
            등록된 사진이 없습니다.
          </div>
        ) : (
          filteredGallery.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-md transition-shadow group flex flex-col"
            >
              <div className="relative aspect-4/3 bg-stone-100 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-stone-900/70 text-white text-[10px] font-bold">
                  {item.category}
                </span>
                {item.targetClass && (
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-bold">
                    {item.targetClass}
                  </span>
                )}
              </div>

              <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-stone-400 mb-1">
                    <span>{item.date}</span>
                    <span className="flex items-center text-rose-500 font-bold">
                      <Heart className="w-3 h-3 fill-rose-500 mr-0.5" />
                      {item.likeCount}
                    </span>
                  </div>
                  <h4 className="text-xs font-black text-stone-900 line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-stone-500 line-clamp-2 mt-1">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-end space-x-1">
                  <button
                    onClick={() => openEdit(item)}
                    className="p-1.5 rounded-lg bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-800 text-xs font-bold transition-colors"
                    title="수정"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteTargetId(item.id)}
                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-colors"
                    title="삭제"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit / Create Modal */}
      {isEditing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs"
          onClick={() => setIsEditing(false)}
        >
          <div
            className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto border border-stone-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-stone-200">
              <h4 className="text-lg font-black text-stone-900">
                {formId ? '사진 정보 수정' : '새 갤러리 사진 등록'}
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
                    <option value="활동사진">활동사진</option>
                    <option value="급식사진">급식사진</option>
                    <option value="체험학습">체험학습</option>
                    <option value="행사">행사</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">대상 학급</label>
                  <select
                    value={targetClass}
                    onChange={e => setTargetClass(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-white font-medium"
                  >
                    <option value="전체">전체 (공통)</option>
                    {(institution.classes || []).map(c => (
                      <option key={c.name} value={c.name}>{c.name} ({c.age})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">촬영/활동 일자</label>
                  <input
                    type="text"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    placeholder="YYYY.MM.DD"
                    className="w-full p-2.5 rounded-xl border border-stone-200 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">앨범 제목 *</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="예: 따뜻한 봄맞이 텃밭 감자 심기 체험"
                  required
                  className="w-full p-2.5 rounded-xl border border-stone-200 font-bold text-stone-900"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">사진 설명</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="아이들의 활동 모습에 대한 간략한 설명을 작성해 주세요."
                  className="w-full p-2.5 rounded-xl border border-stone-200 font-medium"
                />
              </div>

              {/* Photo Upload with Thumbnail Preview */}
              <div>
                <FileUpload
                  value={imageUrl}
                  fileName={imageName}
                  isImageOnly={true}
                  folder="gallery"
                  label="활동/급식 사진 첨부 *"
                  helperText="JPG, PNG, WebP 이미지 (자동 리사이즈 후 Storage 업로드)"
                  onChange={(url, name) => {
                    setImageUrl(url);
                    setImageName(name);
                  }}
                  onClear={() => {
                    setImageUrl('');
                    setImageName('');
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
        title="사진을 삭제하시겠습니까?"
        message="갤러리에서 해당 사진이 완전히 제거됩니다."
        confirmLabel="삭제"
        isDanger={true}
        onConfirm={() => {
          if (deleteTargetId) {
            deleteGalleryItem(deleteTargetId);
            setDeleteTargetId(null);
          }
        }}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
