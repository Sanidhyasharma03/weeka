"use client";

import * as React from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type ImageType = {
  id: string;
  src: string;
  title: string;
  description: string;
  tags: string[];
  dataAiHint: string;
};

type GalleryProps = {
  images: ImageType[];
};

export function Gallery({ images }: GalleryProps) {
  const [selectedImage, setSelectedImage] = React.useState<ImageType | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {images.map((image) => (
          <Card
            key={image.id}
            className="overflow-hidden cursor-pointer group transition-all hover:shadow-lg hover:-translate-y-1"
            onClick={() => setSelectedImage(image)}
          >
            <CardContent className="p-0">
              <div className="aspect-w-4 aspect-h-3">
                <Image
                  src={image.src}
                  alt={image.title}
                  width={800}
                  height={600}
                  className="object-cover w-full h-full transition-transform group-hover:scale-105"
                  data-ai-hint={image.dataAiHint}
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold truncate">{image.title}</h3>
                <p className="text-sm text-muted-foreground truncate">{image.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          {selectedImage && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center justify-center bg-muted/50 rounded-lg">
                <Image
                  src={selectedImage.src}
                  alt={selectedImage.title}
                  width={800}
                  height={600}
                  className="rounded-md object-contain max-h-[70vh]"
                  data-ai-hint={selectedImage.dataAiHint}
                />
              </div>
              <div className="flex flex-col space-y-4">
                <DialogHeader>
                  <DialogTitle className="font-headline text-3xl">{selectedImage.title}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" defaultValue={selectedImage.title} />
                  </div>
                  <div>
                    <Label htmlFor="alt-text">Alt Text</Label>
                    <Input id="alt-text" defaultValue={selectedImage.title} />
                  </div>
                  <div>
                    <Label htmlFor="caption">Caption</Label>
                    <Textarea id="caption" defaultValue={selectedImage.description} />
                  </div>
                   <div>
                     <Label>Tags</Label>
                     <div className="flex flex-wrap gap-2 pt-2">
                       {selectedImage.tags.map((tag) => (
                         <Badge key={tag} variant="secondary">{tag}</Badge>
                       ))}
                     </div>
                   </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
