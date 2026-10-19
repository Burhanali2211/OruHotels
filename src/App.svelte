<script>
  import menuData from './data/menu.json';
  import {
    dietFilter,
    activeCategory,
    searchQuery,
    viewMode,
    cartSummary,
    isDrawerOpen,
    APP_CONFIG
  } from './stores/cart.js';

  import Header from './components/Header.svelte';
  import ActiveOrderBanner from './components/ActiveOrderBanner.svelte';
  import Hero from './components/Hero.svelte';
  import CategoryNav from './components/CategoryNav.svelte';
  import DishCard from './components/DishCard.svelte';
  import DishModal from './components/DishModal.svelte';
  import OrderDrawer from './components/OrderDrawer.svelte';
  import OrderReceiptModal from './components/OrderReceiptModal.svelte';
  import QuickMenuSheet from './components/QuickMenuSheet.svelte';
  import Toast from './components/Toast.svelte';

  const { restaurant, categories, dishes } = menuData;

  // Lineicons class mapping for section headers
  const iconClassMap = {
    'nonveg-pizza': 'lni lni-pizza',
    'veg-pizza': 'lni lni-leaf',
    'fish-special': 'lni lni-drop',
    'beverages': 'lni lni-fresh-juice',
    'all': 'lni lni-restaurant'
  };

  let isLoading = false;

  // Reactive dish filtering
  $: filteredDishes = dishes.filter(dish => {
    // Dietary Filter
    if ($dietFilter === 'veg' && dish.diet !== 'veg') return false;
    if ($dietFilter === 'nonveg' && dish.diet !== 'nonveg') return false;

    // Search Query
    if ($searchQuery.trim()) {
      const q = $searchQuery.toLowerCase().trim();
      const matchName = dish.name.toLowerCase().includes(q);
      const matchDesc = dish.description.toLowerCase().includes(q);
      const matchTag = dish.tag?.toLowerCase().includes(q);
      const matchCat = dish.category.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchTag && !matchCat) return false;
    }

    return true;
  });

  // Categories with matching items and count
  $: displayedCategories = categories
    .filter(cat => cat.id !== 'all')
    .map(cat => {
      const items = filteredDishes.filter(d => d.category === cat.id);
      return {
        ...cat,
        items,
        itemCount: items.length
      };
    })
    .filter(cat => cat.items.length > 0);

  // Categories list with counts for CategoryNav
  $: navCategories = [
    {
      id: 'all',
      name: 'All Items',
      itemCount: filteredDishes.length
    },
    ...categories.filter(c => c.id !== 'all').map(c => {
      const count = filteredDishes.filter(d => d.category === c.id).length;
      return {
        ...c,
        itemCount: count
      };
    }).filter(c => c.itemCount > 0)
  ];
</script>

<div class="oru-app-wrapper">
  <!-- Top Header Navigation -->
  <Header {restaurant} />

  <!-- Active Order Banner -->
  <ActiveOrderBanner />

  <main>
    <!-- Search, Dietary Control & Quick Filter Chips -->
    <Hero />


    <!-- Category Pills Navigation with Scroll-Spy -->
    <CategoryNav categories={navCategories} />

    <!-- Menu Dishes Stream -->
    <div class="menu-content-stream">
      {#if isLoading}
        <div class="skeleton-wrapper">
          {#each Array(4) as _}
            <div class="skeleton-card">
              <div class="skeleton-img"></div>
              <div class="skeleton-info">
                <div class="skeleton-line title"></div>
                <div class="skeleton-line desc"></div>
                <div class="skeleton-line price"></div>
              </div>
            </div>
          {/each}
        </div>
      {:else if displayedCategories.length === 0}
        <div class="empty-results-box">
          <div class="empty-icon-circle">
            <i class="lni lni-restaurant" style="font-size: 1.8rem;" aria-hidden="true"></i>
          </div>
          <h3>No matching dishes found</h3>
          <p>We couldn't find any dishes matching your current search or dietary filters.</p>
          <button
            class="btn-apple-secondary"
            type="button"
            on:click={() => { 
              $searchQuery = ''; 
              $dietFilter = 'all'; 
            }}
          >
            Reset All Filters
          </button>
        </div>
      {:else}
        <!-- Differentiated Category Sections -->
        {#each displayedCategories as cat (cat.id)}
          {@const iconCls = iconClassMap[cat.id] || 'lni lni-restaurant'}
          <section class="menu-section section-{cat.id}" id="section-{cat.id}">
            <!-- Distinct Category Header -->
            <div class="section-header">
              <div class="section-title-wrap">
                <div class="section-icon-badge" style="--accent-hue: {cat.color || '#EA580C'}">
                  <i class="{iconCls} sec-hdr-icon" aria-hidden="true"></i>
                </div>
                <div>
                  <h2 class="section-title">{cat.name}</h2>
                  {#if cat.subtitle}
                    <span class="section-subtitle">{cat.subtitle}</span>
                  {/if}
                </div>
              </div>
              <span class="section-count-badge">{cat.items.length} {cat.items.length === 1 ? 'item' : 'items'}</span>
            </div>

            <!-- Unified Dish Stack -->
            {#if $viewMode === 'compact'}
              <div class="dish-stack compact-stack">
                {#each cat.items as dish (dish.id)}
                  <DishCard {dish} />
                {/each}
              </div>
            {:else}
              <div class="dish-stack">
                {#each cat.items as dish (dish.id)}
                  <DishCard {dish} />
                {/each}
              </div>
            {/if}
          </section>
        {/each}
      {/if}
    </div>

    <!-- Minimalist Footer with Real Store Contact Info -->
    <footer class="app-footer">
      <div class="footer-title">{restaurant.name}</div>
      <div class="footer-sub">{restaurant.tagline}</div>
      <div class="footer-address">
        <i class="lni lni-map-marker footer-icon" aria-hidden="true"></i>
        <span>{restaurant.address}</span>
      </div>
      <div class="footer-phones">
        <i class="lni lni-phone footer-icon" aria-hidden="true"></i>
        <span>Orders &amp; Enquiries:</span> 
        <a href="tel:{restaurant.phone}" class="phone-link">{restaurant.phone}</a>
        {#if restaurant.secondaryPhones}
          {#each restaurant.secondaryPhones as p}
            • <a href="tel:{p}" class="phone-link">{p}</a>
          {/each}
        {/if}
      </div>
      <div class="footer-branding">
        Dine-In Digital Menu • <span class="brand-highlight">OruHotels</span>
      </div>
    </footer>
  </main>

  <!-- Dribbble Floating Quick-Jump Menu Sheet -->
  <QuickMenuSheet {categories} {dishes} />

  <!-- iOS Sticky Bottom Bar (When ordering items exist) -->
  {#if APP_CONFIG.isOrderingEnabled && $cartSummary.totalItems > 0 && !$isDrawerOpen}
    <div class="ios-bottom-bar">
      <div class="bottom-bar-inner">
        <div class="bar-order-info">
          <div class="bar-items">
            <i class="lni lni-shopping-basket bag-icon" aria-hidden="true"></i>
            <span>{$cartSummary.totalItems} {$cartSummary.totalItems === 1 ? 'item' : 'items'} in Tray</span>
          </div>
          <div class="bar-total">₹{$cartSummary.grandTotal}</div>
        </div>

        <button 
          class="btn-apple-primary btn-apple-small"
          type="button"
          on:click={() => isDrawerOpen.set(true)}
          aria-label="View Order Tray"
        >
          <span class="btn-label">Review Order</span>
        </button>
      </div>
    </div>
  {/if}

  <!-- Modals & Drawers -->
  <DishModal />
  <OrderDrawer />
  <OrderReceiptModal />
  <Toast />
</div>

<style>
  .menu-content-stream {
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 12px 16px 40px;
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  .menu-section {
    scroll-margin-top: 112px;
  }

  /* Section Header Styling */
  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--ios-separator);
  }

  .section-title-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .section-icon-badge {
    width: 34px;
    height: 34px;
    border-radius: 9px;
    background: color-mix(in srgb, var(--accent-hue, #EA580C) 14%, transparent);
    color: var(--accent-hue, #EA580C);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .sec-hdr-icon {
    font-size: 1.15rem;
  }

  .section-title {
    font-family: var(--font-sans);
    font-size: 1.15rem;
    font-weight: 800;
    color: var(--text-primary);
    margin: 0;
    line-height: 1.2;
    letter-spacing: -0.015em;
  }

  .section-subtitle {
    display: block;
    font-size: 0.72rem;
    font-weight: 500;
    color: var(--text-muted);
    margin-top: 2px;
  }

  .section-count-badge {
    font-size: 0.72rem;
    font-weight: 700;
    color: var(--text-secondary);
    background: var(--ios-fill);
    padding: 3px 9px;
    border-radius: var(--radius-pill);
    flex-shrink: 0;
  }

  /* Default Stack */
  .dish-stack {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .compact-stack {
    gap: 8px;
  }

  /* Beverages Grid */
  .dish-grid-beverages {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  /* Skeleton Loading */
  .skeleton-wrapper {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .skeleton-card {
    display: flex;
    gap: 16px;
    padding: 14px;
    background: #FFFFFF;
    border-radius: var(--radius-lg);
    border: 1px solid var(--ios-separator);
  }

  .skeleton-img {
    width: 90px;
    height: 90px;
    border-radius: var(--radius-md);
    background: var(--ios-fill);
    animation: pulse 1.5s infinite;
  }

  .skeleton-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
    justify-content: center;
  }

  .skeleton-line {
    height: 14px;
    background: var(--ios-fill);
    border-radius: 4px;
    animation: pulse 1.5s infinite;
  }

  .skeleton-line.title { width: 70%; height: 18px; }
  .skeleton-line.desc { width: 90%; }
  .skeleton-line.price { width: 40%; margin-top: 8px; }

  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.4; }
    100% { opacity: 1; }
  }

  .empty-results-box {
    text-align: center;
    padding: 48px 24px;
    background: #FFFFFF;
    border-radius: var(--radius-lg);
    border: 1px solid var(--ios-separator);
    box-shadow: var(--shadow-sm);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  .empty-icon-circle {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: var(--ios-fill);
    color: var(--text-muted);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 4px;
  }

  .empty-results-box h3 {
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--text-primary);
  }

  .empty-results-box p {
    font-size: 0.86rem;
    color: var(--text-muted);
    max-width: 320px;
    line-height: 1.45;
    margin-bottom: 8px;
  }

  /* Bottom Bar Internal */
  .bar-order-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .bar-items {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.78rem;
    font-weight: 700;
    color: var(--text-muted);
    letter-spacing: 0.02em;
    margin-bottom: 2px;
  }

  .bag-icon {
    color: var(--accent-gold);
    font-size: 1rem;
  }

  .bar-total {
    font-size: 1.25rem;
    font-weight: 800;
    color: var(--text-primary);
    letter-spacing: -0.02em;
  }

  /* Footer */
  .app-footer {
    text-align: center;
    padding: 36px 16px 20px;
    color: var(--text-muted);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
  }

  .footer-title {
    font-size: 1rem;
    font-weight: 800;
    color: var(--text-primary);
    letter-spacing: -0.01em;
  }

  .footer-sub {
    font-size: 0.78rem;
    color: var(--accent-gold);
    font-weight: 600;
  }

  .footer-address {
    font-size: 0.76rem;
    color: var(--text-secondary);
    margin-top: 4px;
    display: inline-flex;
    align-items: center;
    gap: 5px;
  }

  .footer-phones {
    font-size: 0.74rem;
    color: var(--text-secondary);
    margin-top: 2px;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .footer-icon {
    color: var(--accent-gold);
    font-size: 0.85rem;
  }

  .phone-link {
    color: var(--text-primary);
    font-weight: 700;
    text-decoration: none;
  }

  .phone-link:hover {
    text-decoration: underline;
  }

  .footer-branding {
    font-size: 0.72rem;
    margin-top: 14px;
    opacity: 0.75;
    letter-spacing: 0.02em;
  }

  .brand-highlight {
    font-weight: 700;
    color: var(--text-primary);
  }

  @media (max-width: 480px) {
    .menu-content-stream {
      padding: 10px 12px 36px;
      gap: 24px;
    }

    .section-title {
      font-size: 1.05rem;
    }

    .section-count-badge {
      font-size: 0.68rem;
      padding: 2px 7px;
    }
  }

  @media (max-width: 375px) {
    .menu-content-stream {
      padding: 8px 10px 32px;
      gap: 20px;
    }

    .section-title {
      font-size: 0.98rem;
    }
  }

  @media (min-width: 768px) {
    .dish-stack {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 14px;
    }

    .compact-stack {
      grid-template-columns: 1fr;
    }

    .dish-grid-beverages {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
  }
</style>
