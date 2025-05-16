"use client"

import { useEffect, useState } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useFetch } from "@/hooks/api"
import { EMPLOYEE_API } from "@/lib/urls"
import { Clock } from "lucide-react"

type AvailabilityPickerProps = {
  token: string
  employeeId: string
  date: string
  serviceDuration: number
  onSelectTime: (time: string) => void
}

type TimeSlot = {
  time: string
  available: boolean
}

export function AvailabilityPicker({
  token,
  employeeId,
  date,
  serviceDuration,
  onSelectTime,
}: AvailabilityPickerProps) {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [selectedTime, setSelectedTime] = useState<string>("")
  const { data, get } = useFetch<{ availableSlots: string[] }>("", token)

  useEffect(() => {
    if (employeeId && date) {
      get(undefined, `${EMPLOYEE_API}/${employeeId}/availability?date=${date}&duration=${serviceDuration || 30}`)
    }
  }, [employeeId, date, serviceDuration])

  useEffect(() => {
    if (data?.availableSlots) {
      const slots = data.availableSlots.map((time) => ({
        time,
        available: true,
      }))
      setTimeSlots(slots)
    } else {
      setTimeSlots([])
    }
  }, [data])

  const handleSelectTime = (time: string) => {
    setSelectedTime(time)
    onSelectTime(time)
  }

  if (timeSlots.length === 0) {
    return (
      <div className="p-4 border border-myPink-tertiary rounded-lg bg-gray-50 text-gray-500 flex items-center justify-center">
        <div className="text-center">
          <Clock className="h-6 w-6 text-myPink-tertiary mx-auto mb-2 opacity-50" />
          <p>No hay horarios disponibles para esta fecha</p>
        </div>
      </div>
    )
  }

  return (
    <div className="border border-myPink-tertiary rounded-lg p-4 bg-white">
      <RadioGroup
        value={selectedTime}
        onValueChange={handleSelectTime}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2"
      >
        {timeSlots.map((slot) => (
          <div key={slot.time} className="relative">
            <Label
              htmlFor={`time-${slot.time}`}
              className={`
                border-2 cursor-pointer rounded-lg p-3 flex items-center justify-center gap-2 transition-all
                ${
                  selectedTime === slot.time
                    ? "bg-gradient-to-r from-myPink-primary/20 to-myPink-primary/10 border-myPink-primary text-myPink-focus font-medium shadow-sm"
                    : "border-gray-200 hover:border-myPink-tertiary hover:bg-myPink-disabled/10"
                }
              `}
            >
              <RadioGroupItem id={`time-${slot.time}`} value={slot.time} className="sr-only" />
              {slot.time}
              {selectedTime === slot.time && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-myPink-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-[10px]">✓</span>
                </span>
              )}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}
