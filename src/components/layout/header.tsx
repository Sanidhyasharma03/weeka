"use client"

import { Search, Bell, PanelLeft } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { findSimilarImages } from "@/ai/flows/find-similar-images"
import { useToast } from "@/hooks/use-toast"
import { auth } from "@/lib/firebase"
import { signOut } from "firebase/auth"
import { useRouter } from "next/navigation"

export function Header() {
  const { toast } = useToast();
  const router = useRouter();

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = formData.get("search") as string;
    if (!query) return;

    toast({
      title: "Searching...",
      description: "Looking for images similar to your query.",
    });

    try {
      // The AI flow is a placeholder and will return no results.
      const results = await findSimilarImages({ textDescription: query });
      if(results.results.length === 0) {
         toast({
          title: "No Similar Images Found",
          description: "We couldn't find any images matching your search.",
        });
      } else {
        // This part won't be reached with the current placeholder implementation
        toast({
          title: "Search Complete",
          description: `Found ${results.results.length} similar images.`,
        });
      }
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Search Failed",
        description: "An error occurred during the search.",
      });
    }
  }

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/auth/signin');
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <SidebarTrigger className="md:hidden" />
      
      <div className="relative flex-1">
        <form onSubmit={handleSearch}>
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            name="search"
            placeholder="Search for visually similar images..."
            className="w-full rounded-lg bg-background/50 pl-8 md:w-[280px] lg:w-[420px]"
          />
        </form>
      </div>
      
      <h1 className="flex-1 text-center font-headline text-2xl font-bold hidden md:block">
        Dashboard
      </h1>
      
      <div className="flex flex-1 items-center justify-end gap-2">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Toggle notifications</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src="https://picsum.photos/seed/avatar/40/40" alt="User" data-ai-hint="user avatar" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
