<script>
  import { X, Plus, Minus, Leaf, Beef } from '@lucide/svelte';
  import { selectedDish, addToCart, APP_CONFIG } from '../stores/cart.js';
  import { hapticLight } from '../utils/haptics.js';

  $: dish = $selectedDish;

  let quantity = 1;
  let selectedSpice = '';

  $: if (dish) {
    quantity = 1;
    selectedSpice = dish.spiceLevels?.[0] || '';
  }

  function closeModal() {
    selectedDish.set(null);
  }

  function handleBackdropKey(e) {
    if (e.key === 'Escape') closeModal();
  }

  function handleConfirmAdd() {
    if (!dish) return;
    hapticLight();
    addToCart(dish, quantity, selectedSpice, []);
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
        <X size={16} />
      </button>

      <!-- Dish Image -->
      <div class="sheet-media">
        <img src={dish.image} alt={dish.name} class="sheet-img" />
      </div>

      <!-- Details -->
      <div class="sheet-body">
        <div class="sheet-title-row">
          <div>
            <div class="d-flex align-items-center gap-2 mb-1">
              {#if dish.diet === 'veg'}
                <Leaf size={16} class="icon-veg" />
              {:else if dish.diet === 'nonveg'}
                <Beef size={16} class="icon-nonveg" />
              {/if}
              <span class="sheet-price">₹{dish.price}</span>
            </div>
            <h2 class="sheet-title" id="modal-dish-heading">{dish.name}</h2>
          </div>
        </div>

        <p class="sheet-desc">{dish.description}</p>

        <!-- Spice Level Selection if applicable -->
        {#if dish.spiceLevels && dish.spiceLevels.length > 0}
          <div class="option-section">
            <span class="option-label">Select Spice Level</span>
            <div class="spice-chips">
              {#each dish.spiceLevels as spice}
                <button
                  type="button"
                  class="spice-chip {selectedSpice === spice ? 'active' : ''}"
                  on:click={() => selectedSpice = spice}
                >
                  {spice}
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
            <button type="button" on:click={() => quantity = Math.max(1, quantity - 1)} aria-label="Decrease">
              <Minus size={16} strokeWidth={2.5} />
            </button>
            <span>{quantity}</span>
            <button type="button" on:click={() => quantity++} aria-label="Increase">
              <Plus size={16} strokeWidth={2.5} />
            </button>
          </div>

          <button class="btn-apple-primary" type="button" on:click={handleConfirmAdd}>
            <span class="btn-label">Add to Order</span>
            <span class="btn-price-badge">₹{dish.price * quantity}</span>
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
    border-radius: 20px 20px 0 0;
    max-height: 85vh;
    overflow-y: auto;
    position: relative;
    box-shadow: var(--shadow-float);
    animation: sheetUp 0.22s cubic-bezier(0.16, 1, 0.3, 1);
  }

  @media (min-width: 640px) {
    .ios-modal-sheet {
      border-radius: 20px;
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
    background: #D1D1D6;
    border-radius: 2px;
    margin: 10px auto 4px;
  }

  .btn-sheet-close {
    position: absolute;
    top: 14px;
    right: 14px;
    z-index: 10;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.06);
    border: none;
    color: var(--text-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .sheet-media {
    width: 100%;
    height: 200px;
    background: var(--ios-fill);
    overflow: hidden;
  }

  .sheet-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .sheet-body {
    padding: 16px 20px 20px;
  }

  .sheet-title-row {
    margin-bottom: 6px;
  }

  .sheet-price {
    font-size: 1.15rem;
    font-weight: 800;
    color: var(--text-primary);
  }

  .sheet-title {
    font-size: 1.3rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0;
  }

  .sheet-desc {
    font-size: 0.88rem;
    color: var(--text-secondary);
    line-height: 1.45;
    margin: 0 0 16px;
  }

  .option-section {
    margin-bottom: 12px;
  }

  .option-label {
    display: block;
    font-size: 0.78rem;
    font-weight: 700;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin-bottom: 8px;
  }

  .spice-chips {
    display: flex;
    gap: 8px;
  }

  .spice-chip {
    flex: 1;
    background: var(--ios-fill);
    border: 1px solid transparent;
    border-radius: var(--radius-pill);
    padding: 8px 14px;
    font-family: var(--font-system);
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
    background: #000000;
    color: #FFFFFF;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  }

  .sheet-footer {
    padding: 14px 20px;
    border-top: 0.5px solid var(--ios-separator);
    background: #FFFFFF;
    display: flex;
    align-items: center;
    gap: 12px;
  }
</style>
