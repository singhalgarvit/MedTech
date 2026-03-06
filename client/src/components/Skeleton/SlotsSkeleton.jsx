import Skeleton from "./Skeleton";

/** Skeleton for time slots area in BookAppointmentModal. */
function SlotsSkeleton() {
  return (
    <div className="mb-4 max-h-[220px] overflow-hidden rounded-lg border border-gray-200 bg-gray-50/50 p-3 space-y-3">
      <Skeleton className="h-3 w-24" />
      <div className="flex flex-wrap gap-1.5">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Skeleton key={i} className="h-8 w-14 rounded-md" />
        ))}
      </div>
      <Skeleton className="h-3 w-24 mt-2" />
      <div className="flex flex-wrap gap-1.5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-8 w-14 rounded-md" />
        ))}
      </div>
    </div>
  );
}

export default SlotsSkeleton;
