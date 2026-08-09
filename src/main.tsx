import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import "./styles.css";
import { queryClient } from "@/lib/queryClient";
import { ApiConfigProvider } from "@/config/ApiConfigProvider";
import { router } from "./router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ApiConfigProvider>
        <RouterProvider router={router} />
      </ApiConfigProvider>
    </QueryClientProvider>
  </StrictMode>,
);