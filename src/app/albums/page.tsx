'use client';
import { useState, useRef, useEffect } from "react";
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

// Upload icon component
const UploadIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
  </svg>
);

export default function AlbumsPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Create preview URL when file is selected
  useEffect(() => {
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
      
      // Cleanup function to revoke the object URL
      return () => URL.revokeObjectURL(objectUrl);
    }
    setPreviewUrl(null);
  }, [selectedFile]);

  // Event handlers for file upload
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      // Accept both images and videos
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        setSelectedFile(file);
      }
    }
  };

  interface FileChangeEvent extends React.ChangeEvent<HTMLInputElement> {}

  const handleFileChange = (e: FileChangeEvent) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    if (selectedFile) {
      console.log('Uploading file:', selectedFile.name);
      
      // Create a temporary notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300';
      notification.textContent = `Uploading: ${selectedFile.name}`;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.textContent = `✓ Uploaded successfully: ${selectedFile.name}`;
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 2000);
      }, 1500);

      // Clear selection after upload
      setSelectedFile(null);
    }
  };

  const isVideo = selectedFile && selectedFile.type.startsWith('video/');

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
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Albums</h1>
            <p className="text-muted-foreground">Upload and manage your photos and videos</p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            {/* File Upload Area */}
            <div 
              className="relative flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-lg cursor-pointer border-border hover:bg-muted/50 transition-colors"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {/* Hidden file input */}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/,video/" 
              />
              
              {previewUrl ? (
                // Preview when file is selected
                <div className="text-center w-full">
                  {isVideo ? (
                    <video 
                      src={previewUrl} 
                      controls 
                      className="max-h-48 mx-auto mb-4 rounded-md shadow-md"
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="max-h-48 mx-auto mb-4 rounded-md shadow-md object-cover"
                    />
                  )}
                  <p className="font-medium text-foreground">{selectedFile?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedFile?.size ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : ''}
                  </p>
                </div>
              ) : (
                // Default upload area
                <div className="text-center">
                  <UploadIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-semibold text-foreground mb-2">
                    Drop your files here
                  </p>
                  <p className="text-sm text-muted-foreground mb-1">
                    or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supports images and videos up to 50MB
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {selectedFile && (
              <div className="mt-6 flex justify-end gap-3">
                <button 
                  onClick={() => setSelectedFile(null)}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                >
                  Clear
                </button>
                <button 
                  onClick={handleUploadClick}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                >
                  Upload {isVideo ? 'Video' : 'Photo'}
                </button>
              </div>
            )}
          </div>

          {/* Additional content can go here */}
          <div className="mt-12 text-center">
            <p className="text-muted-foreground">Your uploaded files will appear here</p>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}