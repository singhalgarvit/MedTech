import Skeleton from "./Skeleton";

/** Skeleton that matches DoctorCard layout: image, name, specialization, fee. */
function DoctorCardSkeleton() {
  return (
    <div className="border w-[300px] p-4 rounded-lg shadow-md flex flex-col items-center gap-2">
      <Skeleton className="w-[90%] h-60 rounded-md" />
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-4 w-36" />
    </div>
  );
}

export default DoctorCardSkeleton;
