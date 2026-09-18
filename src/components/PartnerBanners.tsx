import React from 'react';
import { ExternalLink, Building2 } from 'lucide-react';
import { PartnerOrg } from '../types';

interface PartnerBannersProps {
  partners: PartnerOrg[];
}

export const PartnerBanners: React.FC<PartnerBannersProps> = ({ partners }) => {
  return (
    <section className="py-8 bg-white border-t border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
          <div className="flex items-center space-x-2 text-stone-600 text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-4 h-4 text-[#F0935C]" />
            <span>관련 유관기관 및 교육협력 사이트</span>
          </div>
          <span className="text-xs text-stone-400">클릭 시 해당 기관 웹사이트로 이동합니다.</span>
        </div>

        {/* Partner badges grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {partners.map(p => (
            <a
              key={p.id}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-stone-50 hover:bg-amber-50/80 border border-stone-200/80 hover:border-amber-300 transition-all text-center group"
              title={`${p.name} 웹사이트 열기`}
            >
              <span className="text-[11px] font-bold text-stone-700 group-hover:text-amber-800 line-clamp-1">
                {p.shortName}
              </span>
              <span className="text-[10px] text-stone-400 mt-0.5 flex items-center group-hover:text-[#F0935C]">
                {p.category}
                <ExternalLink className="w-2.5 h-2.5 ml-0.5 opacity-60" />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
