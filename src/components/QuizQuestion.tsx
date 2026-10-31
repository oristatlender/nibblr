// One quiz question with instant feedback: pick an answer, see if it's right and why.
// Used at the end of lessons and in the daily recap.

import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { Question } from '../content/lessons';
import { colors, space, type } from '../theme';
import { Button, Option, Pill } from './ui';

export function QuizQuestion({ q, onDone, eyebrow = 'QUICK CHECK' }: { q: Question; onDone: (correct: boolean) => void; eyebrow?: string }) {
  const [picked, setPicked] = useState<number | null>(null);
  const answered = picked !== null;
  const correct = picked === q.answer;

  return (
    <View style={{ flex: 1, gap: space.lg }}>
      <Pill text={eyebrow} color="#7A5400" bg={colors.sunSoft} />
      <Text style={[type.title, { fontSize: 23, lineHeight: 30 }]}>{q.prompt}</Text>
      <View style={{ gap: space.sm }}>
        {q.options.map((o, i) => {
          let state: 'correct' | 'wrong' | 'dim' | undefined;
          if (answered) state = i === q.answer ? 'correct' : i === picked ? 'wrong' : 'dim';
          return <Option key={o} label={o} state={state} onPress={answered ? undefined : () => setPicked(i)} />;
        })}
      </View>
      {answered ? (
        <View
          accessibilityLiveRegion="polite"
          style={{
            marginTop: 'auto',
            backgroundColor: correct ? colors.successSoft : colors.warnSoft,
            borderRadius: 20,
            padding: space.lg,
            gap: space.sm,
          }}
        >
          <Text style={{ fontSize: 21, fontWeight: '900', color: correct ? colors.successText : colors.warnDark }}>
            {correct ? 'Nice one!' : 'Not quite'}
          </Text>
          <Text style={[type.body, { color: correct ? '#145A41' : colors.warnDark }]}>{q.why}</Text>
          <Button label="CONTINUE" variant={correct ? 'success' : 'warn'} onPress={() => onDone(correct)} />
        </View>
      ) : null}
    </View>
  );
}
