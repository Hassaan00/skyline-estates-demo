import { brand, properties, fmtAED } from "./data";
export type Lang = "en" | "ar" | "ru" | "fr";
export function detectLang(t: string): Lang {
  if (/[\u0600-\u06FF]/.test(t)) return "ar"; if (/[\u0400-\u04FF]/.test(t)) return "ru";
  if (/\b(bonjour|prix|appartement|villa à|acheter|louer|merci|je|voudrais|visite)\b/i.test(t)) return "fr";
  return "en";
}
export const busy: Record<Lang, string> = {
  en: "Sorry, I'm helping a lot of clients right now. Could you send that again in a few seconds?",
  ar: "عذراً، أساعد عدداً كبيراً من العملاء الآن. هل يمكنك إعادة الإرسال بعد ثوانٍ؟",
  ru: "Извините, сейчас много обращений. Отправьте, пожалуйста, ещё раз через несколько секунд.",
  fr: "Désolée, je suis très sollicitée. Pouvez-vous renvoyer cela dans quelques secondes ?",
};
export function fallback(msg: string): string {
  const l = detectLang(msg); const s = msg.toLowerCase();
  if (l === "ar") return "أهلاً، أنا ليلى من سكاي لاين إستيتس. أستطيع اقتراح عقارات تناسب ميزانيتك وحجز معاينة. ما المنطقة والميزانية المفضلة؟";
  if (l === "ru") return "Здравствуйте, я Лейла из Skyline Estates. Подскажите район и бюджет, и я подберу объекты и запишу на просмотр.";
  if (l === "fr") return "Bonjour, je suis Layla de Skyline Estates. Quel quartier et quel budget ? Je vous propose des biens et réserve une visite.";
  const rent = /rent|lease/.test(s);
  const area = properties.find((p) => s.includes(p.area.toLowerCase().split(",")[0]) || s.includes(p.community.toLowerCase()));
  if (area) return `In ${area.area} we have ${area.title} at ${fmtAED(area.price)}${area.purpose === "rent" ? " per year" : ""}. Would you like to book a viewing? Tap the listing or tell me a day.`;
  if (/view|visit|book|tour|appoint/.test(s)) return "Happy to arrange a private viewing. Which property, and which day suits you? Viewings run daily 10am to 7pm.";
  if (/mortgage|finance|loan/.test(s)) return "UAE banks lend up to 80% for expats on homes under AED 5M (70% above), over up to 25 years. Try the mortgage calculator on this page, or tell me your budget.";
  if (/golden|visa/.test(s)) return "Property worth AED 2M or more can qualify you for a 10-year UAE Golden Visa. Several of our listings are eligible.";
  if (/price|cost|how much|cheap|budget/.test(s) || rent) {
    const list = properties.filter((p) => (rent ? p.purpose === "rent" : true)).slice(0, 4);
    return "A few highlights:\n" + list.map((p) => `• ${p.title}: ${fmtAED(p.price)}${p.purpose === "rent" ? "/yr" : ""}`).join("\n");
  }
  if (/where|office|address|contact|phone/.test(s)) return `Our office is at ${brand.address}. Call ${brand.phone}, or WhatsApp us anytime.`;
  return "I'm Layla, Skyline's AI property advisor. Tell me what you're looking for (buy or rent, area, budget) and I'll match listings and book a viewing.";
}
