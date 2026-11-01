import React, { useState } from 'react';
import { User, Mail, ArrowRight, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';

interface CustomerInfoViewProps {
  initialName?: string;
  initialEmail?: string;
  onSubmit: (info: { customerName: string; customerEmail: string }) => void;
  onBack: () => void;
}

export const CustomerInfoView: React.FC<CustomerInfoViewProps> = ({
  initialName = '',
  initialEmail = '',
  onSubmit,
  onBack,
}) => {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const validate = () => {
    const newErrors: { name?: string; email?: string } = {};
    if (!name.trim()) {
      newErrors.name = 'Vui lòng nhập họ và tên của bạn.';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Họ và tên phải có ít nhất 2 ký tự.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Vui lòng nhập địa chỉ email.';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Địa chỉ email không đúng định dạng (ví dụ: ten@gmail.com).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        customerName: name.trim(),
        customerEmail: email.trim(),
      });
    }
  };

  return (
    <div className="py-8 sm:py-12 max-w-xl mx-auto px-4 sm:px-6">
      <div className="bg-[#FAF5F5] rounded-3xl p-6 sm:p-10 border border-[#EAD4D2] shadow-sm">
        {/* Step Badge */}
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F3E8E7] text-[#713D38] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#B96C65]" />
            Thông Tin Khách Hàng
          </span>
          <span className="text-xs text-[#713D38] font-medium">Bước chuẩn bị</span>
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl text-[#1F1F1D] font-bold mb-2">
          Gặp Gỡ Trước Khi Bắt Đầu
        </h2>
        <p className="text-xs sm:text-sm text-[#492A27] mb-8 leading-relaxed">
          Hãy chia sẻ thông tin để ELOT có thể gửi kết quả phân tích phong cách cùng voucher quà tặng đặc quyền đến bạn nhé.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Customer Name */}
          <div>
            <label htmlFor="customer-name" className="block text-xs font-semibold text-[#819266] uppercase tracking-wider mb-2">
              Họ và tên khách hàng <span className="text-[#984F48]">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#A4B190]">
                <User className="w-5 h-5" />
              </div>
              <input
                id="customer-name"
                type="text"
                value={name}
                onChange={e => {
                  setName(e.target.value);
                  if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
                }}
                placeholder="Ví dụ: Nguyễn Mai Anh"
                className={`w-full pl-11 pr-4 py-3 rounded-2xl bg-white border-2 text-sm text-[#1F1F1D] placeholder:text-[#A4B190] outline-none transition-colors ${
                  errors.name
                    ? 'border-[#984F48] focus:border-[#984F48]'
                    : 'border-[#DADFD3] focus:border-[#CE9893]'
                }`}
              />
            </div>
            {errors.name && (
              <p className="text-xs text-[#984F48] mt-1.5 font-medium">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="customer-email" className="block text-xs font-semibold text-[#819266] uppercase tracking-wider mb-2">
              Địa chỉ Email <span className="text-[#984F48]">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#A4B190]">
                <Mail className="w-5 h-5" />
              </div>
              <input
                id="customer-email"
                type="email"
                value={email}
                onChange={e => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
                }}
                placeholder="maianh@example.com"
                className={`w-full pl-11 pr-4 py-3 rounded-2xl bg-white border-2 text-sm text-[#1F1F1D] placeholder:text-[#A4B190] outline-none transition-colors ${
                  errors.email
                    ? 'border-[#984F48] focus:border-[#984F48]'
                    : 'border-[#DADFD3] focus:border-[#CE9893]'
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-[#984F48] mt-1.5 font-medium">{errors.email}</p>
            )}
          </div>

          {/* Privacy Note */}
          <div className="p-3.5 rounded-2xl bg-[#EBEEE8]/70 border border-[#DADFD3] flex items-start gap-2.5 text-xs text-[#3A422E]">
            <ShieldCheck className="w-4 h-4 text-[#819266] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              ELOT cam kết bảo mật thông tin. Chúng tôi chỉ sử dụng email để lưu trữ kết quả và gửi ưu đãi đặc quyền cho bạn.
            </p>
          </div>

          {/* Buttons */}
          <div className="pt-3 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1.5 px-4 py-3 rounded-2xl border border-[#DADFD3] text-[#505B3E] hover:bg-[#EBEEE8] text-sm font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </button>

            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#CE9893] hover:bg-[#D5A6A2] active:bg-[#B96C65] text-[#1F1F1D] font-semibold text-sm sm:text-base shadow-sm transition-all cursor-pointer"
            >
              <span>Bắt đầu trả lời 5 câu hỏi</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
