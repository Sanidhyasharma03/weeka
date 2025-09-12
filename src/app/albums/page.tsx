'use client';

import { useState, useEffect } from 'react';
import { Header } from "@/components/layout/header";
import { MainNav } from "@/components/layout/main-nav";
import { Icons } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Folder, Image as ImageIcon } from "lucide-react";
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
import { getUserAlbums, createAlbum, getPublicImages } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface Album {
  id: string;
  name: string;
  description?: string;
  cover_image_id?: string;
  created_at: Date;
  updated_at: Date;
  image_count?: number;
}

interface AlbumImage {
  id: string;
  title?: string;
  file_path: string;
  created_at: Date;
}

export default function AlbumsPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [albumImages, setAlbumImages] = useState<AlbumImage[]>([]);
  const [availableImages, setAvailableImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, loadingAuth] = useAuthState(auth);
  const router = useRouter();
  const { toast } = useToast();
  
  // Create album dialog state
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState('');
  const [newAlbumDescription, setNewAlbumDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  
  // Add images dialog state
  const [isAddImagesDialogOpen, setIsAddImagesDialogOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  useEffect(() => {
    if (!loadingAuth && !user) {
      router.push('/auth/signin');
      return;
    }
    if (user) {
      loadAlbums();
      loadAvailableImages();
    }
  }, [user, loadingAuth, router]);

  const loadAlbums = async () => {
    if (!user) return;
    
    try {
      const userAlbums = await getUserAlbums();
      setAlbums(userAlbums);
    } catch (error) {
      console.error('Error loading albums:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load albums.',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableImages = async () => {
    try {
      const images = await getPublicImages(100, 0);
      setAvailableImages(images);
    } catch (error) {
      console.error('Error loading available images:', error);
    }
  };

  const loadAlbumImages = async (albumId: string) => {
    try {
      // For now, we'll show a placeholder since we need to implement album images API
      setAlbumImages([]);
    } catch (error) {
      console.error('Error loading album images:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load album images.',
      });
    }
  };

  const handleCreateAlbum = async () => {
    if (!user || !newAlbumName.trim()) return;

    setIsCreating(true);
    try {
      await createAlbum({
        name: newAlbumName.trim(),
        description: newAlbumDescription.trim() || undefined,
      });

      toast({
        title: 'Album created',
        description: 'Your album has been created successfully.',
      });

      setNewAlbumName('');
      setNewAlbumDescription('');
      setIsCreateDialogOpen(false);
      loadAlbums();
    } catch (error) {
      console.error('Error creating album:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create album.',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleAddImagesToAlbum = async () => {
    if (!selectedAlbum || selectedImages.length === 0) return;

    try {
      // TODO: Implement add images to album API
      toast({
        title: 'Feature coming soon',
        description: 'Adding images to albums will be available soon.',
      });

      setSelectedImages([]);
      setIsAddImagesDialogOpen(false);
    } catch (error) {
      console.error('Error adding images to album:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to add images to album.',
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
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">My Albums</h1>
              <p className="text-muted-foreground">Organize your favorite images into collections</p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Album
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Album</DialogTitle>
                  <DialogDescription>
                    Create a new album to organize your images.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="album-name">Album Name</Label>
                    <Input
                      id="album-name"
                      value={newAlbumName}
                      onChange={(e) => setNewAlbumName(e.target.value)}
                      placeholder="Enter album name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="album-description">Description (optional)</Label>
                    <Textarea
                      id="album-description"
                      value={newAlbumDescription}
                      onChange={(e) => setNewAlbumDescription(e.target.value)}
                      placeholder="Describe your album"
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateAlbum} disabled={isCreating || !newAlbumName.trim()}>
                    {isCreating ? 'Creating...' : 'Create Album'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
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
              {albums.map((album) => (
                <Card 
                  key={album.id} 
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => {
                    setSelectedAlbum(album);
                    loadAlbumImages(album.id);
                  }}
                >
                  <div className="aspect-square relative bg-muted flex items-center justify-center">
                    {album.cover_image_id ? (
                      <img
                        src={album.cover_image_id}
                        alt={album.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Folder className="h-16 w-16 text-muted-foreground" />
                    )}
                    <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {album.image_count || 0} images
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <CardTitle className="text-lg mb-1 line-clamp-1">
                      {album.name}
                    </CardTitle>
                    {album.description && (
                      <CardDescription className="line-clamp-2">
                        {album.description}
                      </CardDescription>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          {!loading && albums.length === 0 && (
            <div className="text-center py-12">
              <Folder className="size-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No albums yet</h3>
              <p className="text-muted-foreground mb-4">Create your first album to organize your images!</p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Album
              </Button>
            </div>
          )}

          {/* Album Images View */}
          {selectedAlbum && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold">{selectedAlbum.name}</h2>
                  <p className="text-muted-foreground">{albumImages.length} images</p>
                </div>
                <Dialog open={isAddImagesDialogOpen} onOpenChange={setIsAddImagesDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Images
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>Add Images to {selectedAlbum.name}</DialogTitle>
                      <DialogDescription>
                        Select images from the public collection to add to your album.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
                      {availableImages.map((image) => (
                        <div
                          key={image.id}
                          className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-colors ${
                            selectedImages.includes(image.id)
                              ? 'border-blue-500'
                              : 'border-transparent hover:border-gray-300'
                          }`}
                          onClick={() => {
                            setSelectedImages(prev =>
                              prev.includes(image.id)
                                ? prev.filter(id => id !== image.id)
                                : [...prev, image.id]
                            );
                          }}
                        >
                          <img
                            src={image.file_path}
                            alt={image.title || 'Image'}
                            className="w-full h-24 object-cover"
                          />
                          {selectedImages.includes(image.id) && (
                            <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                              <div className="bg-blue-500 text-white rounded-full p-1">
                                <Plus className="h-4 w-4" />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddImagesDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleAddImagesToAlbum} 
                        disabled={selectedImages.length === 0}
                      >
                        Add {selectedImages.length} Images
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              
              {albumImages.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {albumImages.map((image) => (
                    <div key={image.id} className="aspect-square relative group">
                      <img
                        src={image.file_path}
                        alt={image.title || 'Image'}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ImageIcon className="size-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No images in this album</h3>
                  <p className="text-muted-foreground mb-4">Add some images to get started!</p>
                  <Button onClick={() => setIsAddImagesDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Images
                  </Button>
                </div>
              )}
            </div>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
