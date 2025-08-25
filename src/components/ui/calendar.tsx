"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

// Basic category colors and labels for calendar events
export const categoryColors = {
  PROMOTION: "bg-green-500",
  SALE: "bg-red-500", 
  PRODUCT_LAUNCH: "bg-blue-500",
  LAUNCH: "bg-blue-500",
  INVENTORY: "bg-yellow-500",
  SHIPPING: "bg-purple-500",
  CUSTOMER_SERVICE: "bg-pink-500",
  MAINTENANCE: "bg-gray-500",
  HOLIDAY: "bg-indigo-500",
  TRAINING: "bg-orange-500",
  MARKETING: "bg-teal-500",
  SEO_UPDATE: "bg-cyan-500",
  CONTENT: "bg-lime-500",
  TECHNOLOGY: "bg-emerald-500",
  SECURITY: "bg-rose-500",
  COMPLIANCE: "bg-amber-500",
  OPERATIONS: "bg-violet-500",
  WEATHER: "bg-sky-500",
  COMMUNITY: "bg-fuchsia-500",
} as const;

export const categoryLabels = {
  PROMOTION: "Promoción",
  SALE: "Oferta",
  PRODUCT_LAUNCH: "Lanzamiento",
  LAUNCH: "Lanzamiento",
  INVENTORY: "Inventario",
  SHIPPING: "Envío",
  CUSTOMER_SERVICE: "Atención",
  MAINTENANCE: "Mantenimiento",
  HOLIDAY: "Festivo",
  TRAINING: "Capacitación",
  MARKETING: "Marketing",
  SEO_UPDATE: "SEO",
  CONTENT: "Contenido",
  TECHNOLOGY: "Tecnología",
  SECURITY: "Seguridad",
  COMPLIANCE: "Cumplimiento",
  OPERATIONS: "Operaciones",
  WEATHER: "Clima",
  COMMUNITY: "Comunidad",
} as const;

export { Calendar }