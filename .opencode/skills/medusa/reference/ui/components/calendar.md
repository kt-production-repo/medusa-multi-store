# Calendar

A component for displaying a calendar interface with date selection capability.

In this guide, you'll learn how to use the Calendar component.

```tsx
import { Calendar } from "@medusajs/ui"
import * as React from "react"

export default function CalendarDemo() {
  const [date, setDate] = React.useState<Date | null>()

  return <Calendar value={date} onChange={setDate} />
}

```

## Usage

```tsx
import { Calendar } from "@medusajs/ui"
```

```tsx
<Calendar />
```

***

## API Reference

### Calendar Props

Calendar component used to select a date.
Its props are based on \[React Aria Calendar]\(https://react-spectrum.adobe.com/react-aria/Calendar.html#calendar-1).

- value: (union) The currently selected date.
- defaultValue: (union) The date that is selected when the calendar first mounts (uncontrolled).
- onChange: (signature) A function that is triggered when the selected date changes.
- isDateUnavailable: (signature) A function that determines whether a date is unavailable for selection.
- minValue: (Date) The minimum date that can be selected.
- maxValue: (Date) The maximum date that can be selected.

***

## Examples

### Controlled

```tsx
import { Calendar } from "@medusajs/ui"
import { useState } from "react"

export default function CalendarControlled() {
  const [date, setDate] = useState<Date | null>(null)
  return (
    <div className="flex flex-col gap-2">
      <Calendar value={date} onChange={setDate} />
      <span className="txt-small text-ui-fg-muted">
        Selected: {date?.toDateString() ?? "None"}
      </span>
    </div>
  )
}

```

### Min/Max Dates

```tsx
import { Calendar } from "@medusajs/ui"

export default function CalendarMinMax() {
  const min = new Date()
  const max = new Date()
  max.setDate(max.getDate() + 10)
  return (
    <div className="flex flex-col gap-2">
      <span className="txt-small text-ui-fg-muted">
        Selectable dates: {min.toDateString()} to {max.toDateString()}
      </span>
      <Calendar minValue={min} maxValue={max} />
    </div>
  )
}

```

### Unavailable Dates

```tsx
import { Calendar } from "@medusajs/ui"

function isUnavailable(date: Date) {
  // Disable all Sundays
  return date.getDay() === 0
}

export default function CalendarUnavailable() {
  return (
    <div className="flex flex-col gap-2">
      <span className="txt-small text-ui-fg-muted">
        All Sundays are unavailable for selection.
      </span>
      <Calendar isDateUnavailable={isUnavailable} />
    </div>
  )
}

```
