import { create } from "zustand";

interface GlobalStore {
  currentUser: string | null;
}

interface IActions {
  setCurrentUser: (name: string) => void;
}

const useGlobal = create<GlobalStore & IActions>((set) => ({
  currentUser: null,
  setCurrentUser: (name) => set({ currentUser: name }),
}));

export default useGlobal;
