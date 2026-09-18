import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDanger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = '확인',
  cancelLabel = '취소',
  isDanger = true,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                isDanger ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-700'
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h4 className="text-base font-black text-stone-900">{title}</h4>
          </div>
          <button
            onClick={onCancel}
            className="text-stone-400 hover:text-stone-700 p-1"
            aria-label="닫기"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-stone-600 leading-relaxed mb-6 whitespace-pre-line">
          {message}
        </p>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 px-3 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-100 text-xs font-bold transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
            }}
            className={`flex-1 py-2.5 px-3 rounded-xl text-white text-xs font-bold transition-colors ${
              isDanger
                ? 'bg-rose-600 hover:bg-rose-700 shadow-xs'
                : 'bg-amber-600 hover:bg-amber-700 shadow-xs'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
