# Shop Directory

A static website showcasing local shops with categorization and filtering functionality.

## Features

- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Category Filtering**: Filter shops by different categories
- **Dynamic Loading**: Shop data loaded from JSON file
- **Modern UI**: Clean and attractive user interface
- **GitHub Pages Ready**: Configured for easy deployment

## Categories

- Coffee & Tea
- Fashion & Clothing
- Electronics & Technology
- Home & Garden
- Restaurants & Food
- Health & Fitness
- Books & Media
- Music & Entertainment
- Automotive
- Health & Beauty
- Toys & Games
- Fashion & Accessories

## Shop Information Includes

- Shop name and description
- Category classification
- Contact information (address, phone, website)
- Ratings and reviews
- Professional styling

## Files Structure

```
├── index.html          # Main HTML file
├── styles.css          # CSS styling
├── script.js           # JavaScript functionality
├── shops.json          # Shop data
└── README.md           # This file
```

## How to Add New Shops

1. Edit the `shops.json` file
2. Add your shop data following the existing format:

```json
{
  "id": 16,
  "name": "Your Shop Name",
  "category": "Shop Category",
  "description": "Description of your shop",
  "address": "123 Your Street, City",
  "phone": "+1 (555) 123-4567",
  "website": "https://yourwebsite.com",
  "rating": 4.5,
  "reviews": 100
}
```

## GitHub Pages Deployment

This site is configured to work with GitHub Pages. Simply:

1. Push your code to the `main` or `master` branch
2. Go to your repository settings
3. Enable GitHub Pages from the source branch
4. Your site will be available at: `https://yourusername.github.io/repositoryname`

## Local Development

To run locally:
1. Clone the repository
2. Open `index.html` in a web browser
3. Or use a local server like `python -m http.server` or `live-server`

## Contributing

Feel free to contribute by:
- Adding more shops to the JSON file
- Improving the design
- Adding new features
- Fixing bugs

## License

This project is open source and available under the [MIT License](LICENSE).