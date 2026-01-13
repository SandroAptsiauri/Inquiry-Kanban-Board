# Architecture Decisions

This document explains the key architectural and design decisions made during the development of the Inquiry Kanban Board application, including the rationale behind each choice and alternatives considered.

## 1. Why You Chose Your Drag-and-Drop Approach

### Decision: @dnd-kit Library

**Why @dnd-kit over react-beautiful-dnd?**

The primary alternative considered was `react-beautiful-dnd`, which is a popular and well-established library. However, @dnd-kit was chosen for several key reasons:

1. **Active Maintenance**: react-beautiful-dnd has seen less active maintenance and updates in recent years, while @dnd-kit is actively maintained with regular updates and bug fixes.

2. **Touch Support**: @dnd-kit provides superior touch device support out of the box, which is crucial for a modern application that needs to work on tablets and mobile devices.

3. **Flexibility**: @dnd-kit offers more customization options and is less opinionated about styling and behavior, giving us more control over the drag-and-drop experience.

4. **Accessibility**: Better built-in accessibility features, including keyboard navigation and screen reader support.

5. **Bundle Size**: Smaller footprint compared to react-beautiful-dnd, which helps with application performance.

6. **Modern Architecture**: Built with modern React patterns and hooks, making it easier to integrate with our React 19 codebase.

**Implementation Details:**
- `DndContext` wraps the entire Kanban board
- `PointerSensor` handles mouse and trackpad interactions
- `TouchSensor` handles touch device interactions
- `useDraggable` hook on inquiry cards makes them draggable
- `useDroppable` hook on columns makes them drop targets
- Simple drag end handler that extracts the dragged item ID and target phase, then updates the phase via the store

**Trade-offs:**
- Slightly steeper learning curve than react-beautiful-dnd
- Less community examples and tutorials (though documentation is good)
- Requires more manual configuration for complex scenarios

**Alternative Considered: Custom Implementation**
- We briefly considered building a custom drag-and-drop solution
- Rejected because it would require significant time investment for touch support, accessibility, and cross-browser compatibility
- The complexity of handling edge cases (scrolling during drag, multi-touch, etc.) made a library the better choice

---

## 2. How You Structured State Management

### Decision: Zustand for Global State

**Why Zustand over Redux or Context API?**

**Compared to Redux:**
- **Simplicity**: Zustand requires minimal boilerplate - no action creators, reducers, or complex setup
- **Performance**: No provider wrapper needed, components can directly access the store via hooks
- **TypeScript**: Excellent type inference without additional setup
- **Bundle Size**: Significantly smaller than Redux and its ecosystem
- **Learning Curve**: Much easier for developers to understand and use

**Compared to Context API:**
- **Performance**: Context API can cause unnecessary re-renders when any context value changes
- **Scalability**: Zustand scales better as the application grows
- **Developer Experience**: Better debugging and state inspection tools

**Store Structure:**

```typescript
useInquiryStore = {
  // State
  inquiries: Inquiry[]
  loading: boolean
  error: string | null
  
  // Actions
  fetchInquiries: (filters?) => Promise<void>
  updatePhase: (id, phase) => Promise<void>
}
```

**Key Design Decisions:**

1. **Single Store**: All inquiry-related state lives in one store for simplicity
2. **Co-located Actions**: Actions are defined alongside state, not in separate files
3. **Optimistic Updates**: Phase updates happen immediately in the UI before API confirmation
4. **Merge Strategy**: When fetching filtered results, we merge with local state using timestamp comparison to preserve unsaved changes
5. **Error Handling**: Rollback mechanism for failed API calls

**State Flow:**
- Initial load: Page component → `fetchInquiries()` → API → Store updates → Components re-render
- Phase update: User drags card → `updatePhase()` → Local state updates immediately → API call in background → Rollback on error
- Filtering: Filter changes → URL updates → `fetchInquiries()` with filters → API filters server-side → Store merges with local updates

**Why Not Separate Stores?**
- Current scope doesn't warrant multiple stores
- Single store keeps state management simple and predictable
- Can be split later if needed without major refactoring

---

## 3. UX Decisions You Made and Alternatives Considered

### Optimistic Updates

**Decision**: Update UI immediately when user drags a card, before API confirmation.

**Why?**
- **Perceived Performance**: UI feels instant and responsive
- **Better UX**: Users don't wait for network latency
- **Native App Feel**: Makes the web app feel more like a native application

**Alternative Considered: Wait for API Response**
- Rejected because it creates a noticeable delay, especially on slower connections
- Users would see cards "stuck" during drag, creating a poor experience

**Implementation:**
1. Save previous state before update
2. Update local state immediately
3. Make API call in background
4. On success: State already updated
5. On failure: Rollback to previous state and show error

**Trade-off**: If API fails, user sees a brief incorrect state before rollback. Mitigated by fast rollback and clear error messaging.

### URL State Management for Filters

**Decision**: Store all filter values in URL query parameters.

**Why?**
- **Shareable**: Users can bookmark and share filtered views
- **Browser Navigation**: Back/forward buttons work as expected
- **Refresh Persistence**: Filters persist when page is refreshed
- **No Additional State**: No need for separate state management for filters

**Alternative Considered: Local State Only**
- Rejected because filters would be lost on refresh
- Users couldn't share filtered views
- Browser navigation wouldn't work properly

**Alternative Considered: Session Storage**
- Rejected because it's not shareable and adds complexity
- URL approach is simpler and more standard

**Implementation:**
- `useSearchParams` reads current filter values from URL
- `router.replace` updates URL without navigation
- Debouncing prevents URL spam while typing
- Page component watches URL changes and refetches data

### Debouncing Filter Inputs

**Decision**: Debounce text inputs (client name, min value) by 1 second, but not date inputs.

**Why?**
- **Performance**: Prevents excessive API calls while user is typing
- **Server Load**: Reduces unnecessary server requests
- **User Experience**: Still feels responsive with 1-second delay

**Why Not Debounce Dates?**
- Date inputs are discrete selections, not continuous typing
- Users typically select dates once, not continuously
- Immediate feedback for date changes feels more natural

**Alternative Considered: No Debouncing**
- Rejected because it would cause API calls on every keystroke
- Could overwhelm the server with many rapid requests

**Alternative Considered: Longer Debounce (2-3 seconds)**
- Rejected because 1 second feels more responsive
- Balance between performance and UX

### Server-Side Filtering

**Decision**: Apply filters on the server (in API route) rather than client-side.

**Why?**
- **Performance**: Only filtered data sent to client, reducing payload size
- **Scalability**: Can handle large datasets efficiently
- **Consistency**: Single source of truth for filter logic
- **Future-Proof**: Can add pagination, sorting, and complex queries later

**Alternative Considered: Client-Side Filtering**
- Rejected because it requires fetching all data first
- Doesn't scale well with large datasets
- More data transfer and client-side processing

**Trade-off**: Requires server round-trip for each filter change, but mitigated by debouncing and the benefits outweigh the cost.

### Merge Strategy for Local Updates

**Decision**: When fetching filtered results, merge API data with local state using timestamp comparison.

**Problem**: User drags a card to new phase → API call in progress → User changes filter → Fresh API data might overwrite the local phase update that hasn't been persisted yet.

**Solution**: Compare `updatedAt` timestamps. If local version is newer, keep it. Otherwise use API version.

**Why This Approach?**
- Preserves user's latest changes even during filtering
- Handles race conditions gracefully
- No complex conflict resolution needed
- Simple timestamp comparison is reliable

**Alternative Considered: Disable Filtering During Updates**
- Rejected because it creates a poor UX - users should be able to filter anytime

**Alternative Considered: Queue Updates**
- Rejected because it adds complexity and the timestamp approach is simpler and effective

### Modal for Details

**Decision**: Show inquiry details in a modal dialog, opened by double-clicking cards.

**Why?**
- **Context Preservation**: User stays on the board view
- **Quick Access**: Easy to open and close
- **Focus**: Modal focuses attention on the details

**Alternative Considered: Separate Detail Page**
- Rejected because it requires navigation away from board
- Loses context of where the inquiry is in the board
- More complex routing needed

**Alternative Considered: Side Panel**
- Considered but rejected because modal is simpler to implement
- Side panel would require layout changes and responsive considerations
- Modal works well on all screen sizes

### Visual Feedback During Drag

**Decision**: Show opacity and scale changes on dragged cards, plus ring effect on drop targets.

**Why?**
- **Clear Feedback**: Users understand what's happening
- **Visual Clarity**: Distinguishes dragged item from others
- **Drop Target Indication**: Ring effect shows where item can be dropped

**Alternative Considered: Minimal Visual Feedback**
- Rejected because it creates confusion about drag state
- Users might not realize drag is active

---

## 4. What You Would Improve With More Time

### Database Integration

**Current State**: Mock data in memory, lost on server restart.

**Improvements:**
- Replace mock data with a proper database (PostgreSQL or MongoDB)
- Add connection pooling for performance
- Implement proper data persistence
- Add database migrations for schema management
- Consider caching layer (Redis) for frequently accessed data

**Why Important**: Production-ready applications need persistent data storage.

### Real-Time Updates

**Current State**: Updates only happen when user interacts or filters change.

**Improvements:**
- WebSocket integration for real-time updates from other users
- Server-sent events as alternative for one-way updates
- Conflict resolution when multiple users update same inquiry
- Presence indicators showing who's viewing/editing what
- Optimistic updates would remain, but with real-time sync

**Why Important**: In a multi-user environment, users need to see changes made by others immediately.

### Testing

**Current State**: No automated tests.

**Improvements:**
- **Unit Tests**: Test store actions, utility functions, and component logic
- **Integration Tests**: Test API routes and data flow
- **E2E Tests**: Test complete user flows (drag-drop, filtering, modal interactions)
- **Visual Regression Tests**: Ensure UI consistency across changes
- **Performance Tests**: Ensure application handles large datasets

**Why Important**: Tests provide confidence when refactoring and adding features.

### Performance Optimizations

**Current State**: Works well with current dataset size.

**Improvements:**
- **Virtual Scrolling**: For columns with many inquiries
- **Pagination**: For large datasets instead of loading all at once
- **Lazy Loading**: Load components and data on demand
- **Memoization**: Use React.memo and useMemo more strategically
- **Code Splitting**: Split routes and heavy components
- **Image Optimization**: If images are added in the future

**Why Important**: Ensures application remains performant as data grows.

### Enhanced Filtering and Search

**Current State**: Basic filters (client name, min value, date range).

**Improvements:**
- **Full-Text Search**: Search across all inquiry fields
- **Advanced Filters**: Filter by event type, guest count, hotels, etc.
- **Saved Filter Presets**: Save and quickly apply common filter combinations
- **Filter Suggestions**: Auto-complete for client names
- **Date Presets**: Quick select for "This Month", "Next Quarter", etc.

**Why Important**: Users need more powerful ways to find and organize inquiries as the dataset grows.

### User Authentication and Authorization

**Current State**: No authentication.

**Improvements:**
- User login and session management
- Role-based access control (admin, manager, viewer)
- Audit logging for phase changes and updates
- Permission checks for different actions
- User preferences (default filters, column widths, etc.)

**Why Important**: Production applications need security and user management.

### Better Error Handling and User Feedback

**Current State**: Basic error handling with rollback.

**Improvements:**
- Toast notifications for success/error states
- Retry mechanisms for failed API calls
- Offline support with service workers
- Better error messages with actionable guidance
- Loading states for individual operations
- Progress indicators for long-running operations

**Why Important**: Better error handling improves user experience and helps users understand what's happening.

### Accessibility Improvements

**Current State**: Basic accessibility with @dnd-kit features.

**Improvements:**
- Full keyboard navigation for all interactions
- Screen reader announcements for drag-drop operations
- Focus management in modals
- ARIA labels and roles throughout
- High contrast mode support
- Reduced motion support for animations

**Why Important**: Makes the application usable for all users, including those with disabilities.

### Export and Reporting

**Current State**: No export functionality.

**Improvements:**
- Export filtered inquiries to CSV/Excel
- PDF reports with charts and summaries
- Email reports on schedule
- Dashboard with analytics and metrics
- Phase transition analytics

**Why Important**: Users often need to share data or analyze trends outside the application.

### Mobile Experience

**Current State**: Responsive but could be better optimized.

**Improvements:**
- Touch-optimized drag and drop (long-press to drag)
- Swipe gestures for quick actions
- Mobile-specific layouts
- Better touch targets and spacing
- Pull-to-refresh functionality

**Why Important**: Many users will access the application on mobile devices.

### Bulk Operations

**Current State**: Only single inquiry operations.

**Improvements:**
- Select multiple inquiries
- Bulk phase updates
- Bulk delete
- Bulk export
- Bulk assignment to users

**Why Important**: Saves time when managing many inquiries at once.
