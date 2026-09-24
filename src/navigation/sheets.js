// Full-screen "sheets" (add transaction, day details, profile…) live in a
// single stack rendered inside one Modal. Stacking several React Native
// Modals is unreliable on iOS, so sheets push and pop inside the same one.
import { createContext, useContext } from 'react';

export const SheetContext = createContext({
  push: () => {},
  pop: () => {},
  replace: () => {},
  closeAll: () => {},
  depth: 0,
});

export const useSheets = () => useContext(SheetContext);
