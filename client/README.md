# WebRTC Playground - Client

A modern React application built with TypeScript, featuring React Router for navigation and a clean, responsive design.

## 🚀 Features

- **React 19** with TypeScript for type safety
- **Material-UI (MUI)** for modern, accessible components
- **React Router DOM** for client-side routing
- **Dark Mode Support** with system preference detection and persistence
- **Responsive Design** with MUI's responsive grid system
- **Clean Architecture** with organized components and utilities
- **Form Handling** with MUI form components and validation
- **404 Error Handling** with custom not found page
- **Theme Toggle** with smooth transitions and animations
- **Mobile-First Design** with collapsible navigation

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main layout wrapper with MUI Box
│   ├── Header.tsx      # MUI AppBar with responsive navigation
│   ├── Footer.tsx      # MUI Footer component
│   └── ThemeToggle.tsx # MUI IconButton theme toggle
├── contexts/           # React contexts
│   └── ThemeContext.tsx # Theme management context
├── theme/              # MUI theme configuration
│   ├── muiTheme.ts     # MUI theme creation with dark mode
│   └── ThemeProvider.tsx # MUI theme provider wrapper
├── pages/              # Page components
│   ├── Home.tsx        # Landing page
│   ├── About.tsx       # About page
│   ├── Contact.tsx     # Contact form page
│   └── NotFound.tsx    # 404 error page
├── utils/              # Utility functions
│   ├── constants.ts    # App constants
│   └── helpers.ts      # Helper functions
├── types/              # TypeScript type definitions
│   └── index.ts        # Type definitions
├── App.tsx             # Main app component with routing
├── main.tsx            # Application entry point
└── index.css           # Global styles with dark mode support
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Styling & Theming

The project uses Material-UI with:
- **MUI Theme System** with custom light and dark themes
- **CSS-in-JS** with MUI's sx prop for styling
- **Dark Mode** with automatic system preference detection
- **Theme Persistence** using localStorage
- **Smooth Transitions** for theme switching
- **Responsive Design** with MUI's breakpoint system
- **Accessibility** with MUI's built-in accessibility features
- **Component Variants** with consistent design system

## 🚦 Routing

The application includes the following routes:
- `/` - Home page with hero section and features
- `/about` - About page with project information
- `/contact` - Contact form with validation
- `*` - 404 Not Found page

## 🔧 Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173) in your browser

## 📦 Dependencies

- **react** - React library
- **react-dom** - React DOM rendering
- **react-router-dom** - Client-side routing
- **@mui/material** - Material-UI component library
- **@mui/icons-material** - Material-UI icons
- **@emotion/react** - CSS-in-JS library
- **@emotion/styled** - Styled components
- **typescript** - TypeScript support

## 🌙 Dark Mode Features

- **Automatic Detection**: Respects system preference on first visit
- **Manual Toggle**: Theme toggle button in header with smooth animations
- **Persistence**: Remembers user preference across sessions
- **Smooth Transitions**: All elements transition smoothly between themes
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Mobile Support**: Theme color meta tag for mobile browsers

## 🎯 Next Steps

This project is ready for WebRTC implementation. Consider adding:
- WebRTC peer connection management
- Video/audio streaming components
- Data channel communication
- Real-time messaging features
- Connection status indicators
- Theme-aware WebRTC UI components