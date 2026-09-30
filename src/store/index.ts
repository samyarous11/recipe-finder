import { configureStore, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";
import type { RecipeSummary } from "../types";

const load = <T,>(key: string, fallback: T): T => {
  try { return JSON.parse(localStorage.getItem(key) ?? "") as T; } catch { return fallback; }
};

const favorites = createSlice({
  name: "favorites",
  initialState: load<RecipeSummary[]>("rf-favorites", []),
  reducers: {
    toggleFavorite(state, a: PayloadAction<RecipeSummary>) {
      const i = state.findIndex((r) => r.idMeal === a.payload.idMeal);
      if (i >= 0) state.splice(i, 1); else state.push(a.payload);
    },
  },
});

const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
const theme = createSlice({
  name: "theme",
  initialState: load<"light" | "dark">("rf-theme", prefersDark ? "dark" : "light"),
  reducers: { toggleTheme: (s) => (s === "dark" ? "light" : "dark") },
});

export const { toggleFavorite } = favorites.actions;
export const { toggleTheme } = theme.actions;

export const store = configureStore({ reducer: { favorites: favorites.reducer, theme: theme.reducer } });

store.subscribe(() => {
  const s = store.getState();
  localStorage.setItem("rf-favorites", JSON.stringify(s.favorites));
  localStorage.setItem("rf-theme", JSON.stringify(s.theme));
  document.documentElement.dataset.theme = s.theme;
});
document.documentElement.dataset.theme = store.getState().theme;

export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch = () => useDispatch<typeof store.dispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
