"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/app/components/data-table";
import { DataForm } from "@/app/components/data-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [searchField, setSearchField] = useState<"eventName" | "classification" | "athleteName">("eventName");
  const [sportEventFilter, setSportEventFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  const [classificationFilter, setClassificationFilter] = useState("all");

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        sortOrder: sortOrder,
      });

      // Add search filter
      if (searchValue) {
        params.set(searchField, searchValue);
      }

      // Add other filters (only if not "all")
      if (sportEventFilter !== "all") params.set("sportEvent", sportEventFilter);
      if (genderFilter !== "all") params.set("gender", genderFilter);
      if (classificationFilter !== "all") params.set("classification", classificationFilter);

      const response = await fetch(`/api/data?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError("Failed to fetch data. Please try again later.");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [sortOrder, searchValue, searchField, sportEventFilter, genderFilter, classificationFilter]);

  const handleSearchValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSearchFieldChange = (value: "eventName" | "classification" | "athleteName") => {
    setSearchField(value);
    setSearchValue(""); // Reset search value when changing field
  };

  const handleAddData = async (newData: DataItem) => {
    try {
      const response = await fetch("/api/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      fetchData();
    } catch (err) {
      setError("Failed to add data. Please try again.");
      console.error("Error adding data:", err);
    }
  };

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
          
          {/* Search Section */}
          <div className="mt-4 flex gap-2">
            <Select 
              value={searchField} 
              onValueChange={handleSearchFieldChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Search by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="eventName">Event Name</SelectItem>
                <SelectItem value="classification">Classification</SelectItem>
                <SelectItem value="athleteName">Athlete Name</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="text"
              placeholder={`Search by ${searchField.replace(/([A-Z])/g, ' $1').toLowerCase()}...`}
              value={searchValue}
              onChange={handleSearchValueChange}
              className="flex-1"
            />
          </div>

          {/* Filter Section */}
          <div className="mt-4 flex gap-2 flex-wrap">
            {/* Sport Event Filter */}
            <Select
              value={sportEventFilter}
              onValueChange={setSportEventFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sport Event" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="Football">Football</SelectItem>
                <SelectItem value="Athletics">Athletics</SelectItem>
                <SelectItem value="Swimming">Swimming</SelectItem>
              </SelectContent>
            </Select>

            {/* Gender Filter */}
            <Select
              value={genderFilter}
              onValueChange={setGenderFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genders</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>

            {/* Classification Filter */}
            <Select
              value={classificationFilter}
              onValueChange={setClassificationFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Classification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classifications</SelectItem>
                <SelectItem value="Track">Track</SelectItem>
                <SelectItem value="Field">Field</SelectItem>
                <SelectItem value="Marathon">Marathon</SelectItem>
              </SelectContent>
            </Select>
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
                <>
                  <div className="flex justify-end mb-2">
                    <button
                      onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                      className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      Sort by Value ({sortOrder === "asc" ? "Ascending" : "Descending"})
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