"use client";

import * as React from "react";
import {
  PlasmicSignup,
  DefaultSignupProps
} from "../../../components/plasmic/test/PlasmicSignup"; // plasmic-import: cz_5_nedk6OS/render

export function ClientSignup(props: DefaultSignupProps) {
  return <PlasmicSignup {...props} />;
}
