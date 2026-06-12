/* Animated heartbeat line — server-safe (pure CSS animation).
   A faint base track plus one or two bright "runner" segments that
   travel along the path using pathLength=1 dash math (ekg-run keyframe). */

interface EKGPulseProps {
  /** Primary runner color */
  color?: string;
  /** Optional second runner color (set to undefined to disable) */
  echoColor?: string;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
}

const HEARTBEAT =
  'M0,30 H70 l7,-12 7,20 7,-8 H160 l8,-20 10,34 8,-14 H300 l7,-10 7,16 7,-6 H420 l8,-22 10,36 8,-14 H540 l7,-9 7,14 7,-5 H600';

export function EKGPulse({
  color = 'var(--accent)',
  echoColor = 'var(--color-pulse)',
  height = 60,
  className,
  style,
}: EKGPulseProps) {
  return (
    <svg
      viewBox="0 0 600 60"
      preserveAspectRatio="none"
      aria-hidden
      className={className}
      style={{ display: 'block', width: '100%', height, overflow: 'visible', ...style }}
    >
      {/* Base track */}
      <path
        d={HEARTBEAT}
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.16"
        vectorEffect="non-scaling-stroke"
      />
      {/* Bright traveling segment */}
      <path
        d={HEARTBEAT}
        fill="none"
        stroke={color}
        strokeWidth="1.6"
        pathLength={1}
        strokeDasharray="0.14 0.86"
        vectorEffect="non-scaling-stroke"
        style={{ animation: 'ekg-run 3.4s linear infinite' }}
      />
      {/* Echo runner — offset phase, secondary color */}
      {echoColor && (
        <path
          d={HEARTBEAT}
          fill="none"
          stroke={echoColor}
          strokeWidth="1"
          pathLength={1}
          strokeDasharray="0.06 0.94"
          vectorEffect="non-scaling-stroke"
          opacity="0.8"
          style={{ animation: 'ekg-run 3.4s linear infinite', animationDelay: '-1.7s' }}
        />
      )}
    </svg>
  );
}
