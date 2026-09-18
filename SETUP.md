# Firebase 연동 설정 가이드 (yesarang-kids-one)

코드 쪽 작업(Firestore/Storage/Auth 연동, 보안 규칙, 시딩 스크립트)은 모두 끝났습니다.
아래는 Firebase 콘솔에 로그인해서 **직접 해야 하는** 작업입니다.

## 1. Firebase 프로젝트 생성

1. https://console.firebase.google.com 접속 → "프로젝트 추가"
2. 프로젝트 이름: `yesarang-kids-one` (또는 원하는 이름 — 단, `.firebaserc`의 `default` 값도 동일하게 맞춰주세요)
3. Google Analytics는 선택 사항 (꺼도 무방)

## 2. Firestore, Storage, Authentication 활성화

Firebase 콘솔 좌측 메뉴에서:
- **Firestore Database** → "데이터베이스 만들기" → 위치는 `asia-northeast3(서울)` 권장 → 프로덕션 모드로 시작 (규칙은 이후 CLI로 배포)
- **Storage** → "시작하기" → 위치는 Firestore와 동일하게
- **Authentication** → "시작하기" → 로그인 방법에서 **이메일/비밀번호** 활성화

## 3. 웹 앱 등록 및 설정값 확인

1. 프로젝트 설정(⚙️) → "내 앱" → 웹 아이콘(`</>`) 클릭 → 앱 닉네임 아무거나 입력 → 앱 등록
2. 표시되는 `firebaseConfig` 값을 그대로 복사해서 프로젝트 루트에 `.env.local` 파일을 만들고 채워 넣으세요 (`.env.example` 참고):

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_ADMIN_EMAIL=admin@yesarang-kids-one.local   # 아래 4번에서 만들 계정과 동일하게
```

## 4. 관리자 계정 생성

Authentication → Users 탭 → "사용자 추가" → 3번의 `VITE_ADMIN_EMAIL`과 동일한 이메일 + 임시 비밀번호로 생성
(로그인 후 사이트 관리자 대시보드 > 설정 탭에서 비밀번호를 바로 바꿀 수 있습니다)

## 5. 서비스 계정 키 발급 (시딩용, 최초 1회만 필요)

1. 프로젝트 설정 → 서비스 계정 탭 → "새 비공개 키 생성" → JSON 다운로드
2. 다운로드한 파일을 프로젝트 루트에 `serviceAccountKey.json` 이름으로 저장 (`.gitignore`에 이미 포함되어 있어 커밋되지 않습니다)

## 6. 로컬에서 설치 및 초기 데이터 시딩

```bash
npm install
npm run seed      # src/data/*.json 목업 데이터를 Firestore에 최초 업로드
npm run dev        # 로컬 확인
```

## 7. 보안 규칙 배포

Firebase CLI가 없다면: `npm install -g firebase-tools`

```bash
firebase login
firebase deploy --only firestore:rules,storage
```

(`.firebaserc`의 프로젝트 ID가 실제 만든 프로젝트와 다르면 먼저 `firebase use <실제-프로젝트-ID>` 로 맞춰주세요)

## 8. Vercel 배포 시

Vercel 프로젝트 설정 → Environment Variables에 `.env.local`과 동일한 `VITE_FIREBASE_*`, `VITE_ADMIN_EMAIL` 값을 등록하세요.
(`FIREBASE_SERVICE_ACCOUNT_PATH`, `serviceAccountKey.json`은 시딩 스크립트 전용이라 Vercel에는 올릴 필요 없습니다.)

---

여기까지 마치면 관리자 대시보드에서 등록하는 공지/가정통신문/식단/갤러리/행사 데이터와 사진이
전부 Firestore + Storage에 실시간으로 저장되고, 다른 기기에서 접속해도 동일하게 보입니다.
