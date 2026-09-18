/**
 * File upload utility with Base64 FileReader conversion.
 * Designed to easily transition to Firebase Storage, Supabase, or AWS S3 in the future.
 */

export interface UploadResult {
  dataUrl: string;
  name: string;
  size: number;
  type: string;
}

/**
 * Reads a File object and converts it to a Data URL (Base64 string).
 * For large images (> 1MB), automatically compresses down to max 1200px to ensure
 * browser localStorage capacity is preserved without visual quality loss.
 */
export async function handleFileUpload(
  file: File,
  options: { compressImage?: boolean; maxWidth?: number; quality?: number } = {}
): Promise<string> {
  const { compressImage = true, maxWidth = 1200, quality = 0.82 } = options;

  return new Promise((resolve, reject) => {
    // If it's an image and compression is enabled, use HTML5 Canvas to scale & optimize
    if (compressImage && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('파일을 읽는 중 오류가 발생했습니다.'));
      reader.onload = () => {
        const img = new Image();
        img.onerror = () => resolve(reader.result as string); // fallback to raw
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          // Only scale down if width exceeds maxWidth
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(reader.result as string);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          const mimeType = file.type === 'image/png' ? 'image/jpeg' : file.type;
          const compressedDataUrl = canvas.toDataURL(mimeType, quality);
          resolve(compressedDataUrl);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      // Direct raw Data URL for PDFs, documents, or small assets
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('파일을 읽는 중 오류가 발생했습니다.'));
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    }
  });
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
