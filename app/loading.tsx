function PulseBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-2xl bg-primary/10 ${className}`} />
}

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-background/90">
        <div className="container mx-auto flex h-20 items-center justify-between px-4">
          <PulseBlock className="h-12 w-24 rounded-full" />
          <div className="hidden gap-4 md:flex">
            <PulseBlock className="h-8 w-20 rounded-full" />
            <PulseBlock className="h-8 w-20 rounded-full" />
            <PulseBlock className="h-8 w-20 rounded-full" />
          </div>
        </div>
      </div>

      <main className="space-y-12">
        <section className="relative overflow-hidden px-4 py-10 md:px-8 md:py-14">
          <div className="mx-auto grid min-h-[60vh] max-w-7xl gap-8 lg:grid-cols-[0.9fr_0.72fr] lg:items-end">
            <div className="space-y-5">
              <PulseBlock className="h-4 w-36 rounded-full" />
              <PulseBlock className="h-12 w-full max-w-xl" />
              <PulseBlock className="h-12 w-11/12 max-w-lg" />
              <PulseBlock className="h-5 w-full max-w-2xl" />
              <PulseBlock className="h-5 w-10/12 max-w-xl" />
              <div className="flex gap-3 pt-3">
                <PulseBlock className="h-11 w-44 rounded-full" />
                <PulseBlock className="h-11 w-40 rounded-full" />
              </div>
            </div>

            <div className="rounded-[2rem] border border-border/60 bg-card/70 p-5">
              <div className="space-y-4">
                <PulseBlock className="h-4 w-32 rounded-full" />
                <PulseBlock className="h-8 w-3/4" />
                <PulseBlock className="h-4 w-full" />
                <PulseBlock className="h-4 w-11/12" />
                <PulseBlock className="h-12 w-full rounded-2xl" />
                <PulseBlock className="h-11 w-full rounded-full" />
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-16 md:px-8">
          <div className="mx-auto max-w-7xl space-y-10">
            <div className="space-y-3 text-center">
              <PulseBlock className="mx-auto h-4 w-24 rounded-full" />
              <PulseBlock className="mx-auto h-8 w-80" />
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-[1.6rem] border border-border/60 bg-card p-4"
                >
                  <PulseBlock className="h-44 w-full rounded-[1.2rem]" />
                  <div className="mt-4 space-y-3">
                    <PulseBlock className="h-6 w-3/4" />
                    <PulseBlock className="h-4 w-full" />
                    <PulseBlock className="h-4 w-5/6" />
                    <PulseBlock className="h-10 w-32 rounded-full" />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid gap-8 rounded-[2.4rem] bg-card/60 p-6 lg:grid-cols-[1fr_1.15fr] lg:p-8">
              <div className="space-y-4">
                <PulseBlock className="h-4 w-28 rounded-full" />
                <PulseBlock className="h-8 w-72" />
                <PulseBlock className="h-4 w-full max-w-lg" />
                <PulseBlock className="h-4 w-10/12 max-w-md" />
              </div>
              <div className="rounded-[2rem] border border-border/60 bg-background/80 p-6">
                <div className="space-y-3">
                  <PulseBlock className="h-10 w-full rounded-xl" />
                  <PulseBlock className="h-28 w-full rounded-2xl" />
                  <PulseBlock className="h-10 w-40 rounded-full" />
                </div>
              </div>
            </div>

            <div className="rounded-[2.4rem] bg-card/60 px-4 py-10 md:px-8">
              <div className="space-y-4">
                <PulseBlock className="mx-auto h-4 w-36 rounded-full" />
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-5">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <PulseBlock key={index} className="h-16 w-full rounded-2xl" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
