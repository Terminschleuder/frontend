import { describe, it, expect } from "vitest";
import { http, HttpResponse } from "msw";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { EventCard } from "@/components/events/EventCard";
import { EventDetailPage } from "@/pages/EventDetailPage";
import { eventFixture, TEST_API_URL } from "./handlers";
import { server } from "./server";
import { renderWithProviders } from "./test-utils";
import type { Event } from "@/api/types";

const noHero: Partial<Event> = {
  hero_image: null,
  venue: null,
  latitude: null,
  longitude: null,
};

describe("EventCard hero fallback", () => {
  it("shows the placeholder image when hero_image is null", () => {
    render(
      <MemoryRouter>
        <EventCard event={{ ...eventFixture, ...noHero } as unknown as Event} />
      </MemoryRouter>,
    );
    const img = screen.getByRole("img", { name: /Berlin Python Meetup #42/i });
    expect(img).toHaveAttribute("src", "/placeholder-hero.svg");
  });

  it("shows the real hero image when present", () => {
    render(
      <MemoryRouter>
        <EventCard event={{ ...eventFixture } as unknown as Event} />
      </MemoryRouter>,
    );
    const img = screen.getByRole("img", { name: /Berlin Python Meetup #42/i });
    expect(img.getAttribute("src")).toContain("berlin-python-meetup-42.png");
  });
});

describe("EventDetailPage hero fallback", () => {
  it("shows the placeholder banner when the API returns no hero_image", async () => {
    // No hero, no location → avoids the (lazy) map in jsdom. The client
    // requests the detail URL with a trailing slash; match it broadly.
    server.use(
      http.get(`${TEST_API_URL}/api/events/:id/`, () =>
        HttpResponse.json({ ...eventFixture, ...noHero }),
      ),
    );
    renderWithProviders(
      <Routes>
        <Route path="/events/:id" element={<EventDetailPage />} />
      </Routes>,
      { initialRoutes: ["/events/42"] },
    );
    await waitFor(() => {
      expect(
        screen.getByRole("img", { name: /Berlin Python Meetup #42/i }),
      ).toHaveAttribute("src", "/placeholder-hero.svg");
    });
  });
});