// Global variables
let shopsData = [];
let currentCategory = 'all';

// DOM elements
const shopGrid = document.getElementById('shopGrid');
const categoryFilters = document.getElementById('categoryFilters');
const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearch');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadShopsData();
    setupSearchFunctionality();
});

// Load shops data from JSON file
async function loadShopsData() {
    try {
        showLoading();
        const response = await fetch('shops.json');
        if (!response.ok) {
            throw new Error('Failed to load shops data');
        }
        shopsData = await response.json();
        createCategoryFilters();
        displayShops(shopsData);
    } catch (error) {
        console.error('Error loading shops data:', error);
        showError('Failed to load shops data. Please try again later.');
    }
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

// Filter shops by category
function filterShops(category) {
    currentCategory = category;
    
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-category="${category}"]`).classList.add('active');
    
    // Filter and display shops
    const filteredShops = category === 'all' 
        ? shopsData 
        : shopsData.filter(shop => shop.category === category);
    
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
        filterShops(currentCategory);
        return;
    }
    
    // Reset category filter to show all when searching
    currentCategory = 'all';
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector('[data-category="all"]').classList.add('active');
    
    const filteredShops = shopsData.filter(shop => 
        shop.name.toLowerCase().includes(query.toLowerCase()) ||
        shop.description.toLowerCase().includes(query.toLowerCase()) ||
        shop.category.toLowerCase().includes(query.toLowerCase()) ||
        shop.address.toLowerCase().includes(query.toLowerCase())
    );
    
    displayShops(filteredShops);
}