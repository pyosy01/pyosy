import React, { useState } from 'react';
import { ScriptData } from '../types';
import { Phone, Copy, Check, Volume2, Type, Building, User, Briefcase } from 'lucide-react';

interface ScriptViewerProps {
  script: ScriptData;
}

export const ScriptViewer: React.FC<ScriptViewerProps> = ({ script }) => {
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'huge'>('large');

  const formattedText = script.fullText || `안녕하세요.
고용노동부 인재채움뱅크입니다.
${script.applicantName || 'OOO'}님 맞으실까요?
${script.companyName || 'OO기업'} ${script.jobTitle || 'OO'} 직무에 지원해 주셔서 연락드렸습니다.
저희는 서류접수를 도와드리고 있습니다.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'normal':
        return 'text-sm leading-relaxed';
      case 'large':
        return 'text-base sm:text-lg leading-relaxed font-semibold';
      case 'huge':
        return 'text-lg sm:text-xl leading-loose font-extrabold';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900 text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <span className="text-blue-400 font-mono font-bold text-sm"># 3.</span>
          <h2 className="text-base font-bold tracking-tight">기본 상담 스크립트</h2>
        </div>

        {/* Tools */}
        <div className="flex items-center space-x-2">
          {/* Font Size Selector */}
          <div className="flex bg-slate-800 p-1 rounded-lg text-xs">
            <button
              onClick={() => setFontSize('normal')}
              className={`px-2 py-1 rounded font-medium transition ${
                fontSize === 'normal'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              기본
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-2 py-1 rounded font-medium transition ${
                fontSize === 'large'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              크게
            </button>
            <button
              onClick={() => setFontSize('huge')}
              className={`px-2 py-1 rounded font-medium transition ${
                fontSize === 'huge'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              매우 크게
            </button>
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>복사 완료!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>스크립트 복사</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Identified variables bar */}
        <div className="flex flex-wrap items-center gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
          <span className="text-slate-500 font-bold">통화 대상:</span>
          <span className="bg-blue-100 text-blue-900 font-bold px-2.5 py-1 rounded-md border border-blue-200 flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-blue-600" />
            지원자: {script.applicantName || '미지정'}
          </span>
          <span className="bg-indigo-100 text-indigo-900 font-bold px-2.5 py-1 rounded-md border border-indigo-200 flex items-center gap-1">
            <Building className="w-3.5 h-3.5 text-indigo-600" />
            기업명: {script.companyName || '미지정'}
          </span>
          <span className="bg-violet-100 text-violet-900 font-bold px-2.5 py-1 rounded-md border border-violet-200 flex items-center gap-1">
            <Briefcase className="w-3.5 h-3.5 text-violet-600" />
            직무: {script.jobTitle || '미지정'}
          </span>
        </div>

        {/* Teleprompter Tele-greeting Box */}
        <div className="bg-slate-900 text-slate-100 p-6 rounded-2xl border-2 border-blue-500/30 shadow-inner font-sans space-y-2">
          <div className="text-xs text-blue-400 font-mono font-bold flex items-center gap-1.5 mb-2">
            <Phone className="w-4 h-4 text-emerald-400 animate-pulse" />
            통화 시작 표준 스크립트 (가독성 최적화)
          </div>
          <div className={`whitespace-pre-line text-slate-100 ${getFontSizeClass()}`}>
            {formattedText}
          </div>
        </div>
      </div>
    </div>
  );
};
