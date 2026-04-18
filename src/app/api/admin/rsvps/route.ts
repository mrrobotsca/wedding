import { NextRequest, NextResponse } from "next/server";
import { getRSVPs, getGuests, validateAdminToken } from "@/lib/db";

async function checkAuth(req: NextRequest) {
  const token = req.headers.get("x-admin-token");
  if (!token || !(await validateAdminToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET(req: NextRequest) {
  const err = await checkAuth(req);
  if (err) return err;

  const format = req.nextUrl.searchParams.get("format");
  const rsvps = await getRSVPs();
  const guests = await getGuests();

  // CSV export for catering
  if (format === "csv") {
    const lines = ["Guest Name,Meal Choice,Allergies"];
    for (const rsvp of rsvps) {
      if (!rsvp.attending) continue;
      const guest = guests.find((g) => g.id === rsvp.guestId);
      const name = guest?.greetingName || "Unknown";

      // Main guest or individual
      lines.push(`"${name}","${rsvp.mealChoice}","${rsvp.allergies}"`);

      // Family members
      if (guest?.inviteType === "family" && rsvp.familyMeals) {
        for (const member of guest.familyMembers) {
          const meal = rsvp.familyMeals[member.id] || "";
          lines.push(`"${member.name}","${meal}","${rsvp.allergies}"`);
        }
      }

      // Companion
      if (rsvp.companionName) {
        lines.push(`"${rsvp.companionName}","${rsvp.companionMeal}",""`);
      }
    }

    return new NextResponse(lines.join("\n"), {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=guest-list.csv",
      },
    });
  }

  // JSON with guest info merged
  const enriched = rsvps.map((rsvp) => {
    const guest = guests.find((g) => g.id === rsvp.guestId);
    return { ...rsvp, guestName: guest?.greetingName || "Unknown", inviteType: guest?.inviteType };
  });

  return NextResponse.json(enriched);
}
