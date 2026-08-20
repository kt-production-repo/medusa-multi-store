"use client";

import * as React from "react";
import {
  PlasmicHomepage,
  DefaultHomepageProps
} from "../../../components/plasmic/test/PlasmicHomepage"; // plasmic-import: wa2O1Rx8yCvZ/render

export function ClientHomepage(props: DefaultHomepageProps) {
  return <PlasmicHomepage {...props} />;
}
