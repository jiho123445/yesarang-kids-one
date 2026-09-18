import React, { useState } from 'react';
import { Save, Building, Users, Heart, Phone, MapPin, Plus, Trash2, Edit3, CheckCircle2 } from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { TeacherInfo, FacilityRoom } from '../../../types';
import { FileUpload } from '../../common/FileUpload';
import { ConfirmDialog } from '../ConfirmDialog';

export const IntroTab: React.FC = () => {
  const {
    institution,
    updateInstitution,
    introDetails,
    updateIntroDetails,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    addFacility,
    updateFacility,
    deleteFacility,
  } = useData();

  const [activeSubSection, setActiveSubSection] = useState<'basic' | 'greeting' | 'teachers' | 'facilities'>('basic');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

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

  // Form state for Greeting
  const [greetingForm, setGreetingForm] = useState({
    title: institution.greeting.title,
    paragraphs: institution.greeting.paragraphs.join('\n\n'),
    sign: institution.greeting.sign,
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

  const handleSaveGreeting = (e: React.FormEvent) => {
    e.preventDefault();
    updateInstitution({
      greeting: {
        title: greetingForm.title,
        paragraphs: greetingForm.paragraphs.split('\n\n').map(p => p.trim()).filter(Boolean),
        sign: greetingForm.sign,
      },
    });
    showNotification('원장 인사말이 성공적으로 저장되었습니다.');
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

      {/* 2. Greeting Form */}
      {activeSubSection === 'greeting' && (
        <form onSubmit={handleSaveGreeting} className="space-y-4 text-xs bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
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
                  label="시설 사진 첨부 *"
                  helperText="보육실 및 유희실 사진 (Base64 변환 저장)"
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
