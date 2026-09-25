const NAV_ITEMS = [
  { key: "home", label: "Home" },
  { key: "passengers", label: "Passengers" },
  { key: "history", label: "Rides" },
  { key: "settings", label: "Settings" },
];

export function BottomNav({ activeKey, onChange }) {
  return (
    <div className="border-t border-primary/10 bg-white px-4 py-3">
      <div className="grid grid-cols-4 gap-2">
        {NAV_ITEMS.map((item) => {
          const active = item.key === activeKey;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onChange(item.key)}
              className={`rounded-lg px-2 py-3 text-xs font-semibold transition ${
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
