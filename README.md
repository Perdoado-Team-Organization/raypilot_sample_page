# RayPilot Sample Page

Sample React application demonstrating the [RayPilot SDK](https://www.npmjs.com/package/raypilot) integration for AI-powered medical DICOM image analysis.

## Features

- DICOM and ZIP file upload with drag-and-drop
- Real-time streaming (SSE) for ZIP processing with live progress
- Async queue + polling for single DCM files
- AI-powered radiological chat with full conversation history
- DICOM image viewer with metadata display and thumbnail navigation
- Suggested prompts for quick AI interaction

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy the sample env file and fill in your credentials:

```bash
cp .env_sample .env
```

```env
VITE_API_KEY=sk_your_api_key_here
VITE_API_URL=http://localhost:3088
```

### 3. Run the dev server

```bash
npm run dev
```

The app will be available at `http://localhost:3121`.

## Usage

1. Upload a `.dcm`, `.zip`, or image file
2. Wait for the AI processing to complete
3. View the exam images on the left panel
4. Chat with the AI about findings, generate reports, or ask for differential diagnoses

## Tech Stack

- [React 19](https://react.dev) + [Vite](https://vite.dev)
- [RayPilot SDK](https://www.npmjs.com/package/raypilot) (`npm install raypilot`)

## License

MIT
