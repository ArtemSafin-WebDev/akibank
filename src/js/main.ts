import "virtual:svg-icons-register";
import "../scss/style.scss";
import selects from "./selects";
import exchange from "./exchange";
import modals from "./modals";

document.addEventListener("DOMContentLoaded", () => {
  modals();
  selects();
  exchange();
});

window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});
