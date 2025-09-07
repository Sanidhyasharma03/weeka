import { Header } from "@/components/layout/header";
import { MainNav } from "@/components/layout/main-nav";
import { Icons } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarSeparator,
} from "@/components/ui/sidebar";

export default function CollectionsPage() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-3 px-2">
            <Icons.logo className="size-8" />
            <h1 className="text-xl font-headline font-semibold">PhixelForge</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <MainNav />
          </SidebarGroup>
          <SidebarSeparator />
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center gap-3 px-2">
            <Avatar>
              <AvatarImage src="https://picsum.photos/seed/avatar/40/40" alt="User" data-ai-hint="user avatar" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Admin User</span>
              <span className="text-xs text-muted-foreground">admin@phixel.forge</span>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <Header />
        <main className="flex-1 p-4 lg:p-6">
          <div className="flex items-center justify-center h-full">
            <h1 className="text-2xl font-bold">Collections Page (Placeholder)</h1>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
