# Ceremic Admin - Product Upload System

A Vue.js admin panel for uploading products to the Ceremic database. This application is designed to be deployed on GitHub Pages.

## Features

- Clean, modern UI for product management
- Form validation
- Multi-select dropdowns for product associations
- Real-time API integration
- Responsive design

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure API endpoint (optional):
   - Create a `.env` file in the root directory
   - Add: `VITE_API_BASE_URL=http://localhost:9090`
   - Default is `http://localhost:9090` if not specified

3. Run development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Deployment to GitHub Pages

1. Install gh-pages (if not already installed):
```bash
npm install --save-dev gh-pages
```

2. Deploy:
```bash
npm run deploy
```

This will build the project and deploy it to the `gh-pages` branch.

## API Configuration

The API base URL can be configured via environment variables:
- Development: Set `VITE_API_BASE_URL` in `.env` file
- Production: Update the API URL in `src/services/api.js` or use environment variables

## Form Fields

- **Product Name**: Text input (required)
- **Description**: Textarea (required)
- **About**: Textarea (required)
- **Price**: Number input (required)
- **Benefit IDs**: Multi-select dropdown
- **Product Love Point IDs**: Multi-select dropdown
- **Product Detail IDs**: Multi-select dropdown
- **Discount IDs**: Multi-select dropdown
- **Image IDs**: Multi-select dropdown

## Notes

- The ID dropdowns currently show IDs 1-20. You can adjust the range in `src/components/ProductForm.vue` by modifying the `availableIds` array.
- For production, update the API base URL to point to your production server.

