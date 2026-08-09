import { createBrowserRouter } from "react-router-dom";
import { App } from "./App";
import { CitiesPage } from "./pages/CitiesPage";
import { EventsPage } from "./pages/EventsPage";
import { EventDetailPage } from "./pages/EventDetailPage";
import { OrganizationsPage } from "./pages/OrganizationsPage";
import { OrganizationDetailPage } from "./pages/OrganizationDetailPage";
import { VenuesPage } from "./pages/VenuesPage";
import { CategoriesPage } from "./pages/CategoriesPage";
import { SettingsPage } from "./pages/SettingsPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <CitiesPage /> },
      { path: "cities", element: <CitiesPage /> },
      { path: "events", element: <EventsPage /> },
      { path: "events/:id", element: <EventDetailPage /> },
      { path: "organizations", element: <OrganizationsPage /> },
      { path: "organizations/:slug", element: <OrganizationDetailPage /> },
      { path: "venues", element: <VenuesPage /> },
      { path: "categories", element: <CategoriesPage /> },
      { path: "settings", element: <SettingsPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);