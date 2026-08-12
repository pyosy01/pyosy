import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  PhoneCall,
  FileCheck2,
  MessageSquareText,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  FileSearch,
  CheckSquare,
  Send,
  Users,
  Building2,
  Heart,
  MessageCircle,
  ThumbsUp
} from 'lucide-react';
import { PRESET_CASES } from '../data/presets';

interface LandingHeroProps {
  onStartAnalyze: () => void;
  onSelectPreset: (presetId: string) => void;
  isApiKeyApproved?: boolean;
  onOpenApiKeyModal?: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartAnalyze,
  onSelectPreset,
  isApiKeyApproved = true,
  onOpenApiKeyModal,
}) => {
  const handleProtectedAction = (action: () => void) => {
    if (!isApiKeyApproved) {
      if (onOpenApiKeyModal) onOpenApiKeyModal();
      return;
    }
    action();
  };
  const [activeStep, setActiveStep] = useState(0);

  const stepsData = [
    {
      stepNum: 'STEP 01',
      title: '지원자격 사전검토',
      desc: '채용공고의 필수 자격/우대 조건과 지원자 이력서를 1:1 교차 대조하여 완벽 충족·확인필요 판정 및 근거를 자동 제시합니다.',
      icon: FileSearch,
    },
    {
      stepNum: 'STEP 02',
      title: '전화 확인사항 순차 진행',
      desc: '미기재 자격, 경력 공백, 입사 희망일 등 1~5번 항목별로 순차적 질문 대본과 실시간 확인 상태 및 메모를 기재합니다.',
      icon: PhoneCall,
    },
    {
      stepNum: 'STEP 03',
      title: '기본 상담 스크립트',
      desc: '자연스러운 통화 오프닝, 핵심 질문 가이드, 우호적인 종료 인사말까지 컨설턴트 맞춤형 전화 스크립트를 제공합니다.',
      icon: MessageSquareText,
    },
    {
      stepNum: 'STEP 04',
      title: '자기소개서 수정 요청',
      desc: '통화 종료 후 지원자에게 카카오톡이나 문자로 즉시 발송 가능한 핵심 완성도 보완 단문 지침을 생성합니다.',
      icon: Send,
    },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden mb-8 transition-all relative">
      {/* Upper Hero Section */}
      <div className="relative bg-white pt-10 pb-12 px-6 sm:px-10 lg:px-12 overflow-hidden border-b border-slate-200">
        {/* Background Decorative Circles */}
        <div className="absolute top-4 right-12 w-64 h-64 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-20 right-4 w-28 h-28 bg-blue-500/15 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-80 h-80 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Top Tag */}
          <div className="inline-block bg-[#0052cc] text-white text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-sm mb-4 shadow-xs">
            AI ASSISTANT
          </div>

          {/* Main Title */}
          <h1 className="text-2xl sm:text-4xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-3xl">
            서류 검토부터 전화 상담까지,<br />
            <span className="text-slate-900 font-extrabold">
              1분 만에 준비하는 컨설턴트 전용 AI 파트너
            </span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl font-normal">
            수많은 채용공고 요건과 지원자 서류를 대조하느라 시간을 허비하지 마세요. 
            AI가 필수자격 충족 여부 사전검토, 순차 진행형 전화 질문지, 친근한 상담 스크립트, 그리고 알림톡 전송용 자소서 수정안까지 한번에 제시합니다.
          </p>

          {/* Main Hero Visual Card Stack */}
          <div className="mt-8 relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-slate-900 text-white min-h-[300px] sm:min-h-[360px] flex flex-col justify-between p-6 sm:p-10">
            {/* Visual Image / Graphic Background Overlay */}
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-35 mix-blend-luminosity"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80')`
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent" />

            <div className="relative z-10">
              <div className="flex items-center space-x-2 text-blue-300 text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>고용노동부 인재채움뱅크 · 취업컨설턴트 전용</span>
              </div>
            </div>

            {/* Bottom Controls / Overlapping Blue Box */}
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6 pt-12">
              <div className="flex items-center space-x-3 text-xs font-semibold text-slate-300 tracking-wider">
                <button
                  onClick={() => handleProtectedAction(onStartAnalyze)}
                  className="hover:text-white transition flex items-center gap-1 cursor-pointer"
                >
                  <span>START</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <span>|</span>
                <a
                  href="#quick-presets"
                  onClick={(e) => {
                    if (!isApiKeyApproved) {
                      e.preventDefault();
                      if (onOpenApiKeyModal) onOpenApiKeyModal();
                    }
                  }}
                  className="hover:text-white transition"
                >
                  PRESETS
                </a>
              </div>

              {/* Overlapping Floating Blue Box (About Platform style) */}
              <div className="bg-[#0052cc] text-white p-5 sm:p-6 rounded-2xl max-w-md shadow-xl border border-blue-400/30 sm:-mb-14 sm:-mr-4 transform hover:-translate-y-1 transition duration-300">
                <div className="text-xl text-blue-200 font-serif leading-none mb-2">“</div>
                <h3 className="text-base font-bold text-white mb-1.5 flex items-center gap-2">
                  <span>About AI Platform</span>
                </h3>
                <p className="text-xs text-blue-100 leading-relaxed font-normal">
                  컨설턴트와 구직자가 어우러져 실질적인 취업 성과를 만들기 위한 지능형 원스톱 보조 플랫폼입니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PRESETS Section (Presets Showcase with Clean Watermark) */}
      <div id="quick-presets" className="relative p-6 sm:p-10 bg-slate-50 border-b border-slate-200 overflow-hidden">
        {/* Big Background Watermark Text */}
        <div className="absolute top-2 left-6 text-[80px] sm:text-[130px] font-black text-slate-200/60 select-none tracking-tighter leading-none pointer-events-none">
          SCENARIO
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                실무 시나리오 1초 체험
              </h2>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                클릭 한 번으로 대표 연계 기업 실무 사례를 자동 입력하여 교차 분석을 테스트해보세요.
              </p>
            </div>
            <div className="flex items-center space-x-1">
              <button className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition shadow-2xs">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition shadow-2xs">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Preset Cards Grid (Design inspired by image) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PRESET_CASES.map((preset, idx) => {
              const isFirst = idx === 0;
              return (
                <div
                  key={preset.id}
                  onClick={() => handleProtectedAction(() => onSelectPreset(preset.id))}
                  className={`p-5 rounded-2xl transition-all cursor-pointer flex flex-col justify-between border shadow-xs relative group ${
                    isFirst
                      ? 'bg-[#0052cc] text-white border-blue-600 hover:bg-blue-700 shadow-md'
                      : 'bg-white text-slate-900 border-slate-200 hover:border-blue-400 hover:shadow-md'
                  }`}
                >
                  <div>
                    {/* Header Row */}
                    <div className="flex items-center justify-between text-[11px] mb-3">
                      <div className="flex items-center space-x-1.5">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          isFirst ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {preset.applicantName.slice(0, 1)}
                        </div>
                        <span className={`font-semibold ${isFirst ? 'text-blue-100' : 'text-slate-600'}`}>
                          지원자: {preset.applicantName}
                        </span>
                      </div>
                      <span className={`font-mono ${isFirst ? 'text-blue-200' : 'text-slate-500'}`}>
                        {preset.companyName}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <h3 className={`text-sm font-bold mb-2 leading-snug ${isFirst ? 'text-white' : 'text-slate-900 group-hover:text-[#0052cc]'}`}>
                      {preset.title}
                    </h3>
                    <p className={`text-xs line-clamp-2 leading-relaxed mb-4 ${isFirst ? 'text-blue-100' : 'text-slate-500'}`}>
                      {preset.subtitle}
                    </p>
                  </div>

                  {/* Bottom Info Row */}
                  <div>
                    {/* Progress Indicator */}
                    <div className="w-full bg-slate-200/50 rounded-full h-1.5 mb-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${isFirst ? 'bg-amber-300' : 'bg-[#0052cc]'}`}
                        style={{ width: `${100 - idx * 20}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <span className={`font-medium ${isFirst ? 'text-blue-100' : 'text-slate-500'}`}>
                        직무: {preset.jobTitle}
                      </span>

                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] tracking-wider ${
                        isFirst
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-blue-50 text-[#0052cc] border border-blue-200'
                      }`}>
                        {isFirst ? '대표 시나리오' : `사례 0${idx + 1}`}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Middle Banner */}
      <div className="p-6 sm:p-10 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#2c3d59] text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md relative overflow-hidden">
            <div className="space-y-1.5 z-10 text-center md:text-left">
              <div className="inline-block bg-amber-400 text-slate-950 font-black text-[11px] px-2.5 py-0.5 rounded-sm mb-1">
                인재채움뱅크 실무 지원
              </div>
              <h3 className="text-base sm:text-lg font-bold text-amber-300">
                취업컨설턴트 전화상담 지원 AI 시스템
              </h3>
              <p className="text-xs text-slate-300">
                채용공고 요건과 지원자 서류 교차분석 · 순차 전화 질문지 · 표준 대본 · 자소서 수정안 즉시 작성
              </p>
            </div>

            <div className="z-10 shrink-0">
              <button
                onClick={onStartAnalyze}
                className="px-6 py-3 bg-[#0052cc] hover:bg-blue-600 text-white font-bold text-xs rounded-full shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                <span>지금 분석 시작하기</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* WORKFLOW Section (4-Step Workflow with Clean Watermark) */}
      <div id="workflow-steps" className="relative p-6 sm:p-10 bg-slate-50 border-t border-slate-200 overflow-hidden">
        {/* Big Background Watermark Text */}
        <div className="absolute top-2 left-6 text-[80px] sm:text-[130px] font-black text-slate-200/60 select-none tracking-tighter leading-none pointer-events-none">
          WORKFLOW
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                실무 처리 4단계 프로세스
              </h2>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                취업컨설턴트의 전화상담 준비 및 실행을 고려한 순차적 지원 체계
              </p>
            </div>
            <div className="flex items-center space-x-1">
              <button className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition shadow-2xs">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition shadow-2xs">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Circular Graphic Container */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full overflow-hidden border-4 border-white shadow-xl bg-slate-200">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80"
                  alt="Process illustration"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0052cc]/40 to-transparent" />
              </div>
            </div>

            {/* Right Stepper Flow Timeline */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-xs font-bold text-[#0052cc] uppercase mb-1">
                  {stepsData[activeStep].stepNum}
                </div>
                <h3 className="text-base font-extrabold text-slate-900 mb-2">
                  {stepsData[activeStep].title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {stepsData[activeStep].desc}
                </p>
              </div>

              {/* Step Node Timeline */}
              <div className="relative pt-4">
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
                <div className="grid grid-cols-4 gap-2 relative z-10">
                  {stepsData.map((s, idx) => {
                    const IconComp = s.icon;
                    const isActive = activeStep === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => setActiveStep(idx)}
                        className="flex flex-col items-center cursor-pointer group"
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                          isActive
                            ? 'bg-[#0052cc] text-white border-[#0052cc] shadow-md scale-110'
                            : 'bg-white text-slate-400 border-slate-300 group-hover:border-blue-400'
                        }`}>
                          <IconComp className="w-4 h-4" />
                        </div>
                        <span className={`text-[11px] font-bold mt-2 text-center transition-colors ${
                          isActive ? 'text-[#0052cc]' : 'text-slate-500'
                        }`}>
                          {s.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navy Statistics Grid */}
      <div className="bg-[#0d1b32] text-white py-8 px-6 sm:px-10 border-t border-slate-800">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-100">
              인재채움뱅크 취업컨설턴트 AI 지원 현황
            </h3>
          </div>

          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
              35,600건
            </div>
            <div className="text-xs text-slate-300 font-semibold tracking-wider uppercase">
              누적분석/검토완료
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

