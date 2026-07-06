import MarketplaceHeader from "@/components/marketplace/layout/MarketplaceHeader";

import MarketplaceFooter from "@/components/marketplace/layout/MarketplaceFooter";

import MarketplaceBottomNav from "@/components/marketplace/layout/MarketplaceBottomNav";



export default function MarketplaceLayout({

  children,

}: {

  children: React.ReactNode;

}) {

  return (

    <div className="flex min-h-screen flex-col bg-gray-50">

      <MarketplaceHeader />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-4 pb-20 lg:px-6 lg:py-8 lg:pb-8">

        {children}

      </main>

      <div className="hidden lg:block">

        <MarketplaceFooter />

      </div>

      <MarketplaceBottomNav />

    </div>

  );

}


