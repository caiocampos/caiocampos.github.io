export interface LibretranslateRequest {
  q: string;
  source: string;
  target: string;
  format: "text" | "html";
  alternatives: number;
  api_key: string;
}

export interface LibretranslateResponse {
  translatedText: string;
  alternatives: string[];
}
