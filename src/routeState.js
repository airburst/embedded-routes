import { createMachine } from "@xstate/fsm";

export const PAGES = [
  { name: "Details" },
  { name: "Choose" },
  { name: "Pay" },
  { name: "Declaration" },
];

// Define allowed journey through pages
export default createMachine({
  initial: "Details",
  states: {
    Details: {
      on: { NEXT: "Choose" },
    },
    Choose: {
      on: { NEXT: "Pay", BACK: "Details" },
    },
    Pay: {
      on: { NEXT: "Declaration", BACK: "Choose" },
    },
    Declaration: {
      on: { BACK: "Pay" },
    },
  },
});
