function generateUUIDFallback() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getRunId(): string {
  if (typeof window === "undefined") return "";
  const KEY = "ettle_mvp_run_id";
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = globalThis.crypto?.randomUUID?.() ?? generateUUIDFallback();
    localStorage.setItem(KEY, id);
  }
  return id;
}
