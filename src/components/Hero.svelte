<script>
  import { Search, X, Leaf, Beef, MapPin, Phone, Bike } from '@lucide/svelte';
  import { searchQuery, dietFilter } from '../stores/cart.js';
  import { trackSearch } from '../utils/analytics.js';
  import menuData from '../data/menu.json';

  const { restaurant } = menuData;

  let searchTimeout;
  $: if ($searchQuery && $searchQuery.trim().length >= 3) {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      trackSearch($searchQuery);
    }, 1200);
  }
</script>

<div class="ios-controls-section">
  <!-- Minimalist Restaurant Info Bar -->
  <div class="restaurant-banner-meta">
    <div class="meta-location">
      <MapPin size={13} class="icon-loc" />
      <span>{restaurant.location}</span>
    </div>
    <div class="meta-actions">
      <a href="tel:{restaurant.phone}" class="meta-call-chip" title="Call for orders and enquiries">
        <Phone size={12} />
        <span>{restaurant.phone}</span>
      </a>
      <span class="meta-delivery-chip">
        <Bike size={12} />
        <span>Free Delivery</span>
      </span>
    </div>
  </div>

  <!-- Apple Spotlight Style Search -->
  <div class="spotlight-search">
    <Search size={16} class="search-icon" />
    <input
      type="search"
      placeholder="Search pizza, biryani, momos..."
      bind:value={$searchQuery}
      class="search-input"
      aria-label="Search menu"
    />
    {#if $searchQuery}
      <button type="button" class="btn-clear" on:click={() => $searchQuery = ''} aria-label="Clear">
        <X size={14} />
      </button>
    {/if}
  </div>

  <!-- iOS Native Segmented Control -->
  <div class="ios-segmented-control" role="tablist">
    <button
      type="button"
      class="segment-item {$dietFilter === 'all' ? 'active' : ''}"
      on:click={() => $dietFilter = 'all'}
      role="tab"
      aria-selected={$dietFilter === 'all'}
    >
      All Items
    </button>
    <button
      type="button"
      class="segment-item {$dietFilter === 'veg' ? 'active' : ''}"
      on:click={() => $dietFilter = 'veg'}
      role="tab"
      aria-selected={$dietFilter === 'veg'}
    >
      <Leaf size={14} class="icon-veg" />
      <span>Pure Veg</span>
    </button>
    <button
      type="button"
      class="segment-item {$dietFilter === 'nonveg' ? 'active' : ''}"
      on:click={() => $dietFilter = 'nonveg'}
      role="tab"
      aria-selected={$dietFilter === 'nonveg'}
    >
      <Beef size={14} class="icon-nonveg" />
      <span>Non-Veg</span>
    </button>
  </div>
</div>

<style>
  .ios-controls-section {
    padding: 14px 16px 8px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  /* Restaurant Quick Meta */
  .restaurant-banner-meta {
    background: #FFFFFF;
    border: 0.5px solid var(--ios-separator);
    border-radius: var(--radius-md);
    padding: 10px 14px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
  }

  .meta-location {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 0.76rem;
    font-weight: 600;
    color: var(--text-secondary);
  }

  :global(.icon-loc) {
    color: var(--accent-red);
    flex-shrink: 0;
  }

  .meta-actions {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .meta-call-chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: #000000;
    color: #FFFFFF;
    border-radius: var(--radius-pill);
    padding: 3px 9px;
    font-size: 0.72rem;
    font-weight: 700;
    text-decoration: none;
    transition: opacity 0.15s ease;
  }

  .meta-call-chip:hover {
    opacity: 0.85;
  }

  .meta-delivery-chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: rgba(52, 199, 89, 0.12);
    color: #248A3D;
    border-radius: var(--radius-pill);
    padding: 3px 9px;
    font-size: 0.72rem;
    font-weight: 700;
  }

  /* Spotlight Search */
  .spotlight-search {
    display: flex;
    align-items: center;
    background: #E5E5EA;
    border-radius: var(--radius-pill);
    padding: 0 14px;
    height: 42px;
    transition: background 0.15s ease, box-shadow 0.15s ease;
  }

  .spotlight-search:focus-within {
    background: #FFFFFF;
    box-shadow: 0 0 0 2px #000000;
  }

  :global(.search-icon) {
    color: var(--text-muted);
    flex-shrink: 0;
    margin-right: 8px;
  }

  .search-input {
    width: 100%;
    border: none;
    background: transparent;
    font-family: var(--font-system);
    font-size: 0.92rem;
    color: var(--text-primary);
    outline: none;
  }

  .search-input::placeholder {
    color: var(--text-muted);
  }

  .btn-clear {
    background: var(--text-muted);
    color: #FFFFFF;
    border: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  /* Native iOS Segmented Control */
  .ios-segmented-control {
    display: flex;
    background: #E5E5EA;
    border-radius: var(--radius-pill);
    padding: 3px;
  }

  .segment-item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    background: transparent;
    border: none;
    border-radius: var(--radius-pill);
    padding: 7px 0;
    font-family: var(--font-system);
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .segment-item:active {
    transform: scale(0.96);
  }

  .segment-item.active {
    background: #FFFFFF;
    color: var(--text-primary);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.14), 0 1px 1px rgba(0, 0, 0, 0.06);
  }
</style>
