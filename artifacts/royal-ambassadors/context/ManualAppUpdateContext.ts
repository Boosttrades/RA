import { createContext, useContext } from "react";

const ManualAppUpdateContext = createContext<(() => void) | null>(null);

export const ManualAppUpdateProvider = ManualAppUpdateContext.Provider;

export function useManualAppUpdate(): () => void {
  const checkForUpdates = useContext(ManualAppUpdateContext);
  if (!checkForUpdates) {
    throw new Error("useManualAppUpdate must be used inside ManualAppUpdateProvider.");
  }
  return checkForUpdates;
}
