<script>
  import { Plus, Minus, Leaf, Beef } from '@lucide/svelte';
  import { cart, addToCart, updateQuantity, selectedDish, APP_CONFIG } from '../stores/cart.js';
  import { hapticLight } from '../utils/haptics.js';

  export let dish;

  $: cartEntries = Object.values($cart).filter(entry => entry.dish.id === dish.id);
  $: currentQty = cartEntries.reduce((sum, e) => sum + e.quantity, 0);

  function handleAdd(e) {
    e.stopPropagation();
    hapticLight();
    addToCart(dish, 1, dish.spiceLevels?.[0] || '', []);
  }

  function handleDecrease(e) {
    e.stopPropagation();
    hapticLight();
    const entry = cartEntries[0];
    if (entry) {
      updateQuantity(entry.key, -1);
    }
  }

  function handleIncrease(e) {
    e.stopPropagation();
    hapticLight();
    const entry = cartEntries[0];
    if (entry) {
      updateQuantity(entry.key, 1);
    } else {
      addToCart(dish, 1, dish.spiceLevels?.[0] || '', []);
    }
  }

  function openModal() {
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
        <Leaf size={14} class="icon-veg" />
      {:else if dish.diet === 'nonveg'}
        <Beef size={14} class="icon-nonveg" />
      {/if}
      {#if dish.popular}
        <span class="badge-pop">Must Try</span>
      {/if}
    </div>

    <h3 class="dish-title">{dish.name}</h3>

    <p class="dish-desc">{dish.description}</p>

    <div class="price-tag">₹{dish.price}</div>
  </div>

  <!-- Right: Photo & Stepper Action -->
  <div class="card-action-side">
    <div class="dish-thumb-box">
      <img
        src={dish.image}
        alt={dish.name}
        class="dish-thumb"
        loading="lazy"
      />
    </div>

    <div class="card-button-slot">
      {#if APP_CONFIG.isOrderingEnabled}
        {#if currentQty > 0}
          <div class="ios-stepper" role="group" aria-label="Quantity stepper">
            <button type="button" on:click={handleDecrease} aria-label="Decrease">
              <Minus size={12} strokeWidth={2.5} />
            </button>
            <span>{currentQty}</span>
            <button type="button" on:click={handleIncrease} aria-label="Increase">
              <Plus size={12} strokeWidth={2.5} />
            </button>
          </div>
        {:else}
          <button type="button" class="btn-ios-add" on:click={handleAdd}>
            <Plus size={13} strokeWidth={2.5} />
            <span>ADD</span>
          </button>
        {/if}
      {/if}
    </div>
  </div>
</div>

<style>
  .ios-dish-card {
    background: #FFFFFF;
    border-radius: var(--radius-md);
    padding: 14px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    box-shadow: var(--shadow-card);
    border: 0.5px solid var(--ios-separator);
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    outline: none;
  }

  .ios-dish-card:focus-visible {
    border-color: #000000;
  }

  .ios-dish-card:active {
    transform: scale(0.99);
  }

  .card-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  .card-top-meta {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 4px;
  }

  .badge-pop {
    background: #F2F2F7;
    color: var(--text-secondary);
    font-size: 0.68rem;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: 4px;
  }

  .dish-title {
    font-size: 0.98rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0 0 3px;
    line-height: 1.3;
  }

  .dish-desc {
    font-size: 0.8rem;
    color: var(--text-muted);
    line-height: 1.4;
    margin: 0 0 8px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .price-tag {
    font-size: 0.95rem;
    font-weight: 800;
    color: var(--text-primary);
    letter-spacing: -0.01em;
  }

  /* Right Side Photo & Button */
  .card-action-side {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
  }

  .dish-thumb-box {
    width: 84px;
    height: 84px;
    border-radius: 12px;
    overflow: hidden;
    background: var(--ios-fill);
    border: 0.5px solid var(--ios-separator);
  }

  .dish-thumb {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .card-button-slot {
    min-height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media (min-width: 600px) {
    .dish-thumb-box {
      width: 92px;
      height: 92px;
    }
  }
</style>
