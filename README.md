# Nibblr (MVP prototype)

An Expo (React Native) app that teaches the psychology of nail biting through short daily lessons, quizzes and hand-habit tools. One codebase runs on the web, iPhone and Android.

## What's in it

- `App.tsx`: the entry point. Shows onboarding the first time, then the Today, Tools and Progress tabs.
- `src/content/lessons.ts`: all 10 lessons and their quizzes. Edit the wording here.
- `src/store.tsx`: everything the app remembers, saved on the device. There are no accounts yet.
- `src/nav.tsx`: a small home-made navigator, so the web preview works from any web address. Switch to Expo Router before the App Store release.
- `src/screens/`: one file per area (Onboarding, Today, Lesson, Review, Tools, Progress).
- `src/theme.ts`: colors and type sizes. Changing the look starts here.

## Rules built in

- Lessons unlock in order, with at most 2 new lessons a day.
- Quiz questions come back in recaps 1, 3, 7 and 14 days later.
- The 28-day rolling score counts bite-free days and never resets.
- Settings has prototype-only buttons to skip to tomorrow and start over.

## Running it

```bash
npm install
npx expo start          # then press w for web, or scan the QR code with Expo Go
bash scripts-build-preview.sh   # builds the hosted web preview into web-preview/
```
