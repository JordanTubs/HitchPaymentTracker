export function MobileShell({ children }) {
  return (
    <div className="min-h-screen bg-appbg px-4 py-5 text-ink">
      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] w-full max-w-md flex-col overflow-hidden rounded-[2rem] border border-muted/20 bg-white/65 shadow-ledger backdrop-blur">
        {children}
      </div>
    </div>
  );
}

export function ScreenSection({ children, className = "" }) {
  return <div className={`px-5 ${className}`}>{children}</div>;
}
