import { Outlet } from "react-router-dom";
import { Shell } from "./Shell";

export function PrivateLayout() {
  return (
    <Shell>
      <Outlet />
    </Shell>
  );
}
