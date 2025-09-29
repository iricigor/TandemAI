# Tandem AI Analyzer

A comprehensive web application for analyzing Tandem insulin pump data using AI-powered insights.

## Features

- **Data Upload**: Drag-and-drop file upload with ZIP support
- **AI Analysis**: Mock Perplexity AI integration for data insights
- **Responsive Design**: Works on desktop and mobile devices
- **Secure Storage**: Local data storage with configurable persistence
- **Professional UI**: Medical-grade interface design

## Deployment to Azure Web App

### Prerequisites

- Azure account with an active subscription
- Azure Web App created (Static Web Apps or App Service)

### Deployment Steps

1. **Create the file structure**:
   ```
   tandem-ai-analyzer/
   ├── index.html
   ├── style.css
   ├── app.js
   └── README.md
   ```

2. **Copy the source code files** (provided in this document) into their respective files.

3. **Deploy using Azure CLI**:
   ```bash
   # Login to Azure
   az login
   
   # Deploy to Static Web App
   az staticwebapp create \
     --name tandem-ai \
     --resource-group TandemAI \
     --source https://github.com/iricigor/TandemAI \
     --location "Central US" \
     --branch main \
     --app-location "/" \
     --api-location "" \
     --output-location ""
   ```

4. **Alternative: Manual deployment**:
   - Zip all files
   - Upload via Azure portal
   - Or use FTP/Git deployment

### Configuration

1. **API Integration**: Configure Perplexity AI API in the Settings page
2. **Storage**: Choose between session or persistent storage
3. **Customization**: Modify colors and branding in CSS variables

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Storage**: Local Storage / Session Storage / IndexedDB
- **Responsive**: CSS Grid and Flexbox
- **Icons**: Unicode emojis for cross-platform compatibility

## File Structure

- `index.html` - Main application markup
- `style.css` - Comprehensive styling with CSS custom properties
- `app.js` - Application logic and state management
- `README.md` - Documentation and deployment instructions

## Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT License - feel free to modify for your needs.
