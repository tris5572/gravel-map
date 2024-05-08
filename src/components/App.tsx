import { useMemo } from 'react';
import Map, { GeolocateControl, NavigationControl, ScaleControl, useControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { DeckProps, PickingInfo } from '@deck.gl/core';
import { MapboxOverlay } from '@deck.gl/mapbox';
import './App.css';

import { useAppState } from '../misc/store';
import { RouteData, pathLayerFromData } from '../data/data';
import { isSmartphone } from '../misc/util';
import { GitHub } from './GitHub';

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
 * MapLibre のコントロールを有効化するためのオーバーレイ
 *
 * @see https://deck.gl/docs/developer-guide/base-maps/using-with-maplibre
 * @see https://deck.gl/docs/api-reference/mapbox/mapbox-overlay
 */
function DeckGLOverlay(props: DeckProps) {
  const [selectedData, setSelectedData] = useAppState((st) => [st.selectedData, st.setSelectedData]);

  /**
   * ツールチップを生成する。
   * ホバー・タップ判定時に zustand で管理されるアプリのステートにアクセスするため、コンポーネント内に記述。
   * className でスタイルを与えても padding だけは反映されなかったため、スタイルを直書き。
   */
  function getTooltip({ object }: PickingInfo) {
    if (!object) {
      return null;
    }
    if (object.kind === 'route-data') {
      const data = object as RouteData;
      const str = `${'★'.repeat(data.gravel)}<br /><b>${data.name}</b><br />${data.description}`;
      setSelectedData(data); // 選択されている線を太くする
      // className で指定しても display と transform はデフォルトが優先されるので、 style として指定。
      // @see https://github.com/visgl/deck.gl/blob/fa029dddebc43f350cef07cf8e9fe86d98415c02/modules/core/src/lib/tooltip.ts#L93
      return {
        html: str,
        style: isSmartphone() ? SP_STYLE : PC_STYLE,
      };
    }
    return null;
  }

  const data = useAppState((st) => st.data);
  const mainLayer = useMemo(() => pathLayerFromData(data), [data]);

  const selectedLayer = selectedData ? pathLayerFromData(selectedData, true) : null;

  const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay(props));
  overlay.setProps({ ...props, getTooltip, layers: [mainLayer, selectedLayer], pickingRadius: 8 });
  return null;
}

/**
 * アプリのメインコンポーネント
 */
export function App() {
  return (
    <>
      <div style={{ width: '100dvw', height: '100dvh', position: 'absolute', left: 0, top: 0 }}>
        <Map
          reuseMaps
          initialViewState={{
            longitude: 139.54,
            latitude: 35.74,
            zoom: 9,
          }}
          mapStyle={`${import.meta.env.BASE_URL}style.json`}
        >
          <NavigationControl />
          <GeolocateControl />
          <ScaleControl />
          <DeckGLOverlay />
        </Map>
        <GitHub />
      </div>
    </>
  );
}
