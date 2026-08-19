import { Search } from "lucide-react";
/**
 * Searchable dropdown backed by a native <datalist>. Chosen over a custom
 * combobox for robustness (keyboard nav, mobile support, accessibility)
 * while still letting the analyst type to filter known values.
 */
export function SearchableInput({ error, options, listId, className = "", ...props }) {
    return (<div className="relative">
      <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"/>
      <input list={listId} className={`h-11 w-full rounded-lg border bg-ink-900/60 pl-9 pr-3.5 text-sm text-ink-100 placeholder:text-ink-500 transition-colors duration-150 focus:bg-ink-900 focus:outline-none ${error ? "border-red-500/60 focus:border-red-400" : "border-ink-600 focus:border-accent-400"} ${className}`} autoComplete="off" {...props}/>
      <datalist id={listId}>
        {options.map((opt) => (<option key={opt} value={opt}/>))}
      </datalist>
    </div>);
}
