import Skeleton from "./Skeleton";

/** Skeleton for empty chat area while history loads (a few message bubbles). */
function ChatSkeleton() {
  return (
    <div className="space-y-3 p-4">
      <div className="flex justify-start">
        <Skeleton className="h-12 w-3/4 max-w-[75%] rounded-lg" />
      </div>
      <div className="flex justify-end">
        <Skeleton className="h-10 w-1/2 max-w-[75%] rounded-lg" />
      </div>
      <div className="flex justify-start">
        <Skeleton className="h-16 w-4/5 max-w-[75%] rounded-lg" />
      </div>
      <div className="flex justify-end">
        <Skeleton className="h-8 w-1/3 max-w-[75%] rounded-lg" />
      </div>
    </div>
  );
}

export default ChatSkeleton;
