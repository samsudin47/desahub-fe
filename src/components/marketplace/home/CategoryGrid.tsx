import Link from "next/link";

import { categories } from "@/data/marketplace";



export default function CategoryGrid() {

  return (

    <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0 lg:grid-cols-6">

      {categories.map((cat) => (

        <Link

          key={cat.slug}

          href={`/marketplace-umkm/kategori/${cat.slug}`}

          className="flex w-[72px] shrink-0 flex-col items-center gap-1.5 rounded-2xl border border-gray-200 bg-white p-3 transition hover:border-desahub-300 hover:bg-desahub-50 sm:w-auto sm:gap-2 sm:p-4"

        >

          <span className="flex size-11 items-center justify-center rounded-full bg-desahub-50 text-xl sm:size-12 sm:text-2xl">

            {cat.icon}

          </span>

          <span className="text-center text-[11px] font-medium text-gray-700 sm:text-sm">

            {cat.name}

          </span>

        </Link>

      ))}

    </div>

  );

}


