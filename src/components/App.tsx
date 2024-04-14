import DeckGL from '@deck.gl/react';
import Map from 'react-map-gl/maplibre';

import 'maplibre-gl/dist/maplibre-gl.css';
import './App.css';
// import { RoutesView } from './RoutesView';

export function App() {
  return (
    // <div style={{ width: '100dvw', height: '100dvh', position: 'absolute', left: 0, top: 0 }}>

    <DeckGL
      initialViewState={{
        longitude: 139.75,
        latitude: 35.685,
        zoom: 12,
      }}
      controller={true}
    >
      <Map
        reuseMaps
        // initialViewState={{
        //   longitude: 139.75,
        //   latitude: 35.685,
        //   zoom: 12,
        // }}
        mapStyle="https://tile.openstreetmap.jp/styles/maptiler-basic-ja/style.json"
        // onClick={(e) => {
        //   console.log(e.features);
        // }}
      >
        {/* <RoutesView /> */}
      </Map>
    </DeckGL>
    // </div>
  );
}
