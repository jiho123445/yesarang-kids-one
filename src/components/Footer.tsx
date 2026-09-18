import React, { useState } from 'react';
import { MapPin, Phone, Users, Shield, Award, Heart, Sparkles, ArrowUp, Lock, ShieldCheck } from 'lucide-react';
import { MascotSun } from './common/Illustrations';
import { useData } from '../context/DataContext';

type PolicyModal = 'privacy' | 'terms' | 'cctv' | 'email' | null;

export const Footer: React.FC = () => {
  const [activeModal, setActiveModal] = useState<PolicyModal>(null);
  const { institution, isAdmin, setIsPasswordModalOpen, setIsAdminDashboardOpen } = useData();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminClick = () => {
    if (isAdmin) {
      setIsAdminDashboardOpen(true);
    } else {
      setIsPasswordModalOpen(true);
    }
  };

  const modalTitles: Record<Exclude<PolicyModal, null>, string> = {
    privacy: '개인정보처리방침',
    terms: '웹사이트 이용약관',
    cctv: '영상정보처리기기 운영·관리 방침',
    email: '이메일 무단수집 거부',
  };

  return (
    <footer className="bg-stone-900 text-stone-300 pt-12 pb-10 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Top bar: Policies & Scroll to Top */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-stone-800 text-xs">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6 font-medium">
            <button
              onClick={() => setActiveModal('privacy')}
              className="text-amber-400 font-bold hover:underline cursor-pointer"
            >
              개인정보처리방침
            </button>
            <span className="text-stone-700">|</span>
            <button
              onClick={() => setActiveModal('terms')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              이용약관
            </button>
            <span className="text-stone-700">|</span>
            <button
              onClick={() => setActiveModal('cctv')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              영상정보처리기기 운영방침
            </button>
            <span className="text-stone-700">|</span>
            <button
              onClick={() => setActiveModal('email')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              이메일무단수집거부
            </button>
          </div>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors text-xs font-semibold cursor-pointer"
            aria-label="맨 위로 이동"
          >
            <span>맨 위로</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Middle: Institution Info & Visitor Counter Badges */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Institution Identity */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center space-x-3">
              <MascotSun className="w-10 h-10 shrink-0" />
              <div>
                <span className="text-xs text-[#F0935C] font-bold block">{institution.subSlogan || '아이들의 따뜻한 배움터'}</span>
                <span className="text-lg font-black text-white">{institution.name}</span>
              </div>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              {institution.slogan} - 아이의 고유한 개성과 속도를 존중하며 부모님의 마음으로 돌보는 행복한 안심 어린이집입니다.
            </p>
            <div className="flex items-center space-x-2 text-xs text-stone-400 pt-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded bg-stone-800 text-stone-300 font-medium">
                보육시설 인가
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded bg-stone-800 text-stone-300 font-medium">
                보건복지부 평가인증
              </span>
            </div>
          </div>

          {/* Contact and address details */}
          <div className="lg:col-span-5 space-y-2 text-xs text-stone-400">
            <div className="flex items-start">
              <MapPin className="w-4 h-4 text-amber-400 mr-2 shrink-0 mt-0.5" />
              <div>
                <span className="text-stone-300 font-semibold">주소: </span>
                {institution.address}
              </div>
            </div>
            <div className="flex items-center">
              <Phone className="w-4 h-4 text-amber-400 mr-2 shrink-0" />
              <div>
                <span className="text-stone-300 font-semibold">대표전화: </span>
                <a href={`tel:${institution.phone}`} className="hover:text-amber-300 font-bold text-white">
                  {institution.phone}
                </a>
                <span className="text-stone-600 mx-2">|</span>
                <span className="text-stone-300 font-semibold">팩스: </span>
                {institution.fax}
              </div>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 text-amber-400 mr-2 shrink-0" />
              <div>
                <span className="text-stone-300 font-semibold">원장: </span>
                <span className="text-white font-medium">{institution.director}</span>
                <span className="text-stone-600 mx-2">|</span>
                <span className="text-stone-300 font-semibold">인가정원: </span>
                {institution.capacity}
              </div>
            </div>
            <p className="text-[11px] text-stone-500 pt-1">
              운영시간: {institution.operatingHours}
            </p>
          </div>

          {/* Visitor Counter Badges */}
          <div className="lg:col-span-3 flex flex-col items-start lg:items-end justify-center space-y-2.5">
            <div className="text-xs font-bold text-stone-400">방문자 통계</div>
            <div className="flex items-center space-x-2">
              {/* Today Badge */}
              <div className="flex items-center px-3 py-1.5 rounded-xl bg-stone-800 border border-stone-700/80 shadow-xs">
                <span className="text-[11px] text-stone-400 font-medium mr-2">오늘 방문자</span>
                <span className="text-sm font-black text-amber-400">128</span>
                <span className="text-[10px] text-stone-500 ml-0.5">명</span>
              </div>

              {/* Total Badge */}
              <div className="flex items-center px-3 py-1.5 rounded-xl bg-stone-800 border border-stone-700/80 shadow-xs">
                <span className="text-[11px] text-stone-400 font-medium mr-2">누적 방문자</span>
                <span className="text-sm font-black text-[#F0935C]">48,290</span>
                <span className="text-[10px] text-stone-500 ml-0.5">명</span>
              </div>
            </div>
            <span className="text-[10px] text-stone-500">카운터 기준: 매일 00:00 갱신</span>
          </div>
        </div>

        {/* Bottom Copyright & Admin Entrance */}
        <div className="pt-6 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <p>© 2026 {institution.name}. All Rights Reserved.</p>
            <span className="text-stone-700 hidden sm:inline">|</span>
            {/* Discreet Admin Login Link */}
            <button
              onClick={handleAdminClick}
              className="inline-flex items-center space-x-1 text-stone-500 hover:text-amber-400 transition-colors cursor-pointer py-0.5 px-1 rounded-sm hover:underline"
            >
              {isAdmin ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-amber-400 font-bold">관리자 CMS 센터</span>
                </>
              ) : (
                <>
                  <Lock className="w-3 h-3 text-stone-600" />
                  <span>원장/교직원 관리자 로그인</span>
                </>
              )}
            </button>
          </div>
          <p className="text-[11px] text-stone-600">
            본 웹사이트는 어린이집 정보 제공 목적으로 제작되었습니다.
          </p>
        </div>
      </div>

      {/* Policy Modals */}
      {activeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs text-stone-800"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-3xl p-6 shadow-2xl max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-stone-200 sticky -top-6 bg-white pt-1">
              <h3 className="text-lg font-bold text-stone-900">{modalTitles[activeModal]}</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-stone-400 hover:text-stone-700 text-sm font-bold"
              >
                닫기 ✕
              </button>
            </div>

            {activeModal === 'privacy' && (
              <div className="text-xs text-stone-600 space-y-3 leading-relaxed">
                <p>
                  {institution.name}({institution.address}, 이하 '어린이집')은 「개인정보 보호법」 제30조 및
                  「영유아보육법」 등 관계 법령에 따라 원아 및 보호자님의 개인정보를 보호하고 이와 관련한
                  고충을 신속하고 원활하게 처리할 수 있도록 다음과 같이 개인정보 처리방침을 수립·공개합니다.
                </p>

                <h4 className="font-bold text-stone-800">제1조 (개인정보의 처리 목적)</h4>
                <p>어린이집은 다음의 목적을 위하여 개인정보를 처리하며, 목적이 변경되는 경우에는 「개인정보 보호법」 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행합니다.</p>
                <p>
                  1. 입소상담 및 입소 신청·등록 처리<br />
                  2. 보육료·필요경비 등 수납 및 정산 업무<br />
                  3. 원아 건강·안전관리, 응급상황 시 보호자 및 의료기관 연락<br />
                  4. 알림장, 가정통신문, 공지사항 등 보육 관련 정보 전달<br />
                  5. 민원 처리 및 어린이집 운영 관련 통계·분석<br />
                  6. 「영유아보육법」에 따른 영상정보처리기기(CCTV) 운영
                </p>

                <h4 className="font-bold text-stone-800">제2조 (처리하는 개인정보의 항목)</h4>
                <p>
                  1. 원아: 성명, 생년월일, 성별, 주소, 건강정보(알레르기·질병 등), 사진 및 영상정보<br />
                  2. 보호자: 성명, 연락처, 주소, 원아와의 관계<br />
                  3. 홈페이지 이용 과정에서 자동 생성되어 수집될 수 있는 정보: 접속 IP, 쿠키, 접속 로그
                </p>

                <h4 className="font-bold text-stone-800">제3조 (개인정보의 처리 및 보유 기간)</h4>
                <p>
                  어린이집은 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에
                  동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다. 원칙적으로 보육 종료(퇴소) 후
                  「영유아보육법 시행규칙」 등 관계 법령이 정한 보존기간(생활기록부 등 최대 5년) 동안 보관 후
                  지체 없이 파기하며, CCTV 영상정보는 촬영일로부터 60일 이상 보관 후 자동 삭제됩니다.
                </p>

                <h4 className="font-bold text-stone-800">제4조 (개인정보의 제3자 제공)</h4>
                <p>
                  어린이집은 정보주체의 개인정보를 원칙적으로 제1조에서 명시한 목적 범위 내에서 처리하며,
                  정보주체의 동의, 법률의 특별한 규정 등 「개인정보 보호법」 제17조 및 제18조에 해당하는
                  경우를 제외하고는 개인정보를 제3자에게 제공하지 않습니다. 다만 관계 법령에 따라 관할
                  지방자치단체, 보건소, 아동보호전문기관, 수사기관 등이 적법한 절차로 요청하는 경우
                  예외적으로 제공될 수 있습니다.
                </p>

                <h4 className="font-bold text-stone-800">제5조 (개인정보처리의 위탁)</h4>
                <p>
                  어린이집은 원활한 홈페이지 운영 및 안내 문자 발송 등을 위해 필요한 경우 개인정보 처리
                  업무를 외부 전문업체(문자 발송 대행사, 웹사이트 호스팅사 등)에 위탁할 수 있으며, 위탁계약
                  체결 시 개인정보가 안전하게 관리될 수 있도록 관계 법령에 따라 필요한 사항을 규정합니다.
                </p>

                <h4 className="font-bold text-stone-800">제6조 (정보주체의 권리·의무 및 행사방법)</h4>
                <p>
                  정보주체(만 14세 미만 원아의 경우 법정대리인)는 어린이집에 대해 언제든지 개인정보
                  열람·정정·삭제·처리정지 요구 등의 권리를 행사할 수 있으며, 이는 서면, 전화, 전자우편,
                  팩스 등을 통해 지체 없이 조치합니다.
                </p>

                <h4 className="font-bold text-stone-800">제7조 (개인정보의 파기절차 및 방법)</h4>
                <p>
                  전자적 파일 형태의 개인정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제하고,
                  종이 문서에 기록·저장된 개인정보는 분쇄기로 분쇄하거나 소각하여 파기합니다.
                </p>

                <h4 className="font-bold text-stone-800">제8조 (개인정보의 안전성 확보조치)</h4>
                <p>
                  어린이집은 개인정보의 안전성 확보를 위해 개인정보 취급 담당자 최소화 및 교육, 접근권한
                  관리, 접속기록 보관, 문서보안을 위한 잠금장치 사용 등 관리적·기술적·물리적 조치를
                  시행하고 있습니다.
                </p>

                <h4 className="font-bold text-stone-800">제9조 (개인정보 보호책임자 및 담당부서)</h4>
                <p>
                  개인정보 보호책임자: {institution.director} 원장<br />
                  연락처: {institution.phone}<br />
                  정보주체께서는 어린이집의 서비스를 이용하며 발생한 모든 개인정보 보호 관련 문의, 불만처리,
                  피해구제 등에 관한 사항을 개인정보 보호책임자 및 담당부서로 문의하실 수 있습니다.
                </p>

                <h4 className="font-bold text-stone-800">제10조 (권익침해 구제방법)</h4>
                <p>
                  정보주체는 개인정보침해로 인한 구제를 받기 위하여 개인정보분쟁조정위원회, 한국인터넷진흥원
                  개인정보침해신고센터 등에 분쟁해결이나 상담 등을 신청할 수 있습니다.
                  <br />· 개인정보분쟁조정위원회: (국번없이) 1833-6972 (www.kopico.go.kr)
                  <br />· 개인정보침해신고센터: (국번없이) 118 (privacy.kisa.or.kr)
                  <br />· 대검찰청 사이버범죄수사단: (국번없이) 1301 (www.spo.go.kr)
                  <br />· 경찰청 사이버수사국: (국번없이) 182 (ecrm.cyber.go.kr)
                </p>

                <h4 className="font-bold text-stone-800">제11조 (개인정보 처리방침의 변경)</h4>
                <p>
                  이 개인정보 처리방침은 법령·정책 또는 보안기술의 변경에 따라 내용의 추가·삭제 및 수정이
                  있을 시에는 개정 최소 7일 전부터 홈페이지 공지사항을 통하여 고지할 것입니다.
                  <br />공고일자: 2026년 1월 1일 / 시행일자: 2026년 1월 8일
                </p>
              </div>
            )}

            {activeModal === 'terms' && (
              <div className="text-xs text-stone-600 space-y-3 leading-relaxed">
                <h4 className="font-bold text-stone-800">제1조 (목적)</h4>
                <p>
                  이 약관은 {institution.name}(이하 '어린이집')이 운영하는 홈페이지(이하 '사이트')에서
                  제공하는 정보 열람, 상담 신청 등 제반 서비스(이하 '서비스')의 이용과 관련하여 어린이집과
                  이용자의 권리·의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
                </p>

                <h4 className="font-bold text-stone-800">제2조 (용어의 정의)</h4>
                <p>
                  1. '이용자'란 사이트에 접속하여 이 약관에 따라 어린이집이 제공하는 서비스를 이용하는
                  보호자 및 방문자를 말합니다.<br />
                  2. '게시물'이란 이용자가 서비스를 이용함에 있어 사이트에 게시한 문자, 문서, 이미지 등의
                  정보를 말합니다.
                </p>

                <h4 className="font-bold text-stone-800">제3조 (약관의 효력 및 변경)</h4>
                <p>
                  1. 이 약관은 사이트 초기 화면 또는 연결화면에 게시함으로써 효력이 발생합니다.<br />
                  2. 어린이집은 관계 법령을 위배하지 않는 범위에서 이 약관을 개정할 수 있으며, 개정 시
                  적용일자 및 개정사유를 명시하여 사이트를 통해 사전 공지합니다.
                </p>

                <h4 className="font-bold text-stone-800">제4조 (서비스의 내용)</h4>
                <p>
                  어린이집은 어린이집 소개, 교육 프로그램 안내, 공지사항, 가정통신문, 식단표, 갤러리, 행사
                  일정 안내 및 입소 상담 신청 등의 정보 제공 서비스를 제공합니다. 어린이집은 운영상·기술상
                  필요에 따라 제공하는 서비스의 내용을 변경할 수 있습니다.
                </p>

                <h4 className="font-bold text-stone-800">제5조 (이용자의 의무)</h4>
                <p>
                  이용자는 다음 각 호에 해당하는 행위를 하여서는 안 됩니다.<br />
                  1. 타인의 정보를 도용하거나 허위 정보를 등록하는 행위<br />
                  2. 사이트의 운영을 고의로 방해하는 행위<br />
                  3. 사이트에 게시된 정보를 무단으로 변경, 복제, 배포, 상업적으로 이용하는 행위<br />
                  4. 기타 관계 법령에 위배되는 행위
                </p>

                <h4 className="font-bold text-stone-800">제6조 (저작권의 귀속 및 이용제한)</h4>
                <p>
                  사이트가 작성한 저작물에 대한 저작권 및 기타 지적재산권은 어린이집에 귀속됩니다. 이용자는
                  사이트를 이용함으로써 얻은 정보 중 어린이집에게 지적재산권이 귀속된 정보를 어린이집의
                  사전 승낙 없이 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로 이용하거나
                  제3자에게 이용하게 하여서는 안 됩니다.
                </p>

                <h4 className="font-bold text-stone-800">제7조 (면책조항)</h4>
                <p>
                  1. 어린이집은 천재지변, 서버 및 네트워크 장애 등 불가항력으로 인하여 서비스를 제공할 수
                  없는 경우 서비스 제공에 관한 책임이 면제됩니다.<br />
                  2. 사이트에 게시된 정보(공지사항, 식단, 일정 등)는 실제 운영 상황에 따라 사전 고지 없이
                  변경될 수 있으며, 어린이집은 정확한 정보 제공을 위해 노력하되 게시 정보와 실제 운영이
                  일치함을 보증하지 않습니다. 정확한 사항은 유선(전화)으로 다시 확인해 주시기 바랍니다.
                </p>

                <h4 className="font-bold text-stone-800">제8조 (관할법원)</h4>
                <p>
                  이 약관과 관련하여 어린이집과 이용자 간에 발생한 분쟁에 대하여는 「민사소송법」상의 관할
                  법원에 소를 제기합니다.
                  <br />공고일자: 2026년 1월 1일 / 시행일자: 2026년 1월 8일
                </p>
              </div>
            )}

            {activeModal === 'cctv' && (
              <div className="text-xs text-stone-600 space-y-3 leading-relaxed">
                <p>
                  {institution.name}은(는) 「개인정보 보호법」 제25조 및 「영유아보육법」 제15조의4·5에
                  근거하여 원아의 안전한 보육환경 조성 및 시설 안전관리를 위하여 다음과 같이 영상정보처리기기를
                  설치·운영하고 있습니다.
                </p>

                <h4 className="font-bold text-stone-800">1. 영상정보처리기기의 설치 근거 및 목적</h4>
                <p>
                  「영유아보육법」 제15조의4에 따라 아동학대 방지 등 영유아의 안전과 어린이집 시설의 보안을
                  위하여 설치·운영합니다.
                </p>

                <h4 className="font-bold text-stone-800">2. 설치 대수, 설치 위치 및 촬영 범위</h4>
                <p>
                  보육실, 놀이실(유희실), 공용 복도, 출입구 등 원아 보육이 이루어지는 공간에 설치되어 있으며,
                  화장실·수유실 등 사생활 침해 우려가 높은 공간은 촬영 범위에서 제외됩니다. 정확한 설치
                  대수와 위치는 어린이집 내 안내판 및 원장에게 문의하시면 확인하실 수 있습니다.
                </p>

                <h4 className="font-bold text-stone-800">3. 관리책임자 및 담당부서</h4>
                <p>
                  관리책임자: {institution.director} 원장 (연락처: {institution.phone})<br />
                  영상정보처리기기의 설치·운영에 관한 사무는 위 관리책임자가 총괄하며, 접근권한자는
                  최소한으로 제한하여 지정·운영합니다.
                </p>

                <h4 className="font-bold text-stone-800">4. 촬영시간, 보관기간 및 처리방법</h4>
                <p>
                  1. 촬영시간: 24시간 연속 촬영<br />
                  2. 보관기간: 촬영일로부터 60일 이상 (보관기간 경과 시 자동 삭제)<br />
                  3. 보관장소 및 처리방법: 어린이집 내 잠금장치가 있는 별도 공간에 보관하며, 보관기간이
                  끝난 영상정보는 복구·재생이 불가능한 방법으로 영구 삭제합니다.
                </p>

                <h4 className="font-bold text-stone-800">5. 영상정보의 열람 등 요구 및 조치</h4>
                <p>
                  정보주체는 「영유아보육법 시행규칙」이 정한 절차에 따라 자녀 영상의 열람을 요청할 수
                  있으며, 원장은 아동학대 은폐·증거인멸 우려가 없는 한 정당한 사유 없이 이를 거부할 수
                  없습니다. 열람은 보호자 본인 확인 절차를 거쳐 어린이집 내에서 지정된 절차와 방법에 따라
                  이루어지며, 목적 외 이용이나 외부 유출은 엄격히 금지됩니다. 경찰 등 수사기관, 아동보호전문기관은
                  관계 법령에 따른 적법한 절차로 열람을 요청할 수 있습니다.
                </p>

                <h4 className="font-bold text-stone-800">6. 영상정보 보호를 위한 기술적·관리적·물리적 조치</h4>
                <p>
                  영상정보에 대한 접근을 통제하기 위하여 접근권한을 관리책임자 및 최소한의 담당자로 제한하고
                  비밀번호를 설정·관리하며, 영상정보를 저장하는 장치가 위치한 공간은 잠금장치를 설치하여
                  물리적으로 보호하고 있습니다.
                </p>

                <h4 className="font-bold text-stone-800">7. 설치·운영 사실의 공개</h4>
                <p>
                  본 어린이집은 「개인정보 보호법」 제25조 제4항에 따라 영상정보처리기기 운영에 관한 안내판을
                  촬영 범위 내 눈에 띄기 쉬운 곳에 설치하여 촬영 사실을 알리고 있습니다.
                  <br />공고일자: 2026년 1월 1일 / 시행일자: 2026년 1월 8일
                </p>
              </div>
            )}

            {activeModal === 'email' && (
              <div className="text-xs text-stone-600 space-y-3 leading-relaxed">
                <h4 className="font-bold text-stone-800">이메일 무단수집 거부</h4>
                <p>
                  본 웹사이트에 게시된 이메일 주소가 전자우편 수집 프로그램이나 그 밖의 기술적 장치를
                  이용하여 무단으로 수집되는 것을 거부하며, 이를 위반 시 「정보통신망 이용촉진 및
                  정보보호 등에 관한 법률」에 의해 형사처벌됨을 유념하시기 바랍니다.
                </p>
                <p className="text-stone-500">
                  「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 제50조의2(전자우편주소의 무단 수집행위 등 금지)
                  <br />① 누구든지 전자우편주소의 수집을 거부하는 의사가 명시된 인터넷 홈페이지에서 자동으로
                  전자우편주소를 수집하는 프로그램이나 그 밖의 기술적 장치를 이용하여 전자우편주소를 수집하여서는
                  아니 된다.<br />
                  ② 누구든지 제1항을 위반하여 수집된 전자우편주소를 판매·유통하여서는 아니 된다.<br />
                  ③ 누구든지 제1항 및 제2항에 따라 수집·판매 및 유통이 금지된 전자우편주소임을 알고 이를
                  정보 전송에 이용하여서는 아니 된다.
                </p>
                <p>
                  문의사항이 있으시면 전화({institution.phone})로 연락해 주시기 바랍니다.
                  <br />공고일자: 2026년 1월 1일
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </footer>
  );
};
