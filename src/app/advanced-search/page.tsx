
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AdvancedSearchPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center p-4 md:p-8">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Advanced Search</CardTitle>
          <CardDescription>Find images with specific criteria.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="keyword">Keywords</Label>
            <Input id="keyword" placeholder="e.g., nature, abstract, cityscape" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="color">Dominant Color</Label>
            <Input id="color" placeholder="e.g., blue, green, red" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="orientation">Orientation</Label>
            <Select>
              <SelectTrigger id="orientation">
                <SelectValue placeholder="Select orientation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="landscape">Landscape</SelectItem>
                <SelectItem value="portrait">Portrait</SelectItem>
                <SelectItem value="square">Square</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="w-full">Search</Button>
        </CardContent>
      </Card>
    </div>
  );
}
