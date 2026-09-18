import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Camera, Heart, Calendar } from 'lucide-react';
import { GalleryItem } from '../types';

interface GalleryWidgetProps {
  gallery: GalleryItem[];
  onSelectGalleryItem?: (item: GalleryItem) => void;
}

export const GalleryWidget: React.FC<GalleryWidgetProps> = ({ gallery, onSelectGalleryItem }) => {
  const displayItems = gallery.slice(0, 6);

  return (
    <section className="py-10 sm:py-14 bg-stone-50/70 border-t border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-8">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
              <Camera className="w-3.5 h-3.5" />
              <span>포토 갤러리</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              예사랑 이야기 & 활동 갤러리
            </h2>
            <p className="text-sm text-stone-500 mt-1">
              우리 아이들의 행복한 순간과 정성 가득한 급식 이야기를 사진으로 전합니다.
            </p>
          </div>

          {/* Green "+더보기" Button */}
          <Link
            to="/events/gallery"
            className="inline-flex items-center px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xs hover:shadow-md transition-all active:scale-95 group"
          >
            <span>갤러리 더보기</span>
            <Plus className="w-4 h-4 ml-1.5 group-hover:rotate-90 transition-transform" />
          </Link>
        </div>

        {/* 3-Column Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {displayItems.map(item => (
            <div
              key={item.id}
              onClick={() => onSelectGalleryItem && onSelectGalleryItem(item)}
              className="group relative rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white border border-stone-200/70 cursor-pointer flex flex-col aspect-4/3"
            >
              {/* Image */}
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                loading="lazy"
              />

              {/* Category Pill Tag (top-left) */}
              <div className="absolute top-3.5 left-3.5 z-10">
                <span className="px-2.5 py-1 rounded-full text-xs font-black shadow-xs backdrop-blur-xs bg-white/90 text-stone-800">
                  {item.category}
                </span>
              </div>

              {/* Like / Heart (top-right) */}
              <div className="absolute top-3.5 right-3.5 z-10">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-black/40 text-white backdrop-blur-xs">
                  <Heart className="w-3 h-3 text-rose-400 fill-rose-400 mr-1" />
                  {item.likeCount}
                </span>
              </div>

              {/* Gradient Overlay Caption at Bottom with Date and Title */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 sm:p-5 flex flex-col justify-end text-white transition-opacity">
                <div className="flex items-center space-x-2 text-stone-300 text-xs font-medium mb-1">
                  <Calendar className="w-3 h-3 text-amber-400" />
                  <span>{item.date}</span>
                  {item.targetClass && (
                    <>
                      <span>·</span>
                      <span className="text-emerald-300">{item.targetClass}</span>
                    </>
                  )}
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1 leading-snug">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
