export function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex justify-between items-center">
        <div className="h-8 bg-gray-700 rounded w-48 animate-pulse"></div>
        <div className="h-10 bg-gray-700 rounded w-32 animate-pulse"></div>
      </div>

      {/* Table skeleton */}
      <div className="bg-[#1a1a2e] rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#1f1f3a]">
                <th className="px-4 py-3"><div className="h-4 bg-gray-700 rounded w-16 animate-pulse"></div></th>
                <th className="px-4 py-3"><div className="h-4 bg-gray-700 rounded w-12 animate-pulse"></div></th>
                <th className="px-4 py-3"><div className="h-4 bg-gray-700 rounded w-16 animate-pulse"></div></th>
                <th className="px-4 py-3 text-right"><div className="h-4 bg-gray-700 rounded w-16 ml-auto animate-pulse"></div></th>
              </tr>
            </thead>
            <tbody>
              {Array(5).fill(0).map((_, index) => (
                <tr key={index} className="border-t border-gray-800">
                  <td className="px-4 py-3">
                    <div className="h-4 bg-gray-700 rounded w-32 animate-pulse"></div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 bg-gray-700 rounded w-24 animate-pulse"></div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 bg-gray-700 rounded w-8 animate-pulse"></div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="h-4 bg-gray-700 rounded w-16 ml-auto animate-pulse"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}