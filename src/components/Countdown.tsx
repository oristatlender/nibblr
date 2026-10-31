// A circular countdown timer, used by the 60-second swap, practices and "try it" steps.

import React, { useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors } from '../theme';

export function useCountdown(seconds: number, running: boolean, onDone?: () => void) {
  const [left, setLeft] = useState(seconds);
  const done = useRef(false);
  const cb = useRef(onDone);
  cb.current = onDone;

  useEffect(() => {
    setLeft(seconds);
    done.current = false;
  }, [seconds]);

  useEffect(() => {
    if (!running) return;
    const start = Date.now() - (seconds - left) * 1000;
    const t = setInterval(() => {
      const remaining = Math.max(0, seconds - (Date.now() - start) / 1000);
      setLeft(remaining);
      if (remaining <= 0 && !done.current) {
        done.current = true;
        clearInterval(t);
        cb.current?.();
      }
    }, 100);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, seconds]);

  return left;
}

export function CountdownRing({ seconds, left, size = 220, color = colors.primary, caption }: { seconds: number; left: number; size?: number; color?: string; caption?: string }) {
  const stroke = 16;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const frac = seconds > 0 ? left / seconds : 0;
  return (
    <View
      style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}
      accessible
      accessibilityRole="timer"
      accessibilityLabel={`${Math.ceil(left)} seconds left`}
    >
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={colors.line} strokeWidth={stroke} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${c} ${c}`}
          strokeDashoffset={c * (1 - frac)}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <Text style={{ fontSize: 52, fontWeight: '900', color: colors.ink }}>{Math.ceil(left)}</Text>
      <Text style={{ fontSize: 15, fontWeight: '800', color: colors.muted }}>{caption ?? 'seconds'}</Text>
    </View>
  );
}
