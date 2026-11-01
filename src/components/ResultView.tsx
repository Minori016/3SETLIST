import React, { useState } from 'react';
import { RotateCcw, Share2, Sparkles, Check, Heart, Sun, Star, ExternalLink, BarChart3, ZoomIn, X } from 'lucide-react';
import { ElotLine } from '../data/rules.ts';
import { ELOT_RESULTS, OutfitItem } from '../data/results.ts';
import { QUESTIONS } from '../data/questions.ts';

interface ResultViewProps {
  resultLine: ElotLine;
  answersKey: string;
  customerName?: string;
  onRetake: () => void;
  onViewTracker: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({
  resultLine,
  answersKey,
  customerName,
  onRetake,
  onViewTracker,
}) => {
  const resultData = ELOT_RESULTS[resultLine];
  const outfit: OutfitItem = resultData.outfits[0];
  const [copied, setCopied] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleShare = async () => {
    const textToCopy = `Tôi đã làm khảo sát phong cách đồ bộ ELOT và kết quả là: ${resultData.fullName} (${resultData.slogan})! Khám phá set đồ tại: ${window.location.href}`;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (e) {
      // fallback
    }
  };

  const getLineIcon = () => {
    switch (resultLine) {
      case 'SOFT':
        return Heart;
      case 'DAILY':
        return Sun;
      case 'ORIGINAL':
        return Star;
    }
  };
  const LineIcon = getLineIcon();

  return (
    <div className="py-8 sm:py-12 max-w-4xl mx-auto px-4 sm:px-6">
      {/* Top Match Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#DADFD3] shadow-md mb-8 text-center relative overflow-hidden">
        {/* Decorative background glow */}
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ backgroundColor: resultData.colorTheme.accent }}
        />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-4 border"
            style={{
              backgroundColor: resultData.colorTheme.badgeBg,
              color: resultData.colorTheme.badgeText,
              borderColor: resultData.colorTheme.border,
            }}
          >
            <LineIcon className="w-4 h-4" />
            <span>
              {customerName ? `Dành Riêng Cho ${customerName}` : 'Dòng Phong Cách Hoàn Hảo Dành Cho Bạn'}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl text-[#1F1F1D] font-bold mb-3 tracking-tight">
            {resultData.fullName}
          </h1>

          <p className="font-serif text-lg sm:text-xl text-[#713D38] italic font-medium mb-4">
            "{resultData.slogan}"
          </p>

          <p className="text-sm sm:text-base text-[#492A27] max-w-2xl mx-auto leading-relaxed mb-6 font-normal">
            {resultData.description}
          </p>

          {/* Personality Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            {resultData.personalityKeywords.map((kw, i) => (
              <span
                key={i}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold"
                style={{
                  backgroundColor: resultData.colorTheme.pillBg,
                  color: resultData.colorTheme.badgeText,
                  border: `1px solid ${resultData.colorTheme.border}`,
                }}
              >
                #{kw}
              </span>
            ))}
          </div>

          {/* Answer Sequence Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-[#EBEEE8] text-[#505B3E] text-xs font-mono">
            <span>Chuỗi phản hồi:</span>
            <span className="font-bold tracking-widest text-[#1F1F1D]">{answersKey}</span>
          </div>
        </div>
      </div>

      {/* Suggested Outfit Showcase */}
      <div className="bg-[#FAF5F5] rounded-3xl p-6 sm:p-10 border border-[#EAD4D2] shadow-sm mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#819266]">
              Set Đồ Gợi Ý Cho Phong Cách Của Bạn
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#1F1F1D] font-bold mt-1">
              {outfit.name}
            </h2>
          </div>
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-[#EAD4D2] text-[#713D38] hidden sm:inline-block">
            {outfit.priceNote || 'Bộ sưu tập độc quyền'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Outfit Image */}
          <div className="md:col-span-5 relative group">
            <div
              onClick={() => setPreviewImage(outfit.imageUrl)}
              className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-white border border-[#DADFD3] shadow-sm cursor-zoom-in group"
            >
              <img
                src={outfit.imageUrl}
                alt={outfit.altText}
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-2 font-medium text-xs">
                <ZoomIn className="w-5 h-5" />
                <span>Xem ảnh lớn</span>
              </div>
            </div>
            <p className="text-[11px] text-[#713D38] text-center mt-2 italic">
              Ảnh set đồ đại diện dòng {resultData.fullName}
            </p>
          </div>

          {/* Outfit Details */}
          <div className="md:col-span-7 flex flex-col justify-between">
            <div>
              <p className="font-serif text-base sm:text-lg text-[#713D38] italic mb-3">
                "{outfit.tagline}"
              </p>

              <div className="mb-4">
                <span className="text-xs font-semibold text-[#819266] uppercase tracking-wider block mb-1">
                  Chất liệu
                </span>
                <p className="text-sm font-medium text-[#1F1F1D] bg-white px-3.5 py-2 rounded-xl border border-[#DADFD3] inline-block">
                  {outfit.material}
                </p>
              </div>

              <div className="mb-4">
                <span className="text-xs font-semibold text-[#819266] uppercase tracking-wider block mb-1">
                  Mô tả thiết kế
                </span>
                <p className="text-sm text-[#492A27] leading-relaxed">
                  {outfit.description}
                </p>
              </div>

              <div>
                <span className="text-xs font-semibold text-[#819266] uppercase tracking-wider block mb-2">
                  Điểm nhấn nổi bật
                </span>
                <ul className="space-y-2">
                  {outfit.highlights.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#1F1F1D]">
                      <div className="w-4 h-4 rounded-full bg-[#EBEEE8] text-[#819266] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-[#EAD4D2] flex flex-wrap gap-2 text-xs text-[#713D38]">
              <span className="font-medium">Triết lý may mặc:</span>
              <span>{resultData.stylingPhilosophy[0]}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Answers Summary Breakdown */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DADFD3] shadow-sm mb-8">
        <h3 className="font-serif text-xl font-bold text-[#1F1F1D] mb-4">
          Tổng Hợp Lựa Chọn Của Bạn
        </h3>
        <div className="space-y-3">
          {QUESTIONS.map((q, index) => {
            const answerLetter = answersKey[index];
            const chosenOption = q.options.find(o => o.key === answerLetter);
            return (
              <div key={q.id} className="p-3.5 rounded-2xl bg-[#FAF5F5] border border-[#EAD4D2]/60 flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-[#CE9893] text-[#1F1F1D] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {answerLetter}
                </span>
                <div className="flex-1 text-xs sm:text-sm">
                  <p className="font-medium text-[#1F1F1D]">{q.title}</p>
                  <p className="text-[#713D38] mt-0.5">{chosenOption?.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Footer Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={onRetake}
          className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-2xl border-2 border-[#819266] text-[#505B3E] hover:bg-[#EBEEE8] font-semibold text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Làm lại khảo sát</span>
        </button>

        <button
          onClick={handleShare}
          className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-2xl bg-[#CE9893] hover:bg-[#D5A6A2] text-[#1F1F1D] font-semibold text-sm sm:text-base shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-800" />
              <span>Đã sao chép link kết quả!</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4" />
              <span>Chia sẻ kết quả</span>
            </>
          )}
        </button>

        <button
          onClick={onViewTracker}
          className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-2xl bg-[#819266] hover:bg-[#687750] text-white font-semibold text-sm sm:text-base shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <BarChart3 className="w-4 h-4" />
          <span>Xem thống kê trực tiếp</span>
        </button>
      </div>

      {/* Lightbox Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-lg w-full bg-white rounded-3xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="aspect-[3/4] w-full">
              <img
                src={previewImage}
                alt={outfit.name}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="p-4 bg-[#FBF5EE] text-center border-t border-[#DADFD3]">
              <h4 className="font-serif font-bold text-lg text-[#1F1F1D]">{outfit.name}</h4>
              <p className="text-xs text-[#713D38] mt-1">{resultData.fullName} · {outfit.material}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
