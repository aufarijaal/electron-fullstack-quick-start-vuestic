import { createApp } from "vue";
import App from "./App.vue";
import "@fontsource/inter";
import { createPinia } from "pinia";
import { createVuestic } from "vuestic-ui";
import "vuestic-ui/css";
import "./override.css";

const pinia = createPinia();

const app = createApp(App);
app.use(createVuestic());
app.use(pinia);
app.mount(document.body);
