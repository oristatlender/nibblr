// The home tab. In the spirit of Noom: focus on today, the current lesson and a short plan,
// not on how many lessons are left.

import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { lessons } from '../content/lessons';
import { Button, Card, IconTile } from '../components/ui';
import { Icon } from '../components/Icon';
import { useNav } from '../nav';
import { daysBetween, dueReview, nextLesson, prettyDate, rollingScore, unlockedTools, useStore } from '../store';
import { colors, radius, space, type } from '../theme';

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
}

export function TodayTab() {
  const nav = useNav();
  const { state, today, markDay } = useStore();
  const dayNum = daysBetween(state.startDate, today) + 1;
  const score = rollingScore(state, today);
  const { lesson, available, doneToday } = nextLesson(state, today);
  const recap = dueReview(state, today);
  const minutes = state.minutes[today] ?? 0;
  const goal = state.profile.goalMin;
  const unlocked = unlockedTools(state);
  const practicedToday = state.practiced[today] ?? [];
  const finishedToday = lessons.filter((l) => state.completed[l.id] === today);
  const dayStatus = state.days[today];

  // A practice suggestion: the newest unlocked hand tool.
  const practiceTool = (['fakeout', 'circle', 'breathe', 'swap'] as const).find((t) => unlocked.has(t));

  type Item = { key: string; label: string; done: boolean; onPress?: () => void };
  const plan: Item[] = [];
  if (recap.length > 0) plan.push({ key: 'recap', label: `Quick recap · ${recap.length} question${recap.length > 1 ? 's' : ''}`, done: false, onPress: () => nav.push({ name: 'review' }) });
  finishedToday.forEach((l) => plan.push({ key: l.id, label: l.title, done: true }));
  if (lesson && available) plan.push({ key: 'lesson', label: lesson.title, done: false, onPress: () => nav.push({ name: 'lesson', id: lesson.id }) });
  if (practiceTool) {
    const label = { swap: 'Practice the 60-second swap', breathe: 'Practice one urge-surfing wave', circle: 'Practice the gentle circle', fakeout: 'Practice 5 fake-out moves' }[practiceTool];
    plan.push({ key: 'practice', label, done: practicedToday.includes(practiceTool), onPress: () => nav.push({ name: 'tool', tool: practiceTool }) });
  }

  return (
    <>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <View style={{ flex: 1 }}>
          <Text style={[type.small, { fontWeight: '800' }]}>{prettyDate(today)} · Day {dayNum}</Text>
          <Text style={type.title}>{greeting()}</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${score} of the last 28 days bite-free. Open progress.`}
          onPress={() => nav.setTab('progress')}
          style={{ flexDirection: 'row', gap: 6, alignItems: 'center', backgroundColor: colors.successSoft, paddingHorizontal: 12, minHeight: 40, borderRadius: radius.pill }}
        >
          <Icon name="check" size={16} color={colors.successText} stroke={3} />
          <Text style={{ fontSize: 14, fontWeight: '800', color: colors.successText }}>{score}/28</Text>
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="Settings" onPress={() => nav.push({ name: 'settings' })} style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="gear" color={colors.faint} />
        </Pressable>
      </View>

      {/* Hero: the one thing to do now */}
      {lesson && available ? (
        <View style={{ backgroundColor: '#FFFFFF', borderRadius: radius.xl, borderWidth: 2, borderBottomWidth: 5, borderColor: colors.line, overflow: 'hidden' }}>
          <View style={{ height: 120, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#FFFFFF', fontSize: 56, fontWeight: '900', opacity: 0.95 }}>{lesson.number}</Text>
          </View>
          <View style={{ padding: space.lg, gap: space.sm }}>
            <Text style={type.eyebrow}>{doneToday > 0 ? 'ONE MORE FOR TODAY' : "TODAY'S LESSON"} · {lesson.minutes} MIN</Text>
            <Text style={[type.h2, { fontSize: 23 }]}>{lesson.title}</Text>
            <Text style={type.small}>{lesson.summary}</Text>
            <Button label="START LESSON" onPress={() => nav.push({ name: 'lesson', id: lesson.id })} style={{ marginTop: space.sm }} />
          </View>
        </View>
      ) : (
        <Card style={{ backgroundColor: colors.successSoft, borderColor: colors.successSoft, padding: space.xl }}>
          <Text style={type.eyebrow}>{lesson ? 'NEW LESSONS DONE FOR TODAY' : 'ALL LESSONS DONE'}</Text>
          <Text style={[type.h2, { color: colors.successText }]}>
            {lesson ? `"${lesson.title}" unlocks tomorrow` : 'You finished the course'}
          </Text>
          <Text style={[type.body, { color: '#145A41' }]}>
            {lesson
              ? 'Spacing lessons out helps them stick. Use extra time for a recap or a practice.'
              : 'Keep your skills sharp with recaps and practice. Your tools are always in the Tools tab.'}
          </Text>
        </Card>
      )}

      {/* Today's plan */}
      <Card>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 16, fontWeight: '900', color: colors.ink }}>Today's plan</Text>
          <Text style={[type.small, { fontSize: 13 }]}>
            {minutes} of {goal} min
          </Text>
        </View>
        {plan.length === 0 ? <Text style={type.small}>Nothing left. Nice work today.</Text> : null}
        {plan.map((p) => (
          <Pressable
            key={p.key}
            accessibilityRole={p.onPress && !p.done ? 'button' : undefined}
            disabled={!p.onPress || p.done}
            onPress={p.onPress}
            style={{ flexDirection: 'row', alignItems: 'center', gap: space.md, minHeight: 44 }}
          >
            {p.done ? (
              <View style={{ width: 24, height: 24, borderRadius: 999, backgroundColor: colors.success, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="check" size={14} color="#FFFFFF" stroke={4} />
              </View>
            ) : (
              <View style={{ width: 24, height: 24, borderRadius: 999, borderWidth: 3, borderColor: colors.primary }} />
            )}
            <Text style={{ flex: 1, fontSize: 15, fontWeight: p.done ? '700' : '800', color: p.done ? colors.faint : colors.ink, textDecorationLine: p.done ? 'line-through' : 'none' }}>
              {p.label}
            </Text>
            {!p.done && p.onPress ? <Icon name="chevron" size={18} color={colors.faint} stroke={3} /> : null}
          </Pressable>
        ))}
      </Card>

      {/* Daily check-in feeds the 28-day score */}
      <Card>
        <Text style={{ fontSize: 16, fontWeight: '900', color: colors.ink }}>How's today going?</Text>
        {dayStatus ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.md }}>
            <IconTile name={dayStatus === 'free' ? 'check' : 'pencil'} color={dayStatus === 'free' ? colors.successText : colors.sun} bg={dayStatus === 'free' ? colors.successSoft : colors.sunSoft} size={40} />
            <Text style={[type.body, { flex: 1 }]}>{dayStatus === 'free' ? 'Logged as bite-free. Nice.' : "Logged a slip. Tomorrow's a fresh day."}</Text>
          </View>
        ) : (
          <View style={{ flexDirection: 'row', gap: space.sm }}>
            <Button label="BITE-FREE" variant="success" onPress={() => markDay('free')} style={{ flex: 1 }} />
            <Button label="I SLIPPED" variant="secondary" onPress={() => nav.push({ name: 'tool', tool: 'slip' })} style={{ flex: 1 }} />
          </View>
        )}
      </Card>
    </>
  );
}
