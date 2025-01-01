import { Header } from "@/components/header"
import { ImageGrid } from "@/components/imggrid"
import { Search } from "@/components/search"
import { OnboardingFlow } from "@/components/onboarding"
import { Suspense } from 'react'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<div>Loading header...</div>}>
        <Header />
      </Suspense>
      <main className="flex min-h-[calc(100vh-3.5rem)] flex-col">
        <Suspense fallback={<div>Loading search...</div>}>
          <div className="w-full mx-auto my-8 px-4 md:hidden">
            <Search />
          </div>
        </Suspense>
        <Suspense fallback={<div>Loading images...</div>}>
          <ImageGrid />
        </Suspense>
      </main>
      <Suspense fallback={<div>Loading onboarding...</div>}>
        <OnboardingFlow />
      </Suspense>
    </div>
  )
}
