export function TextInput({ icon, error, prefix, className = "", ...props }) {
    return (<div className="relative">
      {icon && (<span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400">
          {icon}
        </span>)}
      {prefix && (<span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-ink-400">
          {prefix}
        </span>)}
      <input className={`h-11 w-full rounded-lg border bg-ink-900/60 text-sm text-ink-100 placeholder:text-ink-500 transition-colors duration-150 focus:bg-ink-900 focus:outline-none ${icon || prefix ? "pl-9" : "pl-3.5"} pr-3.5 ${error
            ? "border-red-500/60 focus:border-red-400"
            : "border-ink-600 focus:border-accent-400"} ${className}`} {...props}/>
    </div>);
}
