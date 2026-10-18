<script>
  import { selectedDish, addToCart, APP_CONFIG } from '../stores/cart.js';
  import { hapticLight } from '../utils/haptics.js';

  $: dish = $selectedDish;

  let quantity = 1;
  let selectedSize = 'Regular';
  let selectedOption = '';

  $: if (dish) {
    quantity = 1;
    selectedSize = dish.sizes ? Object.keys(dish.sizes)[0] : 'Regular';
    selectedOption = dish.options && dish.options.length > 0 ? dish.options[0] : '';
  }

  $: activePrice = dish?.sizes ? (dish.sizes[selectedSize] || dish.price) : (dish?.price || 0);

  function closeModal() {
    selectedDish.set(null);
  }

  function handleBackdropKey(e) {
    if (e.key === 'Escape') closeModal();
  }

  function handleConfirmAdd() {
    if (!dish) return;
    hapticLight();
    addToCart(dish, quantity, selectedSize, selectedOption);
    closeModal();
  }
</script>

{#if dish}
  <div
    class="ios-backdrop"
    on:click={closeModal}
    on:keydown={handleBackdropKey}
    role="presentation"
  >
    <div
      class="ios-modal-sheet"
      on:click|stopPropagation
      on:keydown|stopPropagation
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-dish-heading"
      tabindex="-1"
    >
      <!-- Grabber handle for iOS feel -->
      <div class="sheet-handle-bar"></div>

      <!-- Close Button -->
      <button class="btn-sheet-close" type="button" on:click={closeModal} aria-label="Close dialog">
        <i class="lni lni-close" aria-hidden="true"></i>
      </button>

      <!-- Dish Image Banner -->
      <div class="sheet-media">
        <img src={dish.image} alt={dish.name} class="sheet-img" />
        <div class="sheet-media-gradient"></div>

        <!-- Floating Badges over Media -->
        <div class="media-badges">
          <span class="diet-dot-badge {dish.diet}">
            <span class="dot-circle"></span>
          </span>

          {#if dish.tag || dish.popular}
            <span class="modal-tag">
              <i class="lni lni-tag" aria-hidden="true"></i>
              <span>{dish.tag || 'Must Try'}</span>
            </span>
          {/if}
        </div>
      </div>

      <!-- Details -->
      <div class="sheet-body">
        <div class="sheet-title-row">
          <div class="title-meta-left">
            <h2 class="sheet-title" id="modal-dish-heading">{dish.name}</h2>
            
            <div class="meta-pills-row">
              {#if dish.rating}
                <span class="rating-badge">
                  <i class="lni lni-star-fill icon-star" aria-hidden="true"></i>
                  <span>{dish.rating}</span>
                  {#if dish.ratingCount}
                    <span class="rating-count">({dish.ratingCount})</span>
                  {/if}
                </span>
              {/if}

              {#if dish.prepTime}
                <span class="prep-badge">
                  <i class="lni lni-timer" aria-hidden="true"></i>
                  <span>{dish.prepTime}</span>
                </span>
              {/if}

              {#if dish.spiciness && dish.spiciness > 0}
                <span class="spice-badge" title="{dish.spiciness} of 3 spicy">
                  {#each Array(dish.spiciness) as _}
                    <svg class="flame-svg" viewBox="0 0 24 24" width="13" height="13" fill="#EA580C" stroke="#EA580C">
                      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
                    </svg>
                  {/each}
                </span>
              {/if}
            </div>
          </div>

          <div class="sheet-price-pill">
            <span class="currency">₹</span>
            <span class="amount">{activePrice}</span>
          </div>
        </div>

        <p class="sheet-desc">{dish.description}</p>

        <!-- Pizza Size Selection (R, M, L) -->
        {#if dish.sizes}
          <div class="option-section">
            <span class="option-label">Select Crust Size</span>
            <div class="size-options-grid">
              {#each Object.entries(dish.sizes) as [sName, sPrice]}
                <button
                  type="button"
                  class="size-option-card {selectedSize === sName ? 'active' : ''}"
                  on:click={() => selectedSize = sName}
                >
                  <div class="size-card-title">{sName}</div>
                  <div class="size-card-tag">{sName === 'Regular' ? '8" Personal' : (sName === 'Medium' ? '10" Sharing' : '12" Family')}</div>
                  <div class="size-card-price">₹{sPrice}</div>
                </button>
              {/each}
            </div>
          </div>
        {/if}

        <!-- Preparation Options (e.g. Fried / Grilled for Trout Fish, Cold Drink Flavors) -->
        {#if dish.options && dish.options.length > 0}
          <div class="option-section">
            <span class="option-label">Select Preparation / Flavor</span>
            <div class="spice-chips">
              {#each dish.options as opt}
                <button
                  type="button"
                  class="spice-chip {selectedOption === opt ? 'active' : ''}"
                  on:click={() => selectedOption = opt}
                >
                  {opt}
                </button>
              {/each}
            </div>
          </div>
        {/if}

        <div class="prep-note-box">
          <span class="note-title">New Diamond Cafe Guarantee</span>
          <span class="note-desc">Baked fresh to order with authentic spices, 100% real dairy mozzarella, and premium meats.</span>
        </div>
      </div>

      <!-- Footer Action -->
      {#if APP_CONFIG.isOrderingEnabled}
        <div class="sheet-footer">
          <div class="ios-stepper stepper-sheet">
            <button type="button" on:click={() => quantity = Math.max(1, quantity - 1)} aria-label="Decrease quantity">
              <i class="lni lni-minus" aria-hidden="true"></i>
            </button>
            <span>{quantity}</span>
            <button type="button" on:click={() => quantity++} aria-label="Increase quantity">
              <i class="lni lni-plus" aria-hidden="true"></i>
            </button>
          </div>

          <button class="btn-apple-primary" type="button" on:click={handleConfirmAdd}>
            <span class="btn-label">
              Add to Order
              {#if dish.sizes}
                • {selectedSize}
              {/if}
            </span>
            <span class="btn-price-badge">₹{activePrice * quantity}</span>
          </button>
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .ios-modal-sheet {
    background: #FFFFFF;
    width: 100%;
    max-width: 500px;
    border-radius: 24px 24px 0 0;
    max-height: 85vh;
    overflow-y: auto;
    position: relative;
    box-shadow: var(--shadow-float);
    animation: sheetUp 0.22s cubic-bezier(0.16, 1, 0.3, 1);
  }

  @media (min-width: 640px) {
    .ios-modal-sheet {
      border-radius: 24px;
      max-height: 80vh;
    }
  }

  @keyframes sheetUp {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }

  .sheet-handle-bar {
    width: 36px;
    height: 4px;
    background: #D1D1D8;
    border-radius: 2px;
    margin: 10px auto 4px;
  }

  .btn-sheet-close {
    position: absolute;
    top: 14px;
    right: 14px;
    z-index: 10;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.45);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border: none;
    color: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.15s ease;
    font-size: 0.95rem;
  }

  .btn-sheet-close:active {
    transform: scale(0.9);
  }

  .sheet-media {
    position: relative;
    width: 100%;
    height: 220px;
    background: var(--ios-fill);
    overflow: hidden;
  }

  .sheet-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .sheet-media-gradient {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.6) 100%);
    pointer-events: none;
  }

  .media-badges {
    position: absolute;
    bottom: 12px;
    left: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
    z-index: 2;
  }

  .modal-tag {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: #FEF3C7;
    color: #B45309;
    font-size: 0.72rem;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: var(--radius-pill);
    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  }

  .sheet-body {
    padding: 16px 20px 20px;
  }

  .sheet-title-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 10px;
  }

  .title-meta-left {
    flex: 1;
  }

  .sheet-title {
    font-family: var(--font-sans);
    font-size: 1.25rem;
    font-weight: 800;
    color: var(--text-primary);
    margin: 0 0 6px;
    letter-spacing: -0.015em;
  }

  .meta-pills-row {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .rating-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: var(--ios-fill-secondary);
    font-size: 0.74rem;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 6px;
  }

  .rating-count {
    color: var(--text-muted);
    font-weight: 500;
  }

  .prep-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 0.74rem;
    font-weight: 600;
    color: var(--text-muted);
    background: var(--ios-fill-secondary);
    padding: 3px 8px;
    border-radius: 6px;
    white-space: nowrap !important;
    flex-shrink: 0 !important;
    font-variant-numeric: tabular-nums;
  }

  .spice-badge {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    font-size: 0.8rem;
    white-space: nowrap !important;
    flex-shrink: 0 !important;
  }

  .flame-svg {
    display: inline-block;
    flex-shrink: 0;
  }

  .sheet-price-pill {
    display: flex;
    align-items: baseline;
    gap: 2px;
    color: var(--text-primary);
    font-weight: 800;
    flex-shrink: 0;
  }

  .sheet-price-pill .currency {
    font-size: 0.95rem;
    color: var(--accent-gold);
  }

  .sheet-price-pill .amount {
    font-size: 1.35rem;
    letter-spacing: -0.02em;
  }

  .sheet-desc {
    font-size: 0.88rem;
    color: var(--text-secondary);
    line-height: 1.5;
    margin: 0 0 16px;
  }

  .option-section {
    margin-bottom: 18px;
  }

  .option-label {
    display: block;
    font-size: 0.76rem;
    font-weight: 700;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin-bottom: 8px;
  }

  /* Size Selector Cards Grid */
  .size-options-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .size-option-card {
    background: var(--ios-fill-secondary);
    border: 1.5px solid transparent;
    border-radius: var(--radius-md);
    padding: 10px 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 2px;
    cursor: pointer;
    transition: all 0.16s ease;
  }

  .size-option-card:active {
    transform: scale(0.96);
  }

  .size-option-card.active {
    background: #FFFFFF;
    border-color: #121217;
    box-shadow: 0 3px 12px rgba(18, 18, 23, 0.12);
  }

  .size-card-title {
    font-size: 0.86rem;
    font-weight: 700;
    color: var(--text-primary);
  }

  .size-card-tag {
    font-size: 0.65rem;
    color: var(--text-muted);
    font-weight: 500;
  }

  .size-card-price {
    font-size: 0.94rem;
    font-weight: 800;
    color: var(--accent-gold);
    margin-top: 4px;
  }

  /* Spice Chips */
  .spice-chips {
    display: flex;
    gap: 8px;
  }

  .spice-chip {
    flex: 1;
    background: var(--ios-fill-secondary);
    border: 1px solid var(--ios-separator);
    border-radius: var(--radius-pill);
    padding: 8px 12px;
    font-family: var(--font-sans);
    font-size: 0.84rem;
    font-weight: 600;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.16s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .spice-chip:active {
    transform: scale(0.96);
  }

  .spice-chip.active {
    background: #121217;
    border-color: #121217;
    color: #FFFFFF;
    box-shadow: 0 2px 8px rgba(18, 18, 23, 0.2);
  }

  .prep-note-box {
    background: var(--ios-card-subtle);
    border: 1px dashed var(--ios-separator);
    border-radius: var(--radius-md);
    padding: 10px 14px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin-top: 8px;
  }

  .note-title {
    font-size: 0.76rem;
    font-weight: 700;
    color: var(--text-primary);
  }

  .note-desc {
    font-size: 0.72rem;
    color: var(--text-muted);
    line-height: 1.35;
  }

  .sheet-footer {
    padding: 14px 20px;
    padding-bottom: max(14px, env(safe-area-inset-bottom));
    border-top: 1px solid var(--ios-separator);
    background: #FFFFFF;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  @media (max-width: 440px) {
    .sheet-body {
      padding: 14px 16px 16px;
    }

    .sheet-title {
      font-size: 1.15rem;
    }

    .sheet-footer {
      padding: 12px 14px;
      gap: 10px;
    }

    .size-option-card {
      padding: 8px 4px;
    }

    .size-card-title {
      font-size: 0.82rem;
    }

    .size-card-tag {
      font-size: 0.62rem;
    }

    .size-card-price {
      font-size: 0.88rem;
    }
  }

  @media (max-width: 375px) {
    .sheet-footer {
      padding: 10px 12px;
      gap: 8px;
    }

    .sheet-footer .btn-apple-primary {
      padding: 0 12px;
      font-size: 0.82rem;
    }

    .sheet-footer .btn-label {
      font-size: 0.8rem;
    }

    .sheet-footer .btn-price-badge {
      font-size: 0.82rem;
      padding: 2px 7px;
    }
  }
</style>
