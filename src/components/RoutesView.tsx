import { FillLayer, Layer, Source } from 'react-map-gl';

/**
 * 経路を表示するコンポーネント。
 * Map の子要素として配置すること。
 */
export function RoutesView() {
  // const map = useMap();

  return (
    <>
      {/* <Line /> */}
      <Area />
    </>
  );
}

// type LineProps = { points?: [number, number][] };

// function Line(_props: LineProps) {
//   const layer: LineLayer = {
//     id: 'line-test',
//     type: 'line',
//     interactive: true,
//     layout: {},
//     paint: {
//       'line-color': '#FF0000AA',
//       'line-width': 6,
//     },
//   };
//   const source: GeoJSON.Feature<GeoJSON.Geometry> = {
//     type: 'Feature',
//     properties: {},
//     geometry: {
//       type: 'LineString',
//       coordinates: [
//         [139.7345854, 35.7056804],
//         [139.7658193, 35.6708245],
//       ],
//     },
//   };

//   return (
//     <Source id="line-layer" type="geojson" data={source}>
//       <Layer {...layer} />
//     </Source>
//   );
// }

function Area() {
  const layer: FillLayer = {
    id: 'line-test',
    type: 'fill',
    layout: {},
    paint: {
      'fill-color': '#AA000055',
    },
  };
  const source: GeoJSON.Feature<GeoJSON.Geometry> = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [139.7, 35.7],
          [139.7, 35.6],
          [139.6, 35.6],
          [139.6, 35.7],
          [139.7, 35.7],
        ],
      ],
    },
  };
  return (
    <Source id="area-layer" type="geojson" data={source}>
      <Layer {...layer} />
    </Source>
  );
}
