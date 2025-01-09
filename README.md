# Chanel Fashion App

A sophisticated heigtly opinionated clone of Chanel's e-commerce platform that showcases modern web architecture, advanced caching strategies, and elegant solutions to complex pagination challenges. This project demonstrates expertise in full-stack development, system design, and performance optimization.

## Features

- 🔍 Advanced Search System

  - Real-time suggestions
  - Multi-layer caching (Memory + IndexedDB + CDN + Redis)
  - Debounced queries
  - Search history tracking

- 🎨 UI/UX Improvements

  - Responsive design
  - Optimized loading states
  - Clean transitions
  - TypeScript-powered autocompletion

- 🚀 Performance
  - Client-side caching
  - Optimized API calls
  - Stable object references (optimized re-renders)
  - Memory usage monitoring

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: Next.js API Routes
- **State Management**: Zustand
- **Caching**: Custom implementation (Memory + IndexedDB)
  - Client: Memory + IndexedDB
  - Server: Redis + Memory
- **Styling**: Tailwind CSS

## Architecture

### Dynamic (Facade) Pagination

The application implements a **dynamic Facade Pagination** to address inconsistent and non-dynamic pagination responses from the backend API. This ensures a streamlined and unified user experience across different search axes (tabs).

**Problem Solved**

- **Inconsistent Page Sizes**: Various Chanel API endpoints return differing numbers of items per page based on the search axis (e.g., Fashion returns 27, Jewelry returns 6).

**Solution: Transparent Page Aggregation**

1. **Pagination Boundaries Calculation**
   - Determines necessary backend pages to fetch based on the frontend's desired page size.
2. **Response Aggregation**
   - Combines multiple backend responses so the frontend can display a uniform page of results.
3. **Consistent Frontend Experience**
   - Ensures users always see the same number of items per page, regardless of the backend’s axis.
4. **Offset Handling**
   - Accurately calculates offsets to retrieve the correct subset of items from each backend response.

**Example Workflow**

```plaintext
Frontend Request: page=1, size=27
↓
Backend Responses:
- Fashion: 27 items/page (requires 1 requests)
- Jewelry: 6 items/page (requires 5 requests)
↓
Frontend Display: Consistently displays 27 items
```

### Multi-Layer Caching System

The app utilizes an **Adapter-Based Caching System** to optimize data retrieval and enhance performance on both client and server sides.

**Key Features**

- **Adapter Pattern**

  - **Flexibility**: Easily switch or add caching mechanisms without changing core logic.
  - **Priority-Based Checking**: Checks caches in a defined order (Memory → IndexedDB) or (Memory → Redis).

- **Cache Adapters**

  - **Client-Side**
    - **Memory Cache**: Fast, in-memory storage for immediate reads.
    - **IndexedDB Cache**: Persistent storage for larger datasets.
  - **Server-Side**
    - **Memory Cache**: Shared quick-access storage across server instances.
    - **Redis Cache**: Distributed, high-speed caching for scalability and persistence.

- **Automatic Garbage Collection**

  - Prevents indefinite cache growth by removing older data when size thresholds are exceeded.

- **Memory Usage Monitoring**

  - Logs usage for optimization and performance tracking.

- **TTL (Time-To-Live) Support**
  - Ensures data is refreshed periodically for accuracy.

**Cache Configuration Example**

```typescript
interface CacheAdapter {
  get: <T>(key: string) => Promise<T | undefined>
  set: <T>(key: string, value: T, ttl?: number) => Promise<void>
}
// ...existing code...
const CLIENT_CACHE_ADAPTERS = [
  memoryAdapter, // Fast, in-memory
  indexedDbAdapter, // Persistent, larger
]

const SERVER_CACHE_ADAPTERS = [
  memoryAdapter, // fast, cheap = only to save money
  redisCacheAdapter, // Distributed caching
]
// ...existing code...
```

### Project Structure

```markdown
src/
├── app/ # Next.js app router
├── components/ # React components
├── lib/
│ ├── api/ # API functions
│ ├── helpers/ # Utilities
│ └── store/ # Zustand stores
└── types/ # TypeScript definitions
```

## Getting Started

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
