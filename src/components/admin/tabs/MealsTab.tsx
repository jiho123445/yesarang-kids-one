import React, { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Edit3,
  Utensils,
  Calendar,
  Image as ImageIcon,
  Flame,
  BookOpen,
  FileText,
  Download,
  Sparkles,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { MealItem, NutritionNewsletter, NutritionNewsletterSection } from '../../../types';
import { FileUpload } from '../../common/FileUpload';
import { ConfirmDialog } from '../ConfirmDialog';

const DAY_MAP: Record<number, string> = {
  0: '일',
  1: '월',
  2: '화',
  3: '수',
  4: '목',
  5: '금',
  6: '토',
};

const NUTRITION_TEMPLATES = [
  {
    name: '🌱 봄철 면역력 & 로컬푸드',
    period: '2026년 3월호',
    title: '성장기 우리 아이를 위한 봄철 영양 가이드',
    supervisor: '홍천군 어린이급식관리지원센터 자문',
    summary:
      '신학기 새로운 환경에 적응하는 영유아의 면역력을 키우고, 건강한 식습관을 형성하기 위한 3월 안심 영양 관리 안내입니다.',
    sections: [
      {
        title: '1. 저염·저당 건강 조리 원칙',
        content:
          '예사랑어린이집은 영유아의 미각 발달과 신장 건강을 위하여 국 염도 0.5% 이하, 천연 다시마와 멸치 육수만을 사용합니다. 인공 조미료를 배제하고 자연 그대로의 감칠맛을 살립니다.',
        color: 'emerald' as const,
      },
      {
        title: '2. 강원 홍천 로컬푸드 제철 식자재',
        content:
          '강원 홍천 지역에서 재배된 친환경 쌀, 신선한 제철 봄나물(냉이, 달래, 쑥)과 국내산 무항생제 축산물을 매일 아침 직송받아 당일 소진을 원칙으로 조리합니다.',
        color: 'amber' as const,
      },
      {
        title: '3. 영유아 식품 알레르기 안심 수칙',
        content:
          '난류, 우유, 대두, 땅콩, 갑각류 등 특정 식품에 알레르기 반응이 있는 경우 즉시 원으로 공유해 주시면, 안심 대체 식단(대체유, 알레르기 전용 반찬)을 철저히 분리 배식합니다.',
        color: 'rose' as const,
      },
    ],
    tips: [
      '가정에서도 식사 전 손 씻기 6단계를 온 가족이 함께 실천해 주세요.',
      '봄철 춘곤증 예방을 위해 비타민 C와 비타민 B1이 풍부한 봄나물과 딸기를 곁들여요.',
      '식사 2시간 전에는 단 음료나 빵 등 간식을 제한하여 식사 집중도를 높여주세요.',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&auto=format&fit=crop&q=80',
    attachmentName: '2026년_3월_영양소식지_홍천군어린이급식지원센터.pdf',
  },
  {
    name: '🍎 환절기 오색 컬러푸드 가이드',
    period: '2026년 4월호',
    title: '면역력을 쑥쑥 높이는 알록달록 오색 컬러푸드',
    supervisor: '홍천군 어린이급식관리지원센터 자문',
    summary:
      '환절기 감기 예방과 호흡기 건강을 위한 파이토케미컬 영양소 섭취법과 오색 컬러푸드 식단 안내입니다.',
    sections: [
      {
        title: '1. 빨강·주황 컬러푸드와 항산화',
        content:
          '토마토, 당근, 파프리카에 풍부한 라이코펜과 베타카로틴은 아이들의 체내 면역 세포를 활성화하고 점막을 튼튼하게 지켜줍니다.',
        color: 'rose' as const,
      },
      {
        title: '2. 초록 채소와 장 건강 섬유질',
        content:
          '브로콜리, 시금치, 시래기 등에 가득한 엽록소와 식이섬유는 영유아의 소화 흡수를 돕고 배변 활동을 원활하게 촉진합니다.',
        color: 'emerald' as const,
      },
      {
        title: '3. 노랑·흰색 식재료와 기초 체력',
        content:
          '단호박, 버섯, 양파, 콩류는 체온 유지와 칼슘 흡수를 촉진하여 봄철 기초 체력을 든든하게 유지해 줍니다.',
        color: 'amber' as const,
      },
    ],
    tips: [
      '식판에 3가지 이상 서로 다른 색깔의 반찬을 담아보는 시각적 호기심 놀이를 해보세요.',
      '채소를 낯설어할 때는 갈거나 잘게 다져 달걀찜, 전, 볶음밥 형태로 접근해주세요.',
      '따뜻한 보리차나 미온수를 하루 4~5회 이상 자주 마시도록 도와주세요.',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
    attachmentName: '2026년_4월_영양소식지_컬러푸드편.pdf',
  },
  {
    name: '🥣 즐거운 식사 & 편식 지도법',
    period: '2026년 5월호',
    title: '편식 예방을 위한 우리 아이 즐거운 식사 시간 만들기',
    supervisor: '홍천군 어린이급식관리지원센터 자문',
    summary:
      '억지로 강요하지 않고 즐거운 오감 놀이와 긍정적 대화를 통해 스스로 골고루 먹는 올바른 식사 예절 가이드입니다.',
    sections: [
      {
        title: "1. 강요 대신 '딱 한 입 맛보기' 규칙",
        content:
          "새로운 식재료에 대한 거부감을 줄이기 위해 억지로 다 먹이기보다 '냄새 맡기 → 혀끝 대보기 → 작은 한 조각 맛보기' 3단계로 조심스럽게 유도합니다.",
        color: 'blue' as const,
      },
      {
        title: '2. 오감각 식재료 탐색 놀이',
        content:
          '방울토마토, 버섯, 파프리카를 손으로 만져보고 향을 맡으며 친숙한 식재료 친구로 느끼도록 놀이형 접근을 시도합니다.',
        color: 'amber' as const,
      },
      {
        title: '3. 부모님의 솔선수범과 구체적인 칭찬',
        content:
          '부모님이 맛있게 먹는 모습을 보여주고, 아이가 채소 한 조각이라도 시도했을 때 아낌없이 칭찬하여 성취감을 심어줍니다.',
        color: 'emerald' as const,
      },
    ],
    tips: [
      '스마트폰이나 TV를 끄고 온 가족이 마주 앉아 식사 자체의 온기에 집중하는 환경이 중요합니다.',
      '식사 시간은 30분 내외로 정하여 아이가 지치지 않도록 조절해 주세요.',
      '아이가 직접 방울토마토 꼭지를 따거나 채소를 씻는 조리 보조 놀이를 함께해 보세요.',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&auto=format&fit=crop&q=80',
    attachmentName: '2026년_5월_영양소식지_편식지도법.pdf',
  },
  {
    name: '💧 여름철 급식 위생 & 식중독 예방',
    period: '2026년 6월호',
    title: '무더위 속 식중독 예방과 올바른 수분 섭취 가이드',
    supervisor: '홍천군 어린이급식관리지원센터 자문',
    summary:
      '기온과 습도가 올라가는 여름철, 영유아의 배탈 및 식중독을 철저히 예방하고 안전한 급식 위생을 지키기 위한 안내입니다.',
    sections: [
      {
        title: '1. 급식실 중심온도 75℃ 이상 가열 조리',
        content:
          '모든 육류와 어패류는 중심온도 75℃ 이상에서 1분 이상 완전히 가열 조리하며, 매끼 온도 측정 일지를 엄격히 기록합니다.',
        color: 'rose' as const,
      },
      {
        title: '2. 식자재별 도마·칼 색상 구분 사용',
        content:
          '채소용(녹색), 육류용(적색), 어류용(청색) 조리기구를 분리 사용하며, 자외선 살균 소독고를 통해 완벽한 위생을 유지합니다.',
        color: 'blue' as const,
      },
      {
        title: '3. 미온수 섭취와 탈수 예방',
        content:
          '너무 찬 음료나 빙과류 섭취를 지양하고, 끓인 보리차나 미온수를 하루 4~5회 이상 자주 마시도록 지도합니다.',
        color: 'emerald' as const,
      },
    ],
    tips: [
      '외출 후, 화장실 사용 후 비누로 30초 이상 흐르는 물에 손을 씻도록 지도해주세요.',
      '가정에서도 여름철 남은 음식은 2시간 이내 냉장 보관하고 재가열하여 섭취하세요.',
      '원아 개인 물병은 매일 저녁 베이킹소다나 열탕으로 깨끗이 세척 후 건조해 주세요.',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80',
    attachmentName: '2026년_6월_영양소식지_식중독예방수칙.pdf',
  },
];

export const MealsTab: React.FC = () => {
  const {
    meals,
    addMeal,
    updateMeal,
    deleteMeal,
    nutritionNewsletters,
    addNutritionNewsletter,
    updateNutritionNewsletter,
    deleteNutritionNewsletter,
    adminEditingItem,
    setAdminEditingItem,
  } = useData();

  // Sub-tab selection: daily meals vs nutrition newsletter
  const [subTab, setSubTab] = useState<'daily' | 'nutrition'>('daily');

  // Daily Meal Form State
  const [isMealModalOpen, setIsMealModalOpen] = useState(false);
  const [mealDeleteTargetId, setMealDeleteTargetId] = useState<string | null>(null);
  const [mealFormId, setMealFormId] = useState<string | null>(null);
  const [mealDate, setMealDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [mealDayOfWeek, setMealDayOfWeek] = useState('월');
  const [mealMorningSnack, setMealMorningSnack] = useState('');
  const [mealLunchInput, setMealLunchInput] = useState('');
  const [mealAfternoonSnack, setMealAfternoonSnack] = useState('');
  const [mealCalories, setMealCalories] = useState(520);
  const [mealOriginInfo, setMealOriginInfo] = useState(
    '쌀, 잡곡, 쇠고기, 돼지고기, 닭고기, 배추김치(국내산)'
  );
  const [mealAllergyInfo, setMealAllergyInfo] = useState('난류, 우유, 대두, 밀 함유');
  const [mealTodayHighlight, setMealTodayHighlight] = useState('');
  const [mealImageUrl, setMealImageUrl] = useState('');
  const [mealImageName, setMealImageName] = useState('');

  // Nutrition Newsletter Form State
  const [isNutritionModalOpen, setIsNutritionModalOpen] = useState(false);
  const [nutritionDeleteTargetId, setNutritionDeleteTargetId] = useState<string | null>(null);
  const [nutritionFormId, setNutritionFormId] = useState<string | null>(null);
  const [nutritionPeriod, setNutritionPeriod] = useState('2026년 3월호');
  const [nutritionDate, setNutritionDate] = useState('2026.03.01');
  const [nutritionTitle, setNutritionTitle] = useState('');
  const [nutritionSupervisor, setNutritionSupervisor] = useState(
    '홍천군 어린이급식관리지원센터 자문'
  );
  const [nutritionSummary, setNutritionSummary] = useState('');
  const [nutritionSections, setNutritionSections] = useState<NutritionNewsletterSection[]>([
    { title: '1. 저염·저당 건강 조리 원칙', content: '', color: 'emerald' },
    { title: '2. 강원 홍천 로컬푸드 제철 식자재', content: '', color: 'amber' },
  ]);
  const [nutritionTipsInput, setNutritionTipsInput] = useState('');
  const [nutritionImageUrl, setNutritionImageUrl] = useState('');
  const [nutritionImageName, setNutritionImageName] = useState('');
  const [nutritionAttachmentName, setNutritionAttachmentName] = useState('');

  // Handle passed editing item from external components
  useEffect(() => {
    if (adminEditingItem) {
      if (
        adminEditingItem._type === 'nutritionNewsletter' ||
        adminEditingItem._type === 'nutrition' ||
        adminEditingItem._subTab === 'nutrition'
      ) {
        setSubTab('nutrition');
        if (adminEditingItem.id) {
          openEditNutrition(adminEditingItem);
        } else if (adminEditingItem._subTab === 'nutrition') {
          openNewNutrition();
        }
        setAdminEditingItem(null);
      } else if (adminEditingItem._type === 'meal') {
        setSubTab('daily');
        openEditMeal(adminEditingItem);
        setAdminEditingItem(null);
      } else if (adminEditingItem._subTab === 'daily') {
        setSubTab('daily');
        setAdminEditingItem(null);
      }
    }
  }, [adminEditingItem]);

  // Date change handler for daily meal
  const handleMealDateChange = (newDate: string) => {
    setMealDate(newDate);
    try {
      const d = new Date(newDate);
      if (!isNaN(d.getTime())) {
        setMealDayOfWeek(DAY_MAP[d.getDay()] || '월');
      }
    } catch {
      // ignore
    }
  };

  // Open new Daily Meal
  const openNewMeal = () => {
    setMealFormId(null);
    const todayStr = new Date().toISOString().split('T')[0];
    handleMealDateChange(todayStr);
    setMealMorningSnack('유기농 사과 2조각, 흰 우유(100ml)');
    setMealLunchInput(
      '친환경 찰흑미밥\n맑은 소고기무국\n수제 치킨안심텐더 & 허니머스터드\n애호박 새우살나물\n수제 배추김치'
    );
    setMealAfternoonSnack('친환경 찐고구마, 유기농 식혜');
    setMealCalories(515);
    setMealOriginInfo('쌀, 잡곡, 쇠고기, 돼지고기, 닭고기, 배추김치(국내산)');
    setMealAllergyInfo('우유, 대두, 밀, 계란');
    setMealTodayHighlight('바삭하고 부드러운 수제 닭안심텐더');
    setMealImageUrl(
      'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&auto=format&fit=crop&q=80'
    );
    setMealImageName('식단 기본 사진');
    setIsMealModalOpen(true);
  };

  // Open edit Daily Meal
  const openEditMeal = (item: MealItem) => {
    setMealFormId(item.id);
    setMealDate(item.date);
    setMealDayOfWeek(item.dayOfWeek);
    setMealMorningSnack(item.morningSnack);
    setMealLunchInput(item.lunch.join('\n'));
    setMealAfternoonSnack(item.afternoonSnack);
    setMealCalories(item.calories);
    setMealOriginInfo(item.originInfo);
    setMealAllergyInfo(item.allergyInfo);
    setMealTodayHighlight(item.todayHighlight || '');
    setMealImageUrl(item.imageUrl || '');
    setMealImageName(item.imageUrl ? '등록된 식단 사진' : '');
    setIsMealModalOpen(true);
  };

  // Save Daily Meal
  const handleSaveMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealDate) {
      alert('식단 일자를 지정해 주세요.');
      return;
    }

    const lunchDishes = mealLunchInput
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    if (lunchDishes.length === 0) {
      alert('점심 식단 메뉴를 한 줄에 하나씩 입력해 주세요.');
      return;
    }

    const payload = {
      date: mealDate,
      dayOfWeek: mealDayOfWeek,
      morningSnack: mealMorningSnack,
      lunch: lunchDishes,
      afternoonSnack: mealAfternoonSnack,
      calories: Number(mealCalories) || 500,
      originInfo: mealOriginInfo,
      allergyInfo: mealAllergyInfo,
      todayHighlight: mealTodayHighlight || undefined,
      imageUrl: mealImageUrl || undefined,
    };

    if (mealFormId) {
      updateMeal(mealFormId, payload);
    } else {
      addMeal(payload);
    }

    setIsMealModalOpen(false);
  };

  // Open new Nutrition Newsletter
  const openNewNutrition = () => {
    setNutritionFormId(null);
    const d = new Date();
    const curYear = d.getFullYear();
    const curMonth = d.getMonth() + 1;
    setNutritionPeriod(`${curYear}년 ${curMonth}월호`);
    setNutritionDate(
      `${curYear}.${String(curMonth).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
    );
    setNutritionTitle('성장기 우리 아이를 위한 제철 영양 가이드');
    setNutritionSupervisor('홍천군 어린이급식관리지원센터 자문');
    setNutritionSummary(
      '우리 아이들의 균형 잡힌 신체 발달과 면역력을 돕는 이달의 영양 정보입니다.'
    );
    setNutritionSections([
      {
        title: '1. 저염·저당 건강 조리 원칙',
        content:
          '국 염도 0.5% 이하, 천연 다시마와 멸치 육수만을 사용하여 영유아의 신장 부담을 최소화합니다.',
        color: 'emerald',
      },
      {
        title: '2. 강원 홍천 로컬푸드 식자재',
        content:
          '강원 홍천 지역에서 재배된 신선한 제철 농산물과 국내산 무항생제 식재료를 매일 아침 직송받습니다.',
        color: 'amber',
      },
      {
        title: '3. 영유아 식품 알레르기 안심 수칙',
        content:
          '알레르기 유발 물질을 사전 점검하여 원아별 맞춤 대체 식단을 정성껏 제공합니다.',
        color: 'rose',
      },
    ]);
    setNutritionTipsInput(
      '가정에서도 식사 전 손 씻기 6단계를 함께 실천해 주세요.\n식사 2시간 전에는 단 간식을 제한해 주세요.\n온 가족이 식사하며 즐거운 대화를 나눠요.'
    );
    setNutritionImageUrl(
      'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&auto=format&fit=crop&q=80'
    );
    setNutritionImageName('영양소식지 포스터 이미지');
    setNutritionAttachmentName(`${curYear}년_${curMonth}월_영양소식지_예사랑.pdf`);
    setIsNutritionModalOpen(true);
  };

  // Open edit Nutrition Newsletter
  const openEditNutrition = (item: NutritionNewsletter) => {
    setNutritionFormId(item.id);
    setNutritionPeriod(item.period);
    setNutritionDate(item.date);
    setNutritionTitle(item.title);
    setNutritionSupervisor(item.supervisor || '홍천군 어린이급식관리지원센터 자문');
    setNutritionSummary(item.summary);
    setNutritionSections(
      item.sections && item.sections.length > 0
        ? [...item.sections]
        : [{ title: '주요 영양 정보', content: '', color: 'emerald' }]
    );
    setNutritionTipsInput((item.tips || []).join('\n'));
    setNutritionImageUrl(item.imageUrl || '');
    setNutritionImageName(item.imageUrl ? '등록된 포스터/카드뉴스' : '');
    setNutritionAttachmentName(item.attachmentName || '');
    setIsNutritionModalOpen(true);
  };

  // Load Template preset for Nutrition Newsletter
  const handleLoadNutritionTemplate = (tpl: (typeof NUTRITION_TEMPLATES)[0]) => {
    setNutritionPeriod(tpl.period);
    setNutritionTitle(tpl.title);
    setNutritionSupervisor(tpl.supervisor);
    setNutritionSummary(tpl.summary);
    setNutritionSections(tpl.sections.map(s => ({ ...s })));
    setNutritionTipsInput(tpl.tips.join('\n'));
    setNutritionImageUrl(tpl.imageUrl);
    setNutritionImageName('템플릿 대표 이미지');
    setNutritionAttachmentName(tpl.attachmentName);
  };

  // Add Section to Nutrition Newsletter
  const handleAddNutritionSection = () => {
    setNutritionSections(prev => [
      ...prev,
      {
        title: `${prev.length + 1}. 새로운 영양 주제`,
        content: '',
        color: prev.length % 2 === 0 ? 'emerald' : 'amber',
      },
    ]);
  };

  // Remove Section from Nutrition Newsletter
  const handleRemoveNutritionSection = (index: number) => {
    if (nutritionSections.length <= 1) {
      alert('최소 1개 이상의 영양 주제 섹션이 필요합니다.');
      return;
    }
    setNutritionSections(prev => prev.filter((_, i) => i !== index));
  };

  // Update specific Section
  const handleUpdateNutritionSection = (
    index: number,
    field: keyof NutritionNewsletterSection,
    value: string
  ) => {
    setNutritionSections(prev => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        [field]: value,
      };
      return next;
    });
  };

  // Save Nutrition Newsletter
  const handleSaveNutrition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nutritionTitle.trim()) {
      alert('소식지 제목을 입력해 주세요.');
      return;
    }
    if (!nutritionPeriod.trim()) {
      alert('발행 호수/기간(예: 2026년 3월호)을 입력해 주세요.');
      return;
    }

    const tipsArray = nutritionTipsInput
      .split('\n')
      .map(t => t.trim())
      .filter(Boolean);

    const payload = {
      period: nutritionPeriod.trim(),
      date: nutritionDate.trim() || new Date().toISOString().split('T')[0].replace(/-/g, '.'),
      title: nutritionTitle.trim(),
      supervisor: nutritionSupervisor.trim() || '홍천군 어린이급식관리지원센터 자문',
      summary: nutritionSummary.trim(),
      sections: nutritionSections.map(s => ({
        title: s.title.trim(),
        content: s.content.trim(),
        color: s.color || 'emerald',
      })),
      tips: tipsArray,
      imageUrl: nutritionImageUrl.trim() || undefined,
      attachmentName: nutritionAttachmentName.trim() || undefined,
    };

    if (nutritionFormId) {
      updateNutritionNewsletter(nutritionFormId, payload);
    } else {
      addNutritionNewsletter(payload);
    }

    setIsNutritionModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Subtab switcher */}
      <div className="flex border-b border-stone-200 gap-2">
        <button
          type="button"
          onClick={() => setSubTab('daily')}
          className={`flex items-center gap-2 pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer ${
            subTab === 'daily'
              ? 'border-amber-500 text-stone-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Utensils className="w-4 h-4 text-amber-600" />
          <span>이달의 식단표 관리</span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold">
            {meals.length}일
          </span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('nutrition')}
          className={`flex items-center gap-2 pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer ${
            subTab === 'nutrition'
              ? 'border-amber-500 text-stone-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <BookOpen className="w-4 h-4 text-emerald-600" />
          <span>영양 소식지 관리</span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold">
            {nutritionNewsletters.length}개 호수
          </span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* 1. Daily Meals Subtab                                    */}
      {/* ======================================================== */}
      {subTab === 'daily' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-stone-100">
            <div>
              <h3 className="text-base sm:text-lg font-black text-stone-900">
                일일 급식·간식 식단표 관리
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                총 {meals.length}일 분량의 일일 식단이 등록되어 있습니다.
              </p>
            </div>

            <button
              onClick={openNewMeal}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#F5C451] to-[#F0935C] text-stone-950 text-xs sm:text-sm font-bold shadow-xs hover:brightness-105 active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>새 식단 등록</span>
            </button>
          </div>

          <div className="space-y-3">
            {meals.map(item => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-amber-300 transition-colors shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex items-start space-x-4 min-w-0 flex-1">
                  <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-amber-800">{item.dayOfWeek}요일</span>
                    <span className="text-sm font-black text-stone-900">{item.date.slice(5)}</span>
                  </div>

                  {item.imageUrl && (
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200 hidden sm:block">
                      <img src={item.imageUrl} alt="식단" className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-stone-900">{item.date}</span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 font-bold">
                        {item.calories} kcal
                      </span>
                      {item.todayHighlight && (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold hidden sm:inline-block">
                          ★ {item.todayHighlight}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-stone-600 line-clamp-1">
                      <span className="font-bold text-stone-700 mr-1">[중식]</span>
                      {item.lunch.join(', ')}
                    </p>

                    <div className="flex items-center space-x-3 text-[11px] text-stone-500">
                      <span>오전 간식: {item.morningSnack}</span>
                      <span>•</span>
                      <span>오후 간식: {item.afternoonSnack}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-end md:self-center shrink-0">
                  <button
                    onClick={() => openEditMeal(item)}
                    className="p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
                    title="수정"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setMealDeleteTargetId(item.id)}
                    className="p-2 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. Nutrition Newsletters Subtab (영양소식지 관리)        */}
      {/* ======================================================== */}
      {subTab === 'nutrition' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-stone-100">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[11px] font-bold">
                  월간 정기 업데이트
                </span>
                <h3 className="text-base sm:text-lg font-black text-stone-900">
                  영양 소식지 정기 발행 및 관리
                </h3>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                학부모님들께 공유되는 월별 안심 영양 가이드 및 식습관 교육 콘텐츠를 관리합니다.
              </p>
            </div>

            <button
              onClick={openNewNutrition}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs sm:text-sm font-bold shadow-xs hover:brightness-105 active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>새 영양소식지 발행</span>
            </button>
          </div>

          {/* Preset templates notice */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-200 text-emerald-800 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-emerald-950">
                  원장님·영양사 선생님을 위한 추천 소식지 템플릿
                </p>
                <p className="text-emerald-800 text-[11px]">
                  ‘새 영양소식지 발행’ 시 어린이급식관리지원센터 영양 지침 기반 추천 예시를 1초 만에
                  불러올 수 있습니다.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={openNewNutrition}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-white border border-emerald-300 text-emerald-900 hover:bg-emerald-100/60 transition-colors shrink-0 cursor-pointer"
            >
              템플릿으로 바로 작성하기
            </button>
          </div>

          {/* Nutrition Newsletters List */}
          <div className="space-y-4">
            {nutritionNewsletters.map((item, idx) => (
              <div
                key={item.id}
                className="p-5 rounded-3xl bg-white border border-stone-200 hover:border-emerald-300 transition-all shadow-2xs hover:shadow-sm"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-start space-x-4 min-w-0 flex-1">
                    {/* Period badge */}
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 flex flex-col items-center justify-center shrink-0 text-center p-1">
                      <span className="text-[10px] font-bold text-emerald-800">
                        {idx === 0 ? '최신호' : '소식지'}
                      </span>
                      <span className="text-xs font-black text-stone-900 leading-tight">
                        {item.period}
                      </span>
                      <span className="text-[9px] text-stone-500 mt-0.5">{item.date}</span>
                    </div>

                    {/* Image thumbnail if any */}
                    {item.imageUrl && (
                      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200 hidden sm:block">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Content details */}
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 font-bold">
                          {item.supervisor || '홍천군 급식지원센터 자문'}
                        </span>
                        {item.attachmentName && (
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold inline-flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            PDF 첨부됨
                          </span>
                        )}
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                          주제 {item.sections.length}개
                        </span>
                      </div>

                      <h4 className="text-base font-black text-stone-900 leading-snug">
                        {item.title}
                      </h4>

                      <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                        {item.summary}
                      </p>

                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {item.sections.map((sec, sIdx) => (
                          <span
                            key={sIdx}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-stone-50 border border-stone-200 text-stone-600"
                          >
                            {sec.title}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 self-end md:self-center shrink-0">
                    <button
                      onClick={() => openEditNutrition(item)}
                      className="inline-flex items-center space-x-1 px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-stone-600" />
                      <span>수정</span>
                    </button>
                    <button
                      onClick={() => setNutritionDeleteTargetId(item.id)}
                      className="p-2 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="소식지 삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* Daily Meal Modal Form                                    */}
      {/* ======================================================== */}
      {isMealModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Utensils className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-stone-900">
                    {mealFormId ? '식단표 수정' : '새 식단 등록'}
                  </h3>
                  <p className="text-xs text-stone-500">일일 급식 및 간식 정보를 입력합니다.</p>
                </div>
              </div>
              <button
                onClick={() => setIsMealModalOpen(false)}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMeal} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">식단 일자 *</label>
                  <input
                    type="date"
                    required
                    value={mealDate}
                    onChange={e => handleMealDateChange(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">요일 및 예상 칼로리</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      readOnly
                      value={`${mealDayOfWeek}요일`}
                      className="w-24 px-3 py-2.5 rounded-xl bg-stone-100 border border-stone-300 text-center font-bold text-stone-700"
                    />
                    <div className="flex-1 relative">
                      <input
                        type="number"
                        min="300"
                        max="900"
                        value={mealCalories}
                        onChange={e => setMealCalories(Number(e.target.value))}
                        className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium pr-12"
                      />
                      <span className="absolute right-3 top-2.5 text-stone-500 text-xs font-bold">
                        kcal
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">
                  점심 메뉴 (식단) * (한 줄에 한 메뉴씩 입력)
                </label>
                <textarea
                  required
                  rows={4}
                  value={mealLunchInput}
                  onChange={e => setMealLunchInput(e.target.value)}
                  placeholder="친환경 찰흑미밥&#10;맑은 쇠고기무국&#10;수제 닭안심텐더&#10;애호박 새우살나물&#10;배추김치"
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">오전 간식</label>
                  <input
                    type="text"
                    value={mealMorningSnack}
                    onChange={e => setMealMorningSnack(e.target.value)}
                    placeholder="예: 제철 딸기, 유기농 우유"
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">오후 간식</label>
                  <input
                    type="text"
                    value={mealAfternoonSnack}
                    onChange={e => setMealAfternoonSnack(e.target.value)}
                    placeholder="예: 찐 고구마, 감귤 주스"
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">오늘의 추천 메뉴 / 하이라이트</label>
                <input
                  type="text"
                  value={mealTodayHighlight}
                  onChange={e => setMealTodayHighlight(e.target.value)}
                  placeholder="예: 셰프 추천 겉바속촉 수제 닭안심텐더"
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">주요 식자재 원산지 정보</label>
                  <input
                    type="text"
                    value={mealOriginInfo}
                    onChange={e => setMealOriginInfo(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">알레르기 유발 물질 정보</label>
                  <input
                    type="text"
                    value={mealAllergyInfo}
                    onChange={e => setMealAllergyInfo(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">급식 사진 등록 (선택)</label>
                <FileUpload
                  value={mealImageUrl}
                  fileName={mealImageName}
                  onChange={(dataUrl, name) => {
                    setMealImageUrl(dataUrl);
                    setMealImageName(name);
                  }}
                  onClear={() => {
                    setMealImageUrl('');
                    setMealImageName('');
                  }}
                  accept="image/*"
                  helperText="식판 사진을 등록하면 학부모님이 식단표에서 실물 사진을 확인할 수 있습니다."
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsMealModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-stone-600 hover:bg-stone-100 font-bold"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F5C451] to-[#F0935C] text-stone-950 font-black shadow-md hover:brightness-105 active:scale-95 transition-all"
                >
                  {mealFormId ? '수정 완료' : '등록하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* Nutrition Newsletter Modal Form                          */}
      {/* ======================================================== */}
      {isNutritionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-stone-900">
                    {nutritionFormId ? '영양 소식지 수정' : '새 영양 소식지 발행'}
                  </h3>
                  <p className="text-xs text-stone-500">
                    학부모님을 위한 월간 영양 가이드 및 가정 연계 팁을 작성합니다.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsNutritionModalOpen(false)}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Template Presets Bar */}
            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
              <div className="flex items-center space-x-1.5 mb-2 text-xs font-bold text-stone-700">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>추천 영양 지침 템플릿 불러오기 (클릭 시 자동 완성)</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {NUTRITION_TEMPLATES.map((tpl, tIdx) => (
                  <button
                    key={tIdx}
                    type="button"
                    onClick={() => handleLoadNutritionTemplate(tpl)}
                    className="text-xs font-bold px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-stone-800 hover:text-emerald-900 border border-stone-200 hover:border-emerald-300 transition-all cursor-pointer shadow-2xs"
                  >
                    {tpl.name}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSaveNutrition} className="space-y-4 text-xs sm:text-sm">
              {/* Row 1: Period, Date, Supervisor */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">
                    발행 호수/기간 * (예: 2026년 3월호)
                  </label>
                  <input
                    type="text"
                    required
                    value={nutritionPeriod}
                    onChange={e => setNutritionPeriod(e.target.value)}
                    placeholder="2026년 3월호"
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">발행 일자 (YYYY.MM.DD)</label>
                  <input
                    type="text"
                    value={nutritionDate}
                    onChange={e => setNutritionDate(e.target.value)}
                    placeholder="2026.03.01"
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">자문 및 검수 기관</label>
                  <input
                    type="text"
                    value={nutritionSupervisor}
                    onChange={e => setNutritionSupervisor(e.target.value)}
                    placeholder="홍천군 어린이급식관리지원센터 자문"
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 font-medium"
                  />
                </div>
              </div>

              {/* Row 2: Title */}
              <div>
                <label className="block text-stone-700 font-bold mb-1">소식지 제목 *</label>
                <input
                  type="text"
                  required
                  value={nutritionTitle}
                  onChange={e => setNutritionTitle(e.target.value)}
                  placeholder="예: 성장기 우리 아이를 위한 봄철 영양 가이드"
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 font-bold text-stone-900"
                />
              </div>

              {/* Row 3: Summary */}
              <div>
                <label className="block text-stone-700 font-bold mb-1">
                  소식지 요약 안내문 (학부모 안내 인사말)
                </label>
                <textarea
                  rows={2}
                  value={nutritionSummary}
                  onChange={e => setNutritionSummary(e.target.value)}
                  placeholder="신학기 새로운 환경에 적응하는 우리 아이들의 면역력을 키우기 위한 안내입니다."
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 font-medium leading-relaxed"
                />
              </div>

              {/* Row 4: Dynamic Sections */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="block text-stone-800 font-black">
                    소식지 핵심 영양 주제 섹션 ({nutritionSections.length}개)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddNutritionSection}
                    className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ 주제 섹션 추가</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {nutritionSections.map((sec, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={sec.title}
                            onChange={e =>
                              handleUpdateNutritionSection(sIdx, 'title', e.target.value)
                            }
                            placeholder={`섹션 ${sIdx + 1} 제목 (예: 1. 저염·저당 건강 조리 원칙)`}
                            className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 font-bold text-stone-900 text-xs sm:text-sm"
                          />
                        </div>

                        {/* Color badge selector */}
                        <div className="flex items-center space-x-1.5 shrink-0">
                          <span className="text-[11px] text-stone-500 font-bold hidden sm:inline">
                            테마:
                          </span>
                          {(['emerald', 'amber', 'rose', 'blue'] as const).map(color => (
                            <button
                              key={color}
                              type="button"
                              onClick={() => handleUpdateNutritionSection(sIdx, 'color', color)}
                              className={`w-6 h-6 rounded-full border-2 transition-all cursor-pointer ${
                                color === 'emerald'
                                  ? 'bg-emerald-400'
                                  : color === 'amber'
                                  ? 'bg-amber-400'
                                  : color === 'rose'
                                  ? 'bg-rose-400'
                                  : 'bg-blue-400'
                              } ${
                                sec.color === color
                                  ? 'border-stone-900 scale-110 shadow-xs'
                                  : 'border-transparent opacity-60 hover:opacity-100'
                              }`}
                              title={`${color} 테마`}
                            />
                          ))}

                          <button
                            type="button"
                            onClick={() => handleRemoveNutritionSection(sIdx)}
                            className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 ml-1 cursor-pointer"
                            title="섹션 삭제"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <textarea
                        rows={3}
                        value={sec.content}
                        onChange={e =>
                          handleUpdateNutritionSection(sIdx, 'content', e.target.value)
                        }
                        placeholder="해당 영양 주제에 대한 구체적인 조리 원칙이나 영양소 안내 내용을 입력하세요."
                        className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 font-medium text-stone-800 leading-relaxed text-xs sm:text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 5: Home Tips */}
              <div>
                <label className="block text-stone-700 font-bold mb-1">
                  가정 연계 영양 꿀팁 & 실천 가이드 (한 줄에 하나씩 입력)
                </label>
                <textarea
                  rows={3}
                  value={nutritionTipsInput}
                  onChange={e => setNutritionTipsInput(e.target.value)}
                  placeholder="가정에서도 식사 전 손 씻기 6단계를 온 가족이 함께 실천해 주세요.&#10;봄철 춘곤증 예방을 위해 비타민 C가 풍부한 제철 과일을 섭취해요.&#10;식사 2시간 전에는 단 간식을 제한해 주세요."
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 font-medium leading-relaxed"
                />
              </div>

              {/* Row 6: Photo / Poster Upload */}
              <div>
                <label className="block text-stone-700 font-bold mb-1">
                  소식지 포스터 / 대표 이미지 첨부 (선택)
                </label>
                <FileUpload
                  value={nutritionImageUrl}
                  fileName={nutritionImageName}
                  onChange={(dataUrl, name) => {
                    setNutritionImageUrl(dataUrl);
                    setNutritionImageName(name);
                  }}
                  onClear={() => {
                    setNutritionImageUrl('');
                    setNutritionImageName('');
                  }}
                  accept="image/*"
                  helperText="영양 소식지 포스터 이미지나 카드뉴스를 등록하면 학부모 화면에 시각적으로 강조됩니다."
                />
              </div>

              {/* Row 7: Attachment Name */}
              <div>
                <label className="block text-stone-700 font-bold mb-1">
                  소식지 다운로드 첨부파일명 (PDF 등)
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={nutritionAttachmentName}
                    onChange={e => setNutritionAttachmentName(e.target.value)}
                    placeholder="예: 2026년_3월_영양소식지_홍천군급식지원센터.pdf"
                    className="flex-1 px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 font-medium"
                  />
                  <span className="text-xs text-stone-500 shrink-0">
                    (학부모 소식지 다운로드 버튼 활성화)
                  </span>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsNutritionModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-stone-600 hover:bg-stone-100 font-bold cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black shadow-md hover:brightness-105 active:scale-95 transition-all cursor-pointer"
                >
                  {nutritionFormId ? '수정 완료' : '소식지 발행하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Daily Meal Dialog */}
      <ConfirmDialog
        isOpen={!!mealDeleteTargetId}
        title="식단을 삭제하시겠습니까?"
        message="해당 일자의 일일 식단 정보가 영구적으로 삭제됩니다."
        confirmLabel="식단 삭제"
        isDanger={true}
        onConfirm={() => {
          if (mealDeleteTargetId) {
            deleteMeal(mealDeleteTargetId);
            setMealDeleteTargetId(null);
          }
        }}
        onCancel={() => setMealDeleteTargetId(null)}
      />

      {/* Delete Nutrition Newsletter Dialog */}
      <ConfirmDialog
        isOpen={!!nutritionDeleteTargetId}
        title="영양소식지를 삭제하시겠습니까?"
        message="발행된 해당 호수의 영양 소식지와 관련 섹션 정보가 영구히 삭제됩니다."
        confirmLabel="소식지 삭제"
        isDanger={true}
        onConfirm={() => {
          if (nutritionDeleteTargetId) {
            deleteNutritionNewsletter(nutritionDeleteTargetId);
            setNutritionDeleteTargetId(null);
          }
        }}
        onCancel={() => setNutritionDeleteTargetId(null)}
      />
    </div>
  );
};
