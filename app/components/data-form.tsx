// "use client"

// import type React from "react"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent } from "@/components/ui/card"
// import { ReloadIcon } from "@radix-ui/react-icons"

// interface DataItem {
//   key: string
//   value: string
//   Name :string
//   clasification:string
// }

// interface DataFormProps {
//   onSubmit: (data: DataItem) => Promise<void>
// }

// export function DataForm({ onSubmit }: DataFormProps) {
//   const [key, setKey] = useState("")
//   const [value, setValue] = useState("")
//   const [Name, setName] = useState("")
//   const [clasification, setClasification] = useState("")
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [error, setError] = useState<string | null>(null)

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     // Basic validation
//     if (!key.trim() || !value.trim()) {
//       setError("Both key and value are required")
//       return
//     }

//     setIsSubmitting(true)
//     setError(null)

//     try {

//       await onSubmit({ key, value , Name , clasification})
//       // Reset form after successful submission
//       setName("")
//       setKey("")
//       setValue("")
//       setClasification("")
     
//     } catch (err) {
//       setError("Failed to submit data. Please try again.")
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   return (
//     <Card>
//       <CardContent className="pt-6">
//         <form onSubmit={handleSubmit} className="space-y-4">
//         <div className="space-y-2">
//             <Label htmlFor="Name">Event Name</Label>
//             <Input
//               id="Name"
//               value={Name}
//               onChange={(e) => setName(e.target.value)}
//               placeholder="Enter Name"
//               disabled={isSubmitting}
//             />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="clasification">Classification</Label>
//             <Input
//               id="clasification"
//               value={clasification}
//               onChange={(e) => setClasification(e.target.value)}
//               placeholder="Enter clasification"
//               disabled={isSubmitting}
//             />
//             </div>
          
//           <div className="space-y-2">
//             <Label htmlFor="key">player Name</Label>
//             <Input
//               id="key"
//               value={key}
//               onChange={(e) => setKey(e.target.value)}
//               placeholder="Enter player name"
//               disabled={isSubmitting}
//             />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="value">Performence</Label>
//             <Input
//               id="value"
//               value={value}
//               onChange={(e) => setValue(e.target.value)}
//               placeholder="Enter value"
//               disabled={isSubmitting}
//             />
//           </div>
//           {error && <div className="text-red-500 text-sm">{error}</div>}
//           <Button type="submit" disabled={isSubmitting} className="w-full">
//             {isSubmitting ? (
//               <>
//                 <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
//                 Submitting...
//               </>
//             ) : (
//               "Add Data"
//             )}
//           </Button>
//         </form>
//       </CardContent>
//     </Card>
//   )
// }

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { ReloadIcon } from "@radix-ui/react-icons"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
// import { DataItem } from "@/types/data"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"


interface DataItem {
  key: string
  value: string
  Name: string
  classification: string
}

interface DataFormProps {
  onSubmit: (data: DataItem) => Promise<void>
}
const predefinedNames = ["Event 1", "Event 2", "Event 3", "Tournament", "Match"]
const predefinedClassifications = ["Sports", "Academic", "Cultural", "Professional"]
const predefinedPlayers = ["Player 1", "Player 2", "Player 3", "Team A", "Team B"]

export function DataForm({ onSubmit }: DataFormProps) {
  const [formData, setFormData] = useState<Omit<DataItem, 'unit'>>({
    Name: "",
    classification: "",
    key: "",
    value: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  
  // State for dropdown open/close
  const [openName, setOpenName] = useState(false)
  const [openClassification, setOpenClassification] = useState(false)
  const [openPlayer, setOpenPlayer] = useState(false)

  // Load saved options from localStorage
  const [nameOptions, setNameOptions] = useState<string[]>(predefinedNames)
  const [classificationOptions, setClassificationOptions] = useState<string[]>(predefinedClassifications)
  const [playerOptions, setPlayerOptions] = useState<string[]>(predefinedPlayers)

  useEffect(() => {
    const savedNames = JSON.parse(localStorage.getItem('nameOptions') || '[]')
    const savedClassifications = JSON.parse(localStorage.getItem('classificationOptions') || '[]')
    const savedPlayers = JSON.parse(localStorage.getItem('playerOptions') || '[]')
    
    setNameOptions([...new Set([...predefinedNames, ...savedNames])])
    setClassificationOptions([...new Set([...predefinedClassifications, ...savedClassifications])])
    setPlayerOptions([...new Set([...predefinedPlayers, ...savedPlayers])])
    
    const lastSelected = JSON.parse(localStorage.getItem('lastSelected') || '{}')
    setFormData(prev => ({
      ...prev,
      Name: lastSelected.Name || "",
      classification: lastSelected.classification || "",
      key: lastSelected.key || ""
    }))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.Name || !formData.classification || !formData.key || !formData.value) {
      setError("All fields are required")
      return
    }

    setIsSubmitting(true)

    try {
      await onSubmit({
        ...formData,
        value: formData.value.toString() // Convert to string for the form
      })

      // Update options with new values if they don't exist
      const updates = {
        names: formData.Name && !nameOptions.includes(formData.Name) ? [...nameOptions, formData.Name] : nameOptions,
        classifications: formData.classification && !classificationOptions.includes(formData.classification) 
          ? [...classificationOptions, formData.classification] 
          : classificationOptions,
        players: formData.key && !playerOptions.includes(formData.key) ? [...playerOptions, formData.key] : playerOptions
      }

      setNameOptions(updates.names)
      setClassificationOptions(updates.classifications)
      setPlayerOptions(updates.players)

      localStorage.setItem('nameOptions', JSON.stringify(updates.names))
      localStorage.setItem('classificationOptions', JSON.stringify(updates.classifications))
      localStorage.setItem('playerOptions', JSON.stringify(updates.players))
      localStorage.setItem('lastSelected', JSON.stringify({
        Name: formData.Name,
        classification: formData.classification,
        key: formData.key
      }))

      // Reset only the performance value
      setFormData(prev => ({ ...prev, value: "" }))
    } catch (err: any) {
      setError(err.message || "Failed to submit data. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Event Name Dropdown */}
          <div className="space-y-2">
            <Label>Event Name</Label>
            <Popover open={openName} onOpenChange={setOpenName}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openName}
                  className="w-full justify-between"
                >
                  {formData.Name || "Select event..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput 
                    placeholder="Search event..." 
                    onValueChange={(value) => {
                      if (value && !nameOptions.includes(value)) {
                        setNameOptions([...nameOptions, value])
                      }
                    }}
                  />
                  <CommandEmpty>No event found.</CommandEmpty>
                  <CommandGroup className="max-h-60 overflow-y-auto">
                    {nameOptions.map((name) => (
                      <CommandItem
                        key={name}
                        value={name}
                        onSelect={(currentValue) => {
                          setFormData({...formData, Name: currentValue})
                          setOpenName(false)
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            formData.Name === name ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Classification Dropdown */}
          <div className="space-y-2">
            <Label>Classification</Label>
            <Popover open={openClassification} onOpenChange={setOpenClassification}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openClassification}
                  className="w-full justify-between"
                >
                  {formData.classification || "Select classification..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput 
                    placeholder="Search classification..." 
                    onValueChange={(value) => {
                      if (value && !classificationOptions.includes(value)) {
                        setClassificationOptions([...classificationOptions, value])
                      }
                    }}
                  />
                  <CommandEmpty>No classification found.</CommandEmpty>
                  <CommandGroup className="max-h-60 overflow-y-auto">
                    {classificationOptions.map((classification) => (
                      <CommandItem
                        key={classification}
                        value={classification}
                        onSelect={(currentValue) => {
                          setFormData({...formData, classification: currentValue})
                          setOpenClassification(false)
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            formData.classification === classification ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {classification}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Player Name Dropdown */}
          <div className="space-y-2">
            <Label>Player Name</Label>
            <Popover open={openPlayer} onOpenChange={setOpenPlayer}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openPlayer}
                  className="w-full justify-between"
                >
                  {formData.key || "Select player..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput 
                    placeholder="Search player..." 
                    onValueChange={(value) => {
                      if (value && !playerOptions.includes(value)) {
                        setPlayerOptions([...playerOptions, value])
                      }
                    }}
                  />
                  <CommandEmpty>No player found.</CommandEmpty>
                  <CommandGroup className="max-h-60 overflow-y-auto">
                    {playerOptions.map((player) => (
                      <CommandItem
                        key={player}
                        value={player}
                        onSelect={(currentValue) => {
                          setFormData({...formData, key: currentValue})
                          setOpenPlayer(false)
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            formData.key === player ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {player}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Performance Input */}
          <div className="space-y-2">
            <Label htmlFor="value">Performance</Label>
            <Input
              id="value"
              value={formData.value}
              onChange={(e) => setFormData({...formData, value: e.target.value})}
              placeholder="Enter value "
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