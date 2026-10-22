/** Shared paper edges keep the artwork and clickable sectors aligned. */
type Point = [number, number];
const horizon = 91;
const rounded = (n: number) => Number(n.toFixed(3));

/** Perimeter anchors partition the entire sky rectangle into equal areas. */
export function fanEdges(
  count: number,
  weights = Array<number>(count).fill(1),
): Point[] {
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  return Array.from({ length: count + 1 }, (_, i) => {
    const fraction =
      weights.slice(0, i).reduce((sum, weight) => sum + weight, 0) / total;
    if (fraction < 0.25) return [0, horizon * (1 - fraction * 4)];
    if (fraction > 0.75) return [100, horizon * (fraction * 4 - 3)];
    return [200 * fraction - 50, 0];
  });
}

function tornEdge([x, y]: Point, seed: number): Point[] {
  const noise = Array.from({ length: 43 }, (_, i) => {
    const t = i / 42;
    const bend = Math.sin(t * Math.PI * 2) * Math.sin(seed * 2.1) * 1.2;
    const tooth = Math.sin(i * 2.37 + seed) * 0.85 + Math.cos(i * 4.19) * 0.46;
    return i === 0 || i === 42 ? 0 : bend + tooth * Math.sin(t * Math.PI);
  });
  // Remove the integrated displacement: torn detail must not change sector area.
  const correction =
    noise.reduce((sum, n) => sum + n, 0) /
    noise.reduce((sum, _, i) => sum + Math.sin((i / 42) * Math.PI), 0);
  return noise.map((n, i) => {
    const t = i / 42;
    return [
      rounded(x + (50 - x) * t + n - correction * Math.sin(t * Math.PI)),
      rounded(y + t * (horizon - y)),
    ];
  });
}

const polygon = (points: Point[]) =>
  points.map(([x, y]) => `${x},${y}`).join(' ');

export function fanTears(count: number, weights?: number[]) {
  return fanEdges(count, weights)
    .slice(1, -1)
    .map((anchor, seed) => {
      const edge = tornEdge(anchor, seed + 1);
      const side = (direction: number): Point[] =>
        edge.map(([px, py], i) => {
          const width =
            (0.32 + Math.abs(Math.sin(i * 1.79 + seed)) * 0.7) * (1 - i / 44);
          return [rounded(px + direction * width), py];
        });
      return {
        paper: polygon([...side(-1), ...side(1).reverse()]),
        fibers: edge
          .slice(2, -3)
          .filter((_, i) => i % 2 === 0)
          .map(([px, py], i) => {
            const direction = i % 2 === 0 ? 1 : -1;
            const reach = (0.4 + (i % 4) * 0.22) * (1 - py / 110);
            return `M ${px} ${py} q ${rounded(direction * reach * 0.55)} -0.8 ${rounded(direction * reach)} ${rounded(-1.2 - (i % 3) * 0.45)}`;
          }),
      };
    });
}

export function fanSector(index: number, count: number, weights?: number[]) {
  const edges = fanEdges(count, weights);
  const left = edges[index];
  const right = edges[index + 1];
  const leftSide = tornEdge(left, index);
  const rightSide = tornEdge(right, index + 1);
  const perimeter = ([x, y]: Point) =>
    x === 0 ? horizon - y : x === 100 ? horizon + 100 + y : horizon + x;
  const corners: Point[] = [
    [0, 0],
    [100, 0],
  ];
  const between = corners.filter(
    (corner) =>
      perimeter(corner) > perimeter(left) &&
      perimeter(corner) < perimeter(right),
  );
  const points = [left, ...between, ...rightSide, ...leftSide.toReversed()];
  const positions = [
    { x: 14.5, y: 51, mobileY: 54, angle: -8 },
    { x: 34, y: 29, mobileY: 30, angle: -4 },
    { x: 65, y: 26, mobileY: 27, angle: 5 },
    { x: 85.5, y: 48, mobileY: 51, angle: 8 },
  ];
  const position =
    count === 4
      ? positions[index]
      : { x: (100 * (index + 0.5)) / count, y: 32, mobileY: 32, angle: 0 };
  // Horizontal insets at every boundary vertex preserve each concave tooth.
  // Scaling a jagged polygon can push some points across its original edge.
  const slices = [...new Set(points.map(([, y]) => y))]
    .filter((y) => y > 1.5 && y < 79)
    .sort((a, b) => a - b)
    .flatMap((y) => {
      const intersections: number[] = [];
      points.forEach(([x1, y1], i) => {
        const [x2, y2] = points[(i + 1) % points.length];
        if ((y1 <= y && y2 > y) || (y2 <= y && y1 > y))
          intersections.push(x1 + ((y - y1) / (y2 - y1)) * (x2 - x1));
      });
      const left = Math.min(...intersections) + 1.1;
      const right = Math.max(...intersections) - 1.1;
      return right > left ? [{ left, right, y }] : [];
    });
  const contentPoints: Point[] = [
    ...slices.map(({ right, y }): Point => [rounded(right), y]),
    ...slices.toReversed().map(({ left, y }): Point => [rounded(left), y]),
  ];
  const clip = (outline: Point[]) =>
    `polygon(${outline.map(([x, y]) => `${x}% ${y}%`).join(',')})`;
  return {
    points: polygon(points),
    outline: points,
    contentOutline: contentPoints,
    clip: clip(points),
    contentClip: clip(contentPoints),
    center: position.x,
    top: position.y,
    mobileTop: position.mobileY,
    angle: position.angle,
    width: 21,
  };
}
