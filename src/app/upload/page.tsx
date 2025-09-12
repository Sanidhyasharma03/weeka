
'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { createImage } from '@/lib/api';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const router = useRouter();
  const [user, loadingAuth] = useAuthState(auth);

  // Redirect if not authenticated
  if (!loadingAuth && !user) {
    router.push('/auth/signin');
    return null;
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (selectedFile: File) => {
    // Validate file type (images and videos)
    if (!selectedFile.type.startsWith('image/') && !selectedFile.type.startsWith('video/')) {
      toast({
        variant: 'destructive',
        title: 'Invalid file type',
        description: 'Please select an image or video file.',
      });
      return;
    }

    // Validate file size (50MB limit for videos, 10MB for images)
    const maxSize = selectedFile.type.startsWith('video/') ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      toast({
        variant: 'destructive',
        title: 'File too large',
        description: `Please select a file smaller than ${selectedFile.type.startsWith('video/') ? '50MB' : '10MB'}.`,
      });
      return;
    }

    setFile(selectedFile);
    if (!title) {
      setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !user) return;

    setIsUploading(true);
    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const base64Data = e.target?.result as string;
          
          // Get image/video dimensions
          let width, height;
          if (file.type.startsWith('image/')) {
            const img = new Image();
            img.onload = async () => {
              width = img.width;
              height = img.height;
              await uploadFile(base64Data, width, height);
            };
            img.src = base64Data;
          } else {
            // For videos, we'll get dimensions after upload
            await uploadFile(base64Data);
          }
        } catch (error) {
          console.error('Upload error:', error);
          toast({
            variant: 'destructive',
            title: 'Upload failed',
            description: 'Failed to upload file. Please try again.',
          });
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        variant: 'destructive',
        title: 'Upload failed',
        description: 'Failed to upload file. Please try again.',
      });
      setIsUploading(false);
    }
  };

  const uploadFile = async (base64Data: string, width?: number, height?: number) => {
    try {
      // Create file record via API
      await createImage({
        title: title || file!.name,
        description: description,
        file_path: base64Data,
        file_size: file!.size,
        mime_type: file!.type,
        width: width,
        height: height,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
        is_public: true,
      });

      toast({
        title: 'Upload successful',
        description: `Your ${file!.type.startsWith('video/') ? 'video' : 'image'} has been uploaded successfully.`,
      });

      // Reset form
      setFile(null);
      setTitle('');
      setDescription('');
      setTags('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        variant: 'destructive',
        title: 'Upload failed',
        description: 'Failed to upload file. Please try again.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (loadingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center p-4 md:p-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Upload New File</CardTitle>
          <CardDescription>Share your images and videos with the community</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          {/* File Upload Area */}
          <div
            className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
              dragActive
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                : 'border-gray-300 hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-600'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileInput}
              className="sr-only"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              {file ? (
                <div className="space-y-2">
                  <div className="text-green-600 dark:text-green-400">
                    ✓ {file.name}
                  </div>
                  <p className="text-sm text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-blue-600 hover:underline dark:text-blue-400">
                    Browse Files
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    or drag and drop
                  </p>
                </div>
              )}
            </label>
          </div>

          {/* File Preview */}
          {file && (
            <div className="space-y-4">
              <div className="text-center">
                <Label className="text-sm font-medium">Preview</Label>
                <div className="mt-2 max-w-md mx-auto">
                  {file.type.startsWith('image/') ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Preview"
                      className="max-w-full max-h-64 object-contain rounded-lg border"
                    />
                  ) : file.type.startsWith('video/') ? (
                    <video
                      src={URL.createObjectURL(file)}
                      controls
                      className="max-w-full max-h-64 rounded-lg border"
                    />
                  ) : null}
                </div>
              </div>

              {/* File Details */}
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter file title"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your file"
                    rows={3}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="nature, landscape, sunset"
                  />
                </div>
              </div>
            </div>
          )}

          <Button 
            onClick={handleUpload} 
            disabled={!file || isUploading}
            className="w-full"
          >
            {isUploading ? 'Uploading...' : 'Upload File'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
