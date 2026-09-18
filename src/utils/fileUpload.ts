import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase';

/**
 * File upload utility backed by Firebase Storage.
 * 이미지가 아닌 파일(PDF, HWP, DOCX 등)은 압축 없이 그대로 업로드합니다.
 * 이미지 파일은 Canvas로 리사이즈/압축한 뒤 업로드해 Storage 용량과 로딩 속도를 절약합니다.
 */

function compressImage(file: File, maxWidth: number, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('파일을 읽는 중 오류가 발생했습니다.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('이미지를 처리하는 중 오류가 발생했습니다.'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('이미지를 처리하는 중 오류가 발생했습니다.'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const mimeType = file.type === 'image/png' ? 'image/jpeg' : file.type;
        canvas.toBlob(
          blob => (blob ? resolve(blob) : reject(new Error('이미지 압축에 실패했습니다.'))),
          mimeType,
          quality
        );
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}

/**
 * 파일을 Firebase Storage에 업로드하고 다운로드 URL을 반환합니다.
 * @param folder Storage 내 경로 (예: 'notices', 'gallery', 'meals')
 */
export async function handleFileUpload(
  file: File,
  folder: string,
  options: { compressImage?: boolean; maxWidth?: number; quality?: number } = {}
): Promise<string> {
  const { compressImage: shouldCompress = true, maxWidth = 1200, quality = 0.82 } = options;

  const isImage = file.type.startsWith('image/');
  const uploadBlob: Blob = isImage && shouldCompress ? await compressImage(file, maxWidth, quality) : file;

  const safeName = sanitizeFileName(file.name);
  const path = `${folder}/${Date.now()}_${safeName}`;
  const storageRef = ref(storage, path);

  await uploadBytes(storageRef, uploadBlob, { contentType: uploadBlob.type || file.type });
  return getDownloadURL(storageRef);
}

/**
 * Formats bytes to human-readable size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
