import getConfig from "../config";

const config = getConfig();

export const AVALANCHE_TRACKER_NAME = "sb-ava";
const PV_VALANCHE_TRACKER_NAME = "sb-ava-pv";
const BRONZE_AVALANCHE_TRACKER_NAME = "sb-ava-br";
const APP_ID = config.appId;
const DOMAIN = "simplybusiness.co.uk";
const COLLECTOR_URL = "snowplow-collector.simplybusiness.co.uk";
const FALLBACK_SERVICE_CHANNEL_ID = "simplybusiness";

/**
 * Simple mapper from path to Distribution Channel ID.
 *
 * Enables overriding of the channel ID based on the path in the app,
 * along with a default for any path not mapped.
 *
 * Does not support anything fancy like wildcards.
 *
 * @param {Object<string: string>} map
 * @param {string} defaultId the default channel ID to use if no match
 * @constructor
 */
export function DistributionChannelMapper(map, defaultId) {
  this.map = map;
  this.defaultId = defaultId;

  /**
   * Gets the distribution channel ID for the supplied pathname
   *
   * @param {string} pathname
   * @return {string}
   */
  this.getValue = function (pathname) {
    return this.map[pathname] || this.defaultId;
  };
}

/**
 * Builds the Distribution Context metadata for Snowplow events
 *
 * @param {string} version schema version
 * @param {DistributionChannelMapper?} urlChannelMap
 * @return {{schema: string, data: {service_channel_identifier: (*|string)}}}
 */
export const distributionChannelContext = (version, urlChannelMap) => {
  const serviceChannelId =
    urlChannelMap?.getValue(window.location.pathname) ||
    FALLBACK_SERVICE_CHANNEL_ID;

  return {
    schema: `iglu:com.simplybusiness/distribution_channel_context/jsonschema/${version}`,
    data: {
      service_channel_identifier: serviceChannelId,
    },
  };
};

/**
 * Builds the Service Context metadata for Snowplow events
 *
 * @param {string} version schema version
 * @param {DistributionChannelMapper?} urlChannelMap
 * @return {{schema: string, data: {service_channel_identifier: (*|string)}}}
 */
export const serviceChannelContext = (version, urlChannelMap) => {
  const serviceChannelId =
    urlChannelMap?.getValue(window.location.pathname) ||
    FALLBACK_SERVICE_CHANNEL_ID;

  return {
    schema: `iglu:com.simplybusiness/service_channel_context/jsonschema/${version}`,
    data: {
      service_channel_identifier: serviceChannelId,
    },
  };
};

/**
 * Initialise various Marketing and SB tracking
 *
 * @param {DistributionChannelMapper} urlServiceChannelMap
 */
export const init = (
  urlDistributionIdMap = {},
  defaultChannelId = config.siteDefaultChannelId
) => {
  if (!config.useTracking) return;

  const urlServiceChannelMap = new DistributionChannelMapper(
    urlDistributionIdMap,
    defaultChannelId
  );

  /* eslint-disable func-names, no-param-reassign, prefer-rest-params, prefer-destructuring */

  // Snowplow script
  const snowplowScript = document.createElement("script");
  snowplowScript.className = "optanon-category-C0001";
  const snowplowScriptTag = document.getElementsByTagName("script")[0];

  snowplowScript.text = `
    (function(p, l, o, w, i, n, g) {
      if (!p[i]) {
        p.GlobalSnowplowNamespace = p.GlobalSnowplowNamespace || [];
        p.GlobalSnowplowNamespace.push(i);
        p[i] = function() {
          (p[i].q = p[i].q || []).push(arguments);
        };
        p[i].q = p[i].q || [];
        n = l.createElement(o);
        g = l.getElementsByTagName(o)[0];
        n.async = 1;
        n.src = w;
        g.parentNode.insertBefore(n, g);
      }
    })(
      window,
      document,
      'script',
      '//d2rsg57kfr3nt3.cloudfront.net/sp-2.14.0.js',
      'snowplow',
      )
      `;

  snowplowScriptTag.parentNode.insertBefore(snowplowScript, snowplowScriptTag);

  if (window.snowplow !== "undefined") {
    window.snowplow("newTracker", AVALANCHE_TRACKER_NAME, COLLECTOR_URL, {
      appId: APP_ID,
      eventMethod: "post",
      cookieDomain: DOMAIN,
    });

    window.snowplow(
      "newTracker",
      BRONZE_AVALANCHE_TRACKER_NAME,
      COLLECTOR_URL,
      {
        appId: APP_ID,
        eventMethod: "post",
        cookieDomain: DOMAIN,
      }
    );

    window.snowplow("newTracker", PV_VALANCHE_TRACKER_NAME, COLLECTOR_URL, {
      appId: APP_ID,
      eventMethod: "post",
      cookieDomain: DOMAIN,
      contexts: {
        webPage: true,
        gaCookies: true,
      },
    });

    window.snowplow(`trackPageView:${PV_VALANCHE_TRACKER_NAME}`, null, [
      distributionChannelContext("1-0-0", urlServiceChannelMap),
      serviceChannelContext("1-0-0", urlServiceChannelMap),
    ]);
  }
};

/**
 * Tracks struct event and send it to bronze avalanche
 * @param {*} {
 *   category,
 *   action,
 *   label,
 *   property,
 *   value,
 * }
 */
export const trackStructEvent = ({
  category,
  action,
  label,
  property,
  value,
}) => {
  if (typeof window.snowplow === "undefined") return;
  window.snowplow(
    `trackStructEvent:${BRONZE_AVALANCHE_TRACKER_NAME}`,
    category,
    action,
    label,
    property,
    value
  );
};

/**
 * Track unstruct event and send it to avalanche
 * @param {*} schema
 * @param {*} data
 */
export const trackUnstructEvent = (schema, data, context = null) => {
  if (typeof window.snowplow === "undefined") return;

  window.snowplow(
    `trackUnstructEvent:${AVALANCHE_TRACKER_NAME}`,
    {
      schema,
      data,
    },
    context
  );
};

/**
 * Tracks link click and send event to avalanche
 * @param {*} {
 *   targetUrl,
 *   elementId,
 *   elementClasses,
 *   elementTarget,
 *   elementContent,
 *   context,
 *   tstamp,
 * }
 */
export const trackLinkClick = ({
  targetUrl,
  elementId,
  elementClasses,
  elementTarget,
  elementContent,
  context,
  tstamp,
}) => {
  if (typeof window.snowplow === "undefined") return;
  window.snowplow(
    `trackLinkClick:${AVALANCHE_TRACKER_NAME}`,
    targetUrl,
    elementId,
    elementClasses,
    elementTarget,
    elementContent ? elementContent.replace(/^\s*(.*?)\s*$/, "$1") : undefined,
    context,
    tstamp
  );
};

/**
 * Tracks marketing link using a structEvent
 * @param {*} name
 */
export const trackMarketingLinkClick = (name) => {
  if (typeof window.snowplow === "undefined") return;
  trackStructEvent({
    category: "marketing",
    action: "link_click",
    label: name,
    property: window.location.href,
  });
};

export const trackTradeSearch = ({ site, query }) =>
  trackUnstructEvent(
    "iglu:com.simplybusiness/primary_detail_search/jsonschema/1-3-1",
    {
      site,
      query,
      search_type: "trade_selector",
      vertical: null,
    }
  );

export const trackTradeSelect = ({ site, trade, vertical }) =>
  trackUnstructEvent(
    "iglu:com.simplybusiness/primary_detail_selected/jsonschema/1-0-0",
    {
      site,
      vertical,
      primary_detail: trade,
    },
    [distributionChannelContext("1-0-0"), serviceChannelContext("1-0-0")]
  );
