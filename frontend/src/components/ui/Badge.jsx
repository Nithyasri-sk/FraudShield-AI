const TONE_CLASSES = {
    teal: "bg-teal-500/10 text-teal-300 border-teal-500/30",
    amber: "bg-amber-500/10 text-amber-300 border-amber-500/30",
    red: "bg-red-500/10 text-red-300 border-red-500/30",
    accent: "bg-accent-500/10 text-accent-300 border-accent-500/30",
    neutral: "bg-ink-700/60 text-ink-200 border-ink-600",
};
export function Badge({ tone = "neutral", icon, children, dot = false, }) {
    return (<span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${TONE_CLASSES[tone]}`}>
      {dot && <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60"/>
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current"/>
      </span>}
      {icon}
      {children}
    </span>);
}
