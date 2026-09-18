import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Sparkles,
  School,
  CheckCircle2,
  AlertCircle,
  Pencil,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { InstitutionClass } from '../../types';

interface ClassManageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (msg: string) => void;
}

// Default presets for quick convenience
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

export const ClassManageModal: React.FC<ClassManageModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { institution, updateClasses } = useData();

  // Local working copy of classes
  const [classesList, setClassesList] = useState<InstitutionClass[]>([]);
  const [originalNames, setOriginalNames] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync with institution when modal opens
  useEffect(() => {
    if (isOpen) {
      const current = institution.classes && institution.classes.length > 0
        ? institution.classes
        : DEFAULT_CLASSES;
      // Deep copy to prevent accidental direct state mutation
      const cloned = current.map(c => ({ ...c }));
      setClassesList(cloned);
      setOriginalNames(cloned.map(c => c.name));
      setErrorMsg(null);
    }
  }, [isOpen, institution.classes]);

  if (!isOpen) return null;

  const handleClassNameChange = (index: number, newName: string) => {
    setErrorMsg(null);
    setClassesList(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], name: newName };
      return updated;
    });
  };

  const handleFieldChange = (
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

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setClassesList(prev => {
      const updated = [...prev];
      const temp = updated[index - 1];
      updated[index - 1] = updated[index];
      updated[index] = temp;
      return updated;
    });
  };

  const handleMoveDown = (index: number) => {
    if (index === classesList.length - 1) return;
    setClassesList(prev => {
      const updated = [...prev];
      const temp = updated[index + 1];
      updated[index + 1] = updated[index];
      updated[index] = temp;
      return updated;
    });
  };

  const handleDelete = (index: number) => {
    if (classesList.length <= 1) {
      setErrorMsg('최소 1개 이상의 학급(반)이 등록되어 있어야 합니다.');
      return;
    }
    setErrorMsg(null);
    setClassesList(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddClass = () => {
    setErrorMsg(null);
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
    setErrorMsg(null);
    setClassesList(prev => {
      return prev.map((cls, idx) => ({
        ...cls,
        name: presetNames[idx] || cls.name,
      }));
    });
  };

  const handleResetToDefault = () => {
    setErrorMsg(null);
    setClassesList(DEFAULT_CLASSES.map(c => ({ ...c })));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const trimmedClasses = classesList.map(c => ({
      ...c,
      name: c.name.trim(),
      age: c.age.trim(),
      capacity: c.capacity.trim(),
      desc: c.desc.trim(),
    }));

    // Check empty names
    for (let i = 0; i < trimmedClasses.length; i++) {
      if (!trimmedClasses[i].name) {
        setErrorMsg(`${i + 1}번째 반의 이름을 입력해 주세요.`);
        return;
      }
    }

    // Check duplicates
    const names = trimmedClasses.map(c => c.name);
    const duplicates = names.filter((item, index) => names.indexOf(item) !== index);
    if (duplicates.length > 0) {
      setErrorMsg(`중복된 반 이름이 있습니다: "${duplicates[0]}". 각 반 이름은 서로 달라야 합니다.`);
      return;
    }

    // Build rename mapping (oldName -> newName)
    const renameMap: Record<string, string> = {};
    originalNames.forEach((oldName, idx) => {
      const newName = trimmedClasses[idx]?.name;
      if (newName && oldName !== newName) {
        renameMap[oldName] = newName;
      }
    });

    updateClasses(trimmedClasses, renameMap);
    onSuccess?.('학급(반) 이름 및 구성이 성공적으로 변경되었습니다.');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/70 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-3xl p-5 sm:p-7 shadow-2xl max-h-[92vh] flex flex-col border border-stone-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-[#F0935C] shadow-2xs">
              <School className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-stone-900 flex items-center space-x-1.5">
                <span>학급(반) 이름 및 구성 변경</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                  {classesList.length}개 반
                </span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                가정통신문, 갤러리, 행사일정, 원소개 학급 탭에 표시되는 반 이름을 수정합니다.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            title="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center space-x-2 shrink-0 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Preset suggestions */}
        <div className="py-3 shrink-0 border-b border-stone-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-stone-600 flex items-center">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 mr-1" />
              추천 테마 세트로 일괄 적용
            </span>
            <button
              type="button"
              onClick={handleResetToDefault}
              className="text-[11px] text-stone-500 hover:text-stone-800 font-bold inline-flex items-center space-x-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>기본 테마 복원</span>
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_THEMES.map(preset => (
              <button
                key={preset.name}
                type="button"
                onClick={() => handleApplyPreset(preset.classes)}
                className="px-2.5 py-1 rounded-lg bg-stone-50 hover:bg-amber-50 hover:border-amber-300 border border-stone-200 text-[11px] font-bold text-stone-700 transition-colors cursor-pointer"
                title={preset.classes.join(', ')}
              >
                <span>{preset.name}</span>
                <span className="text-stone-400 text-[10px] ml-1 font-normal">
                  ({preset.classes.slice(0, 3).join('/')}...)
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Class List Form */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto py-3 space-y-3 pr-1">
          {classesList.map((cls, idx) => (
            <div
              key={idx}
              className="p-3 sm:p-4 rounded-2xl bg-stone-50 hover:bg-amber-50/40 border border-stone-200 transition-colors space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[11px] font-black flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-black text-stone-800 flex items-center space-x-1">
                    <Pencil className="w-3 h-3 text-[#F0935C]" />
                    <span>반 이름 설정</span>
                  </span>
                </div>

                {/* Move & Delete controls */}
                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={() => handleMoveUp(idx)}
                    disabled={idx === 0}
                    className="p-1 rounded-lg bg-white border border-stone-200 text-stone-600 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    title="위로 이동"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveDown(idx)}
                    disabled={idx === classesList.length - 1}
                    className="p-1 rounded-lg bg-white border border-stone-200 text-stone-600 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    title="아래로 이동"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(idx)}
                    className="p-1 rounded-lg bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 cursor-pointer ml-1"
                    title="반 삭제"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Input fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-0.5">
                    반 이름 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={cls.name}
                    onChange={e => handleClassNameChange(idx, e.target.value)}
                    placeholder="예: 햇살반"
                    className="w-full px-2.5 py-1.5 rounded-xl border border-stone-200 bg-white font-bold text-stone-900 focus:outline-hidden focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-0.5">
                    대상 연령
                  </label>
                  <input
                    type="text"
                    value={cls.age}
                    onChange={e => handleFieldChange(idx, 'age', e.target.value)}
                    placeholder="예: 만 1세"
                    className="w-full px-2.5 py-1.5 rounded-xl border border-stone-200 bg-white font-medium text-stone-900 focus:outline-hidden focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-0.5">
                    정원
                  </label>
                  <input
                    type="text"
                    value={cls.capacity}
                    onChange={e => handleFieldChange(idx, 'capacity', e.target.value)}
                    placeholder="예: 10명"
                    className="w-full px-2.5 py-1.5 rounded-xl border border-stone-200 bg-white font-medium text-stone-900 focus:outline-hidden focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-0.5">
                  반 소개 / 교육 특징
                </label>
                <input
                  type="text"
                  value={cls.desc}
                  onChange={e => handleFieldChange(idx, 'desc', e.target.value)}
                  placeholder="예: 언어 폭발기 어휘력 증진 및 긍정적 또래 관계 형성"
                  className="w-full px-2.5 py-1.5 rounded-xl border border-stone-200 bg-white text-xs font-normal text-stone-700 focus:outline-hidden focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </div>
            </div>
          ))}

          {/* Add Class Button */}
          <button
            type="button"
            onClick={handleAddClass}
            className="w-full py-2.5 rounded-2xl border-2 border-dashed border-amber-300 hover:border-amber-400 bg-amber-50/50 hover:bg-amber-50 text-amber-800 font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>새 학급(반) 추가하기</span>
          </button>
        </form>

        {/* Footer */}
        <div className="pt-3 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
          <p className="text-[11px] text-stone-500">
            💡 반 이름을 변경하면 기존 가정통신문 및 갤러리의 학급 명칭도 자동 반영됩니다.
          </p>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-colors cursor-pointer"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#F5C451] to-[#F0935C] hover:brightness-105 active:scale-95 text-stone-950 font-black text-xs shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>반 이름 변경 저장</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
