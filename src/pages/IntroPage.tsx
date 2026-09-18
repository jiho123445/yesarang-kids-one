import React, { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Heart,
  Sprout,
  Sparkles,
  Smile,
  MapPin,
  Phone,
  Bus,
  Car,
  Clock,
  Award,
  CheckCircle2,
  Building,
  Users,
  Edit2,
  Camera,
  Upload,
  RotateCcw,
  X,
  Image as ImageIcon,
  CheckCircle,
} from 'lucide-react';
import introDetails from '../data/introDetails.json';
import { MascotSun, MascotBear } from '../components/common/Illustrations';
import { useData } from '../context/DataContext';
import { handleFileUpload } from '../utils/fileUpload';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const TABS = [
  { id: 'greeting', label: '인사말', path: '/intro/greeting' },
  { id: 'philosophy', label: '교육철학', path: '/intro/philosophy' },
  { id: 'history', label: '연혁', path: '/intro/history' },
  { id: 'facility', label: '시설현황', path: '/intro/facility' },
  { id: 'teachers', label: '교직원 소개', path: '/intro/teachers' },
  { id: 'location', label: '오시는길', path: '/intro/location' },
];

const DEFAULT_DIRECTOR_PHOTO = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80';

export const IntroPage: React.FC = () => {
  const { subtab = 'greeting' } = useParams<{ subtab?: string }>();
  const { institution, isAdmin, openAdminWithTab, updateInstitution } = useData();

  useDocumentTitle(
    TABS.find(t => t.id === subtab)?.label
      ? `어린이집 소개 - ${TABS.find(t => t.id === subtab)?.label}`
      : '어린이집 소개'
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalFileInputRef = useRef<HTMLInputElement>(null);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isDraggingPhoto, setIsDraggingPhoto] = useState(false);
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const [photoToast, setPhotoToast] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');

  const currentPhoto = institution.greeting?.directorPhoto || DEFAULT_DIRECTOR_PHOTO;
  const isCustomPhoto = Boolean(
    institution.greeting?.directorPhoto &&
      institution.greeting.directorPhoto !== DEFAULT_DIRECTOR_PHOTO
  );

  const showPhotoToast = (msg: string) => {
    setPhotoToast(msg);
    setTimeout(() => setPhotoToast(null), 3500);
  };

  const processAndSavePhoto = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일(JPG, PNG, WebP 등)만 첨부할 수 있습니다.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('파일 크기는 10MB 이하의 이미지만 등록 가능합니다.');
      return;
    }

    try {
      setIsProcessingPhoto(true);
      const dataUrl = await handleFileUpload(file, 'intro/director', { maxWidth: 1000, quality: 0.85 });
      updateInstitution({
        greeting: {
          ...institution.greeting,
          directorPhoto: dataUrl,
        },
      });
      showPhotoToast('원장님의 실제 사진이 성공적으로 등록되었습니다.');
      setIsPhotoModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('사진을 처리하는 중 오류가 발생했습니다. 다른 사진으로 시도해 주세요.');
    } finally {
      setIsProcessingPhoto(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processAndSavePhoto(file);
    }
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingPhoto(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processAndSavePhoto(file);
    }
  };

  const handleResetPhoto = () => {
    if (window.confirm('기본 예시 사진으로 복원하시겠습니까?')) {
      updateInstitution({
        greeting: {
          ...institution.greeting,
          directorPhoto: DEFAULT_DIRECTOR_PHOTO,
        },
      });
      showPhotoToast('기본 예시 사진으로 복원되었습니다.');
      setIsPhotoModalOpen(false);
    }
  };

  const handleSaveUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    updateInstitution({
      greeting: {
        ...institution.greeting,
        directorPhoto: urlInput.trim(),
      },
    });
    setUrlInput('');
    setIsPhotoModalOpen(false);
    showPhotoToast('원장님 사진 웹 주소가 저장되었습니다.');
  };

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb & Title */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center text-xs font-bold text-[#F0935C] bg-orange-50 px-3 py-1 rounded-full mb-2">
            <span>어린이집 소개</span>
            <span className="mx-1.5">/</span>
            <span className="text-stone-800">
              {TABS.find(t => t.id === subtab)?.label || '인사말'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-stone-900 tracking-tight">
            {institution.name} 소개
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            {institution.slogan} - {institution.subSlogan || '아이들의 따뜻한 배움터'}
          </p>
        </div>

        {/* Admin Intro Editor Trigger */}
        {isAdmin && (
          <button
            onClick={() => openAdminWithTab('intro')}
            className="self-start sm:self-auto inline-flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer"
          >
            <Edit2 className="w-4 h-4" />
            <span>어린이집 기본정보/인사말 편집</span>
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

      {/* Subtab 1: 인사말 */}
      {subtab === 'greeting' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Toast Notification */}
          {photoToast && (
            <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-emerald-500 text-white shadow-md animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 shrink-0" />
                <span className="text-sm font-bold">{photoToast}</span>
              </div>
              <button
                onClick={() => setPhotoToast(null)}
                className="p-1 rounded-lg hover:bg-emerald-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-amber-100 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4 flex flex-col items-center text-center">
              {/* Photo Box with Drag & Drop & Hover Overlay */}
              <div
                className={`relative group w-52 h-64 sm:w-64 sm:h-80 rounded-3xl overflow-hidden shadow-md border-4 transition-all duration-200 ${
                  isAdmin ? 'cursor-pointer' : ''
                } ${
                  isDraggingPhoto
                    ? 'border-amber-500 ring-4 ring-amber-300 scale-102'
                    : 'border-amber-100 hover:border-amber-300 bg-amber-50'
                }`}
                onDragOver={(e) => {
                  if (!isAdmin) return;
                  e.preventDefault();
                  setIsDraggingPhoto(true);
                }}
                onDragLeave={() => isAdmin && setIsDraggingPhoto(false)}
                onDrop={isAdmin ? handleDrop : undefined}
                onClick={() => isAdmin && setIsPhotoModalOpen(true)}
                title={isAdmin ? '클릭하여 원장님 실제 사진 첨부/변경' : undefined}
              >
                <img
                  src={currentPhoto}
                  alt={`${institution.name} ${institution.director} 원장`}
                  className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                />

                {isAdmin && (
                  <>
                    {/* Hover overlay hint */}
                    <div className="absolute inset-0 bg-stone-950/45 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-white">
                      <div className="w-10 h-10 rounded-full bg-white/25 backdrop-blur-md flex items-center justify-center mb-1.5 shadow-sm">
                        <Camera className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-xs font-black">원장 실제 사진 첨부</p>
                      <p className="text-[10px] text-amber-200 mt-0.5">클릭 또는 사진 드래그&드롭</p>
                    </div>

                    {/* Drag over overlay */}
                    {isDraggingPhoto && (
                      <div className="absolute inset-0 bg-amber-500/90 text-white flex flex-col items-center justify-center p-4 z-20 animate-in fade-in">
                        <Upload className="w-8 h-8 animate-bounce mb-2" />
                        <p className="text-xs font-black">이곳에 사진 파일을 놓으세요</p>
                      </div>
                    )}

                    {/* Processing overlay */}
                    {isProcessingPhoto && (
                      <div className="absolute inset-0 bg-stone-900/80 text-white flex flex-col items-center justify-center p-4 z-20 animate-in fade-in">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mb-2" />
                        <p className="text-xs font-bold">사진 처리 중...</p>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Director Info */}
              <div className="mt-4">
                <span className="text-xs font-bold text-[#F0935C] block">{institution.name} 원장</span>
                <span className="text-xl font-black text-stone-900">{institution.director}</span>
              </div>

              {/* Action Buttons */}
              {isAdmin && (
                <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#F5C451] to-[#F0935C] text-stone-950 text-xs font-black shadow-xs hover:brightness-105 active:scale-95 transition-all cursor-pointer"
                    title="내 기기에서 사진 파일 직접 선택"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>실제 사진 첨부</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsPhotoModalOpen(true)}
                    className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                    title="사진 상세 관리 및 웹 주소 입력"
                  >
                    <Upload className="w-3.5 h-3.5 text-stone-500" />
                    <span>상세 관리</span>
                  </button>

                  {isCustomPhoto && (
                    <button
                      type="button"
                      onClick={handleResetPhoto}
                      className="inline-flex items-center space-x-1 px-2 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-medium transition-colors cursor-pointer"
                      title="기본 샘플 사진으로 되돌리기"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>기본 복원</span>
                    </button>
                  )}
                </div>
              )}

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <div className="lg:col-span-8 space-y-4 text-stone-700 leading-relaxed text-sm sm:text-base">
              <h2 className="text-xl sm:text-2xl font-black text-stone-900 leading-snug">
                "{institution.greeting?.title || '아이들의 순수한 눈망울 속에 더 밝은 미래가 자라납니다'}"
              </h2>
              {(institution.greeting?.paragraphs || []).map((p, idx) => (
                <p key={idx} className="leading-loose">
                  {p}
                </p>
              ))}
              <p className="text-right font-bold text-stone-900 pt-4 text-sm sm:text-base">
                {institution.greeting?.sign || `${institution.name} 원장 ${institution.director} 배상`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 2: 교육철학 */}
      {subtab === 'philosophy' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 mb-2">
              예사랑 4대 핵심 교육 가치
            </h2>
            <p className="text-sm text-stone-600">
              아이들의 웃음과 행복이 피어나는 건강한 교육 철학을 실천합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(institution.philosophy || []).map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-stone-200 flex flex-col justify-between hover:shadow-lg transition-all"
              >
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-[#F0935C]">
                      {index === 0 && <Heart className="w-6 h-6 fill-[#F0935C]" />}
                      {index === 1 && <Sprout className="w-6 h-6 text-emerald-600" />}
                      {index === 2 && <Sparkles className="w-6 h-6 text-amber-500" />}
                      {index === 3 && <Smile className="w-6 h-6 text-rose-500" />}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-stone-400">VALUE 0{index + 1}</span>
                      <h3 className="text-lg sm:text-xl font-black text-stone-900">{item.title}</h3>
                    </div>
                  </div>
                  <p className="text-stone-600 text-sm sm:text-base leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Class organization list */}
          <div className="mt-12 bg-amber-50/70 rounded-3xl p-6 sm:p-8 border border-amber-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <h3 className="text-lg sm:text-xl font-black text-stone-900 text-center sm:text-left">
                연령별 학급 구성 현황 (총 정원: {institution.capacity}명)
              </h3>
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => openAdminWithTab('intro')}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-amber-100 text-stone-800 border border-amber-300 text-xs font-bold shadow-2xs transition-colors cursor-pointer self-center sm:self-auto"
                >
                  <Edit2 className="w-3.5 h-3.5 text-[#F0935C]" />
                  <span>반 이름·편성 관리</span>
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {(institution.classes || []).map((cls, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-4 shadow-xs border border-amber-100 text-center">
                  <span className="text-xs font-bold text-[#F0935C] block">{cls.age}</span>
                  <h4 className="text-base font-black text-stone-900 my-1">{cls.name}</h4>
                  <span className="inline-block px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 text-xs font-semibold mb-2">
                    {cls.capacity}
                  </span>
                  <p className="text-[11px] text-stone-500 leading-tight">{cls.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Subtab 3: 연혁 */}
      {subtab === 'history' && (
        <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-10 shadow-md border border-stone-200 animate-in fade-in duration-200">
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 mb-6 text-center">
            {institution.name} 발자취
          </h2>
          <div className="relative border-l-2 border-[#F0935C]/30 ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-6">
            {introDetails.history.map((h, i) => (
              <div key={i} className="relative group">
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-[#F0935C] border-4 border-white shadow-xs" />
                <span className="text-base sm:text-lg font-black text-[#F0935C] block">{h.year}년</span>
                <p className="text-sm sm:text-base text-stone-800 font-medium mt-1 leading-relaxed">
                  {h.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab 4: 시설현황 */}
      {subtab === 'facility' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {introDetails.facilities.map(fac => (
              <div
                key={fac.id}
                className="bg-white rounded-3xl overflow-hidden shadow-md border border-stone-200 flex flex-col"
              >
                <div className="aspect-16/10 overflow-hidden bg-amber-100">
                  <img
                    src={fac.imageUrl}
                    alt={fac.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-stone-900 mb-2">
                      {fac.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-4">
                      {fac.description}
                    </p>
                  </div>
                  <div className="space-y-1 pt-3 border-t border-stone-100">
                    {fac.features.map((feat, i) => (
                      <div key={i} className="flex items-center text-xs text-stone-500 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-1.5 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab 5: 교직원 소개 */}
      {subtab === 'teachers' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {introDetails.teachers.map(t => (
              <div
                key={t.id}
                className="bg-white rounded-3xl p-6 shadow-md border border-stone-200 flex flex-col justify-between hover:shadow-lg transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800">
                      {t.role}
                    </span>
                    <span className="text-xs text-stone-400 font-medium">{t.className}</span>
                  </div>
                  <h3 className="text-xl font-black text-stone-900 mb-1">{t.name} 선생님</h3>
                  <span className="text-xs text-[#F0935C] font-bold block mb-3">{t.badge}</span>
                  <p className="text-xs sm:text-sm text-stone-600 italic bg-amber-50/50 p-3 rounded-2xl border border-amber-100/60 leading-relaxed">
                    "{t.message}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab 6: 오시는길 */}
      {subtab === 'location' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-stone-200 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
              <div>
                <span className="text-xs font-bold text-[#F0935C]">오시는 길 안내</span>
                <h2 className="text-xl sm:text-2xl font-black text-stone-900">
                  {institution.address}
                </h2>
              </div>
              <a
                href="https://map.naver.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
              >
                <MapPin className="w-3.5 h-3.5 mr-1" />
                <span>지도 앱에서 보기</span>
              </a>
            </div>

            {/* Interactive Map Graphic Card */}
            <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 shadow-inner flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&auto=format&fit=crop&q=80"
                alt="위치 안내 지도"
                className="w-full h-full object-cover opacity-60 filter saturate-150"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent" />
              <div className="absolute p-5 rounded-2xl bg-white/95 shadow-xl border border-amber-200 text-center max-w-xs">
                <div className="w-10 h-10 rounded-full bg-[#F0935C] text-white flex items-center justify-center mx-auto mb-2 shadow-xs">
                  <MapPin className="w-5 h-5" />
                </div>
                <h4 className="font-black text-stone-900 text-sm">{institution.name}</h4>
                <p className="text-xs text-stone-600 mt-1">{institution.address}</p>
                <span className="inline-block mt-2 text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                  연봉 현대아파트 인근
                </span>
              </div>
            </div>

            {/* Transportation Guide */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70">
                <div className="flex items-center space-x-2 text-stone-900 font-bold text-sm mb-2">
                  <Bus className="w-4 h-4 text-[#F0935C]" />
                  <span>대중교통 버스 안내</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  홍천 시내버스 연봉 현대아파트 정류장 하차 후 도보 2분 거리 (시내 순환 노선 수시 운행)
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70">
                <div className="flex items-center space-x-2 text-stone-900 font-bold text-sm mb-2">
                  <Car className="w-4 h-4 text-emerald-600" />
                  <span>자가용 및 주차 안내</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  어린이집 전용 등하원 승하차 안심존 및 원내 전용 지상 주차장 완비 (방문 학부모 무료 주차)
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70">
                <div className="flex items-center space-x-2 text-stone-900 font-bold text-sm mb-2">
                  <Phone className="w-4 h-4 text-teal-600" />
                  <span>문의 및 길안내</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  길 찾기가 어려우신 경우 원무실({institution.phone})로 전화 주시면 친절하게 안내해 드립니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Director Photo Upload / Edit Modal */}
      {isPhotoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-amber-50/50">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold shadow-xs">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-stone-900">원장 실제 사진 첨부 및 관리</h3>
                  <p className="text-xs text-stone-500">원장 인사말에 노출될 실제 프로필 사진을 등록합니다</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPhotoModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 text-xs">
              {/* Current Preview */}
              <div className="flex items-center space-x-4 p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-amber-300 bg-amber-100 shrink-0 shadow-xs">
                  <img
                    src={currentPhoto}
                    alt="현재 원장 사진"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-stone-900 text-sm">{institution.director} 원장</p>
                  <p className="text-stone-500 text-[11px] mt-0.5">
                    {isCustomPhoto ? '사용자 등록 실제 사진 적용 중' : '기본 예시 프로필 이미지 사용 중'}
                  </p>
                  {isCustomPhoto && (
                    <button
                      type="button"
                      onClick={handleResetPhoto}
                      className="mt-2 inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-stone-600 font-bold hover:bg-stone-100 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3 text-stone-500" />
                      <span>기본 사진으로 복원</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Method 1: Local File Upload / Drag & Drop */}
              <div>
                <label className="block font-bold text-stone-800 text-xs mb-1.5">
                  1. 내 기기(컴퓨터/스마트폰)에서 실제 사진 파일 첨부
                </label>
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingPhoto(true);
                  }}
                  onDragLeave={() => setIsDraggingPhoto(false)}
                  onDrop={handleDrop}
                  onClick={() => modalFileInputRef.current?.click()}
                  className={`p-6 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                    isDraggingPhoto
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-stone-300 hover:border-amber-400 bg-stone-50/50 hover:bg-amber-50/30'
                  }`}
                >
                  <Upload className="w-8 h-8 text-amber-600 mb-2" />
                  <p className="font-black text-stone-900 text-xs">
                    이곳을 클릭하여 사진을 선택하거나 드래그하여 첨부하세요
                  </p>
                  <p className="text-stone-500 text-[11px] mt-1">
                    JPG, PNG, WebP 등 이미지 파일 (최대 10MB, 자동 용량 최적화)
                  </p>
                  <input
                    ref={modalFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Method 2: Image URL input */}
              <div>
                <label className="block font-bold text-stone-800 text-xs mb-1.5">
                  2. 또는 웹 이미지 링크(URL) 직접 입력
                </label>
                <form onSubmit={handleSaveUrl} className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://... 이미지 웹 주소"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="flex-1 p-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <button
                    type="submit"
                    disabled={!urlInput.trim()}
                    className="px-4 py-2.5 rounded-xl bg-stone-900 text-white font-bold text-xs hover:bg-stone-800 disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    URL 등록
                  </button>
                </form>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-stone-50 border-t border-stone-100 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setIsPhotoModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 font-bold text-xs hover:bg-stone-100 transition-colors cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
