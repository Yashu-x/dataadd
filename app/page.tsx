import { DataDashboard } from "@/app/components/data-dashboard"

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Data Dashboard</h1>
      <DataDashboard />
    </main>
  )
}

