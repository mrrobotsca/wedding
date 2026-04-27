"use client";

import { useState, useCallback, useEffect } from "react";
import { useParams } from "next/navigation";
import type { Guest, RSVP, ActivityLog, SiteContent } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

type Tab = "overview" | "guests" | "rsvps" | "logs" | "content";
interface EnrichedRSVP extends RSVP { guestName: string; inviteType: string; }
interface EnrichedLog extends ActivityLog { guestName: string; }

const F = "'Montserrat', sans-serif";
const C = {
  bg: "#f5f5f4", card: "#ffffff", border: "#e5e5e3", accent: "#9f9f9d",
  accentDark: "#6a6a68", text: "#2a2a2a", dim: "#8a8a88", dimLight: "#bfbfbd",
  red: "#c0453a", green: "#4a8a5a",
};

const s = {
  btn: (v: "primary" | "outline" | "danger" = "primary"): React.CSSProperties => ({
    fontFamily: F, fontSize: 13, fontWeight: 500, cursor: "pointer",
    borderRadius: 10, padding: "12px 28px", display: "inline-flex",
    alignItems: "center", justifyContent: "center", lineHeight: 1,
    ...(v === "primary" ? { color: "#fff", background: C.accent, border: "none" }
      : v === "danger" ? { color: C.red, background: "transparent", border: `1.5px solid ${C.red}40` }
      : { color: C.dim, background: "transparent", border: `1.5px solid ${C.border}` }),
  }),
  inp: {
    fontFamily: F, fontSize: 14, fontWeight: 400, color: C.text,
    background: C.bg, border: `1.5px solid ${C.border}`, borderRadius: 10,
    padding: "14px 18px", width: "100%", outline: "none",
  } as React.CSSProperties,
  lbl: {
    fontFamily: F, fontSize: 11, fontWeight: 600, color: C.dim,
    marginBottom: 10, display: "block", letterSpacing: "0.08em",
  } as React.CSSProperties,
  tag: {
    fontFamily: F, fontSize: 11, fontWeight: 500, color: C.dim,
    background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8,
    padding: "7px 14px", display: "inline-flex", alignItems: "center",
    justifyContent: "center", lineHeight: 1,
  } as React.CSSProperties,
  card: {
    background: C.card, border: `1px solid ${C.border}`,
    borderRadius: 16, padding: 40, boxShadow: "0 2px 16px rgba(0,0,0,0.03)",
  } as React.CSSProperties,
  heading: {
    fontFamily: F, fontSize: 22, fontWeight: 500, color: C.text, marginBottom: 32,
  } as React.CSSProperties,
};

export default function AdminPanel() {
  const params = useParams();
  const token = params.token as string;
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [tab, setTab] = useState<Tab>("overview");
  const [guests, setGuests] = useState<Guest[]>([]);
  const [rsvps, setRsvps] = useState<EnrichedRSVP[]>([]);
  const [logs, setLogs] = useState<EnrichedLog[]>([]);
  const [origin, setOrigin] = useState("");
  const headers = { "x-admin-token": token, "Content-Type": "application/json" };

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const fetchAll = useCallback(async () => {
    const [g, r, l] = await Promise.all([
      fetch("/api/admin/guests", { headers }).then((res) => res.json()),
      fetch("/api/admin/rsvps", { headers }).then((res) => res.json()),
      fetch("/api/admin/logs", { headers }).then((res) => res.json()),
    ]);
    setGuests(g); setRsvps(r); setLogs(l);
  }, [token]);

  const handleLogin = async () => {
    const res = await fetch("/api/admin/auth", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    if (res.ok) { setAuthed(true); setAuthError(""); fetchAll(); }
    else { const d = await res.json(); setAuthError(d.error || "Login failed"); }
  };

  // ── Login ──
  if (!authed) {
    return (
      <div suppressHydrationWarning style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.bg, fontFamily: F }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32, width: "100%", maxWidth: 380, padding: "0 24px" }}>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: 42, color: C.accent, marginBottom: 8 }}>S &amp; A</p>
            <p style={{ fontSize: 11, color: C.dim, letterSpacing: "0.25em", textTransform: "uppercase" }}>Wedding Admin</p>
          </div>
          <div style={{ ...s.card, width: "100%" }}>
            <label style={s.lbl}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()} placeholder="Enter password" style={s.inp} />
            {authError && <p style={{ fontSize: 13, color: C.red, marginTop: 12 }}>{authError}</p>}
            <button onClick={handleLogin} style={{ ...s.btn(), width: "100%", marginTop: 24 }}>Sign In</button>
          </div>
        </div>
      </div>
    );
  }

  const totalAttending = rsvps.filter((r) => r.attending).length;
  const totalDeclined = rsvps.filter((r) => !r.attending).length;
  const totalPending = guests.length - rsvps.length;

  const TABS: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "guests", label: "Guests" },
    { id: "rsvps", label: "RSVPs" },
    { id: "logs", label: "Activity" },
    { id: "content", label: "Site Content" },
  ];

  return (
    <div suppressHydrationWarning style={{ minHeight: "100vh", display: "flex", background: C.bg, fontFamily: F, color: C.text, margin: 0, padding: 0, boxSizing: "border-box", overflow: "hidden" }}>
      {/* ── Sidebar ── */}
      <div style={{ width: 240, minWidth: 240, maxWidth: 240, flexShrink: 0, display: "flex", flexDirection: "column", background: C.card, borderRight: `1px solid ${C.border}` }}>
        <div style={{ padding: "36px 28px 24px" }}>
          <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: 28, color: C.accent }}>Sarah &amp; Arman</p>
          <p style={{ fontSize: 10, color: C.dimLight, letterSpacing: "0.2em", textTransform: "uppercase", marginTop: 6 }}>Admin Panel</p>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 4, padding: "0 16px", flex: 1 }}>
          {TABS.map((t) => (
            <button key={t.id} onClick={() => { setTab(t.id); fetchAll(); }}
              style={{
                fontFamily: F, fontSize: 14, textAlign: "left", padding: "14px 18px",
                borderRadius: 12, border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 12,
                background: tab === t.id ? `${C.accent}18` : "transparent",
                color: tab === t.id ? C.text : C.dim,
                fontWeight: tab === t.id ? 500 : 400,
              }}>
              {t.label}
            </button>
          ))}
        </nav>

        <div style={{ padding: "0 16px 24px" }}>
          <button onClick={async () => {
            const res = await fetch("/api/admin/rsvps?format=csv", { headers });
            const blob = await res.blob(); const url = URL.createObjectURL(blob);
            const a = document.createElement("a"); a.href = url; a.download = "guest-list.csv"; a.click();
          }} style={{ ...s.btn("outline"), width: "100%", fontSize: 12, padding: "10px 16px" }}>
            Export CSV
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ flex: 1, overflowY: "auto", minWidth: 0 }}>
        {/* Top bar */}
        <div style={{ position: "sticky", top: 0, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 48px", background: `${C.bg}`, borderBottom: `1px solid ${C.border}`, width: "100%", boxSizing: "border-box" }}>
          <h1 style={{ fontSize: 20, fontWeight: 500, margin: 0 }}>{TABS.find((t) => t.id === tab)?.label}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            {[
              { color: C.green, label: `${totalAttending} attending` },
              { color: C.red, label: `${totalDeclined} declined` },
              { color: C.dimLight, label: `${totalPending} pending` },
            ].map((x) => (
              <div key={x.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: x.color, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: C.dim }}>{x.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: 48 }}>
          {tab === "overview" && <OverviewTab guests={guests} rsvps={rsvps} logs={logs} />}
          {tab === "guests" && <GuestsTab guests={guests} headers={headers} onRefresh={fetchAll} />}
          {tab === "rsvps" && <RSVPsTab rsvps={rsvps} guests={guests} />}
          {tab === "logs" && <LogsTab logs={logs} />}
          {tab === "content" && <ContentTab headers={headers} />}
        </div>
      </div>
    </div>
  );
}

// ── Overview ──

function OverviewTab({ guests, rsvps, logs }: { guests: Guest[]; rsvps: EnrichedRSVP[]; logs: EnrichedLog[] }) {
  // Build a guest lookup
  const guestById = new Map(guests.map((g) => [g.id, g]));
  const rsvpByGuest = new Map(rsvps.map((r) => [r.guestId, r]));

  // Attending breakdown
  const attendingRsvps = rsvps.filter((r) => r.attending);
  const declinedRsvps = rsvps.filter((r) => !r.attending);

  let attendingFamilies = 0;
  let attendingIndividuals = 0;
  let totalPeopleAttending = 0;

  for (const r of attendingRsvps) {
    const g = guestById.get(r.guestId);
    if (!g) continue;
    if (g.inviteType === "family") {
      attendingFamilies += 1;
      totalPeopleAttending += g.familyMembers?.length || 1;
    } else {
      attendingIndividuals += 1;
      totalPeopleAttending += 1;
      if (r.companionName?.trim()) totalPeopleAttending += 1;
    }
  }

  const pendingGuests = guests.filter((g) => !rsvpByGuest.has(g.id));
  const respondedGuests = guests.filter((g) => rsvpByGuest.has(g.id));

  const stats = [
    { label: "Total Guests", value: guests.length, color: C.accent },
    { label: "Attending", value: attendingRsvps.length, color: C.green },
    { label: "Declined", value: declinedRsvps.length, color: C.red },
    { label: "Pending", value: pendingGuests.length, color: C.dimLight },
  ];

  const peopleStats = [
    { label: "Total People Attending", value: totalPeopleAttending, color: C.green },
    { label: "Families Attending", value: attendingFamilies, color: C.accent },
    { label: "Individuals Attending", value: attendingIndividuals, color: C.accent },
  ];

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, marginBottom: 24 }}>
        {stats.map((st) => (
          <div key={st.label} style={{ ...s.card, padding: 32 }}>
            <p style={{ fontSize: 11, color: C.dim, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16 }}>{st.label}</p>
            <p style={{ fontSize: 40, fontWeight: 300, color: st.color, lineHeight: 1 }}>{st.value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginBottom: 48 }}>
        {peopleStats.map((st) => (
          <div key={st.label} style={{ ...s.card, padding: 32 }}>
            <p style={{ fontSize: 11, color: C.dim, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16 }}>{st.label}</p>
            <p style={{ fontSize: 40, fontWeight: 300, color: st.color, lineHeight: 1 }}>{st.value}</p>
          </div>
        ))}
      </div>

      {/* Live RSVP status — two columns */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 48 }}>
        <div style={{ ...s.card, padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "18px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: C.dim, margin: 0 }}>Responded</p>
            <span style={{ fontSize: 12, color: C.dimLight }}>{respondedGuests.length} / {guests.length}</span>
          </div>
          <div style={{ maxHeight: 320, overflow: "auto" }}>
            {respondedGuests.length === 0 ? (
              <p style={{ padding: 24, fontSize: 14, color: C.dimLight }}>No responses yet</p>
            ) : (
              respondedGuests.map((g, i) => {
                const r = rsvpByGuest.get(g.id);
                const attending = r?.attending;
                return (
                  <div key={g.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 24px", borderBottom: i < respondedGuests.length - 1 ? `1px solid ${C.border}` : "none" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: attending ? C.green : C.red, flexShrink: 0 }} />
                      <span style={{ fontSize: 13 }}>{g.greetingName}</span>
                      <span style={{ ...s.tag, fontSize: 9, padding: "3px 8px" }}>{g.inviteType}</span>
                    </div>
                    <span style={{ fontSize: 11, color: attending ? C.green : C.red, fontWeight: 500 }}>{attending ? "Yes" : "No"}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div style={{ ...s.card, padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "18px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: C.dim, margin: 0 }}>Awaiting Response</p>
            <span style={{ fontSize: 12, color: C.dimLight }}>{pendingGuests.length}</span>
          </div>
          <div style={{ maxHeight: 320, overflow: "auto" }}>
            {pendingGuests.length === 0 ? (
              <p style={{ padding: 24, fontSize: 14, color: C.dimLight }}>Everyone has responded</p>
            ) : (
              pendingGuests.map((g, i) => (
                <div key={g.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 24px", borderBottom: i < pendingGuests.length - 1 ? `1px solid ${C.border}` : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.dimLight, flexShrink: 0 }} />
                    <span style={{ fontSize: 13 }}>{g.greetingName}</span>
                    <span style={{ ...s.tag, fontSize: 9, padding: "3px 8px" }}>{g.inviteType}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <p style={{ fontSize: 14, fontWeight: 500, color: C.dim, marginBottom: 20 }}>Recent Activity</p>
      <div style={{ ...s.card, padding: 0, overflow: "hidden" }}>
        {logs.length === 0 ? (
          <p style={{ padding: 32, fontSize: 14, color: C.dimLight }}>No activity yet</p>
        ) : (
          logs.slice(-8).reverse().map((log, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 32px", borderBottom: i < 7 ? `1px solid ${C.border}` : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: log.event === "rsvp_submitted" ? C.green : C.dimLight, flexShrink: 0 }} />
                <span style={{ fontSize: 14 }}>{log.guestName}</span>
                <span style={{ ...s.tag, fontSize: 10, padding: "4px 10px" }}>{log.event.replace(/_/g, " ")}</span>
              </div>
              <span style={{ fontSize: 12, color: C.dimLight }}>{new Date(log.timestamp).toLocaleString()}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ── Guests ──

function GuestsTab({ guests, headers, onRefresh }: { guests: Guest[]; headers: Record<string, string>; onRefresh: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [form, setForm] = useState({
    greetingName: "", inviteType: "individual" as "individual" | "family",
    allowCompanion: false, familyMembers: [] as { id: string; name: string }[],
  });

  const resetForm = () => { setForm({ greetingName: "", inviteType: "individual", allowCompanion: false, familyMembers: [] }); setEditId(null); setShowForm(false); };

  const startEdit = (g: Guest) => {
    setForm({ greetingName: g.greetingName, inviteType: g.inviteType, allowCompanion: g.allowCompanion, familyMembers: g.familyMembers });
    setEditId(g.id); setShowForm(true);
  };

  const handleSave = async () => {
    if (editId) await fetch("/api/admin/guests", { method: "PUT", headers, body: JSON.stringify({ id: editId, ...form }) });
    else await fetch("/api/admin/guests", { method: "POST", headers, body: JSON.stringify(form) });
    resetForm(); onRefresh();
  };

  const handleDelete = async (id: string) => { await fetch(`/api/admin/guests?id=${id}`, { method: "DELETE", headers }); onRefresh(); };

  const copyLink = (id: string) => {
    const link = `${origin}/invite/${id}`;
    navigator.clipboard.writeText(link);
    setCopied(id); setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
        <p style={{ fontSize: 14, color: C.dim }}>{guests.length} guest{guests.length !== 1 ? "s" : ""}</p>
        <button onClick={() => { resetForm(); setShowForm(true); }} style={s.btn()}>+ Add Guest</button>
      </div>

      {/* Form */}
      {showForm && (
        <div style={{ ...s.card, marginBottom: 32 }}>
          <p style={{ fontSize: 16, fontWeight: 500, marginBottom: 28 }}>{editId ? "Edit Guest" : "New Guest"}</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
            <div>
              <label style={s.lbl}>Greeting Name</label>
              <input value={form.greetingName} onChange={(e) => setForm((f) => ({ ...f, greetingName: e.target.value }))} placeholder="e.g. Bary Family" style={s.inp} />
            </div>
            <div>
              <label style={s.lbl}>Invite Type</label>
              <select value={form.inviteType} onChange={(e) => setForm((f) => ({ ...f, inviteType: e.target.value as "individual" | "family" }))} style={s.inp}>
                <option value="individual">Individual</option>
                <option value="family">Family</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
              <input type="checkbox" checked={form.allowCompanion} onChange={(e) => setForm((f) => ({ ...f, allowCompanion: e.target.checked }))}
                style={{ width: 18, height: 18, accentColor: C.accent }} />
              <span style={{ fontSize: 14, color: C.dim }}>Allow companion (+1)</span>
            </label>
          </div>

          {form.inviteType === "family" && (
            <div style={{ marginBottom: 24 }}>
              <label style={s.lbl}>Family Members</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {form.familyMembers.map((m) => (
                  <div key={m.id} style={{ display: "flex", gap: 12 }}>
                    <input value={m.name} onChange={(e) => setForm((f) => ({ ...f, familyMembers: f.familyMembers.map((x) => x.id === m.id ? { ...x, name: e.target.value } : x) }))} placeholder="Member name" style={{ ...s.inp, flex: 1 }} />
                    <button onClick={() => setForm((f) => ({ ...f, familyMembers: f.familyMembers.filter((x) => x.id !== m.id) }))} style={s.btn("danger")}>Remove</button>
                  </div>
                ))}
                <button onClick={() => setForm((f) => ({ ...f, familyMembers: [...f.familyMembers, { id: uuidv4(), name: "" }] }))}
                  style={{ fontFamily: F, fontSize: 13, color: C.accent, cursor: "pointer", background: "none", border: "none", textAlign: "left", padding: 0, marginTop: 4 }}>
                  + Add member
                </button>
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
            <button onClick={handleSave} style={s.btn()}>{editId ? "Update" : "Create Guest"}</button>
            <button onClick={resetForm} style={s.btn("outline")}>Cancel</button>
          </div>
        </div>
      )}

      {/* Guest cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {guests.map((g) => {
          const inviteLink = `${origin}/invite/${g.id}`;
          return (
            <div key={g.id} style={s.card}>
              {/* Header */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
                <div>
                  <p style={{ fontSize: 18, fontWeight: 500, marginBottom: 12 }}>{g.greetingName}</p>
                  <div style={{ display: "flex", gap: 8 }}>
                    <span style={s.tag}>{g.inviteType}</span>
                    {g.allowCompanion && <span style={s.tag}>+1</span>}
                    {g.familyMembers.length > 0 && <span style={s.tag}>{g.familyMembers.length} members</span>}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => startEdit(g)} style={s.btn("outline")}>Edit</button>
                  <button onClick={() => handleDelete(g.id)} style={s.btn("danger")}>Delete</button>
                </div>
              </div>

              {/* Family members */}
              {g.familyMembers.length > 0 && (
                <div style={{ marginBottom: 24, padding: "16px 20px", borderRadius: 12, background: C.bg }}>
                  <p style={{ fontSize: 10, color: C.dimLight, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10 }}>Members</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                    {g.familyMembers.map((m) => <span key={m.id} style={{ fontSize: 14, color: C.dim }}>{m.name}</span>)}
                  </div>
                </div>
              )}

              {/* Invite link */}
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 10, color: C.dimLight, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10 }}>Invite Link</p>
                <div style={{ display: "flex", gap: 10 }}>
                  <div style={{ flex: 1, padding: "14px 18px", borderRadius: 12, background: C.bg, border: `1px solid ${C.border}`, fontSize: 13, color: C.dim, fontFamily: "monospace", overflowX: "auto", whiteSpace: "nowrap" }}>
                    {inviteLink}
                  </div>
                  <button onClick={() => copyLink(g.id)}
                    style={{ ...s.btn(copied === g.id ? "primary" : "outline"), minWidth: 90 }}>
                    {copied === g.id ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              <p style={{ fontSize: 11, color: C.dimLight }}>Created {new Date(g.createdAt).toLocaleDateString()}</p>
            </div>
          );
        })}
        {guests.length === 0 && (
          <div style={{ ...s.card, textAlign: "center", padding: 60 }}>
            <p style={{ fontSize: 16, color: C.dimLight, marginBottom: 8 }}>No guests yet</p>
            <p style={{ fontSize: 13, color: C.dimLight }}>Add your first guest to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── RSVPs ──

function RSVPsTab({ rsvps, guests }: { rsvps: EnrichedRSVP[]; guests: Guest[] }) {
  return (
    <div>
      <p style={{ fontSize: 14, color: C.dim, marginBottom: 32 }}>{rsvps.length} response{rsvps.length !== 1 ? "s" : ""}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {rsvps.map((r) => {
          const guest = guests.find((g) => g.id === r.guestId);
          return (
            <div key={r.guestId} style={s.card}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <p style={{ fontSize: 17, fontWeight: 500 }}>{r.guestName}</p>
                <span style={{
                  fontSize: 12, fontWeight: 500, padding: "8px 20px", borderRadius: 999,
                  display: "inline-flex", alignItems: "center", lineHeight: 1,
                  color: r.attending ? C.green : C.red,
                  background: r.attending ? `${C.green}15` : `${C.red}15`,
                  border: `1px solid ${r.attending ? `${C.green}30` : `${C.red}30`}`,
                }}>
                  {r.attending ? "Attending" : "Declined"}
                </span>
              </div>

              {r.attending && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 32px", padding: "20px 24px", borderRadius: 12, background: C.bg, fontSize: 13, color: C.dim, lineHeight: 2 }}>
                  <p><strong style={{ color: C.accentDark }}>Meal:</strong> {r.mealChoice || "—"}</p>
                  <p><strong style={{ color: C.accentDark }}>Phone:</strong> {r.phone || "—"}</p>
                  {r.allergies && <p><strong style={{ color: C.accentDark }}>Allergies:</strong> {r.allergies}</p>}
                  {r.song && <p><strong style={{ color: C.accentDark }}>Song:</strong> {r.song}</p>}
                  {r.companionName && <p><strong style={{ color: C.accentDark }}>Companion:</strong> {r.companionName} ({r.companionMeal})</p>}
                  {guest?.inviteType === "family" && r.familyMeals && (
                    <p style={{ gridColumn: "1 / -1" }}><strong style={{ color: C.accentDark }}>Family:</strong> {guest.familyMembers.map((m) => `${m.name}: ${r.familyMeals[m.id] || "—"}`).join(" · ")}</p>
                  )}
                  {r.message && <p style={{ gridColumn: "1 / -1" }}><strong style={{ color: C.accentDark }}>Message:</strong> {r.message}</p>}
                </div>
              )}

              <p style={{ fontSize: 11, color: C.dimLight, marginTop: 20 }}>Submitted {new Date(r.submittedAt).toLocaleString()}</p>
            </div>
          );
        })}
        {rsvps.length === 0 && (
          <div style={{ ...s.card, textAlign: "center", padding: 60 }}>
            <p style={{ fontSize: 16, color: C.dimLight }}>No RSVPs yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Logs ──

function LogsTab({ logs }: { logs: EnrichedLog[] }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const grouped: Record<string, { guestName: string; logs: EnrichedLog[] }> = {};
  for (const log of logs) {
    if (!grouped[log.guestId]) grouped[log.guestId] = { guestName: log.guestName, logs: [] };
    grouped[log.guestId].logs.push(log);
  }
  const groups = Object.entries(grouped).sort((a, b) => b[1].logs.length - a[1].logs.length);

  const toggle = (id: string) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div>
      <p style={{ fontSize: 14, color: C.dim, marginBottom: 32 }}>{logs.length} event{logs.length !== 1 ? "s" : ""} across {groups.length} guest{groups.length !== 1 ? "s" : ""}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {groups.map(([guestId, group]) => {
          const isOpen = expanded[guestId] ?? false;
          return (
            <div key={guestId} style={{ ...s.card, padding: 0, overflow: "hidden" }}>
              {/* Collapsible header */}
              <button
                onClick={() => toggle(guestId)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "20px 32px", width: "100%", border: "none", background: "transparent",
                  cursor: "pointer", fontFamily: F, textAlign: "left",
                  borderBottom: isOpen ? `1px solid ${C.border}` : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  {/* Arrow */}
                  <span style={{
                    fontSize: 10, color: C.dimLight, transition: "transform 0.2s",
                    transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                    display: "inline-block",
                  }}>
                    ▶
                  </span>
                  <p style={{ fontSize: 15, fontWeight: 500, margin: 0, color: C.text }}>{group.guestName}</p>
                  <span style={{ ...s.tag, fontSize: 10, padding: "4px 10px" }}>{group.logs.length} event{group.logs.length !== 1 ? "s" : ""}</span>
                </div>
                <span style={{ fontSize: 11, color: C.dimLight, fontFamily: "monospace" }}>{guestId.slice(0, 12)}...</span>
              </button>

              {/* Collapsible content */}
              {isOpen && group.logs.slice().reverse().map((log, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "18px 32px 18px 60px", borderBottom: i < group.logs.length - 1 ? `1px solid ${C.border}` : "none" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0, background: log.event === "rsvp_submitted" ? C.green : log.event === "link_opened" ? C.accent : C.dimLight }} />
                      <span style={{ fontSize: 13, color: C.dim }}>{log.event.replace(/_/g, " ")}</span>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginLeft: 20 }}>
                      {(log as any).device && <span style={{ ...s.tag, fontSize: 9, padding: "3px 8px" }}>{(log as any).device}</span>}
                      {(log as any).screenSize && <span style={{ ...s.tag, fontSize: 9, padding: "3px 8px" }}>{(log as any).screenSize}</span>}
                      {(log as any).platform && <span style={{ ...s.tag, fontSize: 9, padding: "3px 8px" }}>{(log as any).platform}</span>}
                      {(log as any).language && <span style={{ ...s.tag, fontSize: 9, padding: "3px 8px" }}>{(log as any).language}</span>}
                      {log.ip && log.ip !== "unknown" && <span style={{ ...s.tag, fontSize: 9, padding: "3px 8px" }}>IP: {log.ip}</span>}
                    </div>
                  </div>
                  <span style={{ fontSize: 12, color: C.dimLight, whiteSpace: "nowrap", marginLeft: 16 }}>{new Date(log.timestamp).toLocaleString()}</span>
                </div>
              ))}
            </div>
          );
        })}
        {logs.length === 0 && (
          <div style={{ ...s.card, textAlign: "center", padding: 60 }}>
            <p style={{ fontSize: 16, color: C.dimLight }}>No activity yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Content Editor ──

const DEFAULT_CONTENT: SiteContent = {
  intro: {
    en: { greeting: "Dear {name},", headline: "Are Getting Married.", saveTheDate: "Save the Date.", date: "June 26, 2026" },
    fr: { greeting: "Cher(e) {name},", headline: "Se marient.", saveTheDate: "Réservez la date.", date: "26 Juin 2026" },
    namesLine1: "Sarah", namesLine2: "Arman",
  },
  location: {
    en: { header: "Location", venue: "Maison Principale", address: "872 Rue du Couvent, Montréal", dateTime: "June 26, 2026 — 5:00 PM", description: "We would be honoured to have you join us at this beautiful venue to celebrate our special day. Please arrive 30 minutes before the ceremony begins.", directions: "Get Directions", addCalendar: "Add to Calendar" },
    fr: { header: "Lieu", venue: "Maison Principale", address: "872 Rue du Couvent, Montréal", dateTime: "26 Juin 2026 — 17h00", description: "Nous serions honorés de vous accueillir dans ce magnifique lieu pour célébrer notre jour spécial. Veuillez arriver 30 minutes avant le début de la cérémonie.", directions: "Itinéraire", addCalendar: "Ajouter au calendrier" },
  },
  dresscode: {
    en: { header: "Dress Code", line1: "We kindly ask you to dress formally\nto join us on this very special day.", line2: "Please avoid wearing white, as it is\nreserved for the bride.", line3: "Black is also a color to avoid." },
    fr: { header: "Code vestimentaire", line1: "Nous vous prions de vous habiller de\nmanière formelle pour cette journée spéciale.", line2: "Merci de ne pas porter de blanc,\ncette couleur est réservée à la mariée.", line3: "Le noir est également une couleur à éviter." },
  },
  countdown: {
    en: { header: "Countdown", subtitle: "To the most special day of our lives", days: "Days", hours: "Hours", minutes: "Minutes", seconds: "Seconds" },
    fr: { header: "Compte à rebours", subtitle: "Vers le jour le plus spécial de notre vie", days: "Jours", hours: "Heures", minutes: "Minutes", seconds: "Secondes" },
  },
  orderOfDay: {
    en: { header: "Order of the Day", items: [
      { time: "17:00", title: "Arrival & Welcome Drinks", desc: "Reception and welcome cocktails at the venue" },
      { time: "18:00", title: "Ceremony", desc: "The most special moment of the day" },
      { time: "19:00", title: "Cocktail Hour & Dinner", desc: "Party" },
      { time: "Until 1 AM", title: "Let's dance the night away!", desc: "" },
    ]},
    fr: { header: "Déroulement de la journée", items: [
      { time: "17:00", title: "Arrivée & Cocktail de bienvenue", desc: "Réception et cocktails de bienvenue sur place" },
      { time: "18:00", title: "Cérémonie", desc: "Le moment le plus spécial de la journée" },
      { time: "19:00", title: "Cocktail & Dîner", desc: "La fête" },
      { time: "Jusqu'à 1h", title: "Dansons toute la nuit !", desc: "" },
    ]},
  },
  menu: {
    en: { menuTitle: "Menu", starter: "Starter", mainCourse: "Main Course", or: "or", dessertHeader: "Dessert", dessertLine: "Wedding cake or Tiramisu", dishes: {
      fattoush: { name: "Fattoush", desc: "Romaine lettuce, Roma tomatoes, cherry tomatoes,\ncucumber, mint, parsley, radishes, red peppers\nHomemade pita chips, Lime oil & sumac dressing" },
      chicken: { name: "Herb Crusted Chicken", desc: "Lemon & herb crusted chicken supreme, lemon crème fraîche.\nFresh herb mash with confit garlic, grilled lemon zest asparagus" },
      salmon: { name: "Grilled Salmon", desc: "Grilled salmon, soy-maple glaze\nBaked broccoli with toasted sesame seeds, roasted yellow\nbeets & red onions" },
      filet: { name: "Filet Mignon", desc: "AAA Beef Filet Mignon, cherry wine reduction\nGrilled asparagus, Dauphinoise potatoes" },
      risotto: { name: "Mushroom Risotto (V)", desc: "" },
    }},
    fr: { menuTitle: "Menu", starter: "Entrée", mainCourse: "Plat principal", or: "ou", dessertHeader: "Dessert", dessertLine: "Gâteau de mariage ou Tiramisu", dishes: {
      fattoush: { name: "Fattoush", desc: "Laitue romaine, tomates Roma, tomates cerises,\nconcombre, menthe, persil, radis, poivrons rouges\nChips de pita maison, huile de lime & vinaigrette au sumac" },
      chicken: { name: "Poulet en croûte d'herbes", desc: "Suprême de poulet en croûte de citron et herbes, crème fraîche au citron.\nPurée aux herbes fraîches et ail confit, asperges grillées au zeste de citron" },
      salmon: { name: "Saumon grillé", desc: "Saumon grillé, glaçage soja-érable\nBrocoli rôti aux graines de sésame, betteraves jaunes\net oignons rouges rôtis" },
      filet: { name: "Filet Mignon", desc: "Filet Mignon de bœuf AAA, réduction au vin de cerise\nAsperges grillées, pommes Dauphinoise" },
      risotto: { name: "Risotto aux champignons (V)", desc: "" },
    }},
  },
  rsvp: {
    en: { header: "RSVP", subtitle: "We hope you can make it", willAttend: "Will you attend?", yes: "Yes, I'll be there!", no: "Sorry, I can't make it" },
    fr: { header: "RSVP", subtitle: "Nous espérons que vous pourrez être présent(e)", willAttend: "Serez-vous présent(e) ?", yes: "Oui, je serai là !", no: "Désolé(e), je ne pourrai pas venir" },
  },
};

type SectionKey = keyof SiteContent;

const SECTION_LABELS: Record<SectionKey, string> = {
  intro: "Intro", location: "Location", dresscode: "Dress Code",
  countdown: "Countdown", orderOfDay: "Order of the Day", menu: "Menu", rsvp: "RSVP",
};

function ContentTab({ headers }: { headers: Record<string, string> }) {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionKey>("intro");

  useEffect(() => {
    fetch("/api/admin/content", { headers })
      .then((r) => r.json())
      .then((data) => {
        if (data && Object.keys(data).length > 0) setContent(data);
        setLoaded(true);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await fetch("/api/admin/content", { method: "POST", headers, body: JSON.stringify(content) });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const updateField = (path: string, value: string) => {
    setContent((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      const keys = path.split(".");
      let obj = copy;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return copy;
    });
  };

  const renderField = (label: string, path: string, multiline = false) => {
    const keys = path.split(".");
    let val: any = content;
    for (const k of keys) val = val?.[k];

    return (
      <div style={{ marginBottom: 20 }}>
        <label style={{ ...s.lbl, fontSize: 10 }}>{label}</label>
        {multiline ? (
          <textarea value={val || ""} onChange={(e) => updateField(path, e.target.value)}
            style={{ ...s.inp, minHeight: 80, resize: "vertical" as const }} />
        ) : (
          <input value={val || ""} onChange={(e) => updateField(path, e.target.value)} style={s.inp} />
        )}
      </div>
    );
  };

  const renderSection = () => {
    switch (activeSection) {
      case "intro":
        return (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 16, color: C.accent }}>English</p>
                {renderField("Greeting (use {name} for guest name)", "intro.en.greeting")}
                {renderField("Headline", "intro.en.headline")}
                {renderField("Save the Date text", "intro.en.saveTheDate")}
                {renderField("Date", "intro.en.date")}
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 16, color: C.accent }}>Français</p>
                {renderField("Salutation", "intro.fr.greeting")}
                {renderField("Titre", "intro.fr.headline")}
                {renderField("Réservez la date", "intro.fr.saveTheDate")}
                {renderField("Date", "intro.fr.date")}
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              {renderField("Name Line 1 (e.g. Sarah)", "intro.namesLine1")}
              {renderField("Name Line 2 (e.g. Arman)", "intro.namesLine2")}
            </div>
          </div>
        );
      case "location":
        return (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 16, color: C.accent }}>English</p>
              {renderField("Header", "location.en.header")}
              {renderField("Venue name", "location.en.venue")}
              {renderField("Address", "location.en.address")}
              {renderField("Date & Time", "location.en.dateTime")}
              {renderField("Description", "location.en.description", true)}
              {renderField("Directions button", "location.en.directions")}
              {renderField("Calendar button", "location.en.addCalendar")}
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 16, color: C.accent }}>Français</p>
              {renderField("Titre", "location.fr.header")}
              {renderField("Nom du lieu", "location.fr.venue")}
              {renderField("Adresse", "location.fr.address")}
              {renderField("Date & Heure", "location.fr.dateTime")}
              {renderField("Description", "location.fr.description", true)}
              {renderField("Bouton itinéraire", "location.fr.directions")}
              {renderField("Bouton calendrier", "location.fr.addCalendar")}
            </div>
          </div>
        );
      case "dresscode":
        return (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 16, color: C.accent }}>English</p>
              {renderField("Header", "dresscode.en.header")}
              {renderField("Line 1", "dresscode.en.line1", true)}
              {renderField("Line 2", "dresscode.en.line2", true)}
              {renderField("Line 3 (underlined)", "dresscode.en.line3")}
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 16, color: C.accent }}>Français</p>
              {renderField("Titre", "dresscode.fr.header")}
              {renderField("Ligne 1", "dresscode.fr.line1", true)}
              {renderField("Ligne 2", "dresscode.fr.line2", true)}
              {renderField("Ligne 3 (soulignée)", "dresscode.fr.line3")}
            </div>
          </div>
        );
      case "countdown":
        return (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 16, color: C.accent }}>English</p>
              {renderField("Header", "countdown.en.header")}
              {renderField("Subtitle", "countdown.en.subtitle")}
              {renderField("Days label", "countdown.en.days")}
              {renderField("Hours label", "countdown.en.hours")}
              {renderField("Minutes label", "countdown.en.minutes")}
              {renderField("Seconds label", "countdown.en.seconds")}
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 16, color: C.accent }}>Français</p>
              {renderField("Titre", "countdown.fr.header")}
              {renderField("Sous-titre", "countdown.fr.subtitle")}
              {renderField("Jours", "countdown.fr.days")}
              {renderField("Heures", "countdown.fr.hours")}
              {renderField("Minutes", "countdown.fr.minutes")}
              {renderField("Secondes", "countdown.fr.seconds")}
            </div>
          </div>
        );
      case "orderOfDay":
        return (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 16, color: C.accent }}>English</p>
              {renderField("Header", "orderOfDay.en.header")}
              {content.orderOfDay.en.items.map((_, i) => (
                <div key={i} style={{ padding: 16, borderRadius: 12, background: C.bg, marginBottom: 12 }}>
                  <p style={{ fontSize: 11, fontWeight: 500, color: C.dim, marginBottom: 8 }}>Item {i + 1}</p>
                  {renderField("Time", `orderOfDay.en.items.${i}.time`)}
                  {renderField("Title", `orderOfDay.en.items.${i}.title`)}
                  {renderField("Description", `orderOfDay.en.items.${i}.desc`)}
                </div>
              ))}
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 16, color: C.accent }}>Français</p>
              {renderField("Titre", "orderOfDay.fr.header")}
              {content.orderOfDay.fr.items.map((_, i) => (
                <div key={i} style={{ padding: 16, borderRadius: 12, background: C.bg, marginBottom: 12 }}>
                  <p style={{ fontSize: 11, fontWeight: 500, color: C.dim, marginBottom: 8 }}>Élément {i + 1}</p>
                  {renderField("Heure", `orderOfDay.fr.items.${i}.time`)}
                  {renderField("Titre", `orderOfDay.fr.items.${i}.title`)}
                  {renderField("Description", `orderOfDay.fr.items.${i}.desc`)}
                </div>
              ))}
            </div>
          </div>
        );
      case "menu":
        return (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 16, color: C.accent }}>English</p>
              {renderField("Menu title", "menu.en.menuTitle")}
              {renderField("Starter", "menu.en.starter")}
              {renderField("Main Course", "menu.en.mainCourse")}
              {renderField("'or' text", "menu.en.or")}
              {renderField("Dessert header", "menu.en.dessertHeader")}
              {renderField("Dessert line", "menu.en.dessertLine")}
              {Object.keys(content.menu.en.dishes).map((key) => (
                <div key={key} style={{ padding: 16, borderRadius: 12, background: C.bg, marginBottom: 12 }}>
                  <p style={{ fontSize: 11, fontWeight: 500, color: C.dim, marginBottom: 8 }}>{key}</p>
                  {renderField("Name", `menu.en.dishes.${key}.name`)}
                  {renderField("Description", `menu.en.dishes.${key}.desc`, true)}
                </div>
              ))}
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 16, color: C.accent }}>Français</p>
              {renderField("Titre menu", "menu.fr.menuTitle")}
              {renderField("Entrée", "menu.fr.starter")}
              {renderField("Plat principal", "menu.fr.mainCourse")}
              {renderField("'ou' text", "menu.fr.or")}
              {renderField("Titre dessert", "menu.fr.dessertHeader")}
              {renderField("Ligne dessert", "menu.fr.dessertLine")}
              {Object.keys(content.menu.fr.dishes).map((key) => (
                <div key={key} style={{ padding: 16, borderRadius: 12, background: C.bg, marginBottom: 12 }}>
                  <p style={{ fontSize: 11, fontWeight: 500, color: C.dim, marginBottom: 8 }}>{key}</p>
                  {renderField("Nom", `menu.fr.dishes.${key}.name`)}
                  {renderField("Description", `menu.fr.dishes.${key}.desc`, true)}
                </div>
              ))}
            </div>
          </div>
        );
      case "rsvp":
        return (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 16, color: C.accent }}>English</p>
              {renderField("Header", "rsvp.en.header")}
              {renderField("Subtitle", "rsvp.en.subtitle")}
              {renderField("Will you attend?", "rsvp.en.willAttend")}
              {renderField("Yes button", "rsvp.en.yes")}
              {renderField("No button", "rsvp.en.no")}
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 16, color: C.accent }}>Français</p>
              {renderField("Titre", "rsvp.fr.header")}
              {renderField("Sous-titre", "rsvp.fr.subtitle")}
              {renderField("Serez-vous présent?", "rsvp.fr.willAttend")}
              {renderField("Bouton oui", "rsvp.fr.yes")}
              {renderField("Bouton non", "rsvp.fr.no")}
            </div>
          </div>
        );
    }
  };

  if (!loaded) return <p style={{ color: C.dim }}>Loading...</p>;

  return (
    <div>
      {/* Section tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 32, flexWrap: "wrap" }}>
        {(Object.keys(SECTION_LABELS) as SectionKey[]).map((key) => (
          <button key={key} onClick={() => setActiveSection(key)}
            style={{
              ...s.btn(activeSection === key ? "primary" : "outline"),
              fontSize: 12, padding: "8px 18px",
            }}>
            {SECTION_LABELS[key]}
          </button>
        ))}
      </div>

      {/* Editor */}
      <div style={s.card}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <p style={{ fontSize: 18, fontWeight: 500 }}>{SECTION_LABELS[activeSection]}</p>
          <button onClick={handleSave} style={{ ...s.btn(), fontSize: 13, padding: "10px 28px" }}>
            {saving ? "Saving..." : saved ? "Saved!" : "Save All Changes"}
          </button>
        </div>
        {renderSection()}
      </div>
    </div>
  );
}
