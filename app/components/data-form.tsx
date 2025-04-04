"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { ReloadIcon } from "@radix-ui/react-icons"

interface DataItem {
  key: string
  value: string
  Name :string
}

interface DataFormProps {
  onSubmit: (data: DataItem) => Promise<void>
}

export function DataForm({ onSubmit }: DataFormProps) {
  const [key, setKey] = useState("")
  const [value, setValue] = useState("")
  const [Name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!key.trim() || !value.trim()) {
      setError("Both key and value are required")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {

      await onSubmit({ key, value , Name })
      // Reset form after successful submission
      setName("")
      setKey("")
      setValue("")
     
    } catch (err) {
      setError("Failed to submit data. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
            <Label htmlFor="Name">Name</Label>
            <Input
              id="Name"
              value={Name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Name"
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="key">Key</Label>
            <Input
              id="key"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Enter key"
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="value">Value</Label>
            <Input
              id="value"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter value"
              disabled={isSubmitting}
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Add Data"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

