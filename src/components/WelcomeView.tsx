import React from 'react';
import { ArrowRight, Clock, ShieldCheck, Sparkles, Heart, Sun, Star } from 'lucide-react';
import { ELOT_RESULTS } from '../data/results.ts';

interface WelcomeViewProps {
  onStart: () => void;
  onViewTracker: () => void;
}

export const WelcomeView: React.FC<WelcomeViewProps> = ({ onStart, onViewTracker }) => {
  return (
    <div className="py-8 sm:py-14 max-w-5xl mx-auto px-4 sm:px-6">

      {/* Main Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#1F1F1D] font-bold tracking-tight leading-[1.15] mb-5">
          Khám Phá Phong Cách Đồ Bộ Dành Riêng Cho Bạn
        </h1>
        <div className="text-base sm:text-lg text-[#492A27]/90 leading-relaxed max-w-2xl mx-auto font-normal space-y-3">
          <p>
            Ở nhà là lúc bạn được là chính mình, tận hưởng sự thoải mái và lựa chọn phong cách yêu thích. Với ELOT, mỗi bộ đồ tole không chỉ mang đến cảm giác dễ chịu mà còn giúp bạn thể hiện cá tính theo cách riêng.
          </p>
          <p>
            Bạn yêu thích phong cách nào? Hãy dành 1 phút trả lời 5 câu hỏi để ELOT giúp bạn tìm ra dòng đồ bộ tole phù hợp với sở thích và nhịp sống của mình nhé!
          </p>
        </div>

        {/* CTA Button */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStart}
            className="w-full sm:w-auto min-h-[52px] px-8 py-3.5 rounded-2xl bg-[#CE9893] hover:bg-[#D5A6A2] active:bg-[#B96C65] text-[#1F1F1D] font-semibold text-base sm:text-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-3 cursor-pointer"
          >
            <span>Bắt đầu khảo sát ngay</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={onViewTracker}
            className="w-full sm:w-auto min-h-[52px] px-6 py-3.5 rounded-2xl bg-white/70 hover:bg-white text-[#505B3E] font-medium text-sm sm:text-base border border-[#DADFD3] shadow-sm transition-all"
          >
            Xem kết quả trực tiếp của mọi người
          </button>
        </div>

        {/* Reassurance pills */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-[#713D38]">
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#819266]" />
            Chỉ mất ~1 phút
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#819266]" />
            Tư vấn cá nhân hóa theo phong cách riêng
          </span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#819266]" />
            Gợi ý set đồ độc quyền
          </span>
        </div>
      </div>

      {/* 3 Line Preview Cards */}
      <div className="mt-12 sm:mt-16">
        <div className="text-center mb-8">
          <h2 className="font-serif text-2xl sm:text-3xl text-[#1F1F1D] font-bold">
            Ba Dòng Cảm Hứng Đặc Trưng Của ELOT
          </h2>
          <p className="text-sm text-[#713D38] mt-1.5">
            Mỗi thiết kế được chăm chút từ chất liệu đến đường may để đồng hành cùng bạn
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* ELOT SOFT */}
          <div className="bg-[#FAF5F5] rounded-3xl p-5 border border-[#EAD4D2] shadow-sm hover:shadow-md transition-all flex flex-col group">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4 bg-[#F3E8E7]">
              <img
                src={ELOT_RESULTS.SOFT.outfits[0].imageUrl}
                alt={ELOT_RESULTS.SOFT.fullName}
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#FAF5F5]/90 backdrop-blur-sm text-[#713D38] text-xs font-semibold flex items-center gap-1">
                <Heart className="w-3 h-3 text-[#B96C65]" />
                {ELOT_RESULTS.SOFT.fullName}
              </span>
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#713D38] mb-1">
                  ELOT SOFT
                </h3>
                <p className="text-xs font-medium text-[#B96C65] uppercase tracking-wider mb-2">
                  {ELOT_RESULTS.SOFT.slogan}
                </p>
                <p className="text-sm text-[#492A27] line-clamp-3 leading-relaxed">
                  {ELOT_RESULTS.SOFT.description}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#EAD4D2] text-xs text-[#713D38]">
                <strong>Set tiêu biểu:</strong> {ELOT_RESULTS.SOFT.outfits[0].name}
              </div>
            </div>
          </div>

          {/* ELOT DAILY */}
          <div className="bg-[#F5F6F3] rounded-3xl p-5 border border-[#DADFD3] shadow-sm hover:shadow-md transition-all flex flex-col group">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4 bg-[#EBEEE8]">
              <img
                src={ELOT_RESULTS.DAILY.outfits[0].imageUrl}
                alt={ELOT_RESULTS.DAILY.fullName}
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#F5F6F3]/90 backdrop-blur-sm text-[#3A422E] text-xs font-semibold flex items-center gap-1">
                <Sun className="w-3 h-3 text-[#819266]" />
                {ELOT_RESULTS.DAILY.fullName}
              </span>
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#3A422E] mb-1">
                  ELOT DAILY
                </h3>
                <p className="text-xs font-medium text-[#687750] uppercase tracking-wider mb-2">
                  {ELOT_RESULTS.DAILY.slogan}
                </p>
                <p className="text-sm text-[#25291E] line-clamp-3 leading-relaxed">
                  {ELOT_RESULTS.DAILY.description}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#DADFD3] text-xs text-[#3A422E]">
                <strong>Set tiêu biểu:</strong> {ELOT_RESULTS.DAILY.outfits[0].name}
              </div>
            </div>
          </div>

          {/* ELOT ORIGINAL */}
          <div className="bg-[#F3F5F7] rounded-3xl p-5 border border-[#D2D9DE] shadow-sm hover:shadow-md transition-all flex flex-col group">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4 bg-[#E4EAED]">
              <img
                src={ELOT_RESULTS.ORIGINAL.outfits[0].imageUrl}
                alt={ELOT_RESULTS.ORIGINAL.fullName}
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#F3F5F7]/90 backdrop-blur-sm text-[#233238] text-xs font-semibold flex items-center gap-1">
                <Star className="w-3 h-3 text-[#57717B]" />
                {ELOT_RESULTS.ORIGINAL.fullName}
              </span>
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#233238] mb-1">
                  ELOT ORIGINAL
                </h3>
                <p className="text-xs font-medium text-[#57717B] uppercase tracking-wider mb-2">
                  {ELOT_RESULTS.ORIGINAL.slogan}
                </p>
                <p className="text-sm text-[#1F1F1D] line-clamp-3 leading-relaxed">
                  {ELOT_RESULTS.ORIGINAL.description}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#D2D9DE] text-xs text-[#233238]">
                <strong>Set tiêu biểu:</strong> {ELOT_RESULTS.ORIGINAL.outfits[0].name}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
