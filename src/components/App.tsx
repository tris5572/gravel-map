import DeckGL from '@deck.gl/react';
import Map from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import './App.css';
import { getTooltip, layerFromRouteData } from '../data/data';

export function App() {
  return (
    <div style={{ width: '100dvw', height: '100dvh', position: 'absolute', left: 0, top: 0 }}>
      <DeckGL
        initialViewState={{
          longitude: 139.54,
          latitude: 35.74,
          zoom: 9,
        }}
        controller={true}
        layers={[layerFromRouteData()]}
        getTooltip={getTooltip}
      >
        <Map reuseMaps mapStyle="https://tile.openstreetmap.jp/styles/maptiler-basic-ja/style.json" />
      </DeckGL>
    </div>
  );
}
