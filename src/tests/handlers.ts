import { http, HttpResponse } from "msw";

/** The API base URL used in tests. Components read it from ApiConfigProvider. */
export const TEST_API_URL = "http://test.terminschleuder.local";

/** Fixture data matching the backend serializer shapes. */
export const cityFixture = {
  id: 1,
  geoname_id: 2950159,
  name: "Berlin",
  slug: "berlin-de",
  country: "Germany",
  country_code: "DE",
  latitude: 52.52,
  longitude: 13.405,
  default_radius_km: 45,
  population: 3426354,
  timezone: "Europe/Berlin",
};

export const orgFixture = {
  id: 3,
  name: "Berlin Python Meetup",
  slug: "berlin-python-meetup",
  description: "Monthly Python talks.",
  website: "https://berlin-python.org",
};

export const eventFixture = {
  id: 42,
  title: "Berlin Python Meetup #42",
  description: "Talks and pizza.",
  starts_at: "2026-09-08T17:00:00Z",
  ends_at: null,
  hero_image: "http://test.terminschleuder.local/media/events/hero/berlin-python-meetup-42.png",
  venue: {
    id: 7,
    name: "Factory Berlin",
    address: "Rheinsberger Str. 76",
    city: "Berlin",
    latitude: 52.531,
    longitude: 13.386,
    capacity: 120,
  },
  organization: orgFixture,
  categories: [{ id: 1, name: "Tech", slug: "tech" }],
  capacity: 100,
  status: "published",
  event_type: "meetup",
  attendance_mode: "physical",
  published_at: "2026-08-20T10:00:00Z",
  cancelled_at: null,
  original_url: "https://example.com/rust-meetup",
  original_platform: "meetup",
  source: { id: 5, url: "https://example.com/meetups.ics", platform: "homepage" },
  promoted_from: {
    id: 88,
    title: "Rust Meetup",
    starts_at: "2026-09-08T17:00:00Z",
    url: "https://example.com/rust-meetup",
    platform: "meetup",
    status: "promoted",
  },
  created_by: 1,
  created_at: "2026-08-20T10:00:00Z",
  updated_at: "2026-08-20T10:00:00Z",
  distance: 1.23,
  latitude: 52.531,
  longitude: 13.386,
};

const paginated = <T,>(results: T[], count = results.length) => ({
  count,
  next: null,
  previous: null,
  results,
});

export const handlers = [
  http.get(`${TEST_API_URL}/api/cities/`, ({ request }) => {
    const url = new URL(request.url);
    const all = url.pathname.endsWith("/all/");
    if (all) return HttpResponse.json([cityFixture]);
    const search = url.searchParams.get("search") ?? "";
    const results = search && !cityFixture.name.toLowerCase().includes(search.toLowerCase())
      ? []
      : [cityFixture];
    return HttpResponse.json(paginated(results));
  }),
  http.get(`${TEST_API_URL}/api/cities/all/`, () =>
    HttpResponse.json([cityFixture]),
  ),
  http.get(`${TEST_API_URL}/api/cities/:id`, () =>
    HttpResponse.json(cityFixture),
  ),

  http.get(`${TEST_API_URL}/api/events/`, ({ request }) => {
    const url = new URL(request.url);
    const eventType = url.searchParams.get("event_type");
    const results =
      eventType && eventType !== eventFixture.event_type ? [] : [eventFixture];
    return HttpResponse.json(paginated(results));
  }),
  http.get(`${TEST_API_URL}/api/events/:id`, () =>
    HttpResponse.json(eventFixture),
  ),

  http.get(`${TEST_API_URL}/api/organizations/`, () =>
    HttpResponse.json(paginated([orgFixture])),
  ),
  http.get(`${TEST_API_URL}/api/organizations/:slug`, () =>
    HttpResponse.json(orgFixture),
  ),
  http.get(`${TEST_API_URL}/api/organizations/:slug/events/`, () =>
    HttpResponse.json(paginated([eventFixture])),
  ),

  http.get(`${TEST_API_URL}/api/venues/`, () =>
    HttpResponse.json(paginated([eventFixture.venue])),
  ),
  http.get(`${TEST_API_URL}/api/categories/`, () =>
    HttpResponse.json(paginated(eventFixture.categories)),
  ),
  http.get(`${TEST_API_URL}/api/schema/`, () =>
    HttpResponse.json({ openapi: "3.0.0", paths: {}, components: { schemas: { Event: {} } } }),
  ),
];