export default function ProjectLoading() {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      <div className="max-w-5xl mx-auto px-6 pt-24 pb-12">
        <div className="h-4 w-32 bg-card-bg rounded mb-8" />
        <div className="h-6 w-24 bg-card-bg rounded-full mb-6" />
        <div className="h-12 w-3/4 bg-card-bg rounded mb-4" />
        <div className="h-4 w-2/3 bg-card-bg rounded mb-2" />
        <div className="h-4 w-1/2 bg-card-bg rounded" />
      </div>
      <div className="max-w-5xl mx-auto px-6 pb-12">
        <div className="aspect-[16/9] bg-card-bg rounded-2xl" />
      </div>
    </div>
  )
}
