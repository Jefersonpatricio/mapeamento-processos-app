import React from "react";

export type Direction = "TB" | "LR";

export const SelectedNodeContext = React.createContext<string | null>(null);
export const DirectionContext = React.createContext<Direction>("TB");
