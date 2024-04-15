export function colorFromGravelLevel(gravel: number): [number, number, number, number] {
  switch (gravel) {
    case 1:
      return [0, 0, 200, 150];
    case 2:
      return [0, 200, 0, 150];
    case 3:
      return [230, 100, 0, 150];
    case 4:
      return [200, 0, 0, 150];
    case 5:
      [200, 0, 200, 150];
  }

  return [255, 0, 0, 150];
}
