import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readJSON<T>(file: string, fallback: T): T {
  ensureDir();
  const p = path.join(DATA_DIR, file);
  if (!fs.existsSync(p)) return fallback;
  return JSON.parse(fs.readFileSync(p, "utf-8"));
}

function writeJSON(file: string, data: unknown) {
  ensureDir();
  fs.writeFileSync(path.join(DATA_DIR, file), JSON.stringify(data, null, 2));
}

// ── Admin Config ──

export interface AdminConfig {
  token: string;    // UUID for admin panel URL
  password: string; // admin password
}

const DEFAULT_ADMIN: AdminConfig = {
  token: "a1b2c3d4-admin-5678-9012-abcdef123456",
  password: "wedding2026",
};

export function getAdminConfig(): AdminConfig {
  const config = readJSON<AdminConfig | null>("admin.json", null);
  if (!config) {
    writeJSON("admin.json", DEFAULT_ADMIN);
    return DEFAULT_ADMIN;
  }
  return config;
}

export function validateAdminToken(token: string): boolean {
  return getAdminConfig().token === token;
}

export function validateAdminPassword(password: string): boolean {
  return getAdminConfig().password === password;
}

// ── Types ──

export type InviteType = "individual" | "family";

export interface FamilyMember {
  id: string;
  name: string;
}

export interface Guest {
  id: string;          // UUID — used in invite link
  greetingName: string;
  inviteType: InviteType;
  allowCompanion: boolean;
  familyMembers: FamilyMember[];
  createdAt: string;
}

export interface RSVP {
  guestId: string;
  attending: boolean;
  mealChoice: string;
  allergies: string;
  companionName: string;
  companionMeal: string;
  familyMeals: Record<string, string>;
  phone: string;
  song: string;
  message: string;
  submittedAt: string;
}

export interface ActivityLog {
  guestId: string;
  event: string;
  userAgent?: string;
  ip?: string;
  fingerprint?: string;
  device?: string;
  screenSize?: string;
  language?: string;
  platform?: string;
  timestamp: string;
}

// ── Guests ──

export function getGuests(): Guest[] {
  return readJSON<Guest[]>("guests.json", []);
}

export function getGuest(id: string): Guest | undefined {
  return getGuests().find((g) => g.id === id);
}

export function saveGuest(guest: Guest) {
  const guests = getGuests();
  const idx = guests.findIndex((g) => g.id === guest.id);
  if (idx >= 0) guests[idx] = guest;
  else guests.push(guest);
  writeJSON("guests.json", guests);
  return guest;
}

export function deleteGuest(id: string) {
  writeJSON("guests.json", getGuests().filter((g) => g.id !== id));
}

// ── RSVPs ──

export function getRSVPs(): RSVP[] {
  return readJSON<RSVP[]>("rsvps.json", []);
}

export function getRSVP(guestId: string): RSVP | undefined {
  return getRSVPs().find((r) => r.guestId === guestId);
}

export function saveRSVP(rsvp: RSVP) {
  const rsvps = getRSVPs();
  const idx = rsvps.findIndex((r) => r.guestId === rsvp.guestId);
  if (idx >= 0) rsvps[idx] = rsvp;
  else rsvps.push(rsvp);
  writeJSON("rsvps.json", rsvps);
  return rsvp;
}

// ── Activity Logs ──

export function getActivityLogs(guestId?: string): ActivityLog[] {
  const logs = readJSON<ActivityLog[]>("activity.json", []);
  if (guestId) return logs.filter((l) => l.guestId === guestId);
  return logs;
}

export function logActivity(log: ActivityLog) {
  const logs = getActivityLogs();
  logs.push(log);
  writeJSON("activity.json", logs);
}

// ── Site Content ──

export interface SiteContent {
  intro: {
    en: { greeting: string; headline: string; saveTheDate: string; date: string; };
    fr: { greeting: string; headline: string; saveTheDate: string; date: string; };
    namesLine1: string;
    namesLine2: string;
  };
  location: {
    en: { header: string; venue: string; address: string; dateTime: string; description: string; directions: string; addCalendar: string; };
    fr: { header: string; venue: string; address: string; dateTime: string; description: string; directions: string; addCalendar: string; };
  };
  dresscode: {
    en: { header: string; line1: string; line2: string; line3: string; };
    fr: { header: string; line1: string; line2: string; line3: string; };
  };
  countdown: {
    en: { header: string; subtitle: string; days: string; hours: string; minutes: string; seconds: string; };
    fr: { header: string; subtitle: string; days: string; hours: string; minutes: string; seconds: string; };
  };
  orderOfDay: {
    en: { header: string; items: { time: string; title: string; desc: string; }[]; };
    fr: { header: string; items: { time: string; title: string; desc: string; }[]; };
  };
  menu: {
    en: { menuTitle: string; starter: string; mainCourse: string; or: string; dessertHeader: string; dessertLine: string; dishes: Record<string, { name: string; desc: string; }>; };
    fr: { menuTitle: string; starter: string; mainCourse: string; or: string; dessertHeader: string; dessertLine: string; dishes: Record<string, { name: string; desc: string; }>; };
  };
  rsvp: {
    en: { header: string; subtitle: string; willAttend: string; yes: string; no: string; };
    fr: { header: string; subtitle: string; willAttend: string; yes: string; no: string; };
  };
}

export function getSiteContent(): SiteContent | null {
  return readJSON<SiteContent | null>("content.json", null);
}

export function saveSiteContent(content: SiteContent) {
  writeJSON("content.json", content);
  return content;
}
