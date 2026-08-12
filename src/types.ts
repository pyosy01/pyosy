export interface QualificationCheck {
  status: 'FULFILLED' | 'NEEDS_CHECK';
  badge: string;
  jobRequirements: string;
  applicantStatus: string;
  details: string[];
}

export interface PhoneChecklistItem {
  id: number;
  itemNumber: number;
  title: string;
  question: string;
  reason: string;
  guideForConsultant: string;
  userStatus?: 'pending' | 'confirmed' | 'rejected' | 'needs_followup';
  consultantNotes?: string;
}

export interface ScriptData {
  applicantName: string;
  companyName: string;
  jobTitle: string;
  fullText: string;
}

export interface CoverLetterFeedback {
  needsRevision: boolean;
  instructions: string;
}

export interface AnalysisResult {
  qualificationCheck: QualificationCheck;
  phoneChecklist: PhoneChecklistItem[];
  script: ScriptData;
  coverLetterFeedback: CoverLetterFeedback;
  rawMarkdown: string;
}

export interface ConsultationSession {
  id: string;
  timestamp: string;
  applicantName: string;
  companyName: string;
  jobTitle: string;
  result: AnalysisResult;
  phoneChecklistState: PhoneChecklistItem[];
  overallNotes: string;
  status: 'PREPARING' | 'CALL_IN_PROGRESS' | 'COMPLETED';
}

export interface PresetCase {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  applicantName: string;
  companyName: string;
  jobTitle: string;
  jobPostingText: string;
  applicantDocText: string;
}
