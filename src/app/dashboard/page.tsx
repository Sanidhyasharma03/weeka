
'use client';

import * as React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MainNav } from '@/components/layout/main-nav';
import { Header } from '@/components/layout/header';
import { Gallery } from '@/components/gallery';
import { ImageGenerator } from '@/components/image-generator';
import { Icons } from '@/components/icons';
import { auth } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';
import { streamImages, type ImageRecord } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';

type GalleryImage = {
  id: string;
  src: string;
  title: string;
  description: string;
  tags: string[];
  dataAiHint: string;
};

export default function PhixelForgePage() {
  const [user, loadingAuth, errorAuth] = useAuthState(auth);
  const router = useRouter();
  const [images, setImages] = React.useState<GalleryImage[]>([]);
  const [loadingImages, setLoadingImages] = React.useState(true);

  React.useEffect(() => {
    if (!loadingAuth && !user) {
      router.push('/auth/signin');
    }
  }, [user, loadingAuth, router]);

  React.useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    if (user) {
      setLoadingImages(true);
      unsubscribe = streamImages(user.uid, (postgresImages) => {
        const galleryImages = postgresImages
          .sort((a, b) => b.createdAt - a.createdAt)
          .map((img: ImageRecord) => ({
            id: img.id!,
            src: img.imageData, // Use imageData directly from PostgreSQL
            title: img.prompt.substring(0, 50) + (img.prompt.length > 50 ? '...' : ''),
            description: img.prompt,
            tags: img.prompt.split(' ').slice(0, 5), // basic tagging from prompt
            dataAiHint: 'ai generated',
          }));
        setImages(galleryImages);
        setLoadingImages(false);
      });
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user]);

  if (loadingAuth || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Icons.logo className="size-16 animate-pulse" />
      </div>
    );
  }

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
              <AvatarImage src={user.photoURL ?? "https://picsum.photos/seed/avatar/40/40"} alt="User" data-ai-hint="user avatar" />
              <AvatarFallback>{user.email?.charAt(0).toUpperCase() ?? 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{user.displayName ?? 'Admin User'}</span>
              <span className="text-xs text-muted-foreground">{user.email ?? 'admin@phixel.forge'}</span>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <Header />
        <main className="flex-1 p-4 lg:p-6">
          {loadingImages ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
             </div>
          ) : (
            <Gallery images={images} />
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
