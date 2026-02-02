import { PathLayer } from '@deck.gl/layers';
import { colorFromGravelLevel } from './constants';
import FILE from './data.json';

// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -

/**
 * ファイルのデータを元に、レイヤーを生成する。
 */
// export function layerFromRouteData(): PathLayer {
//   return new PathLayer<RouteData>({
//     id: 'route-path',
//     data: routeDataFromFile(),
//     getColor: (d) => colorFromGravelLevel(d.gravel),
//     getPath: (d: RouteData) => {
//       return d.coordinates;
//     },
//     getWidth: (d) => (d.isSelected ? 500 : 10),
//     widthUnits: 'meters',
//     widthMinPixels: 4,
//     pickable: true,
//     capRounded: true,
//     jointRounded: true,
//   });
// }

/**
 * 渡されたデータを元に PathLayer を生成する。
 * @param data ルートデータ。配列 or 1つ。
 * @param isSelected 選択状態かどうかのフラグ。選択されていると太く表示する。
 * @returns PathLayer
 */
export function pathLayerFromData(data: RouteData | RouteData[], isSelected: boolean = false) {
  return new PathLayer<RouteData>({
    id: `route-path-${isSelected && 'selected'}`,
    data: Array.isArray(data) ? data : [data],
    getColor: (d) => colorFromGravelLevel(d.gravel),
    getPath: (d: RouteData) => {
      return d.coordinates;
    },
    getWidth: isSelected ? 40 : 10,
    widthUnits: 'meters',
    widthMinPixels: isSelected ? 8 : 4,
    pickable: true,
    capRounded: true,
    jointRounded: true,
  });
}

// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -

/**
 * データファイルのルートの型
 */
type FileRoute = {
  name: string;
  gra: number;
  wid: number;
  slp: number;
  desc: string;
  cods: [number, number][] | [];
};

/**
 * ルートデータの型
 */
export type RouteData = {
  kind: 'route-data';
  /** 名前 */
  name: string;
  key: string;
  /** グラベルレベル */
  gravel: number;
  /** 道幅レベル */
  width: number;
  /** 斜度レベル */
  slope: number;
  /** 説明 */
  description: string;
  /** 座標の並び */
  coordinates: [number, number][];
};

/**
 * ファイルのルートデータをパースし、アプリで使用するルートデータを生成する
 */
function parseRouteData(source: FileRoute): RouteData | undefined {
  if (source.cods.length === 0) {
    return undefined;
  }

  // 緯度と経度を逆転させる（データは「緯度・経度」の順だが、MapLibreでは「経度・緯度」であるため）
  const coordinates: [number, number][] = [];
  for (const c of source.cods) {
    coordinates.push([c[1], c[0]]);
  }

  return {
    kind: 'route-data',
    key: keyFromFileRoute(source),
    name: source.name,
    gravel: source.gra,
    width: source.wid,
    slope: source.slp,
    description: source.desc,
    coordinates,
  };
}

/**
 * ファイルの情報を元に、ルートデータを生成する
 */
export function routeDataFromFile(): RouteData[] {
  const list = [];

  for (const r of FILE.routes) {
    const data = r as FileRoute;
    const d = parseRouteData(data);
    if (d !== undefined) {
      list.push(d);
    }
  }

  return list;
}

/**
 * ルートデータのキーを生成する
 */
export function keyFromData(data: RouteData): string {
  // データは 経度-緯度 の順
  return `${data.name}-${data.coordinates[0][1]}`;
}

/**
 * ルートデータのキーを、ファイルから読み取ったデータを元に生成する。
 * データ読込時のみに使用する。
 * 生成されるキーを `keyFromData()` と合わせる必要がある。
 */
function keyFromFileRoute(data: FileRoute): string {
  // ファイルの中身は 緯度-経度 の順
  return `${data.name}-${data.cods[0][0]}`;
}
