"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Folder, Image, Settings, Users, Upload, Search, Sparkles } from "lucide-react";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/albums", label: "Albums", icon: Folder },
  { href: "/collections", label: "Collections", icon: Image },
  { href: "/upload", label: "Upload", icon: Upload },
  { href: "/advanced-search", label: "Advanced Search", icon: Search },
  { href: "/ai-image-gen", label: "AI Image Gen", icon: Sparkles },
  { href: "/users", label: "Users", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {links.map((link) => (
        <SidebarMenuItem key={link.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname === link.href}
            tooltip={link.label}
          >
            <Link href={link.href}>
              <link.icon />
              <span>{link.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
