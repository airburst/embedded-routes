// import { useMachine } from "@xstate/react";
import Routes from "./routes";
import Actions from "./Actions";
import Navstatus from "./Navstatus";
import useRoute from "./useRoute";
import "@simplybusiness/mobius-simplybusiness/dist/global.css";
import "./index.css";

const App = () => {
  const [state, dispatch, events] = useRoute();

  return (
    <div className={`sb-embedded-app`}>
      <div className={`sb-embedded-app__nav`}>
        <Navstatus state={state} />
      </div>
      <div className={`sb-embedded-app__content`}>
        <div className={`sb-embedded-app__main`}>
          <Routes state={state} />
        </div>
        <div className={`sb-embedded-app__actions`}>
          <Actions dispatch={dispatch} events={events} />
        </div>
      </div>
    </div>
  );
};

export default App;
