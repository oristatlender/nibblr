// The daily recap: questions from earlier lessons, brought back at growing gaps (1, 3, 7, 14 days).

import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { Button, FlowHeader, Screen } from '../components/ui';
import { QuizQuestion } from '../components/QuizQuestion';
import { useNav } from '../nav';
import { dueReview, useStore } from '../store';
import { colors, space, type } from '../theme';

export function ReviewScreen() {
  const nav = useNav();
  const { state, today, answerReview, addMinutes } = useStore();
  // Freeze the list when the recap opens, so answering doesn't reshuffle it.
  const [questions] = useState(() => dueReview(state, today));
  const [i, setI] = useState(0);
  const [right, setRight] = useState(0);

  if (questions.length === 0 || i >= questions.length) {
    return (
      <Screen bg={colors.successSoft} footer={<Button label="BACK TO TODAY" variant="success" onPress={() => nav.home('today')} />}>
        <View style={{ flex: 1, justifyContent: 'center', gap: space.lg }}>
          <Text style={[type.title, { color: colors.successText }]}>Recap done</Text>
          <Text style={[type.body, { color: '#145A41' }]}>
            {questions.length ? `${right} of ${questions.length} right. ` : ''}Bringing old ideas back is one of the best-proven ways to remember them.
          </Text>
        </View>
      </Screen>
    );
  }

  const q = questions[i];
  return (
    <Screen>
      <FlowHeader icon="close" onBack={() => nav.back()} progress={i / questions.length} color={colors.success} label={`${i + 1} / ${questions.length}`} />
      <QuizQuestion
        key={q.id}
        q={q}
        eyebrow="RECAP"
        onDone={(ok) => {
          answerReview(q.id, ok);
          if (ok) setRight((r) => r + 1);
          if (i === questions.length - 1) addMinutes(1);
          setI((n) => n + 1);
        }}
      />
    </Screen>
  );
}
