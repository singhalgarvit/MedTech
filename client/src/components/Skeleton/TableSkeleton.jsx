import Skeleton from "./Skeleton";

/**
 * Table skeleton with header row and N body rows of M columns.
 * @param {number} rows - Number of body rows
 * @param {number} cols - Number of columns
 */
function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow">
      <table className="min-w-full divide-y divide-gray-200 bg-white">
        <thead className="bg-gray-50">
          <tr>
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i} className="px-4 py-3 text-left">
                <Skeleton className="h-4 w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: cols }).map((_, colIndex) => (
                <td key={colIndex} className="px-4 py-3">
                  <Skeleton
                    className="h-4"
                    style={{ width: colIndex === cols - 1 && cols > 3 ? "60px" : `${70 + (colIndex % 3) * 15}%` }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableSkeleton;
