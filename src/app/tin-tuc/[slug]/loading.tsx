export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-8 animate-pulse">
        {/* Main content */}
        <div className="lg:w-3/4">
          <article className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Featured image skeleton */}
            <div className="relative h-[480px] w-full bg-gray-200" />
            
            <div className="p-8">
              {/* Post meta skeleton */}
              <div className="mb-6">
                <div className="h-5 w-48 bg-gray-200 rounded" />
              </div>
              
              {/* Post title skeleton */}
              <div className="h-10 w-3/4 bg-gray-200 rounded mb-6" />
              
              {/* Post content skeleton */}
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
                <div className="h-4 bg-gray-200 rounded w-4/6" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-4/6" />
              </div>
              
              {/* Tags skeleton */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="h-6 w-20 bg-gray-200 rounded mb-2" />
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-8 w-24 bg-gray-200 rounded-full" />
                  ))}
                </div>
              </div>
            </div>
          </article>
        </div>
        
        {/* Sidebar */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="h-6 w-40 bg-gray-200 rounded mb-4" />
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-5 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-24" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}