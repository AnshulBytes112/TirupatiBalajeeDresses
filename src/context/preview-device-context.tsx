"use client";

import * as React from "react";

export type PreviewDevice = "desktop" | "tablet" | "mobile";

const PreviewDeviceContext = React.createContext<PreviewDevice | undefined>(undefined);

export function PreviewDeviceProvider({
  value,
  children,
}: {
  value?: PreviewDevice;
  children: React.ReactNode;
}) {
  return (
    <PreviewDeviceContext.Provider value={value}>
      {children}
    </PreviewDeviceContext.Provider>
  );
}

export function usePreviewDevice(): PreviewDevice | undefined {
  return React.useContext(PreviewDeviceContext);
}
