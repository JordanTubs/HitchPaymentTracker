import { useEffect, useMemo, useState } from "react";
import qrCode from "../gcashqr.jpeg";
import { BottomNav } from "./components/BottomNav";
import { MobileShell, ScreenSection } from "./components/MobileShell";
import { DESTINATIONS, calculateFare } from "./lib/fares";

const PAYMENT_METHODS = ["GCash", "Cash", "Pay Later"];
const CASH_STATUSES = ["Paid", "Not Paid"];

const emptyRideForm = () => ({
  passengerName: "",
  rideDate: new Date().toISOString().slice(0, 10),
  rideType: "One-way",
  pickupPoint: "Addu Jacinto",
  dropoffPoint: "Uraya",
});

function formatCurrency(value) {
  return `PHP ${Number(value || 0).toLocaleString("en-PH")}`;
}

function formatDateLabel(value) {
  if (!value) {
    return "N/A";
  }

  return new Date(value).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(value) {
  return new Date(value).toLocaleString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function IconButton({ children, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-muted/15"
    >
      {children}
    </button>
  );
}

function Header({ title, onLeftClick, leftIcon, rightSlot }) {
  return (
    <ScreenSection className="pb-5 pt-5">
      <div className="flex items-center justify-between">
        <IconButton onClick={onLeftClick} label={title}>
          {leftIcon}
        </IconButton>
        <h1 className="text-base font-semibold text-ink">{title}</h1>
        <div className="flex h-11 min-w-11 items-center justify-end">{rightSlot}</div>
      </div>
    </ScreenSection>
  );
}

function StepPill({ value }) {
  return (
    <div className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold tracking-[0.2em] text-primary">
      {value}
    </div>
  );
}

function CardButton({ title, subtitle, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-[1.75rem] bg-card px-5 py-5 text-left shadow-sm transition hover:-translate-y-0.5"
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-lg font-semibold text-ink">{title}</span>
        <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
          Open
        </span>
      </div>
      <p className="text-sm text-muted">{subtitle}</p>
    </button>
  );
}

function SummaryMetric({ label, value }) {
  return (
    <div className="rounded-[1.5rem] bg-white/60 px-4 py-4 ring-1 ring-white/50">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
        {label}
      </p>
      <p className="mt-2 text-xl font-semibold text-ink">{value}</p>
    </div>
  );
}

function InputLabel({ children }) {
  return (
    <label className="mb-2 block text-sm font-semibold text-ink">{children}</label>
  );
}

function TextField({ label, ...props }) {
  return (
    <div>
      <InputLabel>{label}</InputLabel>
      <input
        {...props}
        className="w-full rounded-2xl border border-muted/30 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-primary"
      />
    </div>
  );
}

function SelectField({ label, children, ...props }) {
  return (
    <div>
      <InputLabel>{label}</InputLabel>
      <select
        {...props}
        className="w-full rounded-2xl border border-muted/30 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-primary"
      >
        {children}
      </select>
    </div>
  );
}

function SegmentedControl({ label, options, value, onChange }) {
  return (
    <div>
      <InputLabel>{label}</InputLabel>
      <div className="grid grid-cols-2 gap-2 rounded-[1.5rem] bg-appbg p-1.5">
        {options.map((option) => {
          const active = option === value;

          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              className={`rounded-[1.1rem] px-4 py-3 text-sm font-semibold transition ${
                active ? "bg-primary text-white shadow-sm" : "text-muted"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PrimaryButton({ children, ...props }) {
  return (
    <button
      {...props}
      className="w-full rounded-2xl bg-primary px-4 py-4 text-sm font-semibold text-white shadow-md transition disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
    </button>
  );
}

function SecondaryButton({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`w-full rounded-2xl border border-muted/30 bg-white px-4 py-4 text-sm font-semibold text-muted transition ${className}`}
    >
      {children}
    </button>
  );
}

function Dashboard({
  totalEarnings,
  onAddRide,
  onHistory,
  onOpenMenu,
  onOpenSettings,
}) {
  return (
    <>
      <Header
        title="Admin Ledger"
        onLeftClick={onOpenMenu}
        leftIcon={<HamburgerIcon />}
        rightSlot={
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-sm font-bold text-white">
            MP
          </div>
        }
      />
      <div className="flex-1 overflow-y-auto pb-6">
        <ScreenSection>
          <p className="text-sm text-muted">Welcome back,</p>
          <h2 className="mt-1 text-3xl font-semibold text-ink">Managing Partner</h2>
        </ScreenSection>

        <ScreenSection className="mt-6 space-y-4">
          <CardButton
            title="Add Ride Entry"
            subtitle="Log a new business journey"
            onClick={onAddRide}
          />
          <CardButton
            title="View Ride History"
            subtitle="Access dashboard analytics"
            onClick={onHistory}
          />
        </ScreenSection>

        <ScreenSection className="mt-6">
          <div className="rounded-[2rem] bg-primary px-5 py-5 text-white shadow-ledger">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/75">
              Current Ledger Status
            </p>
            <p className="mt-3 text-3xl font-semibold">{formatCurrency(totalEarnings)}</p>
            <p className="mt-2 text-sm text-white/80">Pending Approval</p>
          </div>
        </ScreenSection>

        <ScreenSection className="mt-6">
          <div className="rounded-[2rem] border border-muted/20 bg-white px-5 py-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-ink">Quick Preferences</p>
                <p className="mt-1 text-sm text-muted">
                  Review admin tools and stored draft data.
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenSettings}
                className="rounded-full bg-appbg px-3 py-2 text-xs font-semibold text-primary"
              >
                Open
              </button>
            </div>
          </div>
        </ScreenSection>
      </div>
    </>
  );
}

function AddRideDetails({
  form,
  timestampPreview,
  onChange,
  onContinue,
  onBack,
  onSaveDraft,
}) {
  return (
    <>
      <Header
        title="Add Ride Details"
        onLeftClick={onBack}
        leftIcon={<ArrowLeftIcon />}
        rightSlot={<div className="w-11" />}
      />
      <div className="flex-1 overflow-y-auto pb-6">
        <ScreenSection>
          <StepPill value="STEP 1 OF 2" />
          <div className="mt-5 rounded-[1.75rem] bg-card px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              Auto-generated timestamp
            </p>
            <p className="mt-2 text-base font-semibold text-ink">{timestampPreview}</p>
          </div>
        </ScreenSection>

        <ScreenSection className="mt-6 space-y-5">
          <TextField
            label="Passenger Name"
            placeholder="Enter passenger name"
            value={form.passengerName}
            onChange={(event) =>
              onChange("passengerName", event.target.value)
            }
          />
          <TextField
            label="Ride Date"
            type="date"
            value={form.rideDate}
            onChange={(event) => onChange("rideDate", event.target.value)}
          />
          <SegmentedControl
            label="Ride Type"
            options={["One-way", "Round trip"]}
            value={form.rideType}
            onChange={(value) => onChange("rideType", value)}
          />
          <SelectField
            label="Pick-up Point"
            value={form.pickupPoint}
            onChange={(event) => onChange("pickupPoint", event.target.value)}
          >
            {DESTINATIONS.map((destination) => (
              <option key={destination} value={destination}>
                {destination}
              </option>
            ))}
          </SelectField>
          <SelectField
            label="Drop-off Point"
            value={form.dropoffPoint}
            onChange={(event) => onChange("dropoffPoint", event.target.value)}
          >
            {DESTINATIONS.map((destination) => (
              <option key={destination} value={destination}>
                {destination}
              </option>
            ))}
          </SelectField>
        </ScreenSection>

        <ScreenSection className="mt-8 space-y-3">
          <PrimaryButton
            type="button"
            onClick={onContinue}
            disabled={!form.passengerName.trim()}
          >
            Continue to Payment
          </PrimaryButton>
          <SecondaryButton type="button" onClick={onSaveDraft}>
            Save as Draft
          </SecondaryButton>
        </ScreenSection>
      </div>
    </>
  );
}

function PaymentScreen({
  form,
  fare,
  paymentMethod,
  cashStatus,
  onBack,
  onPaymentMethodChange,
  onCashStatusChange,
  onSave,
}) {
  const paid = paymentMethod === "Cash" ? cashStatus === "Paid" : paymentMethod === "GCash";

  return (
    <>
      <Header
        title="Finalize Ride"
        onLeftClick={onBack}
        leftIcon={<ArrowLeftIcon />}
        rightSlot={<div className="w-11" />}
      />
      <div className="flex-1 overflow-y-auto pb-6">
        <ScreenSection>
          <StepPill value="STEP 2 OF 2" />
          <div className="mt-5 rounded-[2rem] bg-primary px-5 py-6 text-white shadow-ledger">
            <p className="text-sm text-white/75">Calculated fare</p>
            <p className="mt-2 text-4xl font-semibold">{formatCurrency(fare)}</p>
          </div>
        </ScreenSection>

        <ScreenSection className="mt-6">
          <div className="rounded-[1.75rem] border border-muted/20 bg-white px-4 py-4">
            <p className="text-sm font-semibold text-ink">Trip Summary</p>
            <div className="mt-4 space-y-2 text-sm text-muted">
              <div className="flex justify-between gap-4">
                <span>Passenger</span>
                <span className="font-semibold text-ink">{form.passengerName}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Date</span>
                <span className="font-semibold text-ink">{formatDateLabel(form.rideDate)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Trip</span>
                <span className="font-semibold text-ink">{form.rideType}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Route</span>
                <span className="text-right font-semibold text-ink">
                  {form.pickupPoint} → {form.dropoffPoint}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Expected status</span>
                <span className="font-semibold text-ink">
                  {paid ? "Paid" : "Unpaid"}
                </span>
              </div>
            </div>
          </div>
        </ScreenSection>

        <ScreenSection className="mt-6">
          <InputLabel>Payment Method</InputLabel>
          <div className="grid grid-cols-3 gap-2">
            {PAYMENT_METHODS.map((method) => {
              const active = method === paymentMethod;

              return (
                <button
                  key={method}
                  type="button"
                  onClick={() => onPaymentMethodChange(method)}
                  className={`rounded-2xl px-3 py-4 text-sm font-semibold transition ${
                    active
                      ? "bg-primary text-white shadow-md"
                      : "border border-muted/30 bg-white text-muted"
                  }`}
                >
                  {method}
                </button>
              );
            })}
          </div>
        </ScreenSection>

        {paymentMethod === "GCash" && (
          <ScreenSection className="mt-6">
            <div className="rounded-[2rem] border border-muted/20 bg-card px-5 py-6 text-center shadow-sm">
              <div className="mx-auto flex w-full max-w-[220px] items-center justify-center rounded-[1.5rem] bg-white p-4 shadow-sm">
                <img
                  src={qrCode}
                  alt="GCash QR code"
                  className="h-auto w-full rounded-xl object-cover"
                />
              </div>
              <p className="mt-4 text-sm font-semibold text-ink">Scan to Pay</p>
            </div>
          </ScreenSection>
        )}

        {paymentMethod === "Cash" && (
          <ScreenSection className="mt-6">
            <SegmentedControl
              label="Cash Payment Status"
              options={CASH_STATUSES}
              value={cashStatus}
              onChange={onCashStatusChange}
            />
          </ScreenSection>
        )}

        {paymentMethod === "Pay Later" && (
          <ScreenSection className="mt-6">
            <div className="rounded-[1.75rem] border border-dashed border-muted/40 bg-white px-4 py-4 text-sm text-muted">
              Pay Later automatically saves this ride as unpaid.
            </div>
          </ScreenSection>
        )}

        <ScreenSection className="mt-8 space-y-3">
          <PrimaryButton
            type="button"
            onClick={onSave}
            disabled={!paymentMethod}
          >
            Save Entry
          </PrimaryButton>
          <SecondaryButton type="button" onClick={onBack}>
            Back to Details
          </SecondaryButton>
        </ScreenSection>
      </div>
    </>
  );
}

function RideHistory({
  rides,
  totalEarnings,
  unpaidBalance,
  searchTerm,
  statusFilter,
  dateFilter,
  onSearchChange,
  onStatusChange,
  onDateChange,
  onMarkPaid,
  onBack,
}) {
  return (
    <>
      <Header
        title="Ride History"
        onLeftClick={onBack}
        leftIcon={<ArrowLeftIcon />}
        rightSlot={<div className="w-11" />}
      />
      <div className="flex-1 overflow-y-auto pb-6">
        <ScreenSection className="grid grid-cols-2 gap-3">
          <SummaryMetric label="Total Earnings" value={formatCurrency(totalEarnings)} />
          <SummaryMetric
            label="Total Unpaid Balance"
            value={formatCurrency(unpaidBalance)}
          />
        </ScreenSection>

        <ScreenSection className="mt-6 space-y-4">
          <TextField
            label="Search"
            placeholder="Search passenger or destination"
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
          />
          <div className="grid grid-cols-2 gap-3">
            <TextField
              label="Date"
              type="date"
              value={dateFilter}
              onChange={(event) => onDateChange(event.target.value)}
            />
            <SelectField
              label="Status"
              value={statusFilter}
              onChange={(event) => onStatusChange(event.target.value)}
            >
              <option value="all">All</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
            </SelectField>
          </div>
        </ScreenSection>

        <ScreenSection className="mt-6 space-y-4">
          {rides.length > 0 ? (
            rides.map((ride) => (
              <div
                key={ride.id}
                className="rounded-[1.75rem] border border-muted/20 bg-white px-4 py-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold text-ink">{ride.passengerName}</p>
                    <p className="mt-1 text-sm text-muted">
                      {new Date(ride.timestamp).toLocaleTimeString("en-PH", {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {ride.paid ? (
                    <span className="rounded-full bg-success/15 px-3 py-1 text-xs font-semibold text-success">
                      PAID
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onMarkPaid(ride.id)}
                      className="rounded-full bg-primary px-3 py-2 text-xs font-semibold text-white"
                    >
                      Mark Paid
                    </button>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted">Ride Type</p>
                    <p className="mt-1 font-semibold text-ink">{ride.rideType}</p>
                  </div>
                  <div>
                    <p className="text-muted">Fare</p>
                    <p className="mt-1 font-semibold text-ink">{formatCurrency(ride.fare)}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted">Route</p>
                    <p className="mt-1 font-semibold text-ink">
                      {ride.pickupPoint} → {ride.dropoffPoint}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted">Payment</p>
                    <p className="mt-1 font-semibold text-ink">{ride.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-muted">Status</p>
                    <p className="mt-1 font-semibold text-ink">
                      {ride.paid ? "Paid" : "Unpaid"}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[1.75rem] border border-dashed border-muted/40 bg-white px-4 py-8 text-center text-sm text-muted">
              No rides match the current search and filter settings.
            </div>
          )}
        </ScreenSection>
      </div>
    </>
  );
}

function WalletScreen({
  totalEarnings,
  unpaidBalance,
  paidCollected,
  gcashTotal,
  cashTotal,
  payLaterTotal,
  paidRideCount,
  unpaidRideCount,
  onBack,
}) {
  return (
    <>
      <Header
        title="Wallet"
        onLeftClick={onBack}
        leftIcon={<ArrowLeftIcon />}
        rightSlot={<div className="w-11" />}
      />
      <div className="flex-1 overflow-y-auto pb-6">
        <ScreenSection>
          <div className="rounded-[2rem] bg-primary px-5 py-6 text-white shadow-ledger">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/75">
              Funds Overview
            </p>
            <p className="mt-3 text-3xl font-semibold">{formatCurrency(paidCollected)}</p>
            <p className="mt-2 text-sm text-white/80">
              Collected funds currently recorded in the ledger
            </p>
          </div>
        </ScreenSection>

        <ScreenSection className="mt-6 grid grid-cols-2 gap-3">
          <SummaryMetric label="Gross Ledger" value={formatCurrency(totalEarnings)} />
          <SummaryMetric label="Unpaid Exposure" value={formatCurrency(unpaidBalance)} />
        </ScreenSection>

        <ScreenSection className="mt-6">
          <div className="rounded-[1.75rem] border border-muted/20 bg-white px-4 py-4 shadow-sm">
            <p className="text-sm font-semibold text-ink">Payment Method Breakdown</p>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between rounded-2xl bg-appbg/80 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-ink">GCash</p>
                  <p className="text-xs text-muted">Digital payments received</p>
                </div>
                <p className="text-sm font-semibold text-ink">{formatCurrency(gcashTotal)}</p>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-appbg/80 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-ink">Cash</p>
                  <p className="text-xs text-muted">Cash transactions logged</p>
                </div>
                <p className="text-sm font-semibold text-ink">{formatCurrency(cashTotal)}</p>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-appbg/80 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-ink">Pay Later</p>
                  <p className="text-xs text-muted">Pending collection pipeline</p>
                </div>
                <p className="text-sm font-semibold text-ink">{formatCurrency(payLaterTotal)}</p>
              </div>
            </div>
          </div>
        </ScreenSection>

        <ScreenSection className="mt-6">
          <div className="rounded-[1.75rem] bg-card px-4 py-4 shadow-sm">
            <p className="text-sm font-semibold text-ink">Settlement Snapshot</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white/70 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                  Paid Rides
                </p>
                <p className="mt-2 text-2xl font-semibold text-ink">{paidRideCount}</p>
              </div>
              <div className="rounded-2xl bg-white/70 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                  Unpaid Rides
                </p>
                <p className="mt-2 text-2xl font-semibold text-ink">{unpaidRideCount}</p>
              </div>
            </div>
          </div>
        </ScreenSection>
      </div>
    </>
  );
}

function SettingsSheet({ open, draftExists, onClose, onClearDraft, onResetRides }) {
  if (!open) {
    return null;
  }

  return (
    <div className="absolute inset-0 z-20 flex items-end bg-ink/30 p-4">
      <div className="w-full rounded-[2rem] bg-white p-5 shadow-ledger">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-ink">Settings</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-appbg px-3 py-2 text-xs font-semibold text-primary"
          >
            Close
          </button>
        </div>
        <p className="mt-2 text-sm text-muted">
          Quick admin actions for this single-user ledger.
        </p>
        <div className="mt-5 space-y-3">
          <SecondaryButton
            type="button"
            onClick={onClearDraft}
            className={!draftExists ? "opacity-50" : ""}
            disabled={!draftExists}
          >
            Clear Saved Draft
          </SecondaryButton>
          <SecondaryButton type="button" onClick={onResetRides}>
            Clear All Ride Entries
          </SecondaryButton>
        </div>
      </div>
    </div>
  );
}

function MenuSheet({ open, onClose, onNavigate }) {
  if (!open) {
    return null;
  }

  return (
    <div className="absolute inset-0 z-20 flex items-start bg-ink/20 p-4">
      <div className="w-[82%] rounded-[2rem] bg-white p-5 shadow-ledger">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-ink">Admin Ledger</h3>
            <p className="text-sm text-muted">Business ride controls</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-appbg px-3 py-2 text-xs font-semibold text-primary"
          >
            Close
          </button>
        </div>
        <div className="mt-5 space-y-3">
          <SecondaryButton type="button" onClick={() => onNavigate("dashboard")}>
            Dashboard
          </SecondaryButton>
          <SecondaryButton type="button" onClick={() => onNavigate("details")}>
            Add Ride
          </SecondaryButton>
          <SecondaryButton type="button" onClick={() => onNavigate("history")}>
            Ride History
          </SecondaryButton>
        </div>
      </div>
    </div>
  );
}

function HamburgerIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
      <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function App() {
  const [screen, setScreen] = useState("dashboard");
  const [rides, setRides] = useState(() => {
    const saved = localStorage.getItem("rides");
    return saved ? JSON.parse(saved) : [];
  });
  const [rideForm, setRideForm] = useState(() => {
    const savedDraft = localStorage.getItem("rideDraft");
    return savedDraft ? JSON.parse(savedDraft) : emptyRideForm();
  });
  const [hasDraft, setHasDraft] = useState(
    () => Boolean(localStorage.getItem("rideDraft")),
  );
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cashStatus, setCashStatus] = useState("Paid");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("rides", JSON.stringify(rides));
  }, [rides]);

  const fare = useMemo(
    () =>
      calculateFare(
        rideForm.pickupPoint,
        rideForm.dropoffPoint,
        rideForm.rideType,
      ),
    [rideForm.dropoffPoint, rideForm.pickupPoint, rideForm.rideType],
  );

  const totalEarnings = useMemo(
    () => rides.reduce((sum, ride) => sum + Number(ride.fare || 0), 0),
    [rides],
  );

  const paidCollected = useMemo(
    () =>
      rides.reduce(
        (sum, ride) => sum + (ride.paid ? Number(ride.fare || 0) : 0),
        0,
      ),
    [rides],
  );

  const unpaidBalance = useMemo(
    () =>
      rides.reduce(
        (sum, ride) => sum + (ride.paid ? 0 : Number(ride.fare || 0)),
        0,
      ),
    [rides],
  );

  const gcashTotal = useMemo(
    () =>
      rides.reduce(
        (sum, ride) =>
          sum + (ride.paymentMethod === "GCash" ? Number(ride.fare || 0) : 0),
        0,
      ),
    [rides],
  );

  const cashTotal = useMemo(
    () =>
      rides.reduce(
        (sum, ride) =>
          sum + (ride.paymentMethod === "Cash" ? Number(ride.fare || 0) : 0),
        0,
      ),
    [rides],
  );

  const payLaterTotal = useMemo(
    () =>
      rides.reduce(
        (sum, ride) =>
          sum +
          (ride.paymentMethod === "Pay Later" ? Number(ride.fare || 0) : 0),
        0,
      ),
    [rides],
  );

  const paidRideCount = useMemo(
    () => rides.filter((ride) => ride.paid).length,
    [rides],
  );

  const unpaidRideCount = useMemo(
    () => rides.filter((ride) => !ride.paid).length,
    [rides],
  );

  const filteredRides = useMemo(() => {
    return rides
      .filter((ride) => {
        const query = searchTerm.trim().toLowerCase();
        const matchesQuery =
          !query ||
          ride.passengerName.toLowerCase().includes(query) ||
          ride.pickupPoint.toLowerCase().includes(query) ||
          ride.dropoffPoint.toLowerCase().includes(query);

        const matchesDate = !dateFilter || ride.rideDate === dateFilter;
        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "paid" && ride.paid) ||
          (statusFilter === "unpaid" && !ride.paid);

        return matchesQuery && matchesDate && matchesStatus;
      })
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [dateFilter, rides, searchTerm, statusFilter]);

  const timestampPreview = formatDateTime(new Date().toISOString());

  function updateRideForm(field, value) {
    setRideForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function goToDetails() {
    setScreen("details");
    setSettingsOpen(false);
    setMenuOpen(false);
  }

  function saveDraft() {
    localStorage.setItem("rideDraft", JSON.stringify(rideForm));
    setHasDraft(true);
    setScreen("dashboard");
  }

  function proceedToPayment() {
    if (!rideForm.passengerName.trim()) {
      return;
    }

    setScreen("payment");
  }

  function handlePaymentMethodChange(method) {
    setPaymentMethod(method);

    if (method === "Pay Later") {
      setCashStatus("Not Paid");
    }

    if (method === "GCash") {
      setCashStatus("Paid");
    }
  }

  function saveEntry() {
    if (!paymentMethod) {
      return;
    }

    const timestamp = new Date().toISOString();
    const paid =
      paymentMethod === "GCash" ||
      (paymentMethod === "Cash" && cashStatus === "Paid");

    const newRide = {
      id: crypto.randomUUID(),
      passengerName: rideForm.passengerName.trim(),
      rideDate: rideForm.rideDate,
      rideType: rideForm.rideType,
      pickupPoint: rideForm.pickupPoint,
      dropoffPoint: rideForm.dropoffPoint,
      fare,
      paymentMethod,
      paid,
      timestamp,
    };

    setRides((current) => [newRide, ...current]);
    setRideForm(emptyRideForm());
    setHasDraft(false);
    setPaymentMethod("");
    setCashStatus("Paid");
    localStorage.removeItem("rideDraft");
    setScreen("history");
  }

  function handleMarkPaid(id) {
    setRides((current) =>
      current.map((ride) =>
        ride.id === id ? { ...ride, paid: true } : ride,
      ),
    );
  }

  function handleBottomNavChange(key) {
    if (key === "home") {
      setScreen("dashboard");
      return;
    }

    if (key === "history") {
      setScreen("history");
      return;
    }

    if (key === "wallet") {
      setScreen("wallet");
      return;
    }

    if (key === "settings") {
      setSettingsOpen(true);
    }
  }

  function clearDraft() {
    localStorage.removeItem("rideDraft");
    setRideForm(emptyRideForm());
    setHasDraft(false);
    setSettingsOpen(false);
  }

  function resetRides() {
    setRides([]);
    setSettingsOpen(false);
  }

  const activeNavKey =
    screen === "history"
      ? "history"
      : screen === "wallet"
        ? "wallet"
        : settingsOpen
          ? "settings"
          : "home";

  return (
    <MobileShell>
      <div className="relative flex min-h-[calc(100vh-2.5rem)] flex-1 flex-col">
        {screen === "dashboard" && (
          <Dashboard
            totalEarnings={totalEarnings}
            onAddRide={goToDetails}
            onHistory={() => setScreen("history")}
            onOpenMenu={() => setMenuOpen(true)}
            onOpenSettings={() => setSettingsOpen(true)}
          />
        )}

        {screen === "details" && (
          <AddRideDetails
            form={rideForm}
            timestampPreview={timestampPreview}
            onChange={updateRideForm}
            onContinue={proceedToPayment}
            onBack={() => setScreen("dashboard")}
            onSaveDraft={saveDraft}
          />
        )}

        {screen === "payment" && (
          <PaymentScreen
            form={rideForm}
            fare={fare}
            paymentMethod={paymentMethod}
            cashStatus={cashStatus}
            onBack={() => setScreen("details")}
            onPaymentMethodChange={handlePaymentMethodChange}
            onCashStatusChange={setCashStatus}
            onSave={saveEntry}
          />
        )}

        {screen === "history" && (
          <RideHistory
            rides={filteredRides}
            totalEarnings={totalEarnings}
            unpaidBalance={unpaidBalance}
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            dateFilter={dateFilter}
            onSearchChange={setSearchTerm}
            onStatusChange={setStatusFilter}
            onDateChange={setDateFilter}
            onMarkPaid={handleMarkPaid}
            onBack={() => setScreen("dashboard")}
          />
        )}

        {screen === "wallet" && (
          <WalletScreen
            totalEarnings={totalEarnings}
            unpaidBalance={unpaidBalance}
            paidCollected={paidCollected}
            gcashTotal={gcashTotal}
            cashTotal={cashTotal}
            payLaterTotal={payLaterTotal}
            paidRideCount={paidRideCount}
            unpaidRideCount={unpaidRideCount}
            onBack={() => setScreen("dashboard")}
          />
        )}

        <BottomNav activeKey={activeNavKey} onChange={handleBottomNavChange} />

        <SettingsSheet
          open={settingsOpen}
          draftExists={hasDraft}
          onClose={() => setSettingsOpen(false)}
          onClearDraft={clearDraft}
          onResetRides={resetRides}
        />
        <MenuSheet
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          onNavigate={(nextScreen) => {
            setMenuOpen(false);
            setScreen(nextScreen);
          }}
        />
      </div>
    </MobileShell>
  );
}
