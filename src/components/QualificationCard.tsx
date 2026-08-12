import React from 'react';
import { QualificationCheck } from '../types';
import { CheckCircle, AlertTriangle, Briefcase, UserCheck, ShieldAlert } from 'lucide-react';

interface QualificationCardProps {
  check: QualificationCheck;
}

export const QualificationCard: React.FC<QualificationCardProps> = ({ check }) => {
  const isFulfilled = check.status === 'FULFILLED';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Section Header */}
      <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-blue-400 font-mono font-bold text-sm"># 1.</span>
          <h2 className="text-base font-bold tracking-tight">지원자격 사전검토</h2>
        </div>
        {/* Badge */}
        <div
          className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold flex items-center space-x-1.5 shadow-xs ${
            isFulfilled
              ? 'bg-emerald-500 text-white'
              : 'bg-rose-600 text-white'
          }`}
        >
          {isFulfilled ? (
            <CheckCircle className="w-4 h-4 text-emerald-100" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-100" />
          )}
          <span>{check.badge}</span>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-6 space-y-5">
        {/* Summary Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 mb-2">
              <Briefcase className="w-4 h-4 text-blue-600" />
              <span>채용공고 주요 요건</span>
            </div>
            <p className="text-xs text-slate-800 font-medium leading-relaxed bg-white p-3 rounded-lg border border-slate-200/80">
              {check.jobRequirements || '공고 요건 요약 정보'}
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 mb-2">
              <UserCheck className="w-4 h-4 text-indigo-600" />
              <span>지원자 서류 현황</span>
            </div>
            <p className="text-xs text-slate-800 font-medium leading-relaxed bg-white p-3 rounded-lg border border-slate-200/80">
              {check.applicantStatus || '지원자 현황 요약 정보'}
            </p>
          </div>
        </div>

        {/* Detailed Reasons / Discrepancies */}
        {check.details && check.details.length > 0 && (
          <div
            className={`p-4 rounded-xl border ${
              isFulfilled
                ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                : 'bg-rose-50/70 border-rose-200 text-rose-950'
            }`}
          >
            <div className="flex items-center space-x-2 font-bold text-xs mb-2">
              <ShieldAlert
                className={`w-4 h-4 ${
                  isFulfilled ? 'text-emerald-600' : 'text-rose-600'
                }`}
              />
              <span>상세 검토 결과 및 사유</span>
            </div>
            <ul className="space-y-1.5 pl-5 list-disc text-xs leading-relaxed">
              {check.details.map((detail, idx) => (
                <li key={idx} className="font-medium">
                  {detail}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
