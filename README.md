# Shop Directory

A static website showcasing local shops with categorization and filtering functionality.

## Features

- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Category Filtering**: Filter shops by different main categories
- **Subcategory Filtering**: Further refine your search with specific subcategories
- **Dual Filtering System**: Use both category and subcategory filters together
- **Dynamic Loading**: Shop data loaded from JSON file
- **Search Functionality**: Search by name, category, subcategory, or description
- **Modern UI**: Clean and attractive user interface
- **GitHub Pages Ready**: Configured for easy deployment

## Categories & Subcategories

- **Coffee & Tea**
  - Coffee Shop
  - Cafe
- **Fashion & Clothing**
  - Women's Fashion
- **Electronics & Technology**
  - Computer & Mobile
- **Home & Garden**
  - Plants & Gardening
  - Home Decor & Furniture
- **Restaurants & Food**
  - Italian Cuisine
  - Bakery & Desserts
- **Health & Fitness**
  - Gym & Fitness Center
- **Books & Media**
  - Bookstore
- **Music & Entertainment**
  - Music Store
- **Automotive**
  - Auto Repair & Service
- **Health & Beauty**
  - Spa & Wellness
- **Toys & Games**
  - Children's Toys
- **Fashion & Accessories**
  - Jewelry & Accessories

## Shop Information Includes

- Shop name and description
- Category and subcategory classification
- Contact information (address, phone, website)
- Ratings and reviews
- Professional styling with dual-badge display

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
  "subcategory": "Shop Subcategory",
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