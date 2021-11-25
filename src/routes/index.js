import Details from "./Details";
import Choose from "./Choose";
import Pay from "./Pay";
import Declaration from "./Declaration";

const Routes = ({ state }) => {
  if (!state) {
    return null;
  }
  switch (state.value) {
    case "Details":
      return <Details />;
    case "Choose":
      return <Choose />;
    case "Pay":
      return <Pay />;
    case "Declaration":
      return <Declaration />;
    default:
      return <Details />;
  }
};

export default Routes;
