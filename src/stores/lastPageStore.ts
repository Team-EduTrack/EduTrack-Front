import { atom } from "recoil";

export const lastPageStore = atom<string>({
  key: "lastPageStore",
  default: "",
});
