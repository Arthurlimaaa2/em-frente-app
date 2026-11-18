import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { getRouter } from "./router.jsx";

import "./index.css";

import { Widgets, isAndroid } from "./lib/native-widgets";

const router = getRouter();

async function navigateFromWidget() {
  if (!isAndroid()) return;
  try {
    const { path } = await Widgets.getLaunchPath();
    if (path === "/criar/enfrentamento") await router.navigate({ to: path });
  } catch { /* A normal launch remains available without widgets. */ }
}

if (isAndroid()) window.addEventListener("emfrente:widget-navigation", navigateFromWidget);

router.load().then(() => {
  createRoot(document.getElementById("root")).render(<RouterProvider router={router} />);
  void navigateFromWidget();
});
