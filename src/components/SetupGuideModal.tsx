import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, Sheet, FileCode, Rocket, Key } from 'lucide-react';
import { setCustomAppsScriptUrl, getAppsScriptUrl } from '../services/sheetService.ts';

interface SetupGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SetupGuideModal: React.FC<SetupGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [customUrl, setCustomUrl] = useState(getAppsScriptUrl());
  const [savedUrl, setSavedUrl] = useState(false);

  if (!isOpen) return null;

  const handleCopyCode = async () => {
    try {
      const res = await fetch('/Code.gs');
      let text = '';
      if (res.ok) {
        text = await res.text();
      }
      if (!text || text.includes('<!doctype html>')) {
        // Fallback directly from window or default string
        text = `// File Code.gs đã được tạo sẵn trong thư mục gốc của dự án. Mở file Code.gs để sao chép.`;
      }
      await navigator.clipboard.writeText(text);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    } catch (e) {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    }
  };

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomAppsScriptUrl(customUrl.trim());
    setSavedUrl(true);
    setTimeout(() => {
      setSavedUrl(false);
      onClose();
      window.location.reload();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#DADFD3] relative my-8">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-5 border-b border-[#DADFD3] flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EBEEE8] text-[#819266] flex items-center justify-center font-bold">
              <Sheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1F1F1D]">
                Hướng Dẫn Kết Nối Google Sheets & Deploy
              </h2>
              <p className="text-xs text-[#713D38]">
                Lưu trữ toàn bộ câu trả lời hoàn toàn miễn phí không cần server riêng
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#EBEEE8] hover:bg-[#DADFD3] text-[#505B3E] flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-8 text-[#1F1F1D]">
          {/* Quick Connect Box */}
          <div className="p-5 rounded-2xl bg-[#FAF5F5] border border-[#EAD4D2]">
            <h3 className="font-serif font-bold text-base text-[#713D38] mb-2 flex items-center gap-2">
              <Key className="w-4 h-4 text-[#B96C65]" />
              Áp Dụng URL Apps Script Ngay Tại Đây
            </h3>
            <p className="text-xs text-[#492A27] mb-3">
              Nếu bạn đã deploy Apps Script, hãy dán URL vào ô dưới đây để hệ thống tự động kết nối ngay mà không cần khởi động lại dự án:
            </p>
            <form onSubmit={handleApplyUrl} className="flex flex-col sm:flex-row gap-2">
              <input
                type="url"
                required
                placeholder="https://script.google.com/macros/s/.../exec"
                value={customUrl}
                onChange={e => setCustomUrl(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-[#DADFD3] bg-white text-xs sm:text-sm focus:border-[#CE9893] outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#CE9893] hover:bg-[#D5A6A2] text-[#1F1F1D] font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-1.5 shrink-0"
              >
                {savedUrl ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-800" />
                    <span>Đã lưu!</span>
                  </>
                ) : (
                  <span>Kết nối ngay</span>
                )}
              </button>
            </form>
          </div>

          {/* Step 1 */}
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-[#819266] text-white font-bold flex items-center justify-center text-sm shrink-0">
              1
            </div>
            <div className="flex-1">
              <h4 className="font-serif font-bold text-base text-[#1F1F1D]">
                Cấu trúc 2 trang tính (Sheets)
              </h4>
              <p className="text-xs sm:text-sm text-[#492A27] mt-1 leading-relaxed">
                Mã nguồn đã tương thích hoàn toàn với cấu trúc 2 sheet của bạn:<br />
                • Sheet 1 (<strong>Kết quả tư vấn</strong>): Tự động thêm dòng mới gồm 8 cột (<code>Khách hàng | email | Câu 1 | Câu 2 | Câu 3 | Câu 4 | Câu 5 | Set đề xuất</code>).<br />
                • Sheet 2 (<strong>Tổng hợp kết quả</strong>): Tự động đếm và cập nhật số lượng của <code>Elot Soft</code>, <code>Elot Daily</code>, <code>Elot Original</code> vào các ô B2, B3, B4.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-[#819266] text-white font-bold flex items-center justify-center text-sm shrink-0">
              2
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-serif font-bold text-base text-[#1F1F1D]">
                  Mở Apps Script & Dán Mã Nguồn
                </h4>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#EBEEE8] hover:bg-[#DADFD3] text-[#3A422E] text-xs font-semibold transition-colors"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Đã sao chép!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Sao chép mã Code.gs</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs sm:text-sm text-[#492A27] mt-1 leading-relaxed">
                Trong Google Sheet, vào menu: <strong>Tiện ích mở rộng (Extensions) &rarr; Apps Script</strong>.
                Xoá nội dung mẫu trong file <code>Code.gs</code> và dán toàn bộ mã nguồn trong file <code>Code.gs</code> của dự án vào.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-[#819266] text-white font-bold flex items-center justify-center text-sm shrink-0">
              3
            </div>
            <div className="flex-1">
              <h4 className="font-serif font-bold text-base text-[#1F1F1D]">
                Triển khai Web App (Quan trọng nhất)
              </h4>
              <p className="text-xs sm:text-sm text-[#492A27] mt-1 leading-relaxed">
                Tại góc trên bên phải màn hình Apps Script:
              </p>
              <ul className="list-disc pl-5 text-xs sm:text-sm text-[#492A27] space-y-1 mt-1.5">
                <li>Bấm <strong>Triển khai (Deploy) &rarr; Tùy chọn triển khai mới (New deployment)</strong>.</li>
                <li>Chọn loại: <strong>Ứng dụng web (Web app)</strong>.</li>
                <li>Mô tả: <code>ELOT Survey API</code></li>
                <li>Thực thi dưới dạng (Execute as): <strong>Tôi (Me)</strong>.</li>
                <li>Ai có quyền truy cập (Who has access): <strong>Bất kỳ ai (Anyone)</strong>.</li>
                <li>Bấm <strong>Triển khai</strong> và cấp quyền tài khoản Google của bạn khi được hỏi.</li>
                <li>Sao chép <strong>URL ứng dụng web</strong> (có dạng <code>https://script.google.com/macros/s/.../exec</code>).</li>
              </ul>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-[#819266] text-white font-bold flex items-center justify-center text-sm shrink-0">
              4
            </div>
            <div className="flex-1">
              <h4 className="font-serif font-bold text-base text-[#1F1F1D]">
                Cấu hình .env trong dự án
              </h4>
              <p className="text-xs sm:text-sm text-[#492A27] mt-1 leading-relaxed">
                Mở file <code>.env</code> trong thư mục dự án và dán URL vào:
              </p>
              <pre className="bg-[#EBEEE8] p-3 rounded-xl text-xs font-mono text-[#1F1F1D] overflow-x-auto mt-2">
{`VITE_APPS_SCRIPT_URL="https://script.google.com/macros/s/AKfycb.../exec"
VITE_GOOGLE_SHEET_URL="https://docs.google.com/spreadsheets/d/your-sheet-id/edit"`}
              </pre>
            </div>
          </div>

          {/* Step 5 */}
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-[#819266] text-white font-bold flex items-center justify-center text-sm shrink-0">
              5
            </div>
            <div className="flex-1">
              <h4 className="font-serif font-bold text-base text-[#1F1F1D]">
                Deploy ứng dụng lên Vercel hoặc Netlify
              </h4>
              <p className="text-xs sm:text-sm text-[#492A27] mt-1 leading-relaxed">
                - Lệnh build: <code>npm run build</code> (thư mục xuất ra: <code>dist</code>)<br />
                - Trên trang cấu hình Environment Variables của Vercel/Netlify: thêm biến <code>VITE_APPS_SCRIPT_URL</code> với giá trị URL Web App của bạn.<br />
                - Sau 1 phút trang web của bạn sẽ hoạt động hoàn hảo trên toàn thế giới!
              </p>
            </div>
          </div>

          {/* Checklist of files to replace */}
          <div className="p-5 rounded-2xl bg-[#EBEEE8] border border-[#DADFD3]">
            <h4 className="font-serif font-bold text-base text-[#3A422E] mb-2">
              Danh Sách Các Điểm Dễ Dàng Thay Đổi Bằng Dữ Liệu Thật:
            </h4>
            <div className="space-y-2 text-xs text-[#25291E]">
              <div className="p-2.5 rounded-xl bg-white border border-[#DADFD3]">
                <strong>1. File .env:</strong> Thay <code>VITE_APPS_SCRIPT_URL</code> và <code>VITE_GOOGLE_SHEET_URL</code> bằng link trang tính thật.
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-[#DADFD3]">
                <strong>2. File src/data/results.ts:</strong> Thay đổi ảnh (<code>imageUrl</code>), tên set đồ (<code>name</code>), chất liệu (<code>material</code>), mô tả và slogan cho từng dòng.
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-[#DADFD3]">
                <strong>3. Thư mục public/assets/aistudio/:</strong> Thêm ảnh chụp mẫu set đồ mới của bạn vào đây.
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 bg-[#FBF5EE] border-t border-[#DADFD3] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#819266] hover:bg-[#687750] text-white font-semibold text-sm transition-colors cursor-pointer"
          >
            Đã hiểu, đóng hướng dẫn
          </button>
        </div>
      </div>
    </div>
  );
};
