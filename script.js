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
    "name": "Supipi Pharmacy",
    "category": "Health",
    "subcategory": "Pharmacy and Grocery",
    "description": "Pharmaceutical Products, Package foods (Milk powder, Biscuits Products, etc) and other grocery items.",
    "district": "Matara",
    "city": "Kamburupitiya",
    "address": "Matara Road, Kamburubitiya",
    "phone": "0712066446",
    "website": "",
    "rating": 4.6,
    "reviews": 12
  }
];

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
    shopGrid.innerHTML = '<div class="loading">Loading businesses...</div>';
}

// Create category filter buttons
function createCategoryFilters() {
    const categories = [...new Set(shopsData.map(shop => shop.category))];
    
    // Clear existing filters except "All Businesses"
    const allButton = categoryFilters.querySelector('[data-category="all"]');
    categoryFilters.innerHTML = '';
    categoryFilters.appendChild(allButton);
    
    // Add category-specific filters
    categories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'filter-btn';
        button.dataset.category = category;
        button.textContent = category;
        button.addEventListener('click', () => filterShops(category, 'all'));
        categoryFilters.appendChild(button);
    });
    
    // Add event listener to "All Businesses" button
    allButton.addEventListener('click', () => filterShops('all', 'all'));
}

// Create subcategory filter buttons
function createSubcategoryFilters() {
    if (!subcategoryFilters) return;
    
    // Clear existing subcategory filters
    subcategoryFilters.innerHTML = '<button class="filter-btn active" data-subcategory="all">All Subcategories</button>';
    
    // Add event listener to "All Subcategories" button
    const allSubButton = subcategoryFilters.querySelector('[data-subcategory="all"]');
    if (allSubButton) {
        allSubButton.addEventListener('click', () => filterShops(currentCategory, 'all'));
    }
}

// Update subcategory filters based on selected category
function updateSubcategoryFilters(category) {
    if (!subcategoryFilters) return;
    
    // Clear existing subcategory filters
    subcategoryFilters.innerHTML = '<button class="filter-btn active" data-subcategory="all">All Subcategories</button>';
    
    if (category === 'all') {
        return;
    }
    
    // Get subcategories for the selected category
    const subcategories = [...new Set(
        shopsData
            .filter(shop => shop.category === category)
            .map(shop => shop.subcategory)
            .filter(subcategory => subcategory) // Filter out undefined/empty subcategories
    )];
    
    // Add subcategory-specific filters
    subcategories.forEach(subcategory => {
        const button = document.createElement('button');
        button.className = 'filter-btn';
        button.dataset.subcategory = subcategory;
        button.textContent = subcategory;
        button.addEventListener('click', () => filterShops(category, subcategory));
        subcategoryFilters.appendChild(button);
    });
    
    // Add event listener to "All Subcategories" button
    const allSubButton = subcategoryFilters.querySelector('[data-subcategory="all"]');
    if (allSubButton) {
        allSubButton.addEventListener('click', () => filterShops(category, 'all'));
    }
}

// Filter shops by category and subcategory
function filterShops(category, subcategory) {
    currentCategory = category;
    currentSubcategory = subcategory;
    
    // Update active category button
    document.querySelectorAll('.category-filters .filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const categoryBtn = document.querySelector(`[data-category="${category}"]`);
    if (categoryBtn) {
        categoryBtn.classList.add('active');
    }
    
    // Update subcategory filters
    updateSubcategoryFilters(category);
    
    // Update active subcategory button
    if (subcategoryFilters) {
        document.querySelectorAll('.subcategory-filters .filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const subcategoryBtn = document.querySelector(`[data-subcategory="${subcategory}"]`);
        if (subcategoryBtn) {
            subcategoryBtn.classList.add('active');
        }
    }
    
    // Filter and display shops
    let filteredShops = shopsData;
    
    if (category !== 'all') {
        filteredShops = filteredShops.filter(shop => shop.category === category);
    }
    
    if (subcategory !== 'all') {
        filteredShops = filteredShops.filter(shop => shop.subcategory === subcategory);
    }
    
    displayShops(filteredShops);
}

// Display shops in the grid
function displayShops(shops) {
    if (shops.length === 0) {
        shopGrid.innerHTML = '<div class="loading">No businesses found.</div>';
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
            ${shop.subcategory ? `<span class="shop-subcategory">${shop.subcategory}</span>` : ''}
            <p class="shop-description">${shop.description}</p>
            <div class="shop-info">
                ${shop.district ? `<div><strong>📍 District:</strong> ${shop.district}</div>` : ''}
                ${shop.city ? `<div><strong>🏙️ City:</strong> ${shop.city}</div>` : ''}
                <div><strong>📌 Address:</strong> ${shop.address}</div>
                ${shop.phone ? `<div><strong>📞 Phone:</strong> <a href="tel:${shop.phone.replace(/\s/g, '')}">${shop.phone}</a></div>` : ''}
                ${shop.website && shop.website.trim() ? `<div><strong>🌐 Website:</strong> <a href="${shop.website.startsWith('http') ? shop.website : 'https://' + shop.website}" target="_blank" rel="noopener">${shop.website}</a></div>` : ''}
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

// Search functionality
function searchShops(query) {
    if (!query) {
        filterShops(currentCategory, currentSubcategory);
        return;
    }
    
    // Reset category and subcategory filters to show all when searching
    currentCategory = 'all';
    currentSubcategory = 'all';
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const allCategoryBtn = document.querySelector('[data-category="all"]');
    if (allCategoryBtn) {
        allCategoryBtn.classList.add('active');
    }
    
    if (subcategoryFilters) {
        const allSubBtn = document.querySelector('[data-subcategory="all"]');
        if (allSubBtn) {
            allSubBtn.classList.add('active');
        }
    }
    
    const filteredShops = shopsData.filter(shop => 
        shop.name.toLowerCase().includes(query.toLowerCase()) ||
        shop.description.toLowerCase().includes(query.toLowerCase()) ||
        shop.category.toLowerCase().includes(query.toLowerCase()) ||
        shop.subcategory?.toLowerCase().includes(query.toLowerCase()) ||
        shop.address.toLowerCase().includes(query.toLowerCase()) ||
        shop.city?.toLowerCase().includes(query.toLowerCase()) ||
        shop.district?.toLowerCase().includes(query.toLowerCase()) ||
        shop.phone?.toLowerCase().includes(query.toLowerCase())
    );
    
    displayShops(filteredShops);
}