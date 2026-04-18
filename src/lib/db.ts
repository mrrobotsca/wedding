import { supabaseAdmin } from "./supabase";

// ── Types ──

export type InviteType = "individual" | "family";

export interface FamilyMember {
  id: string;
  name: string;
}

export interface Guest {
  id: string;
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

export interface AdminConfig {
  token: string;
  password: string;
}

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

// ── Admin Config ──

export async function getAdminConfig(): Promise<AdminConfig> {
  const { data } = await supabaseAdmin.from("admin_config").select("*").eq("id", "main").single();
  return data || { token: "a1b2c3d4-admin-5678-9012-abcdef123456", password: "wedding2026" };
}

export async function validateAdminToken(token: string): Promise<boolean> {
  const config = await getAdminConfig();
  return config.token === token;
}

export async function validateAdminPassword(password: string): Promise<boolean> {
  const config = await getAdminConfig();
  return config.password === password;
}

// ── Guests ──

function mapGuest(row: any): Guest {
  return {
    id: row.id,
    greetingName: row.greeting_name,
    inviteType: row.invite_type,
    allowCompanion: row.allow_companion,
    familyMembers: row.family_members || [],
    createdAt: row.created_at,
  };
}

export async function getGuests(): Promise<Guest[]> {
  const { data } = await supabaseAdmin.from("guests").select("*").order("created_at", { ascending: true });
  return (data || []).map(mapGuest);
}

export async function getGuest(id: string): Promise<Guest | undefined> {
  const { data } = await supabaseAdmin.from("guests").select("*").eq("id", id).single();
  return data ? mapGuest(data) : undefined;
}

export async function saveGuest(guest: { id?: string; greetingName: string; inviteType: string; allowCompanion: boolean; familyMembers: FamilyMember[] }): Promise<Guest> {
  const row = {
    greeting_name: guest.greetingName,
    invite_type: guest.inviteType,
    allow_companion: guest.allowCompanion,
    family_members: guest.familyMembers,
  };

  if (guest.id) {
    const { data } = await supabaseAdmin.from("guests").update(row).eq("id", guest.id).select().single();
    return mapGuest(data);
  } else {
    const { data } = await supabaseAdmin.from("guests").insert(row).select().single();
    return mapGuest(data);
  }
}

export async function deleteGuest(id: string): Promise<void> {
  await supabaseAdmin.from("guests").delete().eq("id", id);
}

// ── RSVPs ──

function mapRsvp(row: any): RSVP {
  return {
    guestId: row.guest_id,
    attending: row.attending,
    mealChoice: row.meal_choice,
    allergies: row.allergies,
    companionName: row.companion_name,
    companionMeal: row.companion_meal,
    familyMeals: row.family_meals || {},
    phone: row.phone,
    song: row.song,
    message: row.message,
    submittedAt: row.submitted_at,
  };
}

export async function getRSVPs(): Promise<RSVP[]> {
  const { data } = await supabaseAdmin.from("rsvps").select("*");
  return (data || []).map(mapRsvp);
}

export async function getRSVP(guestId: string): Promise<RSVP | undefined> {
  const { data } = await supabaseAdmin.from("rsvps").select("*").eq("guest_id", guestId).single();
  return data ? mapRsvp(data) : undefined;
}

export async function saveRSVP(rsvp: RSVP): Promise<RSVP> {
  const row = {
    guest_id: rsvp.guestId,
    attending: rsvp.attending,
    meal_choice: rsvp.mealChoice,
    allergies: rsvp.allergies,
    companion_name: rsvp.companionName,
    companion_meal: rsvp.companionMeal,
    family_meals: rsvp.familyMeals,
    phone: rsvp.phone,
    song: rsvp.song,
    message: rsvp.message,
    submitted_at: rsvp.submittedAt,
  };

  const { data } = await supabaseAdmin.from("rsvps").upsert(row, { onConflict: "guest_id" }).select().single();
  return mapRsvp(data);
}

// ── Activity Logs ──

export async function getActivityLogs(guestId?: string): Promise<ActivityLog[]> {
  let query = supabaseAdmin.from("activity_logs").select("*").order("created_at", { ascending: true });
  if (guestId) query = query.eq("guest_id", guestId);
  const { data } = await query;
  return (data || []).map((row: any) => ({
    guestId: row.guest_id,
    event: row.event,
    userAgent: row.user_agent,
    ip: row.ip,
    fingerprint: row.fingerprint,
    device: row.device,
    screenSize: row.screen_size,
    language: row.language,
    platform: row.platform,
    timestamp: row.created_at,
  }));
}

export async function logActivity(log: ActivityLog): Promise<void> {
  await supabaseAdmin.from("activity_logs").insert({
    guest_id: log.guestId,
    event: log.event,
    user_agent: log.userAgent,
    ip: log.ip,
    fingerprint: log.fingerprint,
    device: log.device,
    screen_size: log.screenSize,
    language: log.language,
    platform: log.platform,
  });
}

// ── Site Content ──

export async function getSiteContent(): Promise<SiteContent | null> {
  const { data } = await supabaseAdmin.from("site_content").select("content").eq("id", "main").single();
  return data?.content || null;
}

export async function saveSiteContent(content: SiteContent): Promise<SiteContent> {
  await supabaseAdmin.from("site_content").upsert({ id: "main", content }, { onConflict: "id" });
  return content;
}
