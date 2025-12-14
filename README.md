# Charmss Influencers - Frontend

This is the repository for the frontend of the Charmss application for influencers. The application is built with React, Vite, TypeScript, and Tailwind CSS.

## Overview

The Charmss platform allows influencers to interact with their audience, manage content, and monetize their online presence. This project contains the user interface that influencers will interact with.

## Tech Stack

*   **Framework:** [React.js](https://reactjs.org/)
*   **Bundler:** [Vite](https://vitejs.dev/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Routing:** [React Router](https://reactrouter.com/)
*   **Icons:** [Lucide React](https://lucide.dev/)

## Getting Started

Follow these instructions to get a copy of the project running on your local machine for development and testing purposes.

### Prerequisites

You need to have Node.js and npm (or yarn/pnpm) installed on your machine.

*   [Node.js](https://nodejs.org/) (v18 or higher recommended)

### Installation

1.  Clone the repository:
    ```sh
    git clone https://github.com/your-username/charmss-incluencers.git
    ```
2.  Navigate to the project directory:
    ```sh
    cd charmss-incluencers
    ```
3.  Install the dependencies:
    ```sh
    npm install
    ```

## Available Scripts

In the project directory, you can run:

*   `npm run dev`: Starts the application in development mode. Open [http://localhost:5173](http://localhost:5173) to view it in your browser.
*   `npm run build`: Compiles the application for production in the `dist` folder.
*   `npm run lint`: Runs the ESLint linter to identify and fix problems in the code.
*   `npm run preview`: Serves the production build locally for preview.

## Troubleshooting

If you see an error like "It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin", install the dedicated PostCSS plugin and update PostCSS config:

```sh
npm install -D @tailwindcss/postcss
# in postcss.config.js replace `tailwindcss: {}` with `'@tailwindcss/postcss': {}`
```

Also, if you use `@apply` in your CSS for utilities that aren't present in your scanned content files, add them to the `safelist` in `tailwind.config.js` or prefer using CSS variables for base theming.

## Folder Structure

```
/
├── public/ # Static files and icons
├── src/
│   ├── assets/ # Images, fonts, etc.
│   ├── components/ # Reusable React components
│   ├── pages/ # Components that represent the application's pages
│   ├── App.tsx # Main component and route configuration
│   ├── main.tsx # Application entry point
│   └── index.css # Global styles
├── package.json # Dependencies and scripts
└── vite.config.ts # Vite configuration
```

## Contributing

Contributions are welcome! Please open an issue or a pull request to discuss the changes you would like to make.
