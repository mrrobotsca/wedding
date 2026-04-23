"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Types ──

interface FamilyMember {
  id: string;
  name: string;
  mealChoice?: string;
}

type InviteType = "individual" | "family";

export interface GuestData {
  id: string;
  greetingName: string;
  inviteType: InviteType;
  allowCompanion: boolean;
  familyMembers: FamilyMember[];
}

// ── Mock Data (used only in preview mode) ──

const MOCK_GUEST: GuestData = {
  id: "mock-uuid-1234",
  greetingName: "The Dupont Family",
  inviteType: "family",
  allowCompanion: true,
  familyMembers: [
    { id: "m1", name: "Jean" },
    { id: "m2", name: "Marie" },
    { id: "m3", name: "Lucas" },
  ],
};

// ── Translations ──

const TEXT = {
  en: {
    header: "RSVP",
    subtitle: "We hope you can make it",
    willAttend: "Will you attend?",
    yes: "Yes, I'll be there!",
    no: "Sorry, I can't make it",
    sorryTitle: "We'll miss you!",
    sorryText: "We understand and wish we could celebrate with you. You'll be in our thoughts on this special day.",
    mealTitle: "Your meal choice",
    mealTitleFamily: "Family Members",
    beef: "Beef",
    chicken: "Chicken",
    fish: "Fish",
    vegetarian: "Vegetarian",
    allergies: "Allergies / Food inquiries",
    allergiesPlaceholder: "Any dietary restrictions or allergies...",
    companionTitle: "Companion",
    companionName: "Companion name",
    companionNamePlaceholder: "Full name",
    companionMeal: "Companion food choice",
    familyTitle: "Family Members",
    familyMeal: "'s meal choice",
    phone: "Contact phone number",
    phonePlaceholder: "+1 (555) 000-0000",
    song: "Song you'd love to hear",
    songPlaceholder: "Artist — Song name",
    message: "Message to the couple (optional)",
    messagePlaceholder: "Write your wishes here...",
    submit: "Send RSVP",
    submitDecline: "Send Response",
    submitted: "Thank you!",
    submittedText: "Your RSVP has been received. We can't wait to celebrate with you!",
    submittedDeclineText: "Your response has been recorded. Thank you for letting us know.",
    contactHost: "In order to make any changes, please contact your hosts.",
  },
  fr: {
    header: "RSVP",
    subtitle: "Nous espérons que vous pourrez être présent(e)",
    willAttend: "Serez-vous présent(e) ?",
    yes: "Oui, je serai là !",
    no: "Désolé(e), je ne pourrai pas venir",
    sorryTitle: "Vous nous manquerez !",
    sorryText: "Nous comprenons et aurions aimé célébrer avec vous. Vous serez dans nos pensées en ce jour spécial.",
    mealTitle: "Votre choix de repas",
    mealTitleFamily: "Membres de la famille",
    beef: "Bœuf",
    chicken: "Poulet",
    fish: "Poisson",
    vegetarian: "Végétarien",
    allergies: "Allergies / Questions alimentaires",
    allergiesPlaceholder: "Restrictions alimentaires ou allergies...",
    companionTitle: "Accompagnant(e)",
    companionName: "Nom de l'accompagnant(e)",
    companionNamePlaceholder: "Nom complet",
    companionMeal: "Choix de repas de l'accompagnant(e)",
    familyTitle: "Membres de la famille",
    familyMeal: " — choix de repas",
    phone: "Numéro de téléphone",
    phonePlaceholder: "+1 (555) 000-0000",
    song: "Chanson que vous aimeriez entendre",
    songPlaceholder: "Artiste — Nom de la chanson",
    message: "Message aux mariés (optionnel)",
    messagePlaceholder: "Écrivez vos vœux ici...",
    submit: "Envoyer le RSVP",
    submitDecline: "Envoyer la réponse",
    submitted: "Merci !",
    submittedText: "Votre RSVP a été reçu. Nous avons hâte de célébrer avec vous !",
    submittedDeclineText: "Votre réponse a été enregistrée. Merci de nous avoir informés.",
    contactHost: "Pour toute modification, veuillez contacter vos hôtes.",
  },
};

const MEALS = ["beef", "chicken", "fish", "vegetarian"] as const;

// ── Styles ──

const FONT = "'Montserrat', sans-serif";
const FONT_SCRIPT = "'Great Vibes', cursive";
const COLOR = "#000000";
const COLOR_LIGHT = "#000000";

const labelStyle: React.CSSProperties = {
  fontFamily: FONT,
  fontSize: 16,
  fontWeight: 400,
  color: COLOR,
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  marginBottom: 8,
};

const inputStyle: React.CSSProperties = {
  fontFamily: FONT,
  fontSize: 18,
  fontWeight: 300,
  color: "#6b6b6b",
  background: "transparent",
  border: "none",
  borderBottom: "1px solid rgba(159,159,157,0.3)",
  outline: "none",
  padding: "8px 0",
  width: "100%",
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  borderBottom: "none",
  border: "1px solid rgba(159,159,157,0.2)",
  borderRadius: 8,
  padding: "12px 14px",
  resize: "none" as const,
  minHeight: 80,
};

interface RSVPSectionProps {
  lang: "en" | "fr";
  guest?: GuestData;
  content?: { en: { header: string; subtitle: string; willAttend: string; yes: string; no: string }; fr: { header: string; subtitle: string; willAttend: string; yes: string; no: string } };
}

function RadioGroup({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className="flex items-center gap-3 py-2 px-1 transition-all duration-200"
          type="button"
        >
          <div
            className="w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all"
            style={{
              borderColor: value === opt.value ? COLOR : "rgba(159,159,157,0.3)",
            }}
          >
            {value === opt.value && (
              <div className="w-2 h-2 rounded-full" style={{ background: COLOR }} />
            )}
          </div>
          <span
            style={{
              fontFamily: FONT,
              fontSize: 18,
              fontWeight: value === opt.value ? 400 : 300,
              color: value === opt.value ? COLOR : COLOR_LIGHT,
            }}
          >
            {opt.label}
          </span>
        </button>
      ))}
    </div>
  );
}

function MealRadioRow({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "flex-start" }}>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className="transition-all duration-200 hover:scale-105"
          type="button"
          style={{
            fontFamily: FONT,
            fontSize: 16,
            fontWeight: 400,
            letterSpacing: "0.1em",
            color: "#ffffff",
            background: value === opt.value ? "#a08860" : "#b3985f",
            border: "none",
            borderRadius: 999,
            padding: "10px 18px",
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default function RSVPSection({ lang, guest: guestProp, content }: RSVPSectionProps) {
  const t = TEXT[lang];
  const header = content?.[lang]?.header || t.header;
  const subtitle = content?.[lang]?.subtitle || t.subtitle;
  const willAttend = content?.[lang]?.willAttend || t.willAttend;
  const yesText = content?.[lang]?.yes || t.yes;
  const noText = content?.[lang]?.no || t.no;
  const guest = guestProp || MOCK_GUEST;

  const [attending, setAttending] = useState<"" | "yes" | "no">("");
  const [mealChoice, setMealChoice] = useState("");
  const [allergies, setAllergies] = useState("");
  const [companionName, setCompanionName] = useState("");
  const [companionMeal, setCompanionMeal] = useState("");
  const [familyMeals, setFamilyMeals] = useState<Record<string, string>>({});
  const [phone, setPhone] = useState("");
  const [song, setSong] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [existingAttending, setExistingAttending] = useState(true);

  const mealOptions = MEALS.map((m) => ({ value: m, label: t[m] }));

  // Check if already RSVP'd
  useEffect(() => {
    if (!guest?.id || guest.id === "mock-uuid-1234") return;
    fetch(`/api/rsvp?guestId=${guest.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.submitted) {
          setAlreadySubmitted(true);
          setSubmitted(true);
          setExistingAttending(data.attending);
          setAttending(data.attending ? "yes" : "no");
        }
      })
      .catch(() => {});
  }, [guest?.id]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestId: guest.id,
          attending: attending === "yes",
          mealChoice,
          allergies,
          companionName,
          companionMeal,
          familyMeals,
          phone,
          song,
          message,
        }),
      });
      setSubmitted(true);
    } catch {
      // fallback for preview mode
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", overflow: "hidden", padding: "1vh clamp(28px, 8vw, 48px) calc(2vh - 8px)", background: "transparent", minHeight: "100vh", boxSizing: "border-box" }}
    >
      <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 96, height: 1, background: "linear-gradient(90deg, transparent, #9f9f9d, transparent)", opacity: 0.3 }} />

      {/* BOX 1: Logo */}
      <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", position: "relative", zIndex: 10 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <img
            src="/newlogo.png"
            alt="Wedding Logo"
            style={{
              width: "auto",
              height: "clamp(115px, 19vh, 195px)",
              objectFit: "contain",
              marginTop: -8, marginBottom: 25,
            }}
          />
        </motion.div>
      </div>

      {/* BOX 2: Content */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", width: "100%", maxWidth: 340, padding: "10px 0", position: "relative", zIndex: 10 }}>

        {/* Header */}
        <motion.p
          style={{ fontFamily: FONT, fontSize: 32, fontWeight: 400, color: "#000000", letterSpacing: "0.5em", textTransform: "uppercase", textDecoration: "underline", textDecorationColor: "#b3985f", textUnderlineOffset: 6, paddingBottom: 58 }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {header}
        </motion.p>

        {/* Subtitle */}
        <motion.p
          style={{ fontFamily: FONT_SCRIPT, fontSize: 29, color: "#b3985f", letterSpacing: "0.05em", paddingBottom: 40 }}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          {subtitle}
        </motion.p>

        {/* Greeting */}
        <motion.p
          style={{ fontFamily: FONT, fontSize: 17, fontWeight: 300, color: COLOR_LIGHT, paddingBottom: 30 }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Dear {guest.greetingName},
        </motion.p>

        <AnimatePresence mode="wait">
          {submitted ? (
            /* ── Submitted ── */
            <motion.div
              key="submitted"
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p style={{ fontFamily: FONT_SCRIPT, fontSize: 37, color: COLOR }}>{t.submitted}</p>
              <p style={{ fontFamily: FONT, fontSize: 17, fontWeight: 300, color: COLOR_LIGHT, lineHeight: 1.7, maxWidth: 280, textAlign: "center" }}>
                {existingAttending ? t.submittedText : t.submittedDeclineText}
              </p>
              <div style={{ width: 60, height: 1, background: `linear-gradient(90deg, transparent, ${COLOR}, transparent)`, margin: "8px 0" }} />
              <p style={{ fontFamily: FONT, fontSize: 16, fontWeight: 300, color: COLOR_LIGHT, lineHeight: 1.7, maxWidth: 260, textAlign: "center", fontStyle: "italic" }}>
                {t.contactHost}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              className="flex flex-col items-center w-full gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* ── Will you attend? ── */}
              <motion.div
                className="w-full"
                animate={attending ? { y: -10 } : { y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <p style={{ ...labelStyle, marginBottom: 44 }}>{willAttend}</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "0 5vw", width: "100%", boxSizing: "border-box" }}>
                  {[
                    { value: "yes", label: yesText },
                    { value: "no", label: noText },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setAttending(opt.value as "yes" | "no")}
                      className="transition-all duration-300 hover:scale-105"
                      type="button"
                      style={{
                        fontFamily: FONT,
                        fontSize: "clamp(9px, 2.5vw, 14px)",
                        fontWeight: 400,
                        letterSpacing: "0.05em",
                        color: "#ffffff",
                        background: "#b3985f",
                        border: "none",
                        borderRadius: 999,
                        padding: "12px 12px",
                        whiteSpace: "nowrap",
                        textAlign: "center",
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </motion.div>

              <AnimatePresence mode="wait">
                {attending === "no" && (
                  /* ── Decline ── */
                  <motion.div
                    key="decline"
                    className="flex flex-col items-center gap-5 w-full"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="w-16 h-[1px]" style={{ background: "linear-gradient(90deg, transparent, #9f9f9d, transparent)" }} />
                    <p style={{ fontFamily: FONT_SCRIPT, fontSize: 29, color: COLOR }}>{t.sorryTitle}</p>
                    <p style={{ fontFamily: FONT, fontSize: 16, fontWeight: 300, color: COLOR_LIGHT, lineHeight: 1.7, maxWidth: 280 }}>
                      {t.sorryText}
                    </p>

                    {/* Message */}
                    <div className="w-full text-left">
                      <p style={labelStyle}>{t.message}</p>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={t.messagePlaceholder}
                        style={textareaStyle}
                      />
                    </div>

                    <div style={{ marginBottom: "30vh" }}>
                      <button
                        onClick={handleSubmit}
                        className="transition-all duration-300 hover:scale-105 hover:opacity-90"
                        style={{
                          fontFamily: FONT,
                          fontSize: 17,
                          fontWeight: 400,
                          letterSpacing: "0.1em",
                          color: "#ffffff",
                          background: "#b3985f",
                          border: "none",
                          borderRadius: 999,
                          padding: "14px 40px",
                          marginTop: 10,
                        }}
                      >
                        {t.submitDecline}
                      </button>
                    </div>
                  </motion.div>
                )}

                {attending === "yes" && (
                  /* ── Accept ── */
                  <motion.div
                    key="accept"
                    className="flex flex-col items-center gap-7 w-full"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="w-16 h-[1px]" style={{ background: "linear-gradient(90deg, transparent, #9f9f9d, transparent)" }} />

                    {/* Individual: Your meal choice */}
                    {guest.inviteType === "individual" && (
                      <div className="w-full">
                        <p style={labelStyle}>{t.mealTitle}</p>
                        <MealRadioRow options={mealOptions} value={mealChoice} onChange={setMealChoice} />
                      </div>
                    )}

                    {/* Family: Each member's meal choice */}
                    {guest.inviteType === "family" && guest.familyMembers.length > 0 && (
                      <div className="w-full">
                        <p style={labelStyle}>{t.mealTitleFamily}</p>
                        <div className="flex flex-col gap-5 mt-3">
                          {guest.familyMembers.map((member) => (
                            <div key={member.id} className="w-full">
                              <p style={{ fontFamily: FONT, fontSize: 17, fontWeight: 400, color: COLOR, marginBottom: 6 }}>
                                {member.name}{t.familyMeal}
                              </p>
                              <MealRadioRow
                                options={mealOptions}
                                value={familyMeals[member.id] || ""}
                                onChange={(v) => setFamilyMeals((prev) => ({ ...prev, [member.id]: v }))}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Allergies (after all food selections) */}
                    <div className="w-full text-left">
                      <p style={labelStyle}>{t.allergies}</p>
                      <input
                        type="text"
                        value={allergies}
                        onChange={(e) => setAllergies(e.target.value)}
                        placeholder={t.allergiesPlaceholder}
                        style={inputStyle}
                      />
                    </div>

                    {/* Companion */}
                    {guest.allowCompanion && (
                      <div className="w-full">
                        <p style={labelStyle}>{t.companionTitle}</p>
                        <div className="flex flex-col gap-4 mt-2">
                          <div className="text-left">
                            <p style={{ fontFamily: FONT, fontSize: 15, color: COLOR_LIGHT, marginBottom: 4 }}>{t.companionName}</p>
                            <input
                              type="text"
                              value={companionName}
                              onChange={(e) => setCompanionName(e.target.value)}
                              placeholder={t.companionNamePlaceholder}
                              style={inputStyle}
                            />
                          </div>
                          {companionName && (
                            <div>
                              <p style={{ fontFamily: FONT, fontSize: 15, color: COLOR_LIGHT, marginBottom: 4 }}>{t.companionMeal}</p>
                              <MealRadioRow options={mealOptions} value={companionMeal} onChange={setCompanionMeal} />
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Phone */}
                    <div className="w-full text-left">
                      <p style={labelStyle}>{t.phone}</p>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder={t.phonePlaceholder}
                        style={inputStyle}
                      />
                    </div>

                    {/* Song */}
                    <div className="w-full text-left">
                      <p style={labelStyle}>{t.song}</p>
                      <input
                        type="text"
                        value={song}
                        onChange={(e) => setSong(e.target.value)}
                        placeholder={t.songPlaceholder}
                        style={inputStyle}
                      />
                    </div>

                    {/* Message */}
                    <div className="w-full text-left">
                      <p style={labelStyle}>{t.message}</p>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={t.messagePlaceholder}
                        style={textareaStyle}
                      />
                    </div>

                    {/* Submit */}
                    <div style={{ marginBottom: "30vh" }}>
                      <button
                        onClick={handleSubmit}
                        className="transition-all duration-300 hover:scale-105 hover:opacity-90"
                        style={{
                          fontFamily: FONT,
                          fontSize: 17,
                          fontWeight: 400,
                          letterSpacing: "0.1em",
                          color: "#ffffff",
                          background: "#b3985f",
                          border: "none",
                          borderRadius: 999,
                          padding: "14px 40px",
                          marginTop: 10,
                        }}
                      >
                        {t.submit}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* BOX 3: Divider */}
      <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", position: "relative", zIndex: 10, marginTop: 30 }}>
        <img src="/divider-nobg.png" alt="" style={{ width: "60vw", maxWidth: 300, height: "auto", objectFit: "contain", pointerEvents: "none", marginTop: -60, filter: "sepia(60%) saturate(60%) hue-rotate(-5deg) brightness(85%)" }} />
      </div>
    </section>
  );
}
