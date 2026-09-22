import {
  Heart,
  Sprout,
  Sparkles,
  Smile,
  Star,
  Sun,
  Users,
  BookOpen,
  ShieldCheck,
  TreePine,
  type LucideIcon,
} from 'lucide-react';

/**
 * 교육철학(핵심 가치) 카드에서 선택 가능한 아이콘 목록.
 * institution.philosophy[].icon 에는 이 목록의 id(컴포넌트명 문자열)가 저장됩니다.
 */
export interface PhilosophyIconOption {
  id: string;
  label: string;
  Icon: LucideIcon;
}

export const PHILOSOPHY_ICON_OPTIONS: PhilosophyIconOption[] = [
  { id: 'Heart', label: '사랑', Icon: Heart },
  { id: 'Sprout', label: '새싹·생태', Icon: Sprout },
  { id: 'Sparkles', label: '반짝임·놀이', Icon: Sparkles },
  { id: 'Smile', label: '미소·인성', Icon: Smile },
  { id: 'Star', label: '별·성장', Icon: Star },
  { id: 'Sun', label: '해·에너지', Icon: Sun },
  { id: 'Users', label: '함께·공동체', Icon: Users },
  { id: 'BookOpen', label: '책·학습', Icon: BookOpen },
  { id: 'ShieldCheck', label: '안전·신뢰', Icon: ShieldCheck },
  { id: 'TreePine', label: '나무·자연', Icon: TreePine },
];

export const DEFAULT_PHILOSOPHY_ICON = 'Heart';

/** 저장된 icon id로 실제 아이콘 컴포넌트를 찾습니다. 목록에 없으면 기본 아이콘으로 대체합니다. */
export function getPhilosophyIcon(name?: string): LucideIcon {
  return PHILOSOPHY_ICON_OPTIONS.find(opt => opt.id === name)?.Icon || Heart;
}

/**
 * 교육철학 카드에서 선택 가능한 색상 목록.
 * Tailwind는 클래스명이 소스 코드에 문자 그대로 있어야 인식하므로, 색상별 클래스를 전부 고정 문자열로 나열합니다.
 */
export interface PhilosophyColorOption {
  id: string;
  label: string;
  bg: string;
  text: string;
}

export const PHILOSOPHY_COLOR_OPTIONS: PhilosophyColorOption[] = [
  { id: 'amber', label: '주황·황금', bg: 'bg-amber-100', text: 'text-amber-600' },
  { id: 'emerald', label: '초록·생태', bg: 'bg-emerald-100', text: 'text-emerald-600' },
  { id: 'blue', label: '파랑·신뢰', bg: 'bg-blue-100', text: 'text-blue-600' },
  { id: 'rose', label: '로즈·사랑', bg: 'bg-rose-100', text: 'text-rose-600' },
  { id: 'purple', label: '보라·창의', bg: 'bg-purple-100', text: 'text-purple-600' },
  { id: 'teal', label: '청록·안정', bg: 'bg-teal-100', text: 'text-teal-600' },
];

export const DEFAULT_PHILOSOPHY_COLOR = 'amber';

/** 저장된 color id로 배경/텍스트 클래스를 찾습니다. 목록에 없으면 기본(amber) 색상으로 대체합니다. */
export function getPhilosophyColor(name?: string): PhilosophyColorOption {
  return PHILOSOPHY_COLOR_OPTIONS.find(opt => opt.id === name) || PHILOSOPHY_COLOR_OPTIONS[0];
}
