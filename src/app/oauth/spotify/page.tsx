"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

function parseHash(hash: string): Record<string, string> {
  const h = hash.replace(/^#/, "");
  const out: Record<string, string> = {};
  for (const part of h.split("&")) {
    const [k, v] = part.split("=");
    if (!k) continue;
    out[decodeURIComponent(k)] = decodeURIComponent(v ?? "");
  }
  return out;
}

export default function SpotifyBridgePage() {
  const sp = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  const returnTo = sp.get("return_to") || "ettleapp://redirect";
  const qpToken = sp.get("token");

  const token = useMemo(() => {
    if (typeof window === "undefined") return qpToken ?? "";
    const fromHash = parseHash(window.location.hash || "")?.token;
    return qpToken || fromHash || "";
  }, [qpToken]);

  useEffect(() => {
    if (!API_BASE) {
      setError("API base not configured (NEXT_PUBLIC_API_BASE_URL).");
      return;
    }
    if (!/^ettleapp:\/\/redirect/.test(returnTo)) {
      setError("Invalid return_to. Expected ettleapp://redirect");
      return;
    }
    if (!token) {
      setError("Missing token. Open with ?token=... or #token=...");
      return;
    }

    // ✅ Redireciona o navegador direto pro backend (sem fetch)
    const url =
      `${API_BASE}/auth/mobile-login` +
      `?provider=spotify` +
      `&return_to=${encodeURIComponent(returnTo)}` +
      `&token=${encodeURIComponent(token)}`;

    window.location.replace(url); // ou assign(url)
  }, [returnTo, token]);

  if (error) {
    return (
      <main style={{ padding: 24, fontFamily: "system-ui" }}>
        <h1>Error starting Spotify login</h1>
        <p style={{ color: "crimson", whiteSpace: "pre-wrap" }}>{error}</p>
        <p>
          Make sure you opened this page with{" "}
          <code>?return_to=ettleapp://redirect</code> and{" "}
          <code>?token=YOUR_JWT</code> (or <code>#token=YOUR_JWT</code>).
        </p>
      </main>
    );
  }

  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>Connecting to Spotify…</h1>
      <p>You will be redirected to Spotify login shortly.</p>
    </main>
  );
}
