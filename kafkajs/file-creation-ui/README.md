# File Creation UI

Next.js-based UI for the distributed file creation system.

## Setup

```bash
npm install
npm run dev
```

The UI will be available at `http://localhost:3004`

## Features

- **Create Files**: Form to submit title and description
- **View Files**: List all files with their current status
- **Auto-refresh**: Automatically updates every 2 seconds
- **Status Tracking**: Visual indicators for pending, processing, completed, and failed states
- **S3 Location**: Shows S3 path when file is completed
- **System Dashboard**: Overview of file counts by status

## Requirements

- API Service running on port 3000
- File Service running on port 3001
- All infrastructure services (Kafka, PostgreSQL, LocalStack) running

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React Hooks
