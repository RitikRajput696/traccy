// canvas graph like bg
export default function CanvasBg(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");

  const lineColor = "#e0e0e0ff";
  for (let i = 0; i < canvas.width; i = i + 20) {
    if (ctx) {
      ctx.beginPath();
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = lineColor;
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
  }
  for (let i = 0; i < canvas.height; i = i + 20) {
    if (ctx) {
      ctx.beginPath();
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = lineColor;
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }
  }
}
