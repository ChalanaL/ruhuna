// Global variables
let shopsData = [];
let currentCategory = 'all';
let currentSubcategory = 'all';

// DOM elements
const shopGrid = document.getElementById('shopGrid');
const categoryFilters = document.getElementById('categoryFilters');
const subcategoryFilters = document.getElementById('subcategoryFilters');
const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearch');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadShopsData();
    setupSearchFunctionality();
});

// Fallback shop data (embedded for offline use)
const fallbackShopsData = [
  {
    "id": 1,
    "name": "Urban Coffee House2",
    "category": "Coffee & Tea",
    "subcategory": "Coffee Shop",
    "description": "A cozy coffee shop serving artisanal coffee, fresh pastries, and light meals. Perfect for work, study, or catching up with friends.",
    "address": "123 Main Street, Downtown",
    "phone": "+1 (555) 123-4567",
    "website": "https://urbancoffeehouse.com",
    "rating": 4.5,
    "reviews": 127
  },
  {
    "id": 2,
    "name": "Fashion Forward Boutique",
    "category": "Fashion & Clothing",
    "subcategory": "Women's Fashion",
    "description": "Trendy clothing store featuring the latest fashion trends for men and women. Curated selection of designer and affordable brands.",
    "address": "456 Fashion Avenue, Shopping District",
    "phone": "+1 (555) 234-5678",
    "website": "https://fashionforward.com",
    "rating": 4.2,
    "reviews": 89
  },
  {
    "id": 3,
    "name": "Tech Solutions Store",
    "category": "Electronics & Technology",
    "subcategory": "Computer & Mobile",
    "description": "Your one-stop shop for all things tech. Smartphones, laptops, accessories, and expert repair services available.",
    "address": "789 Tech Boulevard, Business Center",
    "phone": "+1 (555) 345-6789",
    "website": "https://techsolutions.com",
    "rating": 4.7,
    "reviews": 203
  },
  {
    "id": 4,
    "name": "Green Thumb Garden Center",
    "category": "Home & Garden",
    "subcategory": "Plants & Gardening",
    "description": "Complete garden center with plants, tools, soil, and expert gardening advice. Transform your space into a green paradise.",
    "address": "321 Garden Lane, Suburb",
    "phone": "+1 (555) 456-7890",
    "website": "https://greenthumb.com",
    "rating": 4.3,
    "reviews": 156
  },
  {
    "id": 5,
    "name": "Bella Vista Restaurant",
    "category": "Restaurants & Food",
    "subcategory": "Italian Cuisine",
    "description": "Authentic Italian cuisine in an elegant setting. Fresh pasta, wood-fired pizzas, and an extensive wine collection.",
    "address": "654 Culinary Street, Historic District",
    "phone": "+1 (555) 567-8901",
    "website": "https://bellavista.com",
    "rating": 4.8,
    "reviews": 312
  },
  {
    "id": 15,
    "name": "Morning Brew Cafe",
    "category": "Coffee & Tea",
    "subcategory": "Cafe",
    "description": "Neighborhood cafe serving specialty coffee, tea blends, and homemade breakfast items. Your perfect morning destination.",
    "address": "396 Sunrise Boulevard, Neighborhood Center",
    "phone": "+1 (555) 567-8902",
    "website": "https://morningbrew.com",
    "rating": 4.3,
    "reviews": 201
  }
];

// Load shops data from JSON file with fallback
async function loadShopsData() {
    try {
        showLoading();
        
        // Try to load from JSON file first (works when served via HTTP)
        const response = await fetch('shops.json');
        if (!response.ok) {
            throw new Error('Failed to load shops data from file');
        }
        shopsData = await response.json();
        console.log('Loaded shops data from JSON file');
        
    } catch (error) {
        console.log('Using fallback data due to CORS or file access issues');
        // Use embedded fallback data
        shopsData = fallbackShopsData;
    }
    
    createCategoryFilters();
    createSubcategoryFilters();
    displayShops(shopsData);
}

// Show loading state
function showLoading() {
    shopGrid.innerHTML = '<div class="loading">Loading shops...</div>';
}

// Show error message
function showError(message) {
    shopGrid.innerHTML = `<div class="loading" style="color: #dc3545;">${message}</div>`;
}

// Create category filter buttons
function createCategoryFilters() {
    const categories = [...new Set(shopsData.map(shop => shop.category))];
    
    // Clear existing filters except "All Shops"
    const allButton = categoryFilters.querySelector('[data-category="all"]');
    categoryFilters.innerHTML = '';
    categoryFilters.appendChild(allButton);
    
    // Add category-specific filters
    categories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'filter-btn';
        button.dataset.category = category;
        button.textContent = category;
        button.addEventListener('click', () => filterShops(category));
        categoryFilters.appendChild(button);
    });
    
    // Add event listener to "All Shops" button
    allButton.addEventListener('click', () => filterShops('all'));
}

// Create subcategory filter buttons
function createSubcategoryFilters() {
    const subcategories = [...new Set(shopsData.map(shop => shop.subcategory))];
    
    // Clear existing filters except "All Subcategories"
    const allSubButton = subcategoryFilters.querySelector('[data-subcategory="all"]');
    subcategoryFilters.innerHTML = '';
    subcategoryFilters.appendChild(allSubButton);
    
    // Add subcategory-specific filters
    subcategories.forEach(subcategory => {
        const button = document.createElement('button');
        button.className = 'filter-btn sub-filter';
        button.dataset.subcategory = subcategory;
        button.textContent = subcategory;
        button.addEventListener('click', () => filterBySubcategory(subcategory));
        subcategoryFilters.appendChild(button);
    });
    
    // Add event listener to "All Subcategories" button
    allSubButton.addEventListener('click', () => filterBySubcategory('all'));
}

// Filter shops by category
function filterShops(category) {
    currentCategory = category;
    currentSubcategory = 'all'; // Reset subcategory when changing category
    
    // Update active button
    document.querySelectorAll('.category-filters .filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-category="${category}"]`).classList.add('active');
    
    // Reset subcategory filter
    document.querySelectorAll('.subcategory-filters .filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector('[data-subcategory="all"]').classList.add('active');
    
    // Update subcategory options based on selected category
    updateSubcategoryOptions(category);
    
    // Filter and display shops
    applyFilters();
}

// Filter shops by subcategory
function filterBySubcategory(subcategory) {
    currentSubcategory = subcategory;
    
    // Update active button
    document.querySelectorAll('.subcategory-filters .filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-subcategory="${subcategory}"]`).classList.add('active');
    
    // Filter and display shops
    applyFilters();
}

// Update subcategory options based on selected category
function updateSubcategoryOptions(category) {
    const relevantShops = category === 'all' ? shopsData : shopsData.filter(shop => shop.category === category);
    const subcategories = [...new Set(relevantShops.map(shop => shop.subcategory))];
    
    // Clear existing subcategory filters except "All"
    const allSubButton = subcategoryFilters.querySelector('[data-subcategory="all"]');
    subcategoryFilters.innerHTML = '';
    subcategoryFilters.appendChild(allSubButton);
    
    // Add relevant subcategory filters
    subcategories.forEach(subcategory => {
        const button = document.createElement('button');
        button.className = 'filter-btn sub-filter';
        button.dataset.subcategory = subcategory;
        button.textContent = subcategory;
        button.addEventListener('click', () => filterBySubcategory(subcategory));
        subcategoryFilters.appendChild(button);
    });
}

// Apply both category and subcategory filters
function applyFilters() {
    let filteredShops = shopsData;
    
    // Apply category filter
    if (currentCategory !== 'all') {
        filteredShops = filteredShops.filter(shop => shop.category === currentCategory);
    }
    
    // Apply subcategory filter
    if (currentSubcategory !== 'all') {
        filteredShops = filteredShops.filter(shop => shop.subcategory === currentSubcategory);
    }
    
    displayShops(filteredShops);
}

// Display shops in the grid
function displayShops(shops) {
    if (shops.length === 0) {
        shopGrid.innerHTML = '<div class="loading">No shops found in this category.</div>';
        return;
    }
    
    shopGrid.innerHTML = shops.map(shop => createShopCard(shop)).join('');
}

// Create HTML for a single shop card
function createShopCard(shop) {
    const rating = generateStarRating(shop.rating || 0);
    
    return `
        <div class="shop-card">
            <h3>${shop.name}</h3>
            <span class="shop-category">${shop.category}</span>
            <span class="shop-subcategory">${shop.subcategory}</span>
            <p class="shop-description">${shop.description}</p>
            <div class="shop-info">
                <div>${shop.address}</div>
                ${shop.phone ? `<div>${shop.phone}</div>` : ''}
                ${shop.website ? `<div><a href="${shop.website}" target="_blank" rel="noopener">Visit Website</a></div>` : ''}
            </div>
            ${shop.rating ? `
                <div class="shop-rating">
                    <span class="stars">${rating}</span>
                    <span class="rating-text">${shop.rating}/5 (${shop.reviews || 0} reviews)</span>
                </div>
            ` : ''}
        </div>
    `;
}

// Generate star rating HTML
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let stars = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        stars += '★';
    }
    
    // Half star
    if (hasHalfStar) {
        stars += '☆';
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        stars += '☆';
    }
    
    return stars;
}

// Setup search functionality
function setupSearchFunctionality() {
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.trim();
            searchShops(query);
        });
    }
    
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', function() {
            searchInput.value = '';
            searchShops('');
            searchInput.focus();
        });
    }
}

// Search functionality
function searchShops(query) {
    if (!query) {
        applyFilters();
        return;
    }
    
    // Reset category and subcategory filters to show all when searching
    currentCategory = 'all';
    currentSubcategory = 'all';
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector('[data-category="all"]').classList.add('active');
    document.querySelector('[data-subcategory="all"]').classList.add('active');
    
    // Update subcategory options to show all
    updateSubcategoryOptions('all');
    
    const filteredShops = shopsData.filter(shop => 
        shop.name.toLowerCase().includes(query.toLowerCase()) ||
        shop.description.toLowerCase().includes(query.toLowerCase()) ||
        shop.category.toLowerCase().includes(query.toLowerCase()) ||
        shop.subcategory.toLowerCase().includes(query.toLowerCase()) ||
        shop.address.toLowerCase().includes(query.toLowerCase())
    );
    
    displayShops(filteredShops);
}