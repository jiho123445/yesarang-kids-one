import React, { useState } from 'react';
import { KeyRound, RotateCcw, Download, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { ConfirmDialog } from '../ConfirmDialog';

export const SettingsTab: React.FC = () => {
  const { changePassword, resetToDefaults, notices, newsletters, meals, gallery, events, institution, introDetails } = useData();
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwMessage, setPwMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMessage(null);

    if (newPw !== confirmPw) {
      setPwMessage({ type: 'error', text: '새 비밀번호와 비밀번호 확인이 일치하지 않습니다.' });
      return;
    }

    const res = await changePassword(currentPw, newPw);
    if (res.success) {
      setPwMessage({ type: 'success', text: '관리자 비밀번호가 성공적으로 변경되었습니다.' });
      setCurrentPw('');
      setNewPw('');
      setConfirmPw('');
    } else {
      setPwMessage({ type: 'error', text: res.message || '비밀번호 변경에 실패했습니다.' });
    }
  };

  // Export current data as JSON backup
  const handleExportBackup = () => {
    const backupData = {
      exportedAt: new Date().toISOString(),
      institution,
      introDetails,
      notices,
      newsletters,
      meals,
      gallery,
      events,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `yesarang_kids_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-stone-200">
        <h3 className="text-lg font-black text-stone-900">관리자 계정 및 시스템 설정</h3>
        <p className="text-xs text-stone-500">
          관리자 접속 비밀번호를 안전하게 관리하고 전체 데이터를 백업하거나 초기화할 수 있습니다.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Change Password */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b border-stone-100">
            <KeyRound className="w-5 h-5 text-amber-600" />
            <h4 className="text-sm font-black text-stone-900">관리자 비밀번호 변경</h4>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-stone-700 mb-1">현재 비밀번호</label>
              <input
                type="password"
                value={currentPw}
                onChange={e => setCurrentPw(e.target.value)}
                placeholder="현재 비밀번호 (초기: admin1234)"
                required
                className="w-full p-2.5 rounded-xl border border-stone-200"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">새 비밀번호 (4자리 이상)</label>
              <input
                type="password"
                value={newPw}
                onChange={e => setNewPw(e.target.value)}
                placeholder="새로운 비밀번호 입력"
                required
                minLength={4}
                className="w-full p-2.5 rounded-xl border border-stone-200"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">새 비밀번호 확인</label>
              <input
                type="password"
                value={confirmPw}
                onChange={e => setConfirmPw(e.target.value)}
                placeholder="새로운 비밀번호 한 번 더 입력"
                required
                minLength={4}
                className="w-full p-2.5 rounded-xl border border-stone-200"
              />
            </div>

            {pwMessage && (
              <div
                className={`p-3 rounded-xl flex items-center space-x-2 text-xs font-semibold ${
                  pwMessage.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {pwMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{pwMessage.text}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold transition-colors cursor-pointer"
            >
              비밀번호 변경 적용
            </button>
          </form>
        </div>

        {/* 2. Data Backup & System Reset */}
        <div className="space-y-4">
          {/* Backup Download */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
            <div className="flex items-center space-x-2 pb-2 border-b border-stone-100">
              <Download className="w-5 h-5 text-blue-600" />
              <h4 className="text-sm font-black text-stone-900">전체 데이터 JSON 백업 다운로드</h4>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">
              현재 브라우저에 저장된 공지, 통신문, 식단, 갤러리 및 원 정보 전체를 안전한 단일 JSON 파일로 컴퓨터에 백업할 수 있습니다.
            </p>
            <button
              type="button"
              onClick={handleExportBackup}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs font-bold transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>백업 파일(.json) 내려받기</span>
            </button>
          </div>

          {/* Reset to Factory Defaults */}
          <div className="bg-rose-50/50 p-5 rounded-2xl border border-rose-200 shadow-2xs space-y-3">
            <div className="flex items-center space-x-2 pb-2 border-b border-rose-100">
              <RotateCcw className="w-5 h-5 text-rose-600" />
              <h4 className="text-sm font-black text-rose-900">초기 데이터로 원복 (초기화)</h4>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              테스트 중 추가하거나 수정한 모든 콘텐츠를 최초 시스템 기본 데이터(원본 JSON)로 되돌립니다. 실수로 변경한 내용을 복구하고 싶을 때 사용하세요.
            </p>
            <button
              type="button"
              onClick={() => setIsResetConfirmOpen(true)}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>초기 데이터로 전체 초기화</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirm Reset Dialog */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        title="전체 데이터를 초기화하시겠습니까?"
        message="작성하신 모든 공지, 가정통신문, 갤러리 사진, 식단 등이 초기 상태로 복원됩니다."
        confirmLabel="초기화 실행"
        isDanger={true}
        onConfirm={() => {
          resetToDefaults();
          setIsResetConfirmOpen(false);
          alert('모든 데이터가 기본 초기값으로 복원되었습니다.');
        }}
        onCancel={() => setIsResetConfirmOpen(false)}
      />
    </div>
  );
};
