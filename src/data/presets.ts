import { PresetCase } from '../types';

export const PRESET_CASES: PresetCase[] = [
  {
    id: 'preset-1',
    title: '시나리오 1: 경력 미달 및 자격증 누락',
    subtitle: '지게차 자격증 미기재 및 물류 경력 6개월 (공고 기준 1년 미달)',
    badge: '🔴 자격 검토 필요',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    applicantName: '홍길동',
    companyName: '○○물류',
    jobTitle: '창고 관리 및 물류기사',
    jobPostingText: `[채용공고] (주)OO물류 창고 관리 및 물류기사 모집
1. 담당업무: 창고 입출고 관리, 지게차 운전, 재고 조사
2. 지원자격
   - 학력: 고졸 이상
   - 경력: 물류 또는 창고관리 관련 경력 1년 이상 필수
   - 필수 자격증: 지게차 운전기능사 자격증 필수 소지자
3. 우대사항: 인근 거주자, 보훈대상자
4. 근무지: 경기도 이천시 물류센터`,
    applicantDocText: `[이력서 및 자기소개서]
성명: 홍길동 (남, 28세)
연락처: 010-1234-5678
학력: OO공업고등학교 졸업

[경력사항]
- Delta물류 창고보조 (2024.03 ~ 2024.08 / 6개월 근무)
  : 물류 상하차 및 단순 분류 작업 담당

[자격증]
- 운전면허 1종 보통 (2020년 취득)
(지게차 자격증 미기재)

[자기소개서]
지원동기: 물류 현장에서 6개월간 일하며 물류 흐름의 중요성을 배웠습니다. OO물류의 창고 관리 직무에서 빠른 적응력과 책임감으로 기여하고자 지원합니다. 성실하게 임하겠습니다.`,
  },
  {
    id: 'preset-2',
    title: '시나리오 2: 타 기업명 오기재 자소서',
    subtitle: '경력 및 자격요건 충족하나 자소서 본문에 OO전자 기재',
    badge: '🔴 자소서 수정 필요',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    applicantName: '김철수',
    companyName: '○○푸드',
    jobTitle: '식품 품질관리원',
    jobPostingText: `[채용공고] (주)OO푸드 품질관리팀 담당자 채용
1. 담당업무: 식품 제조 공정 품질 검사, 위생 관리, HACCP 문서 작성
2. 지원자격
   - 학력: 전문대졸 이상 (식품관련 학과 우대)
   - 경력: 품질관리 경력 1년 이상
3. 자격사항: 식품위생사 또는 유통관리사 우대
4. 근무지: 충북 진천군`,
    applicantDocText: `[이력서 및 자기소개서]
성명: 김철수 (남, 31세)
학력: OO대학교 식품영양학과 졸업

[경력사항]
- Alpha식품 품질관리팀 (2022.01 ~ 2024.02 / 2년 1개월 근무)
  : HACCP 관리 및 제품 품질 검사

[자격증]
- 식품위생사 (2021년 취득)

[자기소개서]
저는 지난 2년간 식품 품질관리 실무를 수행하며 철저한 위생 관리의 중요성을 체득했습니다. 저의 체계적인 경험과 열정을 바탕으로 OO전자의 글로벌 제품 경쟁력을 극대화하고 품질 신뢰도를 높이는데 기여하겠습니다.`,
  },
  {
    id: 'preset-3',
    title: '시나리오 3: 지원 자격 완벽 충족',
    subtitle: '필수 경력 및 자격조건 모두 적합하며 서류 결함 없음',
    badge: '🟢 자격 충족',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    applicantName: '이영희',
    companyName: '미래IT',
    jobTitle: '웹 프론트엔드 개발자',
    jobPostingText: `[채용공고] (주)미래IT 웹 프론트엔드 개발자 모집
1. 담당업무: React/TypeScript 기반 자사 서비스 UI/UX 개발
2. 지원자격
   - 학력: 무관
   - 경력: Web Frontend 개발 경력 3년 이상 필수
   - 필수 기술: React, TypeScript, Tailwind CSS
3. 근무지: 서울시 강남구 테헤란로`,
    applicantDocText: `[이력서 및 자기소개서]
성명: 이영희 (여, 29세)
학력: OO대학교 컴퓨터공학과 졸업

[경력사항]
- TechSolution 프론트엔드 개발자 (2021.03 ~ 현재 / 3년 5개월 근무)
  : React, TypeScript 기반 웹 서비스 구축 및 maintenance

[자격증]
- 정보처리기사 (2020년 취득)

[자기소개서]
3년 넘게 React 및 TypeScript 기반의 서비스를 개발하며 고성능 UI 구축 노하우를 쌓았습니다. 미래IT의 혁신적인 서비스 성장에 바로 투입되어 성과를 낼 자신이 있습니다.`,
  },
];
