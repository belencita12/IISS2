"use client"

import { useEffect, useState } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useFetch } from "@/hooks/api"
import { EMPLOYEE_API } from "@/lib/urls"

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
      <div className="p-4 border border-myPink-tertiary rounded-lg bg-gray-50 text-gray-500">
        No hay horarios disponibles para esta fecha
      </div>
    )
  }

  return (
    <div className="border border-myPink-tertiary rounded-lg p-3">
      <RadioGroup value={selectedTime} onValueChange={handleSelectTime} className="grid grid-cols-3 gap-2">
        {timeSlots.map((slot) => (
          <div key={slot.time}>
            <Label
              htmlFor={`time-${slot.time}`}
              className={`border cursor-pointer rounded-lg p-2 flex items-center justify-center gap-2 transition-colors
                ${selectedTime === slot.time ? "bg-myPink-primary/10 border-myPink-primary text-myPink-focus" : "hover:bg-myPink-disabled/20"}`}
            >
              <RadioGroupItem id={`time-${slot.time}`} value={slot.time} className="sr-only" />
              {slot.time}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}
