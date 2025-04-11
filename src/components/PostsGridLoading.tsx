export default function PostsGridLoading() {
  return (
    <div className="container mx-auto px-4 py-12 animate-pulse">
      {/* Header Skeleton */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <div className="h-10 w-64 bg-gray-200 rounded mb-4 mx-auto" />
        <div className="h-6 w-96 bg-gray-200 rounded mx-auto" />
      </div>

      {/* Posts Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200" />
            <div className="p-6">
              <div className="h-4 w-24 bg-gray-200 rounded mb-4" />
              <div className="h-6 bg-gray-200 rounded mb-4" />
              <div className="space-y-2 mb-4">
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
                <div className="h-4 bg-gray-200 rounded w-4/6" />
              </div>
              <div className="h-4 w-24 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}