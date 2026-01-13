# Inquiry Kanban Board

A Next.js-based Kanban board application for managing event inquiries. This application allows users to track inquiries through different phases, filter them by various criteria, and manage them using drag-and-drop functionality.

## Features

- **Kanban Board**: Visual board with 4 columns representing different inquiry phases
- **Drag and Drop**: Move inquiries between phases using drag-and-drop
- **Filtering**: Filter inquiries by client name, minimum value, and date range
- **Real-time Updates**: Phase changes are immediately reflected in the UI
- **Modal Details**: View and edit inquiry details in a modal dialog
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Setup Instructions

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd inquiry-kanban
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Project Structure Overview

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── inquiries/     # Inquiry endpoints
│   │       ├── route.ts   # GET /api/inquiries (list with filters)
│   │       └── [inquiriesId]/
│   │           └── route.ts # PATCH /api/inquiries/[id] (update phase)
│   ├── hooks/             # Custom React hooks
│   │   └── useDebounce.ts # Debounce hook for filter inputs
│   ├── layout.tsx         # Root layout with global styles
│   └── page.tsx           # Main page component
├── components/            # React components
│   ├── FilterForm.tsx     # Filter controls with URL state management
│   ├── KanbanBoard.tsx    # Main board container with drag-drop context
│   ├── KanbanColumn.tsx   # Individual phase column
│   ├── InquiryCard.tsx    # Draggable inquiry card item
│   └── InquiryModal.tsx   # Detail view and edit modal
├── constants/             # Constants
│   └── phases.ts          # Phase definitions (new, sent_to_hotels, etc.)
├── types/                 # TypeScript type definitions
│   └── inquiry.ts          # Inquiry and Phase types
├── store.ts               # Zustand store for global state
└── mockData.ts            # Mock data for development
```

### Key Files

- **`src/app/page.tsx`**: Main entry point that reads URL params and orchestrates data fetching
- **`src/store.ts`**: Zustand store managing inquiries state, fetching, and phase updates
- **`src/components/KanbanBoard.tsx`**: Sets up drag-and-drop context and renders columns
- **`src/components/FilterForm.tsx`**: Handles filter inputs and URL state synchronization
- **`src/app/api/inquiries/route.ts`**: Server-side filtering logic

## Libraries Used and Why

### Core Framework

**Next.js 16.1.1 (App Router)**
- **Why**: Modern React framework with built-in routing, API routes, and server-side rendering capabilities
- **Benefits**: Co-located API routes, type-safe routing, excellent developer experience

**React 19.2.3**
- **Why**: Latest React version with improved performance and features
- **Benefits**: Concurrent rendering, automatic batching, better hooks

**TypeScript**
- **Why**: Type safety and better developer experience
- **Benefits**: Catch errors at compile time, better IDE support, self-documenting code

### State Management

**Zustand**
- **Why**: Chosen over Redux or Context API for simplicity and performance
- **Benefits**: 
  - Minimal boilerplate (no action creators, reducers, or providers)
  - Direct hook access without provider wrapper
  - Excellent TypeScript inference
  - Smaller bundle size than Redux
- **Use Case**: Manages global inquiry state, loading states, and actions

### Drag and Drop

**@dnd-kit/core**
- **Why**: Chosen over react-beautiful-dnd for better maintenance and flexibility
- **Benefits**:
  - Actively maintained (react-beautiful-dnd is less maintained)
  - Better touch device support
  - More customizable and flexible
  - Better accessibility features
  - Smaller bundle size
- **Use Case**: Enables dragging inquiry cards between phase columns

### Styling

**Tailwind CSS**
- **Why**: Utility-first CSS framework for rapid development
- **Benefits**:
  - Fast development with utility classes
  - Built-in design system and consistency
  - Automatic purging of unused styles
  - Built-in responsive breakpoints
- **Use Case**: All component styling throughout the application

### Date Handling

**date-fns**
- **Why**: Chosen over moment.js for better performance and bundle size
- **Benefits**:
  - Much smaller bundle size
  - Tree-shakeable (only import what you need)
  - Immutable (no mutation issues)
  - Better TypeScript support
- **Use Case**: Formatting and comparing event dates in filters and displays

### Additional Libraries

**No UI Component Library**
- **Why**: Custom components built from scratch
- **Benefits**:
  - Full control over design and behavior
  - No unnecessary bundle size
  - Better understanding of implementation
  - No library constraints

## Development Notes

### Mock Data
The application uses mock data stored in `src/mockData.ts`. This data is mutated in memory when phases are updated, so changes persist during the development session but reset on server restart.

### Type Safety
The entire application is typed with TypeScript, ensuring type safety across components, API routes, and state management.
