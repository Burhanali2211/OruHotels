<script>
  import { cart, selectedDish, viewMode } from '../stores/cart.js';
  import { hapticLight } from '../utils/haptics.js';

  export let dish;

  $: basePrice = dish?.sizes ? dish.sizes.Regular : dish.price;

  // Cart matching across any size or option
  $: cartEntries = Object.values($cart).filter(entry => entry.dish.id === dish.id);
  $: currentQty = cartEntries.reduce((sum, e) => sum + e.quantity, 0);

  function openModal() {
    hapticLight();
    selectedDish.set(dish);
  }

  function handleCardKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openModal();
    }
  }
</script>

{#if $viewMode === 'compact'}
  <!-- Professional Compact List Mode -->
  <div
    class="dish-card-compact"
    on:click={openModal}
    on:keydown={handleCardKeyDown}
    role="button"
    tabindex="0"
    aria-label="View details for {dish.name}"
  >
    <div class="compact-left">
      <span class="diet-dot-badge {dish.diet}">
        <span class="dot-circle"></span>
      </span>
      <div class="compact-titles">
        <h4 class="compact-name">{dish.name}</h4>
        {#if dish.popular}
          <span class="compact-bestseller">Bestseller</span>
        {/if}
      </div>
    </div>

    <div class="compact-right">
      <span class="compact-price">
        <span class="currency">₹</span>{basePrice}
      </span>
      {#if currentQty > 0}
        <span class="compact-qty-pill">{currentQty}</span>
      {/if}
    </div>
  </div>

{:else}
  <!-- Unified Professional Card (Pizzas, Trout Fish, Beverages) -->
  <div
    class="dish-card"
    on:click={openModal}
    on:keydown={handleCardKeyDown}
    role="button"
    tabindex="0"
    aria-label="{dish.name}"
  >
    <!-- Left Details -->
    <div class="card-info">
      <div class="card-meta">
        <span class="diet-dot-badge {dish.diet}">
          <span class="dot-circle"></span>
        </span>
        {#if dish.popular}
          <span class="bestseller-label">Bestseller</span>
        {/if}
        {#if currentQty > 0}
          <span class="in-tray-label">{currentQty} in order</span>
        {/if}
      </div>

      <h3 class="dish-title">{dish.name}</h3>

      <div class="dish-price">
        <span class="currency">₹</span>{basePrice}
        {#if dish.sizes}
          <span class="price-onwards">onwards</span>
        {/if}
      </div>

      {#if dish.description}
        <p class="dish-desc">{dish.description}</p>
      {/if}
    </div>

    <!-- Right Media Column -->
    <div class="card-media-side">
      <div class="dish-thumb-box">
        <img
          src={dish.image}
          alt={dish.name}
          class="dish-thumb"
          loading="lazy"
        />
        {#if currentQty > 0}
          <span class="thumb-qty-badge">{currentQty}</span>
        {/if}
      </div>
    </div>
  </div>
{/if}

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
    transition: transform 0.16s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.16s ease;
    outline: none;
    position: relative;
    overflow: hidden;
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
    justify-content: center;
  }

  .card-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
    flex-wrap: wrap;
  }

  .bestseller-label {
    font-size: 0.68rem;
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
    line-height: 1.32;
    letter-spacing: -0.015em;
    word-break: break-word;
  }

  .dish-price {
    font-size: 1.05rem;
    font-weight: 800;
    color: var(--text-primary);
    letter-spacing: -0.02em;
    margin-bottom: 6px;
    display: flex;
    align-items: baseline;
    gap: 2px;
  }

  .dish-price .currency {
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--accent-gold);
  }

  .price-onwards {
    font-size: 0.72rem;
    font-weight: 600;
    color: var(--text-muted);
    margin-left: 3px;
    text-transform: lowercase;
  }

  .dish-desc {
    font-size: 0.8rem;
    color: var(--text-muted);
    line-height: 1.45;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* Right Media Column */
  .card-media-side {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .dish-thumb-box {
    width: 96px;
    height: 96px;
    border-radius: var(--radius-md);
    overflow: hidden;
    background: var(--ios-fill);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    flex-shrink: 0;
    position: relative;
  }

  .dish-thumb {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .dish-card:hover .dish-thumb {
    transform: scale(1.05);
  }

  .thumb-qty-badge {
    position: absolute;
    bottom: 6px;
    right: 6px;
    background: #121217;
    color: #FFFFFF;
    font-size: 0.72rem;
    font-weight: 800;
    min-width: 22px;
    height: 22px;
    border-radius: 9999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 5px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
    border: 1.5px solid #FFFFFF;
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
      width: 88px;
      height: 88px;
    }
  }

  @media (max-width: 375px) {
    .dish-card {
      padding: 12px 12px;
      gap: 10px;
    }

    .dish-thumb-box {
      width: 78px;
      height: 78px;
      border-radius: 12px;
    }

    .dish-title {
      font-size: 0.92rem;
    }

    .dish-price {
      font-size: 0.98rem;
    }
  }
</style>
