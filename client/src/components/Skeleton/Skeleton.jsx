/**
 * Base skeleton placeholder with shimmer animation.
 * Use for any rectangular placeholder (avatar, text line, etc.).
 */
function Skeleton({ className = "", style = {} }) {
  return (
    <div
      className={`bg-gray-200 rounded animate-pulse ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}

export default Skeleton;
