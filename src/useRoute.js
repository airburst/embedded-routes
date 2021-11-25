import { useState, useEffect } from "react";
import { interpret } from "@xstate/fsm";
import routesMachine from "./routeState";

const routeService = interpret(routesMachine);

// Start the state machine once!
routeService.start();

const useRoute = () => {
  const [state, setState] = useState(routeService.state);
  // Derive allowed transitions for this state
  const on = routeService?._machine?.config?.states?.[state.value]?.on || {};
  const events = Object.keys(on);

  useEffect(() => {
    const subscription = routeService.subscribe((routeState) => {
      setState(routeState);
    });

    return () => {
      subscription.unsubscribe();
      routeService.stop();
    };
  }, []);

  // Return state and dispatch function and allowed events for current state
  return [state, routeService.send, events];
};

export default useRoute;
