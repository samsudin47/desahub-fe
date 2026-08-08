import type { LucideIcon } from "lucide-react";
import {
  CupSoda,
  LayoutGrid,
  Shirt,
  ShoppingBasket,
  Sprout,
  UtensilsCrossed,
  Wrench,
} from "lucide-react";
import { slugify } from "@/lib/slugify";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  makanan: UtensilsCrossed,
  minuman: CupSoda,
  kerajinan: ShoppingBasket,
  pertanian: Sprout,
  fashion: Shirt,
  pakaian: Shirt,
  "pakaian-pria": Shirt,
  "pakaian-wanita": Shirt,
  jasa: Wrench,
};

const CATEGORY_ICON_RULES: { match: RegExp; icon: LucideIcon }[] = [
  { match: /makanan|kuliner|snack/, icon: UtensilsCrossed },
  { match: /minuman|drink|kopi|teh/, icon: CupSoda },
  { match: /pakaian|fashion|baju|busana/, icon: Shirt },
  { match: /kerajinan|handmade|anyaman/, icon: ShoppingBasket },
  { match: /pertanian|kebun|tani|sayur/, icon: Sprout },
  { match: /jasa|service/, icon: Wrench },
];

export function getCategoryIcon(namaKategori: string): LucideIcon {
  const slug = slugify(namaKategori);

  if (CATEGORY_ICONS[slug]) {
    return CATEGORY_ICONS[slug];
  }

  const rule = CATEGORY_ICON_RULES.find((item) => item.match.test(slug));
  return rule?.icon ?? LayoutGrid;
}
