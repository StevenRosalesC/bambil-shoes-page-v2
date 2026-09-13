"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { BreadcrumbItem } from "@/types";
import { Icon } from "@iconify/react";

export interface BreadcrumbsProps {
  /**
   * Optional custom items. If not provided, breadcrumbs are auto-generated from current URL pathname.
   */
  items?: BreadcrumbItem[];
  /**
   * Optional additional CSS classes for the container.
   */
  className?: string;
  /**
   * Whether to display the home icon on the first "Inicio" link. Default: true.
   */
  showHomeIcon?: boolean;
}

const ROUTE_LABELS: Record<string, string> = {
  catalog: "Catálogo",
  about: "Sobre Nosotros",
  contact: "Contacto",
  product: "Catálogo",
  tracking: "Rastreo de Pedidos",
};

export default function Breadcrumbs({
  items,
  className = "",
  showHomeIcon = true,
}: BreadcrumbsProps) {
  const pathname = usePathname();

  // If explicit items provided, use them; otherwise auto-generate from pathname
  const breadcrumbList: BreadcrumbItem[] = React.useMemo(() => {
    if (items && items.length > 0) {
      return items;
    }

    if (!pathname || pathname === "/") {
      return [];
    }

    const segments = pathname.split("/").filter(Boolean);
    const generated: BreadcrumbItem[] = [{ label: "Inicio", href: "/" }];

    let currentHref = "";
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      currentHref += `/${segment}`;

      const isLast = i === segments.length - 1;
      const label = ROUTE_LABELS[segment] || decodeURIComponent(segment);

      generated.push({
        label,
        href: isLast ? undefined : currentHref,
      });
    }

    return generated;
  }, [items, pathname]);

  // Do not render breadcrumbs on homepage or when trail is empty
  if (!breadcrumbList || breadcrumbList.length <= 1) {
    return null;
  }

  return (
    <nav
      aria-label="Ruta de navegación"
      className={`flex items-center text-xs font-sans text-[#705a4c] overflow-x-auto no-scrollbar py-1 ${className}`}
    >
      <ol
        className="flex items-center flex-wrap gap-1.5 sm:gap-2"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        {breadcrumbList.map((item, index) => {
          const isLast = index === breadcrumbList.length - 1;
          const isFirst = index === 0;

          return (
            <li
              key={`${item.label}-${index}`}
              className="flex items-center gap-1.5 sm:gap-2 shrink-0"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              {index > 0 && (
                <span
                  className="text-[#a8998f] select-none text-[11px] font-normal leading-none"
                  aria-hidden="true"
                >
                  /
                </span>
              )}

              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-1 text-[#705a4c] hover:text-primary transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-primary py-0.5"
                  itemProp="item"
                >
                  {isFirst && showHomeIcon && (
                    <Icon icon="material-symbols:home" className="text-[15px] text-[#705a4c]" />
                  )}
                  <span itemProp="name">{item.label}</span>
                </Link>
              ) : (
                <span
                  className="font-semibold text-primary truncate max-w-50 sm:max-w-[320px] md:max-w-none"
                  aria-current="page"
                  itemProp="name"
                >
                  {item.label}
                </span>
              )}

              <meta itemProp="position" content={String(index + 1)} />
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
