// Progress tab: the 28-day rolling score (never resets), weekly minutes, and the private nail photo vault.

import React from 'react';
import { Image, Platform, Pressable, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { lessons } from '../content/lessons';
import { Button, Card } from '../components/ui';
import { Icon } from '../components/Icon';
import { last28, rollingScore, shortDate, useStore, weekMinutes } from '../store';
import { colors, space, type } from '../theme';

export function ProgressTab() {
  const { state, today, addPhoto } = useStore();
  const score = rollingScore(state, today);
  const grid = last28(state, today);
  const logged = grid.filter((d) => d.status).length;
  const slips = grid.filter((d) => d.status === 'slip').length;
  const done = lessons.filter((l) => state.completed[l.id]).length;
  const first = state.photos[0];
  const latest = state.photos.length > 1 ? state.photos[state.photos.length - 1] : null;
  const photoThisWeek = state.photos.some((p) => p.date > grid[20].key);

  const pickPhoto = async () => {
    // On the web this opens a file picker; on a phone it opens the camera.
    const opts: ImagePicker.ImagePickerOptions = { mediaTypes: ['images'], quality: 0.3, base64: Platform.OS === 'web', allowsEditing: true, aspect: [4, 3] };
    let res: ImagePicker.ImagePickerResult;
    if (Platform.OS === 'web') {
      res = await ImagePicker.launchImageLibraryAsync(opts);
    } else {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      res = perm.granted ? await ImagePicker.launchCameraAsync(opts) : await ImagePicker.launchImageLibraryAsync(opts);
    }
    if (res.canceled || !res.assets?.[0]) return;
    const a = res.assets[0];
    addPhoto(a.base64 ? `data:${a.mimeType ?? 'image/jpeg'};base64,${a.base64}` : a.uri);
  };

  return (
    <>
      <Text style={type.title}>Progress</Text>

      <Card>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: space.sm }}>
          <Text style={{ fontSize: 44, fontWeight: '900', color: colors.successText }}>{score}</Text>
          <Text style={{ fontSize: 17, fontWeight: '800', color: colors.ink, flex: 1 }}>of the last 28 days bite-free</Text>
        </View>
        <Text style={type.small}>
          {logged === 0
            ? 'Check in on the Today tab each day to fill this in.'
            : `${slips} slip day${slips === 1 ? '' : 's'} in this window. A slip only dips your score a little. It never resets.`}
        </Text>
        <View
          accessible
          accessibilityRole="image"
          accessibilityLabel={`Last 28 days: ${score} bite-free, ${slips} slips, ${28 - logged} not logged`}
          style={{ gap: 6, marginTop: space.sm }}
        >
          {[0, 1, 2, 3].map((row) => (
            <View key={row} style={{ flexDirection: 'row', gap: 6 }}>
          {grid.slice(row * 7, row * 7 + 7).map((d) => (
            <View
              key={d.key}
              style={{
                flex: 1,
                aspectRatio: 1,
                borderRadius: 8,
                backgroundColor: d.status === 'free' ? colors.success : d.status === 'slip' ? colors.slip : colors.lineSoft,
                borderWidth: d.isToday ? 3 : d.status ? 0 : 1,
                borderColor: d.isToday ? colors.ink : colors.line,
                opacity: d.beforeStart ? 0.4 : 1,
              }}
            />
          ))}
            </View>
          ))}
        </View>
        <View style={{ flexDirection: 'row', gap: space.lg, marginTop: space.xs }}>
          {[
            { c: colors.success, t: 'Bite-free' },
            { c: colors.slip, t: 'Slip' },
            { c: colors.lineSoft, t: 'Not logged' },
          ].map((l) => (
            <View key={l.t} style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <View style={{ width: 12, height: 12, borderRadius: 4, backgroundColor: l.c, borderWidth: 1, borderColor: colors.line }} />
              <Text style={[type.small, { fontSize: 12 }]}>{l.t}</Text>
            </View>
          ))}
        </View>
      </Card>

      <View style={{ flexDirection: 'row', gap: space.md }}>
        {[
          { n: `${weekMinutes(state, today)} min`, t: 'learning this week' },
          { n: String(state.urgesSurfed), t: 'urges handled' },
          { n: `${done}/10`, t: 'lessons done' },
        ].map((s) => (
          <Card key={s.t} style={{ flex: 1, padding: space.md }}>
            <Text style={{ fontSize: 20, fontWeight: '900', color: colors.primary }}>{s.n}</Text>
            <Text style={[type.small, { fontSize: 12 }]}>{s.t}</Text>
          </Card>
        ))}
      </View>

      <Card>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 17, fontWeight: '900', color: colors.ink }}>Nail photos</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Icon name="lock" size={14} color={colors.muted} />
            <Text style={[type.small, { fontSize: 12 }]}>Private, on this device</Text>
          </View>
        </View>
        {first ? (
          <View style={{ flexDirection: 'row', gap: space.sm }}>
            {[{ p: first, label: 'Then' }, ...(latest ? [{ p: latest, label: 'Now' }] : [])].map(({ p, label }) => (
              <View key={label} style={{ flex: 1, gap: 4 }}>
                <Image source={{ uri: p.uri }} accessibilityLabel={`${label} photo from ${shortDate(p.date)}`} style={{ width: '100%', aspectRatio: 4 / 3, borderRadius: 14, backgroundColor: colors.lineSoft }} />
                <Text style={[type.small, { fontSize: 12 }]}>
                  {label} · {shortDate(p.date)}
                </Text>
              </View>
            ))}
            {!latest ? (
              <View style={{ flex: 1, aspectRatio: 4 / 3, borderRadius: 14, borderWidth: 2, borderStyle: 'dashed', borderColor: colors.line, alignItems: 'center', justifyContent: 'center', padding: space.sm }}>
                <Text style={[type.small, { fontSize: 12, textAlign: 'center' }]}>Next week's photo goes here</Text>
              </View>
            ) : null}
          </View>
        ) : (
          <Text style={type.small}>Take one photo a week. Seeing then vs. now side by side shows healing your eyes miss day to day.</Text>
        )}
        <Button label={photoThisWeek ? 'ADD ANOTHER PHOTO' : "TAKE THIS WEEK'S PHOTO"} variant="secondary" onPress={pickPhoto} />
      </Card>
    </>
  );
}

export function SettingsScreen({ onClose }: { onClose: () => void }) {
  const { state, today, skipDay, resetAll } = useStore();
  const [confirm, setConfirm] = React.useState(false);
  return (
    <>
      <Pressable accessibilityRole="button" accessibilityLabel="Close settings" onPress={onClose} style={{ width: 44, height: 44, justifyContent: 'center' }}>
        <Icon name="close" color={colors.faint} stroke={3} />
      </Pressable>
      <Text style={type.title}>Settings</Text>
      <Card>
        <Text style={type.eyebrow}>YOUR PLAN</Text>
        <Text style={type.body}>
          {state.profile.goalMin} minutes a day, {state.profile.reminder.toLowerCase()}
        </Text>
      </Card>
      <Card style={{ borderColor: colors.sunSoft, backgroundColor: '#FFFBEF' }}>
        <Text style={type.eyebrow}>PROTOTYPE TESTING</Text>
        <Text style={type.small}>Lessons unlock 2 per day. Jump ahead a day to test without waiting. Today is {today}.</Text>
        <Button label="SKIP TO TOMORROW" variant="secondary" onPress={skipDay} />
        {confirm ? (
          <Button label="TAP AGAIN TO ERASE EVERYTHING" variant="warn" onPress={resetAll} />
        ) : (
          <Button label="START OVER" variant="ghost" onPress={() => setConfirm(true)} />
        )}
      </Card>
    </>
  );
}
