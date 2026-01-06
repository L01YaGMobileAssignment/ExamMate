# ExamMate

**ExamMate** is a student-friendly tool designed to help you prepare smarter and perform better in exams.  
It provides everything you need to stay organized, track progress, and build confidence before test day.

---

## Features
- **Exam Planning** – Create structured study plans tailored to your exam schedule.
- **Practice Tests** – Generate mock exams to test your knowledge and identify weak areas.
- **Smart Reminders** – Stay on track with timely study notifications and revision alerts.

---

## Why ExamMate?
With ExamMate, you don't just study — you prepare with purpose.  
It helps you manage your time, reinforce what you've learned, and reduce exam stress.

---

## Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Android Studio (for Android builds)
- Expo CLI: `npm install -g expo-cli`

### Installation
```bash
git clone https://github.com/L01YaGMobileAssignmentHK251/ExamMate.git
cd ExamMate
npm install
```

### Environment Variables
Create a `.env` file based on `.env.dev`:
```env
EXPO_PUBLIC_API_URL=your-api-url
EXPO_PUBLIC_SENTRY_DSN=your-sentry-dsn
EXPO_PUBLIC_NOTIFY_TIME=15
```

### Run Development Server
```bash
npm start
```

---

## Building APK

### Step 1: Generate Android Project
```bash
npx expo prebuild --clean
```

### Step 2: Build Release APK
```bash
cd android
$env:SENTRY_DISABLE_AUTO_UPLOAD='true'; .\gradlew.bat assembleRelease
```
> **Note:** `SENTRY_DISABLE_AUTO_UPLOAD` skips source map upload. Remove it if you have Sentry auth configured.

### Step 3: Find APK
```
android/app/build/outputs/apk/release/app-release.apk
```

### Alternative: Build via Android Studio
1. Open `android` folder in Android Studio
2. Wait for Gradle sync
3. **Build → Build Bundle(s) / APK(s) → Build APK(s)**

---

## Sentry Error Tracking

This project uses Sentry for error monitoring. All team members should use the **same DSN** to report to the shared dashboard.

---

## Tech Stack
- React Native (Expo)
- TypeScript
- React Navigation
- TanStack Query
- Zustand (State Management)
- Sentry (Error Tracking)
