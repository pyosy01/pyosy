import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  Link as LinkIcon,
  Sparkles,
  Zap,
  Check,
  AlertCircle,
  X,
  FileCode,
  User,
  Building,
  Briefcase,
  Lock,
  ShieldAlert
} from 'lucide-react';
import { PRESET_CASES } from '../data/presets';

interface InputFormProps {
  onAnalyze: (data: {
    jobPostingText: string;
    jobPostingFile?: { mimeType: string; dataBase64: string; filename: string };
    applicantDocText: string;
    applicantDocFile?: { mimeType: string; dataBase64: string; filename: string };
    applicantNameHint?: string;
    companyNameHint?: string;
    jobTitleHint?: string;
  }) => void;
  isLoading: boolean;
  onSelectPreset: (presetId: string) => void;
  selectedPresetId?: string | null;
  isApiKeyApproved?: boolean;
  onOpenApiKeyModal?: () => void;
}

export const InputForm: React.FC<InputFormProps> = ({
  onAnalyze,
  isLoading,
  onSelectPreset,
  selectedPresetId,
  isApiKeyApproved = true,
  onOpenApiKeyModal,
}) => {
  const [jobPostingText, setJobPostingText] = useState('');
  const [jobPostingFile, setJobPostingFile] = useState<{
    mimeType: string;
    dataBase64: string;
    filename: string;
  } | null>(null);

  const [applicantDocText, setApplicantDocText] = useState('');
  const [applicantDocFile, setApplicantDocFile] = useState<{
    mimeType: string;
    dataBase64: string;
    filename: string;
  } | null>(null);

  const [applicantNameHint, setApplicantNameHint] = useState('');
  const [companyNameHint, setCompanyNameHint] = useState('');
  const [jobTitleHint, setJobTitleHint] = useState('');

  const [activeJobTab, setActiveJobTab] = useState<'text' | 'file'>('text');
  const [activeDocTab, setActiveDocTab] = useState<'text' | 'file'>('text');

  const jobFileInputRef = useRef<HTMLInputElement>(null);
  const docFileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'job' | 'doc'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const lowerName = file.name.toLowerCase();
    const isPdf = file.type === 'application/pdf' || lowerName.endsWith('.pdf');
    const isImage = file.type.startsWith('image/') || /\.(png|jpe?g|webp|gif|bmp)$/i.test(lowerName);

    if (isPdf || isImage) {
      const mimeType = isPdf
        ? 'application/pdf'
        : file.type || (lowerName.endsWith('.png') ? 'image/png' : 'image/jpeg');

      const reader = new FileReader();
      reader.onload = (event) => {
        const resultStr = event.target?.result as string;
        const base64String = resultStr?.includes(',') ? resultStr.split(',')[1] : '';
        if (!base64String) return;

        const fileObj = {
          mimeType,
          dataBase64: base64String,
          filename: file.name,
        };

        if (type === 'job') {
          setJobPostingFile(fileObj);
        } else {
          setApplicantDocFile(fileObj);
        }
      };
      reader.readAsDataURL(file);
    } else {
      // Plain text or HWP text read
      const reader = new FileReader();
      reader.onload = (event) => {
        const textContent = (event.target?.result as string) || '';
        if (type === 'job') {
          setJobPostingText((prev) => (prev ? `${prev}\n\n${textContent}` : textContent));
          setJobPostingFile({
            mimeType: 'text/plain',
            dataBase64: btoa(unescape(encodeURIComponent(textContent))),
            filename: file.name,
          });
        } else {
          setApplicantDocText((prev) => (prev ? `${prev}\n\n${textContent}` : textContent));
          setApplicantDocFile({
            mimeType: 'text/plain',
            dataBase64: btoa(unescape(encodeURIComponent(textContent))),
            filename: file.name,
          });
        }
      };
      reader.readAsText(file);
    }
  };

  const handlePresetClick = (presetId: string) => {
    const preset = PRESET_CASES.find((p) => p.id === presetId);
    if (!preset) return;

    setJobPostingText(preset.jobPostingText);
    setJobPostingFile(null);
    setApplicantDocText(preset.applicantDocText);
    setApplicantDocFile(null);

    setApplicantNameHint(preset.applicantName);
    setCompanyNameHint(preset.companyName);
    setJobTitleHint(preset.jobTitle);

    setActiveJobTab('text');
    setActiveDocTab('text');

    onSelectPreset(presetId);
  };

  React.useEffect(() => {
    if (selectedPresetId) {
      handlePresetClick(selectedPresetId);
    }
  }, [selectedPresetId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isApiKeyApproved) {
      if (onOpenApiKeyModal) onOpenApiKeyModal();
      return;
    }

    if (
      (!jobPostingText.trim() && !jobPostingFile) ||
      (!applicantDocText.trim() && !applicantDocFile)
    ) {
      alert('채용공고 정보와 지원자 서류(이력서/자기소개서)를 모두 입력 또는 첨부해 주세요.');
      return;
    }

    onAnalyze({
      jobPostingText,
      jobPostingFile: jobPostingFile || undefined,
      applicantDocText,
      applicantDocFile: applicantDocFile || undefined,
      applicantNameHint: applicantNameHint || undefined,
      companyNameHint: companyNameHint || undefined,
      jobTitleHint: jobTitleHint || undefined,
    });
  };

  return (
    <div id="analyze-form" className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
      {!isApiKeyApproved && (
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-amber-900 font-medium">
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              API Key가 승인되지 않아 메뉴 및 분석 기능 사용이 제한됩니다. 승인 후 이용해 주세요.
            </span>
          </div>
          <button
            type="button"
            onClick={onOpenApiKeyModal}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-bold text-[11px] transition cursor-pointer shrink-0 self-start sm:self-auto shadow-xs"
          >
            🔑 API Key 승인받기
          </button>
        </div>
      )}

      {/* Header bar */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            1. 채용공고 및 지원서류 입력
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            기업의 채용공고와 지원자의 이력서·자기소개서(파일 또는 텍스트)를 입력하면 AI가 실무용 검토안을 생성합니다.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            실무 체험 시나리오:
          </span>
          {PRESET_CASES.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handlePresetClick(preset.id)}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-slate-700 font-medium transition shadow-xs flex items-center gap-1.5"
            >
              <span>{preset.badge.slice(0, 2)}</span>
              <span>{preset.title.split(':')[1] || preset.title}</span>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Optional Context Inputs (Applicant, Company, Job Title) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-500" />
              지원자 이름 (선택)
            </label>
            <input
              type="text"
              placeholder="예: 홍길동 (자동 추출 가능)"
              value={applicantNameHint}
              onChange={(e) => setApplicantNameHint(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <Building className="w-3.5 h-3.5 text-slate-500" />
              지원 기업명 (선택)
            </label>
            <input
              type="text"
              placeholder="예: (주)한국물류 (자동 추출 가능)"
              value={companyNameHint}
              onChange={(e) => setCompanyNameHint(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-slate-500" />
              지원 직무 (선택)
            </label>
            <input
              type="text"
              placeholder="예: 창고 관리 직무 (자동 추출 가능)"
              value={jobTitleHint}
              onChange={(e) => setJobTitleHint(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Two-Column Document Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. Job Posting Input */}
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
            <div className="bg-slate-100/80 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Building className="w-4 h-4 text-blue-600" />
                기업 채용공고 (필수)
              </span>
              <div className="flex bg-slate-200/80 p-0.5 rounded-md text-xs">
                <button
                  type="button"
                  onClick={() => setActiveJobTab('text')}
                  className={`px-2.5 py-1 rounded-sm font-medium transition ${
                    activeJobTab === 'text'
                      ? 'bg-white text-blue-700 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  텍스트/링크
                </button>
                <button
                  type="button"
                  onClick={() => setActiveJobTab('file')}
                  className={`px-2.5 py-1 rounded-sm font-medium transition ${
                    activeJobTab === 'file'
                      ? 'bg-white text-blue-700 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  파일 업로드
                </button>
              </div>
            </div>

            <div className="p-4 space-y-3">
              {activeJobTab === 'text' ? (
                <div>
                  <textarea
                    rows={7}
                    placeholder="채용공고의 필수 자격요건, 우대사항, 담당업무, 학력, 경력, 필수 자격증 등을 붙여넣으세요..."
                    value={jobPostingText}
                    onChange={(e) => setJobPostingText(e.target.value)}
                    className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none resize-none font-sans leading-relaxed text-slate-800"
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <input
                    type="file"
                    ref={jobFileInputRef}
                    onChange={(e) => handleFileUpload(e, 'job')}
                    accept=".pdf,.png,.jpg,.jpeg,.txt,.hwp"
                    className="hidden"
                  />
                  <div
                    onClick={() => jobFileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/30 p-6 rounded-xl text-center cursor-pointer transition"
                  >
                    <Upload className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-slate-700">
                      클릭하여 채용공고 파일 선택
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      지원 포맷: PDF, PNG, JPG, HWP, TXT
                    </p>
                  </div>

                  {jobPostingFile && (
                    <div className="flex items-center justify-between p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-xs">
                      <div className="flex items-center space-x-2 truncate">
                        <FileCode className="w-4 h-4 text-blue-600 shrink-0" />
                        <span className="font-medium text-blue-900 truncate">
                          {jobPostingFile.filename}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setJobPostingFile(null)}
                        className="text-slate-400 hover:text-rose-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 2. Applicant Resume & Cover Letter Input */}
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
            <div className="bg-slate-100/80 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <User className="w-4 h-4 text-indigo-600" />
                지원자 이력서 & 자기소개서 (필수)
              </span>
              <div className="flex bg-slate-200/80 p-0.5 rounded-md text-xs">
                <button
                  type="button"
                  onClick={() => setActiveDocTab('text')}
                  className={`px-2.5 py-1 rounded-sm font-medium transition ${
                    activeDocTab === 'text'
                      ? 'bg-white text-indigo-700 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  텍스트
                </button>
                <button
                  type="button"
                  onClick={() => setActiveDocTab('file')}
                  className={`px-2.5 py-1 rounded-sm font-medium transition ${
                    activeDocTab === 'file'
                      ? 'bg-white text-indigo-700 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  파일 업로드
                </button>
              </div>
            </div>

            <div className="p-4 space-y-3">
              {activeDocTab === 'text' ? (
                <div>
                  <textarea
                    rows={7}
                    placeholder="지원자의 이력서(학력, 경력, 보유자격증) 및 자기소개서 내용 전체를 붙여넣으세요..."
                    value={applicantDocText}
                    onChange={(e) => setApplicantDocText(e.target.value)}
                    className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none resize-none font-sans leading-relaxed text-slate-800"
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <input
                    type="file"
                    ref={docFileInputRef}
                    onChange={(e) => handleFileUpload(e, 'doc')}
                    accept=".pdf,.png,.jpg,.jpeg,.txt,.hwp"
                    className="hidden"
                  />
                  <div
                    onClick={() => docFileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-indigo-500 bg-slate-50 hover:bg-indigo-50/30 p-6 rounded-xl text-center cursor-pointer transition"
                  >
                    <Upload className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-slate-700">
                      클릭하여 지원자 서류 파일 선택
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      지원 포맷: PDF, PNG, JPG, HWP, TXT
                    </p>
                  </div>

                  {applicantDocFile && (
                    <div className="flex items-center justify-between p-2.5 bg-indigo-50 border border-indigo-200 rounded-lg text-xs">
                      <div className="flex items-center space-x-2 truncate">
                        <FileCode className="w-4 h-4 text-indigo-600 shrink-0" />
                        <span className="font-medium text-indigo-900 truncate">
                          {applicantDocFile.filename}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setApplicantDocFile(null)}
                        className="text-slate-400 hover:text-rose-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm text-white shadow-md flex items-center justify-center space-x-2 transition cursor-pointer ${
              isLoading
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-[#0052cc] hover:bg-blue-700 shadow-blue-500/20 active:scale-[0.99]'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>교차 분석 및 실무 검토안 생성 중...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>교차 분석 및 실무 사전검토 시작</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
