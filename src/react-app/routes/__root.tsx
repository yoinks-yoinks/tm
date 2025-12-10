import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { NavigationProgress } from "@/components/navigation-progress";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
      <NavigationProgress />
      <Outlet />
    </React.Fragment>
  );
}
