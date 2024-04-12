import { Layer, LineLayer, Source, useMap } from 'react-map-gl';

/**
 * 経路を表示するコンポーネント。
 * Map の子要素として配置すること。
 */
export function RoutesView() {
  const map = useMap();

  return <Line />;
}

type LineProps = { points?: [number, number][] };

function Line(props: LineProps) {
  const layer: LineLayer = {
    id: 'line-test',
    type: 'line',
    source: 'route',
    layout: {},
    paint: {
      'line-color': 'red',
      'line-width': 6,
    },
  };
  const source: GeoJSON.Feature<GeoJSON.Geometry> = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: [
        [139.7345854, 35.7056804],
        [139.7658193, 35.6708245],
      ],
    },
  };

  return (
    <Source id="line-layer" type="geojson" data={source}>
      <Layer {...layer} />
    </Source>
  );
}
