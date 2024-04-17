import { PathLayer } from '@deck.gl/layers';
import type { PickingInfo } from '@deck.gl/core';

import FILE from './data.json';
import { colorFromGravelLevel } from './constants';
import { isSmartphone } from '../misc/util';

// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -

/**
 * PCで適用するスタイル。
 * マウスカーソルの位置に応じて表示する。
 */
const PC_STYLE: Partial<CSSStyleDeclaration> = {
  borderRadius: '8px',
  maxWidth: '18rem',
  background: 'hsla(200, 20%, 10%, 0.8)',
  padding: '0.3rem 0.8rem 0.4rem',
  left: '-4rem',
};

/**
 * スマートフォンで適用するスタイル。
 * 画面上部中央に表示する。
 */
const SP_STYLE: Partial<CSSStyleDeclaration> = {
  borderRadius: '8px',
  background: 'hsla(200, 20%, 10%, 0.8)',
  padding: '0.3rem 0.8rem 0.4rem',
  transform: 'translate(0, 0)',
  top: '1rem',
  left: '10%',
  marginRight: '15%',
};

// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -

/**
 * ツールチップを生成する。
 * className でスタイルを与えても padding だけは反映されなかったため、スタイルを直書き。
 */
export function getTooltip({ object }: PickingInfo) {
  if (!object) {
    return null;
  }
  if (object.kind === 'route-data') {
    const data = object as RouteData;
    const str = `${'★'.repeat(data.gravel)}<br /><b>${data.name}</b><br />${data.description}`;
    // className で指定しても display と transform はデフォルトが優先されるので、 style として指定。
    // @see https://github.com/visgl/deck.gl/blob/fa029dddebc43f350cef07cf8e9fe86d98415c02/modules/core/src/lib/tooltip.ts#L93
    return {
      html: str,
      style: isSmartphone() ? SP_STYLE : PC_STYLE,
    };
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
    getColor: (d) => colorFromGravelLevel(d.gravel),
    getPath: (d: RouteData) => {
      return d.coordinates;
    },
    getWidth: 10,
    widthUnits: 'meters',
    widthMinPixels: 4,
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
type RouteData = {
  kind: 'route-data';
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
    kind: 'route-data',
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
