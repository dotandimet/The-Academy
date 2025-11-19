import { h, Component, render, toChildArray } from "preact"; //"https://unpkg.com/preact@10.2.1/dist/preact.module.js"; // 'https://unpkg.com/preact?module';
import htm from "htm"; //"https://unpkg.com/htm?module";
// Initialize htm with Preact
const html = htm.bind(h);

const divisions = ["Monday", "Soma", "Psyche", "Mekhane", "Daimon", "Energia"];
const division_types = {
  Monday: ["Employee"],
  Soma: ["Quick", "Freak"],
  Psyche: ["Dominator", "ESPer"],
  Mekhane: ["Gremlin", "Ghost"],
  Daimon: ["Oracle", "Channeler"],
  Energia: ["Torch", "Bolt", "Mover"]
};

const grades = ["black", "red", "amber", "bronze", "silver", "gold"];

export {
  Component,
  render,
  h,
  html,
  toChildArray,
  divisions,
  division_types,
  grades
};
