import { FiChevronUp, FiChevronDown, FiX } from "react-icons/fi";

export default function TokenRow({
  token,
  isFirst,
  isLast,
  busy,
  onUp,
  onDown,
  onCancel,
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-3 pr-4 transition-shadow hover:shadow-soft">

      <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl bg-brand-600 text-white">
        <span className="text-base font-bold leading-none">{token.position}</span>
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-slate-900">
          {token.personName}
        </p>
        <p className="text-xs text-slate-400">Token #{token.tokenNumber}</p>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          className="icon-btn"
          onClick={onUp}
          disabled={isFirst || busy}
          title="Move up"
        >
          <FiChevronUp className="h-4 w-4" />
        </button>
        <button
          className="icon-btn"
          onClick={onDown}
          disabled={isLast || busy}
          title="Move down"
        >
          <FiChevronDown className="h-4 w-4" />
        </button>
        <button
          className="icon-btn hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
          onClick={onCancel}
          disabled={busy}
          title="Cancel token"
        >
          <FiX className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
