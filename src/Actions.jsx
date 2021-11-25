import { Button } from "@simplybusiness/mobius-simplybusiness";

const Actions = ({ dispatch, events = [] }) => {
  const hasEvent = (eventName) => events.some((e) => e === eventName);

  return (
    <div>
      {hasEvent("BACK") && (
        <Button onClick={() => dispatch("BACK")} variant="ghost">
          Back
        </Button>
      )}
      {hasEvent("NEXT") && (
        <Button onClick={() => dispatch("NEXT")} variant="secondary">
          Next
        </Button>
      )}
    </div>
  );
};

export default Actions;
