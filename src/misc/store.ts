import { create } from 'zustand';
import { RouteData, routeDataFromFile } from '../data/data';

type AppState = {
  /**
   * アプリで使用するルートデータの配列
   */
  data: RouteData[];
  /**
   * アプリで使用するルートデータの配列を設定する
   */
  setData: (data: RouteData[]) => void;
  /**
   * 選択されているルートデータ
   * ここに登録されているルートは太く表示される
   */
  selectedData: RouteData | undefined;
  /**
   * 選択されているルートデータを設定する
   */
  setSelectedData: (data: RouteData) => void;
};

export const useAppState = create<AppState>((set) => ({
  data: routeDataFromFile(),

  setData(data) {
    set({ data });
  },

  selectedData: undefined,

  setSelectedData(data) {
    set({ selectedData: data });
  },
}));
