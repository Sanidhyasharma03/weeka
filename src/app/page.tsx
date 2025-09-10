import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { Mountain, Palette, Workflow } from 'lucide-react';
import Image from 'next/image';
import ColorGridBackground from '@/components/ColorGridBackground';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen">
      <ColorGridBackground />
      <header className="px-4 lg:px-6 h-14 flex items-center z-20 pointer-events-auto">
        <Link href="#" className="flex items-center justify-center" prefetch={false}>
          <Icons.logo className="size-6" />
          <span className="sr-only">PhixelForge</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            href="/dashboard"
            className="text-sm font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            Dashboard
          </Link>
          <Button asChild className="pointer-events-auto">
            <Link href="/auth/signup">Get Started</Link>
          </Button>
        </nav>
      </header>
      <main className="relative flex flex-col items-center justify-between min-h-screen p-24 pointer-events-none">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex justify-center">
              <div className="flex flex-col items-center justify-center space-y-4 text-center max-w-[800px]">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Unleash Your Creativity with PhixelForge
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    The ultimate AI-powered media management platform. Organize, edit, and generate stunning visuals
                    with ease.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg" className="pointer-events-auto">
                    <Link href="/auth/signup" prefetch={false}>
                      Start For Free
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted pointer-events-auto">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                  Everything You Need in One Place
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  PhixelForge provides a comprehensive suite of tools to streamline your creative workflow and bring
                  your ideas to life.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="grid gap-1">
                <div className="flex items-center gap-2">
                  <Palette className="size-6" />
                  <h3 className="text-xl font-bold">AI Image Generation</h3>
                </div>
                <p className="text-muted-foreground">
                  Create unique images from simple text prompts with our powerful AI generator.
                </p>
              </div>
              <div className="grid gap-1">
                <div className="flex items-center gap-2">
                  <Mountain className="size-6" />
                  <h3 className="text-xl font-bold">Visual Search</h3>
                </div>
                <p className="text-muted-foreground">
                  Find similar images in your library based on visual characteristics or text descriptions.
                </p>
              </div>
              <div className="grid gap-1">
                <div className="flex items-center gap-2">
                  <Workflow className="size-6" />
                  <h3 className="text-xl font-bold">Smart Organization</h3>
                </div>
                <p className="text-muted-foreground">
                  Automatically tag and categorize your media assets for effortless management.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t z-20 pointer-events-auto">
        <p className="text-xs text-muted-foreground">&copy; 2024 PhixelForge. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
