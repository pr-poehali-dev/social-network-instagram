import { useState } from "react";
import Icon from "@/components/ui/icon";

const SEND_CODE_URL = "https://functions.poehali.dev/e8b6e296-9bbc-47e3-a9f4-bae8a1fb2745";
const VERIFY_CODE_URL = "https://functions.poehali.dev/3b44b629-28c0-4e44-bab7-70faf00f4e76";
const REGISTER_URL = "https://functions.poehali.dev/42ba8771-a67b-4019-8cf2-72e76f4ea9ed";

interface AuthScreenProps {
  onAuth: (user: { phone: string; username: string; name: string }) => void;
}

export default function AuthScreen({ onAuth }: AuthScreenProps) {
  const [step, setStep] = useState<"phone" | "code" | "profile">("phone");
  const [phone, setPhone] = useState("");
  const [normalizedPhone, setNormalizedPhone] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [devCode, setDevCode] = useState("");

  const handlePhoneSubmit = async () => {
    if (phone.replace(/\D/g, "").length < 10) {
      setError("Введите корректный номер");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch(SEND_CODE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Ошибка отправки");
        return;
      }
      if (data.dev_code) setDevCode(data.dev_code);
      setStep("code");
    } catch {
      setError("Нет соединения с сервером");
    } finally {
      setLoading(false);
    }
  };

  const handleCodeSubmit = async () => {
    const fullCode = code.join("");
    if (fullCode.length < 6) {
      setError("Введите полный код");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch(VERIFY_CODE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code: fullCode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Неверный код");
        return;
      }
      if (data.is_new) {
        setNormalizedPhone(data.phone || phone);
        setStep("profile");
      } else {
        onAuth({
          phone: data.user.phone,
          username: data.user.username,
          name: data.user.name,
        });
      }
    } catch {
      setError("Нет соединения с сервером");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async () => {
    if (!name.trim()) { setError("Введите имя"); return; }
    if (!username.trim() || username.length < 3) { setError("Никнейм минимум 3 символа"); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch(REGISTER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalizedPhone || phone, name, username }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Ошибка регистрации");
        return;
      }
      onAuth({ phone: data.user.phone, username: data.user.username, name: data.user.name });
    } catch {
      setError("Нет соединения с сервером");
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (idx: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const newCode = [...code];
    newCode[idx] = val.slice(-1);
    setCode(newCode);
    if (val && idx < 5) {
      document.getElementById(`code-${idx + 1}`)?.focus();
    }
  };

  const handleCodeKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[idx] && idx > 0) {
      document.getElementById(`code-${idx - 1}`)?.focus();
    }
  };

  const formatPhone = (val: string) => {
    const digits = val.replace(/\D/g, "");
    let result = "";
    if (digits.length > 0) result += "+7";
    if (digits.length > 1) result += " (" + digits.slice(1, 4);
    if (digits.length > 4) result += ") " + digits.slice(4, 7);
    if (digits.length > 7) result += "-" + digits.slice(7, 9);
    if (digits.length > 9) result += "-" + digits.slice(9, 11);
    return result;
  };

  const STEPS = ["phone", "code", "profile"];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-background">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20 animate-spin-slow"
          style={{ background: "radial-gradient(circle, #f72585, transparent)" }} />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-20 animate-spin-slow"
          style={{ background: "radial-gradient(circle, #4cc9f0, transparent)", animationDirection: "reverse" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #7209b7, transparent)" }} />
      </div>

      <div className="relative z-10 w-full max-w-sm px-6 animate-fade-in">
        <div className="text-center mb-10">
          <h1 className="font-display text-7xl grad-text mb-2">VIBE</h1>
          <p className="text-muted-foreground text-sm">Живи ярко. Делись смело.</p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                step === s ? "grad-btn text-white shadow-lg shadow-vibe-pink/30" :
                STEPS.indexOf(step) > i ? "bg-vibe-purple text-white" :
                "glass text-muted-foreground"
              }`}>{i + 1}</div>
              {i < 2 && <div className={`w-8 h-0.5 transition-all duration-300 ${
                STEPS.indexOf(step) > i ? "bg-vibe-purple" : "bg-border"
              }`} />}
            </div>
          ))}
        </div>

        <div className="glass-strong rounded-2xl p-6 animate-scale-in">
          {step === "phone" && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Введи номер телефона</h2>
                <p className="text-muted-foreground text-sm">Отправим SMS с кодом</p>
              </div>
              <input
                type="tel"
                placeholder="+7 (___) ___-__-__"
                value={formatPhone(phone)}
                onChange={e => setPhone(e.target.value.replace(/\D/g, ""))}
                onKeyDown={e => e.key === "Enter" && !loading && handlePhoneSubmit()}
                className="w-full glass rounded-xl px-4 py-3.5 text-white placeholder-muted-foreground outline-none focus:ring-2 focus:ring-vibe-pink/50 transition-all text-lg font-medium"
              />
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button
                onClick={handlePhoneSubmit}
                disabled={loading}
                className="w-full grad-btn text-white font-bold py-3.5 rounded-xl hover-scale transition-all shadow-lg shadow-vibe-pink/20 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Отправляем..." : "Получить код"}
              </button>
              <p className="text-center text-muted-foreground text-xs">
                Продолжая, ты соглашаешься с условиями использования
              </p>
            </div>
          )}

          {step === "code" && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Код подтверждения</h2>
                <p className="text-muted-foreground text-sm">Отправили на {formatPhone(phone)}</p>
                {devCode && (
                  <p className="text-vibe-cyan text-xs mt-1 bg-vibe-cyan/10 px-3 py-1.5 rounded-lg">
                    🛠 Тест-режим: код <span className="font-bold tracking-widest">{devCode}</span>
                  </p>
                )}
              </div>
              <div className="flex gap-2 justify-between">
                {code.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`code-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleCodeChange(idx, e.target.value)}
                    onKeyDown={e => handleCodeKeyDown(idx, e)}
                    className="w-11 h-14 glass rounded-xl text-center text-white text-xl font-bold outline-none focus:ring-2 focus:ring-vibe-pink/60 transition-all"
                  />
                ))}
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button
                onClick={handleCodeSubmit}
                disabled={loading}
                className="w-full grad-btn text-white font-bold py-3.5 rounded-xl hover-scale transition-all shadow-lg shadow-vibe-pink/20 disabled:opacity-60"
              >
                {loading ? "Проверяем..." : "Подтвердить"}
              </button>
              <button
                onClick={() => { setStep("phone"); setCode(["","","","","",""]); setError(""); setDevCode(""); }}
                className="w-full text-muted-foreground text-sm hover:text-white transition-colors"
              >
                ← Изменить номер
              </button>
            </div>
          )}

          {step === "profile" && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Создай профиль</h2>
                <p className="text-muted-foreground text-sm">Как тебя будут знать в VIBE?</p>
              </div>
              <div className="flex justify-center">
                <div className="w-20 h-20 story-ring cursor-pointer hover-scale">
                  <div className="w-full h-full rounded-full glass-strong flex items-center justify-center m-0.5">
                    <Icon name="Camera" size={28} className="text-muted-foreground" />
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Имя"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full glass rounded-xl px-4 py-3.5 text-white placeholder-muted-foreground outline-none focus:ring-2 focus:ring-vibe-pink/50 transition-all"
                />
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-vibe-pink font-bold">@</span>
                  <input
                    type="text"
                    placeholder="никнейм"
                    value={username}
                    onChange={e => setUsername(e.target.value.replace(/[^a-zA-Z0-9_.]/g, ""))}
                    onKeyDown={e => e.key === "Enter" && !loading && handleProfileSubmit()}
                    className="w-full glass rounded-xl pl-8 pr-4 py-3.5 text-white placeholder-muted-foreground outline-none focus:ring-2 focus:ring-vibe-pink/50 transition-all"
                  />
                </div>
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button
                onClick={handleProfileSubmit}
                disabled={loading}
                className="w-full grad-btn text-white font-bold py-3.5 rounded-xl hover-scale transition-all shadow-lg shadow-vibe-pink/20 disabled:opacity-60"
              >
                {loading ? "Создаём профиль..." : "Начать 🎉"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
