<script>
  import { cart, addToCart, updateQuantity, selectedDish, APP_CONFIG } from '../stores/cart.js';
  import { hapticLight } from '../utils/haptics.js';

  export let dishes = [];

  $: spotlightDishes = dishes.filter(d => d.popular).slice(0, 5);

  function getQty(dishId) {
    const entries = Object.values($cart).filter(entry => entry.dish.id === dishId);
    return entries.reduce((sum, e) => sum + e.quantity, 0);
  }

  function openDish(dish) {
    selectedDish.set(dish);
  }

  function handleAdd(dish, e) {
    e.stopPropagation();
    hapticLight();
    if (dish.sizes || (dish.options && dish.options.length > 0)) {
      openDish(dish);
    } else {
      addToCart(dish, 1, null, '');
    }
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
    if (dish.sizes || (dish.options && dish.options.length > 0)) {
      openDish(dish);
    } else {
      addToCart(dish, 1, null, '');
    }
  }
</script>

{#if spotlightDishes.length > 0}
  <section class="spotlight-section" aria-label="House Highlights">
    <div class="spotlight-header">
      <div>
        <span class="spotlight-eyebrow">House Highlights</span>
        <h2 class="spotlight-title">Customer Favorites</h2>
      </div>
      <span class="spotlight-hint">
        Scroll <i class="lni lni-arrow-right" aria-hidden="true"></i>
      </span>
    </div>

    <!-- Horizontal Carousel -->
    <div class="spotlight-scroller no-scrollbar">
      {#each spotlightDishes as dish (dish.id)}
        {@const qty = getQty(dish.id)}
        {@const displayPrice = dish.sizes ? dish.sizes.Regular : dish.price}
        {@const hasCustom = !!(dish.sizes || (dish.options && dish.options.length > 0))}

        <div
          class="spotlight-card"
          on:click={() => openDish(dish)}
          on:keydown={(e) => { if (e.key === 'Enter') openDish(dish); }}
          role="button"
          tabindex="0"
          aria-label="{dish.name}"
        >
          <!-- Clean Dish Photo -->
          <div class="card-media">
            <img src={dish.image} alt={dish.name} class="media-img" loading="lazy" />
          </div>

          <!-- Card Content -->
          <div class="card-details">
            <div class="dish-meta-line">
              <span class="diet-dot-badge {dish.diet}">
                <span class="dot-circle"></span>
              </span>
              <h3 class="dish-name">{dish.name}</h3>
            </div>

            <p class="dish-snippet">{dish.description}</p>

            <div class="card-footer">
              <div class="price-val">₹{displayPrice}</div>

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

                  {#if hasCustom}
                    <span class="custom-note">customisable</span>
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

  .spotlight-eyebrow {
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--accent-gold);
    display: block;
    margin-bottom: 2px;
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
    flex: 0 0 240px;
    scroll-snap-align: start;
    background: #FFFFFF;
    border-radius: var(--radius-lg);
    border: 1px solid var(--ios-separator);
    box-shadow: var(--shadow-sm);
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
    height: 135px;
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

  .card-details {
    padding: 12px 14px 14px;
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .dish-meta-line {
    display: flex;
    align-items: center;
    gap: 7px;
    margin-bottom: 4px;
  }

  .dish-name {
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0;
    line-height: 1.3;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .dish-snippet {
    font-size: 0.78rem;
    color: var(--text-muted);
    line-height: 1.4;
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

  .price-val {
    font-size: 1.05rem;
    font-weight: 800;
    color: var(--text-primary);
    letter-spacing: -0.02em;
  }

  .action-slot {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    flex-shrink: 0;
  }

  .custom-note {
    font-size: 0.6rem;
    color: var(--text-muted);
    font-weight: 600;
    text-transform: lowercase;
  }

  @media (max-width: 380px) {
    .spotlight-card {
      flex: 0 0 215px;
    }

    .card-media {
      height: 120px;
    }

    .spotlight-title {
      font-size: 1.1rem;
    }
  }

  @media (min-width: 600px) {
    .spotlight-card {
      flex: 0 0 260px;
    }
  }
</style>
