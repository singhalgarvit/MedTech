import Skeleton from "./Skeleton";

const statCardClass =
  "rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow";

/** Skeleton that matches AdminHome stat cards grid (7 cards). */
function AdminHomeSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {[...Array(7)].map((_, i) => (
        <div key={i} className={statCardClass}>
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-2 h-8 w-16" />
        </div>
      ))}
    </div>
  );
}

export default AdminHomeSkeleton;
