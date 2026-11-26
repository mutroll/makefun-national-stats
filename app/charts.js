// charts.js — canvas charts drawn by our own code, no library.
// One job: turn a labelled series into a readable bar or line chart
// with axes, gridlines, units and a source line drawn under the canvas
// by the caller. Colours match the site palette in style.css.

const INK = '#22302c';
const MUTED = '#5d6b66';
const GRID = '#dfe5df';
const TEAL = '#0e5a4f';
const AMBER = '#d97706';
const LIGHT_TEAL = '#7fb8ad';

function setupCanvas(canvas, height) {
  const dpr = window.devicePixelRatio || 1;
  const width = canvas.clientWidth || canvas.parentElement.clientWidth || 600;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.style.height = height + 'px';
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.font = '12px system-ui, -apple-system, "Segoe UI", sans-serif';
  return { ctx, width, height };
}

function niceMax(max) {
  if (max <= 0) return 1;
  const pow = Math.pow(10, Math.floor(Math.log10(max)));
  const n = max / pow;
  const steps = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10];
  const step = steps.find((s) => n <= s) ?? 10;
  return step * pow;
}

// Axis tick labels: integers where possible, one decimal otherwise.
function tickLabel(v) {
  if (Math.abs(v) >= 100) return Math.round(v).toLocaleString('en-US');
  if (Number.isInteger(Math.round(v * 10) / 10) && Math.abs(v - Math.round(v)) < 0.05) return String(Math.round(v));
  return (Math.round(v * 10) / 10).toFixed(1);
}

function drawAxes(ctx, box, max, unit) {
  const { left, top, width, height } = box;
  ctx.strokeStyle = GRID;
  ctx.fillStyle = MUTED;
  ctx.lineWidth = 1;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  const ticks = 4;
  for (let i = 0; i <= ticks; i++) {
    const v = (max / ticks) * i;
    const y = top + height - (height * i) / ticks;
    ctx.beginPath();
    ctx.moveTo(left, y);
    ctx.lineTo(left + width, y);
    ctx.stroke();
    const label = tickLabel(v);
    ctx.fillText(label, left - 8, y);
  }
  if (unit) {
    ctx.textAlign = 'left';
    ctx.fillText(unit, left, top - 10);
  }
}

// Vertical bar chart. series: [{label, value}], valueLabel formats a value.
export function drawBars(canvas, series, options) {
  const { unit = '', valueLabel = (v) => String(v), color = TEAL, height = 260 } = options || {};
  const { ctx, width, height: h } = setupCanvas(canvas, height);
  const pad = { left: 52, right: 12, top: 26, bottom: 30 };
  const box = { left: pad.left, top: pad.top, width: width - pad.left - pad.right, height: h - pad.top - pad.bottom };
  const max = niceMax(Math.max(...series.map((s) => s.value)) * 1.08);
  drawAxes(ctx, box, max, unit);
  const slot = box.width / series.length;
  const barW = Math.min(46, slot * 0.62);
  series.forEach((s, i) => {
    const bh = (box.height * s.value) / max;
    const x = box.left + slot * i + (slot - barW) / 2;
    const y = box.top + box.height - bh;
    ctx.fillStyle = i === series.length - 1 ? AMBER : color;
    ctx.beginPath();
    ctx.roundRect(x, y, barW, bh, [4, 4, 0, 0]);
    ctx.fill();
    ctx.fillStyle = INK;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(valueLabel(s.value), x + barW / 2, y - 5);
    ctx.fillStyle = MUTED;
    ctx.textBaseline = 'top';
    ctx.fillText(String(s.label), x + barW / 2, box.top + box.height + 8);
  });
}

// Line chart with dots and value labels. series: [{label, value}].
export function drawLine(canvas, series, options) {
  const { unit = '', valueLabel = (v) => String(v), color = TEAL, height = 260, min = null } = options || {};
  const { ctx, width, height: h } = setupCanvas(canvas, height);
  const pad = { left: 52, right: 16, top: 26, bottom: 30 };
  const box = { left: pad.left, top: pad.top, width: width - pad.left - pad.right, height: h - pad.top - pad.bottom };
  const values = series.map((s) => s.value);
  const lo = min !== null ? min : Math.min(0, Math.min(...values) * 0.95);
  const hi = niceMax(Math.max(...values) * 1.05);
  const span = hi - lo || 1;
  const xAt = (i) => box.left + (box.width * i) / (series.length - 1);
  const yAt = (v) => box.top + box.height - ((v - lo) / span) * box.height;
  // Gridlines and y labels.
  ctx.strokeStyle = GRID;
  ctx.fillStyle = MUTED;
  ctx.lineWidth = 1;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  for (let i = 0; i <= 4; i++) {
    const v = lo + (span / 4) * i;
    const y = yAt(v);
    ctx.beginPath();
    ctx.moveTo(box.left, y);
    ctx.lineTo(box.left + box.width, y);
    ctx.stroke();
    ctx.fillText(tickLabel(v), box.left - 8, y);
  }
  if (unit) {
    ctx.textAlign = 'left';
    ctx.fillText(unit, box.left, box.top - 10);
  }
  // Line and points.
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  series.forEach((s, i) => {
    if (i === 0) ctx.moveTo(xAt(i), yAt(s.value));
    else ctx.lineTo(xAt(i), yAt(s.value));
  });
  ctx.stroke();
  series.forEach((s, i) => {
    const x = xAt(i);
    const y = yAt(s.value);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x, y, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = INK;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(valueLabel(s.value), x, y - 9);
    ctx.fillStyle = MUTED;
    ctx.textBaseline = 'top';
    ctx.fillText(String(s.label), x, box.top + box.height + 8);
  });
}

// Horizontal bar chart for ranked lists (provinces, groups).
export function drawHBars(canvas, series, options) {
  const { unit = '', valueLabel = (v) => String(v), color = TEAL, rowH = 34 } = options || {};
  const height = series.length * rowH + 34;
  const { ctx, width, height: h } = setupCanvas(canvas, height);
  const pad = { left: 150, right: 64, top: 8, bottom: 10 };
  const box = { left: pad.left, top: pad.top, width: width - pad.left - pad.right, height: h - pad.top - pad.bottom };
  const max = niceMax(Math.max(...series.map((s) => s.value)) * 1.05);
  series.forEach((s, i) => {
    const y = box.top + i * rowH + 6;
    const bw = (box.width * s.value) / max;
    ctx.fillStyle = MUTED;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(s.label), box.left - 10, y + 9);
    ctx.fillStyle = i === 0 ? AMBER : color;
    ctx.beginPath();
    ctx.roundRect(box.left, y, Math.max(2, bw), 18, [0, 4, 4, 0]);
    ctx.fill();
    ctx.fillStyle = INK;
    ctx.textAlign = 'left';
    ctx.fillText(valueLabel(s.value), box.left + bw + 8, y + 9);
  });
  if (unit) {
    ctx.fillStyle = MUTED;
    ctx.textAlign = 'left';
    ctx.fillText(unit, box.left, h - 2);
  }
}

export { LIGHT_TEAL };
