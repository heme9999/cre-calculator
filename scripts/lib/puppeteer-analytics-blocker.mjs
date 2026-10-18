/**
 * scripts/lib/puppeteer-analytics-blocker.mjs
 *
 * Cloudflare Web Analytics (RUM) Request Interception & Blocker for Puppeteer
 *
 * Purpose:
 * Prevent automated and manual Puppeteer test runs from polluting Cloudflare Web Analytics.
 *
 * Rules:
 * 1. Default mode: Blocks static.cloudflareinsights.com (Beacon script) and /cdn-cgi/rum (RUM report).
 * 2. Explicit mode (ALLOW_ANALYTICS=true or allowAnalytics: true): Allows Beacon & RUM for dedicated verification, logging the exact test timestamp.
 * 3. Must be attached before the first navigation (page.setRequestInterception(true)).
 * 4. Error filtering: Only network errors from exact URLs actively aborted by this blocker are excluded.
 *    pageerror runtime exceptions and unconfirmed errors are NEVER filtered.
 */

/**
 * Checks whether an origin is an allowed target origin for /cdn-cgi/rum.
 * @param {URL} parsedUrl
 * @param {string[]} [allowedOrigins]
 * @returns {boolean}
 */
function isTargetOriginAllowed(parsedUrl, allowedOrigins = []) {
  if (parsedUrl.hostname === 'cloudflareinsights.com') return true;
  if (parsedUrl.hostname === 'crecalculators.com') return true;
  if (parsedUrl.hostname.endsWith('.pages.dev')) return true;
  if (parsedUrl.hostname === 'localhost' || parsedUrl.hostname === '127.0.0.1') return true;

  if (Array.isArray(allowedOrigins)) {
    for (const item of allowedOrigins) {
      if (!item) continue;
      try {
        const itemUrl = new URL(item.includes('://') ? item : `http://${item}`);
        if (itemUrl.origin === parsedUrl.origin || itemUrl.hostname === parsedUrl.hostname) {
          return true;
        }
      } catch {
        if (item === parsedUrl.hostname || item === parsedUrl.host) return true;
      }
    }
  }

  return false;
}

/**
 * Determines whether a URL is a Cloudflare Web Analytics / RUM request.
 *
 * Strict matching rules:
 * - Beacon: ONLY static.cloudflareinsights.com with pathname /beacon.min.js or /beacon.min.js/...
 * - RUM: ONLY pathname === '/cdn-cgi/rum' under permitted test target origins (or cloudflareinsights.com).
 * - Never matches /cdn-cgi/rumor or arbitrary domains' beacon.min.js.
 * - On URL parse failure, strictly returns false (no broad includes fallback).
 *
 * @param {string} url - Request URL
 * @param {string[]} [allowedOrigins] - Optional list of permitted target origins for RUM
 * @returns {boolean}
 */
export function isCloudflareAnalyticsRequest(url, allowedOrigins = []) {
  if (!url || typeof url !== 'string') return false;
  try {
    const parsed = new URL(url);

    // 1. Beacon script: ONLY known official Cloudflare domain and exact /beacon.min.js path
    if (parsed.hostname === 'static.cloudflareinsights.com') {
      return parsed.pathname === '/beacon.min.js' || parsed.pathname.startsWith('/beacon.min.js/');
    }

    // 2. RUM report: strictly pathname === '/cdn-cgi/rum'
    if (parsed.pathname === '/cdn-cgi/rum') {
      return isTargetOriginAllowed(parsed, allowedOrigins);
    }

    return false;
  } catch {
    // If URL parsing fails, strictly return false without any broad includes fallback!
    return false;
  }
}

/**
 * Checks whether an error or console message corresponds to an exact request actively aborted by this blocker.
 *
 * Rules:
 * - Must involve an abort / blocked-by-client indication (ERR_BLOCKED_BY_CLIENT).
 * - Must correlate to an exact URL that was explicitly aborted by this blocker.
 * - Errors with unconfirmed origin are NEVER filtered (return false).
 * - pageerror runtime exceptions must not be passed here.
 *
 * @param {import('puppeteer-core').ConsoleMessage|string|object} errorOrMsg
 * @param {Set<string>|Array<string>} [abortedUrls] - Set of URLs explicitly aborted by this blocker
 * @returns {boolean}
 */
export function isExpectedAnalyticsBlockError(errorOrMsg, abortedUrls) {
  if (!errorOrMsg || !abortedUrls) return false;

  const urlSet = abortedUrls instanceof Set
    ? abortedUrls
    : Array.isArray(abortedUrls)
      ? new Set(abortedUrls)
      : (typeof abortedUrls[Symbol.iterator] === 'function')
        ? new Set(abortedUrls)
        : null;

  if (!urlSet || urlSet.size === 0) return false;

  let text = '';
  let errorUrl = '';

  if (typeof errorOrMsg === 'string') {
    text = errorOrMsg;
  } else if (typeof errorOrMsg === 'object') {
    if (typeof errorOrMsg.text === 'function') {
      // Puppeteer ConsoleMessage
      text = errorOrMsg.text();
      const loc = typeof errorOrMsg.location === 'function' ? errorOrMsg.location() : errorOrMsg.location;
      errorUrl = loc?.url || '';
    } else {
      text = errorOrMsg.text || errorOrMsg.message || String(errorOrMsg);
      errorUrl = errorOrMsg.url || errorOrMsg.location?.url || '';
    }
  }

  // Must be a network abort indicator
  const hasBlockIndicator =
    text.includes('ERR_BLOCKED_BY_CLIENT') ||
    text.includes('net::ERR_BLOCKED_BY_CLIENT');

  if (!hasBlockIndicator) return false;

  // Exact matching:
  // 1. If error has location.url (or explicit url), compare ONLY that URL against the aborted set
  if (errorUrl) {
    return urlSet.has(errorUrl);
  }

  // 2. If no location.url, extract complete URL(s) from error text and perform exact matching
  const extractedUrls = text.match(/https?:\/\/[^\s'",<>)]+/g) || [];
  if (extractedUrls.length > 0) {
    return extractedUrls.some((u) => urlSet.has(u));
  }

  return false;
}

/**
 * Filter out expected analytics block errors from an array of console/page errors,
 * leaving only true business and runtime errors.
 *
 * @param {Array<string|object>} errors
 * @param {Set<string>|Array<string>} [abortedUrls]
 * @returns {Array<string|object>}
 */
export function filterRealErrors(errors, abortedUrls) {
  if (!Array.isArray(errors)) return [];
  return errors.filter((err) => !isExpectedAnalyticsBlockError(err, abortedUrls));
}

/**
 * Configures request interception on a Puppeteer page to block or audit Cloudflare Web Analytics.
 * MUST be called before page.goto()!
 *
 * @param {import('puppeteer-core').Page} page
 * @param {object} [options]
 * @param {boolean} [options.allowAnalytics] - Set true to permit Beacon sending (explicit audit mode). Defaults to process.env.ALLOW_ANALYTICS === 'true'.
 * @param {boolean} [options.silent] - Suppress console log on block. Defaults to false.
 * @param {string[]} [options.allowedOrigins] - Optional list of permitted target origins for RUM
 * @param {function} [options.onBlocked] - Optional callback when request is blocked: (info) => void
 * @param {function} [options.onAllowed] - Optional callback when request is allowed: (info) => void
 * @returns {Promise<{
 *   getBlockedRequests: () => Array<{ url: string, method: string, timestamp: string, type: string }>,
 *   getAllowedRequests: () => Array<{ url: string, method: string, timestamp: string, type: string }>,
 *   getAbortedUrls: () => Set<string>,
 *   isExpectedBlockError: (errorOrMsg: any) => boolean,
 *   isAnalyticsAllowed: boolean
 * }>}
 */
export async function setupAnalyticsBlocker(page, options = {}) {
  const allowAnalytics = options.allowAnalytics ?? (process.env.ALLOW_ANALYTICS === 'true');
  const silent = options.silent ?? false;
  const allowedOrigins = options.allowedOrigins || [];

  const blockedRequests = [];
  const allowedRequests = [];
  const abortedUrls = new Set();

  await page.setRequestInterception(true);

  page.on('request', (req) => {
    if (req.isInterceptResolutionHandled && req.isInterceptResolutionHandled()) {
      return;
    }

    const url = req.url();
    if (isCloudflareAnalyticsRequest(url, allowedOrigins)) {
      let isRum = false;
      try {
        isRum = new URL(url).pathname === '/cdn-cgi/rum';
      } catch {
        isRum = false;
      }
      const type = isRum ? 'rum_report' : 'beacon_script';
      const info = {
        url,
        method: req.method(),
        timestamp: new Date().toISOString(),
        type,
      };

      if (!allowAnalytics) {
        blockedRequests.push(info);
        abortedUrls.add(url);
        if (typeof options.onBlocked === 'function') {
          options.onBlocked(info);
        }
        if (!silent) {
          console.log(`🛡️ [Analytics Blocker] Blocked ${type} (${req.method()}) to prevent CF stats pollution: ${url}`);
        }
        req.abort('blockedbyclient');
      } else {
        allowedRequests.push(info);
        if (typeof options.onAllowed === 'function') {
          options.onAllowed(info);
        }
        console.log(`⚠️ [ANALYTICS VERIFICATION MODE] Allowed ${type} at ${info.timestamp}: ${url}`);
        req.continue();
      }
    } else {
      req.continue();
    }
  });

  return {
    getBlockedRequests: () => [...blockedRequests],
    getAllowedRequests: () => [...allowedRequests],
    getAbortedUrls: () => new Set(abortedUrls),
    isExpectedBlockError: (errorOrMsg) => isExpectedAnalyticsBlockError(errorOrMsg, abortedUrls),
    isAnalyticsAllowed: allowAnalytics,
  };
}
