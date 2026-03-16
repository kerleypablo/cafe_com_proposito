function PulseBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-2xl bg-primary/10 ${className}`} />
}

export default function AdminLoading() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <PulseBlock className="h-9 w-48" />
        <PulseBlock className="h-4 w-72 rounded-full" />
      </div>

      <div className="overflow-hidden rounded-2xl border border-primary/20 bg-card p-6">
        <div className="space-y-4">
          <PulseBlock className="h-6 w-56" />
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <PulseBlock key={index} className="h-20 w-full rounded-2xl" />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5 lg:gap-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="rounded-2xl border border-border bg-card p-4">
            <div className="space-y-3">
              <PulseBlock className="h-11 w-11 rounded-2xl" />
              <PulseBlock className="h-7 w-16" />
              <PulseBlock className="h-4 w-24 rounded-full" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="rounded-2xl border border-border bg-card p-6">
            <div className="space-y-4">
              <PulseBlock className="h-6 w-44" />
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((__, itemIndex) => (
                  <PulseBlock key={itemIndex} className="h-16 w-full rounded-2xl" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
