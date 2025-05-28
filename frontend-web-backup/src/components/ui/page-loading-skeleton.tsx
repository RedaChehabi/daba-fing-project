// File: frontend-web/src/components/ui/page-loading-skeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function PageLoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-5xl space-y-16">
        {/* Hero Section Skeleton */}
        <div className="space-y-6 text-center">
          <Skeleton className="h-7 w-32 mx-auto rounded-full" />
          <Skeleton className="h-12 w-3/4 mx-auto md:h-16" />
          <Skeleton className="h-6 w-full max-w-[700px] mx-auto" />
          <Skeleton className="h-5 w-3/4 max-w-[600px] mx-auto" />
        </div>

        {/* Main Image Skeleton */}
        <div className="flex justify-center">
          <Skeleton className="h-[200px] w-full max-w-3xl md:h-[400px] rounded-2xl" />
        </div>

        {/* Section Skeletons (repeat for a few sections) */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-8">
            <div className="space-y-4">
              <Skeleton className="h-7 w-40" />
              <Skeleton className="h-10 w-2/3" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-5/6" />
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              <Skeleton className="h-40 rounded-lg" />
              <Skeleton className="h-40 rounded-lg" />
              <Skeleton className="h-40 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}