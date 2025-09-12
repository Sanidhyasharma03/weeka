'use client';

import { useState, useEffect } from 'react';
import { Header } from "@/components/layout/header";
import { MainNav } from "@/components/layout/main-nav";
import { Icons } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Eye } from "lucide-react";
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
import { auth } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';
import { getPublicImages, toggleLike, getLikeStatus } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface PublicImage {
  id: string;
  title?: string;
  description?: string;
  file_path: string;
  tags?: string[];
  created_at: Date;
  user_id: string;
  like_count?: number;
  comment_count?: number;
  is_liked?: boolean;
}

export default function CollectionsPage() {
  const [images, setImages] = useState<PublicImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, loadingAuth] = useAuthState(auth);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!loadingAuth && !user) {
      router.push('/auth/signin');
      return;
    }
    loadImages();
  }, [user, loadingAuth, router]);

  const loadImages = async () => {
    try {
      const publicImages = await getPublicImages(50, 0);
      
      // Get like counts and user's like status for each image
      const imagesWithStats = await Promise.all(
        publicImages.map(async (image) => {
          try {
            const likeStatus = await getLikeStatus(image.id);
            return {
              ...image,
              like_count: likeStatus.likeCount,
              is_liked: likeStatus.isLiked,
            };
          } catch (error) {
            // If user is not authenticated, just return the image without like status
            return {
              ...image,
              like_count: 0,
              is_liked: false,
            };
          }
        })
      );
      
      setImages(imagesWithStats);
    } catch (error) {
      console.error('Error loading images:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load images.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (imageId: string) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Sign in required',
        description: 'Please sign in to like images.',
      });
      return;
    }

    try {
      const result = await toggleLike(imageId);
      
      // Update the local state immediately for better UX
      setImages(prevImages => 
        prevImages.map(img => 
          img.id === imageId 
            ? { ...img, like_count: result.likeCount, is_liked: result.isLiked }
            : img
        )
      );
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update like.',
      });
    }
  };

  if (loadingAuth) {
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
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center gap-3 px-2">
            <Avatar>
              <AvatarImage src={user?.photoURL ?? "https://picsum.photos/seed/avatar/40/40"} alt="User" data-ai-hint="user avatar" />
              <AvatarFallback>{user?.email?.charAt(0).toUpperCase() ?? 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{user?.displayName ?? 'User'}</span>
              <span className="text-xs text-muted-foreground">{user?.email ?? 'user@phixel.forge'}</span>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <Header />
        <main className="flex-1 p-4 lg:p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Public Collections</h1>
            <p className="text-muted-foreground">Discover amazing images from our community</p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-square bg-muted animate-pulse" />
                  <CardContent className="p-4">
                    <div className="h-4 bg-muted rounded animate-pulse mb-2" />
                    <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {images.map((image) => (
                <Card key={image.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square relative group">
                    <img
                      src={image.file_path}
                      alt={image.title || 'Image'}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={image.is_liked ? "default" : "secondary"}
                          onClick={() => handleLike(image.id)}
                          className="bg-white/90 hover:bg-white text-black"
                        >
                          <Heart className={`h-4 w-4 ${image.is_liked ? 'fill-red-500 text-red-500' : ''}`} />
                          {image.like_count || 0}
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="bg-white/90 hover:bg-white text-black"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <CardTitle className="text-lg mb-2 line-clamp-1">
                      {image.title || 'Untitled'}
                    </CardTitle>
                    {image.description && (
                      <CardDescription className="line-clamp-2 mb-3">
                        {image.description}
                      </CardDescription>
                    )}
                    {image.tags && image.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {image.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {image.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{image.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          {!loading && images.length === 0 && (
            <div className="text-center py-12">
              <Icons.logo className="size-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No images yet</h3>
              <p className="text-muted-foreground mb-4">Be the first to share an image!</p>
              <Button onClick={() => router.push('/upload')}>
                Upload Image
              </Button>
            </div>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
