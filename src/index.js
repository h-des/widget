let poly = require("preact-cli/lib/lib/webpack/polyfills");

import habitat from "preact-habitat";

import Widget from "./components/App";

let _habitat = habitat(Widget);

_habitat.render({
  selector: '[data-widget-host="deple-widget"]',
  clean: true
});
