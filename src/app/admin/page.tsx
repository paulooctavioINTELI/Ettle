// app/admin/page.tsx
"use client";

import { useEffect, useState } from "react";

const HARD_CODED_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

type PaywallForm = {
  valorMensal: string;
  valorSemestral: string;
  valorAnual: string;
};

const initialForm: PaywallForm = {
  valorMensal: "",
  valorSemestral: "",
  valorAnual: "",
};

export default function AdminPage() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [form, setForm] = useState<PaywallForm>(initialForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // usuários conectados
  const [connectedUsers, setConnectedUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("admin_authed");
    if (stored === "true") {
      setIsAuthed(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (password === HARD_CODED_PASSWORD) {
      setIsAuthed(true);
      if (typeof window !== "undefined") {
        localStorage.setItem("admin_authed", "true");
      }
    } else {
      setLoginError("Senha incorreta.");
    }
  };

  const handleChange = (field: keyof PaywallForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (!isAuthed) return;

    const fetchConnectedUsers = async () => {
      try {
        setLoadingUsers(true);
        const res = await fetch(
          process.env.NEXT_PUBLIC_API_URL + "/paywall/connected-users"
        );
        if (!res.ok) return;
        const data = await res.json();
        setConnectedUsers(data.users ?? []);
      } catch {
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchConnectedUsers();
    const intervalId = setInterval(fetchConnectedUsers, 5000);

    return () => clearInterval(intervalId);
  }, [isAuthed]);

  const sendToUser = async (userId: string) => {
    setMessage(null);

    if (!form.valorMensal) {
      setMessage("Preencha pelo menos o valor mensal antes de enviar.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/paywall/trigger",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            valorMensal: Number(form.valorMensal),
            valorSemestral: form.valorSemestral
              ? Number(form.valorSemestral)
              : undefined,
            valorAnual: form.valorAnual ? Number(form.valorAnual) : undefined,
          }),
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Erro ao enviar paywall");
      }

      setMessage(`Paywall disparado com sucesso para ${userId} ✅`);
    } catch (err: any) {
      setMessage(err.message || "Falha ao disparar paywall ❌");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthed) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="w-full max-w-sm bg-slate-800 p-6 rounded-xl shadow-lg">
          <h1 className="text-xl font-semibold mb-4 text-center">
            Admin - Login
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Senha</label>
              <input
                type="password"
                className="w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite a senha"
              />
            </div>
            {loginError && <p className="text-sm text-red-400">{loginError}</p>}
            <button
              type="submit"
              className="w-full rounded-md bg-emerald-500 hover:bg-emerald-400 text-black font-medium py-2 text-sm transition"
            >
              Entrar
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-2xl mx-auto bg-slate-900 rounded-xl p-6 shadow-lg">
        <h1 className="text-2xl font-semibold mb-4">Painel Admin – Paywall</h1>
        <p className="text-sm text-slate-300 mb-6">
          Defina os valores do plano e clique em um usuário conectado para
          enviar o paywall.
        </p>

        {/* valores do paywall */}
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm mb-1">Mensal</label>
              <input
                type="number"
                step="0.01"
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                value={form.valorMensal}
                onChange={(e) => handleChange("valorMensal", e.target.value)}
                placeholder="Ex: 49.90"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Semestral</label>
              <input
                type="number"
                step="0.01"
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                value={form.valorSemestral}
                onChange={(e) => handleChange("valorSemestral", e.target.value)}
                placeholder="Ex: 39.90"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Anual</label>
              <input
                type="number"
                step="0.01"
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                value={form.valorAnual}
                onChange={(e) => handleChange("valorAnual", e.target.value)}
                placeholder="Ex: 29.90"
              />
            </div>
          </div>
        </form>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold">Usuários conectados (WS)</h2>
            {loadingUsers && (
              <span className="text-xs text-slate-400">Atualizando...</span>
            )}
          </div>

          {connectedUsers.length === 0 ? (
            <p className="text-xs text-slate-500">
              Nenhum usuário conectado no momento.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {connectedUsers.map((u) => (
                <div
                  key={u.id_clerk}
                  className="flex items-center gap-2 bg-slate-800 px-3 py-2 rounded-lg border border-slate-700"
                >
                  <span className="text-sm text-slate-200 font-medium">
                    {u.name}
                  </span>

                  <button
                    type="button"
                    onClick={() => sendToUser(u.id_clerk)}
                    disabled={loading}
                    className={`px-3 py-1 rounded-full text-xs border ${
                      loading
                        ? "bg-slate-700 text-slate-400 border-slate-600 cursor-not-allowed"
                        : "bg-emerald-500 text-black border-emerald-400 hover:bg-emerald-400"
                    }`}
                  >
                    Enviar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {message && (
          <p className="mt-4 text-sm text-slate-200">
            <span className="font-medium">Status:</span> {message}
          </p>
        )}
      </div>
    </main>
  );
}
