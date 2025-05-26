# Contributing to DabaFing

Thank you for your interest in contributing to DabaFing! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 18.0+ and npm
- Python 3.9+
- Git

### Development Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/daba-fing-project.git
   cd daba-fing-project
   ```

2. **Set up the backend**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   cp env.example .env
   python manage.py migrate
   python manage.py runserver
   ```

3. **Set up the frontend**
   ```bash
   cd frontend-web
   npm install
   cp env.example .env.local
   npm run dev
   ```

4. **Set up the mobile app**
   ```bash
   cd mobile-app
   npm install
   cp env.example .env
   npm start
   ```

## 📝 How to Contribute

### Reporting Bugs
- Use the [Bug Report template](.github/ISSUE_TEMPLATE/bug_report.md)
- Include detailed steps to reproduce
- Specify the platform (Web/Desktop/Mobile)
- Add screenshots if applicable

### Suggesting Features
- Use the [Feature Request template](.github/ISSUE_TEMPLATE/feature_request.md)
- Clearly describe the problem and proposed solution
- Specify which platforms would be affected

### Code Contributions

1. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Make your changes**
   - Follow the coding standards below
   - Add tests for new functionality
   - Update documentation as needed

3. **Commit your changes**
   ```bash
   git commit -m "feat: add amazing feature"
   ```

4. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

5. **Create a Pull Request**
   - Use a clear title and description
   - Reference any related issues
   - Include screenshots for UI changes

## 🎯 Coding Standards

### TypeScript/JavaScript
- Use TypeScript for all new code
- Follow ESLint configuration
- Use meaningful variable and function names
- Add JSDoc comments for complex functions

### Python
- Follow PEP 8 style guide
- Use type hints where applicable
- Write docstrings for functions and classes
- Use meaningful variable names

### Git Commit Messages
Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add fingerprint upload functionality
fix: resolve authentication token expiration
docs: update installation instructions
```

## 🧪 Testing

### Frontend Testing
```bash
cd frontend-web
npm test
```

### Backend Testing
```bash
cd backend
python manage.py test
```

### Mobile Testing
```bash
cd mobile-app
npm test
```

## 📁 Project Structure

```
daba-fing-project/
├── backend/           # Django REST API
├── frontend-web/      # Next.js web application
├── mobile-app/        # React Native mobile app
├── .github/           # GitHub templates and workflows
├── README.md          # Project documentation
├── CONTRIBUTING.md    # This file
└── LICENSE           # MIT License
```

## 🔒 Security

- Never commit sensitive information (API keys, passwords)
- Use environment variables for configuration
- Follow security best practices
- Report security vulnerabilities privately

## 📚 Resources

- [Project Documentation](README.md)
- [Security Guidelines](SECURITY.md)
- [Electron Build Guide](frontend-web/ELECTRON_BUILD_GUIDE.md)
- [GitHub Issues](https://github.com/RedaChehabi/daba-fing-project/issues)

## 💬 Community

- **GitHub Discussions**: For questions and general discussion
- **Issues**: For bug reports and feature requests
- **Pull Requests**: For code contributions

## 📄 License

By contributing to DabaFing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to DabaFing! 🎉 