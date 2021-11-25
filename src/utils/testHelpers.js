export const mockFetch = ({ data = {}, ok = true } = {}) => {
  return jest.fn().mockResolvedValueOnce({
    ok,
    json: () => data,
  });
};

export const mockFetchFailure = (errorMessage = "Fetch error! Testing.") => {
  return jest.fn().mockRejectedValueOnce(new Error(errorMessage));
};

export const mockCurrentWindowUrl = (url) => {
  // Mock window.location.href
  const currentWindowLocation = global.window.location;
  delete global.window.location;
  global.window = Object.create(window);
  global.window.location = {
    ...currentWindowLocation,
    href: url,
    pathname: new URL(url).pathname,
  };
};

export const constructIgluSchema = ({ eventName, version, namespace }) =>
  `iglu:${namespace}/${eventName}/jsonschema/${version}`;
