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
      <!-- Grabber bar -->
      <div class="sheet-handle-bar"></div>

      <!-- Close Button -->
      <button class="btn-sheet-close" type="button" on:click={closeModal} aria-label="Close dialog">
        <i class="lni lni-close" aria-hidden="true"></i>
      </button>

      <!-- Clean Food Image -->
      <div class="sheet-media">
        <img src={dish.image} alt={dish.name} class="sheet-img" />
      </div>

      <!-- Details -->
      <div class="sheet-body">
        <div class="sheet-title-row">
          <div class="title-meta-left">
            <div class="modal-diet-wrap">
              <span class="diet-dot-badge {dish.diet}">
                <span class="dot-circle"></span>
              </span>
              {#if dish.popular}
                <span class="bestseller-label">Bestseller</span>
              {/if}
            </div>
            <h2 class="sheet-title" id="modal-dish-heading">{dish.name}</h2>
          </div>

          <div class="sheet-price-pill">
            <span class="currency">₹</span>
            <span class="amount">{activePrice}</span>
          </div>
        </div>

        <p class="sheet-desc">{dish.description}</p>

        <!-- Pizza Size Selection -->
        {#if dish.sizes}
          <div class="option-section">
            <span class="option-label">Choose Size</span>
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

        <!-- Preparation Options (e.g. Fried vs Grilled for Trout Fish) -->
        {#if dish.options && dish.options.length > 0}
          <div class="option-section">
            <span class="option-label">Preparation Style</span>
            <div class="option-chips">
              {#each dish.options as opt}
                <button
                  type="button"
                  class="option-chip {selectedOption === opt ? 'active' : ''}"
                  on:click={() => selectedOption = opt}
                >
                  {opt}
                </button>
              {/each}
            </div>
          </div>
        {/if}
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

  .sheet-body {
    padding: 18px 20px 20px;
  }

  .sheet-title-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 8px;
  }

  .title-meta-left {
    flex: 1;
    min-width: 0;
  }

  .modal-diet-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
  }

  .bestseller-label {
    font-size: 0.68rem;
    font-weight: 700;
    color: #B45309;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .sheet-title {
    font-family: var(--font-sans);
    font-size: 1.25rem;
    font-weight: 800;
    color: var(--text-primary);
    margin: 0;
    letter-spacing: -0.015em;
    line-height: 1.3;
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
    margin: 0 0 18px;
  }

  .option-section {
    margin-bottom: 20px;
  }

  .option-label {
    display: block;
    font-size: 0.74rem;
    font-weight: 700;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
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

  /* Option Chips */
  .option-chips {
    display: flex;
    gap: 8px;
  }

  .option-chip {
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

  .option-chip:active {
    transform: scale(0.96);
  }

  .option-chip.active {
    background: #121217;
    border-color: #121217;
    color: #FFFFFF;
    box-shadow: 0 2px 8px rgba(18, 18, 23, 0.2);
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
