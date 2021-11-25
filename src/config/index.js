import shared from "./shared";
import test from "./test";
import development from "./development";
import production from "./production";

const env = process.env.NODE_ENV;

const getConfig = () => {
  const { appId: id, ...rest } = shared;
  const appId = `${id}_${env}`;

  if (env === "production") {
    return { env, ...production, appId, ...rest };
  }
  if (env === "test") {
    return { env, ...test, appId, ...rest };
  }

  return { env, ...development, appId, ...rest };
};

export default getConfig;
