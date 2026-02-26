export interface AnalysisResult {
  aiLikelihood: number; // 0 to 100
  readabilityScore: number; // 0 to 100
  sentiment: string;
  keywordDensity: { word: string; count: number; percentage: number }[];
  seoSuggestions: string[];
  detailedAnalysis: string;
}

export async function analyzeContent(text: string): Promise<AnalysisResult> {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to analyze content");
  }

  return response.json();
}
