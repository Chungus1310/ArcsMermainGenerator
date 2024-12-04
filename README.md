# Arcs Mermaid Generator

An Electron application for generating Mermaid diagrams.

## Features
- Generate Mermaid diagrams using AI
- Export diagrams
- Cross-platform support (Windows, macOS, Linux)

## Development
```bash
# Install dependencies
npm install

# Run in development mode
npm run electron-dev

# Build for production
npm run package-win    # For Windows
npm run package-mac    # For macOS
npm run package-linux  # For Linux
```

## Technologies Used

- React
- Next.js
- Electron
- Tailwind CSS
- Mermaid.js
- Google Gemini API
- shadcn/ui components

## Environment Setup

Create a `.env` file and add your Gemini API key:
```
GEMINI_API_KEY=your_api_key_here
```

## License

MIT License
