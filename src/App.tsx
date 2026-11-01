/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { WelcomeView } from './components/WelcomeView.tsx';
import { SurveyView } from './components/SurveyView.tsx';
import { ResultView } from './components/ResultView.tsx';
import { LiveTrackerView } from './components/LiveTrackerView.tsx';
import { SetupGuideModal } from './components/SetupGuideModal.tsx';
import { CustomerInfoView } from './components/CustomerInfoView.tsx';
import { QUESTIONS } from './data/questions.ts';
import { determineElotLine, ElotLine } from './data/rules.ts';
import { submitSurveyResponse, getAppsScriptUrl } from './services/sheetService.ts';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'survey' | 'tracker'>('survey');
  const [surveyStep, setSurveyStep] = useState<'welcome' | 'customer_info' | 'questions' | 'result'>('welcome');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, 'A' | 'B' | 'C'>>({});
  const [resultLine, setResultLine] = useState<ElotLine | null>(null);
  const [answersKey, setAnswersKey] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isLiveConnected, setIsLiveConnected] = useState<boolean>(false);

  // Check URL query parameters: autostart=1 skips welcome
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      setSurveyStep('customer_info');
    }
    if (params.get('tab') === 'tracker') {
      setCurrentTab('tracker');
    }

    const appScriptUrl = getAppsScriptUrl();
    setIsLiveConnected(appScriptUrl.startsWith('https://script.google.com'));
  }, []);

  const handleStartSurvey = () => {
    setSurveyStep('customer_info');
  };

  const handleCustomerInfoSubmit = (info: { customerName: string; customerEmail: string }) => {
    setCustomerName(info.customerName);
    setCustomerEmail(info.customerEmail);
    setSurveyStep('questions');
    setCurrentQuestionIndex(0);
    setAnswers({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectOption = (optionKey: 'A' | 'B' | 'C') => {
    const qId = QUESTIONS[currentQuestionIndex].id;
    setAnswers(prev => ({
      ...prev,
      [qId]: optionKey,
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else {
      setSurveyStep('customer_info');
    }
  };

  const handleSubmitSurvey = async () => {
    // Ghép đáp án 5 câu thành chuỗi 5 ký tự theo thứ tự câu 1 -> 5
    const key = QUESTIONS.map(q => answers[q.id] || 'A').join('');
    setAnswersKey(key);

    setIsSubmitting(true);

    // Tra bảng tra cứu O(1) đúng 243 tổ hợp theo quy tắc độc quyền của ELOT
    const determinedLine = determineElotLine(key);
    setResultLine(determinedLine);

    // Tạo mã phiên duy nhất
    const sessionId = 'ELOT-' + Math.random().toString(36).substring(2, 9).toUpperCase();

    // Gửi kết quả lên Google Sheets bằng Apps Script kèm thông tin Khách hàng & Email
    try {
      const res = await submitSurveyResponse({
        sessionId,
        customerName: customerName || 'Ẩn danh',
        customerEmail: customerEmail || '',
        answersKey: key,
        result: determinedLine,
      });
      if (res.isLive) {
        setIsLiveConnected(true);
      }
    } catch (e) {
      console.warn('Lỗi ghi nhận kết quả:', e);
    } finally {
      setIsSubmitting(false);
      setSurveyStep('result');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleRetakeSurvey = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setResultLine(null);
    setAnswersKey('');
    setSurveyStep('welcome');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FBF5EE] text-[#1F1F1D] flex flex-col font-sans selection:bg-[#EAD4D2] selection:text-[#713D38]">
      {/* Persistent Navigation Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={tab => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenGuide={() => setIsGuideOpen(true)}
        isLiveConnected={isLiveConnected}
      />

      {/* Main View Area */}
      <main className="flex-1 flex flex-col">
        {currentTab === 'tracker' ? (
          <LiveTrackerView
            onOpenGuide={() => setIsGuideOpen(true)}
            onTakeQuiz={() => {
              setCurrentTab('survey');
              setSurveyStep('customer_info');
            }}
          />
        ) : (
          <>
            {surveyStep === 'welcome' && (
              <WelcomeView
                onStart={handleStartSurvey}
                onViewTracker={() => setCurrentTab('tracker')}
              />
            )}

            {surveyStep === 'customer_info' && (
              <CustomerInfoView
                initialName={customerName}
                initialEmail={customerEmail}
                onSubmit={handleCustomerInfoSubmit}
                onBack={() => setSurveyStep('welcome')}
              />
            )}

            {surveyStep === 'questions' && (
              <SurveyView
                currentQuestionIndex={currentQuestionIndex}
                answers={answers}
                onSelectOption={handleSelectOption}
                onNext={handleNextQuestion}
                onPrev={handlePrevQuestion}
                onSubmit={handleSubmitSurvey}
                isSubmitting={isSubmitting}
              />
            )}

            {surveyStep === 'result' && resultLine && (
              <ResultView
                resultLine={resultLine}
                answersKey={answersKey}
                customerName={customerName}
                onRetake={handleRetakeSurvey}
                onViewTracker={() => setCurrentTab('tracker')}
              />
            )}
          </>
        )}
      </main>

      {/* Elegant Footer */}
      <footer className="border-t border-[#DADFD3] bg-[#EBEEE8]/50 py-8 px-4 text-center text-xs text-[#713D38] mt-auto">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-base text-[#1F1F1D]">ELOT</span>
            <span className="text-[#819266]">·</span>
            <span>Homewear & Loungewear Collection</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => setIsGuideOpen(true)}
              className="text-[#819266] hover:underline cursor-pointer"
            >
              Cấu hình Google Sheet
            </button>
            <span>·</span>
            <span className="text-[#713D38]">243 Tổ Hợp Phong Cách</span>
            <span>·</span>
            <span className="text-[#713D38]">Bảo mật & Ẩn danh</span>
          </div>
        </div>
      </footer>

      {/* Setup Guide Modal */}
      <SetupGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}
