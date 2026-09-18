import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, Calendar as CalendarIcon, Clock, MapPin, Users } from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { CalendarEvent } from '../../../types';
import { ConfirmDialog } from '../ConfirmDialog';

export const EventsTab: React.FC = () => {
  const { events, addEvent, updateEvent, deleteEvent, adminEditingItem, setAdminEditingItem } = useData();
  const [selectedMonth, setSelectedMonth] = useState<number>(3);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Form state
  const [formId, setFormId] = useState<string | null>(null);
  const [date, setDate] = useState('2026-03-23');
  const [month, setMonth] = useState(3);
  const [day, setDay] = useState(23);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CalendarEvent['category']>('행사');
  const [targetClass, setTargetClass] = useState('전체');
  const [time, setTime] = useState('10:30 ~ 12:00');
  const [location, setLocation] = useState('예사랑어린이집 2층 유희실');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (adminEditingItem && adminEditingItem._type === 'event') {
      openEdit(adminEditingItem);
      setAdminEditingItem(null);
    }
  }, [adminEditingItem]);

  const handleDateChange = (newDate: string) => {
    setDate(newDate);
    const parts = newDate.split('-');
    if (parts.length === 3) {
      setMonth(parseInt(parts[1], 10));
      setDay(parseInt(parts[2], 10));
    }
  };

  const openNew = () => {
    setFormId(null);
    const defaultDate = `2026-${String(selectedMonth).padStart(2, '0')}-15`;
    handleDateChange(defaultDate);
    setTitle('');
    setCategory('행사');
    setTargetClass('전체');
    setTime('10:00 ~ 11:30');
    setLocation('예사랑어린이집 원내');
    setDescription('');
    setIsEditing(true);
  };

  const openEdit = (item: CalendarEvent) => {
    setFormId(item.id);
    setDate(item.date);
    setMonth(item.month);
    setDay(item.day);
    setTitle(item.title);
    setCategory(item.category);
    setTargetClass(item.targetClass || '전체');
    setTime(item.time || '');
    setLocation(item.location || '');
    setDescription(item.description || '');
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) {
      alert('일정 제목과 일자를 입력해 주세요.');
      return;
    }

    const payload = {
      date,
      month,
      day,
      title,
      category,
      targetClass: targetClass === '전체' ? undefined : targetClass,
      time: time || undefined,
      location: location || undefined,
      description: description || undefined,
    };

    if (formId) {
      updateEvent(formId, payload);
    } else {
      addEvent(payload);
    }

    setIsEditing(false);
  };

  const filteredEvents = events.filter(e => e.month === selectedMonth);

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
        <div>
          <h3 className="text-lg font-black text-stone-900">학사 및 행사일정 관리</h3>
          <p className="text-xs text-stone-500">
            총 {events.length}건의 연간 일정이 등록되어 있습니다.
          </p>
        </div>

        <button
          onClick={openNew}
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#F5C451] to-[#F0935C] text-stone-950 text-xs sm:text-sm font-bold shadow-xs hover:brightness-105 active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>새 일정 등록</span>
        </button>
      </div>

      {/* Month Selection Buttons */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-2">
        {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
          <button
            key={m}
            onClick={() => setSelectedMonth(m)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              selectedMonth === m
                ? 'bg-[#F0935C] text-white shadow-xs scale-105'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            {m}월
          </button>
        ))}
      </div>

      {/* Events List for selected month */}
      <div className="space-y-3">
        {filteredEvents.length === 0 ? (
          <div className="p-8 text-center text-xs text-stone-400 bg-white rounded-2xl border border-stone-200">
            {selectedMonth}월에 등록된 일정이 없습니다.
          </div>
        ) : (
          filteredEvents.map(event => (
            <div
              key={event.id}
              className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-amber-300 transition-colors shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-start space-x-3.5 min-w-0 flex-1">
                {/* Day Badge */}
                <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-200 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold text-orange-800">{event.month}월</span>
                  <span className="text-base font-black text-stone-900">{event.day}일</span>
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                    <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-bold">
                      {event.category}
                    </span>
                    {event.targetClass && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold">
                        {event.targetClass}
                      </span>
                    )}
                    {event.time && (
                      <span className="flex items-center text-stone-500">
                        <Clock className="w-3 h-3 mr-0.5" />
                        {event.time}
                      </span>
                    )}
                    {event.location && (
                      <span className="flex items-center text-stone-500 hidden md:flex">
                        <MapPin className="w-3 h-3 mr-0.5" />
                        {event.location}
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-stone-900">{event.title}</h4>
                  {event.description && (
                    <p className="text-xs text-stone-500 line-clamp-1">{event.description}</p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-1.5 shrink-0 self-end sm:self-center">
                <button
                  onClick={() => openEdit(event)}
                  className="inline-flex items-center px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-800 text-xs font-bold transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5 mr-1" />
                  수정
                </button>
                <button
                  onClick={() => setDeleteTargetId(event.id)}
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
            className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto border border-stone-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-stone-200">
              <h4 className="text-lg font-black text-stone-900">
                {formId ? '행사 일정 수정' : '새 행사 일정 등록'}
              </h4>
              <button
                onClick={() => setIsEditing(false)}
                className="text-stone-400 hover:text-stone-700 text-sm font-bold"
              >
                닫기 ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">일정 일자 *</label>
                  <input
                    type="date"
                    value={date}
                    onChange={e => handleDateChange(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl border border-stone-200 font-bold text-stone-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">행사 분류</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-white font-medium"
                  >
                    <option value="행사">원내행사</option>
                    <option value="체험">체험학습/견학</option>
                    <option value="휴원">휴원/공휴일</option>
                    <option value="보건/안전">보건/안전교육</option>
                    <option value="교육">학부모/교사교육</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">행사명 *</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="예: 2026학년도 신입 및 재원 유아 오리엔테이션"
                  required
                  className="w-full p-2.5 rounded-xl border border-stone-200 font-bold text-stone-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">대상 학급</label>
                  <select
                    value={targetClass}
                    onChange={e => setTargetClass(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-white font-medium"
                  >
                    <option value="전체">전체 (공통)</option>
                    <option value="씨앗반">씨앗반</option>
                    <option value="새싹반">새싹반</option>
                    <option value="줄기반">줄기반</option>
                    <option value="꽃잎반">꽃잎반</option>
                    <option value="열매반">열매반</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">진행 시간</label>
                  <input
                    type="text"
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    placeholder="예: 10:30 ~ 12:00"
                    className="w-full p-2.5 rounded-xl border border-stone-200 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">장소</label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="예: 예사랑어린이집 2층 늘푸른 유희실"
                  className="w-full p-2.5 rounded-xl border border-stone-200 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">행사 상세 설명</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="행사 준비물, 세부 안내 사항 등을 적어주세요."
                  className="w-full p-2.5 rounded-xl border border-stone-200 font-medium"
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
        title="일정을 삭제하시겠습니까?"
        message="학사 일정에서 해당 행사가 삭제됩니다."
        confirmLabel="삭제"
        isDanger={true}
        onConfirm={() => {
          if (deleteTargetId) {
            deleteEvent(deleteTargetId);
            setDeleteTargetId(null);
          }
        }}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
