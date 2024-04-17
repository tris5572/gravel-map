import Map, { GeolocateControl, NavigationControl, ScaleControl, useControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { DeckProps } from '@deck.gl/core';
import { MapboxOverlay } from '@deck.gl/mapbox';
import { getTooltip, layerFromRouteData } from '../data/data';
import './App.css';

/**
 * MapLibre のコントロールを有効化するためのオーバーレイ
 *
 * @see https://deck.gl/docs/developer-guide/base-maps/using-with-maplibre
 * @see https://deck.gl/docs/api-reference/mapbox/mapbox-overlay
 */
function DeckGLOverlay(props: DeckProps) {
  const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay(props));
  overlay.setProps(props);
  return null;
}

export function App() {
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
        <DeckGLOverlay layers={[layerFromRouteData()]} getTooltip={getTooltip} pickingRadius={8} />
      </Map>
    </div>
  );
}
