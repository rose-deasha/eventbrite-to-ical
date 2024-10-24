# Eventbrite to iCal Converter - Frontend

A web application that allows users to export their Eventbrite tickets to iCal format for easy calendar integration.

## 📋 Table of Contents
- [Features](#-features)
- [Demo](#-demo)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Usage](#-usage)
- [Configuration](#-configuration)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features
- OAuth2 authentication with Eventbrite
- Export tickets to iCal format
- Seamless calendar integration
- Clean and intuitive user interface

## 🚀 Demo
The application is live at: https://rose-deasha.github.io/eventbrite-to-ical/

## 📦 Prerequisites
- Node.js (>=14.x)
- An Eventbrite account
- Access to Eventbrite's API (Client ID)

## 💻 Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/eventbrite-to-ical.git
cd eventbrite-to-ical
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
EVENTBRITE_CLIENT_ID=your_client_id_here
BACKEND_URL=your_backend_url_here
```

4. Start the development server:
```bash
npm start
```

## 🔧 Usage

1. Visit the application URL
2. Click "Authorize with Eventbrite"
3. Log in to your Eventbrite account if needed
4. Authorize the application
5. Click "Download iCal File" to export your tickets

## ⚙️ Configuration

### Environment Variables
- `EVENTBRITE_CLIENT_ID`: Your Eventbrite application's client ID
- `BACKEND_URL`: URL of the backend API service

### Eventbrite Application Setup
1. Go to https://www.eventbrite.com/platform/api-keys
2. Create a new API key/application
3. Set the OAuth redirect URI to your backend callback URL
4. Enable required OAuth scopes:
   - `orders_read`
   - `user:read`

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
