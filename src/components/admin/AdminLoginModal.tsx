import React, { useState, useEffect, useRef } from 'react';
import { Lock, Eye, EyeOff, X, ShieldAlert, CheckCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const AdminLoginModal: React.FC = () => {
  const { isPasswordModalOpen, setIsPasswordModalOpen, login, setIsAdminDashboardOpen } = useData();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isPasswordModalOpen) {
      setPassword('');
      setErrorMessage(null);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isPasswordModalOpen]);

  if (!isPasswordModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setErrorMessage('비밀번호를 입력해 주세요.');
      return;
    }

    setIsSubmitting(true);
    const res = await login(password);
    setIsSubmitting(false);
    if (res.success) {
      setIsPasswordModalOpen(false);
      setIsAdminDashboardOpen(true);
    } else {
      setErrorMessage(res.message || '비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={() => setIsPasswordModalOpen(false)}
    >
      <div
        className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 shadow-xs">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-700 block">원장 / 교직원 전용</span>
              <h3 className="text-xl font-black text-stone-900">관리자 모드 로그인</h3>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsPasswordModalOpen(false)}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-stone-500 mb-6 leading-relaxed">
          공지사항, 가정통신문, 식단표, 갤러리 및 원 정보 변경을 위한 관리자 인증입니다.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              관리자 비밀번호
            </label>
            <div className="relative">
              <input
                ref={inputRef}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder="비밀번호를 입력하세요"
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-amber-400 text-sm font-medium pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-stone-400 mt-2 px-1">
              <span>비밀번호는 대시보드 설정 탭에서 변경할 수 있습니다.</span>
            </div>
          </div>

          {errorMessage && (
            <div className="flex items-center space-x-2 p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="pt-2 flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setIsPasswordModalOpen(false)}
              className="flex-1 py-3 px-4 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-100 text-xs sm:text-sm font-bold transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#F5C451] to-[#F0935C] text-stone-950 hover:brightness-105 text-xs sm:text-sm font-black shadow-md transition-all active:scale-98 disabled:opacity-60"
            >
              {isSubmitting ? '로그인 중...' : '로그인'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
