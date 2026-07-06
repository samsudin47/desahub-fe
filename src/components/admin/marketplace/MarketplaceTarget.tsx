"use client";

import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { getMarketplaceStats } from "@/data/marketplace";
import { formatCurrency } from "@/lib/format";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function MarketplaceTarget() {
  const stats = getMarketplaceStats();

  const options: ApexOptions = {
    colors: ["#166534"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "radialBar",
      height: 280,
      sparkline: { enabled: true },
    },
    plotOptions: {
      radialBar: {
        startAngle: -85,
        endAngle: 85,
        hollow: { size: "80%" },
        track: {
          background: "#E4E7EC",
          strokeWidth: "100%",
          margin: 5,
        },
        dataLabels: {
          name: { show: false },
          value: {
            fontSize: "32px",
            fontWeight: "600",
            offsetY: -35,
            color: "#1D2939",
            formatter: (val) => `${val}%`,
          },
        },
      },
    },
    fill: { type: "solid", colors: ["#166534"] },
    stroke: { lineCap: "round" },
    labels: ["Progress"],
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="rounded-2xl bg-white px-5 pb-8 pt-5 shadow-default dark:bg-gray-900 sm:px-6 sm:pt-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Target Bulanan
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Pencapaian target transaksi desa
          </p>
        </div>

        <div className="relative mt-2">
          <ReactApexChart
            options={options}
            series={[stats.targetProgress]}
            type="radialBar"
            height={280}
          />
          <span className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-[95%] rounded-full bg-success-50 px-3 py-1 text-xs font-medium text-success-600 dark:bg-success-500/15 dark:text-success-500">
            +12% dari bulan lalu
          </span>
        </div>

        <p className="mx-auto mt-8 max-w-[380px] text-center text-sm text-gray-500">
          Pendapatan {formatCurrency(stats.totalRevenue)} bulan ini.
          {stats.pendingOrders > 0
            ? ` Ada ${stats.pendingOrders} pesanan yang perlu ditindaklanjuti.`
            : " Semua pesanan sudah diproses."}
        </p>
      </div>

      <div className="flex items-center justify-center gap-5 px-6 py-4 sm:gap-8 sm:py-5">
        <div>
          <p className="mb-1 text-center text-xs text-gray-500 sm:text-sm">Target</p>
          <p className="text-center text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            {formatCurrency(stats.monthlyTargetAmount)}
          </p>
        </div>
        <div className="h-7 w-px bg-gray-200 dark:bg-gray-800" />
        <div>
          <p className="mb-1 text-center text-xs text-gray-500 sm:text-sm">Pendapatan</p>
          <p className="text-center text-base font-semibold text-brand-600 sm:text-lg">
            {formatCurrency(stats.completedRevenue)}
          </p>
        </div>
        <div className="h-7 w-px bg-gray-200 dark:bg-gray-800" />
        <div>
          <p className="mb-1 text-center text-xs text-gray-500 sm:text-sm">Dikirim</p>
          <p className="text-center text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            {stats.shippingOrders} pesanan
          </p>
        </div>
      </div>
    </div>
  );
}
