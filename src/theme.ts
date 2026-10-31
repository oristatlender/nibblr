// The app's shared look: colors, spacing and corner sizes in one place,
// so changing the visual design later means editing this file, not every screen.

export const colors = {
  primary: '#6B4EFF',
  primaryDark: '#3F27B8',
  primarySoft: '#EFEBFF',
  success: '#2BB673',
  successDark: '#1C8A55',
  successText: '#12704F',
  successSoft: '#E8F7F0',
  warn: '#C2410C',
  warnDark: '#9A3412',
  warnSoft: '#FFEDE3',
  sun: '#B07A00',
  sunSoft: '#FFF4D6',
  slip: '#FFD3BF',
  ink: '#1E1B2E',
  muted: '#5E5A73',
  faint: '#6B6880',
  line: '#E4E0F5',
  lineSoft: '#F0EDF9',
  bg: '#FFFFFF',
  bgTint: '#F7F5FF',
};

export const radius = { sm: 12, md: 16, lg: 20, xl: 26, pill: 999 };

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 28 };

export const type = {
  title: { fontSize: 27, fontWeight: '900' as const, color: colors.ink, lineHeight: 33 },
  h2: { fontSize: 21, fontWeight: '900' as const, color: colors.ink, lineHeight: 27 },
  body: { fontSize: 16, fontWeight: '600' as const, color: colors.ink, lineHeight: 23 },
  small: { fontSize: 14, fontWeight: '700' as const, color: colors.muted, lineHeight: 20 },
  eyebrow: { fontSize: 13, fontWeight: '800' as const, color: colors.muted, letterSpacing: 1 },
};
