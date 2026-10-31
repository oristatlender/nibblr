// The app's entry point. It wires up saved data and navigation,
// then shows onboarding the first time and the three tabs after that.

import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StoreProvider, useStore } from './src/store';
import { NavProvider, Tab, useNav } from './src/nav';
import { Screen } from './src/components/ui';
import { Icon, IconName } from './src/components/Icon';
import { Onboarding } from './src/screens/Onboarding';
import { TodayTab } from './src/screens/Today';
import { LessonScreen } from './src/screens/Lesson';
import { ReviewScreen } from './src/screens/Review';
import { RescueScreen, ToolScreen, ToolsTab } from './src/screens/Tools';
import { ProgressTab, SettingsScreen } from './src/screens/Progress';
import { colors } from './src/theme';

export default function App() {
  return (
    <SafeAreaProvider>
      <StoreProvider>
        <NavProvider>
          <StatusBar style="dark" />
          <Root />
        </NavProvider>
      </StoreProvider>
    </SafeAreaProvider>
  );
}

function Root() {
  const { state, ready } = useStore();
  const nav = useNav();
  if (!ready) return <View style={{ flex: 1, backgroundColor: colors.bg }} />;
  if (!state.onboarded) return <Onboarding />;

  const r = nav.route;
  if (r.name === 'lesson') return <LessonScreen id={r.id} />;
  if (r.name === 'review') return <ReviewScreen />;
  if (r.name === 'rescue') return <RescueScreen />;
  if (r.name === 'tool') return <ToolScreen tool={r.tool} fromRescue={r.fromRescue} />;
  if (r.name === 'settings')
    return (
      <Screen>
        <SettingsScreen onClose={nav.back} />
      </Screen>
    );

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ flex: 1 }}>
        <Screen bg={nav.tab === 'today' ? colors.bgTint : colors.bg}>
          {nav.tab === 'today' ? <TodayTab /> : nav.tab === 'tools' ? <ToolsTab /> : <ProgressTab />}
        </Screen>
      </View>
      <TabBar />
    </View>
  );
}

const TABS: { id: Tab; label: string; icon: IconName }[] = [
  { id: 'today', label: 'Today', icon: 'home' },
  { id: 'tools', label: 'Tools', icon: 'hand' },
  { id: 'progress', label: 'Progress', icon: 'chart' },
];

function TabBar() {
  const nav = useNav();
  const insets = useSafeAreaInsets();
  return (
    <View
      accessibilityRole="tablist"
      style={{ flexDirection: 'row', borderTopWidth: 2, borderTopColor: colors.lineSoft, backgroundColor: '#FFFFFF', paddingTop: 6, paddingBottom: Math.max(insets.bottom, 12), justifyContent: 'center' }}
    >
      <View style={{ flexDirection: 'row', width: '100%', maxWidth: 480 }}>
        {TABS.map((t) => {
          const on = nav.tab === t.id;
          return (
            <Pressable
              key={t.id}
              accessibilityRole="tab"
              accessibilityState={{ selected: on }}
              onPress={() => nav.setTab(t.id)}
              style={{ flex: 1, alignItems: 'center', gap: 2, paddingVertical: 4, minHeight: 48 }}
            >
              <Icon name={t.icon} size={26} color={on ? colors.primary : colors.faint} />
              <Text style={{ fontSize: 12, fontWeight: '800', color: on ? colors.primary : colors.faint }}>{t.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
