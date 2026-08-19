# OTP Input

A component that renders a form input field for one-time passwords (OTP) using Medusa's design system.

The `OtpInput` component is useful for scenarios where you need to input a code sent via email or SMS for verification purposes.

In this guide, you'll learn how to use the OTP Input component.

The `OTPInput` component is available since v4.1.13 of `@medusajs/ui`.

```tsx
import { OtpInput } from "@medusajs/ui"
import { useState } from "react"

export default function OtpInputDemo() {
  const [otp, setOtp] = useState("")
  return (
    <div className="w-[250px]">
      <OtpInput value={otp} onChange={setOtp} />
    </div>
  )
}

```

## Usage

```tsx
import { OtpInput } from "@medusajs/ui"
```

```tsx
const [otp, setOtp] = useState("")

return <OtpInput value={otp} onChange={setOtp} />
```

***

## API Reference

### OtpInput Props

A controlled segmented input for one-time passwords, PINs, and short numeric verification codes.

- autoFocus: (boolean) Whether the inputs should focus the first field on mount.
- disabled: (boolean) Whether the inputs are disabled.
- groupSize: (number) How many digits to show before rendering a separator. Default: 3
- inputClassName: (string) Additional class name for each input.
- length: (number) The number of digits in the code. Default: 6
- onChange: (signature) Called with the sanitized code whenever it changes.
- onComplete: (signature) Called when the sanitized code reaches the configured length.
- readOnly: (boolean) Whether the inputs are read-only.
- separator: (ReactReactNode) The separator rendered between groups. Default: "-"
- value: (string) The controlled code value.
- aria-label: (string) Defines a string value that labels the current element. Default: "One-time password"

***

## Examples

### Handle OTP Completion

Use the `onComplete` callback to react when the user fills in the full code. This is useful to automatically submit the code for verification once it's complete:

```tsx
import { OtpInput, Text } from "@medusajs/ui"
import { useState } from "react"

export default function OtpInputOnComplete() {
  const [otp, setOtp] = useState("")
  const [submitted, setSubmitted] = useState<string | null>(null)

  return (
    <div className="flex w-[250px] flex-col items-center gap-y-3">
      <OtpInput
        value={otp}
        onChange={(value) => {
          setOtp(value)
          if (submitted) {
            setSubmitted(null)
          }
        }}
        onComplete={(value) => setSubmitted(value)}
      />
      {submitted && <Text size="small">Submitted code: {submitted}</Text>}
    </div>
  )
}

```

### 4-Digit PIN

By default, the OTP input renders a 6-digit code. Use the `length` and `groupSize` props to render a shorter code without a separator:

```tsx
import { OtpInput } from "@medusajs/ui"
import { useState } from "react"

export default function OtpInputPin() {
  const [pin, setPin] = useState("")
  return (
    <div className="w-[250px]">
      <OtpInput value={pin} onChange={setPin} length={4} groupSize={4} />
    </div>
  )
}

```

### Custom Group Size

By default, the OTP input groups digits in sets of `3`. Use the `groupSize` prop to control how many digits are rendered between each separator:

```tsx
import { OtpInput } from "@medusajs/ui"
import { useState } from "react"

export default function OtpInputGroupSize() {
  const [otp, setOtp] = useState("")
  return (
    <div className="w-[250px]">
      <OtpInput value={otp} onChange={setOtp} groupSize={2} />
    </div>
  )
}

```

### Custom Separator

By default, the OTP input uses `-` as the separator. You can change it by setting the `separator` prop. It can be a string or a React node:

```tsx
import { OtpInput } from "@medusajs/ui"
import { useState } from "react"

export default function OtpInputCustomSeparator() {
  const [otp, setOtp] = useState("")
  return (
    <div className="w-[250px]">
      <OtpInput value={otp} onChange={setOtp} separator="•" />
    </div>
  )
}

```

### Error State

You can leverage the native `aria-invalid` property to show an error state on the OTP input:

```tsx
import { OtpInput } from "@medusajs/ui"
import { useState } from "react"

export default function OtpInputError() {
  const [otp, setOtp] = useState("123")
  return (
    <div className="w-[250px]">
      <OtpInput value={otp} onChange={setOtp} aria-invalid={true} />
    </div>
  )
}

```
