// "use client"

// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent } from "@/components/ui/card"
// import { ReloadIcon } from "@radix-ui/react-icons"
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
// } from "@/components/ui/command"
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover"
// import { Check, ChevronsUpDown } from "lucide-react"
// import { cn } from "@/lib/utils"

// interface DataItem {
//   sportEvent: string
//   eventName: string
//   classification: string
//   gender: string
//   athleteName: string
//   value: string
// }

// interface DataFormProps {
//   onSubmit: (data: DataItem) => Promise<void>
// }

// const predefinedEvents = ["100m", "200m", "400m", "800m"]
// const predefinedEventNames = ["U17.1", "U17.2", "U17.3", "U17.4", "U17.5","U17.6", "U17.7", "U17.8", "U17.9", "U17.10","U17.11", "U17.12", "U17.13","U20.1", "U20.2","U20.3", "U20.4", "U20.5", "U20.6", "U20.7","U20.8", "U20.9", "U20.10", "U20.11", "U20.12","U20.13"]
// const predefinedClassifications = ["Track", "Field", "Marathon", "Relay"]
// const predefinedGenders = ["male", "female"]
// const predefinedAthletes = ["Usain Bolt", "Elaine Thompson", "Wayde van Niekerk", "Faith Kipyegon"]

// export function DataForm({ onSubmit }: DataFormProps) {
//   // Load saved selections from localStorage or use empty defaults
//   const loadSavedSelections = () => {
//     const saved = localStorage.getItem('formSelections');
//     return saved ? JSON.parse(saved) : {
//       sportEvent: "",
//       eventName: "",
//       classification: "",
//       gender: "",
//       athleteName: "",
//       value: ""
//     };
//   };

//   const [formData, setFormData] = useState<DataItem>(loadSavedSelections());
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);
  
//   // Dropdown states
//   const [openSportEvent, setOpenSportEvent] = useState(false);
//   const [openEventName, setOpenEventName] = useState(false);
//   const [openClassification, setOpenClassification] = useState(false);
//   const [openGender, setOpenGender] = useState(false);
//   const [openAthlete, setOpenAthlete] = useState(false);

//   // Options with localStorage persistence
//   const [sportEventOptions, setSportEventOptions] = useState<string[]>(predefinedEvents);
//   const [eventNameOptions, setEventNameOptions] = useState<string[]>(predefinedEventNames);
//   const [classificationOptions, setClassificationOptions] = useState<string[]>(predefinedClassifications);
//   const [genderOptions, setGenderOptions] = useState<string[]>(predefinedGenders);
//   const [athleteOptions, setAthleteOptions] = useState<string[]>(predefinedAthletes);

//   // Save selections whenever they change
//   useEffect(() => {
//     localStorage.setItem('formSelections', JSON.stringify(formData));
//   }, [formData]);

//   // Load saved options from localStorage on mount
//   useEffect(() => {
//     const loadOptions = () => {
//       const savedOptions = {
//         sportEvents: JSON.parse(localStorage.getItem('sportEventOptions') || '[]'),
//         eventNames: JSON.parse(localStorage.getItem('eventNameOptions') || '[]'),
//         classifications: JSON.parse(localStorage.getItem('classificationOptions') || '[]'),
//         athletes: JSON.parse(localStorage.getItem('athleteOptions') || '[]')
//       };
      
//       setSportEventOptions([...new Set([...predefinedEvents, ...savedOptions.sportEvents])]);
//       setEventNameOptions([...new Set([...predefinedEventNames, ...savedOptions.eventNames])]);
//       setClassificationOptions([...new Set([...predefinedClassifications, ...savedOptions.classifications])]);
//       setAthleteOptions([...new Set([...predefinedAthletes, ...savedOptions.athletes])]);
//     };
    
//     loadOptions();
//   }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);

//     // Validate all fields
//     if (!formData.sportEvent || !formData.eventName || !formData.classification || 
//         !formData.gender || !formData.athleteName || !formData.value) {
//       setError("All fields are required");
//       return;
//     }

//     // Validate numeric value
//     if (!/^\d*\.?\d+$/.test(formData.value)) {
//       setError("Please enter a valid number (e.g. 9.58)");
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       await onSubmit(formData);

//       // Update options with new values if they don't exist
//       const updates = {
//         sportEvents: formData.sportEvent && !sportEventOptions.includes(formData.sportEvent) ? 
//           [...sportEventOptions, formData.sportEvent] : sportEventOptions,
//         eventNames: formData.eventName && !eventNameOptions.includes(formData.eventName) ? 
//           [...eventNameOptions, formData.eventName] : eventNameOptions,
//         classifications: formData.classification && !classificationOptions.includes(formData.classification) ? 
//           [...classificationOptions, formData.classification] : classificationOptions,
//         athletes: formData.athleteName && !athleteOptions.includes(formData.athleteName) ? 
//           [...athleteOptions, formData.athleteName] : athleteOptions
//       };

//       // Update state and localStorage
//       setSportEventOptions(updates.sportEvents);
//       setEventNameOptions(updates.eventNames);
//       setClassificationOptions(updates.classifications);
//       setAthleteOptions(updates.athletes);

//       localStorage.setItem('sportEventOptions', JSON.stringify(updates.sportEvents));
//       localStorage.setItem('eventNameOptions', JSON.stringify(updates.eventNames));
//       localStorage.setItem('classificationOptions', JSON.stringify(updates.classifications));
//       localStorage.setItem('athleteOptions', JSON.stringify(updates.athletes));

//       // Reset only the value field while keeping other selections
//       setFormData(prev => ({ ...prev, value: "" }));
//     } catch (err: any) {
//       setError(err.message || "Failed to submit data. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Reusable dropdown component
//   const renderDropdown = (
//     label: string,
//     value: string,
//     options: string[],
//     open: boolean,
//     setOpen: (val: boolean) => void,
//     fieldName: keyof DataItem
//   ) => (
//     <div className="space-y-2">
//       <Label>{label}</Label>
//       <Popover open={open} onOpenChange={setOpen}>
//         <PopoverTrigger asChild>
//           <Button
//             variant="outline"
//             role="combobox"
//             aria-expanded={open}
//             className="w-full justify-between"
//           >
//             {value || `Select ${label.toLowerCase()}...`}
//             <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent className="w-full p-0">
//           <Command>
//             <CommandInput placeholder={`Search ${label.toLowerCase()}...`} />
//             <CommandEmpty>No results found.</CommandEmpty>
//             <CommandGroup className="max-h-60 overflow-y-auto">
//               {options.map((option) => (
//                 <CommandItem
//                   key={option}
//                   value={option}
//                   onSelect={(currentValue) => {
//                     setFormData({...formData, [fieldName]: currentValue});
//                     setOpen(false);
//                   }}
//                 >
//                   <Check
//                     className={cn(
//                       "mr-2 h-4 w-4",
//                       value === option ? "opacity-100" : "opacity-0"
//                     )}
//                   />
//                   {option}
//                 </CommandItem>
//               ))}
//             </CommandGroup>
//           </Command>
//         </PopoverContent>
//       </Popover>
//     </div>
//   );

//   return (
//     <Card>
//       <CardContent className="pt-6">
//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Sport Event Dropdown */}
//           {renderDropdown(
//             "Sport Event",
//             formData.sportEvent,
//             sportEventOptions,
//             openSportEvent,
//             setOpenSportEvent,
//             "sportEvent"
//           )}

//           {/* Event Name Dropdown */}
//           {renderDropdown(
//             "Event Name",
//             formData.eventName,
//             eventNameOptions,
//             openEventName,
//             setOpenEventName,
//             "eventName"
//           )}

//           {/* Classification Dropdown */}
//           {renderDropdown(
//             "Classification",
//             formData.classification,
//             classificationOptions,
//             openClassification,
//             setOpenClassification,
//             "classification"
//           )}
//            {/* Athlete Name Dropdown */}
//            {renderDropdown(
//             "Athlete Name",
//             formData.athleteName,
//             athleteOptions,
//             openAthlete,
//             setOpenAthlete,
//             "athleteName"
//           )}

//           {/* Gender Dropdown */}
//           {renderDropdown(
//             "Gender",
//             formData.gender,
//             genderOptions,
//             openGender,
//             setOpenGender,
//             "gender"
//           )}

         

//           {/* Performance Input */}
//           <div className="space-y-2">
//             <Label htmlFor="value">Performance</Label>
//             <Input
//               id="value"
//               value={formData.value}
//               onChange={(e) => {
//                 if (/^\d*\.?\d*$/.test(e.target.value)) {
//                   setFormData({...formData, value: e.target.value});
//                 }
//               }}
//               placeholder="Enter performance "
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
//               "Add Record"
//             )}
//           </Button>
//         </form>
//       </CardContent>
//     </Card>
//   );
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
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface DataItem {
  sportEvent: string
  eventName: string
  classification: string
  gender: string
  athleteName: string
  value: string
}

interface DataFormProps {
  onSubmit: (data: DataItem) => Promise<void>
}

const predefinedEvents = ["100m", "200m", "400m", "800m"]
const predefinedEventNames = ["U17.1", "U17.2", "U17.3", "U17.4", "U17.5","U17.6", "U17.7", "U17.8", "U17.9", "U17.10","U17.11", "U17.12", "U17.13","U20.1", "U20.2","U20.3", "U20.4", "U20.5", "U20.6", "U20.7","U20.8", "U20.9", "U20.10", "U20.11", "U20.12","U20.13"]
const predefinedClassifications = ["Track", "Field", "Marathon", "Relay"]
const predefinedGenders = ["male", "female"]
const predefinedAthletes = ["Usain Bolt", "Elaine Thompson", "Wayde van Niekerk", "Faith Kipyegon"]

export function DataForm({ onSubmit }: DataFormProps) {
  // Load saved selections from localStorage or use empty defaults
  const loadSavedSelections = () => {
    const saved = localStorage.getItem('formSelections');
    return saved ? JSON.parse(saved) : {
      sportEvent: "",
      eventName: "",
      classification: "",
      gender: "",
      athleteName: "",
      value: ""
    };
  };

  const [formData, setFormData] = useState<DataItem>(loadSavedSelections());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFetchingGender, setIsFetchingGender] = useState(false);
  const [autoFilledGender, setAutoFilledGender] = useState(false);
  
  // Dropdown states
  const [openSportEvent, setOpenSportEvent] = useState(false);
  const [openEventName, setOpenEventName] = useState(false);
  const [openClassification, setOpenClassification] = useState(false);
  const [openGender, setOpenGender] = useState(false);
  const [openAthlete, setOpenAthlete] = useState(false);

  // Options with localStorage persistence
  const [sportEventOptions, setSportEventOptions] = useState<string[]>(predefinedEvents);
  const [eventNameOptions, setEventNameOptions] = useState<string[]>(predefinedEventNames);
  const [classificationOptions, setClassificationOptions] = useState<string[]>(predefinedClassifications);
  const [genderOptions, setGenderOptions] = useState<string[]>(predefinedGenders);
  const [athleteOptions, setAthleteOptions] = useState<string[]>(predefinedAthletes);

  // Save selections whenever they change
  useEffect(() => {
    localStorage.setItem('formSelections', JSON.stringify(formData));
  }, [formData]);

  // Load saved options from localStorage on mount
  useEffect(() => {
    const loadOptions = () => {
      const savedOptions = {
        sportEvents: JSON.parse(localStorage.getItem('sportEventOptions') || '[]'),
        eventNames: JSON.parse(localStorage.getItem('eventNameOptions') || '[]'),
        classifications: JSON.parse(localStorage.getItem('classificationOptions') || '[]'),
        athletes: JSON.parse(localStorage.getItem('athleteOptions') || '[]')
      };
      
      setSportEventOptions([...new Set([...predefinedEvents, ...savedOptions.sportEvents])]);
      setEventNameOptions([...new Set([...predefinedEventNames, ...savedOptions.eventNames])]);
      setClassificationOptions([...new Set([...predefinedClassifications, ...savedOptions.classifications])]);
      setAthleteOptions([...new Set([...predefinedAthletes, ...savedOptions.athletes])]);
    };
    
    loadOptions();
  }, []);

  // Auto-fill gender when athlete selection changes
  useEffect(() => {
    const fetchGenderForAthlete = async () => {
      if (formData.athleteName) {
        setIsFetchingGender(true);
        setAutoFilledGender(false);
        try {
          const response = await fetch(`/api/data?type=athlete-gender&name=${encodeURIComponent(formData.athleteName)}`);
          if (response.ok) {
            const { gender } = await response.json();
            if (gender) {
              setFormData(prev => ({ ...prev, gender }));
              setAutoFilledGender(true);
            }
          }
        } catch (error) {
          console.error("Error fetching gender:", error);
        } finally {
          setIsFetchingGender(false);
        }
      }
    };

    fetchGenderForAthlete();
  }, [formData.athleteName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate all fields
    if (!formData.sportEvent || !formData.eventName || !formData.classification || 
        !formData.gender || !formData.athleteName || !formData.value) {
      setError("All fields are required");
      return;
    }

    // Validate numeric value
    if (!/^\d*\.?\d+$/.test(formData.value)) {
      setError("Please enter a valid number (e.g. 9.58)");
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        ...formData,
        gender: formData.gender.toLowerCase() // Ensure consistent casing
      });

      // Update options with new values if they don't exist
      const updates = {
        sportEvents: formData.sportEvent && !sportEventOptions.includes(formData.sportEvent) ? 
          [...sportEventOptions, formData.sportEvent] : sportEventOptions,
        eventNames: formData.eventName && !eventNameOptions.includes(formData.eventName) ? 
          [...eventNameOptions, formData.eventName] : eventNameOptions,
        classifications: formData.classification && !classificationOptions.includes(formData.classification) ? 
          [...classificationOptions, formData.classification] : classificationOptions,
        athletes: formData.athleteName && !athleteOptions.includes(formData.athleteName) ? 
          [...athleteOptions, formData.athleteName] : athleteOptions
      };

      // Update state and localStorage
      setSportEventOptions(updates.sportEvents);
      setEventNameOptions(updates.eventNames);
      setClassificationOptions(updates.classifications);
      setAthleteOptions(updates.athletes);

      localStorage.setItem('sportEventOptions', JSON.stringify(updates.sportEvents));
      localStorage.setItem('eventNameOptions', JSON.stringify(updates.eventNames));
      localStorage.setItem('classificationOptions', JSON.stringify(updates.classifications));
      localStorage.setItem('athleteOptions', JSON.stringify(updates.athletes));

      // Reset only the value field while keeping other selections
      setFormData(prev => ({ ...prev, value: "" }));
      setAutoFilledGender(false);
    } catch (err: any) {
      setError(err.message || "Failed to submit data. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Enhanced dropdown component with auto-fill indicator
  const renderDropdown = (
    label: string,
    value: string,
    options: string[],
    open: boolean,
    setOpen: (val: boolean) => void,
    fieldName: keyof DataItem
  ) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        {fieldName === 'gender' && autoFilledGender && (
          <span className="text-xs text-muted-foreground">Auto-filled</span>
        )}
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={isSubmitting}
          >
            {value || `Select ${label.toLowerCase()}...`}
            {fieldName === 'athleteName' && isFetchingGender ? (
              <ReloadIcon className="ml-2 h-4 w-4 animate-spin" />
            ) : (
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder={`Search ${label.toLowerCase()}...`} />
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup className="max-h-60 overflow-y-auto">
              {options.map((option) => (
                <CommandItem
                  key={option}
                  value={option}
                  onSelect={(currentValue) => {
                    setFormData({...formData, [fieldName]: currentValue});
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Sport Event Dropdown */}
          {renderDropdown(
            "Sport Event",
            formData.sportEvent,
            sportEventOptions,
            openSportEvent,
            setOpenSportEvent,
            "sportEvent"
          )}

          {/* Event Name Dropdown */}
          {renderDropdown(
            "Event Name",
            formData.eventName,
            eventNameOptions,
            openEventName,
            setOpenEventName,
            "eventName"
          )}

          {/* Classification Dropdown */}
          {renderDropdown(
            "Classification",
            formData.classification,
            classificationOptions,
            openClassification,
            setOpenClassification,
            "classification"
          )}

          {/* Athlete Dropdown */}
          {renderDropdown(
            "Athlete",
            formData.athleteName,
            athleteOptions,
            openAthlete,
            setOpenAthlete,
            "athleteName"
          )}

          {/* Gender Dropdown */}
          {renderDropdown(
            "Gender",
            formData.gender,
            genderOptions,
            openGender,
            setOpenGender,
            "gender"
          )}

          {/* Performance Input */}
          <div className="space-y-2">
            <Label htmlFor="value">Performance</Label>
            <Input
              id="value"
              value={formData.value}
              onChange={(e) => {
                if (/^\d*\.?\d*$/.test(e.target.value)) {
                  setFormData({...formData, value: e.target.value});
                }
              }}
              placeholder="Enter performance"
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
              "Add Record"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}