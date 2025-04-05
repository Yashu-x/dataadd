"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

interface DataItem {
  sportEvent: string
  eventName: string
  classification: string
  gender: string
  athleteName: string
  value: number
  unit: string
}

interface DataTableProps {
  data: DataItem[]
  loading: boolean
}

export function DataTable({ data, loading }: DataTableProps) {
  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    )
  }

  if (data.length === 0) {
    return <div className="text-center py-10 text-muted-foreground">No records found</div>
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Sport Event</TableHead>
            <TableHead>Event Name</TableHead>
            <TableHead>Classification</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Athlete</TableHead>
            <TableHead className="text-right">Time (s)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{item.sportEvent}</TableCell>
              <TableCell>{item.eventName}</TableCell>
              <TableCell>{item.classification}</TableCell>
              <TableCell>{item.gender}</TableCell>
              <TableCell>{item.athleteName}</TableCell>
              <TableCell className="text-right">{item.value.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}