import Skeleton from "./Skeleton";

/** Skeleton that matches DoctorCard layout: image aspect-[4/5], content with name, fee, CTA. */
function DoctorCardSkeleton() {
  return (
    <div className="w-[300px] flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <Skeleton className="w-full aspect-[4/5] rounded-none" />
      <div className="flex flex-col flex-1 p-4 text-left gap-2">
        <Skeleton className="h-6 w-3/4 rounded" />
        <Skeleton className="h-4 w-24 rounded" />
        <Skeleton className="h-4 w-28 rounded mt-1" />
        <Skeleton className="h-4 w-36 rounded mt-3" />
      </div>
    </div>
  );
}

export default DoctorCardSkeleton;
