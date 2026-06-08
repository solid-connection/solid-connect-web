# Component Design System

## Overview

This document defines the component standardization patterns for Solid Connection. All components should follow these guidelines to maintain UI consistency and AI-friendly development.

## Component Categories

### 1. UI Components (`/components/ui/`)

Generic, reusable UI components that are domain-agnostic.

**Examples:**
- Button
- Input
- Modal
- Toast
- Dropdown
- Checkbox
- Progress
- Tab

**Guidelines:**
- Must accept `className` prop for custom styling
- Use `clsx` for conditional class names
- Follow Tailwind CSS utility-first approach
- Should be composable and reusable

### 2. Layout Components (`/components/layout/`)

Components that handle page structure and navigation.

**Examples:**
- GlobalLayout
- TopLogoBar
- BottomNavigation
- PathBasedNavigation

**Guidelines:**
- Handle routing and navigation logic
- Manage authentication state
- Provide consistent layout structure

### 3. Feature Components

Domain-specific components organized by feature area.

**Examples:**
- `/components/mentor/*`
- `/components/search/*`
- `/components/score/*`
- `/components/community/*`

**Guidelines:**
- Keep components focused on single responsibility
- Use hooks for business logic
- Separate presentation from logic

## Common Patterns

### Button Pattern

```tsx
import clsx from "clsx";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  onClick,
  className,
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "rounded-lg font-medium transition-all",
        {
          "bg-primary text-white hover:bg-primary-dark": variant === "primary",
          "bg-secondary text-white hover:bg-secondary-dark": variant === "secondary",
          "border border-k-200 bg-white hover:bg-k-50": variant === "outline",
          "px-3 py-1.5 text-sm": size === "sm",
          "px-4 py-2 text-base": size === "md",
          "px-6 py-3 text-lg": size === "lg",
          "cursor-not-allowed opacity-50": disabled,
        },
        className
      )}
    >
      {children}
    </button>
  );
};
```

### Input Pattern

```tsx
import clsx from "clsx";
import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        {label && <label className="text-k-900 typo-sb-9">{label}</label>}
        <input
          ref={ref}
          className={clsx(
            "h-12 rounded-lg border border-k-200 bg-k-50 px-4 typo-regular-2",
            "focus:border-primary focus:outline-none",
            error && "border-red-500",
            className
          )}
          {...props}
        />
        {error && <p className="text-red-500 typo-regular-4">{error}</p>}
        {helperText && !error && <p className="text-k-400 typo-regular-4">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
```

### Modal Pattern

```tsx
"use client";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export const Modal = ({ isOpen, onClose, children, title }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-lg bg-white p-6">
        {title && <h2 className="mb-4 text-xl font-bold">{title}</h2>}
        {children}
      </div>
    </div>
  );
};
```

## Styling Guidelines

### Typography Classes

Use predefined typography classes from Tailwind config:

- `typo-bold-1` - Bold, large text
- `typo-sb-3` - Semi-bold, medium text
- `typo-regular-4` - Regular, small text
- `typo-medium-5` - Medium, extra small text

### Color Palette

- Primary: `text-primary`, `bg-primary`
- Secondary: `text-secondary`, `bg-secondary`
- K-series (grayscale): `text-k-900` to `text-k-50`, `bg-k-900` to `bg-k-50`
- Accent: `text-accent-custom-indigo`, `bg-accent-custom-yellow`

### Spacing

Follow Tailwind's spacing scale:
- `gap-2`, `gap-3`, `gap-5` for consistent spacing
- `px-5`, `py-3` for padding
- `mt-5`, `mb-10` for margins

## Component Props Best Practices

### 1. Always Accept `className`

Allow consumers to customize styling:

```tsx
interface Props {
  className?: string;
}

export const Component = ({ className }: Props) => (
  <div className={clsx("base-styles", className)}>Content</div>
);
```

### 2. Use Discriminated Unions for Variants

```tsx
type ButtonProps =
  | { variant: "primary"; onClick: () => void }
  | { variant: "link"; href: string };
```

### 3. Forward Refs for Form Elements

```tsx
export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return <input ref={ref} {...props} />;
});
```

## Accessibility Guidelines

### 1. Semantic HTML

Use appropriate HTML elements:
- `<button>` for clickable actions
- `<a>` for navigation
- `<input>` for form fields

### 2. ARIA Labels

Add labels for screen readers:

```tsx
<button aria-label="Close modal" onClick={onClose}>
  <CloseIcon />
</button>
```

### 3. Keyboard Navigation

Support keyboard interactions:
- Tab navigation
- Enter/Space for buttons
- Escape to close modals

## File Organization

```
components/
├── ui/                    # Generic UI components
│   ├── Button/
│   │   ├── index.tsx
│   │   └── Button.test.tsx
│   ├── Input/
│   └── Modal/
├── layout/               # Layout components
│   ├── GlobalLayout/
│   └── BottomNavigation/
└── [feature]/           # Feature-specific components
    └── [ComponentName]/
        ├── index.tsx
        └── hooks/
            └── useComponentLogic.ts
```

## Testing Guidelines

### Unit Tests

Test component behavior:

```tsx
import { render, screen } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", () => {
  it("renders children correctly", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Click me</Button>);
    screen.getByText("Click me").click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
```

## Migration Checklist

When refactoring existing components:

- [ ] Extract inline styles to Tailwind classes
- [ ] Add `className` prop for customization
- [ ] Use `clsx` for conditional classes
- [ ] Separate logic into custom hooks
- [ ] Add TypeScript types
- [ ] Add proper error handling
- [ ] Test component behavior
- [ ] Update documentation

## AI-Friendly Development

### Component Context File (llm.txt)

See `/llm.txt` for component usage examples and patterns that AI assistants should follow when generating or modifying components.

### Naming Conventions

- PascalCase for components: `Button`, `UserProfile`
- camelCase for props: `onClick`, `isLoading`
- kebab-case for CSS classes: `bg-primary`, `text-k-900`

### Import Order

```tsx
// 1. React imports
import { useState, useEffect } from "react";

// 2. Third-party imports
import clsx from "clsx";

// 3. Internal imports (absolute)
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/hooks/useAuth";

// 4. Relative imports
import { ComponentChild } from "./ComponentChild";

// 5. Type imports
import type { User } from "@/types/user";
```

## Examples

### Before Refactoring

```tsx
const MyButton = ({ text, handleClick }) => (
  <div
    onClick={handleClick}
    style={{
      backgroundColor: "blue",
      color: "white",
      padding: "10px",
    }}
  >
    {text}
  </div>
);
```

### After Refactoring

```tsx
interface MyButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "primary" | "secondary";
  className?: string;
}

export const MyButton = ({
  children,
  onClick,
  variant = "primary",
  className,
}: MyButtonProps) => (
  <button
    onClick={onClick}
    className={clsx(
      "rounded-lg px-4 py-2 font-medium transition-all",
      {
        "bg-primary text-white hover:bg-primary-dark": variant === "primary",
        "bg-secondary text-white hover:bg-secondary-dark": variant === "secondary",
      },
      className
    )}
  >
    {children}
  </button>
);
```

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Figma Design System](link-to-figma)
