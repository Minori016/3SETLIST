import React, { useState, useEffect, useCallback } from 'react';
import {
  RefreshCw,
  Users,
  Sparkles,
  Heart,
  Sun,
  Star,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import {
  fetchSurveyStats,
  SurveyStatsResponse,
  getGoogleSheetUrl,
} from '../services/sheetService.ts';
import { QUESTIONS } from '../data/questions.ts';
import { ELOT_RESULTS } from '../data/results.ts';

interface LiveTrackerViewProps {
  onTakeQuiz: () => void;
}

export const LiveTrackerView: React.FC<LiveTrackerViewProps> = ({
  onTakeQuiz,
}) => {
  const [stats, setStats] = useState<SurveyStatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const googleSheetUrl = getGoogleSheetUrl();

  const loadData = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsRefreshing(true);
    try {
      setError(null);
      const data = await fetchSurveyStats();
      setStats(data);
    } catch (err: any) {
      console.error(err);
      setError('Không thể kết nối đến máy chủ. Đang hiển thị bản lưu gần nhất.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Polling every 10 seconds
  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      loadData(true);
    }, 10000);
    return () => clearInterval(interval);
  }, [loadData]);

  const getDominantLine = () => {
    if (!stats) return 'ELOT SOFT';
    const { SOFT, DAILY, ORIGINAL } = stats.lines;
    if (SOFT >= DAILY && SOFT >= ORIGINAL) return 'ELOT SOFT';
    if (DAILY >= ORIGINAL) return 'ELOT DAILY';
    return 'ELOT ORIGINAL';
  };

  return (
    <div className="py-8 sm:py-12 max-w-5xl mx-auto px-4 sm:px-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#819266]">
              Bảng Theo Dõi Thời Gian Thực
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl text-[#1F1F1D] font-bold">
            Thống Kê Phong Cách ELOT
          </h1>
          <p className="text-xs sm:text-sm text-[#713D38] mt-1 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" />
            <span>Tự động cập nhật mỗi 10 giây · Lần cuối: {stats?.updatedAt || 'Đang tải...'}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => loadData()}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-[#EBEEE8] text-[#505B3E] text-xs sm:text-sm font-medium border border-[#DADFD3] shadow-sm transition-all cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Làm mới</span>
          </button>

          {googleSheetUrl && googleSheetUrl !== 'https://docs.google.com/spreadsheets' && (
            <a
              href={googleSheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#819266] hover:bg-[#687750] text-white text-xs sm:text-sm font-medium shadow-sm transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Mở Google Sheet</span>
            </a>
          )}
        </div>
      </div>

      {/* Live status banner */}
      <div className={`p-4 rounded-2xl mb-8 border flex items-center justify-between gap-4 ${
        stats?.isLive
          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
          : 'bg-[#F3E8E7]/60 border-[#EAD4D2] text-[#713D38]'
      }`}>
        <div className="flex items-center gap-3">
          {stats?.isLive ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-[#B96C65] shrink-0" />
          )}
          <div className="text-xs sm:text-sm">
            <span className="font-bold">
              {stats?.isLive
                ? 'Đang kết nối trực tiếp với Google Sheets qua Google Apps Script'
                : 'Đang kết nối hệ thống dữ liệu Google Sheets'}
            </span>
            <p className="text-[11px] opacity-80 mt-0.5">
              Dữ liệu được cập nhật tự động trực tiếp từ Google Sheet của bạn.
            </p>
          </div>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {/* Total Submissions */}
        <div className="bg-white rounded-3xl p-6 border border-[#DADFD3] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#EBEEE8] text-[#819266] flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs uppercase font-semibold text-[#819266]">
              Tổng Lượt Khảo Sát
            </p>
            <h3 className="font-serif text-3xl font-bold text-[#1F1F1D]">
              {isLoading ? '...' : (stats?.total || 0).toLocaleString('vi-VN')}
            </h3>
            <p className="text-[11px] text-[#713D38] mt-0.5">lượt hoàn thành</p>
          </div>
        </div>

        {/* Dominant Line */}
        <div className="bg-white rounded-3xl p-6 border border-[#DADFD3] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#F3E8E7] text-[#CE9893] flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6 text-[#B96C65]" />
          </div>
          <div>
            <p className="text-xs uppercase font-semibold text-[#B96C65]">
              Dòng Được Yêu Thích Nhất
            </p>
            <h3 className="font-serif text-2xl font-bold text-[#1F1F1D]">
              {isLoading ? '...' : getDominantLine()}
            </h3>
            <p className="text-[11px] text-[#713D38] mt-0.5">Dẫn đầu xu hướng tuần này</p>
          </div>
        </div>

        {/* Quick Quiz Action */}
        <div className="bg-[#FBF5EE] rounded-3xl p-6 border-2 border-dashed border-[#819266] flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-[#819266] uppercase">Bạn chưa làm thử?</p>
            <h4 className="font-serif font-bold text-base text-[#1F1F1D]">Khám phá gu của bạn</h4>
            <p className="text-[11px] text-[#713D38]">Chỉ mất 1 phút</p>
          </div>
          <button
            onClick={onTakeQuiz}
            className="px-4 py-2 rounded-xl bg-[#CE9893] hover:bg-[#D5A6A2] text-[#1F1F1D] text-xs font-bold transition-all shadow-sm shrink-0"
          >
            Làm ngay
          </button>
        </div>
      </div>

      {/* 3 Lines Segmented Distribution Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DADFD3] shadow-sm mb-8">
        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1F1F1D] mb-2">
          Tỷ Lệ Phân Bổ 3 Dòng Phong Cách
        </h3>
        <p className="text-xs sm:text-sm text-[#713D38] mb-6">
          Phần trăm người tham gia thuộc về từng dòng ELOT
        </p>

        {/* Segmented Bar */}
        <div className="w-full h-8 bg-[#EBEEE8] rounded-2xl overflow-hidden flex shadow-inner mb-6">
          <div
            style={{ width: `${stats?.percentages.SOFT || 33.3}%` }}
            className="bg-[#CE9893] h-full flex items-center justify-center text-xs font-bold text-[#1F1F1D] transition-all duration-500 overflow-hidden"
            title={`ELOT SOFT: ${stats?.percentages.SOFT}%`}
          >
            {(stats?.percentages.SOFT || 0) > 10 ? `SOFT ${stats?.percentages.SOFT}%` : ''}
          </div>
          <div
            style={{ width: `${stats?.percentages.DAILY || 33.3}%` }}
            className="bg-[#819266] h-full flex items-center justify-center text-xs font-bold text-white transition-all duration-500 overflow-hidden"
            title={`ELOT DAILY: ${stats?.percentages.DAILY}%`}
          >
            {(stats?.percentages.DAILY || 0) > 10 ? `DAILY ${stats?.percentages.DAILY}%` : ''}
          </div>
          <div
            style={{ width: `${stats?.percentages.ORIGINAL || 33.3}%` }}
            className="bg-[#57717B] h-full flex items-center justify-center text-xs font-bold text-white transition-all duration-500 overflow-hidden"
            title={`ELOT ORIGINAL: ${stats?.percentages.ORIGINAL}%`}
          >
            {(stats?.percentages.ORIGINAL || 0) > 10 ? `ORIGINAL ${stats?.percentages.ORIGINAL}%` : ''}
          </div>
        </div>

        {/* Line cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* SOFT */}
          <div className="p-4 rounded-2xl bg-[#FAF5F5] border border-[#EAD4D2] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="font-serif font-bold text-base text-[#713D38] flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-[#B96C65]" />
                ELOT SOFT
              </span>
              <span className="text-lg font-bold text-[#713D38]">
                {stats?.percentages.SOFT || 0}%
              </span>
            </div>
            <p className="text-xs text-[#713D38] mb-3">Dịu dàng – Nhẹ nhàng – Bình yên</p>
            <div className="text-xs text-[#492A27] font-medium pt-2 border-t border-[#EAD4D2]">
              {stats?.lines.SOFT || 0} lượt chọn
            </div>
          </div>

          {/* DAILY */}
          <div className="p-4 rounded-2xl bg-[#F5F6F3] border border-[#DADFD3] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="font-serif font-bold text-base text-[#3A422E] flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-[#819266]" />
                ELOT DAILY
              </span>
              <span className="text-lg font-bold text-[#3A422E]">
                {stats?.percentages.DAILY || 0}%
              </span>
            </div>
            <p className="text-xs text-[#3A422E] mb-3">Năng động – Thân thiện – Linh hoạt</p>
            <div className="text-xs text-[#25291E] font-medium pt-2 border-t border-[#DADFD3]">
              {stats?.lines.DAILY || 0} lượt chọn
            </div>
          </div>

          {/* ORIGINAL */}
          <div className="p-4 rounded-2xl bg-[#F3F5F7] border border-[#D2D9DE] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="font-serif font-bold text-base text-[#233238] flex items-center gap-1.5">
                <Star className="w-4 h-4 text-[#57717B]" />
                ELOT ORIGINAL
              </span>
              <span className="text-lg font-bold text-[#233238]">
                {stats?.percentages.ORIGINAL || 0}%
              </span>
            </div>
            <p className="text-xs text-[#233238] mb-3">Cá tính – Độc lập – Khác biệt</p>
            <div className="text-xs text-[#1F1F1D] font-medium pt-2 border-t border-[#D2D9DE]">
              {stats?.lines.ORIGINAL || 0} lượt chọn
            </div>
          </div>
        </div>
      </div>

      {/* Question Breakdown and Recent Entries Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        {/* Questions Distribution (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#DADFD3] shadow-sm">
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1F1F1D] mb-1">
            Phân Bố Đáp Án Từng Câu Hỏi
          </h3>
          <p className="text-xs sm:text-sm text-[#713D38] mb-6">
            Tỷ lệ lựa chọn các phương án A, B, C trong 5 câu hỏi
          </p>

          <div className="space-y-6">
            {QUESTIONS.map((q, idx) => {
              const qStat = stats?.questions[idx] || { question: q.id, A: 0, B: 0, C: 0 };
              const qTotal = (qStat.A + qStat.B + qStat.C) || 1;
              const aPct = Math.round((qStat.A / qTotal) * 100);
              const bPct = Math.round((qStat.B / qTotal) * 100);
              const cPct = Math.round((qStat.C / qTotal) * 100);

              return (
                <div key={q.id} className="pb-4 border-b border-[#EBEEE8] last:border-0 last:pb-0">
                  <p className="text-xs sm:text-sm font-semibold text-[#1F1F1D] mb-2">
                    Câu {q.id}: {q.title}
                  </p>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {/* A */}
                    <div className="bg-[#FAF5F5] p-2 rounded-xl border border-[#EAD4D2]">
                      <div className="flex justify-between font-bold text-[#713D38] mb-1">
                        <span>Đáp án A</span>
                        <span>{aPct}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#EAD4D2] rounded-full overflow-hidden">
                        <div style={{ width: `${aPct}%` }} className="h-full bg-[#CE9893]" />
                      </div>
                    </div>

                    {/* B */}
                    <div className="bg-[#F5F6F3] p-2 rounded-xl border border-[#DADFD3]">
                      <div className="flex justify-between font-bold text-[#3A422E] mb-1">
                        <span>Đáp án B</span>
                        <span>{bPct}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#DADFD3] rounded-full overflow-hidden">
                        <div style={{ width: `${bPct}%` }} className="h-full bg-[#819266]" />
                      </div>
                    </div>

                    {/* C */}
                    <div className="bg-[#F3F5F7] p-2 rounded-xl border border-[#D2D9DE]">
                      <div className="flex justify-between font-bold text-[#233238] mb-1">
                        <span>Đáp án C</span>
                        <span>{cPct}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#D2D9DE] rounded-full overflow-hidden">
                        <div style={{ width: `${cPct}%` }} className="h-full bg-[#57717B]" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Submissions Feed (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-[#DADFD3] shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#1F1F1D]">
                Lượt Khảo Sát Gần Nhất
              </h3>
              <p className="text-xs text-[#713D38] mt-0.5">10 phản hồi gần đây nhất</p>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </div>

          <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[460px] pr-1">
            {stats?.recent && stats.recent.length > 0 ? (
              stats.recent.map((rec, i) => {
                const badgeColor =
                  rec.result === 'SOFT'
                    ? 'bg-[#F3E8E7] text-[#713D38] border-[#EAD4D2]'
                    : rec.result === 'DAILY'
                    ? 'bg-[#EBEEE8] text-[#3A422E] border-[#DADFD3]'
                    : 'bg-[#E4EAED] text-[#233238] border-[#D2D9DE]';

                return (
                  <div
                    key={i}
                    className="p-3 rounded-2xl bg-[#FBF5EE] border border-[#DADFD3] flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] border ${badgeColor}`}>
                          ELOT {rec.result}
                        </span>
                        <span className="font-mono text-[11px] font-semibold text-[#505B3E]">
                          [{rec.key}]
                        </span>
                      </div>
                      <p className="text-[11px] text-[#713D38] mt-1">{rec.time}</p>
                    </div>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      Đã ghi nhận
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-10 text-xs text-[#713D38]">
                Chưa có lượt khảo sát nào. Hãy là người đầu tiên!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
