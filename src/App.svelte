<script>
  import menuData from './data/menu.json';
  import {
    dietFilter,
    searchQuery
  } from './stores/cart.js';

  import Header from './components/Header.svelte';
  import Hero from './components/Hero.svelte';
  import CategoryNav from './components/CategoryNav.svelte';
  import DishCard from './components/DishCard.svelte';
  import DishModal from './components/DishModal.svelte';
  import { onMount } from 'svelte';
  import { trackEvent, getTable } from './utils/analytics.js';

  const { restaurant, categories, dishes } = menuData;

  let isLoading = true;

  onMount(() => {
    // Record customer visit or table QR scan in real-time
    const table = getTable();
    trackEvent({ eventType: table ? 'scan' : 'visit', table });

    // Smooth initial transition
    setTimeout(() => {
      isLoading = false;
    }, 800);
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
              <span class="section-badge">{cat.items.length} {cat.items.length === 1 ? 'dish' : 'dishes'}</span>
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

    <!-- Restaurant Operational Details & Clean Tech Credits -->
    <footer class="app-footer">
      <!-- Restaurant Contact & Venue Details -->
      <div class="restaurant-venue-card">
        <div class="venue-brand-row">
          <div class="venue-logo-box">
            <svg class="venue-diamond-svg" viewBox="0 0 24 24" fill="none" width="16" height="16">
              <path d="M6 3H18L22 9L12 22L2 9L6 3Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 9H22" stroke="currentColor" stroke-width="1.5"/>
              <path d="M12 22L7 9L10 3" stroke="currentColor" stroke-width="1.4"/>
              <path d="M12 22L17 9L14 3" stroke="currentColor" stroke-width="1.4"/>
            </svg>
          </div>
          <div>
            <div class="venue-name">{restaurant.name}</div>
            <div class="venue-tagline">{restaurant.tagline || 'Cafe & Fine Dining'}</div>
          </div>
        </div>

        <div class="venue-address-line">
          <span>{restaurant.location}</span>
        </div>

        {#if restaurant.phones}
          <div class="venue-contact-section">
            <span class="contact-section-label">Table Service & Home Delivery</span>
            <div class="phone-actions-grid">
              {#each restaurant.phones as ph}
                <a href="tel:{ph}" class="phone-action-btn">
                  <span>Call {ph}</span>
                </a>
              {/each}
            </div>
          </div>
        {/if}
      </div>

      <!-- Clean Hospitality Technology Attribution & EasyIO Technologies Backlink -->
      <div class="hospitality-platform-credit">
        <div class="credit-main-row">
          <div class="credit-unit">
            <span class="credit-dot"></span>
            <span class="credit-text">Menu powered by</span>
            <a
              href="https://orupos.in"
              target="_blank"
              rel="noopener noreferrer"
              class="brand-anchor orupos-link"
              title="OruPOS • Hospitality Digital Systems & POS"
            >
              orupos.in
            </a>
          </div>

          <span class="credit-sep">•</span>

          <div class="credit-unit">
            <span class="credit-text">Engineered by</span>
            <a
              href="https://easyio.tech"
              target="_blank"
              rel="noopener noreferrer"
              class="brand-anchor easyio-link"
              title="EasyIO Technologies • Enterprise Software & Platforms"
            >
              EasyIO Technologies
            </a>
          </div>
        </div>

        <div class="hotelier-action-bar">
          <span class="hotelier-prompt">Empowering hotels, cafes & restaurants with digital QR dining</span>
          <a
            href="https://orupos.in"
            target="_blank"
            rel="noopener noreferrer"
            class="hotelier-action-btn"
          >
            <span>Launch Your Menu</span>
            <span class="arrow-sym">→</span>
          </a>
        </div>
      </div>
    </footer>
  </main>

  <!-- Dish Detail Modal -->
  <DishModal />
</div>

<style>
  .menu-content-stream {
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 12px 16px 28px;
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
    padding: 3px 9px;
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
    border-radius: var(--radius-md);
    border: 0.5px solid var(--ios-separator);
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

  /* Restaurant Operational Details & Clean Tech Credits */
  .app-footer {
    padding: 16px 16px 40px;
    max-width: var(--max-width);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .restaurant-venue-card {
    background: #FFFFFF;
    border-radius: 16px;
    border: 1px solid rgba(0, 0, 0, 0.08);
    padding: 20px 18px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
  }

  .venue-brand-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 10px;
  }

  .venue-logo-box {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: linear-gradient(145deg, #18181B 0%, #09090B 100%);
    color: #F8FAFC;
    border: 1px solid rgba(255, 255, 255, 0.16);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .venue-name {
    font-size: 0.95rem;
    font-weight: 800;
    color: var(--text-primary);
    line-height: 1.2;
  }

  .venue-tagline {
    font-size: 0.72rem;
    color: var(--text-muted);
    margin-top: 2px;
  }

  .venue-address-line {
    font-size: 0.76rem;
    color: var(--text-secondary);
    line-height: 1.45;
    padding-bottom: 12px;
    border-bottom: 1px solid #F1F5F9;
    margin-bottom: 12px;
  }

  .venue-contact-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .contact-section-label {
    font-size: 0.68rem;
    font-weight: 700;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .phone-actions-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .phone-action-btn {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: #F8FAFC;
    border: 1px solid #E2E8F0;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--text-primary);
    text-decoration: none;
    transition: all 0.15s ease;
  }

  .phone-action-btn:hover {
    background: #0F172A;
    color: #FFFFFF;
    border-color: #0F172A;
  }

  /* Hospitality Platform Credit & EasyIO Technologies Backlink */
  .hospitality-platform-credit {
    background: #F8FAFC;
    border: 1px solid #E2E8F0;
    border-radius: 14px;
    padding: 14px 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .credit-main-row {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 8px;
    font-size: 0.75rem;
    color: #64748B;
  }

  .credit-unit {
    display: inline-flex;
    align-items: center;
    gap: 5px;
  }

  .credit-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #10B981;
  }

  .credit-sep {
    color: #CBD5E1;
  }

  .brand-anchor {
    font-weight: 750;
    text-decoration: none;
    transition: all 0.15s ease;
  }

  .orupos-link {
    color: #0F172A;
    border-bottom: 1px solid rgba(15, 23, 42, 0.25);
  }

  .orupos-link:hover {
    color: #047857;
    border-bottom-color: #047857;
  }

  .easyio-link {
    color: #2563EB;
    border-bottom: 1px solid rgba(37, 99, 235, 0.25);
  }

  .easyio-link:hover {
    color: #1D4ED8;
    border-bottom-color: #1D4ED8;
  }

  .hotelier-action-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
    padding-top: 10px;
    border-top: 1px solid #E2E8F0;
    font-size: 0.72rem;
  }

  .hotelier-prompt {
    color: #64748B;
  }

  .hotelier-action-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: #0F172A;
    font-weight: 750;
    text-decoration: none;
    background: #FFFFFF;
    border: 1px solid #CBD5E1;
    padding: 4px 10px;
    border-radius: 6px;
    transition: all 0.15s ease;
  }

  .hotelier-action-btn:hover {
    background: #0F172A;
    color: #FFFFFF;
    border-color: #0F172A;
  }

  .arrow-sym {
    transition: transform 0.15s ease;
  }

  .hotelier-action-btn:hover .arrow-sym {
    transform: translateX(2px);
  }

  @media (min-width: 600px) {
    .dish-stack {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }

    .phone-actions-grid {
      justify-content: flex-start;
    }
  }
</style>
