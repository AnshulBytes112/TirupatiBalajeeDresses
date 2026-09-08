import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="py-20 sm:py-28">
      <Container size="md">
        <div className="rounded-3xl border border-slate-200/80 bg-white p-8 sm:p-12 text-center shadow-card">
          <span className="rounded-full bg-brand-yellow-300 px-3 py-1 text-xs font-black text-brand-navy-950">
            404 — Page Not Found
          </span>
          <h1 className="mt-4 text-3xl sm:text-4xl font-black text-brand-navy-950">
            Looks like this page took a recess!
          </h1>
          <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
            The uniform item or page you are looking for might have been moved or doesn&apos;t exist.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/">
              <Button variant="default" leftIcon={<ArrowLeft className="h-4 w-4" />}>
                Back to Homepage
              </Button>
            </Link>
            <Link href="/categories">
              <Button variant="outline" leftIcon={<Search className="h-4 w-4" />}>
                Browse All Categories
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
