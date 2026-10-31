import { ToolId } from '../content/lessons';
import { IconName } from '../components/Icon';
import { colors } from '../theme';

export const TOOL_INFO: Record<ToolId, { title: string; subtitle: string; icon: IconName; color: string; bg: string; lesson: number }> = {
  swap: { title: '60-second swap', subtitle: 'Hold a fist or fidget', icon: 'timer', color: colors.primary, bg: colors.primarySoft, lesson: 4 },
  rescue: { title: 'Craving rescue', subtitle: 'Matches a tool to your trigger', icon: 'sparkle', color: colors.warn, bg: colors.warnSoft, lesson: 5 },
  breathe: { title: 'Surf the urge', subtitle: 'Breathe 4 in, 6 out', icon: 'wave', color: colors.successDark, bg: colors.successSoft, lesson: 6 },
  circle: { title: 'Gentle circle', subtitle: 'A soothing fingertip move', icon: 'circle', color: colors.primary, bg: colors.primarySoft, lesson: 7 },
  fakeout: { title: 'Fake-out move', subtitle: 'Redirect the reach', icon: 'redirect', color: colors.sun, bg: colors.sunSoft, lesson: 8 },
  slip: { title: 'Log a slip', subtitle: '30 seconds, no judgment', icon: 'pencil', color: colors.sun, bg: colors.sunSoft, lesson: 0 },
};
