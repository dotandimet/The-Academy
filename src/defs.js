import { h, Component, render, toChildArray } from "/web_modules/preact.js"; //"https://unpkg.com/preact@10.2.1/dist/preact.module.js"; // 'https://unpkg.com/preact?module';
import htm from "/web_modules/htm.js"; //"https://unpkg.com/htm?module";
// Initialize htm with Preact
const html = htm.bind(h);

const division_icons = {
  Soma: "fa-child",
  Quick: "fa-running",
  Freak: "fa-biohazard",
  Mekhane: "fa-cog",
  Gremlin: "fa-wrench",
  Ghost: "fa-ghost",
  Psyche: "fa-brain",
  ESPer: "fa-heart-broken",
  Dominator: "fa-hand-holding-heart",
  Energia: "fa-sun",
  Torch: "fa-fire",
  Bolt: "fa-bolt",
  Mover: "fa-meteor",
  Daimon: "fa-hat-wizard",
  Oracle: "fa-crow",
  Channeler: "fa-cat"
};

const divisions = ["Soma", "Psyche", "Mekhane", "Daimon", "Energia"];
const division_types = {
  Soma: ["Quick", "Freak"],
  Psyche: ["Dominator", "ESPer"],
  Mekhane: ["Gremlin", "Ghost"],
  Daimon: ["Oracle", "Channeler"],
  Energia: ["Torch", "Bolt", "Mover"]
};

const grades = ["black", "red", "amber", "bronze", "silver", "gold"];
const grade_colors = {
  amber: "#cc9933",
  bronze: "#999933",
  red: "red",
  black: "black"
};

export {
  Component,
  render,
  h,
  html,
  toChildArray,
  division_icons,
  divisions,
  division_types,
  grade_colors,
  grades
};
