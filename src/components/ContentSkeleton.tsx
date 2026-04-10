import { Skeleton } from "@/components/ui/skeleton";

export const BibleSkeleton = () => (
  <div className="p-4 sm:p-8 max-w-2xl mx-auto">
    <Skeleton className="h-1 w-full mb-6" />
    <div className="flex items-center justify-between mb-8">
      <div>
        <Skeleton className="h-8 w-24 mb-2" />
        <Skeleton className="h-4 w-48" />
      </div>
      <Skeleton className="h-9 w-9 rounded-lg" />
    </div>
    <div className="flex items-center gap-3 mb-6 justify-center">
      <Skeleton className="h-8 w-8 rounded-lg" />
      <Skeleton className="h-8 w-36" />
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-8 w-8 rounded-lg" />
    </div>
    <div className="space-y-3">
      {Array.from({ length: 12 }).map((_, i) => (
        <Skeleton key={i} className="h-5 w-full" style={{ width: `${70 + Math.random() * 30}%` }} />
      ))}
    </div>
  </div>
);

export const PrayerWallSkeleton = () => (
  <div className="p-4 sm:p-8">
    <div className="flex items-center justify-between mb-8">
      <div>
        <Skeleton className="h-8 w-32 mb-2" />
        <Skeleton className="h-4 w-48" />
      </div>
      <Skeleton className="h-10 w-28 rounded-lg" />
    </div>
    <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-card rounded-xl p-5 border border-border break-inside-avoid">
          <div className="flex items-center gap-2 mb-3">
            <Skeleton className="h-7 w-7 rounded-full" />
            <Skeleton className="h-4 w-24" />
            <div className="flex-1" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-3/4 mb-3" />
          <Skeleton className="h-4 w-24" />
        </div>
      ))}
    </div>
  </div>
);

export const ChatSkeleton = () => (
  <div className="p-4 sm:p-8 max-w-2xl mx-auto">
    <div className="mb-8">
      <Skeleton className="h-8 w-28 mb-2" />
      <Skeleton className="h-4 w-44" />
    </div>
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="bg-card rounded-xl p-4 border border-border flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-4 w-32 mb-1" />
            <Skeleton className="h-3 w-48" />
          </div>
          <Skeleton className="h-5 w-8 rounded-full" />
        </div>
      ))}
    </div>
  </div>
);

export const GenericSkeleton = () => (
  <div className="p-4 sm:p-8 max-w-2xl mx-auto">
    <Skeleton className="h-8 w-40 mb-2" />
    <Skeleton className="h-4 w-56 mb-8" />
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-card rounded-xl p-5 border border-border">
          <Skeleton className="h-5 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ))}
    </div>
  </div>
);
