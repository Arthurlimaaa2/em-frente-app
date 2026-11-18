import { Capacitor, registerPlugin } from "@capacitor/core";
export const Widgets = registerPlugin("EmFrenteWidgets");
export const isAndroid = () => Capacitor.getPlatform() === "android";

