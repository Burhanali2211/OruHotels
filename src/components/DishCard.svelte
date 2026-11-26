<script>
  import { Leaf, Beef } from '@lucide/svelte';
  import { selectedDish } from '../stores/cart.js';
  import { trackDishClick } from '../utils/analytics.js';

  export let dish;

  function openModal() {
    trackDishClick(dish);
    selectedDish.set(dish);
  }

  function handleCardKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openModal();
    }
  }
</script>

<div
  class="ios-dish-card"
  on:click={openModal}
  on:keydown={handleCardKeyDown}
  role="button"
  tabindex="0"
  aria-label="View details for {dish.name}"
>
  <!-- Left: Dish Information -->
  <div class="card-info">
    <div class="card-top-meta">
      {#if dish.diet === 'veg'}
        <span class="diet-badge diet-veg" title="Vegetarian">
          <Leaf size={12} class="icon-veg" />
          <span class="diet-label">VEG</span>
        </span>
      {:else if dish.diet === 'nonveg'}
        <span class="diet-badge diet-nonveg" title="Non-Vegetarian">
          <Beef size={12} class="icon-nonveg" />
          <span class="diet-label">NON-VEG</span>
        </span>
      {/if}
      {#if dish.popular}
        <span class="badge-pop">Must Try</span>
      {/if}
    </div>

    <h3 class="dish-title">{dish.name}</h3>

    <p class="dish-desc">{dish.description}</p>

    <!-- Pricing / Portion Variants -->
    <div class="pricing-area">
      {#if dish.variants && dish.variants.length > 0}
        <div class="variant-chips-row">
          {#each dish.variants as v}
            <span class="v-pill">
              <span class="v-label">{v.shortLabel || v.label}</span>
              <span class="v-price">₹{v.price}</span>
            </span>
          {/each}
        </div>
      {:else}
        <div class="price-tag">₹{dish.price}</div>
      {/if}
    </div>
  </div>

  <!-- Right: Photo -->
  <div class="dish-thumb-box">
    <img
      src={dish.image}
      alt={dish.name}
      class="dish-thumb"
      loading="lazy"
    />
  </div>
</div>

<style>
  /* ==========================================================================
     Professional Standard Restaurant Card
     Clean, Focused, Editorial Presentation
     ========================================================================== */
  .dish-card {
    background: #FFFFFF;
    border-radius: var(--radius-lg);
    padding: 16px 16px 16px 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    border: 1px solid var(--ios-separator);
    box-shadow: var(--shadow-sm);
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
    outline: none;
    min-height: 110px;
  }

  .ios-dish-card:hover {
    border-color: rgba(0, 0, 0, 0.18);
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.07);
  }

  .dish-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-card-hover);
  }

  .dish-card:active {
    transform: scale(0.99);
  }

  .card-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .card-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
    flex-wrap: wrap;
  }

  .diet-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.64rem;
    font-weight: 700;
    letter-spacing: 0.02em;
  }

  .diet-veg {
    background: rgba(52, 199, 89, 0.12);
    color: #248A3D;
  }

  .diet-nonveg {
    background: rgba(255, 59, 48, 0.12);
    color: #D70015;
  }

  .badge-pop {
    background: #F2F2F7;
    color: var(--text-secondary);
    font-size: 0.66rem;
    font-weight: 700;
    color: #B45309;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .in-tray-label {
    font-size: 0.68rem;
    font-weight: 700;
    color: var(--accent-emerald);
    background: var(--accent-emerald-bg);
    padding: 1px 7px;
    border-radius: var(--radius-pill);
    letter-spacing: 0.02em;
  }

  .dish-title {
    font-family: var(--font-sans);
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0 0 4px;
    line-height: 1.3;
  }

  .dish-desc {
    font-size: 0.8rem;
    color: var(--text-muted);
    line-height: 1.38;
    margin: 0 0 8px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .pricing-area {
    margin-top: 2px;
  }

  .variant-chips-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 5px;
  }

  .v-pill {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: #F2F2F7;
    border: 0.5px solid rgba(0, 0, 0, 0.05);
    border-radius: var(--radius-pill);
    padding: 3px 8px;
    font-size: 0.72rem;
    line-height: 1.2;
    white-space: nowrap;
  }

  .v-label {
    font-weight: 600;
    color: var(--text-muted);
    font-size: 0.68rem;
  }

  .v-price {
    font-weight: 800;
    color: var(--text-primary);
  }

  .price-tag {
    font-size: 1rem;
    font-weight: 800;
    color: var(--text-primary);
    letter-spacing: -0.01em;
  }

  .dish-thumb-box {
    width: 90px;
    height: 90px;
    border-radius: 12px;
    overflow: hidden;
    background: var(--ios-fill);
    border: 0.5px solid var(--ios-separator);
    flex-shrink: 0;
  }

  .dish-thumb {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.25s ease;
  }

  .ios-dish-card:hover .dish-thumb {
    transform: scale(1.04);
  }

  /* Compact View */
  .dish-card-compact {
    background: #FFFFFF;
    border-radius: var(--radius-md);
    padding: 12px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    border: 1px solid var(--ios-separator);
    box-shadow: var(--shadow-sm);
    cursor: pointer;
    transition: background 0.15s ease, transform 0.15s ease;
  }

  .dish-card-compact:hover {
    background: var(--ios-card-subtle);
  }

  .dish-card-compact:active {
    transform: scale(0.99);
  }

  .compact-left {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
  }

  .compact-titles {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .compact-name {
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .compact-bestseller {
    font-size: 0.65rem;
    font-weight: 700;
    color: #B45309;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .compact-right {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  .compact-price {
    font-size: 0.92rem;
    font-weight: 800;
    color: var(--text-primary);
  }

  .compact-price .currency {
    font-size: 0.8rem;
    font-weight: 700;
    color: var(--accent-gold);
  }

  .compact-qty-pill {
    background: #121217;
    color: #FFFFFF;
    font-size: 0.7rem;
    font-weight: 800;
    min-width: 20px;
    height: 20px;
    border-radius: 9999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 4px;
  }

  /* Responsive Media Queries */
  @media (max-width: 480px) {
    .dish-card {
      padding: 14px 14px;
      gap: 12px;
    }

    .dish-title {
      font-size: 0.98rem;
    }

    .dish-desc {
      font-size: 0.76rem;
    }

    .dish-thumb-box {
      width: 96px;
      height: 96px;
    }
  }
</style>
