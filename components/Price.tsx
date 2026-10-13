"use client";
import { useCurrency, CurrencyToggle } from "./useCurrency";
import { priceLabel, type Property } from "@/lib/data";
export default function Price({ p }: { p: Property }) {
  const [c] = useCurrency();
  return <div className="mt-5 flex flex-wrap items-center gap-4"><p className="text-3xl font-semibold tracking-tight text-white">{priceLabel(p, c)}</p><CurrencyToggle />{p.purpose === "buy" && <p className="text-sm text-white/45">≈ {priceLabel({ ...p, price: Math.round(p.price / p.sqft) }, c)} per sqft</p>}</div>;
}
