import { z } from "zod";

/**
 * Runtime validation of the response shapes we render — a cheap drift detector.
 * If the API and the schema ever disagree, zod throws and the demo surfaces a
 * visible error instead of rendering garbage. Keep these aligned with types.ts
 * and the backend serializers.
 */

const nullable = <T extends z.ZodTypeAny>(s: T) => s.nullable();

export const CitySchema = z.object({
  id: z.number(),
  geoname_id: nullable(z.number()),
  name: z.string(),
  slug: z.string(),
  country: z.string(),
  country_code: z.string(),
  latitude: nullable(z.number()),
  longitude: nullable(z.number()),
  default_radius_km: z.number(),
  population: nullable(z.number()),
  timezone: z.string(),
});

export const CategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
});

export const VenueSchema = z.object({
  id: z.number(),
  name: z.string(),
  address: z.string(),
  city: z.string(),
  latitude: nullable(z.number()),
  longitude: nullable(z.number()),
  capacity: nullable(z.number()),
});

export const OrganizationSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  website: z.string(),
});

export const EventSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  starts_at: z.string(),
  ends_at: nullable(z.string()),
  hero_image: nullable(z.string()),
  venue: nullable(VenueSchema),
  organization: nullable(OrganizationSchema),
  categories: z.array(CategorySchema),
  capacity: nullable(z.number()),
  status: z.enum(["draft", "published", "cancelled", "archived"]),
  event_type: z.enum(["meetup", "conference", "workshop", "social", "other"]),
  attendance_mode: z.enum(["physical", "online", "hybrid"]),
  published_at: nullable(z.string()),
  cancelled_at: nullable(z.string()),
  original_url: z.string(),
  original_platform: z.string(),
  source: nullable(z.object({ id: z.number(), url: z.string(), platform: z.string() })),
  promoted_from: nullable(
    z.object({
      id: z.number(),
      title: z.string(),
      starts_at: z.string(),
      url: z.string(),
      platform: z.string(),
      status: z.enum(["pending", "accepted", "rejected", "promoted"]),
    }),
  ),
  created_by: nullable(z.number()),
  created_at: z.string(),
  updated_at: z.string(),
  distance: nullable(z.number()),
  latitude: nullable(z.number()),
  longitude: nullable(z.number()),
});

export const PaginatedSchema = <T extends z.ZodTypeAny>(item: T) =>
  z.object({
    count: z.number(),
    next: nullable(z.string()),
    previous: nullable(z.string()),
    results: z.array(item),
  });

export const CityListSchema = PaginatedSchema(CitySchema);
export const EventListSchema = PaginatedSchema(EventSchema);
export const OrganizationListSchema = PaginatedSchema(OrganizationSchema);
export const VenueListSchema = PaginatedSchema(VenueSchema);
export const CategoryListSchema = PaginatedSchema(CategorySchema);