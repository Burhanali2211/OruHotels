<script>
  import menuData from './data/menu.json';
  import {
    dietFilter,
    activeCategory,
    searchQuery,
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
  import Toast from './components/Toast.svelte';
  import { ShoppingBag, ArrowRight } from '@lucide/svelte';
  import { onMount } from 'svelte';

  const { restaurant, categories, dishes } = menuData;

  let isLoading = true;

  onMount(() => {
    // Simulate 1.5s network request for premium feel
    setTimeout(() => {
      isLoading = false;
    }, 1200);
  });

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
      if (!matchName && !matchDesc) return false;
    }

    return true;
  });

  // Group dishes by category
  $: displayedCategories = categories.filter(cat => cat.id !== 'all').map(cat => {
    return {
      ...cat,
      items: filteredDishes.filter(d => d.category === cat.id)
    };
  }).filter(cat => cat.items.length > 0);
</script>

<div class="oru-app-wrapper">
  <!-- Top Header Navigation -->
  <Header {restaurant} />

  <!-- Active Order Banner -->
  <ActiveOrderBanner />

  <main>
    <!-- Search and Segmented Dietary Control -->
    <Hero />

    <!-- Category Pills Navigation -->
    <CategoryNav {categories} />

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
          <h3>No dishes found</h3>
          <p>Try searching for something else or clear your dietary filter.</p>
          <button
            class="btn-apple-secondary"
            type="button"
            on:click={() => { $searchQuery = ''; $dietFilter = 'all'; }}
          >
            Clear Filters
          </button>
        </div>
      {:else}
        {#each displayedCategories as cat (cat.id)}
          <section class="menu-section" id="section-{cat.id}">
            <div class="section-header">
              <h2 class="section-title">{cat.name}</h2>
              <span class="section-badge">{cat.items.length}</span>
            </div>

            <div class="dish-stack">
              {#each cat.items as dish (dish.id)}
                <DishCard {dish} />
              {/each}
            </div>
          </section>
        {/each}
      {/if}
    </div>

    <!-- Minimalist Footer -->
    <footer class="app-footer">
      <div class="footer-title">{restaurant.name}</div>
      <div class="footer-sub">Dine-In Digital Menu</div>
      <div class="footer-branding">
        Powered by <span class="brand-highlight">Easy IO Technologies</span>
      </div>
    </footer>
  </main>

  <!-- iOS Sticky Bottom Bar -->
  {#if APP_CONFIG.isOrderingEnabled && $cartSummary.totalItems > 0 && !$isDrawerOpen}
    <div class="ios-bottom-bar">
      <div class="bottom-bar-inner">
        <div class="bar-order-info">
          <div class="bar-items">
            <ShoppingBag size={14} strokeWidth={2.5} class="bag-icon" />
            <span>{$cartSummary.totalItems} {$cartSummary.totalItems === 1 ? 'item' : 'items'}</span>
          </div>
          <div class="bar-total">₹{$cartSummary.grandTotal}</div>
        </div>

        <button 
          class="btn-apple-primary btn-apple-small"
          type="button"
          on:click={() => isDrawerOpen.set(true)}
          aria-label="View Order Tray"
        >
          <span class="btn-label">View Order</span>
          <ArrowRight size={16} strokeWidth={2.5} />
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
    padding: 12px 16px 36px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .menu-section {
    scroll-margin-top: 105px;
  }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    padding: 4px 2px;
  }

  .section-title {
    font-size: 1.15rem;
    font-weight: 800;
    color: var(--text-primary);
    margin: 0;
    letter-spacing: -0.01em;
  }

  .section-badge {
    font-size: 0.72rem;
    font-weight: 700;
    color: var(--text-muted);
    background: var(--ios-fill);
    padding: 2px 8px;
    border-radius: var(--radius-pill);
  }

  .dish-stack {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .skeleton-wrapper {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .skeleton-card {
    display: flex;
    gap: 16px;
    padding: 12px;
    background: #FFFFFF;
    border-radius: var(--radius-lg);
    border: 0.5px solid var(--ios-separator);
  }

  .skeleton-img {
    width: 100px;
    height: 100px;
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
    padding: 50px 20px;
    background: #FFFFFF;
    border-radius: var(--radius-md);
    border: 0.5px solid var(--ios-separator);
  }

  .empty-results-box h3 {
    font-size: 1.1rem;
    margin-bottom: 4px;
  }

  .empty-results-box p {
    font-size: 0.85rem;
    color: var(--text-muted);
    margin-bottom: 16px;
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
    font-size: 0.8rem;
    font-weight: 700;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin-bottom: 2px;
  }

  :global(.bag-icon) {
    color: var(--text-muted);
  }

  .bar-total {
    font-size: 1.15rem;
    font-weight: 800;
    color: var(--text-primary);
    letter-spacing: -0.02em;
  }

  /* Footer */
  .app-footer {
    text-align: center;
    padding: 30px 16px 10px;
    color: var(--text-muted);
  }

  .footer-title {
    font-size: 0.9rem;
    font-weight: 700;
    color: var(--text-secondary);
  }

  .footer-sub {
    font-size: 0.74rem;
    margin-top: 2px;
  }

  .footer-branding {
    font-size: 0.7rem;
    margin-top: 16px;
    opacity: 0.7;
    letter-spacing: 0.02em;
  }

  .brand-highlight {
    font-weight: 700;
    color: var(--ios-blue);
  }

  @media (min-width: 600px) {
    .dish-stack {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
  }
</style>
