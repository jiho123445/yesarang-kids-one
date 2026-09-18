import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, Phone, Calendar, User, Baby } from 'lucide-react';
import { MascotSun } from './common/Illustrations';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    parentName: '',
    phone: '',
    childName: '',
    childAge: '만 2세 (줄기반)',
    preferredDate: '',
    memo: '',
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setFormData({
      parentName: '',
      phone: '',
      childName: '',
      childAge: '만 2세 (줄기반)',
      preferredDate: '',
      memo: '',
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs"
      onClick={handleResetAndClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-amber-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#F5C451] to-[#F0935C] p-6 text-stone-900 relative">
          <button
            onClick={handleResetAndClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/40 hover:bg-white text-stone-900 transition-colors"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-3">
            <MascotSun className="w-10 h-10 shrink-0" />
            <div>
              <span className="text-xs font-bold text-amber-900 block">입소 및 상담 문의</span>
              <h3 className="text-xl font-black">홍천 예사랑어린이집 상담 신청</h3>
            </div>
          </div>
          <p className="text-xs text-stone-800 font-medium mt-2">
            문의사항을 남겨주시면 원무실에서 확인 후 따뜻하고 친절하게 연락드리겠습니다.
          </p>
        </div>

        {/* Body */}
        <div className="p-6">
          {submitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-stone-900">상담 신청이 완료되었습니다!</h4>
              <p className="text-sm text-stone-600 max-w-sm mx-auto leading-relaxed">
                작성해주신 연락처(<span className="font-bold text-stone-800">{formData.phone}</span>)로 담당 교사 또는 원장님이 빠른 시일 내에 연락드리겠습니다.
              </p>
              <div className="pt-4">
                <button
                  onClick={handleResetAndClose}
                  className="px-6 py-2.5 rounded-xl bg-stone-900 text-white font-bold text-sm shadow-md hover:bg-stone-800"
                >
                  확인 및 닫기
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    보호자 성함 <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="홍길동"
                      value={formData.parentName}
                      onChange={e => setFormData({ ...formData, parentName: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-stone-200 focus:outline-hidden focus:border-[#F0935C] focus:ring-2 focus:ring-[#F0935C]/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    연락처 <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      placeholder="010-0000-0000"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-stone-200 focus:outline-hidden focus:border-[#F0935C] focus:ring-2 focus:ring-[#F0935C]/20"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    원아 이름 / 태명
                  </label>
                  <div className="relative">
                    <Baby className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="홍아이"
                      value={formData.childName}
                      onChange={e => setFormData({ ...formData, childName: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-stone-200 focus:outline-hidden focus:border-[#F0935C] focus:ring-2 focus:ring-[#F0935C]/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    희망 입소 연령
                  </label>
                  <select
                    value={formData.childAge}
                    onChange={e => setFormData({ ...formData, childAge: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-stone-200 focus:outline-hidden focus:border-[#F0935C] focus:ring-2 focus:ring-[#F0935C]/20 bg-white"
                  >
                    <option>만 0세 (씨앗반)</option>
                    <option>만 1세 (새싹반)</option>
                    <option>만 2세 (줄기반)</option>
                    <option>만 3세 (꽃잎반)</option>
                    <option>만 4~5세 (열매반)</option>
                    <option>시간제 / 맞춤돌봄 문의</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  방문 희망 일자 (선택)
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="date"
                    value={formData.preferredDate}
                    onChange={e => setFormData({ ...formData, preferredDate: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-stone-200 focus:outline-hidden focus:border-[#F0935C] focus:ring-2 focus:ring-[#F0935C]/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  문의 내용 (아이 성향, 특이사항 등)
                </label>
                <textarea
                  rows={3}
                  placeholder="궁금하신 점이나 상담하고 싶은 내용을 자유롭게 적어주세요."
                  value={formData.memo}
                  onChange={e => setFormData({ ...formData, memo: e.target.value })}
                  className="w-full p-3 text-sm rounded-xl border border-stone-200 focus:outline-hidden focus:border-[#F0935C] focus:ring-2 focus:ring-[#F0935C]/20 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <a
                  href="tel:033-435-6312"
                  className="text-xs text-stone-500 hover:text-stone-800 font-bold flex items-center"
                >
                  <Phone className="w-3.5 h-3.5 mr-1 text-[#F0935C]" />
                  원무실 직접 전화: 033-435-6312
                </a>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#F5C451] to-[#F0935C] text-stone-900 font-bold text-sm shadow-md hover:brightness-105 active:scale-95 transition-all cursor-pointer"
                >
                  상담 신청하기
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
