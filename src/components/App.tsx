import Map, { GeolocateControl, NavigationControl, ScaleControl, useControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { DeckProps, PickingInfo } from '@deck.gl/core';
import { MapboxOverlay } from '@deck.gl/mapbox';
import { RouteData, keyFromData, layerFromRouteData, pathLayerFromData } from '../data/data';
import './App.css';
import { useEffect, useMemo, useState } from 'react';
import { useAppState } from '../misc/store';
import { isSmartphone } from '../misc/util';
import { PathLayer } from '@deck.gl/layers';

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
  // const setSelected = useAppState((st) => st.setSelected);
  const [selectedData, setSelectedData] = useAppState((st) => [st.selectedData, st.setSelectedData]);

  /**
   * ツールチップを生成する。
   * className でスタイルを与えても padding だけは反映されなかったため、スタイルを直書き。
   */
  function getTooltip({ object }: PickingInfo) {
    if (!object) {
      return null;
    }

    if (object.kind === 'route-data') {
      const data = object as RouteData;
      const str = `${'★'.repeat(data.gravel)}<br /><b>${data.name}</b><br />${data.description}`;
      setSelectedData(data);

      // className で指定しても display と transform はデフォルトが優先されるので、 style として指定。
      // @see https://github.com/visgl/deck.gl/blob/fa029dddebc43f350cef07cf8e9fe86d98415c02/modules/core/src/lib/tooltip.ts#L93
      return {
        html: str,
        style: isSmartphone() ? SP_STYLE : PC_STYLE,
      };
    }
    return null; //JSON.stringify(object);
  }

  const data = useAppState((st) => st.data);
  const mainLayer = useMemo(() => pathLayerFromData(data), [data]);

  const selectedLayer = selectedData ? pathLayerFromData(selectedData, true) : null;

  const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay(props));
  overlay.setProps({ ...props, getTooltip, layers: [mainLayer, selectedLayer] });
  return null;
}

export function App() {
  // const [flag, setFlag] = useState(false);
  // useEffect(() => {
  //   setFlag(updateFlag);
  // }, [updateFlag]);

  return (
    <div style={{ width: '100dvw', height: '100dvh', position: 'absolute', left: 0, top: 0 }}>
      <Map
        reuseMaps
        initialViewState={{
          longitude: 139.54,
          latitude: 35.74,
          zoom: 9,
        }}
        mapStyle="https://tile.openstreetmap.jp/styles/maptiler-basic-ja/style.json"
      >
        <NavigationControl />
        <GeolocateControl />
        <ScaleControl />
        <DeckGLOverlay
          //  layers={[layerFromRouteData()]}
          pickingRadius={8}
        />
      </Map>
    </div>
  );
}
