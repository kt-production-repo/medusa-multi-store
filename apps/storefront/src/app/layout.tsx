import "../../components/plasmic/blank_project/plasmic.css"; // plasmic-import: 3RVpz8tf8oHM2jiuGYHU8J/projectcss
import { getBaseURL } from "@lib/util/env";
import { Metadata } from "next";
import "styles/globals.css";
export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL())
};
export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <body>
        <main className="relative">{props.children}</main>
      </body>
    </html>
  );
}
