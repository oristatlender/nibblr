// A lesson: hook, cards, a "try it" step, the quiz, then a takeaway.
// Each part is one page, and the bar at the top shows how far through you are.

import React, { useState } from 'react';
import { Linking, Pressable, Text, View } from 'react-native';
import { lessons } from '../content/lessons';
import { Button, Card, FlowHeader, Pill, Screen } from '../components/ui';
import { CountdownRing, useCountdown } from '../components/Countdown';
import { QuizQuestion } from '../components/QuizQuestion';
import { Icon } from '../components/Icon';
import { useNav } from '../nav';
import { useStore } from '../store';
import { colors, space, type } from '../theme';
import { TOOL_INFO } from './toolInfo';

export function LessonScreen({ id }: { id: string }) {
  const nav = useNav();
  const { completeLesson, state } = useStore();
  const lesson = lessons.find((l) => l.id === id)!;
  const pages = ['hook', ...lesson.cards.map((_, i) => `card${i}`), 'try', ...lesson.quiz.map((_, i) => `q${i}`), 'done'];
  const [page, setPage] = useState(0);
  const [score, setScore] = useState(0);
  const [timerOn, setTimerOn] = useState(false);
  const [timerDone, setTimerDone] = useState(false);
  const seconds = lesson.tryIt.seconds ?? 0;
  const left = useCountdown(seconds, timerOn, () => setTimerDone(true));

  const current = pages[page];
  const next = () => setPage((p) => Math.min(p + 1, pages.length - 1));
  const alreadyDone = !!state.completed[lesson.id];
  const header = (
    <FlowHeader icon="close" onBack={() => nav.back()} progress={page / (pages.length - 1)} />
  );

  if (current === 'hook') {
    return (
      <Screen bg={colors.bgTint} footer={<Button label="LET'S GO" onPress={next} />}>
        {header}
        <View style={{ flex: 1, justifyContent: 'center', gap: space.lg }}>
          <Text style={type.eyebrow}>LESSON {lesson.number} · {lesson.minutes} MIN</Text>
          <Text style={[type.title, { fontSize: 32, lineHeight: 38 }]}>{lesson.title}</Text>
          <Text style={[type.body, { fontSize: 19, lineHeight: 27 }]}>{lesson.hook}</Text>
        </View>
      </Screen>
    );
  }

  if (current.startsWith('card')) {
    const i = Number(current.slice(4));
    const card = lesson.cards[i];
    return (
      <Screen footer={<Button label="NEXT" onPress={next} />}>
        {header}
        <Text style={type.eyebrow}>CARD {i + 1} OF {lesson.cards.length}</Text>
        <Text style={type.title}>{card.title}</Text>
        <Card style={{ backgroundColor: colors.bgTint, borderColor: colors.bgTint, padding: space.xl }}>
          <Text style={[type.body, { fontSize: 18, lineHeight: 27 }]}>{card.body}</Text>
          {card.source ? (
            <Pressable accessibilityRole="link" onPress={() => Linking.openURL(card.source!.url)} style={{ flexDirection: 'row', gap: 6, alignItems: 'center', minHeight: 44 }}>
              <Icon name="book" size={16} color={colors.primaryDark} />
              <Text style={{ fontSize: 14, fontWeight: '800', color: colors.primaryDark, textDecorationLine: 'underline' }}>Source: {card.source.label}</Text>
            </Pressable>
          ) : null}
        </Card>
      </Screen>
    );
  }

  if (current === 'try') {
    const needsTimer = seconds > 0;
    const canContinue = !needsTimer || timerDone;
    return (
      <Screen
        footer={
          <>
            {needsTimer && !timerOn ? <Button label="START TIMER" onPress={() => setTimerOn(true)} /> : null}
            <Button label={canContinue ? 'CONTINUE' : 'SKIP FOR NOW'} variant={canContinue ? 'primary' : 'ghost'} onPress={next} disabled={needsTimer && timerOn && !timerDone} />
          </>
        }
      >
        {header}
        <Pill text="TRY IT" color={colors.successText} bg={colors.successSoft} />
        <Text style={type.title}>{lesson.tryIt.title}</Text>
        <Text style={[type.body, { fontSize: 18, lineHeight: 27 }]}>{lesson.tryIt.body}</Text>
        {needsTimer ? (
          <View style={{ marginTop: space.lg }}>
            <CountdownRing seconds={seconds} left={left} color={timerDone ? colors.success : colors.primary} caption={timerDone ? 'done!' : 'seconds'} />
          </View>
        ) : null}
      </Screen>
    );
  }

  if (current.startsWith('q')) {
    const i = Number(current.slice(1));
    const q = lesson.quiz[i];
    return (
      <Screen>
        {header}
        <QuizQuestion
          key={q.id}
          q={q}
          eyebrow={`QUESTION ${i + 1} OF ${lesson.quiz.length}`}
          onDone={(ok) => {
            if (ok) setScore((s) => s + 1);
            if (i === lesson.quiz.length - 1 && !alreadyDone) completeLesson(lesson.id, lesson.minutes);
            next();
          }}
        />
      </Screen>
    );
  }

  // Done page
  const tool = lesson.unlocks ? TOOL_INFO[lesson.unlocks] : null;
  return (
    <Screen bg={colors.bgTint} footer={<Button label="BACK TO TODAY" onPress={() => nav.home('today')} />}>
      <View style={{ flex: 1, justifyContent: 'center', gap: space.lg }}>
        <View style={{ width: 80, height: 80, borderRadius: 999, backgroundColor: colors.success, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="check" size={44} color="#FFFFFF" stroke={3.5} />
        </View>
        <Text style={type.title}>Lesson complete</Text>
        <Text style={type.small}>
          {score} of {lesson.quiz.length} correct. These questions will come back in your recaps so they stick.
        </Text>
        <Card>
          <Text style={type.eyebrow}>TAKEAWAY</Text>
          <Text style={[type.body, { fontSize: 18, lineHeight: 26, fontWeight: '800' }]}>{lesson.takeaway}</Text>
        </Card>
        {tool ? (
          <Card style={{ backgroundColor: colors.primarySoft, borderColor: colors.primarySoft }}>
            <Text style={type.eyebrow}>NEW TOOL UNLOCKED</Text>
            <Text style={type.h2}>{tool.title}</Text>
            <Text style={type.small}>Find it any time in the Tools tab.</Text>
          </Card>
        ) : null}
      </View>
    </Screen>
  );
}
