# Arcs Mermaid Generator

<div align="center">

![Arcs Mermaid Generator Logo](icon.ico)

Generate beautiful Mermaid diagrams with the power of AI. A cross-platform desktop application built with Electron.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub issues](https://img.shields.io/github/issues/Chungus1310/ArcsMermainGenerator)](https://github.com/Chungus1310/ArcsMermainGenerator/issues)
[![GitHub stars](https://img.shields.io/github/stars/Chungus1310/ArcsMermainGenerator)](https://github.com/Chungus1310/ArcsMermainGenerator/stargazers)

[Features](#features) • [Installation](#installation) • [Usage](#usage) • [Development](#development) • [Contributing](#contributing)

</div>

https://github.com/user-attachments/assets/8e24214b-904f-44bd-a35d-dd318cf01ac3

## Features

🎨 **AI-Powered Diagram Generation**
- Generate Mermaid diagrams using Google's Gemini AI
- Natural language to diagram conversion
- Smart diagram optimization suggestions

📊 **Rich Diagram Types Support**
- Flowcharts
- Sequence diagrams
- Class diagrams
- Entity Relationship diagrams
- State diagrams
- Gantt charts
- And more!

💾 **Export Options**
- PNG format
- SVG format
- Mermaid markdown
- Copy to clipboard functionality

🎯 **Developer Experience**
- Modern React + Next.js architecture
- Beautiful UI with Tailwind CSS and shadcn/ui
- Cross-platform support (Windows, macOS, Linux)
- Real-time preview

## Installation

### Download Pre-built Binaries

Download the latest version for your platform from our [releases page](https://github.com/Chungus1310/ArcsMermainGenerator/releases).

### Build from Source

```bash
# Clone the repository
git clone https://github.com/Chungus1310/ArcsMermainGenerator.git
cd ArcsMermainGenerator

# Install dependencies
npm install

# Run in development mode
npm run electron-dev
```

## Usage

1. Launch the application
2. Enter your diagram description or requirements in natural language
3. Click "Generate" to create your diagram using AI
4. Fine-tune the generated diagram if needed
5. Export in your preferred format

## Development

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- Google Gemini API key

### Environment Setup

1. Get your api key at `https://aistudio.google.com/app/apikey`
2. Add your Gemini API key to the gui.


### Available Scripts

```bash
# Start development server
npm run electron-dev

# Build for production
npm run package-win    # For Windows
npm run package-mac    # For macOS
npm run package-linux  # For Linux

# Run tests
npm test

# Lint code
npm run lint
```

### Project Structure

```
ArcsMermainGenerator/
├── src/
│   ├── components/    # React components
│   ├── pages/         # Next.js pages
│   ├── styles/        # Global styles
│   └── utils/         # Utility functions
├── electron/          # Electron main process
├── public/           # Static assets
└── tests/            # Test files
```

## Technologies Used

- **Frontend**: React, Next.js, Tailwind CSS, shadcn/ui components
- **Backend**: Electron
- **Diagram Generation**: Mermaid.js
- **AI Integration**: Google Gemini API
- **Build Tools**: Electron Builder

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Submit a pull request

Please read our [Contributing Guidelines](CONTRIBUTING.md) for more details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📫 Report bugs through [GitHub issues](https://github.com/Chungus1310/ArcsMermainGenerator/issues)
- 💬 Join our [Discord community](https://discord.gg/arcsmermaid)
- 📖 Check out the [Wiki](https://github.com/Chungus1310/ArcsMermainGenerator/wiki) for more documentation

---

<div align="center">
Made with ❤️ by Chun
</div>
