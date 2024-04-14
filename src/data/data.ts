import { PathLayer } from '@deck.gl/layers';
import type { PickingInfo } from '@deck.gl/core';

import FILE from './data.json';

// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -

/**
 * ツールチップを生成する。
 * TODO: 現時点では仮実装。きちんと実装する。
 */
export function getTooltip({ object }: PickingInfo) {
  if (!object) {
    return null;
  }
  return JSON.stringify(object);
}

// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -

/**
 * ファイルのデータを元に、レイヤーを生成する。
 */
export function layerFromRouteData(): PathLayer {
  return new PathLayer<RouteData>({
    id: 'route-path',
    data: routeDataFromFile(),
    getColor: [255, 0, 0, 150],
    getPath: (d: RouteData) => {
      return d.coordinates;
    },
    getWidth: 10,
    pickable: true,
    widthUnits: 'pixels',
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
type RouteData = {
  /** 名前 */
  name: string;
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
function routeDataFromFile(): RouteData[] {
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
