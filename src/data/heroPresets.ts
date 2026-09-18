export interface HeroPreset {
  id: string;
  title: string;
  badge: string;
  caption: string;
  imageUrl: string;
  description: string;
}

export const DEFAULT_HERO_IMAGE =
  'https://images.unsplash.com/photo-1596464716127-f2a829822321?w=800&auto=format&fit=crop&q=80';
export const DEFAULT_HERO_BADGE = '숲체험 & 오감놀이';
export const DEFAULT_HERO_CAPTION = '"자연 속에서 마음껏 웃고 뛰노는 우리 아이들"';

export const HERO_PRESETS: HeroPreset[] = [
  {
    id: 'forest',
    title: '자연 숲체험 & 오감놀이 (기본)',
    badge: '숲체험 & 오감놀이',
    caption: '"자연 속에서 마음껏 웃고 뛰노는 우리 아이들"',
    imageUrl:
      'https://images.unsplash.com/photo-1596464716127-f2a829822321?w=800&auto=format&fit=crop&q=80',
    description: '맑은 공기와 푸른 자연 속 생태 오감 놀이',
  },
  {
    id: 'playground',
    title: '햇살 가득 행복 놀이터',
    badge: '바깥놀이 & 신체활동',
    caption: '"푸른 잔디밭에서 힘차게 뛰노는 건강한 아이들"',
    imageUrl:
      'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=800&auto=format&fit=crop&q=80',
    description: '마음껏 에너지를 발산하는 실외 놀이와 체육 활동',
  },
  {
    id: 'art',
    title: '창의미술 & 감성표현',
    badge: '창의미술 & 감성표현',
    caption: '"자유로운 상상력과 꿈을 키워가는 창의 놀이터"',
    imageUrl:
      'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&auto=format&fit=crop&q=80',
    description: '알록달록 색채와 조형으로 마음을 표현하는 미술 시간',
  },
  {
    id: 'classroom',
    title: '포근한 안심교실 & 누리과정',
    badge: '따뜻한 돌봄 & 누리과정',
    caption: '"가정처럼 편안하고 포근한 사랑의 울타리"',
    imageUrl:
      'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80',
    description: '선생님의 따뜻한 눈맞춤과 맞춤형 누리과정 돌봄',
  },
  {
    id: 'reading',
    title: '동화나라 책놀이',
    badge: '독서놀이 & 인성교육',
    caption: '"선생님과 도란도란 동화 속 지혜를 배워요"',
    imageUrl:
      'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
    description: '풍부한 어휘력과 바른 인성을 키워주는 독서 활동',
  },
];
