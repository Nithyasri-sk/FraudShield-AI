import { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";
const ToastContext = createContext(null);
const VARIANT_STYLES = {
    success: { icon: CheckCircle2, classes: "border-teal-500/40 text-teal-300" },
    error: { icon: XCircle, classes: "border-red-500/40 text-red-300" },
    warning: { icon: AlertTriangle, classes: "border-amber-500/40 text-amber-300" },
    info: { icon: Info, classes: "border-accent-500/40 text-accent-300" },
};
export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const showToast = useCallback((toast) => {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        setToasts((prev) => [...prev, { ...toast, id }]);
        window.setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 5000);
    }, []);
    const dismiss = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));
    return (<ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex w-full max-w-sm flex-col gap-2.5">
        {toasts.map((t) => {
            const style = VARIANT_STYLES[t.variant];
            const Icon = style.icon;
            return (<div key={t.id} className={`animate-fade-up card-surface flex items-start gap-3 rounded-xl border ${style.classes} p-4 pr-3`} role="status">
              <Icon size={18} className="mt-0.5 shrink-0"/>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ink-100">{t.title}</p>
                {t.message && <p className="mt-0.5 text-xs leading-relaxed text-ink-300">{t.message}</p>}
              </div>
              <button onClick={() => dismiss(t.id)} className="shrink-0 rounded-md p-1 text-ink-400 transition-colors hover:bg-ink-700 hover:text-ink-100" aria-label="Dismiss notification">
                <X size={14}/>
              </button>
            </div>);
        })}
      </div>
    </ToastContext.Provider>);
}
export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx)
        throw new Error("useToast must be used within a ToastProvider");
    return ctx;
}
