import { useEffect } from 'react';

const SITE_NAME = '홍천 예사랑어린이집';
const DEFAULT_DESCRIPTION =
  '강원특별자치도 홍천군 소재 예사랑어린이집 공식 누리집. 원아 모집·입소 상담, 공지사항, 가정통신문, 식단표, 행사 일정, 어린이집 소개를 확인하세요.';

/**
 * 페이지(라우트)가 바뀔 때 브라우저 탭 제목과 <meta name="description">을 갱신합니다.
 * index.html의 기본 태그는 SPA 특성상 모든 경로에서 동일하게 내려가므로,
 * 클라이언트에서 라우트별로 다시 채워 검색엔진 JS 렌더링(Google 등) 및
 * 브라우저 탭/북마크 표시를 더 정확하게 만들어줍니다.
 */
export function useDocumentTitle(pageTitle: string, description?: string) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = pageTitle ? `${pageTitle} | ${SITE_NAME}` : SITE_NAME;

    const metaDescription = document.querySelector('meta[name="description"]');
    const prevDescription = metaDescription?.getAttribute('content') ?? undefined;
    if (metaDescription) {
      metaDescription.setAttribute('content', description || DEFAULT_DESCRIPTION);
    }

    return () => {
      document.title = prevTitle;
      if (metaDescription && prevDescription !== undefined) {
        metaDescription.setAttribute('content', prevDescription);
      }
    };
  }, [pageTitle, description]);
}
