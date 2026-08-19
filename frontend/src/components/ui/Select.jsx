import { ChevronDown } from "lucide-react";
export function Select({ error, options, placeholder, className = "", ...props }) {
    return (<div className="relative">
      <select className={`h-11 w-full appearance-none rounded-lg border bg-ink-900/60 pl-3.5 pr-9 text-sm text-ink-100 transition-colors duration-150 focus:bg-ink-900 focus:outline-none ${error ? "border-red-500/60 focus:border-red-400" : "border-ink-600 focus:border-accent-400"} ${props.value ? "" : "text-ink-500"} ${className}`} {...props}>
        {placeholder && (<option value="" disabled>
            {placeholder}
          </option>)}
        {options.map((opt) => (<option key={opt.value} value={opt.value} className="text-ink-900">
            {opt.label}
          </option>))}
      </select>
      <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-400"/>
    </div>);
}
