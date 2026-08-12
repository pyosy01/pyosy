import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Increase payload limit for file/base64 uploads
app.use(express.json({ limit: "20mb" }));

// Initialize Gemini client lazily or on API call
function getGeminiClient(customApiKey?: string) {
  const apiKey = typeof customApiKey === 'string' ? customApiKey.trim() : '';
  if (!apiKey) {
    throw new Error("Gemini API Key가 입력되지 않았거나 승인받지 못했습니다. API Key를 직접 입력해 주세요.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Verification Endpoint for API Key Approval
app.post("/api/verify-key", async (req, res) => {
  try {
    const { apiKey } = req.body || {};
    const keyToUse = typeof apiKey === 'string' ? apiKey.trim() : '';

    if (!keyToUse) {
      return res.status(400).json({
        approved: false,
        error: "API Key가 입력되지 않았습니다. 승인받을 Gemini API Key를 직접 입력해 주세요.",
      });
    }

    const ai = getGeminiClient(keyToUse);

    // Call a minimal request to verify key approval
    const candidateModels = ["gemini-3.6-flash", "gemini-flash-latest"];
    let verified = false;
    let lastErr = null;

    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: [{ role: "user", parts: [{ text: "hi" }] }],
        });
        if (response) {
          verified = true;
          break;
        }
      } catch (err) {
        lastErr = err;
      }
    }

    if (verified) {
      return res.json({
        approved: true,
        message: "API Key가 성공적으로 승인되었습니다. 모든 메뉴를 이용하실 수 있습니다.",
      });
    } else {
      const errMsg = lastErr?.message || "";
      if (errMsg.includes("API key not valid") || errMsg.includes("API_KEY_INVALID") || errMsg.includes("400")) {
        return res.status(401).json({
          approved: false,
          error: "유효하지 않은 API Key입니다. Google AI Studio에서 발급받은 올바른 API Key를 입력해 주세요.",
        });
      }
      return res.status(401).json({
        approved: false,
        error: `API Key 승인 실패: ${errMsg || "유효하지 않거나 승인되지 않은 API Key입니다."}`,
      });
    }
  } catch (err: any) {
    const errMsg = err?.message || "";
    if (errMsg.includes("API key not valid") || errMsg.includes("API_KEY_INVALID")) {
      return res.status(401).json({
        approved: false,
        error: "유효하지 않은 API Key입니다. Google AI Studio에서 발급받은 올바른 API Key를 입력해 주세요.",
      });
    }
    return res.status(401).json({
      approved: false,
      error: `API Key 승인 실패: ${errMsg || "유효하지 않거나 승인되지 않은 API Key입니다."}`,
    });
  }
});

app.post("/api/analyze", async (req, res) => {
  try {
    const {
      jobPostingText,
      jobPostingFile,
      applicantDocText,
      applicantDocFile,
      applicantNameHint,
      companyNameHint,
      jobTitleHint,
      apiKey,
    } = req.body;

    if (
      (!jobPostingText && !jobPostingFile) ||
      (!applicantDocText && !applicantDocFile)
    ) {
      return res.status(400).json({
        error: "채용공고 정보와 지원자 서류(이력서/자기소개서) 정보를 모두 입력해 주세요.",
      });
    }

    const ai = getGeminiClient(apiKey);

    const systemPrompt = `
당신은 대한민국 「고용노동부 인재채움뱅크」 취업컨설턴트의 업무를 밀착 지원하는 실무 전용 AI Assistant이다.
완벽한 자소서를 작성하는 첨삭 전문가가 아니라, 컨설턴트가 전화상담 전반을 빠르고 정확하게 준비할 수 있도록 돕는 조력자 역할을 수행한다.

# GOAL
- 사용자가 업로드한 기업 채용공고, 지원자의 이력서, 자기소개서 파일을 교차 분석하여 지원 자격을 사전 검토한다.
- 전화상담 시 반드시 확인해야 할 핵심 사항들을 한 번에 모두 출력하지 않고, 사용자와 순차적으로 하나씩 질문하며 소통할 수 있도록 안내한다.
- 불필요한 수정 요청을 배제하고, 기업 제출 가능 수준을 충족하기 위한 자기소개서 수정 방향을 안내한다. (서류의 완벽함이 아니라 전달 가능한 수준)
- 컨설턴트의 서류 검토 및 통화 준비 시간을 최소화하여 업무 효율을 극대화한다.

# INSTRUCTIONS
1. 파일 인식 및 교차 분석: 업로드된 채용공고, 이력서, 자기소개서 파일을 상호 대조하여 불일치 사항과 필수 요건 충족 여부를 확인한다.
2. 지원자격 사전검토: 필수 자격증, 경력, 학력, 면허 등의 조건 충족 여부를 판단하여 지원 가능 여부를 판정한다.
3. 순차적 확인사항 안내: 전화 확인이 필요한 항목들을 작성하되, UI에서 1번 항목부터 순차적으로 하나씩 진행할 수 있도록 항목별로 명확히 분리하여 구성한다.
4. 기본 상담 스크립트 작성: 컨설턴트가 통화 시작 시 즉시 활용할 수 있는 표준 안내 문구를 간결하게 작성한다. (지원자 이름, 지원 기업명, 지원 직무 파악하여 반영)
5. 자기소개서 수정 판단: 표현의 어색함이나 문장 길이는 수정 대상에서 제외하고, 타 기업명 오기재, 직무 불일치, 내용 심각한 부족, 필수 정보 누락 등 치명적 결함이 있는 경우에만 수정 방향을 제시한다.

# CONSTRAINTS
- 면접관, 채용담당자, 전면적인 자소서 첨삭 전문가의 톤앤매너를 절대 사용하지 않는다.
- 성격의 장단점, 입사 후 포부, 팀워크 등 일반적인 면접 질문은 절대 생성하지 않는다.
- 전화 확인사항은 통화 중 한눈에 볼 수 있도록 핵심 위주로 구성한다.

# MANDATORY OUTPUT FORMAT
반드시 아래의 JSON 구조로 응답하세요. 다른 설명 문구 없이 오직 JSON만 반환하세요.

{
  "qualificationCheck": {
    "status": "FULFILLED" | "NEEDS_CHECK",
    "badge": "🟢 지원 자격 충족" 또는 "🔴 확인 필요",
    "jobRequirements": "공고 요건 요약 (예: 경력 1년 이상, 지게차 운전기능사 필수)",
    "applicantStatus": "지원자 현황 요약 (예: 경력 6개월, 자격증 확인 안 됨)",
    "details": [
      "상세 확인 사유 1",
      "상세 확인 사유 2"
    ]
  },
  "phoneChecklist": [
    {
      "id": 1,
      "itemNumber": 1,
      "title": "확인 항목 제목 (예: 지원 가능 여부 확인)",
      "question": "지원자에게 전화로 물어볼 실제 질문 문구 (예: 지게차 자격증을 보유하고 계신지, 경력 증빙이 가능하신지 확인)",
      "reason": "확인이 필요한 구체적 이유 (예: 공고상 필수 요건이나 이력서에 미기재됨)",
      "guideForConsultant": "컨설턴트 대응 가이드 (예: 자격증 미보유 시 접수 불가 안내 또는 추가 제출 요청)"
    }
  ],
  "script": {
    "applicantName": "지원자 이름 (파악 불가시 'OOO')",
    "companyName": "지원 기업명 (파악 불가시 'OO기업')",
    "jobTitle": "지원 직무 (파악 불가시 'OO')",
    "fullText": "안녕하세요.\\n고용노동부 인재채움뱅크입니다.\\n홍길동님 맞으실까요?\\n○○기업 창고 관리 직무에 지원해 주셔서 연락드렸습니다.\\n저희는 서류접수를 도와드리고 있습니다.\\n몇 가지 확인드리겠습니다."
  },
  "coverLetterFeedback": {
    "needsRevision": true | false,
    "instructions": "필요한 경우에만 핵심 수정 방향 안내 (예: 자기소개서 본문에 타 기업명(OO전자)이 기재되어 있습니다. 지원 기업명으로 수정하도록 안내해 주세요.) / 불필요 시 '해당 없음'"
  },
  "rawMarkdown": "정확히 아래 포맷을 그대로 준수한 마크다운 문자열:\\n# 1. 지원자격 사전검토\\n...\\n# 2. 전화 확인사항 (순차 진행)\\n...\\n# 3. 기본 상담 스크립트\\n...\\n# 4. 자기소개서 수정 요청\\n..."
}
`;

    const promptParts: any[] = [];

    let combinedPrompt = systemPrompt + "\n\n[입력 데이터 정보]\n";
    if (applicantNameHint) combinedPrompt += `- 지원자 이름 힌트: ${applicantNameHint}\n`;
    if (companyNameHint) combinedPrompt += `- 지원 기업명 힌트: ${companyNameHint}\n`;
    if (jobTitleHint) combinedPrompt += `- 지원 직무 힌트: ${jobTitleHint}\n`;

    if (jobPostingText) {
      combinedPrompt += `\n--- [1. 지원 채용공고 정보] ---\n${jobPostingText}\n`;
    }
    if (applicantDocText) {
      combinedPrompt += `\n--- [2. 지원자 이력서/자기소개서 정보] ---\n${applicantDocText}\n`;
    }

    promptParts.push({ text: combinedPrompt });

    // Handle attached binary files if any (e.g. PDF or Image)
    if (jobPostingFile && jobPostingFile.dataBase64) {
      promptParts.push({ text: `\n[첨부파일 1: 기업 채용공고 파일 (${jobPostingFile.filename || 'job_posting'})]` });
      promptParts.push({
        inlineData: {
          mimeType: jobPostingFile.mimeType || "application/pdf",
          data: jobPostingFile.dataBase64,
        },
      });
    }

    if (applicantDocFile && applicantDocFile.dataBase64) {
      promptParts.push({ text: `\n[첨부파일 2: 지원자 이력서/자기소개서 파일 (${applicantDocFile.filename || 'applicant_doc'})]` });
      promptParts.push({
        inlineData: {
          mimeType: applicantDocFile.mimeType || "application/pdf",
          data: applicantDocFile.dataBase64,
        },
      });
    }

    const candidateModels = ["gemini-3.6-flash", "gemini-flash-latest"];
    let responseText = "";
    let lastModelError: any = null;

    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: [
            {
              role: "user",
              parts: promptParts,
            },
          ],
          config: {
            responseMimeType: "application/json",
            temperature: 0.1,
          },
        });
        responseText = response.text || "{}";
        if (responseText) break;
      } catch (mErr: any) {
        console.warn(`Model ${modelName} call failed:`, mErr?.message || mErr);
        lastModelError = mErr;
      }
    }

    if (!responseText) {
      throw lastModelError || new Error("Gemini API 호출에 실패했습니다.");
    }

    let parsedResult;
    try {
      const cleanedText = responseText.replace(/```json\s*/g, "").replace(/```\s*$/g, "").trim();
      parsedResult = JSON.parse(cleanedText);
    } catch (e) {
      console.error("JSON parse error:", e, responseText);
      return res.status(500).json({
        error: "분석 결과 파싱 실패. 다시 시도해 주세요.",
        rawText: responseText,
      });
    }

    return res.json(parsedResult);
  } catch (err: any) {
    console.error("Analysis Error:", err);
    return res.status(500).json({
      error: err.message || "AI 분석 중 오류가 발생했습니다.",
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
