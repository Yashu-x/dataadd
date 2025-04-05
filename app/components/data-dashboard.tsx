

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
  key: string;
  value: string;
  Name: string;
  classification: string;
}

export function DataDashboard() {
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchValue, setSearchValue] = useState("");
  const [searchField, setSearchField] = useState<"Name" | "classification" | "key">("Name");

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/data?sortOrder=${sortOrder}&searchField=${searchField}&searchValue=${searchValue}`
      );

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
  }, [sortOrder, searchField, searchValue]);

  const handleSearchValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSearchFieldChange = (value: "Name" | "classification" | "key") => {
    setSearchField(value);
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
          <div className="mt-4 flex gap-2">
            <Select 
              value={searchField} 
              onValueChange={handleSearchFieldChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Search by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Name">Event Name</SelectItem>
                <SelectItem value="classification">Classification</SelectItem>
                <SelectItem value="key">Player Name</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="text"
              placeholder={`Search by ${searchField.toLowerCase()}...`}
              value={searchValue}
              onChange={handleSearchValueChange}
              className="flex-1"
            />
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