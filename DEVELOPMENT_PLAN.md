# Nitra AI Chatroom - Development Plan

## Project Overview

Build an AI chatroom interface for smart procurement that helps customers find and compare medical supply products.

## Technical Stack

- **Framework**: Vue 3.5.17 (Composition API)
- **UI Framework**: Quasar Framework v2.18.1
- **Icons**: FontAwesome (solid/regular)
- **Node.js**: 22.17.0
- **TypeScript**: Preferred

## Time Allocation (8 Hours Total)

- **Phase 1**: Setup & Structure
- **Phase 2**: Core Features
- **Phase 3**: UI/UX Polish
- **Phase 4**: Testing & Documentation

---

## Phase 1: Setup & Structure

### 1.1 Project Initialization

**Goal**: Establish project foundation

#### Tasks:

- [x] **1.1.1** Verify Vue 3 + Quasar project setup

  - Check `package.json` dependencies
  - Validate Quasar configuration

- [x] **1.1.2** Setup TypeScript configuration

  - Configure `tsconfig.json`
  - Set up type checking rules

- [x] **1.1.3** Create project directory structure
  ```
  src/
  ├── components/
  │   ├── chat/
  │   └── ui/
  ├── composables/
  ├── stores/
  └── types/
  ```

### 1.2 Routing & Layout Setup

**Goal**: Establish application routing and basic layout

#### Tasks:

- [x] **1.2.1** Setup Vue Router

  - Configure routing structure
  - Set up default routes

- [x] **1.2.2** Create main layout component

  - Create `MainLayout.vue`
  - Implement responsive design

- [x] **1.2.3** Setup chat page routing
  - Create chat room page
  - Set up default route

### 1.3 Design System Setup

**Goal**: Establish design system foundation

#### Tasks:

- [x] **1.3.1** Setup SCSS variables

  - Define color palette (Gray, Teal, Status colors)
  - Set up font size system

- [x] **1.3.2** Configure Quasar theme
  - Configure primary colors
  - Setup dark mode support

---

## Phase 2: Core Features

### 2.1 Data Processing & State Management

**Goal**: Implement mock data parsing and state management

#### Tasks:

- [x] **2.1.1** Create TypeScript interfaces

  - Define `ChatResponse` interface
  - Define `MockData` type
  - Define `Message` interface

- [x] **2.1.2** Setup Pinia Store

  - Create `useChatStore`
  - Implement message state management
  - Implement message history

- [x] **2.1.3** Implement mock data parser
  - Create `parseMockData` function
  - Implement question matching logic
  - Add error handling

### 2.2 Chat Interface Components

**Goal**: Build core chat interface components

#### Tasks:

- [x] **2.2.1** Create message bubble component

  - Create `MessageBubble.vue`
  - Implement user vs assistant styling
  - Add timestamp display

- [x] **2.2.2** Create product card component

  - Create `ProductCard.vue`
  - Implement product information display
  - Add clickable product links

- [x] **2.2.3** Create chat input component

  - Create `ChatInput.vue`
  - Implement input validation
  - Add send button functionality

- [x] **2.2.4** Create chat container component
  - Create `ChatContainer.vue`
  - Implement message list display
  - Add auto-scroll functionality

### 2.3 Typing Animation Effect

**Goal**: Implement gradual text reveal animation

#### Tasks:

- [x] **2.3.1** Create typing animation composable

  - Create `useTypingAnimation.ts`
  - Implement character-by-character display logic
  - Set configurable animation speed

- [x] **2.3.2** Implement markdown support

  - Add markdown parsing functionality
  - Handle formatted text
  - Support links and bold text

- [x] **2.3.3** Integrate animation into message components
  - Integrate typing animation into `MessageBubble`
  - Implement animation state management
  - Add animation completion callbacks

### 2.4 Suggested Questions Feature

**Goal**: Implement suggested follow-up questions

#### Tasks:

- [x] **2.4.1** Create suggested questions component

  - Create `SuggestedQuestions.vue`
  - Implement question button display
  - Add click handling logic

- [x] **2.4.2** Implement question parsing logic
  - Extract suggested questions from responses
  - Implement question formatting
  - Add question validation

---

## Phase 3: UI/UX Polish

### 3.1 Responsive Design

**Goal**: Ensure good experience across different devices

#### Tasks:

- [x] **3.1.1** Implement mobile optimization

  - Adjust chat interface layout
  - Optimize touch experience
  - Implement gesture support

- [x] **3.1.2** Implement tablet adaptation

  - Adjust medium screen size layout
  - Optimize product card display
  - Implement sidebar functionality

- [x] **3.1.3** Implement desktop optimization
  - Implement large screen layout
  - Add keyboard shortcut support
  - Optimize multi-window experience

### 3.2 Animation & Interaction Optimization

**Goal**: Enhance user experience smoothness

#### Tasks:

- [ ] **3.2.1** Implement loading animations

  - Create loading indicators
  - Implement skeleton screen effects
  - Add loading state management

- [ ] **3.2.2** Implement transition animations

  - Add page transition effects
  - Implement component enter/leave animations
  - Optimize animation performance

- [ ] **3.2.3** Implement micro-interactions
  - Add button hover effects
  - Implement card shadow animations
  - Add click feedback

### 3.3 Accessibility Optimization

**Goal**: Ensure application accessibility

#### Tasks:

- [ ] **3.3.1** Implement keyboard navigation

  - Add Tab key navigation support
  - Implement focus management
  - Add keyboard shortcuts

- [ ] **3.3.2** Implement screen reader support
  - Add ARIA labels
  - Implement semantic HTML
  - Add alt text

---

## Phase 4: Testing & Documentation

### 4.1 Basic Testing

**Goal**: Ensure code quality and stability

#### Tasks:

- [ ] **4.1.1** Setup basic testing environment

  - Configure Vitest
  - Setup Vue Testing Library
  - Create test utility functions

- [ ] **4.1.2** Implement core component tests
  - Test `MessageBubble` component
  - Test `ProductCard` component
  - Test `ChatInput` component

### 4.2 Documentation

**Goal**: Create essential project documentation

#### Tasks:

- [ ] **4.2.1** Write component documentation

  - Document component props
  - Add usage examples
  - Document composables

- [ ] **4.2.2** Write setup guide
  - Create development environment setup guide
  - Add contribution guidelines
  - Document best practices

---

### Priority Order

1. **Functionality First**: Implement core features before styling
2. **Typing Animation**: This is the project's core feature, needs special attention
3. **Responsive Design**: Ensure good experience across devices
4. **Accessibility**: Ensure application accessibility

### Key Features from Spec

- **Mock Data Parsing**: Parse provided JSON mock data and display chat responses
- **Typing Animation**: Implement gradual text reveal animation simulating AI response
- **Chat Interface**: Basic question-answer flow with message history
- **Product Cards**: Display product information with links and images
- **Suggested Questions**: Show follow-up question suggestions

---

## Milestone Checkpoints

### Milestone 1: Foundation Complete

- [x] Project setup complete
- [x] Routing and layout established
- [x] Design system setup complete

### Milestone 2: Core Features Complete

- [x] Mock data parsing complete
- [x] Chat interface built
- [x] Typing animation implemented

### Milestone 3: UI/UX Polish Complete

- [ ] Responsive design complete
- [ ] Animation effects optimized
- [ ] Accessibility implemented

### Milestone 4: Project Complete

- [ ] Basic testing complete
- [ ] Documentation written
- [ ] Project ready for delivery
