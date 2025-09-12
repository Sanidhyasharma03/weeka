// Client-side API functions that call our API routes
// This avoids importing PostgreSQL modules on the client side

export interface ImageRecord {
  id?: string;
  userId: string;
  prompt: string;
  imageData: string;
  createdAt: number;
}

export interface PublicImage {
  id: string;
  title?: string;
  description?: string;
  file_path: string;
  tags?: string[];
  created_at: string;
  user_id: string;
  like_count?: number;
  is_liked?: boolean;
}

export interface Album {
  id: string;
  name: string;
  description?: string;
  cover_image_id?: string;
  created_at: string;
  updated_at: string;
  image_count?: number;
}

// Get Firebase ID token for API calls (simplified for now)
async function getIdToken(): Promise<string> {
  // For now, return a dummy token since we're not using Firebase Admin
  return 'dummy-token';
}

// Image API functions
export async function getPublicImages(limit: number = 50, offset: number = 0): Promise<PublicImage[]> {
  const response = await fetch(`/api/images?limit=${limit}&offset=${offset}`);
  if (!response.ok) {
    throw new Error('Failed to fetch images');
  }
  const data = await response.json();
  return data.images;
}

export async function getUserImages(): Promise<PublicImage[]> {
  const token = await getIdToken();
  const response = await fetch('/api/images/user', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch user images');
  }
  const data = await response.json();
  return data.images;
}

export async function createImage(imageData: {
  title?: string;
  description?: string;
  file_path: string;
  file_size?: number;
  mime_type?: string;
  width?: number;
  height?: number;
  tags?: string[];
  is_public?: boolean;
}): Promise<PublicImage> {
  const response = await fetch('/api/images', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(imageData),
  });
  if (!response.ok) {
    throw new Error('Failed to create image');
  }
  const data = await response.json();
  return data.image;
}

// Like API functions
export async function toggleLike(imageId: string): Promise<{ likeCount: number; isLiked: boolean }> {
  const token = await getIdToken();
  const response = await fetch('/api/likes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ imageId }),
  });
  if (!response.ok) {
    throw new Error('Failed to toggle like');
  }
  return await response.json();
}

export async function getLikeStatus(imageId: string): Promise<{ likeCount: number; isLiked: boolean }> {
  const token = await getIdToken();
  const response = await fetch(`/api/likes?imageId=${imageId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch like status');
  }
  return await response.json();
}

// Album API functions
export async function getUserAlbums(): Promise<Album[]> {
  const token = await getIdToken();
  const response = await fetch('/api/albums', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch albums');
  }
  const data = await response.json();
  return data.albums;
}

export async function createAlbum(albumData: {
  name: string;
  description?: string;
  coverImageId?: string;
}): Promise<Album> {
  const token = await getIdToken();
  const response = await fetch('/api/albums', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(albumData),
  });
  if (!response.ok) {
    throw new Error('Failed to create album');
  }
  const data = await response.json();
  return data.album;
}

// Legacy functions for compatibility with existing code
export async function saveImage(imageData: Omit<ImageRecord, 'id'>): Promise<string> {
  const image = await createImage({
    title: imageData.prompt.substring(0, 100),
    description: imageData.prompt,
    file_path: imageData.imageData,
    mime_type: 'image/png',
    tags: imageData.prompt.split(' ').slice(0, 5),
    is_public: true,
  });
  return image.id;
}

export function streamImages(userId: string, callback: (images: ImageRecord[]) => void): () => void {
  let isActive = true;

  const fetchImages = async () => {
    if (!isActive) return;

    try {
      const images = await getUserImages();
      
      // Convert to ImageRecord format for compatibility
      const imageRecords: ImageRecord[] = images.map((img: PublicImage) => ({
        id: img.id,
        userId: userId,
        prompt: img.description || img.title || '',
        imageData: img.file_path,
        createdAt: new Date(img.created_at).getTime()
      }));

      callback(imageRecords);
    } catch (error) {
      console.error('Error streaming images:', error);
      callback([]);
    }
  };

  // Initial fetch
  fetchImages();

  // Set up polling for real-time updates (every 5 seconds)
  const interval = setInterval(fetchImages, 5000);

  // Return unsubscribe function
  return () => {
    isActive = false;
    clearInterval(interval);
  };
}
