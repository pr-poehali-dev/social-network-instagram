import { useState } from "react";
import Icon from "@/components/ui/icon";

interface AuthScreenProps {
  onAuth: (user: { phone: string; username: string; name: string }) => void;
}

export default function AuthScreen({ onAuth }: AuthScreenProps) {
  const [step, setStep] = useState<"phone" | "code" | "profile">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handlePhoneSubmit = () => {
    if (phone.replace(/\D/g, "").length < 10) {
      setError("Введите корректный номер");
      return;
    }
    setError("");
    setStep("code");
  };

  const handleCodeChange = (idx: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const newCode = [...code];
    newCode[idx] = val.slice(-1);
    setCode(newCode);
    if (val && idx < 5) {
      const next = document.getElementById(`code-${idx + 1}`);
      next?.focus();
    }
  };

  const handleCodeKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[idx] && idx > 0) {
      const prev = document.getElementById(`code-${idx - 1}`);
      prev?.focus();
    }
  };

  const handleCodeSubmit = () => {
    if (code.join("").length < 6) {
      setError("Введите полный код");
      return;
    }
    setError("");
    setStep("profile");
  };

  const handleProfileSubmit = () => {
    if (!name.trim()) {
      setError("Введите имя");
      return;
    }
    if (!username.trim() || username.length < 3) {
      setError("Никнейм минимум 3 символа");
      return;
    }
    setError("");
    onAuth({ phone, username: username.toLowerCase(), name });
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-background">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20 animate-spin-slow"
          style={{ background: "radial-gradient(circle, #f72585, transparent)" }} />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-20 animate-spin-slow"
          style={{ background: "radial-gradient(circle, #4cc9f0, transparent)", animationDirection: "reverse" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #7209b7, transparent)" }} />
      </div>

      <div className="relative z-10 w-full max-w-sm px-6 animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="font-display text-7xl grad-text mb-2">VIBE</h1>
          <p className="text-muted-foreground text-sm">Живи ярко. Делись смело.</p>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {["phone", "code", "profile"].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                step === s ? "grad-btn text-white shadow-lg shadow-vibe-pink/30" :
                ["phone","code","profile"].indexOf(step) > i ? "bg-vibe-purple text-white" :
                "glass text-muted-foreground"
              }`}>{i + 1}</div>
              {i < 2 && <div className={`w-8 h-0.5 transition-all duration-300 ${
                ["phone","code","profile"].indexOf(step) > i ? "bg-vibe-purple" : "bg-border"
              }`} />}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="glass-strong rounded-2xl p-6 animate-scale-in">
          {step === "phone" && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Введи номер телефона</h2>
                <p className="text-muted-foreground text-sm">Отправим код подтверждения</p>
              </div>
              <div>
                <input
                  type="tel"
                  placeholder="+7 (___) ___-__-__"
                  value={formatPhone(phone)}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, ""))}
                  onKeyDown={e => e.key === "Enter" && handlePhoneSubmit()}
                  className="w-full glass rounded-xl px-4 py-3.5 text-white placeholder-muted-foreground outline-none focus:ring-2 focus:ring-vibe-pink/50 transition-all text-lg font-medium"
                />
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button
                onClick={handlePhoneSubmit}
                className="w-full grad-btn text-white font-bold py-3.5 rounded-xl hover-scale transition-all shadow-lg shadow-vibe-pink/20 animate-pulse-glow"
              >
                Получить код
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
                className="w-full grad-btn text-white font-bold py-3.5 rounded-xl hover-scale transition-all shadow-lg shadow-vibe-pink/20"
              >
                Подтвердить
              </button>
              <button
                onClick={() => { setStep("phone"); setCode(["","","","","",""]); setError(""); }}
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
                    onKeyDown={e => e.key === "Enter" && handleProfileSubmit()}
                    className="w-full glass rounded-xl pl-8 pr-4 py-3.5 text-white placeholder-muted-foreground outline-none focus:ring-2 focus:ring-vibe-pink/50 transition-all"
                  />
                </div>
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button
                onClick={handleProfileSubmit}
                className="w-full grad-btn text-white font-bold py-3.5 rounded-xl hover-scale transition-all shadow-lg shadow-vibe-pink/20"
              >
                Начать 🎉
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
