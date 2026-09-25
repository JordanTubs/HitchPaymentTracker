export function MobileShell({ children }) {
  return (
    <div className="min-h-screen bg-appbg px-0 py-0 text-ink sm:px-4 sm:py-5">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col overflow-hidden bg-white shadow-ledger sm:min-h-[calc(100vh-2.5rem)] sm:rounded-2xl sm:border sm:border-primary/10">
        {children}
      </div>
    </div>
  );
}

export function ScreenSection({ children, className = "" }) {
  return <div className={`px-5 ${className}`}>{children}</div>;
}
