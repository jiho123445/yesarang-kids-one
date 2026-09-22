import React from 'react';
import { Phone, MapPin, Hammer } from 'lucide-react';
import { MascotSun } from '../components/common/Illustrations';
import { useData } from '../context/DataContext';

/**
 * 공사중(유지보수) 모드일 때 일반 방문자에게 대신 보여주는 화면.
 * App.tsx에서 maintenance.enabled === true && !isAdmin 인 경우에만 <Routes> 대신 렌더링됩니다.
 * 관리자는 헤더/푸터의 "관리자" 버튼으로 그대로 로그인해 정상 화면을 볼 수 있습니다.
 */
export const MaintenancePage: React.FC = () => {
  const { institution, maintenance } = useData();

  const defaultMessage =
    '더 좋은 모습으로 찾아뵙기 위해 홈페이지를 정비하고 있습니다.\n이용에 불편을 드려 죄송합니다. 빠른 시일 내에 정상적으로 운영하겠습니다.';

  const message = maintenance.message?.trim() ? maintenance.message : defaultMessage;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 sm:py-24">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-100 shadow-inner">
          <Hammer className="h-9 w-9 text-amber-700" />
        </div>

        <div className="flex justify-center mb-4">
          <MascotSun className="w-14 h-14 drop-shadow-md" />
        </div>

        <h1 className="text-xl sm:text-2xl font-black text-stone-900 mb-4">
          {institution?.name ?? '홈페이지'}를 새롭게 단장하고 있습니다
        </h1>

        <p className="text-sm sm:text-base leading-relaxed text-stone-600 whitespace-pre-line mb-8">
          {message}
        </p>

        {(institution?.phone || institution?.address) && (
          <div className="inline-flex flex-col gap-2 rounded-2xl border border-amber-100 bg-amber-50/60 px-6 py-4 text-sm text-stone-700">
            {institution?.phone && (
              <div className="flex items-center justify-center gap-2">
                <Phone className="h-4 w-4 text-amber-700" />
                <span>{institution.phone}</span>
              </div>
            )}
            {institution?.address && (
              <div className="flex items-center justify-center gap-2">
                <MapPin className="h-4 w-4 text-amber-700" />
                <span>{institution.address}</span>
              </div>
            )}
          </div>
        )}

        <p className="mt-8 text-xs font-bold text-stone-400">
          {institution?.name ?? ''}
        </p>
      </div>
    </div>
  );
};
