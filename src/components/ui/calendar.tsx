"use client"

import * as React from "react"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  MapPinIcon,
  ClockIcon,
  TagIcon,
} from "lucide-react"
import { DayButton, DayPicker, getDefaultClassNames } from "react-day-picker"
import { format, isSameDay, isToday, isFuture, isPast } from "date-fns"
import { es } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { EcommerceCalendarEvent, EcommerceEventCategory } from "@/domain/types/calendar"

interface CalendarProps extends React.ComponentProps<typeof DayPicker> {
  events?: EcommerceCalendarEvent[]
  onEventClick?: (event: EcommerceCalendarEvent) => void
  showEventIndicators?: boolean
  compact?: boolean
  className?: string
}

const categoryColors: Record<EcommerceEventCategory, string> = {
  PROMOTION: "bg-green-500",
  SALE: "bg-red-500",
  PRODUCT_LAUNCH: "bg-blue-500",
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
}

const categoryLabels: Record<EcommerceEventCategory, string> = {
  PROMOTION: "Promoción",
  SALE: "Oferta",
  PRODUCT_LAUNCH: "Lanzamiento",
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
}

// Get event indicator color based on category
const getEventIndicatorColor = (event: EcommerceCalendarEvent) => {
  return categoryColors[event.category] || "bg-gray-400"
}

// Custom day button component with event indicators
interface CalendarDayButtonProps extends React.ComponentProps<typeof DayButton> {
  date: Date
  events?: EcommerceCalendarEvent[]
  showEventIndicators?: boolean
  selectedDate?: Date
  onEventHover?: (event: EcommerceCalendarEvent | null) => void
}

const CalendarDayButton = React.forwardRef<
  React.ElementRef<typeof DayButton>,
  CalendarDayButtonProps
>(({
  className,
  day,
  modifiers,
  events = [],
  showEventIndicators = true,
  selectedDate,
  onEventHover,
  ...props
}, ref) => {
  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    return events.filter(event =>
      event.startDate <= date && event.endDate >= date
    )
  }

  const dayEvents = getEventsForDate(day.date)
  const hasEvents = dayEvents.length > 0
  const isSelectedDate = selectedDate && isSameDay(day.date, selectedDate)

  return (
    <div className="relative">
      <DayButton
        ref={ref}
        day={day}
        modifiers={modifiers}
        className={cn(
          "relative flex h-9 w-9 items-center justify-center rounded-md p-0 text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          modifiers.today && "bg-accent text-accent-foreground",
          modifiers.selected && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
          className
        )}
        {...props}
      />

      {/* Event indicators */}
      {showEventIndicators && hasEvents && (
        <div className="absolute bottom-1 left-1/2 flex -translate-x-1/2 gap-0.5">
          {dayEvents.slice(0, 3).map((event, index) => (
            <div
              key={event.id}
              className={cn(
                "h-1.5 w-1.5 rounded-full border border-background",
                getEventIndicatorColor(event)
              )}
              style={{
                marginLeft: index > 0 ? "-2px" : "0"
              }}
              title={event.title}
              onMouseEnter={() => onEventHover?.(event)}
              onMouseLeave={() => onEventHover?.(null)}
            />
          ))}
          {dayEvents.length > 3 && (
            <div
              className="h-1.5 w-1.5 rounded-full border border-background bg-gray-400 text-xs text-white"
              style={{ marginLeft: "-2px" }}
              title={`${dayEvents.length - 3} más`}
            >
              +
            </div>
          )}
        </div>
      )}

      {/* Event popover on hover */}
      {onEventHover && isSelectedDate && (
        <CalendarEventPopover
          event={dayEvents[0]}
          onClose={() => onEventHover?.(null)}
        />
      )}
    </div>
  )
})

CalendarDayButton.displayName = "CalendarDayButton"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  events = [],
  onEventClick,
  showEventIndicators = true,
  compact = false,
  ...props
}: CalendarProps & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  const defaultClassNames = getDefaultClassNames()

  const [selectedDate, setSelectedDate] = React.useState<Date>()
  const [hoveredEvent, setHoveredEvent] = React.useState<EcommerceCalendarEvent | null>(null)

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    return events.filter(event =>
      event.startDate <= date && event.endDate >= date
    )
  }

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "bg-background group/calendar p-3 [--cell-size:--spacing(8)] [[data-slot=card-content]:not([data-slot=card-content])_&]:bg-transparent [[data-slot=popover-content]:not([data-slot=popover-content])_&]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("es-CL", { month: "long" }),
        formatYearDropdown: (date) =>
          date.toLocaleString("es-CL", { year: "numeric" }),
        formatMonthCaption: (date) =>
          date.toLocaleString("es-CL", { month: "long", year: "numeric" }),
        ...formatters,
      }}
      locale={es}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "flex gap-4 flex-col md:flex-row relative",
          defaultClassNames.months
        ),
        month: cn("flex flex-col w-full gap-4", defaultClassNames.month),
        nav: cn(
          "flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) aria-disabled:opacity-50 p-0 select-none",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) aria-disabled:opacity-50 p-0 select-none",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex items-center justify-center h-(--cell-size) w-full px-(--cell-size)",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "w-full flex items-center text-sm font-medium justify-center h-(--cell-size) gap-1.5"
,
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "relative has-focus:border-ring border border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] rounded-md",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "absolute bg-popover inset-0 opacity-0",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "select-none font-medium",
          captionLayout === "label"
            ? "text-sm"
            : "rounded-md pl-2 pr-1 flex items-center gap-1 text-sm h-8 [&>svg]:text-muted-foreground [&>svg]:size-3.5",
          defaultClassNames.caption_label
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "text-muted-foreground rounded-md flex-1 font-normal text-[0.8rem] select-none",
          defaultClassNames.weekday
        ),
        week: cn("flex w-full mt-2", defaultClassNames.week),
        week_number_header: cn(
          "select-none w-(--cell-size)",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "text-[0.8rem] select-none text-muted-foreground",
          defaultClassNames.week_number
        ),
        day: cn(
          "relative w-full h-full p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md group/day aspect-square select-none",
          defaultClassNames.day
        ),
        range_start: cn(
          "rounded-l-md bg-accent",
          defaultClassNames.range_start
        ),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn("rounded-r-md bg-accent", defaultClassNames.range_end),
        today: cn(
          "bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none",
          defaultClassNames.today
        ),
        outside: cn(
          "text-muted-foreground aria-selected:text-muted-foreground",
          defaultClassNames.outside
        ),
        disabled: cn(
          "text-muted-foreground opacity-50",
          defaultClassNames.disabled
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          )
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon className={cn("size-4", className)} {...props} />
            )
          }

          if (orientation === "right") {
            return (
              <ChevronRightIcon
                className={cn("size-4", className)}
                {...props}
              />
            )
          }

          return (
            <ChevronDownIcon className={cn("size-4", className)} {...props} />
          )
        },
        DayButton: ({ day, modifiers, ...props }) => (
          <CalendarDayButton
            day={day}
            modifiers={modifiers}
            date={day.date}
            events={events}
            showEventIndicators={showEventIndicators}
            selectedDate={selectedDate}
            onEventHover={setHoveredEvent}
            onClick={() => {
              setSelectedDate(day.date)
              const dayEvents = getEventsForDate(day.date)
              if (dayEvents.length > 0 && onEventClick) {
                onEventClick(dayEvents[0])
              }
            }}
            {...props}
          />
        ),
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-(--cell-size) items-center justify-center text-center">
                {children}
              </div>
            </td>
          )
        },
        ...components,
      }}
      {...props}
    />
  )
}

// Calendar event popover component
interface CalendarEventPopoverProps {
  event: EcommerceCalendarEvent
  onClose: () => void
}

function CalendarEventPopover({ event, onClose }: CalendarEventPopoverProps) {
  return (
    <Card className="absolute z-50 w-64 shadow-lg border-2">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Badge
              className={cn(
                "text-white text-xs",
                categoryColors[event.category]
              )}
            >
              {categoryLabels[event.category]}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={onClose}
          >
            ×
          </Button>
        </div>
        <CardTitle className="text-sm font-medium leading-tight">
          {event.title}
        </CardTitle>
        <CardDescription className="text-xs">
          {event.shortDescription || event.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 space-y-2">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <CalendarIcon className="h-3 w-3" />
          <span>
            {format(event.startDate, "dd MMM yyyy", { locale: es })}
            {event.endDate.getTime() !== event.startDate.getTime() &&
              ` - ${format(event.endDate, "dd MMM yyyy", { locale: es })}`}
          </span>
        </div>

        {event.location && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPinIcon className="h-3 w-3" />
            <span>{event.location}</span>
          </div>
        )}

        {event.isAllDay ? (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <ClockIcon className="h-3 w-3" />
            <span>Todo el día</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <ClockIcon className="h-3 w-3" />
            <span>
              {format(event.startDate, "HH:mm", { locale: es })} - {format(event.endDate, "HH:mm", { locale: es })}
            </span>
          </div>
        )}

        {event.priority && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <TagIcon className="h-3 w-3" />
            <span>Prioridad: {event.priority}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export { Calendar, CalendarDayButton, CalendarEventPopover, categoryColors, categoryLabels }