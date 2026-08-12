import React, { useState } from 'react';
import { ConsultationSession } from '../types';
import { History, X, Search, Trash2, ExternalLink, Calendar, User, Building, CheckCircle, AlertTriangle } from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ConsultationSession[];
  onSelectSession: (session: ConsultationSession) => void;
  onDeleteSession: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  sessions,
  onSelectSession,
  onDeleteSession,
  onClearAll,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredSessions = sessions.filter(
    (s) =>
      s.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-bold">전화상담 준비 이력 관리</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Actions */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="지원자명, 기업명, 직무 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>총 {filteredSessions.length}건 저장됨</span>
            {sessions.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-rose-600 hover:underline flex items-center space-x-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>전체 삭제</span>
              </button>
            )}
          </div>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredSessions.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              저장된 전화상담 이력이 없습니다.
            </div>
          ) : (
            filteredSessions.map((session) => {
              const isFulfilled =
                session.result?.qualificationCheck?.status === 'FULFILLED';

              return (
                <div
                  key={session.id}
                  className="bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition space-y-2 group cursor-pointer"
                  onClick={() => {
                    onSelectSession(session);
                    onClose();
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        isFulfilled
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isFulfilled ? '🟢 자격 충족' : '🔴 확인 필요'}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] text-slate-400 font-mono">
                        {session.timestamp}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteSession(session.id);
                        }}
                        className="text-slate-300 hover:text-rose-600 p-1 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                      <User className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{session.applicantName || '지원자'}</span>
                      <span className="text-slate-300">|</span>
                      <Building className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span className="truncate">{session.companyName || '기업'}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      직무: {session.jobTitle || '미상'}
                    </div>
                  </div>

                  <div className="text-[11px] text-blue-600 font-bold flex items-center justify-end space-x-1 group-hover:underline pt-1">
                    <span>이력 불러오기</span>
                    <ExternalLink className="w-3 h-3" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
