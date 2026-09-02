import { create } from "zustand";

interface UIState {
  isCartOpen: boolean;
  isMenuOpen: boolean;
  isSearchOpen: boolean;
  setCartOpen: (open: boolean) => void;
  setMenuOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isCartOpen: false,
  isMenuOpen: false,
  isSearchOpen: false,
  setCartOpen: (open) => set({ isCartOpen: open }),
  setMenuOpen: (open) => set({ isMenuOpen: open }),
  setSearchOpen: (open) => set({ isSearchOpen: open }),
}));
