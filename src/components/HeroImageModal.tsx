import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  X,
  RotateCcw,
  Sparkles,
  Check,
  CheckCircle2,
  Image as ImageIcon,
  Type,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { handleFileUpload } from '../utils/fileUpload';
import {
  DEFAULT_HERO_IMAGE,
  DEFAULT_HERO_BADGE,
  DEFAULT_HERO_CAPTION,
  HERO_PRESETS,
  HeroPreset,
} from '../data/heroPresets';

interface HeroImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavedToast: (msg: string) => void;
}

export const HeroImageModal: React.FC<HeroImageModalProps> = ({
  isOpen,
  onClose,
  onSavedToast,
}) => {
  const { institution, updateInstitution } = useData();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'preset' | 'url'>('upload');
  const [selectedImage, setSelectedImage] = useState(
    institution.heroImage || DEFAULT_HERO_IMAGE
  );
  const [badgeText, setBadgeText] = useState(
    institution.heroBadge || DEFAULT_HERO_BADGE
  );
  const [captionText, setCaptionText] = useState(
    institution.heroCaption || DEFAULT_HERO_CAPTION
  );
  const [customUrl, setCustomUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleFileProcess = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일(JPG, PNG, WebP 등)만 첨부할 수 있습니다.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('10MB 이하의 이미지만 업로드 가능합니다.');
      return;
    }

    try {
      setIsProcessing(true);
      const dataUrl = await handleFileUpload(file, { maxWidth: 1200, quality: 0.85 });
      setSelectedImage(dataUrl);
    } catch (err) {
      console.error(err);
      alert('이미지 처리 중 오류가 발생했습니다. 다른 사진으로 시도해 주세요.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleSelectPreset = (preset: HeroPreset) => {
    setSelectedImage(preset.imageUrl);
    setBadgeText(preset.badge);
    setCaptionText(preset.caption);
  };

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) return;
    setSelectedImage(customUrl.trim());
    setCustomUrl('');
  };

  const handleResetToDefault = () => {
    if (window.confirm('기본 대문 이미지와 문구로 되돌리시겠습니까?')) {
      setSelectedImage(DEFAULT_HERO_IMAGE);
      setBadgeText(DEFAULT_HERO_BADGE);
      setCaptionText(DEFAULT_HERO_CAPTION);
    }
  };

  const handleSave = () => {
    updateInstitution({
      heroImage: selectedImage,
      heroBadge: badgeText.trim() || DEFAULT_HERO_BADGE,
      heroCaption: captionText.trim() || DEFAULT_HERO_CAPTION,
    });
    onSavedToast('홈페이지 대문 이미지가 성공적으로 변경되었습니다.');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl border border-stone-200 w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-150 my-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-gradient-to-r from-amber-50 to-orange-50">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-400 to-[#F0935C] text-stone-950 flex items-center justify-center font-bold shadow-xs">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-stone-900">홈페이지 대문 이미지 변경</h3>
              <p className="text-xs text-stone-500">
                메인 첫 화면에 크게 노출되는 대표 활동 사진과 캡션을 자유롭게 설정합니다.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-stone-200/60 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Live Preview Card */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-stone-700 flex items-center">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 mr-1" />
                현재 대문 적용 미리보기
              </span>
              <button
                type="button"
                onClick={handleResetToDefault}
                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl text-[11px] font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors cursor-pointer"
                title="기본 사진과 문구로 초기화"
              >
                <RotateCcw className="w-3 h-3 text-stone-500" />
                <span>기본으로 복원</span>
              </button>
            </div>

            <div className="relative rounded-2xl overflow-hidden aspect-16/9 sm:aspect-21/9 border-2 border-amber-300 shadow-md bg-stone-900">
              <img
                src={selectedImage}
                alt="대문 미리보기"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-stone-950/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#F0935C] text-[11px] font-bold mb-1 shadow-xs">
                    {badgeText || '숲체험 & 오감놀이'}
                  </span>
                  <p className="text-sm sm:text-base font-black drop-shadow-sm">
                    {captionText || '"자연 속에서 마음껏 웃고 뛰노는 우리 아이들"'}
                  </p>
                </div>
                <span className="text-[10px] text-amber-200 bg-black/40 px-2 py-0.5 rounded-md self-start sm:self-auto backdrop-blur-xs">
                  실제 메인 화면 반영
                </span>
              </div>
            </div>
          </div>

          {/* Select Mode Tabs */}
          <div>
            <div className="flex border-b border-stone-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`pb-2.5 px-4 flex items-center space-x-1.5 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'upload'
                    ? 'border-[#F0935C] text-[#F0935C]'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>1. 내 사진 파일 직접 첨부</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('preset')}
                className={`pb-2.5 px-4 flex items-center space-x-1.5 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'preset'
                    ? 'border-[#F0935C] text-[#F0935C]'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>2. 추천 테마 사진 선택 ({HERO_PRESETS.length}종)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('url')}
                className={`pb-2.5 px-4 flex items-center space-x-1.5 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'url'
                    ? 'border-[#F0935C] text-[#F0935C]'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>3. 웹 이미지 링크(URL)</span>
              </button>
            </div>

            {/* Tab 1: Direct File Upload */}
            {activeTab === 'upload' && (
              <div className="pt-4 space-y-3">
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-6 sm:p-8 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-stone-300 hover:border-amber-400 bg-stone-50/70 hover:bg-amber-50/40'
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-2 shadow-2xs">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="font-black text-stone-900 text-sm">
                    컴퓨터나 스마트폰의 실제 사진 파일을 선택하거나 끌어다 놓으세요
                  </p>
                  <p className="text-xs text-stone-500 mt-1">
                    JPG, PNG, WebP 등 이미지 파일 (최대 10MB, 자동 최적화 리사이징)
                  </p>

                  <button
                    type="button"
                    className="mt-4 px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition-colors pointer-events-none"
                  >
                    사진 파일 찾아보기
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </div>

                {isProcessing && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center space-x-2 text-xs text-amber-800 font-bold">
                    <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                    <span>사진을 처리하고 최적화하는 중입니다...</span>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Curated Presets */}
            {activeTab === 'preset' && (
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {HERO_PRESETS.map((preset) => {
                  const isSelected = selectedImage === preset.imageUrl;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`p-2.5 rounded-2xl border-2 text-left flex space-x-3 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#F0935C] bg-amber-50/60 ring-2 ring-[#F0935C]/20'
                          : 'border-stone-200 hover:border-amber-300 bg-white'
                      }`}
                    >
                      <div className="relative w-20 h-16 rounded-xl overflow-hidden shrink-0 bg-stone-100">
                        <img
                          src={preset.imageUrl}
                          alt={preset.title}
                          className="w-full h-full object-cover"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-[#F0935C]/80 flex items-center justify-center text-white">
                            <Check className="w-5 h-5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-700 inline-block mb-1">
                          {preset.badge}
                        </span>
                        <p className="text-xs font-bold text-stone-900 truncate">
                          {preset.title}
                        </p>
                        <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                          {preset.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Tab 3: URL Direct input */}
            {activeTab === 'url' && (
              <div className="pt-4">
                <form onSubmit={handleApplyUrl} className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://... 이미지 웹 주소 입력"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    className="flex-1 p-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <button
                    type="submit"
                    disabled={!customUrl.trim()}
                    className="px-4 py-2.5 rounded-xl bg-stone-900 text-white font-bold text-xs hover:bg-stone-800 disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    링크 적용
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Badge and Caption Editing */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
            <div className="flex items-center space-x-1.5">
              <Type className="w-4 h-4 text-[#F0935C]" />
              <h4 className="text-xs font-bold text-stone-800">
                대문 이미지 뱃지 및 문구 설정 (선택사항)
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  뱃지 문구 (예: 숲체험 & 오감놀이)
                </label>
                <input
                  type="text"
                  value={badgeText}
                  onChange={(e) => setBadgeText(e.target.value)}
                  placeholder="예: 숲체험 & 오감놀이"
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  대표 캡션 문구
                </label>
                <input
                  type="text"
                  value={captionText}
                  onChange={(e) => setCaptionText(e.target.value)}
                  placeholder="예: 자연 속에서 마음껏 웃고 뛰노는 우리 아이들"
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 font-bold text-xs hover:bg-stone-100 transition-colors cursor-pointer"
          >
            취소
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-[#F0935C] text-stone-950 font-black text-xs shadow-sm hover:brightness-105 active:scale-95 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>대문 이미지 저장 및 적용</span>
          </button>
        </div>
      </div>
    </div>
  );
};
