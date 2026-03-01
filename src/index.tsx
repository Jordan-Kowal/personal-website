/* @refresh reload */
import "./styles/index.css";

import { render } from "solid-js/web";
import { App } from "@/App";

if (import.meta.env.DEV) {
  import("solid-devtools");
}

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error("Root element not found");
}

render(() => <App />, root!);
