import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  getDocs,
  writeBatch,
  query,
  orderBy,
  increment,
} from 'firebase/firestore';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import { db, auth, ADMIN_EMAIL } from '../lib/firebase';
import {
  NoticeItem,
  NewsletterItem,
  MealItem,
  GalleryItem,
  CalendarEvent,
  PartnerOrg,
  InstitutionData,
  IntroDetailsData,
  TeacherInfo,
  FacilityRoom,
  InstitutionClass,
  AdminTab,
  NutritionNewsletter,
} from '../types';

// 최초 시딩 전 화면이 비지 않도록 보여줄 기본값(원본 목업 JSON) — 실제 시딩은 scripts/seed-firestore.ts 로 합니다.
import defaultNotices from '../data/notices.json';
import defaultNewsletters from '../data/newsletters.json';
import defaultMeals from '../data/meals.json';
import defaultNutritionNewsletters from '../data/nutritionNewsletters.json';
import defaultGallery from '../data/gallery.json';
import defaultEvents from '../data/events.json';
import defaultPartners from '../data/partners.json';
import defaultInstitution from '../data/institution.json';
import defaultIntroDetails from '../data/introDetails.json';

const COLLECTIONS = {
  NOTICES: 'notices',
  NEWSLETTERS: 'newsletters',
  MEALS: 'meals',
  NUTRITION_NEWSLETTERS: 'nutritionNewsletters',
  GALLERY: 'gallery',
  EVENTS: 'events',
} as const;

const SETTINGS_DOC = {
  INSTITUTION: doc(db, 'settings', 'institution'),
  INTRO: doc(db, 'settings', 'intro'),
} as const;

interface DataContextType {
  // Data states
  notices: NoticeItem[];
  newsletters: NewsletterItem[];
  meals: MealItem[];
  nutritionNewsletters: NutritionNewsletter[];
  gallery: GalleryItem[];
  events: CalendarEvent[];
  partners: PartnerOrg[];
  institution: InstitutionData;
  introDetails: IntroDetailsData;

  // Admin Auth & UI states
  isAdmin: boolean;
  isAdminDashboardOpen: boolean;
  isPasswordModalOpen: boolean;
  activeAdminTab: AdminTab;
  adminEditingItem: any | null;

  // Setters for Admin UI
  setIsAdminDashboardOpen: (open: boolean) => void;
  setIsPasswordModalOpen: (open: boolean) => void;
  setActiveAdminTab: (tab: AdminTab) => void;
  setAdminEditingItem: (item: any | null) => void;
  openAdminWithTab: (tab: AdminTab, editItem?: any) => void;

  // Auth methods (Firebase Authentication 기반, 전부 비동기)
  login: (password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  changePassword: (currentPw: string, newPw: string) => Promise<{ success: boolean; message?: string }>;

  // 전체 컬렉션 + 설정 문서를 원본 목업 데이터로 되돌림 (Firestore 데이터를 실제로 삭제/재시딩)
  resetToDefaults: () => Promise<void>;

  // CRUD Notices
  addNotice: (item: Omit<NoticeItem, 'id' | 'views'>) => Promise<void>;
  updateNotice: (id: string, item: Partial<NoticeItem>) => Promise<void>;
  deleteNotice: (id: string) => Promise<void>;

  // CRUD Newsletters
  addNewsletter: (item: Omit<NewsletterItem, 'id' | 'views'>) => Promise<void>;
  updateNewsletter: (id: string, item: Partial<NewsletterItem>) => Promise<void>;
  deleteNewsletter: (id: string) => Promise<void>;

  // CRUD Meals
  addMeal: (item: Omit<MealItem, 'id'>) => Promise<void>;
  updateMeal: (id: string, item: Partial<MealItem>) => Promise<void>;
  deleteMeal: (id: string) => Promise<void>;

  // CRUD Nutrition Newsletters
  addNutritionNewsletter: (item: Omit<NutritionNewsletter, 'id'>) => Promise<void>;
  updateNutritionNewsletter: (id: string, item: Partial<NutritionNewsletter>) => Promise<void>;
  deleteNutritionNewsletter: (id: string) => Promise<void>;

  // CRUD Gallery
  addGalleryItem: (item: Omit<GalleryItem, 'id' | 'likeCount'>) => Promise<void>;
  updateGalleryItem: (id: string, item: Partial<GalleryItem>) => Promise<void>;
  deleteGalleryItem: (id: string) => Promise<void>;
  likeGalleryItem: (id: string) => Promise<void>;

  // CRUD Events
  addEvent: (item: Omit<CalendarEvent, 'id'>) => Promise<void>;
  updateEvent: (id: string, item: Partial<CalendarEvent>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;

  // CRUD Institution & Intro
  updateInstitution: (data: Partial<InstitutionData>) => Promise<void>;
  updateClasses: (classes: InstitutionClass[], renameMap?: Record<string, string>) => Promise<void>;
  updateIntroDetails: (data: Partial<IntroDetailsData>) => Promise<void>;
  addTeacher: (teacher: Omit<TeacherInfo, 'id'>) => Promise<void>;
  updateTeacher: (id: string, teacher: Partial<TeacherInfo>) => Promise<void>;
  deleteTeacher: (id: string) => Promise<void>;
  addFacility: (facility: Omit<FacilityRoom, 'id'>) => Promise<void>;
  updateFacility: (id: string, facility: Partial<FacilityRoom>) => Promise<void>;
  deleteFacility: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

/**
 * 하나의 Firestore 컬렉션을 실시간 구독해 배열 state로 노출하는 공통 훅.
 * 정렬은 서버 타임스탬프 대신 클라이언트에서 채우는 `_order` 숫자 필드를 사용합니다
 * (같은 배치 안에서 serverTimestamp가 동일 값으로 찍혀 순서가 꼬이는 문제를 피하기 위함).
 */
function useFirestoreCollection<T extends { id: string }>(collectionName: string, fallback: T[]) {
  const [items, setItems] = useState<T[]>(fallback);

  useEffect(() => {
    const q = query(collection(db, collectionName), orderBy('_order', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      snapshot => {
        setItems(snapshot.docs.map(d => ({ id: d.id, ...d.data() }) as T));
      },
      error => {
        console.error(`[firestore] ${collectionName} 구독 오류`, error);
      }
    );
    return unsubscribe;
  }, [collectionName]);

  return { items, setItems };
}

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { items: notices } = useFirestoreCollection<NoticeItem>(COLLECTIONS.NOTICES, defaultNotices as NoticeItem[]);
  const { items: newsletters } = useFirestoreCollection<NewsletterItem>(
    COLLECTIONS.NEWSLETTERS,
    defaultNewsletters as NewsletterItem[]
  );
  const { items: meals } = useFirestoreCollection<MealItem>(COLLECTIONS.MEALS, defaultMeals as MealItem[]);
  const { items: nutritionNewsletters } = useFirestoreCollection<NutritionNewsletter>(
    COLLECTIONS.NUTRITION_NEWSLETTERS,
    defaultNutritionNewsletters as NutritionNewsletter[]
  );
  const { items: gallery } = useFirestoreCollection<GalleryItem>(COLLECTIONS.GALLERY, defaultGallery as GalleryItem[]);
  const { items: events } = useFirestoreCollection<CalendarEvent>(COLLECTIONS.EVENTS, defaultEvents as CalendarEvent[]);

  // 파트너 기관 목록은 CRUD 대상이 아니라 정적 설정값이라 Firestore로 옮기지 않고 그대로 둡니다.
  const [partners] = useState<PartnerOrg[]>(defaultPartners as PartnerOrg[]);

  const [institution, setInstitution] = useState<InstitutionData>(defaultInstitution as unknown as InstitutionData);
  const [introDetails, setIntroDetails] = useState<IntroDetailsData>(defaultIntroDetails as unknown as IntroDetailsData);

  useEffect(() => {
    const unsub = onSnapshot(SETTINGS_DOC.INSTITUTION, snap => {
      if (snap.exists()) setInstitution(snap.data() as InstitutionData);
    }, error => console.error('[firestore] settings/institution 구독 오류', error));
    return unsub;
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(SETTINGS_DOC.INTRO, snap => {
      if (snap.exists()) setIntroDetails(snap.data() as IntroDetailsData);
    }, error => console.error('[firestore] settings/intro 구독 오류', error));
    return unsub;
  }, []);

  // Admin Auth States — Firebase Authentication의 로그인 상태를 그대로 반영
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => setIsAdmin(!!user));
    return unsub;
  }, []);

  // Admin Modals & Navigation state (로컬 UI 상태이므로 그대로 유지)
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>('notices');
  const [adminEditingItem, setAdminEditingItem] = useState<any | null>(null);

  // Auth methods
  const login = async (password: string) => {
    if (!ADMIN_EMAIL) {
      return { success: false, message: '관리자 계정이 설정되지 않았습니다. (VITE_ADMIN_EMAIL 확인)' };
    }
    try {
      await signInWithEmailAndPassword(auth, ADMIN_EMAIL, password);
      return { success: true };
    } catch (e) {
      return { success: false, message: '비밀번호가 올바르지 않습니다.' };
    }
  };

  const logout = async () => {
    setIsAdminDashboardOpen(false);
    setAdminEditingItem(null);
    await signOut(auth);
  };

  const changePassword = async (currentPw: string, newPw: string) => {
    const user = auth.currentUser;
    if (!user || !user.email) {
      return { success: false, message: '로그인이 필요합니다.' };
    }
    if (!newPw || newPw.trim().length < 6) {
      return { success: false, message: '새 비밀번호는 6자리 이상 입력해 주세요.' };
    }
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPw);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPw);
      return { success: true };
    } catch (e) {
      return { success: false, message: '현재 비밀번호가 일치하지 않습니다.' };
    }
  };

  // 6개 컬렉션 + 2개 설정 문서를 원본 목업 데이터로 되돌립니다. 관리자만 접근 가능한 파괴적 작업입니다.
  const resetToDefaults = async () => {
    const resetCollection = async (name: string, defaults: any[]) => {
      const snap = await getDocs(collection(db, name));
      if (!snap.empty) {
        const deleteBatch = writeBatch(db);
        snap.docs.forEach(d => deleteBatch.delete(d.ref));
        await deleteBatch.commit();
      }
      const base = Date.now();
      const insertBatch = writeBatch(db);
      defaults.forEach((item, index) => {
        const { id, ...rest } = item as { id?: string };
        const newRef = doc(collection(db, name));
        insertBatch.set(newRef, { ...rest, _order: base - index });
      });
      await insertBatch.commit();
    };

    await Promise.all([
      resetCollection(COLLECTIONS.NOTICES, defaultNotices as any[]),
      resetCollection(COLLECTIONS.NEWSLETTERS, defaultNewsletters as any[]),
      resetCollection(COLLECTIONS.MEALS, defaultMeals as any[]),
      resetCollection(COLLECTIONS.NUTRITION_NEWSLETTERS, defaultNutritionNewsletters as any[]),
      resetCollection(COLLECTIONS.GALLERY, defaultGallery as any[]),
      resetCollection(COLLECTIONS.EVENTS, defaultEvents as any[]),
      setDoc(SETTINGS_DOC.INSTITUTION, defaultInstitution as any),
      setDoc(SETTINGS_DOC.INTRO, defaultIntroDetails as any),
    ]);
  };

  const openAdminWithTab = (tab: AdminTab, editItem?: any) => {
    if (!isAdmin) {
      setIsPasswordModalOpen(true);
      return;
    }
    setActiveAdminTab(tab);
    setAdminEditingItem(editItem || null);
    setIsAdminDashboardOpen(true);
  };

  // CRUD: Notices
  const addNotice = async (item: Omit<NoticeItem, 'id' | 'views'>) => {
    await addDoc(collection(db, COLLECTIONS.NOTICES), { ...item, views: 1, _order: Date.now() });
  };
  const updateNotice = async (id: string, updated: Partial<NoticeItem>) => {
    await updateDoc(doc(db, COLLECTIONS.NOTICES, id), updated as Record<string, unknown>);
  };
  const deleteNotice = async (id: string) => {
    await deleteDoc(doc(db, COLLECTIONS.NOTICES, id));
  };

  // CRUD: Newsletters
  const addNewsletter = async (item: Omit<NewsletterItem, 'id' | 'views'>) => {
    await addDoc(collection(db, COLLECTIONS.NEWSLETTERS), { ...item, views: 1, _order: Date.now() });
  };
  const updateNewsletter = async (id: string, updated: Partial<NewsletterItem>) => {
    await updateDoc(doc(db, COLLECTIONS.NEWSLETTERS, id), updated as Record<string, unknown>);
  };
  const deleteNewsletter = async (id: string) => {
    await deleteDoc(doc(db, COLLECTIONS.NEWSLETTERS, id));
  };

  // CRUD: Meals
  const addMeal = async (item: Omit<MealItem, 'id'>) => {
    await addDoc(collection(db, COLLECTIONS.MEALS), { ...item, _order: Date.now() });
  };
  const updateMeal = async (id: string, updated: Partial<MealItem>) => {
    await updateDoc(doc(db, COLLECTIONS.MEALS, id), updated as Record<string, unknown>);
  };
  const deleteMeal = async (id: string) => {
    await deleteDoc(doc(db, COLLECTIONS.MEALS, id));
  };

  // CRUD: Nutrition Newsletters
  const addNutritionNewsletter = async (item: Omit<NutritionNewsletter, 'id'>) => {
    await addDoc(collection(db, COLLECTIONS.NUTRITION_NEWSLETTERS), { ...item, _order: Date.now() });
  };
  const updateNutritionNewsletter = async (id: string, updated: Partial<NutritionNewsletter>) => {
    await updateDoc(doc(db, COLLECTIONS.NUTRITION_NEWSLETTERS, id), updated as Record<string, unknown>);
  };
  const deleteNutritionNewsletter = async (id: string) => {
    await deleteDoc(doc(db, COLLECTIONS.NUTRITION_NEWSLETTERS, id));
  };

  // CRUD: Gallery
  const addGalleryItem = async (item: Omit<GalleryItem, 'id' | 'likeCount'>) => {
    await addDoc(collection(db, COLLECTIONS.GALLERY), { ...item, likeCount: 0, _order: Date.now() });
  };
  const updateGalleryItem = async (id: string, updated: Partial<GalleryItem>) => {
    await updateDoc(doc(db, COLLECTIONS.GALLERY, id), updated as Record<string, unknown>);
  };
  const deleteGalleryItem = async (id: string) => {
    await deleteDoc(doc(db, COLLECTIONS.GALLERY, id));
  };
  const likeGalleryItem = async (id: string) => {
    await updateDoc(doc(db, COLLECTIONS.GALLERY, id), { likeCount: increment(1) });
  };

  // CRUD: Events
  const addEvent = async (item: Omit<CalendarEvent, 'id'>) => {
    await addDoc(collection(db, COLLECTIONS.EVENTS), { ...item, _order: Date.now() });
  };
  const updateEvent = async (id: string, updated: Partial<CalendarEvent>) => {
    await updateDoc(doc(db, COLLECTIONS.EVENTS, id), updated as Record<string, unknown>);
  };
  const deleteEvent = async (id: string) => {
    await deleteDoc(doc(db, COLLECTIONS.EVENTS, id));
  };

  // CRUD: Institution & Intro (설정값은 문서 하나에 통째로 저장 — merge로 부분 갱신)
  const updateInstitution = async (data: Partial<InstitutionData>) => {
    await setDoc(SETTINGS_DOC.INSTITUTION, data, { merge: true });
  };

  const updateClasses = async (newClasses: InstitutionClass[], renameMap?: Record<string, string>) => {
    await setDoc(SETTINGS_DOC.INSTITUTION, { classes: newClasses }, { merge: true });

    // 반 이름이 변경된 경우, 이미 등록된 가정통신문/갤러리/행사의 targetClass 값도 함께 갱신
    if (renameMap && Object.keys(renameMap).length > 0) {
      const batch = writeBatch(db);
      newsletters.forEach(nl => {
        if (renameMap[nl.targetClass]) {
          batch.update(doc(db, COLLECTIONS.NEWSLETTERS, nl.id), { targetClass: renameMap[nl.targetClass] });
        }
      });
      gallery.forEach(g => {
        if (g.targetClass && renameMap[g.targetClass]) {
          batch.update(doc(db, COLLECTIONS.GALLERY, g.id), { targetClass: renameMap[g.targetClass] });
        }
      });
      events.forEach(e => {
        if (e.targetClass && renameMap[e.targetClass]) {
          batch.update(doc(db, COLLECTIONS.EVENTS, e.id), { targetClass: renameMap[e.targetClass] });
        }
      });
      await batch.commit();
    }
  };

  const updateIntroDetails = async (data: Partial<IntroDetailsData>) => {
    await setDoc(SETTINGS_DOC.INTRO, data, { merge: true });
  };

  const addTeacher = async (teacher: Omit<TeacherInfo, 'id'>) => {
    const newTeacher: TeacherInfo = { ...teacher, id: `t-${Date.now()}` };
    await setDoc(SETTINGS_DOC.INTRO, { teachers: [...introDetails.teachers, newTeacher] }, { merge: true });
  };

  const updateTeacher = async (id: string, updated: Partial<TeacherInfo>) => {
    const teachers = introDetails.teachers.map(t => (t.id === id ? { ...t, ...updated } : t));
    await setDoc(SETTINGS_DOC.INTRO, { teachers }, { merge: true });
  };

  const deleteTeacher = async (id: string) => {
    const teachers = introDetails.teachers.filter(t => t.id !== id);
    await setDoc(SETTINGS_DOC.INTRO, { teachers }, { merge: true });
  };

  const addFacility = async (facility: Omit<FacilityRoom, 'id'>) => {
    const newFac: FacilityRoom = { ...facility, id: `fac-${Date.now()}` };
    await setDoc(SETTINGS_DOC.INTRO, { facilities: [...introDetails.facilities, newFac] }, { merge: true });
  };

  const updateFacility = async (id: string, updated: Partial<FacilityRoom>) => {
    const facilities = introDetails.facilities.map(f => (f.id === id ? { ...f, ...updated } : f));
    await setDoc(SETTINGS_DOC.INTRO, { facilities }, { merge: true });
  };

  const deleteFacility = async (id: string) => {
    const facilities = introDetails.facilities.filter(f => f.id !== id);
    await setDoc(SETTINGS_DOC.INTRO, { facilities }, { merge: true });
  };

  return (
    <DataContext.Provider
      value={{
        notices,
        newsletters,
        meals,
        nutritionNewsletters,
        gallery,
        events,
        partners,
        institution,
        introDetails,

        isAdmin,
        isAdminDashboardOpen,
        isPasswordModalOpen,
        activeAdminTab,
        adminEditingItem,

        setIsAdminDashboardOpen,
        setIsPasswordModalOpen,
        setActiveAdminTab,
        setAdminEditingItem,
        openAdminWithTab,

        login,
        logout,
        changePassword,
        resetToDefaults,

        addNotice,
        updateNotice,
        deleteNotice,

        addNewsletter,
        updateNewsletter,
        deleteNewsletter,

        addMeal,
        updateMeal,
        deleteMeal,

        addNutritionNewsletter,
        updateNutritionNewsletter,
        deleteNutritionNewsletter,

        addGalleryItem,
        updateGalleryItem,
        deleteGalleryItem,
        likeGalleryItem,

        addEvent,
        updateEvent,
        deleteEvent,

        updateInstitution,
        updateClasses,
        updateIntroDetails,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        addFacility,
        updateFacility,
        deleteFacility,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
