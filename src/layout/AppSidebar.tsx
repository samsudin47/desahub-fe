"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import AppLogo from "@/components/common/AppLogo";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import {
  BellIcon,
  BoltIcon,
  BoxCubeIcon,
  FolderIcon,
  ChatIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  DocsIcon,
  GridIcon,
  GroupIcon,
  HorizontaLDots,
  PaperPlaneIcon,
  PieChartIcon,
  PlugInIcon,
  ShootingStarIcon,
  UserCircleIcon,
} from "../icons/index";
type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Beranda",
    path: "/",
  },
  {
    icon: <UserCircleIcon />,
    name: "Profil Desa",
    path: "/profil-desa",
  },
  {
    icon: <DocsIcon />,
    name: "Berita Desa",
    path: "/berita-desa",
  },
  {
    icon: <ChatIcon />,
    name: "Feed Desa",
    path: "/feed-desa",
  },
  {
    icon: <PaperPlaneIcon />,
    name: "Aspirasi & Usulan",
    path: "/aspirasi-usulan",
  },
  {
    icon: <CheckCircleIcon />,
    name: "Voting Usulan",
    path: "/voting-usulan",
  },
  {
    icon: <BoxCubeIcon />,
    name: "Marketplace UMKM",
    subItems: [
      { name: "Dashboard", path: "/kelola-marketplace" },
      { name: "Produk", path: "/kelola-marketplace/produk" },
      { name: "Pesanan", path: "/kelola-marketplace/pesanan" },
      { name: "Penjual UMKM", path: "/kelola-marketplace/penjual" },
      { name: "Kategori", path: "/kelola-marketplace/kategori" },
    ],
  },
  {
    icon: <ShootingStarIcon />,
    name: "Wisata Desa",
    path: "/wisata-desa",
  },
  {
    icon: <BellIcon />,
    name: "Pengumuman",
    path: "/pengumuman",
  },
  {
    icon: <PieChartIcon />,
    name: "Statistik Desa",
    path: "/statistik-desa",
  },
  {
    icon: <BoltIcon />,
    name: "SPK Pembangunan",
    path: "/spk-pembangunan",
  },
  {
    icon: <FolderIcon />,
    name: "Data Management",
    subItems: [
      { name: "Master Kategori", path: "/data-management/master-kategori" },
      { name: "Master Penjual", path: "/data-management/master-penjual" },
    ],
  },
  {
    icon: <GroupIcon />,
    name: "Pengguna",
    path: "/pengguna",
  },
  {
    icon: <PlugInIcon />,
    name: "Pengaturan",
    path: "/pengaturan",
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen } = useSidebar();
  const pathname = usePathname();

  const renderMenuItems = (items: NavItem[]) => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index)}
              className={`menu-item group  ${
                openSubmenu === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded ? "lg:justify-center" : "lg:justify-start"
              }`}
            >
              <span
                className={` ${
                  openSubmenu === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isMobileOpen) && (
                <span className={`menu-item-text`}>{nav.name}</span>
              )}
              {(isExpanded || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200  ${
                    openSubmenu === index ? "rotate-180 text-brand-500" : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isMobileOpen) && (
                  <span className={`menu-item-text`}>{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`main-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu === index
                    ? `${subMenuHeight[`main-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  useEffect(() => {
    let submenuMatched = false;

    navItems.forEach((nav, index) => {
      if (nav.subItems) {
        nav.subItems.forEach((subItem) => {
          if (isActive(subItem.path)) {
            setOpenSubmenu(index);
            submenuMatched = true;
          }
        });
      }
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `main-${openSubmenu}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number) => {
    setOpenSubmenu((prevOpenSubmenu) =>
      prevOpenSubmenu === index ? null : index
    );
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen ? "w-[290px]" : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
    >
      <div
        className={`py-8 flex  ${
          !isExpanded ? "lg:justify-center" : "justify-start"
        }`}
      >
        <AppLogo
          iconOnly={!(isExpanded || isMobileOpen)}
          size="md"
        />
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded ? "lg:justify-center" : "justify-start"
                }`}
              >
                {isExpanded || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(navItems)}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
