import Skeleton from "./Skeleton";

/** Skeleton for doctor profile page: image left, content right. */
function DoctorProfileSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10">
      <Skeleton className="h-5 w-28 mb-6 rounded" />

      <div className="flex flex-col md:flex-row gap-8 border rounded-lg shadow-md p-6 bg-white">
        <div className="md:w-1/3 flex-shrink-0">
          <Skeleton className="w-full aspect-square rounded-lg" />
        </div>
        <div className="md:w-2/3 space-y-4">
          <Skeleton className="h-8 w-3/4 rounded" />
          <Skeleton className="h-5 w-1/2 rounded" />
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-2/3 rounded" />
          <Skeleton className="h-4 w-1/2 rounded" />
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-4/5 rounded" />
          <Skeleton className="h-4 w-3/4 rounded" />
          <Skeleton className="h-4 w-2/3 rounded" />
          <Skeleton className="h-11 w-40 mt-4 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export default DoctorProfileSkeleton;
