
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function AiImageGenPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center p-4 md:p-8">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">AI Image Generation</CardTitle>
          <CardDescription>Generate stunning images from your text prompts.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="prompt">Image Prompt</Label>
            <Textarea id="prompt" placeholder="e.g., A futuristic city at sunset, highly detailed, photorealistic" rows={5} />
          </div>
          <Button className="w-full">Generate Image</Button>
        </CardContent>
      </Card>
    </div>
  );
}
