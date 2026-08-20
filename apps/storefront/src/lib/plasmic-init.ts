import { initPlasmicLoader } from "@plasmicapp/loader-nextjs"

import PromoBadge from "@modules/common/components/promo-badge"
import LoginForm from "@modules/account/components/auth-card/login-form"
import { Button } from "@modules/common/components/ui/button"
import SignupForm from "@modules/account/components/auth-card/signup-from"
import DummyHomePage from "@modules/home/components/dummy-home"

// Pages/designs are handled by codegen (`plasmic sync`). This loader instance is
// used ONLY to register your hand-written code components for Studio's
// drag-and-drop and to power the /plasmic-host page — it never renders Plasmic
// pages, so it does NOT require publishing.
export const PLASMIC = initPlasmicLoader({
  projects: [
    {
      id: "3RVpz8tf8oHM2jiuGYHU8J",
      token:
        "oIx4DF9fXTxFOFpb44MLM3sqgS4aFruu4zSOtqmedwDJ468Vew80ByiqvFwYHRFLYr0dD8SUauwx7A4GfgQ",
    },
  ],
})

// ── Register every code component you want in Studio's insert panel. ──
// Add one PLASMIC.registerComponent() block per component (same meta shape as
// your other project: name, displayName, importPath, props).
PLASMIC.registerComponent(PromoBadge, {
  name: "PromoBadge",
  displayName: "Promo Badge",
  importPath: "@modules/common/components/promo-badge",
  props: {
    text: {
      type: "string",
      defaultValue: "NEW",
    },
    color: {
      type: "color",
      defaultValue: "#db2777",
    },
  },
})

PLASMIC.registerComponent(LoginForm, {
  name: "LoginForm",
  displayName: "Login Form",
  importPath: "@modules/account/components/auth-card/login-form",
  props: {
    title: {
      type: "string",
      defaultValue: "Welcome Back",
    },
    emailPlaceholder: {
      type: "string",
      defaultValue: "E-mail",
    },
    passwordPlaceholder: {
      type: "string",
      defaultValue: "Password",
    },
    forgotLabel: {
      type: "string",
      defaultValue: "Forgot your password??",
    },
    submitLabel: {
      type: "string",
      defaultValue: "Login",
    },
    registerPrompt: {
      type: "string",
      defaultValue: "Don't have an account?",
    },
    registerLabel: {
      type: "string",
      defaultValue: "Create Account",
    },
    onForgot: {
      type: "eventHandler",
      argTypes: [],
    },
    onRegister: {
      type: "eventHandler",
      argTypes: [],
    },
  },
})

// shadcn Button. `name` must be "Button" to match the named export, since
// codegen imports it as `import { Button } from ...`.
PLASMIC.registerComponent(Button, {
  name: "Button",
  displayName: "Button (shadcn)",
  importPath: "@modules/common/components/ui/button",
  props: {
    children: {
      type: "slot",
      defaultValue: "Button",
    },
    variant: {
      type: "choice",
      options: ["default", "legoBlue", "legoGold"],
      defaultValue: "default",
    },
    shape: {
      type: "choice",
      options: ["normal", "lego"],
      defaultValue: "normal",
    },
    size: {
      type: "choice",
      options: ["default", "sm", "lg"],
      defaultValue: "default",
    },
    disabled: {
      type: "boolean",
    },
    onClick: {
      type: "eventHandler",
      argTypes: [{ name: "event", type: "object" }],
    },
  },
})

PLASMIC.registerComponent(SignupForm, {
  name: "SignupForm",
  displayName: "Signup Form",
  importPath: "@modules/account/components/auth-card/signup-from",
  props: {
    title: {
      type: "string",
      defaultValue: "Create Account",
    },
    emailPlaceholder: {
      type: "string",
      defaultValue: "E-mail",
    },
    passwordPlaceholder: {
      type: "string",
      defaultValue: "Password",
    },
    forgotLabel: {
      type: "string",
      defaultValue: "Forgot your password??",
    },
    submitLabel: {
      type: "string",
      defaultValue: "Sign Up",
    },
    registerPrompt: {
      type: "string",
      defaultValue: "Don't have an account?",
    },
    registerLabel: {
      type: "string",
      defaultValue: "Create Account",
    },
    onForgot: {
      type: "eventHandler",
      argTypes: [],
    },
    onRegister: {
      type: "eventHandler",
      argTypes: [],
    },
  },
})

PLASMIC.registerComponent(DummyHomePage, {
  name: "DummyHomePage",
  displayName: "Dummy Home Page",
  importPath: "@modules/home/components/dummy-home",
  props: {
    title: {
      type: "string",
      defaultValue: "Build something people love",
    },
    subtitle: {
      type: "string",
      defaultValue:
        "A starter storefront powered by Medusa and Next.js. Responsive out of the box, ready for you to make it your own.",
    },
    ctaLabel: {
      type: "string",
      defaultValue: "Shop now",
    },
    onCtaClick: {
      type: "eventHandler",
      argTypes: [],
    },
  },
})
