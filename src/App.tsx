import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Header } from './components/Header';
import { LandingHero } from './components/LandingHero';
import { InputForm } from './components/InputForm';
import { QualificationCard } from './components/QualificationCard';
import { SequentialPhoneCall } from './components/SequentialPhoneCall';
import { ScriptViewer } from './components/ScriptViewer';
import { CoverLetterRevision } from './components/CoverLetterRevision';
import { HistoryDrawer } from './components/HistoryDrawer';
import { ApiKeyModal } from './components/ApiKeyModal';
import { AnalysisResult, ConsultationSession } from './types';
import { PRESET_CASES } from './data/presets';
import {
  Sparkles,
  FileCheck,
  CheckCircle,
  AlertCircle,
  Copy,
  Check,
  Save,
  RotateCcw,
  Building,
  PhoneCall,
  ShieldCheck,
  FileText,
  Lock,
  Key,
  ShieldAlert
} from 'lucide-react';

export default function App() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);

  // API Key Approval State
  const [currentApiKey, setCurrentApiKey] = useState<string>('');
  const [isApiKeyApproved, setIsApiKeyApproved] = useState<boolean>(false);
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState<boolean>(true);

  const formRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const [historyOpen, setHistoryOpen] = useState(false);
  const [savedSessions, setSavedSessions] = useState<ConsultationSession[]>(
    () => {
      try {
        const local = localStorage.getItem('jaechaeum_sessions');
        return local ? JSON.parse(local) : [];
      } catch (e) {
        return [];
      }
    }
  );

  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [copiedReport, setCopiedReport] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('jaechaeum_sessions', JSON.stringify(savedSessions));
    } catch (e) {
      console.error('LocalStorage error:', e);
    }
  }, [savedSessions]);

  // Always require explicit API key modal verification on mount
  useEffect(() => {
    localStorage.removeItem('jaechaeum_api_key');
    setCurrentApiKey('');
    setIsApiKeyApproved(false);
    setApiKeyModalOpen(true);
  }, []);

  const runClientSideAnalyze = async (data: any, apiKeyToUse: string): Promise<AnalysisResult> => {
    const ai = new GoogleGenAI({ apiKey: apiKeyToUse });
    const systemPrompt = `
당신은 대한민국 「고용노동부 인재채움뱅크」 취업컨설턴트의 업무를 밀착 지원하는 실무 전용 AI Assistant이다.
완벽한 자소서를 작성하는 첨삭 전문가가 아니라, 컨설턴트가 전화상담 전반을 빠르고 정확하게 준비할 수 있도록 돕는 조력자 역할을 수행한다.

# GOAL
- 사용자가 업로드한 기업 채용공고, 지원자의 이력서, 자기소개서 파일을 교차 분석하여 지원 자격을 사전 검토한다.
- 전화상담 시 반드시 확인해야 할 핵심 사항들을 한 번에 모두 출력하지 않고, 사용자와 순차적으로 하나씩 질문하며 소통할 수 있도록 안내한다.
- 불필요한 수정 요청을 배제하고, 기업 제출 가능 수준을 충족하기 위한 자기소개서 수정 방향을 안내한다. (서류의 완벽함이 아니라 전달 가능한 수준)
- 컨설턴트의 서류 검토 및 통화 준비 시간을 최소화하여 업무 효율을 극대화한다.

# MANDATORY OUTPUT FORMAT
반드시 아래의 JSON 구조로 응답하세요. 다른 설명 문구 없이 오직 JSON만 반환하세요.

{
  "qualificationCheck": {
    "status": "FULFILLED",
    "badge": "🟢 지원 자격 충족",
    "jobRequirements": "공고 요건 요약",
    "applicantStatus": "지원자 현황 요약",
    "details": ["상세 요건 사유"]
  },
  "phoneChecklist": [
    {
      "id": 1,
      "itemNumber": 1,
      "title": "확인 항목 제목",
      "question": "지원자에게 전화로 물어볼 실제 질문 문구",
      "reason": "확인이 필요한 구체적 이유",
      "guideForConsultant": "컨설턴트 대응 가이드"
    }
  ],
  "script": {
    "applicantName": "지원자 이름",
    "companyName": "지원 기업명",
    "jobTitle": "지원 직무",
    "fullText": "기본 상담 스크립트 문구"
  },
  "coverLetterFeedback": {
    "needsRevision": false,
    "instructions": "수정 필요사항 안내"
  },
  "rawMarkdown": "# 1. 지원자격 사전검토..."
}
`;

    const promptParts: any[] = [];
    let combinedPrompt = systemPrompt + "\n\n[입력 데이터 정보]\n";
    if (data.applicantNameHint) combinedPrompt += `- 지원자 이름 힌트: ${data.applicantNameHint}\n`;
    if (data.companyNameHint) combinedPrompt += `- 지원 기업명 힌트: ${data.companyNameHint}\n`;
    if (data.jobTitleHint) combinedPrompt += `- 지원 직무 힌트: ${data.jobTitleHint}\n`;

    if (data.jobPostingText) {
      combinedPrompt += `\n--- [1. 지원 채용공고 정보] ---\n${data.jobPostingText}\n`;
    }
    if (data.applicantDocText) {
      combinedPrompt += `\n--- [2. 지원자 이력서/자기소개서 정보] ---\n${data.applicantDocText}\n`;
    }

    promptParts.push({ text: combinedPrompt });

    if (data.jobPostingFile?.dataBase64) {
      promptParts.push({ text: `\n[첨부파일 1: 기업 채용공고 파일 (${data.jobPostingFile.filename || 'job_posting'})]` });
      promptParts.push({
        inlineData: {
          mimeType: data.jobPostingFile.mimeType || "application/pdf",
          data: data.jobPostingFile.dataBase64,
        },
      });
    }

    if (data.applicantDocFile?.dataBase64) {
      promptParts.push({ text: `\n[첨부파일 2: 지원자 이력서/자기소개서 파일 (${data.applicantDocFile.filename || 'applicant_doc'})]` });
      promptParts.push({
        inlineData: {
          mimeType: data.applicantDocFile.mimeType || "application/pdf",
          data: data.applicantDocFile.dataBase64,
        },
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: promptParts }],
      config: {
        responseMimeType: "application/json",
        temperature: 0.1,
      },
    });

    const responseText = response.text || "{}";
    const cleanedText = responseText.replace(/```json\s*/g, "").replace(/```\s*$/g, "").trim();
    return JSON.parse(cleanedText) as AnalysisResult;
  };

  const verifyApiKeyOnServer = async (keyToTest: string, isInitialCheck = false) => {
    const keyTrimmed = keyToTest ? keyToTest.trim().replace(/^["']|["']$/g, '') : '';

    if (!keyTrimmed) {
      setIsApiKeyApproved(false);
      if (isInitialCheck) {
        setApiKeyModalOpen(true);
      }
      return { success: false, message: 'API Key를 입력하셔야 모든 기능과 메뉴를 이용할 수 있습니다.' };
    }

    // Tier 1: Try server verification endpoint first
    try {
      const response = await fetch('/api/verify-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: keyTrimmed }),
      });

      if (response.ok) {
        const data = await response.json().catch(() => ({}));
        if (data.approved) {
          setIsApiKeyApproved(true);
          localStorage.setItem('jaechaeum_api_key', keyTrimmed);
          setCurrentApiKey(keyTrimmed);
          return { success: true, message: data.message || 'API Key 승인 완료' };
        }
      }
    } catch (err) {
      console.warn('Server verify-key endpoint unavailable, using direct API check:', err);
    }

    // Tier 2: Direct Google Gemini REST API verification (works on Vercel/Share/Static hosting)
    try {
      const googleRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash?key=${keyTrimmed}`);
      if (googleRes.ok) {
        setIsApiKeyApproved(true);
        localStorage.setItem('jaechaeum_api_key', keyTrimmed);
        setCurrentApiKey(keyTrimmed);
        return { success: true, message: 'API Key가 성공적으로 승인되었습니다. 모든 메뉴를 이용하실 수 있습니다.' };
      }
      const errJson = await googleRes.json().catch(() => ({}));
      const errMsg = errJson.error?.message || '';
      if (googleRes.status === 400 || googleRes.status === 401 || googleRes.status === 403 || errMsg.includes('API key not valid')) {
        setIsApiKeyApproved(false);
        setApiKeyModalOpen(true);
        return { success: false, message: '유효하지 않은 API Key입니다. Google AI Studio에서 발급받은 올바른 API Key를 입력해 주세요.' };
      }
    } catch (clientErr) {
      console.warn('Direct Google API check failed:', clientErr);
    }

    // Tier 3: Format check for standard Google AI Studio key format
    if (/^AIzaSy[A-Za-z0-9_\-]{30,60}$/.test(keyTrimmed) || (keyTrimmed.length >= 30 && keyTrimmed.startsWith('AIza'))) {
      setIsApiKeyApproved(true);
      localStorage.setItem('jaechaeum_api_key', keyTrimmed);
      setCurrentApiKey(keyTrimmed);
      return { success: true, message: 'API Key 승인이 완료되었습니다.' };
    }

    setIsApiKeyApproved(false);
    setApiKeyModalOpen(true);
    return { success: false, message: 'API Key 승인에 실패했습니다. 올바른 키를 입력해 주세요.' };
  };

  const handleResetApiKey = () => {
    localStorage.removeItem('jaechaeum_api_key');
    setCurrentApiKey('');
    setIsApiKeyApproved(false);
    setApiKeyModalOpen(true);
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleAnalyze = async (data: {
    jobPostingText: string;
    jobPostingFile?: { mimeType: string; dataBase64: string; filename: string };
    applicantDocText: string;
    applicantDocFile?: { mimeType: string; dataBase64: string; filename: string };
    applicantNameHint?: string;
    companyNameHint?: string;
    jobTitleHint?: string;
  }) => {
    if (!isApiKeyApproved) {
      setApiKeyModalOpen(true);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let resData: AnalysisResult | null = null;

      // Try server /api/analyze endpoint first
      try {
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...data,
            apiKey: currentApiKey || undefined,
          }),
        });

        if (response.ok) {
          resData = await response.json();
        } else {
          const errJson = await response.json().catch(() => ({}));
          if (response.status === 401 || errJson.error?.includes('API Key')) {
            setIsApiKeyApproved(false);
            setApiKeyModalOpen(true);
            throw new Error(errJson.error || 'API Key 승인 필요');
          }
        }
      } catch (serverErr: any) {
        if (serverErr.message?.includes('API Key')) {
          throw serverErr;
        }
        console.warn('Server analyze endpoint unavailable, running client-side analyze:', serverErr);
      }

      // Fallback to client-side analyze if server endpoint unavailable/failed (e.g. Vercel static deployment)
      if (!resData) {
        resData = await runClientSideAnalyze(data, currentApiKey);
      }

      setResult(resData);

      // Create new session record
      const newSession: ConsultationSession = {
        id: 'session-' + Date.now(),
        timestamp: new Date().toLocaleDateString('ko-KR', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        applicantName: resData.script?.applicantName || data.applicantNameHint || '지원자',
        companyName: resData.script?.companyName || data.companyNameHint || '기업명',
        jobTitle: resData.script?.jobTitle || data.jobTitleHint || '직무',
        result: resData,
        phoneChecklistState: resData.phoneChecklist,
        overallNotes: '',
        status: 'PREPARING',
      };

      setActiveSessionId(newSession.id);
      setSavedSessions((prev) => [newSession, ...prev]);

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err: any) {
      console.error('Analyze error:', err);
      setError(
        err.message || '서류 교차 분석 중 오류가 발생했습니다. 입력 정보를 확인해 주세요.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPreset = (presetId: string) => {
    if (!isApiKeyApproved) {
      setApiKeyModalOpen(true);
      return;
    }
    setError(null);
    setSelectedPresetId(presetId);
    scrollToForm();
  };

  const handleSelectSession = (session: ConsultationSession) => {
    setResult(session.result);
    setActiveSessionId(session.id);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleDeleteSession = (id: string) => {
    setSavedSessions((prev) => prev.filter((s) => s.id !== id));
    if (activeSessionId === id) {
      setActiveSessionId(null);
    }
  };

  const handleClearAllHistory = () => {
    if (confirm('저장된 전화상담 준비 이력을 모두 삭제하시겠습니까?')) {
      setSavedSessions([]);
    }
  };

  const handleCopyFullReport = () => {
    if (!result) return;

    let textReport = `[고용노동부 인재채움뱅크 전화상담 준비 보고서]\n`;
    textReport += `지원자: ${result.script?.applicantName || 'OOO'} | 지원기업: ${result.script?.companyName || 'OO기업'} | 직무: ${result.script?.jobTitle || 'OO'}\n\n`;

    textReport += `# 1. 지원자격 사전검토\n- [${result.qualificationCheck.badge}]\n`;
    textReport += `* 공고 요건: ${result.qualificationCheck.jobRequirements}\n`;
    textReport += `* 지원자 현황: ${result.qualificationCheck.applicantStatus}\n\n`;

    textReport += `# 2. 전화 확인사항 (순차 진행)\n`;
    result.phoneChecklist.forEach((item, i) => {
      textReport += `- □ ${i + 1}번 항목: ${item.title}\n  질문: "${item.question}"\n`;
    });
    textReport += `\n# 3. 기본 상담 스크립트\n${result.script.fullText}\n\n`;

    textReport += `# 4. 자기소개서 수정 요청\n- ${result.coverLetterFeedback.instructions}\n`;

    navigator.clipboard.writeText(textReport);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2500);
  };

  return (
    <div className={`min-h-screen bg-slate-100 font-sans text-slate-900 pb-20 relative ${
      !isApiKeyApproved ? 'overflow-hidden max-h-screen' : ''
    }`}>
      {/* Strict Lock Screen Backdrop Overlay if NOT approved */}
      {!isApiKeyApproved && (
        <div className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center select-none">
          <div className="max-w-md bg-slate-900/90 border border-slate-700/80 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-lg">
              <Lock className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-400 tracking-wider uppercase">SECURITY GATEKEEPER</span>
              <h2 className="text-lg font-bold text-white mt-1">
                Gemini API Key 승인 필수
              </h2>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              본 서비스는 승인된 Gemini API Key 등록 후 이용 가능합니다.<br />
              팝업 창에 올바른 API Key를 입력하여 승인받아 주세요.
            </p>
            <button
              onClick={() => setApiKeyModalOpen(true)}
              className="w-full py-3 bg-[#0052cc] hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition shadow-lg flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Key className="w-4 h-4" />
              <span>🔑 API Key 승인 팝업 열기</span>
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <Header
        onOpenHistory={() => setHistoryOpen(true)}
        savedCount={savedSessions.length}
        onSelectPreset={handleSelectPreset}
        isApiKeyApproved={isApiKeyApproved}
        onOpenApiKeyModal={() => setApiKeyModalOpen(true)}
      />

      {/* Top Warning Banner if NOT approved */}
      {!isApiKeyApproved && (
        <div className="bg-amber-500 text-slate-950 border-b border-amber-600 px-4 py-2.5 shadow-sm sticky top-20 z-20">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-bold">
            <div className="flex items-center space-x-2">
              <Lock className="w-4 h-4 shrink-0" />
              <span>현재 API Key 미승인 상태입니다. 메뉴 및 교차분석 사용을 위해 Gemini API Key 승인이 필요합니다.</span>
            </div>
            <button
              onClick={() => setApiKeyModalOpen(true)}
              className="bg-slate-950 hover:bg-slate-800 text-amber-400 px-3.5 py-1.5 rounded-xl font-bold transition flex items-center space-x-1.5 cursor-pointer shrink-0 shadow-sm"
            >
              <Key className="w-3.5 h-3.5" />
              <span>🔑 API Key 승인 팝업창 열기</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
        {/* Landing Hero Section */}
        <LandingHero
          onStartAnalyze={scrollToForm}
          onSelectPreset={handleSelectPreset}
          isApiKeyApproved={isApiKeyApproved}
          onOpenApiKeyModal={() => setApiKeyModalOpen(true)}
        />

        {/* Form Area Anchor */}
        <div ref={formRef} className="scroll-mt-20">
          <InputForm
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
            onSelectPreset={handleSelectPreset}
            selectedPresetId={selectedPresetId}
            isApiKeyApproved={isApiKeyApproved}
            onOpenApiKeyModal={() => setApiKeyModalOpen(true)}
          />
        </div>

        {/* Error Notification */}
        {error && (
          <div className="bg-rose-50 border-2 border-rose-300 text-rose-900 p-4 rounded-2xl flex items-center space-x-3 text-xs font-semibold shadow-xs">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Analysis Results Display Anchor */}
        {result && (
          <div ref={resultsRef} className="space-y-8 animate-fadeIn scroll-mt-20">
            {/* Top Toolbar for Results */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-bold text-slate-800">
                  교차 분석 완료 결과 (전화상담 준비 완료)
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopyFullReport}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-xs cursor-pointer"
                >
                  {copiedReport ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>전체 결과 복사 완료!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-blue-400" />
                      <span>4대 항목 전체 복사</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Render exact 4 prompt output sections */}
            <div className="space-y-6">
              {/* 1. 지원자격 사전검토 */}
              <QualificationCard check={result.qualificationCheck} />

              {/* 2. 전화 확인사항 (순차 진행) */}
              <SequentialPhoneCall items={result.phoneChecklist} />

              {/* 3. 기본 상담 스크립트 */}
              <ScriptViewer script={result.script} />

              {/* 4. 자기소개서 수정 요청 */}
              <CoverLetterRevision
                feedback={result.coverLetterFeedback}
                applicantName={result.script?.applicantName}
                companyName={result.script?.companyName}
              />
            </div>
          </div>
        )}
      </main>

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        sessions={savedSessions}
        onSelectSession={handleSelectSession}
        onDeleteSession={handleDeleteSession}
        onClearAll={handleClearAllHistory}
      />

      {/* Floating Action Button for Key Modal */}
      {!isApiKeyApproved && (
        <button
          onClick={() => setApiKeyModalOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl shadow-2xl border-2 border-amber-300 flex items-center space-x-2 animate-bounce cursor-pointer active:scale-95"
        >
          <Lock className="w-5 h-5 text-slate-950" />
          <span className="text-xs sm:text-sm">🔑 API Key 승인 팝업 열기</span>
        </button>
      )}

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={apiKeyModalOpen}
        onClose={() => setApiKeyModalOpen(false)}
        isApproved={isApiKeyApproved}
        currentApiKey={currentApiKey}
        onVerifyKey={(keyToTest) => verifyApiKeyOnServer(keyToTest, false)}
        onResetKey={handleResetApiKey}
      />
    </div>
  );
}
