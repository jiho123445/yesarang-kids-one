/**
 * Firestore 초기 데이터 시딩 스크립트
 *
 * 사용 전 준비:
 *   1. Firebase 콘솔 > 프로젝트 설정 > 서비스 계정 > "새 비공개 키 생성"으로 JSON 키 파일을 받는다.
 *   2. 받은 파일을 저장소 루트에 serviceAccountKey.json 으로 저장한다. (.gitignore에 이미 포함되어 커밋되지 않음)
 *      경로를 바꾸고 싶다면 .env.local의 FIREBASE_SERVICE_ACCOUNT_PATH 값을 수정한다.
 *
 * 실행:
 *   npm run seed
 *
 * 주의: 이미 데이터가 있는 컬렉션에 다시 실행하면 중복으로 추가됩니다.
 *       완전히 새로 시작하고 싶다면 Firestore 콘솔에서 해당 컬렉션을 먼저 비우고 실행하세요.
 */

import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const dataDir = resolve(process.cwd(), 'src/data');
const readJson = (file: string) => JSON.parse(readFileSync(resolve(dataDir, file), 'utf-8'));

const notices = readJson('notices.json');
const newsletters = readJson('newsletters.json');
const meals = readJson('meals.json');
const nutritionNewsletters = readJson('nutritionNewsletters.json');
const gallery = readJson('gallery.json');
const events = readJson('events.json');
const institution = readJson('institution.json');
const introDetails = readJson('introDetails.json');

const serviceAccountPath = resolve(
  process.cwd(),
  process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './serviceAccountKey.json'
);

if (getApps().length === 0) {
  const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf-8'));
  initializeApp({ credential: cert(serviceAccount) });
}

const db = getFirestore();

async function seedCollection(name: string, items: Array<Record<string, unknown>>) {
  const base = Date.now();
  const batch = db.batch();
  items.forEach((item, index) => {
    const { id, ...rest } = item as { id?: string };
    const ref = db.collection(name).doc();
    batch.set(ref, { ...rest, _order: base - index });
  });
  await batch.commit();
  console.log(`✔ ${name}: ${items.length}건 시딩 완료`);
}

async function main() {
  await seedCollection('notices', notices as any[]);
  await seedCollection('newsletters', newsletters as any[]);
  await seedCollection('meals', meals as any[]);
  await seedCollection('nutritionNewsletters', nutritionNewsletters as any[]);
  await seedCollection('gallery', gallery as any[]);
  await seedCollection('events', events as any[]);

  await db.doc('settings/institution').set(institution as Record<string, unknown>);
  console.log('✔ settings/institution 시딩 완료');

  await db.doc('settings/intro').set(introDetails as Record<string, unknown>);
  console.log('✔ settings/intro 시딩 완료');

  console.log('\n모든 초기 데이터 시딩이 끝났습니다.');
  process.exit(0);
}

main().catch(err => {
  console.error('시딩 중 오류가 발생했습니다:', err);
  process.exit(1);
});
