import React, { useState } from 'react';
import {
  Key,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  Sparkles,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  ExternalLink
} from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  isApproved: boolean;
  currentApiKey: string;
  onVerifyKey: (keyToTest: string) => Promise<{ success: boolean; message: string }>;
  onResetKey: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  isApproved,
  currentApiKey,
  onVerifyKey,
  onResetKey,
}) => {
  const [inputKey, setInputKey] = useState(isApproved ? currentApiKey : '');
  const [showKey, setShowKey] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'idle' | 'success' | 'error'; text: string }>({
    type: 'idle',
    text: '',
  });

  React.useEffect(() => {
    if (isOpen) {
      setInputKey(isApproved ? currentApiKey : '');
      setStatusMsg({ type: 'idle', text: '' });
    }
  }, [currentApiKey, isApproved, isOpen]);

  const handleClose = () => {
    if (!isApproved) return;
    onClose();
  };

  if (!isOpen) return null;

  const handleVerifyCustomKey = async (keyToUse: string) => {
    if (!keyToUse || !keyToUse.trim()) {
      setStatusMsg({ type: 'error', text: 'API Key를 입력해 주세요. (AI Studio 발급 키)' });
      return;
    }

    setIsVerifying(true);
    setStatusMsg({ type: 'idle', text: '' });

    try {
      const result = await onVerifyKey(keyToUse.trim());
      if (result.success) {
        setStatusMsg({ type: 'success', text: result.message });
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setStatusMsg({ type: 'error', text: result.message });
      }
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err?.message || '검증 과정에서 오류가 발생했습니다.' });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden relative">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-6 text-white relative">
          {isApproved ? (
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
              title="닫기"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <div className="absolute top-5 right-5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-[11px] font-bold flex items-center space-x-1">
              <Lock className="w-3 h-3" />
              <span>승인 필수</span>
            </div>
          )}

          <div className="flex items-center space-x-3 mb-2">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-md ${
              isApproved ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-slate-950'
            }`}>
              {isApproved ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest text-blue-300 uppercase">
                SECURITY AUTHENTICATION
              </span>
              <h2 className="text-lg font-bold text-white tracking-tight">
                API Key 승인 및 인증
              </h2>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mt-1">
            승인된 API Key를 등록하셔야 모든 메뉴(서류 교차분석, 시나리오 체험, 상담 이력 관리 등)를 정상 이용할 수 있습니다.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Current Status Badge */}
          <div className={`p-4 rounded-2xl border flex items-center justify-between ${
            isApproved 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            <div className="flex items-center space-x-3">
              {isApproved ? (
                <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
              ) : (
                <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0" />
              )}
              <div>
                <div className="text-xs font-bold">
                  {isApproved ? 'API Key 승인 완료 (모든 메뉴 사용 가능)' : 'API Key 미승인 (메뉴 사용 제한됨)'}
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  {isApproved
                    ? '현재 승인된 API Key로 모든 서비스가 정상 연결되어 있습니다.'
                    : '발급받으신 Gemini API Key를 입력 후 승인받아 주세요.'}
                </p>
              </div>
            </div>
            {isApproved && (
              <button
                onClick={onResetKey}
                className="text-[11px] font-bold text-rose-600 hover:text-rose-700 bg-white px-2.5 py-1 rounded-lg border border-rose-200 hover:border-rose-300 transition cursor-pointer shrink-0"
              >
                승인 해제
              </button>
            )}
          </div>

          {/* Get API Key Link Banner */}
          <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-blue-950 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                <span>Gemini API Key가 없으신가요?</span>
              </div>
              <p className="text-[11px] text-blue-800">
                Google AI Studio에서 구글 계정으로 무료 발급받으실 수 있습니다.
              </p>
            </div>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 bg-[#0052cc] hover:bg-blue-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition cursor-pointer shrink-0 shadow-xs active:scale-95"
            >
              <span>API Key 무료 발급</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Form / Actions */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
                <span>Gemini API Key 입력 (필수)</span>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-[#0052cc] hover:underline font-semibold flex items-center gap-0.5"
                >
                  <span>키 발급 페이지 바로가기</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </label>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder="Google AI Studio API Key (AIzaSy...)"
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-mono focus:bg-white focus:border-[#0052cc] focus:ring-2 focus:ring-blue-100 outline-none transition"
                />
                <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="pt-2">
              <button
                type="button"
                disabled={isVerifying}
                onClick={() => handleVerifyCustomKey(inputKey)}
                className="w-full py-3.5 px-4 bg-[#0052cc] hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold transition shadow-md flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 active:scale-[0.99]"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>API Key 승인 검증 중...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-blue-200" />
                    <span>API Key 입력 및 승인받기</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Feedback Message */}
          {statusMsg.text && (
            <div className={`p-3.5 rounded-xl text-xs font-semibold flex items-center space-x-2 animate-fadeIn ${
              statusMsg.type === 'success' 
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' 
                : 'bg-rose-100 text-rose-900 border border-rose-300'
            }`}>
              {statusMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{statusMsg.text}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>인재채움뱅크 보안 인증 표준</span>
          <button
            onClick={onClose}
            className="text-slate-700 font-bold hover:underline cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
