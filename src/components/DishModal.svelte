<script>
  import { X, Leaf, Beef } from '@lucide/svelte';
  import { selectedDish } from '../stores/cart.js';

  $: dish = $selectedDish;

  function closeModal() {
    selectedDish.set(null);
  }

  function handleBackdropKey(e) {
    if (e.key === 'Escape') closeModal();
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
          <div class="meta-tags-row">
            {#if dish.diet === 'veg'}
              <span class="diet-badge diet-veg">
                <Leaf size={14} class="icon-veg" />
                <span>Vegetarian</span>
              </span>
            {:else if dish.diet === 'nonveg'}
              <span class="diet-badge diet-nonveg">
                <Beef size={14} class="icon-nonveg" />
                <span>Non-Vegetarian</span>
              </span>
            {/if}
            {#if dish.popular}
              <span class="badge-pop">Must Try</span>
            {/if}
          </div>
          <h2 class="sheet-title" id="modal-dish-heading">{dish.name}</h2>
          {#if dish.variants && dish.variants.length > 0}
            <div class="sheet-price">From ₹{dish.price}</div>
          {:else}
            <div class="sheet-price">₹{dish.price}</div>
          {/if}
        </div>

        <p class="sheet-desc">{dish.description}</p>

        <!-- Portions & Sizing Breakdown -->
        {#if dish.variants && dish.variants.length > 0}
          <div class="option-section">
            <span class="option-label">Available Sizes &amp; Portions</span>
            <div class="variant-list">
              {#each dish.variants as v}
                <div class="variant-item-card">
                  <span class="variant-item-label">{v.label}</span>
                  <span class="variant-item-price">₹{v.price}</span>
                </div>
              {/each}
            </div>
          </div>
        {/if}

        <!-- Informational Spice Preparation if present -->
        {#if dish.spiceLevels && dish.spiceLevels.length > 0}
          <div class="option-section">
            <span class="option-label">Spice Levels Available</span>
            <div class="spice-chips">
              {#each dish.spiceLevels as spice}
                <span class="spice-chip-info">{spice}</span>
              {/each}
            </div>
          </div>
        {/if}
      </div>

      <!-- Simple Dismiss Footer -->
      <div class="sheet-footer">
        <button class="btn-modal-dismiss" type="button" on:click={closeModal}>
          Close
        </button>
      </div>
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
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.5);
    color: #FFFFFF;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    backdrop-filter: blur(8px);
    transition: transform 0.15s ease;
  }

  .btn-sheet-close:active {
    transform: scale(0.9);
  }

  .sheet-media {
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
    padding: 18px 20px 14px;
  }

  .meta-tags-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }

  .diet-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 8px;
    border-radius: 6px;
    font-size: 0.72rem;
    font-weight: 700;
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
    font-size: 0.72rem;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 6px;
  }

  .sheet-title {
    font-size: 1.35rem;
    font-weight: 800;
    color: var(--text-primary);
    margin: 0 0 6px;
    line-height: 1.25;
  }

  .sheet-price {
    font-size: 1.25rem;
    font-weight: 800;
    color: var(--text-primary);
    margin-bottom: 12px;
  }

  .sheet-desc {
    font-size: 0.92rem;
    color: var(--text-secondary);
    line-height: 1.5;
    margin: 0 0 16px;
  }

  .option-section {
    margin-bottom: 16px;
    padding-top: 14px;
    border-top: 0.5px solid var(--ios-separator);
  }

  .option-label {
    display: block;
    font-size: 0.76rem;
    font-weight: 700;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin-bottom: 10px;
  }

  .variant-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .variant-item-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #F2F2F7;
    border-radius: var(--radius-sm);
    padding: 10px 14px;
    border: 0.5px solid rgba(0, 0, 0, 0.05);
  }

  .variant-item-label {
    font-size: 0.88rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  .variant-item-price {
    font-size: 0.95rem;
    font-weight: 800;
    color: var(--text-primary);
  }

  .spice-chips {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .spice-chip-info {
    background: var(--ios-fill);
    border-radius: var(--radius-pill);
    padding: 6px 14px;
    font-family: var(--font-system);
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--text-secondary);
  }

  .sheet-footer {
    padding: 12px 20px 20px;
    background: #FFFFFF;
  }

  .btn-modal-dismiss {
    width: 100%;
    background: #F2F2F7;
    color: var(--text-primary);
    border: none;
    border-radius: var(--radius-pill);
    padding: 14px 20px;
    font-family: var(--font-system);
    font-size: 0.95rem;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.15s ease, transform 0.15s ease;
  }

  .btn-modal-dismiss:active {
    background: #E5E5EA;
    transform: scale(0.98);
  }
</style>
