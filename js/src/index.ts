import { initApp } from "./app";

(globalThis as any).initApp = initApp;

initApp();
