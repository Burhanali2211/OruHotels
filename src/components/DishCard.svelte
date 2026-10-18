<script>
  import { cart, addToCart, updateQuantity, selectedDish, APP_CONFIG, viewMode } from '../stores/cart.js';
  import { hapticLight } from '../utils/haptics.js';

  export let dish;
  export let category = dish?.category || 'nonveg-pizza';

  let selectedSize = dish?.sizes ? 'Regular' : null;
  let selectedOption = dish?.options && dish.options.length > 0 ? dish.options[0] : '';

  $: activePrice = dish?.sizes ? (dish.sizes[selectedSize] || dish.price) : dish.price;

  // Cart key match
  $: cartKey = `${dish.id}__${selectedSize || 'Standard'}${selectedOption ? '__' + selectedOption : ''}`;
  $: currentQty = $cart[cartKey]?.quantity || 0;

  function handleAdd(e) {
    e.stopPropagation();
    hapticLight();
    addToCart(dish, 1, selectedSize, selectedOption);
  }

  function handleDecrease(e) {
    e.stopPropagation();
    hapticLight();
    if (currentQty > 0) {
      updateQuantity(cartKey, -1);
    }
  }

  function handleIncrease(e) {
    e.stopPropagation();
    hapticLight();
    addToCart(dish, 1, selectedSize, selectedOption);
  }

  function selectSize(sName, e) {
    e.stopPropagation();
    hapticLight();
    selectedSize = sName;
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

{#if $viewMode === 'compact'}
  <!-- Compact Scanning Layout -->
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
        <span class="compact-price">
          {#if dish.sizes}
            R: ₹{dish.sizes.Regular} • M: ₹{dish.sizes.Medium} • L: ₹{dish.sizes.Large}
          {:else}
            ₹{dish.price}
          {/if}
        </span>
      </div>
    </div>

    <div class="compact-right" on:click|stopPropagation role="none">
      {#if APP_CONFIG.isOrderingEnabled}
        {#if currentQty > 0}
          <div class="ios-stepper" role="group">
            <button type="button" on:click={handleDecrease} aria-label="Decrease">
              <i class="lni lni-minus" aria-hidden="true"></i>
            </button>
            <span>{currentQty}</span>
            <button type="button" on:click={handleIncrease} aria-label="Increase">
              <i class="lni lni-plus" aria-hidden="true"></i>
            </button>
          </div>
        {:else}
          <button type="button" class="btn-ios-add btn-ios-add-compact" on:click={handleAdd}>
            <i class="lni lni-plus" aria-hidden="true"></i>
            <span>ADD</span>
          </button>
        {/if}
      {/if}
    </div>
  </div>

{:else if category === 'fish-special'}
  <!-- Fish Special Deluxe Card Layout -->
  <div
    class="dish-card-fish"
    on:click={openModal}
    on:keydown={handleCardKeyDown}
    role="button"
    tabindex="0"
    aria-label="View details for {dish.name}"
  >
    <div class="fish-media-container">
      <img src={dish.image} alt={dish.name} class="fish-img" loading="lazy" />
      <div class="fish-overlay"></div>
      <div class="fish-badges-top">
        <span class="tag-pill tag-popular">
          <i class="lni lni-tag" aria-hidden="true"></i>
          <span>{dish.tag || 'Fresh Catch'}</span>
        </span>
        <span class="rating-pill">
          <i class="lni lni-star-fill icon-star" aria-hidden="true"></i>
          <span>{dish.rating}</span>
        </span>
      </div>
    </div>

    <div class="fish-content">
      <div class="fish-header-row">
        <div class="fish-title-group">
          <span class="diet-dot-badge {dish.diet}">
            <span class="dot-circle"></span>
          </span>
          <h3 class="fish-title">{dish.name}</h3>
        </div>
        <div class="fish-price">₹{dish.price}</div>
      </div>

      <p class="fish-desc">{dish.description}</p>

      <div class="fish-action-bar">
        <!-- Preparation Selector -->
        {#if dish.options}
          <div class="prep-chips-group">
            {#each dish.options as opt}
              <button
                type="button"
                class="chip-opt {selectedOption === opt ? 'active' : ''}"
                on:click={(e) => { e.stopPropagation(); selectedOption = opt; }}
              >
                {opt}
              </button>
            {/each}
          </div>
        {/if}

        {#if APP_CONFIG.isOrderingEnabled}
          <div class="card-btn-slot" on:click|stopPropagation role="none">
            {#if currentQty > 0}
              <div class="ios-stepper" role="group">
                <button type="button" on:click={handleDecrease} aria-label="Decrease">
                  <i class="lni lni-minus" aria-hidden="true"></i>
                </button>
                <span>{currentQty}</span>
                <button type="button" on:click={handleIncrease} aria-label="Increase">
                  <i class="lni lni-plus" aria-hidden="true"></i>
                </button>
              </div>
            {:else}
              <button type="button" class="btn-ios-add" on:click={handleAdd}>
                <i class="lni lni-plus" aria-hidden="true"></i>
                <span>ADD</span>
              </button>
            {/if}
          </div>
        {/if}
      </div>
    </div>
  </div>

{:else if category === 'beverages'}
  <!-- Beverages & Coolers Card -->
  <div
    class="dish-card-beverage"
    on:click={openModal}
    on:keydown={handleCardKeyDown}
    role="button"
    tabindex="0"
    aria-label="View details for {dish.name}"
  >
    <div class="bev-media">
      <img src={dish.image} alt={dish.name} class="bev-img" loading="lazy" />
      <div class="bev-frost-badge">
        <i class="lni lni-drop" aria-hidden="true"></i>
        <span>Chilled</span>
      </div>
    </div>

    <div class="bev-content">
      <div class="bev-top">
        <span class="diet-dot-badge {dish.diet}">
          <span class="dot-circle"></span>
        </span>
        <h3 class="bev-title">{dish.name}</h3>
      </div>

      <p class="bev-desc">{dish.description}</p>

      <div class="bev-footer">
        <div class="bev-price">₹{dish.price}</div>

        {#if APP_CONFIG.isOrderingEnabled}
          <div class="card-btn-slot" on:click|stopPropagation role="none">
            {#if currentQty > 0}
              <div class="ios-stepper" role="group">
                <button type="button" on:click={handleDecrease} aria-label="Decrease">
                  <i class="lni lni-minus" aria-hidden="true"></i>
                </button>
                <span>{currentQty}</span>
                <button type="button" on:click={handleIncrease} aria-label="Increase">
                  <i class="lni lni-plus" aria-hidden="true"></i>
                </button>
              </div>
            {:else}
              <button type="button" class="btn-ios-add btn-ios-add-compact" on:click={handleAdd}>
                <i class="lni lni-plus" aria-hidden="true"></i>
                <span>ADD</span>
              </button>
            {/if}
          </div>
        {/if}
      </div>
    </div>
  </div>

{:else}
  <!-- Pizza Card (Non-Veg & Veg) with Size Controls -->
  <div
    class="dish-card-pizza"
    on:click={openModal}
    on:keydown={handleCardKeyDown}
    role="button"
    tabindex="0"
    aria-label="View details for {dish.name}"
  >
    <!-- Left Details -->
    <div class="card-info">
      <div class="card-top-meta">
        <span class="diet-dot-badge {dish.diet}">
          <span class="dot-circle"></span>
        </span>

        {#if dish.popular || dish.tag}
          <span class="badge-tag {dish.diet === 'veg' ? 'veg-tag' : ''}">
            <i class="lni lni-tag icon-tag" aria-hidden="true"></i>
            <span>{dish.tag || 'Must Try'}</span>
          </span>
        {/if}

        {#if dish.rating}
          <span class="star-rating">
            <i class="lni lni-star-fill icon-star" aria-hidden="true"></i>
            <span>{dish.rating}</span>
          </span>
        {/if}
      </div>

      <h3 class="dish-title">{dish.name}</h3>
      <p class="dish-desc">{dish.description}</p>

      <!-- Size Selector Chips (R, M, L) -->
      {#if dish.sizes}
        <div class="size-selector-row" on:click|stopPropagation role="none">
          <div class="size-pills no-scrollbar">
            {#each Object.entries(dish.sizes) as [sName, sPrice]}
              <button
                type="button"
                class="size-pill-btn {selectedSize === sName ? 'active' : ''}"
                on:click={(e) => selectSize(sName, e)}
                title="{sName}: ₹{sPrice}"
              >
                <span class="s-letter">{sName[0]}</span>
                <span class="s-price">₹{sPrice}</span>
              </button>
            {/each}
          </div>
        </div>
      {/if}

      <div class="card-bottom-row">
        <div class="price-pill">
          <span class="currency">₹</span>
          <span class="value">{activePrice}</span>
        </div>

        <div class="card-meta-cluster">
          {#if dish.prepTime}
            <span class="prep-pill-inline">
              <i class="lni lni-timer" aria-hidden="true"></i>
              <span>{dish.prepTime}</span>
            </span>
          {/if}

          {#if dish.spiciness && dish.spiciness > 0}
            <span class="spice-meter" title="{dish.spiciness} of 3 spicy">
              {#each Array(dish.spiciness) as _}
                <svg class="flame-svg" viewBox="0 0 24 24" width="11" height="11" fill="#EA580C" stroke="#EA580C">
                  <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
                </svg>
              {/each}
            </span>
          {/if}
        </div>
      </div>
    </div>

    <!-- Right Photo & Interactive Slot -->
    <div class="card-media-side">
      <div class="dish-thumb-box">
        <img
          src={dish.image}
          alt={dish.name}
          class="dish-thumb"
          loading="lazy"
        />
        <div class="thumb-tint"></div>
      </div>

      <div class="card-button-slot" on:click|stopPropagation role="none">
        {#if APP_CONFIG.isOrderingEnabled}
          {#if currentQty > 0}
            <div class="ios-stepper" role="group" aria-label="Quantity stepper">
              <button type="button" on:click={handleDecrease} aria-label="Decrease">
                <i class="lni lni-minus" aria-hidden="true"></i>
              </button>
              <span>{currentQty}</span>
              <button type="button" on:click={handleIncrease} aria-label="Increase">
                <i class="lni lni-plus" aria-hidden="true"></i>
              </button>
            </div>
          {:else}
            <button type="button" class="btn-ios-add" on:click={handleAdd}>
              <i class="lni lni-plus" aria-hidden="true"></i>
              <span>ADD</span>
            </button>
          {/if}
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  /* ==========================================================================
     1. Pizza Card Layout (Non-Veg & Veg)
     ========================================================================== */
  .dish-card-pizza {
    background: #FFFFFF;
    border-radius: var(--radius-lg);
    padding: 14px 14px 14px 16px;
    display: flex;
    align-items: stretch;
    justify-content: space-between;
    gap: 14px;
    box-shadow: var(--shadow-card);
    border: 1px solid var(--ios-separator);
    cursor: pointer;
    transition: transform 0.18s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.18s ease;
    outline: none;
    position: relative;
    overflow: hidden;
  }

  .dish-card-pizza:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-card-hover);
  }

  .dish-card-pizza:active {
    transform: scale(0.985);
  }

  .card-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .card-top-meta {
    display: flex;
    align-items: center;
    gap: 7px;
    margin-bottom: 6px;
    flex-wrap: wrap;
  }

  .badge-tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: #FEF3C7;
    color: #B45309;
    font-size: 0.68rem;
    font-weight: 700;
    padding: 2px 7px;
    border-radius: 6px;
  }

  .badge-tag.veg-tag {
    background: #DCFCE7;
    color: #15803D;
  }

  .icon-tag {
    color: #EA580C;
    font-size: 0.72rem;
  }

  .star-rating {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: var(--ios-fill-secondary);
    color: var(--text-primary);
    font-size: 0.68rem;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: 6px;
  }

  .dish-title {
    font-family: var(--font-sans);
    font-size: 1.02rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0 0 3px;
    line-height: 1.32;
    letter-spacing: -0.015em;
  }

  .dish-desc {
    font-size: 0.78rem;
    color: var(--text-muted);
    line-height: 1.4;
    margin: 0 0 8px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* Size Selector Pills */
  .size-selector-row {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    width: 100%;
    overflow: hidden;
  }

  .size-pills {
    display: inline-flex;
    gap: 3px;
    background: var(--ios-fill-secondary);
    padding: 2px;
    border-radius: var(--radius-pill);
    max-width: 100%;
    overflow-x: auto;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
  }

  .size-pills::-webkit-scrollbar {
    display: none;
  }

  .size-pill-btn {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    background: transparent;
    border: none;
    border-radius: var(--radius-pill);
    padding: 3px 7px;
    font-size: 0.7rem;
    font-weight: 700;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.15s ease;
    white-space: nowrap !important;
    flex-shrink: 0 !important;
  }

  .size-pill-btn.active {
    background: #121217;
    color: #FFFFFF;
    box-shadow: 0 1px 3px rgba(0,0,0,0.18);
  }

  .s-letter {
    font-weight: 800;
  }

  .s-price {
    font-size: 0.68rem;
    opacity: 0.9;
  }

  .card-bottom-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: auto;
    width: 100%;
  }

  .price-pill {
    display: inline-flex;
    align-items: baseline;
    gap: 1px;
    font-weight: 800;
    color: var(--text-primary);
    letter-spacing: -0.02em;
    white-space: nowrap !important;
    flex-shrink: 0 !important;
  }

  .price-pill .currency {
    font-size: 0.82rem;
    color: var(--accent-gold);
    font-weight: 700;
  }

  .price-pill .value {
    font-size: 1.15rem;
  }

  .card-meta-cluster {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    flex-shrink: 0 !important;
    white-space: nowrap !important;
  }

  .prep-pill-inline {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    font-size: 0.68rem;
    font-weight: 600;
    color: var(--text-muted);
    background: var(--ios-fill-secondary);
    padding: 2px 6px;
    border-radius: 4px;
    white-space: nowrap !important;
    flex-shrink: 0 !important;
    line-height: 1.2;
    font-variant-numeric: tabular-nums;
  }

  .spice-meter {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    white-space: nowrap !important;
    flex-shrink: 0 !important;
  }

  .flame-svg {
    display: inline-block;
    flex-shrink: 0;
  }

  .card-media-side {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;
    flex-shrink: 0;
    width: 92px;
    min-width: 92px;
  }

  .dish-thumb-box {
    width: 92px;
    height: 88px;
    border-radius: var(--radius-md);
    overflow: hidden;
    position: relative;
    background: var(--ios-fill);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    flex-shrink: 0;
  }

  .dish-thumb {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .dish-card-pizza:hover .dish-thumb {
    transform: scale(1.06);
  }

  .thumb-tint {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(0,0,0,0.2) 100%);
    pointer-events: none;
  }

  .card-button-slot {
    min-height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* ==========================================================================
     2. Fish Special Deluxe Card Layout
     ========================================================================== */
  .dish-card-fish {
    background: #FFFFFF;
    border-radius: var(--radius-lg);
    border: 1px solid #BAE6FD;
    box-shadow: 0 4px 18px rgba(2, 132, 199, 0.1);
    overflow: hidden;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    transition: transform 0.18s ease, box-shadow 0.18s ease;
  }

  .dish-card-fish:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 26px rgba(2, 132, 199, 0.18);
  }

  .fish-media-container {
    position: relative;
    width: 100%;
    height: 170px;
    background: #E0F2FE;
    overflow: hidden;
  }

  .fish-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .dish-card-fish:hover .fish-img {
    transform: scale(1.04);
  }

  .fish-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.6) 100%);
  }

  .fish-badges-top {
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 2;
  }

  .tag-popular {
    background: rgba(2, 132, 199, 0.9);
    color: #FFFFFF;
    font-size: 0.7rem;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: var(--radius-pill);
    display: inline-flex;
    align-items: center;
    gap: 4px;
    backdrop-filter: blur(8px);
  }

  .rating-pill {
    background: rgba(18, 18, 23, 0.8);
    color: #FFFFFF;
    font-size: 0.7rem;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: var(--radius-pill);
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .fish-content {
    padding: 14px 16px 16px;
    display: flex;
    flex-direction: column;
  }

  .fish-header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 6px;
  }

  .fish-title-group {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .fish-title {
    font-size: 1.12rem;
    font-weight: 800;
    color: var(--text-primary);
    margin: 0;
  }

  .fish-price {
    font-size: 1.2rem;
    font-weight: 800;
    color: #0284C7;
  }

  .fish-desc {
    font-size: 0.82rem;
    color: var(--text-secondary);
    line-height: 1.45;
    margin: 0 0 12px;
  }

  .fish-action-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 10px;
    border-top: 1px solid var(--ios-separator);
  }

  .prep-chips-group {
    display: flex;
    gap: 6px;
  }

  .chip-opt {
    background: var(--ios-fill-secondary);
    border: 1px solid var(--ios-separator);
    border-radius: var(--radius-pill);
    padding: 4px 12px;
    font-size: 0.76rem;
    font-weight: 700;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .chip-opt.active {
    background: #0284C7;
    border-color: #0284C7;
    color: #FFFFFF;
  }

  /* ==========================================================================
     3. Beverages Card
     ========================================================================== */
  .dish-card-beverage {
    background: #FFFFFF;
    border-radius: var(--radius-lg);
    border: 1px solid var(--ios-separator);
    box-shadow: var(--shadow-card);
    padding: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    cursor: pointer;
  }

  .bev-media {
    position: relative;
    width: 80px;
    height: 80px;
    border-radius: var(--radius-md);
    overflow: hidden;
    background: #EEF2FF;
    flex-shrink: 0;
  }

  .bev-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .bev-frost-badge {
    position: absolute;
    bottom: 4px;
    left: 4px;
    background: rgba(255, 255, 255, 0.9);
    font-size: 0.6rem;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: 4px;
    color: #4338CA;
    display: inline-flex;
    align-items: center;
    gap: 3px;
  }

  .bev-content {
    flex: 1;
    min-width: 0;
  }

  .bev-top {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 2px;
  }

  .bev-title {
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0;
  }

  .bev-desc {
    font-size: 0.74rem;
    color: var(--text-muted);
    line-height: 1.35;
    margin: 0 0 8px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .bev-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .bev-price {
    font-size: 1rem;
    font-weight: 800;
    color: #4338CA;
  }

  /* ==========================================================================
     4. Compact Scanning Layout
     ========================================================================== */
  .dish-card-compact {
    background: #FFFFFF;
    border-radius: var(--radius-md);
    padding: 10px 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    border: 1px solid var(--ios-separator);
    box-shadow: var(--shadow-sm);
    cursor: pointer;
    transition: background 0.15s ease;
  }

  .dish-card-compact:hover {
    background: var(--ios-card-subtle);
  }

  .compact-left {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
  }

  .compact-titles {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .compact-name {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .compact-price {
    font-size: 0.78rem;
    font-weight: 700;
    color: var(--text-secondary);
  }

  /* ==========================================================================
     5. Responsive Breakpoints
     ========================================================================== */
  @media (max-width: 480px) {
    .dish-card-pizza {
      padding: 12px 10px 12px 12px;
      gap: 10px;
    }

    .dish-title {
      font-size: 0.96rem;
    }

    .dish-desc {
      font-size: 0.74rem;
      margin-bottom: 6px;
    }

    .card-media-side {
      width: 86px;
      min-width: 86px;
      gap: 6px;
    }

    .dish-thumb-box {
      width: 86px;
      height: 80px;
    }

    .size-pill-btn {
      padding: 2.5px 6px;
      font-size: 0.68rem;
    }
  }

  @media (max-width: 375px) {
    .dish-card-pizza {
      padding: 10px 8px 10px 10px;
      gap: 8px;
    }

    .card-media-side {
      width: 76px;
      min-width: 76px;
      gap: 6px;
    }

    .dish-thumb-box {
      width: 76px;
      height: 72px;
      border-radius: 10px;
    }

    .dish-title {
      font-size: 0.9rem;
      line-height: 1.25;
    }

    .dish-desc {
      font-size: 0.72rem;
      -webkit-line-clamp: 2;
    }

    .badge-tag, .star-rating {
      font-size: 0.64rem;
      padding: 1.5px 5px;
    }

    .size-pill-btn {
      padding: 2px 5px;
      font-size: 0.64rem;
      gap: 2px;
    }

    .s-price {
      font-size: 0.62rem;
    }

    .price-pill .value {
      font-size: 1.05rem;
    }

    .prep-pill-inline {
      font-size: 0.64rem;
      padding: 1.5px 5px;
    }

    .flame-svg {
      width: 10px;
      height: 10px;
    }

    .btn-ios-add {
      height: 27px;
      padding: 0 8px;
      font-size: 0.68rem;
      gap: 3px;
    }
  }
</style>
