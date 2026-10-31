// Simple line icons drawn with SVG, so the app needs no icon font files.

import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

export type IconName =
  | 'check' | 'close' | 'back' | 'chevron' | 'home' | 'hand' | 'chart' | 'lock' | 'wave' | 'timer'
  | 'circle' | 'redirect' | 'pencil' | 'camera' | 'gear' | 'refresh' | 'book' | 'file' | 'sparkle';

export function Icon({ name, size = 24, color = '#1E1B2E', stroke = 2.5 }: { name: IconName; size?: number; color?: string; stroke?: number }) {
  const p = { stroke: color, strokeWidth: stroke, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityElementsHidden importantForAccessibility="no">
      {name === 'check' && <Path d="M20 6 9 17l-5-5" {...p} />}
      {name === 'close' && <Path d="M6 6l12 12M18 6 6 18" {...p} />}
      {name === 'back' && <Path d="m15 6-6 6 6 6" {...p} />}
      {name === 'chevron' && <Path d="m9 6 6 6-6 6" {...p} />}
      {name === 'home' && <Path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" {...p} />}
      {name === 'hand' && (
        <>
          <Path d="M18 11V6a2 2 0 0 0-4 0v5" {...p} />
          <Path d="M14 10V4a2 2 0 0 0-4 0v6" {...p} />
          <Path d="M10 10.5V6a2 2 0 0 0-4 0v8a8 8 0 0 0 16 0v-2a2 2 0 0 0-4 0" {...p} />
        </>
      )}
      {name === 'chart' && (
        <>
          <Path d="M3 3v18h18" {...p} />
          <Path d="m7 15 4-4 3 3 5-6" {...p} />
        </>
      )}
      {name === 'lock' && (
        <>
          <Rect x="5" y="11" width="14" height="10" rx="2" {...p} />
          <Path d="M8 11V8a4 4 0 0 1 8 0v3" {...p} />
        </>
      )}
      {name === 'wave' && (
        <>
          <Path d="M2 10c2-3 4-3 6 0s4 3 6 0 4-3 6 0" {...p} />
          <Path d="M2 16c2-3 4-3 6 0s4 3 6 0 4-3 6 0" {...p} />
        </>
      )}
      {name === 'timer' && (
        <>
          <Circle cx="12" cy="13" r="8" {...p} />
          <Path d="M12 9v4l2 2M9 2h6" {...p} />
        </>
      )}
      {name === 'circle' && (
        <>
          <Circle cx="12" cy="12" r="8" {...p} />
          <Path d="M12 4a8 8 0 0 1 8 8" {...p} />
        </>
      )}
      {name === 'redirect' && <Path d="M4 18c0-6 4-10 10-10h4m0 0-3-3m3 3-3 3" {...p} />}
      {name === 'pencil' && (
        <>
          <Path d="M12 20h9" {...p} />
          <Path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" {...p} />
        </>
      )}
      {name === 'camera' && (
        <>
          <Path d="M4 8h3l2-3h6l2 3h3v11H4z" {...p} />
          <Circle cx="12" cy="13" r="3.5" {...p} />
        </>
      )}
      {name === 'gear' && (
        <>
          <Circle cx="12" cy="12" r="3" {...p} />
          <Path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1" {...p} />
        </>
      )}
      {name === 'refresh' && (
        <>
          <Path d="M3 12a9 9 0 1 0 3-6.7" {...p} />
          <Path d="M3 4v5h5" {...p} />
        </>
      )}
      {name === 'book' && <Path d="M4 19.5V5a2 2 0 0 1 2-2h14v16H6a2 2 0 0 0-2 2z" {...p} />}
      {name === 'file' && <Path d="M5 19 19 5M8 22l14-14M2 16 16 2" {...p} />}
      {name === 'sparkle' && <Path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" {...p} />}
    </Svg>
  );
}
