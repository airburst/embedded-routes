/**
 * As at November 2021 ErrorBoundary still has
 * to be defined as a react class component.
 */
import { Component } from "react";
import { Notifier } from "@airbrake/browser";
import { Flex } from "@simplybusiness/mobius-simplybusiness";
import getConfig from "../config";

// Set Airbrake configuration
const config = getConfig();
const environment = config.env;
const appId = config.appId;
const projectId = config.airbrakeProjectId;
const projectKey = config.airbrakeProjectKey;

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
    this.airbrake = new Notifier({ projectId, projectKey });
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true });
    // Send error to Airbrake
    this.airbrake.notify({
      environment,
      appId,
      error,
      params: { info: info },
    });
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;

    if (hasError) {
      return (
        <Flex alignItems="center" justifyContent="center">
          <h1>Something went wrong.</h1>
        </Flex>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
