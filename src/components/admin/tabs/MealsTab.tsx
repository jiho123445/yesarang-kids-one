import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, Utensils, Calendar, Image as ImageIcon, Flame } from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { MealItem } from '../../../types';
import { FileUpload } from '../../common/FileUpload';
import { ConfirmDialog } from '../ConfirmDialog';

const DAY_MAP: Record<number, string> = {
  0: '일',
  1: '월',
  2: '화',
  3: '수',
  4: '목',
  5: '금',
  6: '토',
};

export const MealsTab: React.FC = () => {
  const { meals, addMeal, updateMeal, deleteMeal, adminEditingItem, setAdminEditingItem } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Form state
  const [formId, setFormId] = useState<string | null>(null);
  const [date, setDate] = useState(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  });
  const [dayOfWeek, setDayOfWeek] = useState('월');
  const [morningSnack, setMorningSnack] = useState('');
  const [lunchInput, setLunchInput] = useState('');
  const [afternoonSnack, setAfternoonSnack] = useState('');
  const [calories, setCalories] = useState(520);
  const [originInfo, setOriginInfo] = useState('쌀, 잡곡, 쇠고기, 돼지고기, 닭고기, 배추김치(국내산)');
  const [allergyInfo, setAllergyInfo] = useState('난류, 우유, 대두, 밀 함유');
  const [todayHighlight, setTodayHighlight] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageName, setImageName] = useState('');

  useEffect(() => {
    if (adminEditingItem && adminEditingItem._type === 'meal') {
      openEdit(adminEditingItem);
      setAdminEditingItem(null);
    }
  }, [adminEditingItem]);

  // Automatically calculate day of week when date changes
  const handleDateChange = (newDate: string) => {
    setDate(newDate);
    try {
      const d = new Date(newDate);
      if (!isNaN(d.getTime())) {
        setDayOfWeek(DAY_MAP[d.getDay()] || '월');
      }
    } catch {
      // ignore
    }
  };

  const openNew = () => {
    setFormId(null);
    const todayStr = new Date().toISOString().split('T')[0];
    handleDateChange(todayStr);
    setMorningSnack('유기농 사과 2조각, 흰 우유(100ml)');
    setLunchInput('친환경 찰흑미밥\n맑은 소고기무국\n수제 치킨안심텐더 & 허니머스터드\n애호박 새우살나물\n수제 배추김치');
    setAfternoonSnack('친환경 찐고구마, 유기농 식혜');
    setCalories(515);
    setOriginInfo('쌀, 잡곡, 쇠고기, 돼지고기, 닭고기, 배추김치(국내산)');
    setAllergyInfo('우유, 대두, 밀, 계란');
    setTodayHighlight('바삭하고 부드러운 수제 닭안심텐더');
    setImageUrl('https://images.unsplash.com/photo-1547592180-85f173990554?w=600&auto=format&fit=crop&q=80');
    setImageName('식단 기본 사진');
    setIsEditing(true);
  };

  const openEdit = (item: MealItem) => {
    setFormId(item.id);
    setDate(item.date);
    setDayOfWeek(item.dayOfWeek);
    setMorningSnack(item.morningSnack);
    setLunchInput(item.lunch.join('\n'));
    setAfternoonSnack(item.afternoonSnack);
    setCalories(item.calories);
    setOriginInfo(item.originInfo);
    setAllergyInfo(item.allergyInfo);
    setTodayHighlight(item.todayHighlight || '');
    setImageUrl(item.imageUrl || '');
    setImageName(item.imageUrl ? '등록된 식단 사진' : '');
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      alert('식단 일자를 지정해 주세요.');
      return;
    }

    const lunchDishes = lunchInput
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    if (lunchDishes.length === 0) {
      alert('점심 식단 메뉴를 한 줄에 하나씩 입력해 주세요.');
      return;
    }

    const payload = {
      date,
      dayOfWeek,
      morningSnack,
      lunch: lunchDishes,
      afternoonSnack,
      calories: Number(calories) || 500,
      originInfo,
      allergyInfo,
      todayHighlight: todayHighlight || undefined,
      imageUrl: imageUrl || undefined,
    };

    if (formId) {
      updateMeal(formId, payload);
    } else {
      addMeal(payload);
    }

    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
        <div>
          <h3 className="text-lg font-black text-stone-900">식단표 관리</h3>
          <p className="text-xs text-stone-500">
            총 {meals.length}일 분량의 영양 식단이 등록되어 있습니다.
          </p>
        </div>

        <button
          onClick={openNew}
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#F5C451] to-[#F0935C] text-stone-950 text-xs sm:text-sm font-bold shadow-xs hover:brightness-105 active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>새 식단 등록</span>
        </button>
      </div>

      {/* Meals Table/Card List */}
      <div className="space-y-3">
        {meals.map(item => (
          <div
            key={item.id}
            className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-amber-300 transition-colors shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div className="flex items-start space-x-4 min-w-0 flex-1">
              {/* Date pill */}
              <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col items-center justify-center shrink-0">
                <span className="text-[10px] font-bold text-amber-800">{item.dayOfWeek}요일</span>
                <span className="text-sm font-black text-stone-900">
                  {item.date.slice(5)}
                </span>
              </div>

              {/* Photo thumbnail if exists */}
              {item.imageUrl && (
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200 hidden sm:block">
                  <img src={item.imageUrl} alt="식단" className="w-full h-full object-cover" />
                </div>
              )}

              {/* Menus details */}
              <div className="space-y-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-stone-900">{item.date}</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 font-bold">
                    {item.calories} kcal
                  </span>
                  {item.todayHighlight && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold hidden lg:inline">
                      ★ {item.todayHighlight}
                    </span>
                  )}
                </div>

                <div className="text-xs text-stone-700 font-medium">
                  <strong className="text-stone-900">점심: </strong>
                  {item.lunch.join(', ')}
                </div>

                <div className="text-[11px] text-stone-500 flex flex-wrap gap-x-4">
                  <span>오전: {item.morningSnack}</span>
                  <span>오후: {item.afternoonSnack}</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center space-x-1.5 shrink-0 self-end md:self-center">
              <button
                onClick={() => openEdit(item)}
                className="inline-flex items-center px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-800 text-xs font-bold transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5 mr-1" />
                수정
              </button>
              <button
                onClick={() => setDeleteTargetId(item.id)}
                className="inline-flex items-center px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                삭제
              </button>
            </div>
          </div>
        ))}
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
                {formId ? '식단 정보 수정' : '새 식단 등록'}
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
                  <label className="block font-bold text-stone-700 mb-1">식단 일자 *</label>
                  <input
                    type="date"
                    value={date}
                    onChange={e => handleDateChange(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl border border-stone-200 font-bold text-stone-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">요일</label>
                  <select
                    value={dayOfWeek}
                    onChange={e => setDayOfWeek(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-white font-medium"
                  >
                    <option value="월">월요일</option>
                    <option value="화">화요일</option>
                    <option value="수">수요일</option>
                    <option value="목">목요일</option>
                    <option value="금">금요일</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">열량 (kcal)</label>
                  <input
                    type="number"
                    value={calories}
                    onChange={e => setCalories(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-stone-200 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  점심 메뉴 목록 * <span className="text-stone-400 font-normal">(한 줄에 한 메뉴씩 입력)</span>
                </label>
                <textarea
                  rows={5}
                  value={lunchInput}
                  onChange={e => setLunchInput(e.target.value)}
                  placeholder="예:&#10;친환경 찰흑미밥&#10;맑은 소고기무국&#10;수제 치킨텐더&#10;애호박나물&#10;배추김치"
                  required
                  className="w-full p-3 rounded-xl border border-stone-200 font-medium leading-relaxed font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">오전 간식</label>
                  <input
                    type="text"
                    value={morningSnack}
                    onChange={e => setMorningSnack(e.target.value)}
                    placeholder="예: 친환경 사과, 유기농 우유"
                    className="w-full p-2.5 rounded-xl border border-stone-200 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">오후 간식</label>
                  <input
                    type="text"
                    value={afternoonSnack}
                    onChange={e => setAfternoonSnack(e.target.value)}
                    placeholder="예: 친환경 찐고구마, 유기농 식혜"
                    className="w-full p-2.5 rounded-xl border border-stone-200 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">오늘의 추천 메뉴 (하이라이트)</label>
                <input
                  type="text"
                  value={todayHighlight}
                  onChange={e => setTodayHighlight(e.target.value)}
                  placeholder="예: 바삭하고 부드러운 수제 닭안심텐더"
                  className="w-full p-2.5 rounded-xl border border-stone-200 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">주요 식재료 원산지</label>
                  <input
                    type="text"
                    value={originInfo}
                    onChange={e => setOriginInfo(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">알레르기 유발 물질</label>
                  <input
                    type="text"
                    value={allergyInfo}
                    onChange={e => setAllergyInfo(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 font-medium"
                  />
                </div>
              </div>

              {/* Meal Photo Upload */}
              <div>
                <FileUpload
                  value={imageUrl}
                  fileName={imageName}
                  isImageOnly={true}
                  label="식단 사진 등록"
                  helperText="실제 배식 사진 또는 식단 이미지 첨부"
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
        title="식단을 삭제하시겠습니까?"
        message="해당 일자의 식단 정보가 완전히 삭제됩니다."
        confirmLabel="삭제"
        isDanger={true}
        onConfirm={() => {
          if (deleteTargetId) {
            deleteMeal(deleteTargetId);
            setDeleteTargetId(null);
          }
        }}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
