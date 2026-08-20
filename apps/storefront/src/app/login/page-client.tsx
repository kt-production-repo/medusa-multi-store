"use client";

import * as React from "react";
import {
  PlasmicLogin,
  DefaultLoginProps
} from "../../../components/plasmic/test/PlasmicLogin"; // plasmic-import: CYty2imRoz5Z/render

export function ClientLogin(props: DefaultLoginProps) {
  return <PlasmicLogin {...props} />;
}
