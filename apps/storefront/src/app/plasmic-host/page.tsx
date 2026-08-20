"use client"

import { PlasmicCanvasHost } from "@plasmicapp/loader-nextjs"

// Importing the loader module runs its PLASMIC.registerComponent() calls, so
// Studio's canvas (which loads this page in an iframe) sees your components.
import "@lib/plasmic-init"

// The "app host" page. In Plasmic Studio, set the project's host URL to
// http://localhost:8000/plasmic-host so Studio renders your real code
// components and lets you drag them into designs.
export default function PlasmicHostPage() {
  return <PlasmicCanvasHost />
}
