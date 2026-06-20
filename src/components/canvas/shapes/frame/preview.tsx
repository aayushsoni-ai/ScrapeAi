export const FramePreview = ({
  startWorld,
  currentWorld,
}: {
  startWorld: { x: number; y: number };
  currentWorld: { x: number; y: number };
}) => {
  const x = Math.min(startWorld.x, currentWorld.x);
  const y = Math.min(startWorld.y, currentWorld.y);
  const w = Math.abs(currentWorld.x - startWorld.x);
  const h = Math.abs(currentWorld.y - startWorld.y);

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: x,
        top: y,
        width: w,
        height: h,
        border: "1.5px dashed rgba(255, 255, 255, 0.4)",
        borderRadius: "12px",
        backgroundColor: "rgba(255, 255, 255, 0.03)",
      }}
    >
      {/* The label added to the drafting preview phase */}
      <div className="absolute -top-7 left-0 text-[10px] font-mono tracking-wider font-semibold text-neutral-500 uppercase bg-[#18181b] border border-white/5 px-2 py-0.5 rounded shadow select-none">
        Frame
      </div>
    </div>
  );
};