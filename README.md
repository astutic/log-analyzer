# Log Analyzer

A modern, interactive web application for analyzing and visualizing log data. This tool allows users to paste log data and get an organized, sortable, and filterable table view of the logs.

![Log Analyzer Screenshot](screenshot.png)

## Features

### Core Functionality
- Parse and analyze structured log data
- Interactive table visualization
- No backend required - runs entirely in the browser
- Data privacy - all processing happens client-side

### Interactive Table
- Drag-and-drop column reordering
- Click-to-sort on any column
- Full-text search across all fields
- Responsive design for all screen sizes

### Log Parsing
Automatically extracts and organizes the following fields:
- Timestamp
- Log Level
- Message
- User
- Request ID
- Method (GET, POST, etc.)
- Path
- Status Code
- Duration
- API Name
- Size
- Parameters

## Getting Started

### Prerequisites
- Node.js 18 or higher
- npm (comes with Node.js)

### Installation

1. Clone the repository
```bash
git clone https://github.com/astutic/log-analyzer.git
cd log-analyzer
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:3100`

### Building for Production

To create a production build:
```bash
npm run build
```

## Usage

1. **Paste Logs**
   - Open the application in your browser
   - Paste your log data into the textarea
   - Click "Parse Logs" button

2. **Analyze Data**
   - Use the search box to filter logs
   - Click column headers to sort
   - Drag column headers to reorder them
   - View parsed data in an organized table format

3. **Example Log Format**
```
time="2024-12-30T18:20:16+05:30" level=debug msg="UserOrgMiddleware OrgDetails" request_id=1e8a13281158ee8f user=example@email.com
```

## Development

### Project Structure
```
log-analyzer/
├── app/
│   ├── components/
│   │   └── LogAnalyzer.tsx
│   └── page.tsx
├── public/
├── .github/
│   └── workflows/
│       └── deploy.yml
└── next.config.js
```

### Technologies Used
- Next.js 14
- React
- Tailwind CSS
- shadcn/ui components
- @dnd-kit for drag and drop
- Lodash for data manipulation

## Deployment

The project is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Automatic Deployment
- Push to the main branch triggers automatic deployment
- GitHub Actions builds and deploys to GitHub Pages
- Live site available at: `https://astutic.github.io/log-analyzer`

### Manual Deployment
1. Build the project:
```bash
npm run build
```

2. The static files will be in the `out` directory

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions:
1. Check existing GitHub Issues
2. Create a new issue if needed
3. Provide log data example when reporting parsing issues