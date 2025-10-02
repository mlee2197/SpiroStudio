import { PathPreset, Point } from "@/types";

export const generatePresetPath = ({
  preset,
  centerX,
  centerY,
  height,
  width,
}: {
  preset: PathPreset;
  centerX: number;
  centerY: number;
  height: number;
  width: number;
}) => {
  const points: Point[] = [];
  // Padding to keep shapes away from the edge
  const padding = 64;
  // Use the smallest side minus padding for max size
  const maxSide = Math.min(width, height) - 2 * padding;

  switch (preset) {
    case "circle": {
      const radius = maxSide / 2;
      for (let i = 0; i < 60; i++) {
        const angle = (i / 60) * Math.PI * 2;
        points.push({
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius,
        });
      }
      break;
    }
    case "ellipse": {
      const radiusX = (width - 2 * padding) / 2;
      const radiusY = (height - 2 * padding) / 2;
      for (let i = 0; i < 60; i++) {
        const angle = (i / 60) * Math.PI * 2;
        points.push({
          x: centerX + Math.cos(angle) * radiusX,
          y: centerY + Math.sin(angle) * radiusY,
        });
      }
      break;
    }
    case "square": {
      const size = maxSide;
      const half = size / 2;
      const pointsPerSide = 15;
      // Top
      for (let i = 0; i < pointsPerSide; i++) {
        points.push({
          x: centerX - half + (size * i) / pointsPerSide,
          y: centerY - half,
        });
      }
      // Right
      for (let i = 0; i < pointsPerSide; i++) {
        points.push({
          x: centerX + half,
          y: centerY - half + (size * i) / pointsPerSide,
        });
      }
      // Bottom
      for (let i = 0; i < pointsPerSide; i++) {
        points.push({
          x: centerX + half - (size * i) / pointsPerSide,
          y: centerY + half,
        });
      }
      // Left
      for (let i = 0; i < pointsPerSide; i++) {
        points.push({
          x: centerX - half,
          y: centerY + half - (size * i) / pointsPerSide,
        });
      }
      break;
    }
    case "polygon": {
      const sides = 6;
      const radius = maxSide / 2;
      for (let i = 0; i < sides; i++) {
        const angle = (i / sides) * Math.PI * 2 - Math.PI / 2;
        points.push({
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius,
        });
      }
      break;
    }
    case "star": {
      const outerRadius = maxSide / 2;
      const innerRadius = outerRadius * 0.45;
      const spikes = 5;
      for (let i = 0; i < spikes * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (i / (spikes * 2)) * Math.PI * 2 - Math.PI / 2;
        points.push({
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius,
        });
      }
      break;
    }
    case "sine": {
      const amplitude = (height - 2 * padding) / 4;
      const frequency = 3;
      const sineWidth = width - 2 * padding;
      for (let i = 0; i < 100; i++) {
        const x = centerX - sineWidth / 2 + (sineWidth * i) / 100;
        const y =
          centerY + Math.sin((i / 100) * Math.PI * 2 * frequency) * amplitude;
        points.push({ x, y });
      }
      break;
    }
    case "spiral": {
      const turns = 3;
      const maxRadius = maxSide / 2;
      for (let i = 0; i < 100; i++) {
        const angle = (i / 100) * Math.PI * 2 * turns;
        const radius = (i / 100) * maxRadius;
        points.push({
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius,
        });
      }
      break;
    }
  }

  return points;
};

const getDistance = (p1: Point, p2: Point): number => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

const getTotalPathLength = (pathPoints: Point[]): number => {
  if (pathPoints.length < 2) return 0;
  let length = 0;
  const points = [...pathPoints, pathPoints[0]];
  for (let i = 0; i < points.length - 1; i++) {
    length += getDistance(points[i], points[i + 1]);
  }
  return length;
};

export const getPointOnPath = (
  progress: number,
  pathPoints: Point[]
): Point => {
  if (pathPoints.length < 2) return pathPoints[0] || { x: 0, y: 0 };

  const totalLength = getTotalPathLength(pathPoints);
  const targetLength = progress * totalLength;
  let currentLength = 0;

  const points = [...pathPoints, pathPoints[0]];

  for (let i = 0; i < points.length - 1; i++) {
    const segmentLength = getDistance(points[i], points[i + 1]);
    if (currentLength + segmentLength >= targetLength) {
      const segmentProgress = (targetLength - currentLength) / segmentLength;
      return {
        x: points[i].x + (points[i + 1].x - points[i].x) * segmentProgress,
        y: points[i].y + (points[i + 1].y - points[i].y) * segmentProgress,
      };
    }
    currentLength += segmentLength;
  }

  return points[0];
};
