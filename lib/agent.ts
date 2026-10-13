export const agentCfg = {
  name: "Layla", role: "AI property advisor · 24/7", fab: "Ask Layla", sessionKey: "sky-session", phone: "+971 4 555 0199",
  greeting: "Marhaba, I'm Layla ✨ Skyline's AI property advisor. Tell me what you're looking for and I'll match homes from our portfolio and book a private viewing, 24/7. Type, or tap the mic to talk.",
  langs: {
    en: { label: "EN", bcp: "en-GB", listen: "Listening…", tryText: "I'm looking for a 2-bed in Downtown under 4 million" },
    ar: { label: "عربي", bcp: "ar-AE", listen: "أستمع إليك…", tryText: "أبحث عن فيلا في دبي هيلز" },
    ru: { label: "RU", bcp: "ru-RU", listen: "Слушаю…", tryText: "Ищу квартиру с видом на море" },
    fr: { label: "FR", bcp: "fr-FR", listen: "Je vous écoute…", tryText: "Je cherche une villa avec plage privée" },
  } as Record<string, { label: string; bcp: string; listen: string; tryText: string }>,
  quick: ["Show me sea-view homes to buy", "2-bed for rent near the beach", "Book a viewing this weekend", "Can I get a Golden Visa?", "أبحث عن فيلا"],
  voices: /Samantha|Serena|Kate|Libby|Sonia|Google UK English Female|Natural|Neural|Premium|Enhanced|Laila|Hoda|Zariyah|Salma/i,
  spell: [/SKY[-‑]/g, "S K Y "] as [RegExp, string],
};
