export interface NoticeItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: '공지' | '안내' | '모집' | '행사';
  author: string;
  createdAt: string; // YYYY.MM.DD
  views: number;
  isPinned?: boolean;
  isNew?: boolean;
  hasAttachment?: boolean;
  attachmentName?: string;
}

export interface NewsletterItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  targetClass: string; // '전체' | '새싹반' | '슬기반' | '지혜반' | '예솔반'
  author: string;
  createdAt: string; // YYYY.MM.DD
  views: number;
  hasAttachment?: boolean;
  attachmentName?: string;
  isImportant?: boolean;
}

export interface MealItem {
  id: string;
  date: string; // YYYY-MM-DD
  dayOfWeek: string; // '월' | '화' | '수' | '목' | '금'
  morningSnack: string;
  lunch: string[];
  afternoonSnack: string;
  calories: number; // kcal
  originInfo: string;
  allergyInfo: string;
  imageUrl?: string;
  todayHighlight?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: '활동사진' | '급식사진' | '체험학습' | '행사';
  date: string; // YYYY.MM.DD
  imageUrl: string;
  description: string;
  likeCount: number;
  targetClass?: string;
}

export interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  month: number; // 1 ~ 12
  day: number;
  title: string;
  category: '행사' | '체험' | '휴원' | '보건/안전' | '교육';
  targetClass?: string;
  time?: string;
  location?: string;
  description?: string;
}

export interface TeacherInfo {
  id: string;
  role: string;
  name: string;
  className: string;
  message: string;
  badge: string;
}

export interface FacilityRoom {
  id: string;
  name: string;
  description: string;
  features: string[];
  imageUrl: string;
}

export interface ProgramInfo {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  targetAge: string;
  tags: string[];
  features: string[];
  iconName: string;
}

export interface PartnerOrg {
  id: string;
  name: string;
  shortName: string;
  category: string;
  url: string;
}

export interface ConsultationRequest {
  parentName: string;
  childName: string;
  childBirthYear: string;
  phone: string;
  desiredDate: string;
  inquiry: string;
  status?: '접수완료' | '상담대기';
}
