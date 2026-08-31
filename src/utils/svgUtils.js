// Posture score gauge radius is 45px -> Circumference = 2 * PI * 45 = ~282.74
export function calcGaugeOffset(score, maxScore = 100, circumference = 283) {
  const normalized = Math.min(Math.max(score || 0, 0), maxScore);
  return circumference - (normalized / maxScore) * circumference;
}

// Generate smooth spline SVG path points for Encrypted Flow Dynamics
export function generateWavePath(points, height = 100, width = 500) {
  if (!points || points.length === 0) return '';
  const step = width / (points.length - 1);
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${i * step},${height - (p / 100) * height}`).join(' ');
}
