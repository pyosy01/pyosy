import React from 'react';
import { Building2, History, ShieldCheck, Lock, Key } from 'lucide-react';

interface HeaderProps {
  onOpenHistory: () => void;
  savedCount: number;
  onSelectPreset: (presetId: string) => void;
  isApiKeyApproved: boolean;
  onOpenApiKeyModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenHistory,
  savedCount,
  onSelectPreset,
  isApiKeyApproved,
  onOpenApiKeyModal,
}) => {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    if (!isApiKeyApproved) {
      e.preventDefault();
      onOpenApiKeyModal();
      return;
    }
    const elem = document.getElementById(targetId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleHistoryClick = () => {
    if (!isApiKeyApproved) {
      onOpenApiKeyModal();
      return;
    }
    onOpenHistory();
  };

  return (
    <header className="bg-white text-slate-900 border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#0052cc] flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-extrabold px-2 py-0.5 rounded bg-blue-50 text-[#0052cc] border border-blue-200/80">
                  고용노동부 인재채움뱅크
                </span>
                <span className="text-[11px] text-slate-500 font-medium hidden md:inline">
                  컨설턴트 전용 AI Assistant
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight mt-0.5">
                취업컨설턴트 전화상담 지원 대시보드
              </h1>
            </div>
          </div>

          {/* Navigation Items (Dekstop) */}
          <nav className="hidden lg:flex items-center space-x-6 text-xs font-semibold text-slate-700">
            <a
              href="#analyze-form"
              onClick={(e) => handleNavClick(e, 'analyze-form')}
              className={`py-1 transition-colors flex items-center space-x-1 ${
                isApiKeyApproved ? 'hover:text-[#0052cc]' : 'text-slate-400'
              }`}
            >
              {!isApiKeyApproved && <Lock className="w-3 h-3 text-amber-500" />}
              <span>지원자격 사전검토</span>
            </a>
            <a
              href="#quick-presets"
              onClick={(e) => handleNavClick(e, 'quick-presets')}
              className={`py-1 transition-colors flex items-center space-x-1 ${
                isApiKeyApproved ? 'hover:text-[#0052cc]' : 'text-slate-400'
              }`}
            >
              {!isApiKeyApproved && <Lock className="w-3 h-3 text-amber-500" />}
              <span>실무 시나리오</span>
            </a>
            <a
              href="#workflow-steps"
              onClick={(e) => handleNavClick(e, 'workflow-steps')}
              className={`py-1 transition-colors flex items-center space-x-1 ${
                isApiKeyApproved ? 'hover:text-[#0052cc]' : 'text-slate-400'
              }`}
            >
              {!isApiKeyApproved && <Lock className="w-3 h-3 text-amber-500" />}
              <span>상담 프로세스</span>
            </a>
          </nav>

          {/* Action Tools */}
          <div className="flex items-center space-x-2.5">
            {/* API Key Status Button */}
            <button
              onClick={onOpenApiKeyModal}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                isApiKeyApproved
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100 animate-pulse'
              }`}
            >
              {isApiKeyApproved ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="hidden sm:inline">API Key 승인 완료</span>
                  <span className="sm:hidden">승인됨</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-amber-600" />
                  <span>API Key 승인 필요</span>
                </>
              )}
            </button>

            <button
              onClick={handleHistoryClick}
              className="flex items-center space-x-2 bg-slate-50 hover:bg-slate-100 text-slate-800 px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold transition cursor-pointer"
            >
              <History className="w-4 h-4 text-[#0052cc]" />
              <span className="hidden sm:inline">상담 이력</span>
              {savedCount > 0 && (
                <span className="bg-[#0052cc] text-white text-[10px] font-bold px-2 py-0.5 rounded-full ml-1">
                  {savedCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};


