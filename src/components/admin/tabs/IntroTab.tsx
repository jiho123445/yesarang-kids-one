import React, { useState, useEffect } from 'react';
import {
  Save,
  Building,
  Users,
  Heart,
  Phone,
  MapPin,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  RotateCcw,
  Camera,
  Sparkles,
  Check,
  School,
  ArrowUp,
  ArrowDown,
  AlertCircle,
  Pencil,
} from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { TeacherInfo, FacilityRoom, InstitutionClass } from '../../../types';
import { FileUpload } from '../../common/FileUpload';
import { ConfirmDialog } from '../ConfirmDialog';
import {
  DEFAULT_HERO_IMAGE,
  DEFAULT_HERO_BADGE,
  DEFAULT_HERO_CAPTION,
  HERO_PRESETS,
} from '../../../data/heroPresets';

const PRESET_THEMES = [
  {
    name: '자연·생태 (기본)',
    classes: ['씨앗반', '새싹반', '줄기반', '꽃잎반', '열매반'],
  },
  {
    name: '하늘·빛',
    classes: ['햇살반', '달님반', '별님반', '구름반', '무지개반'],
  },
  {
    name: '사랑·인성',
    classes: ['사랑반', '기쁨반', '소망반', '믿음반', '지혜반'],
  },
  {
    name: '숲·나무',
    classes: ['솔잎반', '단풍반', '은행반', '도토리반', '소나무반'],
  },
];

const DEFAULT_CLASSES: InstitutionClass[] = [
  { name: '씨앗반', age: '만 0세', capacity: '5명', desc: '오감 발달과 따뜻한 신체 접촉 중심의 애착 형성' },
  { name: '새싹반', age: '만 1세', capacity: '10명', desc: '자율성과 기본 생활 습관, 친환경 오감 생태 탐색' },
  { name: '줄기반', age: '만 2세', capacity: '14명', desc: '언어 폭발기 어휘력 증진 및 친구와의 긍정적 또래 관계' },
  { name: '꽃잎반', age: '만 3세', capacity: '15명', desc: '숲체험 놀이 중심, 신체 조절과 풍부한 상상 미술' },
  { name: '열매반', age: '만 4~5세', capacity: '15명', desc: '자신감 넘치는 발표, 초등 연계 인성 및 창의 융합 활동' },
];

export const IntroTab: React.FC = () => {
  const {
    institution,
    updateInstitution,
    updateClasses,
    introDetails,
    updateIntroDetails,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    addFacility,
    updateFacility,
    deleteFacility,
  } = useData();

  const [activeSubSection, setActiveSubSection] = useState<'basic' | 'hero' | 'greeting' | 'classes' | 'teachers' | 'facilities'>('basic');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Form state for Classes
  const [classesList, setClassesList] = useState<InstitutionClass[]>(() => {
    return institution.classes && institution.classes.length > 0
      ? institution.classes.map(c => ({ ...c }))
      : DEFAULT_CLASSES.map(c => ({ ...c }));
  });
  const [classOriginalNames, setClassOriginalNames] = useState<string[]>(() => {
    return (institution.classes && institution.classes.length > 0
      ? institution.classes
      : DEFAULT_CLASSES
    ).map(c => c.name);
  });
  const [classErrorMsg, setClassErrorMsg] = useState<string | null>(null);

  // Sync classesList if institution.classes changes externally
  useEffect(() => {
    if (institution.classes && institution.classes.length > 0) {
      setClassesList(institution.classes.map(c => ({ ...c })));
      setClassOriginalNames(institution.classes.map(c => c.name));
    }
  }, [institution.classes]);

  // Form states for Institution Basic
  const [basicForm, setBasicForm] = useState({
    name: institution.name,
    shortName: institution.shortName,
    slogan: institution.slogan,
    subSlogan: institution.subSlogan,
    director: institution.director,
    phone: institution.phone,
    fax: institution.fax,
    address: institution.address,
    operatingHours: institution.operatingHours,
    capacity: institution.capacity,
    establishedDate: institution.establishedDate,
  });

  // Form state for Homepage Hero (대문 대표 이미지)
  const [heroForm, setHeroForm] = useState({
    heroImage: institution.heroImage || DEFAULT_HERO_IMAGE,
    heroBadge: institution.heroBadge || DEFAULT_HERO_BADGE,
    heroCaption: institution.heroCaption || DEFAULT_HERO_CAPTION,
  });

  // Form state for Greeting
  const [greetingForm, setGreetingForm] = useState({
    title: institution.greeting.title,
    paragraphs: institution.greeting.paragraphs.join('\n\n'),
    sign: institution.greeting.sign,
    directorPhoto: institution.greeting.directorPhoto || '',
  });

  // Modal states for Teacher
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null);
  const [teacherForm, setTeacherForm] = useState({
    name: '',
    role: '',
    className: '',
    message: '',
    badge: '',
  });
  const [deleteTeacherId, setDeleteTeacherId] = useState<string | null>(null);

  // Modal states for Facility
  const [isFacilityModalOpen, setIsFacilityModalOpen] = useState(false);
  const [editingFacilityId, setEditingFacilityId] = useState<string | null>(null);
  const [facilityForm, setFacilityForm] = useState({
    name: '',
    description: '',
    featuresText: '',
    imageUrl: '',
    imageName: '',
  });
  const [deleteFacilityId, setDeleteFacilityId] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handleSaveBasic = (e: React.FormEvent) => {
    e.preventDefault();
    updateInstitution(basicForm);
    showNotification('어린이집 기본 정보가 성공적으로 저장되었습니다.');
  };

  const handleSaveHero = (e: React.FormEvent) => {
    e.preventDefault();
    updateInstitution({
      heroImage: heroForm.heroImage,
      heroBadge: heroForm.heroBadge.trim() || DEFAULT_HERO_BADGE,
      heroCaption: heroForm.heroCaption.trim() || DEFAULT_HERO_CAPTION,
    });
    showNotification('홈페이지 대문 이미지가 성공적으로 저장되었습니다.');
  };

  const handleSaveGreeting = (e: React.FormEvent) => {
    e.preventDefault();
    updateInstitution({
      greeting: {
        title: greetingForm.title,
        paragraphs: greetingForm.paragraphs.split('\n\n').map(p => p.trim()).filter(Boolean),
        sign: greetingForm.sign,
        directorPhoto: greetingForm.directorPhoto,
      },
    });
    showNotification('원장 인사말 및 실제 사진이 성공적으로 저장되었습니다.');
  };

  // Teacher handlers
  const openNewTeacher = () => {
    setEditingTeacherId(null);
    setTeacherForm({
      name: '',
      role: '담임교사',
      className: '새싹반',
      message: '',
      badge: '보육교사 1급',
    });
    setIsTeacherModalOpen(true);
  };

  const openEditTeacher = (t: TeacherInfo) => {
    setEditingTeacherId(t.id);
    setTeacherForm({
      name: t.name,
      role: t.role,
      className: t.className,
      message: t.message,
      badge: t.badge,
    });
    setIsTeacherModalOpen(true);
  };

  const handleSaveTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherForm.name.trim()) return;

    if (editingTeacherId) {
      updateTeacher(editingTeacherId, teacherForm);
    } else {
      addTeacher(teacherForm);
    }
    setIsTeacherModalOpen(false);
    showNotification('교직원 정보가 저장되었습니다.');
  };

  // Facility handlers
  const openNewFacility = () => {
    setEditingFacilityId(null);
    setFacilityForm({
      name: '',
      description: '',
      featuresText: '친환경 교구\n공기청정기 완비\n모서리 안전 쿠션',
      imageUrl: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=800&auto=format&fit=crop&q=80',
      imageName: '기본 보육실 사진',
    });
    setIsFacilityModalOpen(true);
  };

  const openEditFacility = (f: FacilityRoom) => {
    setEditingFacilityId(f.id);
    setFacilityForm({
      name: f.name,
      description: f.description,
      featuresText: f.features.join('\n'),
      imageUrl: f.imageUrl,
      imageName: '시설 사진',
    });
    setIsFacilityModalOpen(true);
  };

  const handleSaveFacility = (e: React.FormEvent) => {
    e.preventDefault();
    if (!facilityForm.name.trim() || !facilityForm.imageUrl.trim()) {
      alert('시설명과 사진을 입력해 주세요.');
      return;
    }

    const payload = {
      name: facilityForm.name,
      description: facilityForm.description,
      features: facilityForm.featuresText.split('\n').map(s => s.trim()).filter(Boolean),
      imageUrl: facilityForm.imageUrl,
    };

    if (editingFacilityId) {
      updateFacility(editingFacilityId, payload);
    } else {
      addFacility(payload);
    }
    setIsFacilityModalOpen(false);
    showNotification('시설 현황 정보가 저장되었습니다.');
  };

  // Classes Handlers
  const handleClassNameChange = (index: number, newName: string) => {
    setClassErrorMsg(null);
    setClassesList(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], name: newName };
      return updated;
    });
  };

  const handleClassFieldChange = (
    index: number,
    field: keyof InstitutionClass,
    val: string
  ) => {
    setClassesList(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: val };
      return updated;
    });
  };

  const handleClassMoveUp = (index: number) => {
    if (index === 0) return;
    setClassesList(prev => {
      const updated = [...prev];
      const temp = updated[index - 1];
      updated[index - 1] = updated[index];
      updated[index] = temp;
      return updated;
    });
  };

  const handleClassMoveDown = (index: number) => {
    if (index === classesList.length - 1) return;
    setClassesList(prev => {
      const updated = [...prev];
      const temp = updated[index + 1];
      updated[index + 1] = updated[index];
      updated[index] = temp;
      return updated;
    });
  };

  const handleClassDelete = (index: number) => {
    if (classesList.length <= 1) {
      setClassErrorMsg('최소 1개 이상의 학급(반)이 등록되어 있어야 합니다.');
      return;
    }
    setClassErrorMsg(null);
    setClassesList(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddClass = () => {
    setClassErrorMsg(null);
    const newIdx = classesList.length + 1;
    const newClass: InstitutionClass = {
      name: `새로운반${newIdx}`,
      age: `만 ${Math.min(classesList.length, 5)}세`,
      capacity: '12명',
      desc: '자율성과 협동심을 기르는 전인 발달 놀이 중심 교육',
    };
    setClassesList(prev => [...prev, newClass]);
  };

  const handleApplyPreset = (presetNames: string[]) => {
    setClassErrorMsg(null);
    setClassesList(prev => {
      return prev.map((cls, idx) => ({
        ...cls,
        name: presetNames[idx] || cls.name,
      }));
    });
  };

  const handleResetToDefaultClasses = () => {
    setClassErrorMsg(null);
    setClassesList(DEFAULT_CLASSES.map(c => ({ ...c })));
  };

  const handleSaveClasses = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = classesList.map(c => ({
      ...c,
      name: c.name.trim(),
      age: c.age.trim(),
      capacity: c.capacity.trim(),
      desc: c.desc.trim(),
    }));

    for (let i = 0; i < trimmed.length; i++) {
      if (!trimmed[i].name) {
        setClassErrorMsg(`${i + 1}번째 반의 이름을 입력해 주세요.`);
        return;
      }
    }

    const names = trimmed.map(c => c.name);
    const duplicates = names.filter((item, index) => names.indexOf(item) !== index);
    if (duplicates.length > 0) {
      setClassErrorMsg(`중복된 반 이름이 있습니다: "${duplicates[0]}". 각 반 이름은 서로 달라야 합니다.`);
      return;
    }

    const renameMap: Record<string, string> = {};
    classOriginalNames.forEach((oldName, idx) => {
      const newName = trimmed[idx]?.name;
      if (newName && oldName !== newName) {
        renameMap[oldName] = newName;
      }
    });

    updateClasses(trimmed, renameMap);
    setClassOriginalNames(trimmed.map(c => c.name));
    showNotification('학급(반) 이름 및 구성이 저장되었습니다.');
  };

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
        <div>
          <h3 className="text-lg font-black text-stone-900">원 소개 및 기관정보 관리</h3>
          <p className="text-xs text-stone-500">
            원훈, 연락처, 원장 인사말, 교직원 명단 및 시설 현황을 편집할 수 있습니다.
          </p>
        </div>

        {saveSuccessMsg && (
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}
      </div>

      {/* Sub Navigation pills */}
      <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-4">
        {[
          { id: 'basic', label: '기관 기본정보 / 연락처', icon: Building },
          { id: 'hero', label: '대문 대표 이미지', icon: Camera },
          { id: 'classes', label: '학급(반) 이름·편성', icon: School },
          { id: 'greeting', label: '원장 인사말', icon: Heart },
          { id: 'teachers', label: '교직원 구성', icon: Users },
          { id: 'facilities', label: '시설 현황', icon: MapPin },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubSection(tab.id as any)}
              className={`inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-amber-50 border border-stone-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. Basic Info Form */}
      {activeSubSection === 'basic' && (
        <form onSubmit={handleSaveBasic} className="space-y-4 text-xs bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-stone-700 mb-1">어린이집 명칭</label>
              <input
                type="text"
                value={basicForm.name}
                onChange={e => setBasicForm({ ...basicForm, name: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-stone-200 font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">원장명</label>
              <input
                type="text"
                value={basicForm.director}
                onChange={e => setBasicForm({ ...basicForm, director: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-stone-200 font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">대표 슬로건 (원훈)</label>
              <input
                type="text"
                value={basicForm.slogan}
                onChange={e => setBasicForm({ ...basicForm, slogan: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-stone-200"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">보조 슬로건</label>
              <input
                type="text"
                value={basicForm.subSlogan}
                onChange={e => setBasicForm({ ...basicForm, subSlogan: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-stone-200"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">대표 전화번호</label>
              <input
                type="text"
                value={basicForm.phone}
                onChange={e => setBasicForm({ ...basicForm, phone: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-stone-200"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">팩스 번호</label>
              <input
                type="text"
                value={basicForm.fax}
                onChange={e => setBasicForm({ ...basicForm, fax: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-stone-200"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-stone-700 mb-1">도로명 주소</label>
              <input
                type="text"
                value={basicForm.address}
                onChange={e => setBasicForm({ ...basicForm, address: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-stone-200"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">운영 시간</label>
              <input
                type="text"
                value={basicForm.operatingHours}
                onChange={e => setBasicForm({ ...basicForm, operatingHours: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-stone-200"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">인가 정원 / 현원</label>
              <input
                type="text"
                value={basicForm.capacity}
                onChange={e => setBasicForm({ ...basicForm, capacity: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-stone-200"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F5C451] to-[#F0935C] text-stone-950 font-black shadow-md hover:brightness-105 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>기본 정보 저장</span>
            </button>
          </div>
        </form>
      )}

      {/* Hero Banner (대문 대표 이미지) Form */}
      {activeSubSection === 'hero' && (
        <form onSubmit={handleSaveHero} className="space-y-6 text-xs bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs">
          <div>
            <h4 className="text-sm font-black text-stone-900 flex items-center space-x-2">
              <Camera className="w-4 h-4 text-[#F0935C]" />
              <span>홈페이지 대문(Hero) 대표 이미지 및 문구 관리</span>
            </h4>
            <p className="text-stone-500 text-[11px] mt-1">
              홈페이지 최상단 첫 화면에 노출되는 대표 활동 사진, 뱃지 키워드, 슬로건 캡션을 등록하고 변경할 수 있습니다.
            </p>
          </div>

          {/* Current Live Preview */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-800 text-xs flex items-center">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 mr-1" />
                현재 설정된 대문 미리보기
              </span>
              <button
                type="button"
                onClick={() => {
                  setHeroForm({
                    heroImage: DEFAULT_HERO_IMAGE,
                    heroBadge: DEFAULT_HERO_BADGE,
                    heroCaption: DEFAULT_HERO_CAPTION,
                  });
                }}
                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-white border border-stone-200 text-stone-600 font-bold hover:bg-stone-100 transition-colors cursor-pointer"
                title="기본 사진으로 되돌리기"
              >
                <RotateCcw className="w-3 h-3 text-stone-500" />
                <span>기본값 복원</span>
              </button>
            </div>

            <div className="relative rounded-2xl overflow-hidden aspect-16/9 sm:aspect-21/9 max-w-2xl mx-auto border-2 border-amber-300 shadow-md bg-stone-900">
              <img
                src={heroForm.heroImage}
                alt="대문 미리보기"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#F0935C] text-[11px] font-bold mb-1 shadow-xs">
                  {heroForm.heroBadge}
                </span>
                <p className="text-sm sm:text-base font-black drop-shadow-sm">
                  {heroForm.heroCaption}
                </p>
              </div>
            </div>
          </div>

          {/* Method 1: Local File Upload */}
          <div className="space-y-2">
            <label className="block font-bold text-stone-800 text-xs">
              1. 내 컴퓨터 / 스마트폰에서 실제 사진 파일 첨부
            </label>
            <FileUpload
              value={heroForm.heroImage}
              isImageOnly={true}
              accept="image/*"
              folder="intro/hero"
              label="대문 사진 파일 첨부 (드래그 & 드롭 가능)"
              helperText="어린이집 전경, 아이들 숲체험 또는 원내 대표 활동 사진 (최대 10MB, 자동 최적화)"
              onChange={(dataUrl) => {
                setHeroForm(prev => ({ ...prev, heroImage: dataUrl }));
              }}
              onClear={() => {
                setHeroForm(prev => ({ ...prev, heroImage: DEFAULT_HERO_IMAGE }));
              }}
            />
          </div>

          {/* Method 2: Curated Presets */}
          <div className="space-y-2">
            <label className="block font-bold text-stone-800 text-xs">
              2. 추천 어린이집 테마 사진 선택 ({HERO_PRESETS.length}선)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {HERO_PRESETS.map((preset) => {
                const isSelected = heroForm.heroImage === preset.imageUrl;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setHeroForm({
                        heroImage: preset.imageUrl,
                        heroBadge: preset.badge,
                        heroCaption: preset.caption,
                      });
                    }}
                    className={`p-2.5 rounded-2xl border-2 text-left flex space-x-3 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#F0935C] bg-amber-50 ring-2 ring-[#F0935C]/20'
                        : 'border-stone-200 hover:border-amber-300 bg-white'
                    }`}
                  >
                    <div className="relative w-16 h-14 rounded-xl overflow-hidden shrink-0 bg-stone-100">
                      <img
                        src={preset.imageUrl}
                        alt={preset.title}
                        className="w-full h-full object-cover"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-[#F0935C]/80 flex items-center justify-center text-white">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-700 inline-block mb-0.5">
                        {preset.badge}
                      </span>
                      <p className="text-xs font-bold text-stone-900 truncate">
                        {preset.title}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Method 3: Direct URL Input */}
          <div className="space-y-2">
            <label className="block font-bold text-stone-800 text-xs">
              3. 또는 이미지 웹 주소(URL) 직접 입력
            </label>
            <input
              type="url"
              value={heroForm.heroImage.startsWith('data:') ? '' : heroForm.heroImage}
              onChange={(e) => setHeroForm(prev => ({ ...prev, heroImage: e.target.value }))}
              placeholder="https://... 이미지 웹 주소 입력"
              className="w-full p-2.5 rounded-xl border border-stone-200"
            />
          </div>

          {/* Badge and Caption Editing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-100">
            <div>
              <label className="block font-bold text-stone-700 mb-1">
                대문 뱃지 문구
              </label>
              <input
                type="text"
                value={heroForm.heroBadge}
                onChange={(e) => setHeroForm(prev => ({ ...prev, heroBadge: e.target.value }))}
                placeholder="예: 숲체험 & 오감놀이"
                className="w-full p-2.5 rounded-xl border border-stone-200"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">
                대표 캡션 문구
              </label>
              <input
                type="text"
                value={heroForm.heroCaption}
                onChange={(e) => setHeroForm(prev => ({ ...prev, heroCaption: e.target.value }))}
                placeholder="예: 자연 속에서 마음껏 웃고 뛰노는 우리 아이들"
                className="w-full p-2.5 rounded-xl border border-stone-200"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-stone-100">
            <button
              type="button"
              onClick={() => {
                setHeroForm({
                  heroImage: DEFAULT_HERO_IMAGE,
                  heroBadge: DEFAULT_HERO_BADGE,
                  heroCaption: DEFAULT_HERO_CAPTION,
                });
              }}
              className="inline-flex items-center space-x-1 px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>기본 테마로 복원</span>
            </button>

            <button
              type="submit"
              className="inline-flex items-center space-x-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#F5C451] to-[#F0935C] text-stone-950 font-black shadow-md hover:brightness-105 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>대문 이미지 설정 저장</span>
            </button>
          </div>
        </form>
      )}

      {/* 2. Greeting Form */}
      {activeSubSection === 'greeting' && (
        <form onSubmit={handleSaveGreeting} className="space-y-4 text-xs bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
          {/* Director Actual Photo Section */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center space-x-1.5">
                  <Camera className="w-4 h-4 text-[#F0935C]" />
                  <label className="font-bold text-stone-800 text-xs">
                    원장 실제 사진 첨부 및 등록
                  </label>
                </div>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  인사말 페이지에 표시될 원장님의 실제 프로필 사진을 등록하세요. (JPG, PNG, WebP 등 지원)
                </p>
              </div>

              {greetingForm.directorPhoto && (
                <button
                  type="button"
                  onClick={() =>
                    setGreetingForm({
                      ...greetingForm,
                      directorPhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80',
                    })
                  }
                  className="self-start sm:self-auto inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-[11px] font-bold text-stone-600 bg-white hover:bg-stone-100 border border-stone-200 transition-colors cursor-pointer"
                  title="기본 샘플 사진으로 되돌리기"
                >
                  <RotateCcw className="w-3 h-3 text-stone-500" />
                  <span>기본 사진 복원</span>
                </button>
              )}
            </div>

            <FileUpload
              value={greetingForm.directorPhoto}
              fileName={greetingForm.directorPhoto ? '원장님_실제사진.jpg' : undefined}
              onChange={(dataUrl) => {
                setGreetingForm(prev => ({ ...prev, directorPhoto: dataUrl }));
              }}
              onClear={() => {
                setGreetingForm(prev => ({ ...prev, directorPhoto: '' }));
              }}
              isImageOnly={true}
              accept="image/*"
              folder="intro/director"
              label=""
              helperText="컴퓨터나 스마트폰의 실제 사진 파일을 선택하거나 이곳에 끌어다 놓으세요 (최대 10MB, 자동 최적화)"
            />

            {/* URL input fallback */}
            <div className="pt-1">
              <label className="block text-[11px] font-bold text-stone-600 mb-1">
                또는 외부 이미지 웹 주소 (URL) 직접 입력:
              </label>
              <input
                type="url"
                placeholder="https://... 이미지 링크 주소"
                value={greetingForm.directorPhoto}
                onChange={e => setGreetingForm({ ...greetingForm, directorPhoto: e.target.value })}
                className="w-full p-2.5 text-xs rounded-xl border border-stone-200 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">인사말 대표 제목</label>
            <input
              type="text"
              value={greetingForm.title}
              onChange={e => setGreetingForm({ ...greetingForm, title: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-stone-200 font-bold text-stone-900"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">
              인사말 본문 문단 <span className="text-stone-400 font-normal">(빈 줄 2개로 문단 구분)</span>
            </label>
            <textarea
              rows={10}
              value={greetingForm.paragraphs}
              onChange={e => setGreetingForm({ ...greetingForm, paragraphs: e.target.value })}
              className="w-full p-3 rounded-xl border border-stone-200 leading-relaxed font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">서명 문구</label>
            <input
              type="text"
              value={greetingForm.sign}
              onChange={e => setGreetingForm({ ...greetingForm, sign: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-stone-200"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F5C451] to-[#F0935C] text-stone-950 font-black shadow-md hover:brightness-105 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>인사말 저장</span>
            </button>
          </div>
        </form>
      )}

      {/* 3. Teachers List */}
      {activeSubSection === 'teachers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-stone-500">등록된 교직원: {introDetails.teachers.length}명</p>
            <button
              onClick={openNewTeacher}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>교직원 추가</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {introDetails.teachers.map(teacher => (
              <div
                key={teacher.id}
                className="p-4 rounded-2xl bg-white border border-stone-200 flex flex-col justify-between space-y-3 shadow-2xs hover:border-amber-300 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                      {teacher.role} | {teacher.className}
                    </span>
                    <span className="text-[10px] text-stone-400">{teacher.badge}</span>
                  </div>
                  <h4 className="text-sm font-black text-stone-900">{teacher.name}</h4>
                  <p className="text-xs text-stone-600 mt-1 italic leading-relaxed">
                    "{teacher.message}"
                  </p>
                </div>

                <div className="flex items-center justify-end space-x-1 pt-2 border-t border-stone-100">
                  <button
                    onClick={() => openEditTeacher(teacher)}
                    className="p-1.5 rounded-lg bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-800 text-xs font-bold transition-colors"
                    title="수정"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteTeacherId(teacher.id)}
                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-colors"
                    title="삭제"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Facilities List */}
      {activeSubSection === 'facilities' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-stone-500">등록된 시설: {introDetails.facilities.length}개소</p>
            <button
              onClick={openNewFacility}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>시설 추가</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {introDetails.facilities.map(fac => (
              <div
                key={fac.id}
                className="rounded-2xl bg-white border border-stone-200 overflow-hidden shadow-2xs hover:border-amber-300 transition-colors flex flex-col"
              >
                <div className="h-40 bg-stone-100 overflow-hidden">
                  <img src={fac.imageUrl} alt={fac.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="text-sm font-black text-stone-900">{fac.name}</h4>
                    <p className="text-xs text-stone-500 mt-1 leading-relaxed">{fac.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {fac.features.map((f, i) => (
                        <span key={i} className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md font-medium">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-1 pt-2 border-t border-stone-100">
                    <button
                      onClick={() => openEditFacility(fac)}
                      className="p-1.5 rounded-lg bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-800 text-xs font-bold transition-colors"
                      title="수정"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteFacilityId(fac.id)}
                      className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-colors"
                      title="삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Classes (학급/반 이름 및 구성) Section */}
      {activeSubSection === 'classes' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-[#F0935C] shrink-0">
                  <School className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-black text-stone-900 flex items-center space-x-2">
                    <span>학급(반) 이름 및 구성 변경</span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                      총 {classesList.length}개 반
                    </span>
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    가정통신문, 갤러리, 일정, 원 소개 페이지 등에 표시되는 반 이름과 연령 정보를 수정합니다.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleResetToDefaultClasses}
                  className="px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-600 text-xs font-bold inline-flex items-center space-x-1 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>기본 5개 반 복원</span>
                </button>
              </div>
            </div>

            {/* Error Notification */}
            {classErrorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{classErrorMsg}</span>
              </div>
            )}

            {/* Preset themes */}
            <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/70">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-900 flex items-center">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 mr-1" />
                  추천 반 이름 테마 세트로 일괄 적용
                </span>
                <span className="text-[11px] text-amber-700">원하는 테마를 클릭하면 반 이름이 즉시 변경됩니다</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {PRESET_THEMES.map(preset => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleApplyPreset(preset.classes)}
                    className="px-3 py-1.5 rounded-lg bg-white hover:bg-amber-100 hover:border-amber-400 border border-amber-200 text-xs font-bold text-stone-800 transition-colors shadow-2xs cursor-pointer"
                    title={preset.classes.join(', ')}
                  >
                    <span>{preset.name}</span>
                    <span className="text-stone-400 text-[11px] ml-1.5 font-normal">
                      ({preset.classes.join(', ')})
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Classes List */}
            <form onSubmit={handleSaveClasses} className="space-y-3 pt-1">
              <div className="space-y-3">
                {classesList.map((cls, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-stone-50 hover:bg-amber-50/30 border border-stone-200 transition-colors space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-black flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-black text-stone-800 flex items-center space-x-1">
                          <Pencil className="w-3.5 h-3.5 text-[#F0935C]" />
                          <span>학급 정보 설정</span>
                        </span>
                      </div>

                      {/* Reorder and Delete controls */}
                      <div className="flex items-center space-x-1">
                        <button
                          type="button"
                          onClick={() => handleClassMoveUp(idx)}
                          disabled={idx === 0}
                          className="p-1.5 rounded-lg bg-white border border-stone-200 text-stone-600 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                          title="위로 이동"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleClassMoveDown(idx)}
                          disabled={idx === classesList.length - 1}
                          className="p-1.5 rounded-lg bg-white border border-stone-200 text-stone-600 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                          title="아래로 이동"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleClassDelete(idx)}
                          className="p-1.5 rounded-lg bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 cursor-pointer ml-1"
                          title="반 삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="block font-bold text-stone-700 mb-1">
                          반 이름 <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={cls.name}
                          onChange={e => handleClassNameChange(idx, e.target.value)}
                          placeholder="예: 햇살반"
                          className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white font-black text-stone-900 focus:outline-hidden focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                          required
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-stone-700 mb-1">
                          대상 연령
                        </label>
                        <input
                          type="text"
                          value={cls.age}
                          onChange={e => handleClassFieldChange(idx, 'age', e.target.value)}
                          placeholder="예: 만 1세"
                          className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white font-medium text-stone-900 focus:outline-hidden focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-stone-700 mb-1">
                          정원
                        </label>
                        <input
                          type="text"
                          value={cls.capacity}
                          onChange={e => handleClassFieldChange(idx, 'capacity', e.target.value)}
                          placeholder="예: 10명"
                          className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white font-medium text-stone-900 focus:outline-hidden focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                        />
                      </div>
                    </div>

                    <div className="text-xs">
                      <label className="block font-bold text-stone-700 mb-1">
                        반 소개 / 보육 특징
                      </label>
                      <input
                        type="text"
                        value={cls.desc}
                        onChange={e => handleClassFieldChange(idx, 'desc', e.target.value)}
                        placeholder="예: 언어 발달과 따뜻한 친구 관계 중심의 놀이 프로그램"
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white font-normal text-stone-700 focus:outline-hidden focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Add class button */}
              <button
                type="button"
                onClick={handleAddClass}
                className="w-full py-3 rounded-2xl border-2 border-dashed border-amber-300 hover:border-amber-400 bg-amber-50/50 hover:bg-amber-50 text-amber-800 font-bold text-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>새 학급(반) 추가하기</span>
              </button>

              {/* Submit bar */}
              <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-xs text-stone-500">
                  💡 반 이름을 변경하시면 기존 가정통신문 및 갤러리의 학급 명칭도 연동되어 자동 수정됩니다.
                </p>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#F5C451] to-[#F0935C] hover:brightness-105 active:scale-95 text-stone-950 font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>학급(반) 변경사항 저장</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Teacher Edit Modal */}
      {isTeacherModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs"
          onClick={() => setIsTeacherModalOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-stone-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-200">
              <h4 className="text-base font-black text-stone-900">
                {editingTeacherId ? '교직원 정보 수정' : '새 교직원 추가'}
              </h4>
              <button onClick={() => setIsTeacherModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveTeacher} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">성명 *</label>
                  <input
                    type="text"
                    value={teacherForm.name}
                    onChange={e => setTeacherForm({ ...teacherForm, name: e.target.value })}
                    required
                    className="w-full p-2.5 rounded-xl border border-stone-200 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">직책</label>
                  <input
                    type="text"
                    value={teacherForm.role}
                    onChange={e => setTeacherForm({ ...teacherForm, role: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-200 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">담당 학급/업무</label>
                <input
                  type="text"
                  value={teacherForm.className}
                  onChange={e => setTeacherForm({ ...teacherForm, className: e.target.value })}
                  placeholder="예: 열매반 (만4~5세)"
                  className="w-full p-2.5 rounded-xl border border-stone-200 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">보육 철학 / 인사 메시지</label>
                <textarea
                  rows={3}
                  value={teacherForm.message}
                  onChange={e => setTeacherForm({ ...teacherForm, message: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-200 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">자격 및 경력 배지</label>
                <input
                  type="text"
                  value={teacherForm.badge}
                  onChange={e => setTeacherForm({ ...teacherForm, badge: e.target.value })}
                  placeholder="예: 보육교사 1급 / 숲생태지도사"
                  className="w-full p-2.5 rounded-xl border border-stone-200 font-medium"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsTeacherModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-700 font-bold"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold"
                >
                  저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Facility Edit Modal */}
      {isFacilityModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs"
          onClick={() => setIsFacilityModalOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-200">
              <h4 className="text-base font-black text-stone-900">
                {editingFacilityId ? '시설 정보 수정' : '새 시설 추가'}
              </h4>
              <button onClick={() => setIsFacilityModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveFacility} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">시설명 *</label>
                <input
                  type="text"
                  value={facilityForm.name}
                  onChange={e => setFacilityForm({ ...facilityForm, name: e.target.value })}
                  required
                  placeholder="예: 햇살 가득 보육실 (연령별 5개 실)"
                  className="w-full p-2.5 rounded-xl border border-stone-200 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">시설 상세 설명</label>
                <textarea
                  rows={3}
                  value={facilityForm.description}
                  onChange={e => setFacilityForm({ ...facilityForm, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-200 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  주요 특장점 (한 줄에 하나씩)
                </label>
                <textarea
                  rows={3}
                  value={facilityForm.featuresText}
                  onChange={e => setFacilityForm({ ...facilityForm, featuresText: e.target.value })}
                  placeholder="친환경 편백나무 교구&#10;공기청정기 완비"
                  className="w-full p-2.5 rounded-xl border border-stone-200 font-mono"
                />
              </div>

              {/* Photo Upload */}
              <div>
                <FileUpload
                  value={facilityForm.imageUrl}
                  fileName={facilityForm.imageName}
                  isImageOnly={true}
                  folder="intro/facilities"
                  label="시설 사진 첨부 *"
                  helperText="보육실 및 유희실 사진 (Storage에 업로드)"
                  onChange={(url, name) => {
                    setFacilityForm({ ...facilityForm, imageUrl: url, imageName: name });
                  }}
                  onClear={() => {
                    setFacilityForm({ ...facilityForm, imageUrl: '', imageName: '' });
                  }}
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsFacilityModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-700 font-bold"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold"
                >
                  저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Teacher Confirm */}
      <ConfirmDialog
        isOpen={!!deleteTeacherId}
        title="교직원 정보를 삭제하시겠습니까?"
        message="명단에서 해당 교직원 정보가 삭제됩니다."
        confirmLabel="삭제"
        isDanger={true}
        onConfirm={() => {
          if (deleteTeacherId) {
            deleteTeacher(deleteTeacherId);
            setDeleteTeacherId(null);
          }
        }}
        onCancel={() => setDeleteTeacherId(null)}
      />

      {/* Delete Facility Confirm */}
      <ConfirmDialog
        isOpen={!!deleteFacilityId}
        title="시설 정보를 삭제하시겠습니까?"
        message="소개 페이지에서 해당 시설 항목이 삭제됩니다."
        confirmLabel="삭제"
        isDanger={true}
        onConfirm={() => {
          if (deleteFacilityId) {
            deleteFacility(deleteFacilityId);
            setDeleteFacilityId(null);
          }
        }}
        onCancel={() => setDeleteFacilityId(null)}
      />
    </div>
  );
};
