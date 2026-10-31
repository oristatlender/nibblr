// The Tools tab and every tool behind it:
// craving rescue (routes to the right tool), the 60-second swap, urge surfing,
// the gentle circle and fake-out practices, and the slip log.

import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, Text, View } from 'react-native';
import { ToolId } from '../content/lessons';
import { Button, Card, FlowHeader, IconTile, Option, Pill, Screen } from '../components/ui';
import { CountdownRing, useCountdown } from '../components/Countdown';
import { Icon } from '../components/Icon';
import { useNav } from '../nav';
import { unlockedTools, useStore } from '../store';
import { colors, space, type } from '../theme';
import { TOOL_INFO } from './toolInfo';

// ---------- The tab ----------

export function ToolsTab() {
  const nav = useNav();
  const { state } = useStore();
  const unlocked = unlockedTools(state);
  const practice: ToolId[] = ['swap', 'breathe', 'circle', 'fakeout'];

  return (
    <>
      <Text style={type.title}>Tools</Text>
      <Pressable
        accessibilityRole="button"
        onPress={() => nav.push({ name: 'rescue' })}
        style={({ pressed }) => ({
          flexDirection: 'row',
          gap: space.md,
          alignItems: 'center',
          backgroundColor: colors.warn,
          borderRadius: 24,
          padding: space.xl,
          borderBottomWidth: pressed ? 2 : 6,
          borderBottomColor: colors.warnDark,
        })}
      >
        <View style={{ width: 52, height: 52, borderRadius: 999, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="wave" color={colors.warn} size={28} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#FFFFFF', fontSize: 21, fontWeight: '900' }}>I feel an urge</Text>
          <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '700' }}>Tell us what set it off, and we'll pick a tool</Text>
        </View>
      </Pressable>

      <Text style={[type.eyebrow, { marginTop: space.sm }]}>PRACTICE</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.md }}>
        {practice.map((t) => {
          const info = TOOL_INFO[t];
          const open = unlocked.has(t);
          return (
            <Pressable
              key={t}
              accessibilityRole="button"
              accessibilityState={{ disabled: !open }}
              accessibilityLabel={open ? info.title : `${info.title}, unlocks in lesson ${info.lesson}`}
              onPress={() => open && nav.push({ name: 'tool', tool: t })}
              style={{
                flexBasis: '47%',
                flexGrow: 1,
                minHeight: 132,
                gap: 10,
                padding: space.lg,
                borderRadius: 20,
                borderWidth: 2,
                borderBottomWidth: 4,
                borderColor: colors.line,
                backgroundColor: open ? '#FFFFFF' : '#F7F5FA',
              }}
            >
              <IconTile name={open ? info.icon : 'lock'} color={open ? info.color : '#8E8AA3'} bg={open ? info.bg : colors.lineSoft} />
              <Text style={{ fontSize: 16, fontWeight: '900', color: open ? colors.ink : colors.faint }}>{info.title}</Text>
              <Text style={[type.small, { fontSize: 13 }]}>{open ? info.subtitle : `Unlocks in lesson ${info.lesson}`}</Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable accessibilityRole="button" onPress={() => nav.push({ name: 'tool', tool: 'slip' })}>
        <Card style={{ flexDirection: 'row', alignItems: 'center', gap: space.md }}>
          <IconTile name="pencil" color={colors.sun} bg={colors.sunSoft} size={40} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: '900', color: colors.ink }}>Had a slip?</Text>
            <Text style={[type.small, { fontSize: 13 }]}>Log it in 30 seconds. No judgment.</Text>
          </View>
          <Icon name="chevron" color={colors.faint} stroke={3} size={20} />
        </Card>
      </Pressable>
    </>
  );
}

// ---------- Craving rescue: pick a trigger, get routed ----------

const RESCUE = [
  { id: 'edge', label: 'A rough edge or hangnail', letter: 'Sensory', go: 'file' as const },
  { id: 'stress', label: "I'm stressed, anxious or frustrated", letter: 'Feelings', go: 'breathe' as const },
  { id: 'bored', label: "I'm bored or zoning out", letter: 'Posture', go: 'swap' as const },
  { id: 'thought', label: "A thought like 'I have to fix this nail'", letter: 'Thoughts', go: 'thought' as const },
  { id: 'place', label: "I'm in one of my biting spots", letter: 'Place', go: 'swap' as const },
];

export function RescueScreen() {
  const nav = useNav();
  const { state } = useStore();
  const [mode, setMode] = useState<'pick' | 'file' | 'thought'>('pick');
  const unlocked = unlockedTools(state);

  if (mode === 'file') return <FileChecklist />;
  if (mode === 'thought') {
    return (
      <Screen footer={<Button label="NOW SMOOTH IT" onPress={() => setMode('file')} />}>
        <FlowHeader icon="close" onBack={() => nav.back()} />
        <Pill text="THOUGHTS" color={colors.primaryDark} bg={colors.primarySoft} />
        <Text style={type.title}>Try a different thought</Text>
        <Card style={{ backgroundColor: colors.bgTint, borderColor: colors.bgTint }}>
          <Text style={[type.body, { fontSize: 18, lineHeight: 27 }]}>"Teeth always leave a rougher edge than a file. If I want it smooth, the file wins."</Text>
        </Card>
        <Text style={type.body}>Say it to yourself once. Then fix the edge the smooth way.</Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <FlowHeader icon="close" onBack={() => nav.back()} />
      <Text style={type.title}>What's going on right now?</Text>
      <Text style={[type.body, { color: colors.muted }]}>Pick the closest one. Matching the tool to the trigger works best.</Text>
      <View style={{ gap: space.sm }}>
        {RESCUE.map((r) => (
          <Option
            key={r.id}
            label={r.label}
            detail={r.letter}
            onPress={() => {
              if (r.go === 'file') return setMode('file');
              if (r.go === 'thought') return setMode('thought');
              const tool: ToolId = r.go === 'breathe' && unlocked.has('breathe') ? 'breathe' : 'swap';
              nav.replace({ name: 'tool', tool, fromRescue: true });
            }}
          />
        ))}
      </View>
    </Screen>
  );
}

function FileChecklist() {
  const nav = useNav();
  const { surfedUrge } = useStore();
  const steps = ['Grab a nail file or clippers', 'Smooth the rough edge, about 10 seconds', 'Rub in a little hand cream or cuticle oil if you have it'];
  const [done, setDone] = useState<number[]>([]);
  return (
    <Screen
      footer={
        <Button
          label="DONE, EDGE IS SMOOTH"
          variant="success"
          disabled={done.length < 2}
          onPress={() => {
            surfedUrge();
            nav.home('today');
          }}
        />
      }
    >
      <FlowHeader icon="close" onBack={() => nav.back()} />
      <Pill text="SENSORY" color={colors.successText} bg={colors.successSoft} />
      <Text style={type.title}>File, don't bite</Text>
      <Text style={[type.body, { color: colors.muted }]}>Fixing the edge removes the reason to bite.</Text>
      <View style={{ gap: space.sm }}>
        {steps.map((s, i) => (
          <Option key={s} multi label={s} selected={done.includes(i)} onPress={() => setDone((d) => (d.includes(i) ? d.filter((x) => x !== i) : [...d, i]))} />
        ))}
      </View>
    </Screen>
  );
}

// ---------- Practice tools ----------

export function ToolScreen({ tool, fromRescue }: { tool: ToolId; fromRescue?: boolean }) {
  if (tool === 'breathe') return <Breathe fromRescue={fromRescue} />;
  if (tool === 'fakeout') return <FakeOut />;
  if (tool === 'slip') return <SlipFlow />;
  return <TimedHold tool={tool} fromRescue={fromRescue} />;
}

const HOLD_COPY: Record<string, { title: string; how: string[] }> = {
  swap: {
    title: '60-second swap',
    how: ['Make a gentle fist with both hands', 'Or press your palms flat on your thighs', 'Or squeeze a fidget or a textured object'],
  },
  circle: {
    title: 'Gentle circle',
    how: ['Rest your hands in your lap', 'Slowly circle your thumb against your fingertips', 'Keep it soft, like you are soothing your hands'],
  },
};

function TimedHold({ tool, fromRescue }: { tool: ToolId; fromRescue?: boolean }) {
  const nav = useNav();
  const { practice, addMinutes, surfedUrge } = useStore();
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const left = useCountdown(60, running, () => setFinished(true));
  const copy = HOLD_COPY[tool] ?? HOLD_COPY.swap;

  if (finished) {
    return (
      <Done
        title="You outlasted it"
        body="One minute is what research says it takes for an urge to pass. Every time you do this, the swap gets more automatic."
        onDone={() => {
          practice(tool);
          addMinutes(1);
          if (fromRescue) surfedUrge();
          nav.home('today');
        }}
      />
    );
  }

  return (
    <Screen
      footer={
        running ? (
          <Text style={[type.small, { textAlign: 'center', paddingVertical: space.md }]}>Keep holding. The urge peaks, then fades.</Text>
        ) : (
          <Button label="START 60 SECONDS" onPress={() => setRunning(true)} />
        )
      }
    >
      <FlowHeader icon="close" onBack={() => nav.back()} />
      <Text style={type.title}>{copy.title}</Text>
      <View style={{ gap: space.sm }}>
        {copy.how.map((h, i) => (
          <View key={h} style={{ flexDirection: 'row', gap: space.md, alignItems: 'center' }}>
            <View style={{ width: 28, height: 28, borderRadius: 999, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontWeight: '900', color: colors.primaryDark }}>{i + 1}</Text>
            </View>
            <Text style={[type.body, { flex: 1 }]}>{h}</Text>
          </View>
        ))}
      </View>
      <View style={{ marginTop: space.lg }}>
        <CountdownRing seconds={60} left={left} />
      </View>
    </Screen>
  );
}

function Breathe({ fromRescue }: { fromRescue?: boolean }) {
  const nav = useNav();
  const { practice, addMinutes, surfedUrge } = useStore();
  const [stage, setStage] = useState<'name' | 'breathe' | 'done'>('name');
  const [cycle, setCycle] = useState(0);
  const [phase, setPhase] = useState<'in' | 'out'>('in');
  const scale = useRef(new Animated.Value(0.6)).current;
  const CYCLES = 6;

  useEffect(() => {
    if (stage !== 'breathe') return;
    let cancelled = false;
    const run = (n: number) => {
      if (cancelled) return;
      if (n >= CYCLES) return setStage('done');
      setCycle(n);
      setPhase('in');
      Animated.timing(scale, { toValue: 1, duration: 4000, easing: Easing.inOut(Easing.ease), useNativeDriver: false }).start(() => {
        if (cancelled) return;
        setPhase('out');
        Animated.timing(scale, { toValue: 0.6, duration: 6000, easing: Easing.inOut(Easing.ease), useNativeDriver: false }).start(() => run(n + 1));
      });
    };
    run(0);
    return () => {
      cancelled = true;
      scale.stopAnimation();
    };
  }, [stage, scale]);

  if (stage === 'name') {
    return (
      <Screen footer={<Button label="START BREATHING" onPress={() => setStage('breathe')} />}>
        <FlowHeader icon="close" onBack={() => nav.back()} />
        <Pill text="SURF THE URGE" color={colors.successText} bg={colors.successSoft} />
        <Text style={type.title}>First, name it</Text>
        <Card style={{ backgroundColor: colors.bgTint, borderColor: colors.bgTint }}>
          <Text style={[type.body, { fontSize: 19, lineHeight: 27 }]}>"I'm noticing an urge to bite."</Text>
        </Card>
        <Text style={type.body}>Now notice where it lives in your body. A tingling thumb? Restless fingers? A tight jaw? Just notice it.</Text>
      </Screen>
    );
  }

  if (stage === 'done') {
    return (
      <Done
        title="Wave surfed"
        body="The urge rose and fell without you obeying it. That's exactly what teaches your brain urges are temporary."
        onDone={() => {
          practice('breathe');
          addMinutes(1);
          if (fromRescue) surfedUrge();
          nav.home('today');
        }}
      />
    );
  }

  const size = scale.interpolate({ inputRange: [0.6, 1], outputRange: [140, 240] });
  return (
    <Screen scroll={false} bg={colors.successSoft}>
      <FlowHeader icon="close" onBack={() => nav.back()} progress={cycle / CYCLES} color={colors.success} label={`${cycle + 1} of ${CYCLES}`} />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: space.xxl }}>
        <Animated.View style={{ width: size, height: size, borderRadius: 999, backgroundColor: colors.success, opacity: 0.9 }} />
        <Text accessibilityLiveRegion="polite" style={{ fontSize: 28, fontWeight: '900', color: colors.successText }}>
          {phase === 'in' ? 'Breathe in… 4' : 'Breathe out… 6'}
        </Text>
        <Text style={[type.body, { color: colors.successText, textAlign: 'center' }]}>
          {cycle < 2 ? 'Let the urge be there. You don’t have to act on it.' : cycle < 4 ? 'This is the peak. Stay with your breath.' : 'Notice it softening.'}
        </Text>
      </View>
    </Screen>
  );
}

function FakeOut() {
  const nav = useNav();
  const { practice, addMinutes } = useStore();
  const [reps, setReps] = useState(0);
  const target = 5;
  if (reps >= target) {
    return (
      <Done
        title="Five fake-outs done"
        body="Each rep teaches the reach to end somewhere new. A couple of minutes of practice a day keeps it fresh."
        onDone={() => {
          practice('fakeout');
          addMinutes(2);
          nav.home('today');
        }}
      />
    );
  }
  return (
    <Screen footer={<Button label={`I DID ONE (${reps}/${target})`} onPress={() => setReps((r) => r + 1)} />}>
      <FlowHeader icon="close" onBack={() => nav.back()} progress={reps / target} />
      <Text style={type.title}>Fake-out move</Text>
      {['Slowly lift one hand toward your mouth', 'Just before it arrives, flick it to your earlobe or the back of your neck', 'Lower it and tap the button below'].map((h, i) => (
        <View key={h} style={{ flexDirection: 'row', gap: space.md, alignItems: 'center' }}>
          <View style={{ width: 28, height: 28, borderRadius: 999, backgroundColor: colors.sunSoft, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontWeight: '900', color: '#7A5400' }}>{i + 1}</Text>
          </View>
          <Text style={[type.body, { flex: 1 }]}>{h}</Text>
        </View>
      ))}
      <Text style={[type.small, { marginTop: space.md }]}>Tip: you can also do it with your eyes closed, imagining the reach and moving your real hand away at the last second.</Text>
    </Screen>
  );
}

// ---------- Slip log ----------

const WHEN = ['Just now', 'Earlier today', 'Yesterday'];
const WHERE = ['At my desk', 'On the couch', 'In bed', 'In the car', 'In the bathroom', 'Somewhere else'];
const WHY = ['Stressed or anxious', 'Bored or zoned out', 'A rough edge', 'Tired', 'Not sure'];
const CHANGES: Record<string, string> = {
  'At my desk': 'Put a nail file next to your keyboard',
  'On the couch': 'Keep a fidget or hand cream by the couch',
  'In bed': 'Put a nail file on your nightstand',
  'In the car': 'Keep a stress ball in the cup holder',
  'In the bathroom': 'Keep clippers by the mirror and use them, not your teeth',
  'Somewhere else': 'Put a nail file where it happened',
};

export function SlipFlow() {
  const nav = useNav();
  const { logSlip } = useStore();
  const [step, setStep] = useState(0);
  const [when, setWhen] = useState('');
  const [place, setPlace] = useState('');
  const [why, setWhy] = useState('');

  const pickStep = (title: string, options: string[], value: string, set: (v: string) => void) => (
    <Screen footer={<Button label="CONTINUE" disabled={!value} onPress={() => setStep((s) => s + 1)} />}>
      <FlowHeader onBack={() => (step === 0 ? nav.back() : setStep((s) => s - 1))} icon={step === 0 ? 'close' : 'back'} progress={step / 3} color={colors.sun} />
      {step === 0 ? <Text style={[type.body, { color: colors.muted }]}>Slips are part of this. Logging one turns it into useful information.</Text> : null}
      <Text style={type.title}>{title}</Text>
      <View style={{ gap: space.sm }}>
        {options.map((o) => (
          <Option key={o} label={o} selected={value === o} onPress={() => set(o)} />
        ))}
      </View>
    </Screen>
  );

  if (step === 0) return pickStep('When was it?', WHEN, when, setWhen);
  if (step === 1) return pickStep('Where were you?', WHERE, place, setPlace);
  if (step === 2) return pickStep('What was going on?', WHY, why, setWhy);

  const change = CHANGES[place] ?? CHANGES['Somewhere else'];
  const statement = `I bit ${when.toLowerCase()} ${place.toLowerCase().replace('somewhere else', 'somewhere')}${why && why !== 'Not sure' ? `, when I was ${why.toLowerCase()}` : ''}.`;
  return (
    <Screen
      bg={colors.bgTint}
      footer={
        <Button
          label="I'LL CHANGE THAT"
          onPress={() => {
            logSlip({ when, place, trigger: why, change });
            nav.home('today');
          }}
        />
      }
    >
      <FlowHeader onBack={() => setStep(2)} progress={1} color={colors.sun} />
      <Text style={type.title}>That's a situation, not a verdict</Text>
      <Card>
        <Text style={type.eyebrow}>WHAT HAPPENED</Text>
        <Text style={[type.body, { fontSize: 18, lineHeight: 26, fontWeight: '800' }]}>"{statement}"</Text>
      </Card>
      <Card style={{ backgroundColor: colors.primarySoft, borderColor: colors.primarySoft }}>
        <Text style={type.eyebrow}>CHANGE ONE THING</Text>
        <Text style={[type.body, { fontWeight: '800' }]}>{change}</Text>
        <Text style={type.small}>One small change in that spot is enough.</Text>
      </Card>
      <Text style={type.small}>Your 28-day score dips a little. It never resets. We'll check in with you tomorrow.</Text>
    </Screen>
  );
}

// ---------- Shared finish screen ----------

function Done({ title, body, onDone }: { title: string; body: string; onDone: () => void }) {
  return (
    <Screen bg={colors.successSoft} footer={<Button label="DONE" variant="success" onPress={onDone} />}>
      <View style={{ flex: 1, justifyContent: 'center', gap: space.lg }}>
        <View style={{ width: 80, height: 80, borderRadius: 999, backgroundColor: colors.success, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="check" size={44} color="#FFFFFF" stroke={3.5} />
        </View>
        <Text style={[type.title, { color: colors.successText }]}>{title}</Text>
        <Text style={[type.body, { color: '#145A41' }]}>{body}</Text>
      </View>
    </Screen>
  );
}
