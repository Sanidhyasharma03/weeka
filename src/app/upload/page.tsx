
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function UploadPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center p-4 md:p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Upload New Image</CardTitle>
          <CardDescription>Drag and drop your image or click to browse.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8 text-center transition-colors hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-600">
            <Input type="file" className="sr-only" id="file-upload" />
            <label htmlFor="file-upload" className="cursor-pointer text-blue-600 hover:underline dark:text-blue-400">
              Browse Files
            </label>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">or drag and drop</p>
          </div>
          <Button className="w-full">Upload</Button>
        </CardContent>
      </Card>
    </div>
  );
}
