
"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/app/components/data-table";
import { DataForm } from "@/app/components/data-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DataItem {
  sportEvent: string;
  eventName: string;
  classification: string;
  gender: string;
  athleteName: string;
  value: number;
  unit: string;
}

export function DataDashboard() {
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  
  // Search and Filter States
  const [searchValue, setSearchValue] = useState("");
  const [searchField, setSearchField] = useState<keyof DataItem>("sportEvent");
  const [filters, setFilters] = useState({
    sportEvent: "all",
    eventName: "all",
    athleteName: "all",
    classification: "all",
    gender: "all"
  });

  // Filter Options
  const [filterOptions, setFilterOptions] = useState<Record<string, string[]>>({
    sportEvent: [],
    eventName: [],
    athleteName: [],
    classification: [],
    gender: ['male', 'female']
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ sortOrder });

      // Handle search
      if (searchValue) {
        params.set(searchField, searchValue);
      }

      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== "all") params.set(key, value);
      });

      const response = await fetch(`/api/data?${params.toString()}`);
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      setData(await response.json());
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError("Failed to fetch data. Please try again later.");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilterOptions = async (field: keyof DataItem) => {
    try {
      const response = await fetch(`/api/data?type=filter-options&field=${field}`);
      if (!response.ok) throw new Error("Options fetch failed");
      const options = await response.json();
      setFilterOptions(prev => ({ ...prev, [field]: options }));
    } catch (err) {
      console.error(`Failed to fetch ${field} options:`, err);
    }
  };

  useEffect(() => {
    fetchData();
    // Fetch initial filter options
    (async () => {
      await Promise.all([
        fetchFilterOptions('sportEvent'),
        fetchFilterOptions('eventName'),
        fetchFilterOptions('athleteName'),
        fetchFilterOptions('classification')
      ]);
    })();
  }, [sortOrder, searchValue, searchField, filters]);

  const handleFilterChange = (field: keyof DataItem, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleAddData = async (newData: DataItem) => {
    try {
      const response = await fetch("/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData)
      });
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      await fetchData();
      // Refresh relevant filter options
      fetchFilterOptions('sportEvent');
      fetchFilterOptions('eventName');
      fetchFilterOptions('athleteName');
      fetchFilterOptions('classification');
    } catch (err) {
      setError("Failed to add data. Please try again.");
      console.error("Add error:", err);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Sports Performance Data</CardTitle>
              <CardDescription>
                {lastUpdated ? `Last updated: ${lastUpdated.toLocaleString()}` : "Loading..."}
              </CardDescription>
            </div>
            <button
              onClick={fetchData}
              className="flex items-center text-sm hover:text-primary transition-colors"
              disabled={loading}
            >
              <ReloadIcon className={`mr-1 h-4 w-4 ${loading && "animate-spin"}`} />
              Refresh
            </button>
          </div>

          {/* Search Section */}
          <div className="mt-4 flex gap-2">
            <Select value={searchField} onValueChange={(v: keyof DataItem) => setSearchField(v)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Search by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sportEvent">Sport Event</SelectItem>
                <SelectItem value="eventName">Event Name</SelectItem>
                <SelectItem value="classification">Classification</SelectItem>
                <SelectItem value="athleteName">Athlete Name</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder={`Search ${searchField.replace(/([A-Z])/g, ' $1').toLowerCase()}...`}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="flex-1"
            />
          </div>

          {/* Filter Section */}
          <div className="mt-4 flex flex-wrap gap-2">
            {Object.entries(filters).map(([field, value]) => (
              <Select
                key={field}
                value={value}
                onValueChange={(v) => handleFilterChange(field as keyof DataItem, v)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={field.replace(/([A-Z])/g, ' $1')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All {field.replace(/([A-Z])/g, ' $1').toLowerCase()}</SelectItem>
                  {filterOptions[field as keyof DataItem]?.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="table">
            <TabsList className="mb-4">
              <TabsTrigger value="table">View Data</TabsTrigger>
              <TabsTrigger value="add">Add New Record</TabsTrigger>
            </TabsList>

            <TabsContent value="table">
              {error ? (
                <div className="text-destructive p-4 rounded-md bg-destructive/10">{error}</div>
              ) : (
                <>
                  <div className="flex justify-end mb-2">
                    <button
                      onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
                      className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                    >
                      Sort: {sortOrder === "asc" ? "↑ Ascending" : "↓ Descending"}
                    </button>
                  </div>
                  <DataTable data={data} loading={loading} />
                </>
              )}
            </TabsContent>

            <TabsContent value="add">
              <DataForm onSubmit={handleAddData} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}