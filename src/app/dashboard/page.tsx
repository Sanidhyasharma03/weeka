import Image from "next/image";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MainNav } from "@/components/layout/main-nav";
import { Header } from "@/components/layout/header";
import { Gallery } from "@/components/gallery";
import { ImageGenerator } from "@/components/image-generator";
import { Icons } from "@/components/icons";

const mockImages = [
  { id: '1', src: 'https://picsum.photos/seed/img1/800/600', title: 'Mountain Vista', description: 'A beautiful mountain landscape.', tags: ['nature', 'mountain', 'landscape'], dataAiHint: 'mountain landscape' },
  { id: '2', src: 'https://picsum.photos/seed/img2/800/600', title: 'City at Night', description: 'A bustling city skyline after sunset.', tags: ['city', 'urban', 'night'], dataAiHint: 'city night' },
  { id: '3', src: 'https://picsum.photos/seed/img3/800/600', title: 'Forest Path', description: 'A quiet path winding through a dense forest.', tags: ['forest', 'nature', 'path'], dataAiHint: 'forest path' },
  { id: '4', src: 'https://picsum.photos/seed/img4/800/600', title: 'Ocean Waves', description: 'Powerful ocean waves crashing on the shore.', tags: ['ocean', 'sea', 'waves'], dataAiHint: 'ocean waves' },
  { id: '5', src: 'https://picsum.photos/seed/img5/800/600', title: 'Abstract Shapes', description: 'Colorful abstract geometric shapes.', tags: ['abstract', 'art', 'colorful'], dataAiHint: 'abstract art' },
  { id: '6', src: 'https://picsum.photos/seed/img6/800/600', title: 'Modern Architecture', description: 'A building with a unique and modern design.', tags: ['architecture', 'modern', 'building'], dataAiHint: 'modern architecture' },
  { id: '7', src: 'https://picsum.photos/seed/img7/800/600', title: 'Desert Dunes', description: 'Sand dunes stretching across a vast desert.', tags: ['desert', 'sand', 'dunes'], dataAiHint: 'desert dunes' },
  { id: '8', src: 'https://picsum.photos/seed/img8/800/600', title: 'Wildlife Portrait', description: 'A close-up portrait of a wild animal.', tags: ['animal', 'wildlife', 'portrait'], dataAiHint: 'wildlife portrait' },
];

export default function PhixelForgePage() {
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
          <SidebarGroup>
            <ImageGenerator />
          </SidebarGroup>
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
          <Gallery images={mockImages} />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}