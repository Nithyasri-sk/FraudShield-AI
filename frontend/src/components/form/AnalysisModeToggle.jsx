import { FileEdit, UploadCloud } from "lucide-react";
const OPTIONS = [
    { value: "manual", label: "Manual", icon: FileEdit },
    { value: "upload", label: "Upload", icon: UploadCloud },
];
/**
 * Segmented control switching between the two Analyze Transaction workflows.
 * Purely presentational/controlled — the parent page owns the `mode` state
 * so it can decide what to preserve when switching (e.g. keep a manual
 * result around while the analyst looks at Upload, and vice versa).
 */
export function AnalysisModeToggle({ mode, onChange, }) {
    const activeIndex = OPTIONS.findIndex((o) => o.value === mode);
    return (<div role="tablist" aria-label="Analysis mode" className="relative inline-flex w-full max-w-xs rounded-xl border border-ink-600 bg-ink-900/60 p-1 sm:w-auto">
      <span className="absolute inset-y-1 rounded-lg bg-accent-500 shadow-[0_1px_0_rgba(255,255,255,0.12)_inset] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]" style={{
            width: `calc(${100 / OPTIONS.length}% - 4px)`,
            transform: `translateX(calc(${activeIndex * 100}% + ${activeIndex * 4}px))`,
        }} aria-hidden/>
      {OPTIONS.map((opt) => {
            const isActive = opt.value === mode;
            const Icon = opt.icon;
            return (<button key={opt.value} role="tab" type="button" aria-selected={isActive} onClick={() => onChange(opt.value)} className={`relative z-10 flex flex-1 items-center justify-center gap-1.5 rounded-lg px-5 py-2 text-[13.5px] font-medium transition-colors duration-200 sm:flex-initial sm:px-6 ${isActive ? "text-white" : "text-ink-300 hover:text-ink-100"}`}>
            <Icon size={15}/>
            {opt.label}
          </button>);
        })}
    </div>);
}
