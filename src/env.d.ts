/* eslint-disable no-unused-vars */
/// <reference types="vite/client" />
import {API} from "../electron/preload";

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare global {
  interface Window {
    api: typeof API;
  }
}