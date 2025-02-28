# Rummy 500 Scorekeeper

This is a monorepo with a single top level folder.

The README.md file provides a high-level overview of the project and its components.

It is a SPA written in TypeScript using React.

## Package Management

Use npm for package management

## Conventions

- Use TypeScript for all new code
- Follow modern ES modules pattern (type: "module")

### File Structure & Naming

- Feature-based folder structure with self-contained features
- PascalCase for React components (.tsx)
- kebab-case for utilities and other files (.ts)
- Components should be organized with imports first, then Props interface, then component implementation

### UI & Styling

- Use TailwindCSS
- Use Heroicons for iconography

### State & Forms

- Use React hooks for local state

### Testing

- Use Vitest
