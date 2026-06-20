import { FrameShape } from "@/redux/slice/shapes";
import { LiquidGlassButton } from "@/components/button/liquid-glass";
import { Brush, Palette } from "lucide-react";
import { useFrame } from "@/hooks/use-canvas";

export const Frame = ({
  shape,
  toggleInspiration,
}: {
  shape: FrameShape;
  toggleInspiration: () => void;
}) => {
  const { isGenerating, handleGenerateDesign } = useFrame(shape);

  return (
    <div
      className="group/frame absolute"
      style={{
        left: shape.x,
        top: shape.y,
        width: shape.w,
        height: shape.h,
        // Made the border much more visible
        border: "1.5px solid rgba(255, 255, 255, 0.3)",
        borderRadius: "12px",
        backgroundColor: shape.fill || "rgba(255, 255, 255, 0.02)",
        pointerEvents: "auto",
      }}
    >
      {/* The Permanent Label */}
      <div className="absolute -top-7 left-0 text-[10px] font-mono tracking-wider font-semibold text-neutral-400 uppercase bg-[#18181b] border border-white/10 px-2 py-0.5 rounded shadow select-none pointer-events-none">
        {/* Added a fallback in case your state hasn't assigned a number yet */}
        Frame {shape.frameNumber || 1}
      </div>

      {/* The Action Buttons (Only visible on hover) */}
      <div
        className="absolute flex gap-3 opacity-0 group-hover/frame:opacity-100 transition-opacity"
        style={{
          right: 0,
          top: -36,
          zIndex: 1000,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <LiquidGlassButton
          size="sm"
          variant="subtle"
          onClick={toggleInspiration}
          style={{ pointerEvents: "auto" }}
        >
          <Palette size={12} />
          Inspiration
        </LiquidGlassButton>
        <LiquidGlassButton
          size="sm"
          variant="subtle"
          onClick={handleGenerateDesign}
          disabled={isGenerating}
          className={isGenerating ? "animate-pulse" : ""}
          style={{ pointerEvents: "auto" }}
        >
          <Brush size={12} className={isGenerating ? "animate-spin" : ""} />
          {isGenerating ? "Generating..." : "Generate Design"}
        </LiquidGlassButton>
      </div>
    </div>
  );
};