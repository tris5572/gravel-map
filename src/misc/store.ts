import { create } from 'zustand';
import { RouteData, routeDataFromFile } from '../data/data';

type AppState = {
  data: RouteData[];
  setData: (data: RouteData[]) => void;
  // setSelected: (key: string) => void;
  selectedData: RouteData | undefined;
  setSelectedData: (data: RouteData) => void;
};

export const useAppState = create<AppState>((set, get) => ({
  data: routeDataFromFile(),
  setData(data) {
    set({ data });
  },
  // setSelected(key) {
  //   const array = [];
  //   for (const d of get().data) {
  //     if (d.key === key) {
  //       d.width = 500;
  //     }
  //     array.push(d);
  //   }
  //   set({ data: array });
  // },
  selectedData: undefined,
  setSelectedData(data) {
    set({ selectedData: data });
  },
}));
