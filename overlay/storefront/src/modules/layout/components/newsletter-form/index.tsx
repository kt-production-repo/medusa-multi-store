"use client"

import { useState } from "react"

export default function NewsletterForm() {
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 max-w-[350px] h-[52px] px-6 rounded-full bg-white/10 border-none text-white placeholder:text-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-light"
      />
      <button
        type="submit"
        className="btn-primary btn-sm h-[52px] px-6"
      >
        Subscribe
      </button>
    </form>
  )
}
