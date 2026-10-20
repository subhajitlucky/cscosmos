export interface TutorSettings {
  baseUrl: string;
  model: string;
  apiKey: string;
}

export const TUTOR_KEY = "cscosmos:tutor:v1";
export const TUTOR_EVENT = "cscosmos:tutor-updated";

export const DEFAULT_TUTOR_SETTINGS: TutorSettings = {
  baseUrl: "https://api.openai.com/v1",
  model: "gpt-4o-mini",
  apiKey: "",
};

export function parseTutorSettings(raw: string): TutorSettings {
  try {
    const parsed = JSON.parse(raw) as Partial<TutorSettings>;
    return {
      baseUrl: parsed.baseUrl || DEFAULT_TUTOR_SETTINGS.baseUrl,
      model: parsed.model || DEFAULT_TUTOR_SETTINGS.model,
      apiKey: parsed.apiKey || "",
    };
  } catch {
    return DEFAULT_TUTOR_SETTINGS;
  }
}

export function getTutorSnapshot(): string {
  try {
    return window.localStorage.getItem(TUTOR_KEY) ?? "";
  } catch {
    return "";
  }
}

export function subscribeTutor(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  window.addEventListener(TUTOR_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(TUTOR_EVENT, callback);
  };
}

export function saveTutorSettings(settings: TutorSettings): void {
  try {
    window.localStorage.setItem(TUTOR_KEY, JSON.stringify(settings));
    window.dispatchEvent(new Event(TUTOR_EVENT));
  } catch {
    // Storage can be unavailable; the current session still works.
  }
}
