import React, { useState } from 'react';
import { PhoneChecklistItem } from '../types';
import {
  PhoneCall,
  CheckCircle,
  XCircle,
  Clock,
  ChevronRight,
  ChevronLeft,
  HelpCircle,
  MessageSquare,
  ListOrdered,
  Sparkles
} from 'lucide-react';

interface SequentialPhoneCallProps {
  items: PhoneChecklistItem[];
  onUpdateItemStatus?: (
    id: number,
    status: 'confirmed' | 'rejected' | 'needs_followup',
    notes: string
  ) => void;
}

export const SequentialPhoneCall: React.FC<SequentialPhoneCallProps> = ({
  items,
  onUpdateItemStatus,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemStates, setItemStates] = useState<
    Record<
      number,
      { status: 'pending' | 'confirmed' | 'rejected' | 'needs_followup'; notes: string }
    >
  >(() => {
    const initial: Record<
      number,
      { status: 'pending' | 'confirmed' | 'rejected' | 'needs_followup'; notes: string }
    > = {};
    items.forEach((item) => {
      initial[item.id] = {
        status: item.userStatus || 'pending',
        notes: item.consultantNotes || '',
      };
    });
    return initial;
  });

  if (!items || items.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center space-x-2 text-slate-800 font-bold mb-2">
          <span className="text-blue-600 font-mono text-sm"># 2.</span>
          <h3>전화 확인사항 (순차 진행)</h3>
        </div>
        <p className="text-xs text-slate-500">전화 확인이 필요한 특이사항이 없습니다.</p>
      </div>
    );
  }

  const currentItem = items[currentIndex] || items[0];
  const currentState = itemStates[currentItem.id] || { status: 'pending', notes: '' };

  const handleSetStatus = (
    status: 'confirmed' | 'rejected' | 'needs_followup'
  ) => {
    setItemStates((prev) => ({
      ...prev,
      [currentItem.id]: {
        ...prev[currentItem.id],
        status,
      },
    }));

    if (onUpdateItemStatus) {
      onUpdateItemStatus(currentItem.id, status, currentState.notes);
    }
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const notes = e.target.value;
    setItemStates((prev) => ({
      ...prev,
      [currentItem.id]: {
        ...prev[currentItem.id],
        notes,
      },
    }));
  };

  const completedCount = Object.values(itemStates).filter(
    (s: { status: 'pending' | 'confirmed' | 'rejected' | 'needs_followup'; notes: string }) => s.status !== 'pending'
  ).length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Section Header */}
      <div className="bg-slate-900 text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="text-blue-400 font-mono font-bold text-sm"># 2.</span>
          <h2 className="text-base font-bold tracking-tight">
            전화 확인사항 (순차 진행 모드)
          </h2>
        </div>
        <div className="flex items-center space-x-2 text-xs bg-slate-800 px-3 py-1 rounded-full text-slate-300 font-medium">
          <Clock className="w-3.5 h-3.5 text-blue-400" />
          <span>
            진행 현황: <strong className="text-white">{currentIndex + 1}</strong> / {items.length} 항목 (완료: {completedCount}건)
          </span>
        </div>
      </div>

      {/* Stepper Tabs Bar */}
      <div className="bg-slate-100 border-b border-slate-200 px-6 py-2.5 flex items-center space-x-2 overflow-x-auto">
        {items.map((item, idx) => {
          const state = itemStates[item.id] || { status: 'pending' };
          const isCurrent = idx === currentIndex;

          let badgeBg = 'bg-slate-200 text-slate-700';
          if (state.status === 'confirmed') badgeBg = 'bg-emerald-500 text-white';
          if (state.status === 'rejected') badgeBg = 'bg-rose-500 text-white';
          if (state.status === 'needs_followup') badgeBg = 'bg-amber-500 text-white';

          return (
            <button
              key={item.id}
              onClick={() => setCurrentIndex(idx)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition ${
                isCurrent
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <span className={`w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center ${badgeBg}`}>
                {idx + 1}
              </span>
              <span className="truncate max-w-[120px]">{item.title}</span>
            </button>
          );
        })}
      </div>

      {/* Focused Interactive Step Card */}
      <div className="p-6 space-y-5">
        <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-blue-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-blue-200/60 pb-3">
            <span className="bg-blue-600 text-white text-xs font-extrabold px-2.5 py-1 rounded-md flex items-center gap-1">
              <PhoneCall className="w-3.5 h-3.5" />
              {currentIndex + 1}번 확인 항목
            </span>
            <span className="text-xs font-bold text-slate-600">
              {currentItem.title}
            </span>
          </div>

          {/* Question to Speak on Phone */}
          <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-2xs space-y-2">
            <div className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <span>전화 질문 스크립트 (통화 중 직접 질문)</span>
            </div>
            <p className="text-sm font-bold text-slate-900 leading-relaxed pl-2 border-l-4 border-blue-600">
              "{currentItem.question}"
            </p>
          </div>

          {/* Reason & Consultant Action Guide */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="bg-white/80 p-3 rounded-lg border border-slate-200">
              <span className="font-bold text-slate-700 block mb-1">💡 확인 사유</span>
              <p className="text-slate-600 leading-relaxed">{currentItem.reason}</p>
            </div>
            <div className="bg-white/80 p-3 rounded-lg border border-slate-200">
              <span className="font-bold text-slate-700 block mb-1">📋 컨설턴트 대응 가이드</span>
              <p className="text-slate-600 leading-relaxed">{currentItem.guideForConsultant}</p>
            </div>
          </div>

          {/* Consultant Input & Response Buttons */}
          <div className="pt-2 border-t border-blue-200/60 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs font-bold text-slate-800">
                통화 결과 판정:
              </span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => handleSetStatus('confirmed')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 transition ${
                    currentState.status === 'confirmed'
                      ? 'bg-emerald-600 text-white ring-2 ring-emerald-600/30'
                      : 'bg-white text-emerald-800 border border-emerald-300 hover:bg-emerald-50'
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>확인 완료 (충족)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSetStatus('rejected')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 transition ${
                    currentState.status === 'rejected'
                      ? 'bg-rose-600 text-white ring-2 ring-rose-600/30'
                      : 'bg-white text-rose-800 border border-rose-300 hover:bg-rose-50'
                  }`}
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>미충족/제출불가</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSetStatus('needs_followup')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 transition ${
                    currentState.status === 'needs_followup'
                      ? 'bg-amber-600 text-white ring-2 ring-amber-600/30'
                      : 'bg-white text-amber-800 border border-amber-300 hover:bg-amber-50'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>추가 서류 요청</span>
                </button>
              </div>
            </div>

            {/* Quick Note Input */}
            <input
              type="text"
              placeholder="통화 중 메모 기재 (예: 지게차 자격증 2년 전 취득 확인, 내일 모바일 발급 후 전송 예정)..."
              value={currentState.notes}
              onChange={handleNotesChange}
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1 transition ${
              currentIndex === 0
                ? 'opacity-40 cursor-not-allowed text-slate-400 bg-slate-100'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>이전 항목</span>
          </button>

          {currentIndex < items.length - 1 ? (
            <button
              type="button"
              onClick={() =>
                setCurrentIndex((prev) => Math.min(items.length - 1, prev + 1))
              }
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs flex items-center space-x-1 transition"
            >
              <span>다음 항목 진행 ({currentIndex + 2}/{items.length})</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              <CheckCircle className="w-4 h-4" />
              모든 순차 확인 완료
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
