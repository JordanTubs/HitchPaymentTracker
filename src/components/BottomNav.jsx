const NAV_ITEMS = [
  { key: "home", label: "Home" },
  { key: "passengers", label: "Passengers" },
  { key: "history", label: "Rides" },
  { key: "wallet", label: "Wallet" },
  { key: "settings", label: "Settings" },
];

export function BottomNav({ activeKey, onChange }) {
  return (
    <div className="border-t border-primary/10 bg-white px-4 py-3">
      <div className="grid grid-cols-5 gap-1">
        {NAV_ITEMS.map((item) => {
          const active = item.key === activeKey;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onChange(item.key)}
              className={`rounded-lg px-1 py-3 text-[11px] font-semibold transition ${
                active
                  ? "bg-primary text-white shadow-md"
                  : "text-muted hover:bg-appbg"
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
