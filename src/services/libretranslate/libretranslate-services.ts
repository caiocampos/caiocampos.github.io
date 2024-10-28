import {
  LibretranslateRequest,
  LibretranslateResponse,
} from "./libretranslate-dtos";

const serverUrl = "http://localhost:5000";

export class LibretranslateServices {
  public static async translate(
    text: string,
    sourceLanguage: string,
    targetLanguage: string,
    format: "text" | "html" = "text",
    alternatives = 0
  ): Promise<string> {
    const url = `${serverUrl}/translate`;
    const data: LibretranslateRequest = {
      q: text,
      source: sourceLanguage,
      target: targetLanguage,
      format,
      alternatives,
      api_key: "",
    };
    const res: Response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
    const repositories: LibretranslateResponse = await res.json();
    return repositories.translatedText;
  }
}
