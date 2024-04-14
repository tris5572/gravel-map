import { PathLayer } from '@deck.gl/layers';

import type { PickingInfo } from '@deck.gl/core';

type PathData = {
  coordinates: [number, number][];
};

const DATA: PathData[] = [
  {
    coordinates: [
      [139.7345854, 35.7056804],
      [139.7658193, 35.6708245],
    ],
  },
  {
    coordinates: [
      [139.7488565, 35.6709639],
      [139.7958789, 35.7139042],
    ],
  },
];

export function pathLayers(): PathLayer[] {
  const layers = [];

  const layer = new PathLayer<PathData>({
    id: 'path',
    data: DATA,
    getColor: [255, 0, 0, 150],
    getPath: (d: PathData) => {
      return d.coordinates;
    },
    getWidth: 6,
    pickable: true,
    widthUnits: 'pixels',
    capRounded: true,
  });
  layers.push(layer);

  return layers;
}

export function getTooltip({ object }: PickingInfo) {
  if (!object) {
    return null;
  }
  // else if(object instanceof PathData){

  // }
  return JSON.stringify(object);
}
