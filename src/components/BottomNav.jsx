const NAV_ITEMS = [
  { key: "home", label: "Home" },
  { key: "history", label: "History" },
  { key: "wallet", label: "Wallet" },
  { key: "settings", label: "Settings" },
];

export function BottomNav({ activeKey, onChange }) {
  return (
    <div className="border-t border-muted/20 bg-white/90 px-4 py-3">
      <div className="grid grid-cols-4 gap-2">
        {NAV_ITEMS.map((item) => {
          const active = item.key === activeKey;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onChange(item.key)}
              className={`rounded-2xl px-2 py-3 text-xs font-semibold transition ${
                active
                  ? "bg-primary text-white shadow-md"
                  : "bg-appbg/80 text-muted"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
