import React, { createContext, useContext, useState, useEffect } from 'react';
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
  AdminTab,
} from '../types';

// Original default JSON mocks
import defaultNotices from '../data/notices.json';
import defaultNewsletters from '../data/newsletters.json';
import defaultMeals from '../data/meals.json';
import defaultGallery from '../data/gallery.json';
import defaultEvents from '../data/events.json';
import defaultPartners from '../data/partners.json';
import defaultInstitution from '../data/institution.json';
import defaultIntroDetails from '../data/introDetails.json';

const STORAGE_KEYS = {
  NOTICES: 'yesarang_notices_v1',
  NEWSLETTERS: 'yesarang_newsletters_v1',
  MEALS: 'yesarang_meals_v1',
  GALLERY: 'yesarang_gallery_v1',
  EVENTS: 'yesarang_events_v1',
  INSTITUTION: 'yesarang_institution_v1',
  INTRO_DETAILS: 'yesarang_intro_details_v1',
  IS_ADMIN: 'yesarang_is_admin_v1',
  ADMIN_PW: 'yesarang_admin_pw_v1',
};

const DEFAULT_ADMIN_PW = 'admin1234';

interface DataContextType {
  // Data states
  notices: NoticeItem[];
  newsletters: NewsletterItem[];
  meals: MealItem[];
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

  // Auth methods
  login: (password: string) => { success: boolean; message?: string };
  logout: () => void;
  changePassword: (currentPw: string, newPw: string) => { success: boolean; message?: string };

  // Reset to original JSON
  resetToDefaults: () => void;

  // CRUD Notices
  addNotice: (item: Omit<NoticeItem, 'id' | 'views'>) => NoticeItem;
  updateNotice: (id: string, item: Partial<NoticeItem>) => void;
  deleteNotice: (id: string) => void;

  // CRUD Newsletters
  addNewsletter: (item: Omit<NewsletterItem, 'id' | 'views'>) => NewsletterItem;
  updateNewsletter: (id: string, item: Partial<NewsletterItem>) => void;
  deleteNewsletter: (id: string) => void;

  // CRUD Meals
  addMeal: (item: Omit<MealItem, 'id'>) => MealItem;
  updateMeal: (id: string, item: Partial<MealItem>) => void;
  deleteMeal: (id: string) => void;

  // CRUD Gallery
  addGalleryItem: (item: Omit<GalleryItem, 'id' | 'likeCount'>) => GalleryItem;
  updateGalleryItem: (id: string, item: Partial<GalleryItem>) => void;
  deleteGalleryItem: (id: string) => void;
  likeGalleryItem: (id: string) => void;

  // CRUD Events
  addEvent: (item: Omit<CalendarEvent, 'id'>) => CalendarEvent;
  updateEvent: (id: string, item: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;

  // CRUD Institution & Intro
  updateInstitution: (data: Partial<InstitutionData>) => void;
  updateIntroDetails: (data: Partial<IntroDetailsData>) => void;
  addTeacher: (teacher: Omit<TeacherInfo, 'id'>) => void;
  updateTeacher: (id: string, teacher: Partial<TeacherInfo>) => void;
  deleteTeacher: (id: string) => void;
  addFacility: (facility: Omit<FacilityRoom, 'id'>) => void;
  updateFacility: (id: string, facility: Partial<FacilityRoom>) => void;
  deleteFacility: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Helper to load from localStorage with fallback
  const loadInitial = <T,>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        return JSON.parse(item);
      }
    } catch (e) {
      console.warn(`Failed to parse localStorage for ${key}`, e);
    }
    return fallback;
  };

  // States initialized from localStorage or default JSON files
  const [notices, setNotices] = useState<NoticeItem[]>(() =>
    loadInitial(STORAGE_KEYS.NOTICES, defaultNotices as NoticeItem[])
  );
  const [newsletters, setNewsletters] = useState<NewsletterItem[]>(() =>
    loadInitial(STORAGE_KEYS.NEWSLETTERS, defaultNewsletters as NewsletterItem[])
  );
  const [meals, setMeals] = useState<MealItem[]>(() =>
    loadInitial(STORAGE_KEYS.MEALS, defaultMeals as MealItem[])
  );
  const [gallery, setGallery] = useState<GalleryItem[]>(() =>
    loadInitial(STORAGE_KEYS.GALLERY, defaultGallery as GalleryItem[])
  );
  const [events, setEvents] = useState<CalendarEvent[]>(() =>
    loadInitial(STORAGE_KEYS.EVENTS, defaultEvents as CalendarEvent[])
  );
  const [partners] = useState<PartnerOrg[]>(defaultPartners as PartnerOrg[]);
  const [institution, setInstitution] = useState<InstitutionData>(() =>
    loadInitial(STORAGE_KEYS.INSTITUTION, defaultInstitution as unknown as InstitutionData)
  );
  const [introDetails, setIntroDetails] = useState<IntroDetailsData>(() =>
    loadInitial(STORAGE_KEYS.INTRO_DETAILS, defaultIntroDetails as unknown as IntroDetailsData)
  );

  // Admin Auth States
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.IS_ADMIN) === 'true';
    } catch {
      return false;
    }
  });
  const [adminPassword, setAdminPassword] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ADMIN_PW) || DEFAULT_ADMIN_PW;
    } catch {
      return DEFAULT_ADMIN_PW;
    }
  });

  // Admin Modals & Navigation state
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>('notices');
  const [adminEditingItem, setAdminEditingItem] = useState<any | null>(null);

  // Auto-sync data changes to localStorage
  const saveToStorage = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error(`Error saving to localStorage for ${key}`, e);
    }
  };

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.NOTICES, notices);
  }, [notices]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.NEWSLETTERS, newsletters);
  }, [newsletters]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.MEALS, meals);
  }, [meals]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.GALLERY, gallery);
  }, [gallery]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.EVENTS, events);
  }, [events]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.INSTITUTION, institution);
  }, [institution]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.INTRO_DETAILS, introDetails);
  }, [introDetails]);

  // Auth methods
  const login = (password: string) => {
    if (password === adminPassword) {
      setIsAdmin(true);
      try {
        localStorage.setItem(STORAGE_KEYS.IS_ADMIN, 'true');
      } catch (e) {
        console.error(e);
      }
      return { success: true };
    }
    return { success: false, message: '비밀번호가 올바르지 않습니다.' };
  };

  const logout = () => {
    setIsAdmin(false);
    setIsAdminDashboardOpen(false);
    setAdminEditingItem(null);
    try {
      localStorage.removeItem(STORAGE_KEYS.IS_ADMIN);
    } catch (e) {
      console.error(e);
    }
  };

  const changePassword = (currentPw: string, newPw: string) => {
    if (currentPw !== adminPassword) {
      return { success: false, message: '현재 비밀번호가 일치하지 않습니다.' };
    }
    if (!newPw || newPw.trim().length < 4) {
      return { success: false, message: '새 비밀번호는 4자리 이상 입력해 주세요.' };
    }
    setAdminPassword(newPw);
    try {
      localStorage.setItem(STORAGE_KEYS.ADMIN_PW, newPw);
    } catch (e) {
      console.error(e);
    }
    return { success: true };
  };

  const resetToDefaults = () => {
    setNotices(defaultNotices as NoticeItem[]);
    setNewsletters(defaultNewsletters as NewsletterItem[]);
    setMeals(defaultMeals as MealItem[]);
    setGallery(defaultGallery as GalleryItem[]);
    setEvents(defaultEvents as CalendarEvent[]);
    setInstitution(defaultInstitution as unknown as InstitutionData);
    setIntroDetails(defaultIntroDetails as unknown as IntroDetailsData);

    try {
      localStorage.removeItem(STORAGE_KEYS.NOTICES);
      localStorage.removeItem(STORAGE_KEYS.NEWSLETTERS);
      localStorage.removeItem(STORAGE_KEYS.MEALS);
      localStorage.removeItem(STORAGE_KEYS.GALLERY);
      localStorage.removeItem(STORAGE_KEYS.EVENTS);
      localStorage.removeItem(STORAGE_KEYS.INSTITUTION);
      localStorage.removeItem(STORAGE_KEYS.INTRO_DETAILS);
    } catch (e) {
      console.error(e);
    }
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
  const addNotice = (item: Omit<NoticeItem, 'id' | 'views'>): NoticeItem => {
    const newNotice: NoticeItem = {
      ...item,
      id: `notice-${Date.now()}`,
      views: 1,
    };
    setNotices(prev => [newNotice, ...prev]);
    return newNotice;
  };

  const updateNotice = (id: string, updated: Partial<NoticeItem>) => {
    setNotices(prev => prev.map(n => (n.id === id ? { ...n, ...updated } : n)));
  };

  const deleteNotice = (id: string) => {
    setNotices(prev => prev.filter(n => n.id !== id));
  };

  // CRUD: Newsletters
  const addNewsletter = (item: Omit<NewsletterItem, 'id' | 'views'>): NewsletterItem => {
    const newNewsletter: NewsletterItem = {
      ...item,
      id: `nl-${Date.now()}`,
      views: 1,
    };
    setNewsletters(prev => [newNewsletter, ...prev]);
    return newNewsletter;
  };

  const updateNewsletter = (id: string, updated: Partial<NewsletterItem>) => {
    setNewsletters(prev => prev.map(nl => (nl.id === id ? { ...nl, ...updated } : nl)));
  };

  const deleteNewsletter = (id: string) => {
    setNewsletters(prev => prev.filter(nl => nl.id !== id));
  };

  // CRUD: Meals
  const addMeal = (item: Omit<MealItem, 'id'>): MealItem => {
    const newMeal: MealItem = {
      ...item,
      id: `meal-${Date.now()}`,
    };
    setMeals(prev => [newMeal, ...prev]);
    return newMeal;
  };

  const updateMeal = (id: string, updated: Partial<MealItem>) => {
    setMeals(prev => prev.map(m => (m.id === id ? { ...m, ...updated } : m)));
  };

  const deleteMeal = (id: string) => {
    setMeals(prev => prev.filter(m => m.id !== id));
  };

  // CRUD: Gallery
  const addGalleryItem = (item: Omit<GalleryItem, 'id' | 'likeCount'>): GalleryItem => {
    const newGalleryItem: GalleryItem = {
      ...item,
      id: `gal-${Date.now()}`,
      likeCount: 0,
    };
    setGallery(prev => [newGalleryItem, ...prev]);
    return newGalleryItem;
  };

  const updateGalleryItem = (id: string, updated: Partial<GalleryItem>) => {
    setGallery(prev => prev.map(g => (g.id === id ? { ...g, ...updated } : g)));
  };

  const deleteGalleryItem = (id: string) => {
    setGallery(prev => prev.filter(g => g.id !== id));
  };

  const likeGalleryItem = (id: string) => {
    setGallery(prev =>
      prev.map(g => (g.id === id ? { ...g, likeCount: g.likeCount + 1 } : g))
    );
  };

  // CRUD: Events
  const addEvent = (item: Omit<CalendarEvent, 'id'>): CalendarEvent => {
    const newEvent: CalendarEvent = {
      ...item,
      id: `event-${Date.now()}`,
    };
    setEvents(prev => [...prev, newEvent]);
    return newEvent;
  };

  const updateEvent = (id: string, updated: Partial<CalendarEvent>) => {
    setEvents(prev => prev.map(e => (e.id === id ? { ...e, ...updated } : e)));
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  // CRUD: Institution & Intro
  const updateInstitution = (data: Partial<InstitutionData>) => {
    setInstitution(prev => ({ ...prev, ...data }));
  };

  const updateIntroDetails = (data: Partial<IntroDetailsData>) => {
    setIntroDetails(prev => ({ ...prev, ...data }));
  };

  const addTeacher = (teacher: Omit<TeacherInfo, 'id'>) => {
    const newTeacher: TeacherInfo = {
      ...teacher,
      id: `t-${Date.now()}`,
    };
    setIntroDetails(prev => ({
      ...prev,
      teachers: [...prev.teachers, newTeacher],
    }));
  };

  const updateTeacher = (id: string, updated: Partial<TeacherInfo>) => {
    setIntroDetails(prev => ({
      ...prev,
      teachers: prev.teachers.map(t => (t.id === id ? { ...t, ...updated } : t)),
    }));
  };

  const deleteTeacher = (id: string) => {
    setIntroDetails(prev => ({
      ...prev,
      teachers: prev.teachers.filter(t => t.id !== id),
    }));
  };

  const addFacility = (facility: Omit<FacilityRoom, 'id'>) => {
    const newFac: FacilityRoom = {
      ...facility,
      id: `fac-${Date.now()}`,
    };
    setIntroDetails(prev => ({
      ...prev,
      facilities: [...prev.facilities, newFac],
    }));
  };

  const updateFacility = (id: string, updated: Partial<FacilityRoom>) => {
    setIntroDetails(prev => ({
      ...prev,
      facilities: prev.facilities.map(f => (f.id === id ? { ...f, ...updated } : f)),
    }));
  };

  const deleteFacility = (id: string) => {
    setIntroDetails(prev => ({
      ...prev,
      facilities: prev.facilities.filter(f => f.id !== id),
    }));
  };

  return (
    <DataContext.Provider
      value={{
        notices,
        newsletters,
        meals,
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

        addGalleryItem,
        updateGalleryItem,
        deleteGalleryItem,
        likeGalleryItem,

        addEvent,
        updateEvent,
        deleteEvent,

        updateInstitution,
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
