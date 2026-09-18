import { initializeApp, type FirebaseOptions } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

// 값은 전부 Vite 환경변수(.env.local / Vercel Environment Variables)에서 주입됩니다.
// 저장소에 실제 키를 평문으로 커밋하지 마세요.
const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  // 개발 중 .env.local 설정 누락을 바로 알아챌 수 있도록 콘솔에 경고만 남기고 앱은 계속 로드합니다.
  console.warn(
    '[firebase] 환경변수가 설정되지 않았습니다. .env.local 파일에 VITE_FIREBASE_* 값을 채워주세요.'
  );
}

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

// 관리자 로그인 UI가 비밀번호만 입력받는 기존 UX를 유지하기 위해,
// Firebase Auth 이메일/비밀번호 로그인 시 사용할 고정 관리자 이메일입니다.
export const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL as string | undefined;
