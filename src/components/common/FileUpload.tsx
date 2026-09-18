import React, { useRef, useState } from 'react';
import { Upload, X, FileText, Image as ImageIcon, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { handleFileUpload, formatFileSize } from '../../utils/fileUpload';

interface FileUploadProps {
  value?: string; // Storage 다운로드 URL
  fileName?: string;
  onChange: (fileUrl: string, fileName: string, fileSize?: number) => void;
  onClear?: () => void;
  accept?: string;
  label?: string;
  helperText?: string;
  isImageOnly?: boolean;
  maxSizeMB?: number;
  /** Firebase Storage 내 저장 폴더 (예: 'notices', 'gallery', 'meals') */
  folder: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  value,
  fileName,
  onChange,
  onClear,
  accept = 'image/*,application/pdf,.hwp,.docx',
  label = '파일 첨부',
  helperText = 'JPG, PNG, WebP 또는 PDF 문서 (최대 10MB)',
  isImageOnly = false,
  maxSizeMB = 10,
  folder,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isImage = isImageOnly || (value && (value.startsWith('data:image/') || value.includes('images.unsplash.com') || /\.(jpe?g|png|webp|gif)$/i.test(fileName || '')));

  const processFile = async (file: File) => {
    setErrorMessage(null);

    // Validate size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setErrorMessage(`파일 크기는 최대 ${maxSizeMB}MB 이하만 업로드 가능합니다.`);
      return;
    }

    // Validate type if isImageOnly
    if (isImageOnly && !file.type.startsWith('image/')) {
      setErrorMessage('이미지 파일만 등록할 수 있습니다 (JPG, PNG 등).');
      return;
    }

    try {
      setIsProcessing(true);
      const downloadUrl = await handleFileUpload(file, folder);
      onChange(downloadUrl, file.name, file.size);
    } catch (err) {
      console.error('File upload error:', err);
      setErrorMessage('파일 업로드 중 오류가 발생했습니다. 네트워크를 확인 후 다시 시도해 주세요.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    // reset input so same file can be selected again
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClear) {
      onClear();
    }
    setErrorMessage(null);
  };

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-xs font-bold text-stone-700">
          {label}
        </label>
      )}

      {/* Hidden native input */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upload Box or Preview */}
      {value ? (
        <div className="relative p-3 rounded-2xl border-2 border-amber-200 bg-amber-50/40 flex items-center justify-between gap-3 group">
          <div className="flex items-center space-x-3 overflow-hidden">
            {/* Thumbnail Preview or Icon */}
            {isImage ? (
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-amber-200 shadow-2xs">
                <img
                  src={value}
                  alt={fileName || '미리보기'}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6" />
              </div>
            )}

            {/* File info */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <p className="text-xs font-bold text-stone-900 truncate">
                  {fileName || (isImage ? '첨부된 이미지' : '첨부 문서')}
                </p>
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5">업로드 완료</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-1.5 shrink-0">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 text-xs font-medium transition-colors"
              title="파일 변경"
            >
              변경
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
              title="첨부 취소"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`cursor-pointer rounded-2xl border-2 border-dashed p-5 text-center transition-all ${
            isDragging
              ? 'border-amber-500 bg-amber-50/80 scale-[1.01]'
              : 'border-stone-300 hover:border-amber-400 bg-stone-50/60 hover:bg-amber-50/30'
          }`}
        >
          {isProcessing ? (
            <div className="flex flex-col items-center justify-center py-2 space-y-2 text-stone-600">
              <RefreshCw className="w-6 h-6 animate-spin text-amber-500" />
              <p className="text-xs font-semibold">파일을 업로드하는 중입니다...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-amber-100/80 text-amber-700 flex items-center justify-center">
                {isImageOnly ? <ImageIcon className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
              </div>
              <div>
                <p className="text-xs font-bold text-stone-800">
                  <span className="text-amber-700 hover:underline">파일을 선택</span>하거나 여기로 드래그하세요
                </p>
                <p className="text-[11px] text-stone-400 mt-0.5">{helperText}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center space-x-1.5 text-xs text-rose-600 pt-1 font-medium">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
