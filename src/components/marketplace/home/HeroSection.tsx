import Link from "next/link";
import MktButton from "../ui/MktButton";

export default function HeroSection() {
  return (
    <section className="overflow-hidden rounded-2xl bg-desahub-600">
      <div className="flex flex-col lg:grid lg:grid-cols-2">
        <div className="flex flex-col justify-center gap-3 p-5 sm:gap-4 sm:p-8 lg:p-12">
          <h1 className="text-xl font-bold leading-tight text-white sm:text-2xl lg:text-4xl">
            Dukung Produk Lokal,
            <br />
            Bangun Desa Mandiri
          </h1>
          <p className="max-w-md text-xs text-desahub-100 sm:text-sm lg:text-base">
            Temukan produk UMKM terbaik dari desa Anda. Makanan, kerajinan,
            pertanian, dan lainnya — langsung dari penjual lokal.
          </p>
          <div>
            <Link href="/marketplace-umkm/kategori">
              <MktButton
                variant="outline"
                size="md"
                className="border-white bg-white text-desahub-600 hover:bg-desahub-50"
              >
                Belanja Sekarang
              </MktButton>
            </Link>
          </div>
        </div>
        <div className="hidden items-center justify-center bg-desahub-700 p-6 sm:flex lg:p-12">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {["🧺", "🌾", "🍚", "🥤"].map((emoji, i) => (
              <div
                key={i}
                className="flex size-16 items-center justify-center rounded-2xl bg-white/10 text-3xl sm:size-24 sm:text-5xl"
              >
                {emoji}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


