import React, { useState } from 'react';
import { ShieldCheck, LayoutDashboard, RotateCcw, LogOut, PlusCircle, Sparkles, Hammer } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { ConfirmDialog } from './ConfirmDialog';

export const AdminToolbar: React.FC = () => {
  const { isAdmin, setIsAdminDashboardOpen, logout, resetToDefaults, openAdminWithTab, maintenance, updateMaintenance } = useData();
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  if (!isAdmin) return null;

  return (
    <>
      <div className="bg-stone-900 text-amber-300 border-b border-amber-500/30 py-2 px-3 sm:px-6 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-nowrap items-center justify-between gap-3 text-xs overflow-x-auto scrollbar-none">
          {/* Left indicator */}
          <div className="flex items-center space-x-2 shrink-0 whitespace-nowrap">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <div className="flex items-center space-x-1.5 font-bold">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span className="text-white font-extrabold">예사랑 CMS 관리자 모드</span>
              <span className="hidden sm:inline text-amber-400/80 font-normal">| 실시간 콘텐츠 편집 가능</span>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center space-x-2 shrink-0 whitespace-nowrap">
            <button
              onClick={() => setIsAdminDashboardOpen(true)}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 text-stone-950 font-black hover:brightness-110 shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>관리자 대시보드</span>
            </button>

            <button
              onClick={() => openAdminWithTab('notices')}
              className="hidden md:inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white border border-stone-700 transition-colors cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>새 글 등록</span>
            </button>

            <button
              onClick={() => updateMaintenance({ enabled: !maintenance.enabled })}
              className={`inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                maintenance.enabled
                  ? 'bg-rose-500 hover:bg-rose-600 text-white border-rose-400'
                  : 'bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border-stone-700'
              }`}
              title="방문자에게 공사중 화면을 보여줄지 전환합니다 (관리자는 항상 정상 화면을 봅니다)"
            >
              <Hammer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{maintenance.enabled ? '공사중 해제' : '공사중 모드'}</span>
            </button>

            <button
              onClick={() => setIsResetConfirmOpen(true)}
              className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700 transition-colors cursor-pointer"
              title="초기 JSON 목업 데이터로 되돌리기"
            >
              <RotateCcw className="w-3.5 h-3.5 text-stone-400" />
              <span className="hidden sm:inline">데이터 초기화</span>
            </button>

            <button
              onClick={logout}
              className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-stone-800 hover:bg-rose-900/60 text-stone-300 hover:text-rose-200 border border-stone-700 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>로그아웃</span>
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        title="데이터를 초기 상태로 복원하시겠습니까?"
        message={`등록하거나 수정한 모든 공지사항, 가정통신문, 갤러리, 식단, 행사 일정 및 기본 정보가 원본(Default JSON) 데이터로 초기화됩니다.\n\n이 작업은 되돌릴 수 없습니다.`}
        confirmLabel="초기화 진행"
        isDanger={true}
        onConfirm={() => {
          resetToDefaults();
          setIsResetConfirmOpen(false);
        }}
        onCancel={() => setIsResetConfirmOpen(false)}
      />
    </>
  );
};
