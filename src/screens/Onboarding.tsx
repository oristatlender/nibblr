// Step-by-step onboarding. Ideas taken from Mobbin's onboarding study:
// - show the outcome up front, then make the flow feel short (one question per screen, a progress bar)
// - feel human: reflect people's answers back to them
// - personalize, then show a personalized plan at the end
// - ask for things (like a reminder time) at the moment they make sense

import React, { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { Button, Card, FlowHeader, Option, Screen } from '../components/ui';
import { Icon } from '../components/Icon';
import { Profile, useStore } from '../store';
import { useNav } from '../nav';
import { colors, space, type } from '../theme';

const TRIED = [
  { id: 'polish', label: 'Bitter nail polish' },
  { id: 'callout', label: 'Someone calling me out or stopping me' },
  { id: 'photos', label: 'Photos of my nails' },
  { id: 'gloves', label: 'Gloves, tape or bandages' },
  { id: 'willpower', label: 'Just willpower' },
  { id: 'other', label: 'Other' },
  { id: 'none', label: 'Nothing yet' },
];

export const TRIGGERS = [
  { id: 'stress', label: "When I'm stressed or anxious", letter: 'A' },
  { id: 'bored', label: "When I'm bored or zoning out", letter: 'A' },
  { id: 'edge', label: 'When I feel a rough edge or hangnail', letter: 'S' },
  { id: 'screen', label: 'At my desk or on a screen', letter: 'P' },
  { id: 'tv', label: 'Watching TV or reading', letter: 'M' },
  { id: 'driving', label: 'In the car', letter: 'P' },
  { id: 'unsure', label: "I'm not sure", letter: '' },
];

const GOALS = [
  { min: 3, label: 'Light', detail: 'One short lesson or a review round' },
  { min: 5, label: 'Steady', detail: 'A lesson, its quiz and a quick recap' },
  { min: 10, label: 'Committed', detail: 'Plus a guided hand practice' },
  { min: 15, label: 'Intensive', detail: 'Deep practice and review' },
];

const TIMES = ['Morning', 'Lunchtime', 'Evening', 'Before bed'];

const STEPS = ['welcome', 'tried', 'reflect', 'triggers', 'goal', 'time', 'plan'] as const;

export function Onboarding() {
  const { finishOnboarding } = useStore();
  const nav = useNav();
  const [step, setStep] = useState(0);
  const [tried, setTried] = useState<string[]>([]);
  const [triedOther, setTriedOther] = useState('');
  const [triggers, setTriggers] = useState<string[]>([]);
  const [goalMin, setGoalMin] = useState(5);
  const [reminder, setReminder] = useState('Evening');

  const id = STEPS[step];
  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));
  // The welcome screen isn't counted, so the bar starts small and moves fast.
  const progress = step / (STEPS.length - 1);
  const header = step > 0 ? <FlowHeader onBack={back} progress={progress} label={`${step} of ${STEPS.length - 1}`} /> : null;

  const toggle = (list: string[], set: (v: string[]) => void, value: string, exclusive: string) => {
    if (value === exclusive) return set(list.includes(value) ? [] : [value]);
    const without = list.filter((v) => v !== exclusive);
    set(without.includes(value) ? without.filter((v) => v !== value) : [...without, value]);
  };

  if (id === 'welcome') {
    return (
      <Screen bg={colors.bgTint} footer={<><Button label="GET STARTED" onPress={next} /><Text style={[type.small, { textAlign: 'center' }]}>Takes about a minute</Text></>}>
        <View style={{ flex: 1, justifyContent: 'center', gap: space.xl }}>
          <View style={{ width: 96, height: 96, borderRadius: 32, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="hand" size={52} color="#FFFFFF" />
          </View>
          <Text style={[type.title, { fontSize: 32, lineHeight: 38 }]}>Healthier nails, a few minutes a day</Text>
          <Text style={type.body}>Nibblr teaches you why you bite and gives you methods that work, one short lesson at a time.</Text>
          <View style={{ gap: space.md }}>
            {[
              'Built on clinical research, with sources',
              'No shame, and no streaks that reset to zero',
              'Tools for the moment an urge hits',
            ].map((t) => (
              <View key={t} style={{ flexDirection: 'row', gap: space.md, alignItems: 'center' }}>
                <View style={{ width: 28, height: 28, borderRadius: 999, backgroundColor: colors.successSoft, alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="check" size={16} color={colors.successText} stroke={3.5} />
                </View>
                <Text style={[type.body, { flex: 1 }]}>{t}</Text>
              </View>
            ))}
          </View>
        </View>
      </Screen>
    );
  }

  if (id === 'tried') {
    return (
      <Screen footer={<Button label="CONTINUE" onPress={next} disabled={tried.length === 0} />}>
        {header}
        <Text style={type.title}>What have you tried before?</Text>
        <Text style={[type.body, { color: colors.muted }]}>Pick all that apply.</Text>
        <View style={{ gap: space.sm }}>
          {TRIED.map((o) => (
            <Option key={o.id} multi label={o.label} selected={tried.includes(o.id)} onPress={() => toggle(tried, setTried, o.id, 'none')} />
          ))}
          {tried.includes('other') ? (
            <View style={{ gap: 6 }}>
              <Text nativeID="otherLabel" style={[type.small, { fontWeight: '800' }]}>What else have you tried?</Text>
              <TextInput
                accessibilityLabelledBy="otherLabel"
                accessibilityLabel="What else have you tried?"
                value={triedOther}
                onChangeText={setTriedOther}
                placeholder="e.g. gum, hypnosis, an app"
                placeholderTextColor={colors.faint}
                style={{ borderWidth: 2, borderColor: colors.line, borderRadius: 14, padding: 14, fontSize: 16, fontWeight: '600', color: colors.ink, minHeight: 48 }}
              />
            </View>
          ) : null}
        </View>
      </Screen>
    );
  }

  if (id === 'reflect') {
    const n = tried.filter((t) => t !== 'none').length;
    const firstTimer = tried.includes('none') || n === 0;
    return (
      <Screen bg={colors.bgTint} footer={<Button label="THAT MAKES SENSE" onPress={next} />}>
        {header}
        <View style={{ flex: 1, justifyContent: 'center', gap: space.lg }}>
          {firstTimer ? (
            <>
              <Text style={type.title}>Great place to start</Text>
              <Text style={type.body}>You get to skip the methods that rarely last and go straight to the ones with the best evidence.</Text>
            </>
          ) : (
            <>
              <Text style={type.title}>
                You've tried {n === 1 ? 'something' : `${n} things`}. That takes real effort.
              </Text>
              <Text style={type.body}>
                If they didn't stick, it's not a willpower problem. Most common methods punish the habit or rely on remembering in the moment. Neither changes what your hands do on autopilot.
              </Text>
              <Card style={{ backgroundColor: colors.primarySoft, borderColor: colors.primarySoft }}>
                <Text style={[type.body, { fontWeight: '800' }]}>What Nibblr does differently</Text>
                <Text style={type.body}>You'll learn to catch the urge early, swap in a hand action that outlasts it, and fix the triggers behind it.</Text>
              </Card>
            </>
          )}
        </View>
      </Screen>
    );
  }

  if (id === 'triggers') {
    return (
      <Screen footer={<Button label="CONTINUE" onPress={next} disabled={triggers.length === 0} />}>
        {header}
        <Text style={type.title}>When does it usually happen?</Text>
        <Text style={[type.body, { color: colors.muted }]}>Pick all that apply. We'll use this to suggest the right tools.</Text>
        <View style={{ gap: space.sm }}>
          {TRIGGERS.map((o) => (
            <Option key={o.id} multi label={o.label} selected={triggers.includes(o.id)} onPress={() => toggle(triggers, setTriggers, o.id, 'unsure')} />
          ))}
        </View>
      </Screen>
    );
  }

  if (id === 'goal') {
    return (
      <Screen footer={<Button label="CONTINUE" onPress={next} />}>
        {header}
        <Text style={type.title}>How much time do you want to give this each day?</Text>
        <Text style={[type.body, { color: colors.muted }]}>
          You'll unlock up to 2 new lessons a day. Short daily sessions help you remember more than long ones.
        </Text>
        <View style={{ gap: space.sm }}>
          {GOALS.map((g) => (
            <Option
              key={g.min}
              label={`${g.min === 15 ? '15+' : g.min} min · ${g.label}`}
              detail={g.detail}
              selected={goalMin === g.min}
              onPress={() => setGoalMin(g.min)}
              right={g.min === 5 ? <Text style={{ fontSize: 12, fontWeight: '900', color: colors.primaryDark }}>POPULAR</Text> : null}
            />
          ))}
        </View>
      </Screen>
    );
  }

  if (id === 'time') {
    return (
      <Screen footer={<Button label="CONTINUE" onPress={next} />}>
        {header}
        <Text style={type.title}>When's a good time for your daily lesson?</Text>
        <Text style={[type.body, { color: colors.muted }]}>People who plan when they'll do something are much more likely to follow through. We'll remind you then.</Text>
        <View style={{ gap: space.sm }}>
          {TIMES.map((t) => (
            <Option key={t} label={t} selected={reminder === t} onPress={() => setReminder(t)} />
          ))}
        </View>
      </Screen>
    );
  }

  // Final step: a plan built from their answers.
  const tools: string[] = [];
  if (triggers.includes('edge')) tools.push('A "file, don\'t bite" checklist for rough edges');
  if (triggers.includes('stress')) tools.push('A breathing guide for stressful moments');
  if (triggers.some((t) => ['bored', 'tv', 'screen', 'driving'].includes(t))) tools.push('A 60-second hand swap for zoned-out moments');
  if (tools.length === 0) tools.push('A 60-second hand swap for any urge', 'A breathing guide for strong cravings');
  const profile: Profile = { tried, triedOther, triggers, goalMin, reminder };

  return (
    <Screen
      bg={colors.bgTint}
      footer={
        <Button
          label="START LESSON 1"
          onPress={() => {
            finishOnboarding(profile);
            nav.push({ name: 'lesson', id: 'l1' });
          }}
        />
      }
    >
      {header}
      <Text style={type.title}>Your plan is ready</Text>
      <Card>
        <Text style={type.eyebrow}>EACH DAY</Text>
        <Text style={type.h2}>{goalMin === 15 ? '15+' : goalMin} minutes, {reminder.toLowerCase()}</Text>
        <Text style={type.small}>Up to 2 new lessons, plus quick recaps of what you've learned.</Text>
      </Card>
      <Card>
        <Text style={type.eyebrow}>TOOLS PICKED FOR YOU</Text>
        {tools.map((t) => (
          <View key={t} style={{ flexDirection: 'row', gap: space.md, alignItems: 'center' }}>
            <Icon name="sparkle" size={20} color={colors.primary} />
            <Text style={[type.body, { flex: 1 }]}>{t}</Text>
          </View>
        ))}
      </Card>
      <Card style={{ backgroundColor: colors.successSoft, borderColor: colors.successSoft }}>
        <Text style={[type.body, { fontWeight: '800', color: colors.successText }]}>Our promise</Text>
        <Text style={[type.body, { color: colors.successText }]}>Slips are part of this. Your progress never resets to zero.</Text>
      </Card>
    </Screen>
  );
}
