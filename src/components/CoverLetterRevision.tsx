import React, { useState } from 'react';
import { CoverLetterFeedback } from '../types';
import { FileEdit, CheckCircle2, AlertOctagon, Send, Copy, Check, MessageSquare } from 'lucide-react';

interface CoverLetterRevisionProps {
  feedback: CoverLetterFeedback;
  applicantName?: string;
  companyName?: string;
}

export const CoverLetterRevision: React.FC<CoverLetterRevisionProps> = ({
  feedback,
  applicantName = '지원자',
  companyName = '지원기업',
}) => {
  const [copied, setCopied] = useState(false);
  const needsRevision = feedback.needsRevision;

  const smsText = `[고용노동부 인재채움뱅크 서류 안내]
안녕하세요 ${applicantName}님, 인재채움뱅크 취업컨설턴트입니다.
${companyName} 지원 서류 접수를 위해 자기소개서의 아래 사항 수정 및 보완 후 재제출을 부탁드립니다.

■ 안내 및 수정 사항:
${feedback.instructions}

감사합니다.`;

  const handleCopySMS = () => {
    navigator.clipboard.writeText(smsText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-blue-400 font-mono font-bold text-sm"># 4.</span>
          <h2 className="text-base font-bold tracking-tight">자기소개서 수정 요청</h2>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
            needsRevision
              ? 'bg-amber-500 text-slate-950 font-extrabold'
              : 'bg-emerald-500 text-white'
          }`}
        >
          {needsRevision ? (
            <>
              <AlertOctagon className="w-4 h-4" />
              <span>치명적 결함 수정 필요</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>수정 사항 없음 (제출 가능)</span>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Core Guidance Box */}
        <div
          className={`p-5 rounded-2xl border ${
            needsRevision
              ? 'bg-amber-50/80 border-amber-200 text-amber-950'
              : 'bg-slate-50 border-slate-200 text-slate-800'
          }`}
        >
          <div className="text-xs font-bold flex items-center gap-1.5 mb-2">
            <FileEdit
              className={`w-4 h-4 ${
                needsRevision ? 'text-amber-600' : 'text-slate-500'
              }`}
            />
            <span>자기소개서 서류 검토 의견 (제출가능성 기준)</span>
          </div>

          <p className="text-sm font-semibold leading-relaxed whitespace-pre-line bg-white/90 p-4 rounded-xl border border-slate-200/80 shadow-2xs">
            {feedback.instructions || '해당 없음'}
          </p>

          <p className="text-[11px] text-slate-500 mt-2 font-medium">
            ※ 원칙: 타 기업명 오기재, 직무 불일치, 서류 누락 등 치명적 결함에 한해서만 수정을 지도하며, 문장 표현이나 문맥 등 사소한 문구 첨삭은 제외합니다.
          </p>
        </div>

        {/* SMS / KakaoTalk Quick Guide Generator */}
        {needsRevision && (
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                지원자 안내용 문장 (카카오톡/문자 전송용)
              </span>
              <button
                onClick={handleCopySMS}
                className="text-xs px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition flex items-center gap-1 shadow-xs"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>문자 복사 완료</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>안내문 복사</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs font-mono text-slate-700 whitespace-pre-line leading-relaxed">
              {smsText}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
