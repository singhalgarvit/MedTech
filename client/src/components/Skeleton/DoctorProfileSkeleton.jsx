import Skeleton from "./Skeleton";

/** Skeleton for doctor profile page: back link, image + header block, info grid, about & clinic sections. */
function DoctorProfileSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:px-6 md:py-10">
      <Skeleton className="h-5 w-28 mb-6 rounded" />

      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        {/* Top: image + name block */}
        <div className="flex flex-col sm:flex-row gap-6 p-6 md:p-8">
          <div className="sm:w-48 flex-shrink-0">
            <Skeleton className="w-full aspect-square rounded-2xl" />
          </div>
          <div className="flex-1 min-w-0 space-y-3">
            <Skeleton className="h-8 w-3/4 rounded" />
            <Skeleton className="h-5 w-1/2 rounded" />
            <Skeleton className="h-8 w-24 rounded" />
            <Skeleton className="h-12 w-40 rounded-xl mt-4" />
          </div>
        </div>

        {/* Info grid */}
        <div className="px-6 md:px-8 pb-6 md:pb-8 space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-3 items-start">
                <Skeleton className="w-9 h-9 rounded-lg flex-shrink-0" />
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-3 w-20 rounded" />
                  <Skeleton className="h-4 w-full rounded" />
                </div>
              </div>
            ))}
          </div>

          {/* About block */}
          <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 md:p-5">
            <div className="flex gap-3">
              <Skeleton className="w-9 h-9 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-14 rounded" />
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-4/5 rounded" />
              </div>
            </div>
          </div>

          {/* Clinic block */}
          <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 md:p-5 space-y-3">
            <div className="flex gap-3">
              <Skeleton className="w-9 h-9 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-14 rounded" />
                <Skeleton className="h-4 w-32 rounded" />
              </div>
            </div>
            <div className="flex gap-3 pl-12">
              <Skeleton className="w-5 h-5 rounded flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-2/3 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorProfileSkeleton;
