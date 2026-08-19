const VARIANT_CLASSES = {
    primary: "bg-accent-500 text-white hover:bg-accent-400 active:bg-accent-600 shadow-[0_1px_0_rgba(255,255,255,0.08)_inset] disabled:hover:bg-accent-500",
    secondary: "bg-ink-800 text-ink-100 border border-ink-600 hover:bg-ink-700 hover:border-ink-500 disabled:hover:bg-ink-800",
    ghost: "bg-transparent text-ink-300 hover:bg-ink-800 hover:text-ink-100",
    danger: "bg-red-500 text-white hover:bg-red-400 active:bg-red-600",
};
const SIZE_CLASSES = {
    sm: "h-8 px-3 text-xs gap-1.5",
    md: "h-10 px-4 text-sm gap-2",
    lg: "h-12 px-6 text-[15px] gap-2.5",
};
export function Button({ variant = "primary", size = "md", icon, loading, disabled, children, className = "", ...props }) {
    return (<button disabled={disabled || loading} className={`inline-flex items-center justify-center rounded-lg font-medium transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`} {...props}>
      {loading ? (<span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"/>) : (icon)}
      {children}
    </button>);
}
