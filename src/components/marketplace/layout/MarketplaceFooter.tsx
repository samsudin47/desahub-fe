import Link from "next/link";

export default function MarketplaceFooter() {
  return (
    <footer
      id="bantuan"
      className="mt-auto border-t border-gray-200 bg-white"
    >
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <h3 className="mb-3 font-semibold text-gray-900">DesaHub</h3>
            <p className="text-sm text-gray-500">
              Platform marketplace UMKM desa. Dukung produk lokal, bangun desa
              mandiri.
            </p>
          </div>
          <div>
            <h3 className="mb-3 font-semibold text-gray-900">Bantuan</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <Link href="#" className="hover:text-desahub-600">
                  Cara Berbelanja
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-desahub-600">
                  Kebijakan Pengembalian
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-desahub-600">
                  Hubungi Kami
                </Link>
              </li>
            </ul>
          </div>
          <div id="tentang">
            <h3 className="mb-3 font-semibold text-gray-900">Tentang Desa</h3>
            <p className="text-sm text-gray-500">
              Desa Sukamaju — pusat UMKM lokal dengan produk makanan, kerajinan,
              dan hasil pertanian berkualitas.
            </p>
          </div>
        </div>
        <p className="mt-8 border-t border-gray-100 pt-6 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} DesaHub. Semua hak dilindungi.
        </p>
      </div>
    </footer>
  );
}
