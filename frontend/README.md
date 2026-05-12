# AutoMinutes — Frontend

React + TypeScript frontend for the AutoMinutes AI meeting minutes tool.

## Quick Start

```bash
npm install
cp .env.example .env   # set VITE_API_BASE_URL
npm run dev
```

## Scripts
| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Run Prettier |

## Stack
React 18, TypeScript, Vite, Tailwind CSS, Zustand, React Router v6, Axios, React Hook Form, AG Grid, Lucide React, date-fns, React Hot Toast

## Structure
```
src/
  components/atoms/       Button, Input, Textarea, Select, Badge, Spinner
  components/molecules/   Modal, ConfirmDialog, MeetingCard
  components/organisms/   CreateMeetingModal
  components/templates/   AppLayout
  pages/                  MeetingsPage, MeetingDetailPage, ActionItemsPage
  services/               api, meetings, transcripts, attendees, actionItems
  store/                  useAppStore (Zustand)
  hooks/                  useMeetings, useTheme
  types/                  all TypeScript interfaces
  utils/                  format helpers
  styles/                 globals.css (design tokens)
```

## Phases
| Phase | What | Status |
|---|---|---|
| 1 | Foundation, config, design system, routing | Done |
| 2 | Meeting list, CRUD, search, filter, sort | Done |
| 3 | Transcript upload, attendee management | Next |
| 4 | AI processing + results display | Planned |
| 5 | Action items (AG Grid, inline editing) | Planned |
| 6 | Polish, skeletons, export | Planned |
