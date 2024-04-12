import Map, { GeolocateControl, NavigationControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import './App.css';
import { RoutesView } from './RoutesView';

function App() {
  return (
    <>
      <Map
        initialViewState={{
          longitude: 139.75,
          latitude: 35.685,
          zoom: 12,
        }}
        style={{ width: '100dvw', height: '100dvh', position: 'absolute', left: 0, top: 0 }}
        mapStyle="https://tile.openstreetmap.jp/styles/maptiler-basic-ja/style.json"
      >
        <GeolocateControl />
        <NavigationControl />

        <RoutesView />
      </Map>
    </>
  );
}

export default App;
