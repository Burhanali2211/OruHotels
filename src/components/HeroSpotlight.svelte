<script>
  import { cart, addToCart, updateQuantity, selectedDish, APP_CONFIG } from '../stores/cart.js';
  import { hapticLight } from '../utils/haptics.js';

  export let dishes = [];

  // Filter only popular / chef recommended items from New Diamond Cafe
  $: spotlightDishes = dishes.filter(d => d.popular).slice(0, 5);

  function getQty(dishId) {
    const entries = Object.values($cart).filter(entry => entry.dish.id === dishId);
    return entries.reduce((sum, e) => sum + e.quantity, 0);
  }

  function handleAdd(dish, e) {
    e.stopPropagation();
    hapticLight();
    const defaultSize = dish.sizes ? 'Regular' : null;
    const defaultOpt = dish.options && dish.options.length > 0 ? dish.options[0] : '';
    addToCart(dish, 1, defaultSize, defaultOpt);
  }

  function handleDecrease(dish, e) {
    e.stopPropagation();
    hapticLight();
    const entries = Object.values($cart).filter(entry => entry.dish.id === dish.id);
    if (entries[0]) {
      updateQuantity(entries[0].key, -1);
    }
  }

  function handleIncrease(dish, e) {
    e.stopPropagation();
    hapticLight();
    const entries = Object.values($cart).filter(entry => entry.dish.id === dish.id);
    if (entries[0]) {
      updateQuantity(entries[0].key, 1);
    } else {
      const defaultSize = dish.sizes ? 'Regular' : null;
      const defaultOpt = dish.options && dish.options.length > 0 ? dish.options[0] : '';
      addToCart(dish, 1, defaultSize, defaultOpt);
    }
  }

  function openDish(dish) {
    selectedDish.set(dish);
  }
</script>

{#if spotlightDishes.length > 0}
  <section class="spotlight-section" aria-label="Chef's Highlights">
    <div class="spotlight-header">
      <div class="header-left">
        <div class="eyebrow-pill">
          <i class="lni lni-chef-hat icon-sparkle" aria-hidden="true"></i>
          <span>New Diamond Cafe Specials</span>
        </div>
        <h2 class="spotlight-title">House Favorites &amp; Bestsellers</h2>
      </div>
      <span class="spotlight-hint">
        Swipe <i class="lni lni-arrow-right" aria-hidden="true"></i>
      </span>
    </div>

    <!-- Horizontal Swipe Scroller -->
    <div class="spotlight-scroller no-scrollbar">
      {#each spotlightDishes as dish (dish.id)}
        {@const qty = getQty(dish.id)}
        {@const displayPrice = dish.sizes ? dish.sizes.Regular : dish.price}
        <div
          class="spotlight-card"
          on:click={() => openDish(dish)}
          on:keydown={(e) => { if (e.key === 'Enter') openDish(dish); }}
          role="button"
          tabindex="0"
          aria-label="{dish.name}"
        >
          <!-- Card Image & Floating Badges -->
          <div class="card-media">
            <img src={dish.image} alt={dish.name} class="media-img" loading="lazy" />
            <div class="media-gradient"></div>

            <div class="media-top-tags">
              <span class="tag-pill tag-popular">
                <i class="lni lni-tag" aria-hidden="true"></i>
                <span>{dish.tag || 'Must Try'}</span>
              </span>

              {#if dish.rating}
                <span class="tag-pill tag-rating">
                  <i class="lni lni-star-fill icon-star" aria-hidden="true"></i>
                  <span>{dish.rating}</span>
                </span>
              {/if}
            </div>

            <div class="media-bottom-meta">
              <span class="diet-dot-badge {dish.diet}">
                <span class="dot-circle"></span>
              </span>
              {#if dish.prepTime}
                <span class="prep-pill">
                  <i class="lni lni-timer" aria-hidden="true"></i>
                  <span>{dish.prepTime}</span>
                </span>
              {/if}
            </div>
          </div>

          <!-- Card Content -->
          <div class="card-details">
            <h3 class="dish-name">{dish.name}</h3>
            <p class="dish-snippet">{dish.description}</p>

            <div class="card-footer">
              <div class="price-box">
                <span class="price-symbol">₹</span>
                <span class="price-val">{displayPrice}</span>
                {#if dish.sizes}
                  <span class="size-hint">(Reg)</span>
                {/if}
              </div>

              {#if APP_CONFIG.isOrderingEnabled}
                <div class="action-slot" on:click|stopPropagation role="none">
                  {#if qty > 0}
                    <div class="ios-stepper" role="group">
                      <button type="button" on:click={(e) => handleDecrease(dish, e)} aria-label="Decrease">
                        <i class="lni lni-minus" aria-hidden="true"></i>
                      </button>
                      <span>{qty}</span>
                      <button type="button" on:click={(e) => handleIncrease(dish, e)} aria-label="Increase">
                        <i class="lni lni-plus" aria-hidden="true"></i>
                      </button>
                    </div>
                  {:else}
                    <button type="button" class="btn-ios-add" on:click={(e) => handleAdd(dish, e)}>
                      <i class="lni lni-plus" aria-hidden="true"></i>
                      <span>ADD</span>
                    </button>
                  {/if}
                </div>
              {/if}
            </div>
          </div>
        </div>
      {/each}
    </div>
  </section>
{/if}

<style>
  .spotlight-section {
    padding: 16px 0 10px;
    background: transparent;
  }

  .spotlight-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    padding: 0 16px 12px;
  }

  .eyebrow-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: var(--accent-gold-light);
    color: var(--accent-gold);
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    padding: 3px 9px;
    border-radius: var(--radius-pill);
    margin-bottom: 4px;
  }

  .icon-sparkle {
    font-size: 0.85rem;
    color: var(--accent-gold);
  }

  .spotlight-title {
    font-family: var(--font-sans);
    font-size: 1.25rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--text-primary);
    margin: 0;
  }

  .spotlight-hint {
    font-size: 0.72rem;
    font-weight: 600;
    color: var(--text-muted);
    letter-spacing: 0.01em;
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .spotlight-scroller {
    display: flex;
    gap: 14px;
    overflow-x: auto;
    padding: 2px 16px 16px;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
  }

  .spotlight-card {
    flex: 0 0 250px;
    scroll-snap-align: start;
    background: #FFFFFF;
    border-radius: var(--radius-lg);
    border: 1px solid var(--ios-separator);
    box-shadow: var(--shadow-card);
    overflow: hidden;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease;
    outline: none;
  }

  .spotlight-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-card-hover);
  }

  .spotlight-card:active {
    transform: scale(0.98);
  }

  .card-media {
    position: relative;
    width: 100%;
    height: 140px;
    background: var(--ios-fill);
    overflow: hidden;
  }

  .media-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
  }

  .spotlight-card:hover .media-img {
    transform: scale(1.05);
  }

  .media-gradient {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.6) 100%);
    pointer-events: none;
  }

  .media-top-tags {
    position: absolute;
    top: 8px;
    left: 8px;
    right: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 2;
  }

  .tag-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    border-radius: var(--radius-pill);
    padding: 3px 8px;
    font-size: 0.68rem;
    font-weight: 700;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    white-space: nowrap !important;
    flex-shrink: 0 !important;
  }

  .tag-popular {
    background: rgba(234, 88, 12, 0.9);
    color: #FFFFFF;
    box-shadow: 0 2px 6px rgba(234, 88, 12, 0.3);
  }

  .tag-rating {
    background: rgba(18, 18, 23, 0.78);
    color: #FFFFFF;
    border: 0.5px solid rgba(255, 255, 255, 0.2);
  }

  .media-bottom-meta {
    position: absolute;
    bottom: 8px;
    left: 8px;
    display: flex;
    align-items: center;
    gap: 6px;
    z-index: 2;
  }

  .prep-pill {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: rgba(0, 0, 0, 0.65);
    color: #FFFFFF;
    font-size: 0.64rem;
    font-weight: 600;
    padding: 2px 7px;
    border-radius: var(--radius-pill);
    backdrop-filter: blur(6px);
    white-space: nowrap !important;
    flex-shrink: 0 !important;
    font-variant-numeric: tabular-nums;
  }

  .card-details {
    padding: 12px 14px 14px;
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .dish-name {
    font-size: 0.96rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0 0 4px;
    line-height: 1.3;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .dish-snippet {
    font-size: 0.78rem;
    color: var(--text-muted);
    line-height: 1.38;
    margin: 0 0 10px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    flex: 1;
  }

  .card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 6px;
    border-top: 1px solid var(--ios-separator-light);
  }

  .price-box {
    display: inline-flex;
    align-items: baseline;
    gap: 2px;
    color: var(--text-primary);
    white-space: nowrap !important;
    flex-shrink: 0 !important;
  }

  .price-symbol {
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--accent-gold);
  }

  .price-val {
    font-size: 1.1rem;
    font-weight: 800;
    letter-spacing: -0.02em;
  }

  .size-hint {
    font-size: 0.68rem;
    color: var(--text-muted);
    font-weight: 600;
  }

  .action-slot {
    flex-shrink: 0 !important;
  }

  @media (max-width: 380px) {
    .spotlight-card {
      flex: 0 0 220px;
    }

    .card-media {
      height: 125px;
    }

    .spotlight-title {
      font-size: 1.1rem;
    }

    .eyebrow-pill {
      font-size: 0.66rem;
      padding: 2px 7px;
    }
  }

  @media (min-width: 600px) {
    .spotlight-card {
      flex: 0 0 270px;
    }
  }
</style>
