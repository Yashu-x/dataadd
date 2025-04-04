"use client"

import { useEffect, useState } from "react"
import { DataTable } from "@/app/components/data-table"
import { DataForm } from "@/app/components/data-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ReloadIcon } from "@radix-ui/react-icons"

interface DataItem {
  key: string
  value: string
  Name :string
}

export function DataDashboard() {
  const [data, setData] = useState<DataItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetch("http://localhost:3000/api/data")

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const result = await response.json()
      setData(result)
      setLastUpdated(new Date())
      setError(null)
    } catch (err) {
      setError("Failed to fetch data. Please try again later.")
      console.error("Error fetching data:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Initial fetch
    fetchData()

    // Set up interval for fetching data every minute
    const intervalId = setInterval(fetchData, 60000)

    // Clean up interval on component unmount
    return () => clearInterval(intervalId)
  }, [])

  const handleAddData = async (newData: DataItem) => {
    try {
      const response = await fetch("http://localhost:3000/api/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newData),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      // Refresh data after successful submission
      fetchData()
    } catch (err) {
      setError("Failed to add data. Please try again.")
      console.error("Error adding data:", err)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Data Overview</CardTitle>
              <CardDescription>
                {lastUpdated ? `Last updated: ${lastUpdated.toLocaleTimeString()}` : "Fetching data..."}
              </CardDescription>
            </div>
            <button
              onClick={fetchData}
              className="flex items-center text-sm text-muted-foreground hover:text-foreground"
              disabled={loading}
            >
              {loading ? <ReloadIcon className="mr-1 h-4 w-4 animate-spin" /> : <ReloadIcon className="mr-1 h-4 w-4" />}
              Refresh
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="table">
            <TabsList className="mb-4">
              <TabsTrigger value="table">Table View</TabsTrigger>
              <TabsTrigger value="add">Add Data</TabsTrigger>
            </TabsList>
            <TabsContent value="table">
              {error ? (
                <div className="text-red-500 p-4 rounded-md bg-red-50">{error}</div>
              ) : (
                <DataTable data={data} loading={loading} />
              )}
            </TabsContent>
            <TabsContent value="add">
              <DataForm onSubmit={handleAddData} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

