// ---------------------------------------------------------------------------
// Tiny in-memory request cache with in-flight de-duplication.
//
// Why this exists
// ---------------
// The app used to re-fetch from the API on every page mount and every revisit
// (Products -> Categories -> Products would hit GET /product twice). On top of
// that, whenever two things asked for the same resource at the same moment, two
// identical network requests went out. This module fixes both:
//
//   1. Caching        - the first successful response for a key is stored and
//                        reused on subsequent calls (until it expires or is
//                        invalidated), so revisiting a page makes no request.
//
//   2. De-duplication - while a request for a key is in flight, any other call
//                        for the SAME key reuses the same Promise instead of
//                        firing a second request. This is what actually kills
//                        the "every request is sent twice" symptom, no matter
//                        what triggers the duplicate call:
//                          * two components reading the same resource at once,
//                          * a component that mounts/unmounts/remounts quickly,
//                          * React.StrictMode, which in DEVELOPMENT intentionally
//                            invokes effects twice to surface bugs. (In a
//                            PRODUCTION build StrictMode does nothing and effects
//                            run once, so this is purely a dev-time concern - but
//                            the de-dup makes it a non-issue either way.)
//
// It is deliberately framework-agnostic and dependency-free: a Map for stored
// values, a Map for in-flight promises. State lives for the lifetime of the tab
// and resets on a hard reload, which is the safe default for a marketplace.
// ---------------------------------------------------------------------------

// key -> { data, expires }   (expires === 0 means "never expires")
const store = new Map();

// key -> Promise            (requests currently in flight)
const inflight = new Map();

// Default time a cached entry is considered fresh: 5 minutes.
const DEFAULT_TTL = 5 * 60 * 1000;

// Read a still-fresh value, or undefined when missing / expired.
export const getCached = (key) => {
    const entry = store.get(key);

    if (!entry) return undefined;

    if (entry.expires && entry.expires < Date.now()) {
        store.delete(key);

        return undefined;
    }

    return entry.data;
};

// Store a value under a key with an optional TTL (0 = keep until invalidated).
export const setCached = (key, data, ttl = DEFAULT_TTL) => {
    store.set(key, { data, expires: ttl ? Date.now() + ttl : 0 });
};

// Drop cached entries. With no prefix it clears everything; with a prefix it
// clears every key that starts with it (e.g. "products:" after a mutation).
export const invalidate = (prefix) => {
    for (const key of store.keys()) {
        if (!prefix || key.startsWith(prefix)) store.delete(key);
    }
};

// Heart of the module.
// - Returns the cached value when one is still fresh (no network call).
// - Otherwise runs `fetcher`, but if an identical request is already running it
//   returns that same Promise so only ONE request ever reaches the network.
// - Only successful results are cached; failures are not stored and the
//   in-flight slot is always released so the next call can retry.
export const cachedRequest = async (key, fetcher, ttl = DEFAULT_TTL) => {
    const cached = getCached(key);
    if (cached !== undefined) return cached;

    if (inflight.has(key)) return inflight.get(key);

    const promise = (async () => {
        try {
            const data = await fetcher();

            setCached(key, data, ttl);

            return data;
        } finally {
            inflight.delete(key);
        }
    })();

    inflight.set(key, promise);

    return promise;
};
