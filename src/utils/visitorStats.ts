import { doc, runTransaction } from 'firebase/firestore';
import { db } from '../lib/firebase';

const INSTITUTION_REF = doc(db, 'settings', 'institution');
const LAST_VISIT_KEY = 'yesarang_last_visit_date';

/** Asia/Seoul 기준 오늘 날짜(YYYY-MM-DD)를 반환 */
function getTodayKST(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul' }).format(new Date());
}

/**
 * 이 브라우저에서 오늘 처음 방문한 것이라면 Firestore의 방문자 통계를
 * 트랜잭션으로 안전하게 1 증가시킵니다. 같은 브라우저에서 하루에
 * 여러 번 새로고침해도 중복 집계되지 않습니다(localStorage 플래그 사용).
 * 새로고침이 아니라 완전히 새 하루가 되면 '오늘 방문자'는 1로 리셋되고
 * '누적 방문자'는 계속 누적됩니다.
 */
export async function recordVisitIfNeeded(): Promise<void> {
  const today = getTodayKST();

  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      if (window.localStorage.getItem(LAST_VISIT_KEY) === today) {
        return; // 오늘 이미 집계됨
      }
    }
  } catch {
    // localStorage 접근 불가(프라이빗 모드 등) — 집계는 계속 시도
  }

  try {
    await runTransaction(db, async transaction => {
      const snap = await transaction.get(INSTITUTION_REF);
      const data = snap.exists() ? snap.data() : {};
      const prevDate = data.visitorStatsDate as string | undefined;
      const prevStats = (data.visitorStats as { today?: number; total?: number } | undefined) || {};

      const nextTotal = (prevStats.total || 0) + 1;
      const nextToday = prevDate === today ? (prevStats.today || 0) + 1 : 1;

      transaction.set(
        INSTITUTION_REF,
        { visitorStats: { today: nextToday, total: nextTotal }, visitorStatsDate: today },
        { merge: true }
      );
    });

    try {
      window.localStorage.setItem(LAST_VISIT_KEY, today);
    } catch {
      // 무시
    }
  } catch (err) {
    console.error('[visitorStats] 방문자 집계 중 오류', err);
  }
}
