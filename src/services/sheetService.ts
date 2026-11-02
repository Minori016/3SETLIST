/**
 * Service kết nối và đồng bộ với Google Sheets qua Google Apps Script
 */

import { ElotLine } from '../data/rules.ts';

export interface SurveySubmissionPayload {
  sessionId: string;
  customerName: string;
  customerEmail: string;
  answersKey: string; // ví dụ "ABACA"
  result: ElotLine;
}

export interface QuestionStat {
  question: number;
  A: number;
  B: number;
  C: number;
}

export interface RecentSubmission {
  time: string;
  result: ElotLine;
  key: string;
}

export interface SurveyStatsResponse {
  total: number;
  lines: {
    SOFT: number;
    DAILY: number;
    ORIGINAL: number;
  };
  percentages: {
    SOFT: number;
    DAILY: number;
    ORIGINAL: number;
  };
  questions: QuestionStat[];
  recent: RecentSubmission[];
  updatedAt: string;
  isLive: boolean; // true nếu lấy từ Apps Script thật, false nếu chế độ demo/local
}

const STORAGE_KEY_LOCAL_SUBMISSIONS = 'elot_local_submissions_v1';

// URL Google Apps Script cố định đã triển khai
export const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyyb-5YjZWW1SNVuPbZvk6RcCL40tT5n2z8VvsuIlYrNGRK2hAKSN_PNFFSUTtTNeip3A/exec';
export const GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/17zDt5sktSdJjcGFbl9rByqP9oTwp8HTH6qSV46iz6PM/edit?gid=0#gid=0';

export function getAppsScriptUrl(): string {
  return (import.meta.env.VITE_APPS_SCRIPT_URL || APPS_SCRIPT_URL).trim();
}

export function getGoogleSheetUrl(): string {
  return (import.meta.env.VITE_GOOGLE_SHEET_URL || GOOGLE_SHEET_URL).trim();
}

/**
 * Gửi câu trả lời khảo sát lên Google Sheets
 * Sử dụng POST text/plain no-cors trực tiếp tới doPost của Google Apps Script
 */
export async function submitSurveyResponse(payload: SurveySubmissionPayload): Promise<{ success: boolean; isLive: boolean }> {
  // Lưu cục bộ ngay lập tức để cập nhật tracker tại chỗ
  saveLocalSubmission(payload);

  const url = getAppsScriptUrl();
  const isRealUrl = url.startsWith('https://script.google.com');

  if (!isRealUrl) {
    // Chưa có URL thật -> Đã lưu local thành công
    return { success: true, isLive: false };
  }

  const postData = {
    customerName: payload.customerName || 'Ẩn danh',
    customerEmail: payload.customerEmail || '',
    answersKey: payload.answersKey,
    result: payload.result,
    sessionId: payload.sessionId,
  };

  try {
    // 1. Gửi trực tiếp bằng POST (doPost của Google Apps Script)
    await fetch(url, {
      method: 'POST',
      body: JSON.stringify(postData),
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      mode: 'no-cors',
    });
    return { success: true, isLive: true };
  } catch (err) {
    console.warn('Lỗi khi gửi kết quả bằng POST fetch, thử tiếp bằng sendBeacon:', err);
  }

  // 2. Dự phòng bằng navigator.sendBeacon
  try {
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(postData)], { type: 'text/plain;charset=utf-8' });
      const sent = navigator.sendBeacon(url, blob);
      if (sent) return { success: true, isLive: true };
    }
  } catch (beaconErr) {
    console.warn('sendBeacon cũng không thành công:', beaconErr);
  }

  return { success: true, isLive: false };
}

/**
 * Lấy số liệu thống kê thời gian thực
 */
export async function fetchSurveyStats(): Promise<SurveyStatsResponse> {
  const url = getAppsScriptUrl();
  const isRealUrl = url.startsWith('https://script.google.com');

  if (isRealUrl) {
    try {
      const targetUrl = url.includes('?') ? `${url}&action=stats` : `${url}?action=stats`;
      const res = await fetch(targetUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.success) {
          return {
            total: data.total || 0,
            lines: data.lines || { SOFT: 0, DAILY: 0, ORIGINAL: 0 },
            percentages: data.percentages || { SOFT: 0, DAILY: 0, ORIGINAL: 0 },
            questions: data.questions || [],
            recent: (data.recent || []).map((r: any) => ({
              time: r.time,
              result: r.result as ElotLine,
              key: r.key,
            })),
            updatedAt: data.updatedAt || new Date().toLocaleTimeString('vi-VN'),
            isLive: true,
          };
        }
      }
    } catch (err) {
      console.warn('Không thể lấy stats trực tiếp từ Apps Script, chuyển sang hiển thị dữ liệu cục bộ:', err);
    }
  }

  // Chế độ mô phỏng kết hợp các lượt làm cục bộ
  return getLocalStatsFallback();
}

/**
 * Lưu lượt gửi vào localStorage
 */
function saveLocalSubmission(payload: SurveySubmissionPayload) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LOCAL_SUBMISSIONS);
    const list: Array<SurveySubmissionPayload & { timestamp: number }> = raw ? JSON.parse(raw) : [];
    list.unshift({
      ...payload,
      timestamp: Date.now(),
    });
    // Giữ tối đa 50 lượt gần nhất
    if (list.length > 50) list.pop();
    localStorage.setItem(STORAGE_KEY_LOCAL_SUBMISSIONS, JSON.stringify(list));
  } catch (e) {
    console.error('Không thể ghi localStorage:', e);
  }
}

/**
 * Tạo dữ liệu thống kê mẫu phong phú để người dùng trải nghiệm ngay
 */
function getLocalStatsFallback(): SurveyStatsResponse {
  let localSubs: Array<SurveySubmissionPayload & { timestamp: number }> = [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LOCAL_SUBMISSIONS);
    if (raw) localSubs = JSON.parse(raw);
  } catch (e) {
    // ignore
  }

  // Dữ liệu ban đầu
  const baseTotal = 68;
  const baseLines = { SOFT: 27, DAILY: 23, ORIGINAL: 18 };
  
  // Cộng dồn local
  let soft = baseLines.SOFT;
  let daily = baseLines.DAILY;
  let original = baseLines.ORIGINAL;

  localSubs.forEach(item => {
    if (item.result === 'SOFT') soft++;
    else if (item.result === 'DAILY') daily++;
    else if (item.result === 'ORIGINAL') original++;
  });

  const total = soft + daily + original;

  const baseQuestions: QuestionStat[] = [
    { question: 1, A: Math.round(total * 0.42), B: Math.round(total * 0.35), C: Math.round(total * 0.23) },
    { question: 2, A: Math.round(total * 0.38), B: Math.round(total * 0.36), C: Math.round(total * 0.26) },
    { question: 3, A: Math.round(total * 0.45), B: Math.round(total * 0.31), C: Math.round(total * 0.24) },
    { question: 4, A: Math.round(total * 0.40), B: Math.round(total * 0.34), C: Math.round(total * 0.26) },
    { question: 5, A: Math.round(total * 0.39), B: Math.round(total * 0.35), C: Math.round(total * 0.26) },
  ];

  // Danh sách các lượt gần nhất
  const now = new Date();
  const demoRecent: RecentSubmission[] = [
    { time: `${String(now.getHours()).padStart(2, '0')}:${String(Math.max(0, now.getMinutes() - 2)).padStart(2, '0')} hôm nay`, result: 'SOFT', key: 'AAAAA' },
    { time: `${String(now.getHours()).padStart(2, '0')}:${String(Math.max(0, now.getMinutes() - 6)).padStart(2, '0')} hôm nay`, result: 'DAILY', key: 'BABBB' },
    { time: `${String(now.getHours()).padStart(2, '0')}:${String(Math.max(0, now.getMinutes() - 11)).padStart(2, '0')} hôm nay`, result: 'ORIGINAL', key: 'ACBCB' },
    { time: `${String(now.getHours()).padStart(2, '0')}:${String(Math.max(0, now.getMinutes() - 19)).padStart(2, '0')} hôm nay`, result: 'SOFT', key: 'ABACA' },
    { time: `${String(now.getHours()).padStart(2, '0')}:${String(Math.max(0, now.getMinutes() - 24)).padStart(2, '0')} hôm nay`, result: 'DAILY', key: 'BBBBB' },
  ];

  // Thêm các lượt thực tế vừa thực hiện ở đầu
  const recentFromLocal: RecentSubmission[] = localSubs.slice(0, 5).map(sub => ({
    time: 'Vừa xong',
    result: sub.result,
    key: sub.answersKey,
  }));

  const combinedRecent = [...recentFromLocal, ...demoRecent].slice(0, 10);

  return {
    total,
    lines: { SOFT: soft, DAILY: daily, ORIGINAL: original },
    percentages: {
      SOFT: Math.round((soft / total) * 100),
      DAILY: Math.round((daily / total) * 100),
      ORIGINAL: Math.round((original / total) * 100),
    },
    questions: baseQuestions,
    recent: combinedRecent,
    updatedAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    isLive: false,
  };
}
