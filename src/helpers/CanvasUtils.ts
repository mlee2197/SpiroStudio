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
  // Use the smallest side minus padding for max size for other shapes
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
    case "heart": {
      // Parametric heart curve, scaled to fit
      const scale = maxSide / 32;
      for (let i = 0; i < 100; i++) {
        const t = (i / 100) * Math.PI * 2;
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y =
          13 * Math.cos(t) -
          5 * Math.cos(2 * t) -
          2 * Math.cos(3 * t) -
          Math.cos(4 * t);
        points.push({
          x: centerX + x * scale,
          y: centerY - y * scale, // minus because canvas y increases downward
        });
      }
      break;
    }
    case "miffy": {
      const maxMiffyWidth = width - 2 * padding;
      const maxMiffyHeight = height - 2 * padding;
      const miffyBaseWidth = 3.0;
      const miffyBaseHeight = 4.15;
      const scale = Math.min(maxMiffyWidth / miffyBaseWidth, maxMiffyHeight / miffyBaseHeight);

      // Move all points down by a bit (e.g., 0.3 * scale)
      const yOffset = 0.3 * scale;

      // Define the left side of the outline (from bottom center up the left, to the top of the left ear)
      const leftOutline = [
        // Start bottom center
        { x: centerX, y: centerY + scale + yOffset },

        // Left cheek
        { x: centerX - 0.4 * scale, y: centerY + 0.95 * scale + yOffset },
        { x: centerX - 0.7 * scale, y: centerY + 0.8 * scale + yOffset },
        { x: centerX - 0.92 * scale, y: centerY + 0.6 * scale + yOffset },
        { x: centerX - 0.98 * scale, y: centerY + 0.3 * scale + yOffset },
        { x: centerX - 0.99 * scale, y: centerY + 0.05 * scale + yOffset },
        { x: centerX - 0.94 * scale, y: centerY - 0.2 * scale + yOffset },
        { x: centerX - 0.85 * scale, y: centerY - 0.4 * scale + yOffset },

        // Base of left ear
        { x: centerX - 0.6 * scale, y: centerY - 0.6 * scale + yOffset },

        // Left ear (outer curve, round)
        { x: centerX - 0.7 * scale, y: centerY - 1.1 * scale + yOffset },
        { x: centerX - 0.71 * scale, y: centerY - 1.6 * scale + yOffset },
        { x: centerX - 0.65 * scale, y: centerY - 1.9 * scale + yOffset },
        { x: centerX - 0.6 * scale, y: centerY - 2.05 * scale + yOffset },
        { x: centerX - 0.45 * scale, y: centerY - 2.15 * scale + yOffset },
        { x: centerX - 0.3 * scale, y: centerY - 2.1 * scale + yOffset },

        // Left ear (inner curve, rounder)
        { x: centerX - 0.20 * scale, y: centerY - 1.95 * scale + yOffset },
        { x: centerX - 0.16 * scale, y: centerY - 1.7 * scale + yOffset },
        { x: centerX - 0.18 * scale, y: centerY - 1.3 * scale + yOffset },

        // Gap between ears (unchanged)
        { x: centerX - 0.2 * scale, y: centerY - 0.7 * scale + yOffset },
        { x: centerX, y: centerY - 0.72 * scale + yOffset },
      ];

      // Mirror the left side to create the right side (excluding the bottom center and center gap)
      // For each point (except the first and last), mirror across the vertical center
      const rightOutline = leftOutline
        .slice(1, -1)
        .map(pt => ({
          x: centerX + (centerX - pt.x),
          y: pt.y
        }))
        .reverse();

      const outline = [
        ...leftOutline,
        ...rightOutline,
        { x: centerX, y: centerY + scale + yOffset }, // Close the path at the bottom center
      ];

      points.push(...outline);
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
