<script>
  import { isQuickMenuOpen, activeCategory, cartSummary, APP_CONFIG } from '../stores/cart.js';
  import { hapticLight } from '../utils/haptics.js';

  export let categories = [];
  export let dishes = [];

  const iconClassMap = {
    all: 'lni lni-restaurant',
    'nonveg-pizza': 'lni lni-pizza',
    'veg-pizza': 'lni lni-leaf',
    'fish-special': 'lni lni-drop',
    'beverages': 'lni lni-fresh-juice'
  };

  // Compute stats for each category
  $: categoryStats = categories.filter(c => c.id !== 'all').map(cat => {
    const catDishes = dishes.filter(d => d.category === cat.id);
    const vegCount = catDishes.filter(d => d.diet === 'veg').length;
    const nonvegCount = catDishes.filter(d => d.diet === 'nonveg').length;
    
    // Calculate min/max price taking sizes into account
    let prices = [];
    catDishes.forEach(d => {
      if (d.sizes) {
        prices.push(...Object.values(d.sizes));
      } else {
        prices.push(d.price);
      }
    });

    const minPrice = prices.length ? Math.min(...prices) : 0;
    const maxPrice = prices.length ? Math.max(...prices) : 0;

    return {
      ...cat,
      totalCount: catDishes.length,
      vegCount,
      nonvegCount,
      minPrice,
      maxPrice
    };
  });

  function closeSheet() {
    isQuickMenuOpen.set(false);
  }

  function handleBackdropKey(e) {
    if (e.key === 'Escape') closeSheet();
  }

  function jumpTo(catId) {
    hapticLight();
    activeCategory.set(catId);
    closeSheet();

    setTimeout(() => {
      const el = document.getElementById(`section-${catId}`);
      if (el) {
        const yOffset = -110;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 150);
  }
</script>

<!-- Floating Pill Button (When sheet is closed) -->
{#if !$isQuickMenuOpen}
  <div 
    class="floating-menu-trigger {$cartSummary.totalItems > 0 && APP_CONFIG.isOrderingEnabled ? 'with-cart-bar' : ''}"
  >
    <button
      type="button"
      class="btn-floating-menu"
      on:click={() => isQuickMenuOpen.set(true)}
      aria-label="Open Category Quick Menu"
    >
      <i class="lni lni-restaurant" aria-hidden="true"></i>
      <span>Menu Directory</span>
      <span class="badge-count">{categoryStats.length}</span>
    </button>
  </div>
{/if}

<!-- Quick Menu iOS Bottom Sheet -->
{#if $isQuickMenuOpen}
  <div
    class="ios-backdrop"
    on:click={closeSheet}
    on:keydown={handleBackdropKey}
    role="presentation"
  >
    <div
      class="quick-sheet-modal"
      on:click|stopPropagation
      on:keydown|stopPropagation
      role="dialog"
      aria-modal="true"
      aria-labelledby="menu-directory-title"
      tabindex="-1"
    >
      <!-- Sheet Grabber -->
      <div class="sheet-grabber"></div>

      <!-- Header -->
      <div class="sheet-header">
        <div>
          <span class="sheet-eyebrow">New Diamond Cafe</span>
          <h2 class="sheet-title" id="menu-directory-title">Menu Directory</h2>
        </div>

        <button class="btn-close-sheet" type="button" on:click={closeSheet} aria-label="Close">
          <i class="lni lni-close" aria-hidden="true"></i>
        </button>
      </div>

      <!-- Categories Directory List -->
      <div class="directory-list no-scrollbar">
        {#each categoryStats as cat (cat.id)}
          {@const iconCls = iconClassMap[cat.id] || 'lni lni-restaurant'}
          <button
            type="button"
            class="directory-item {$activeCategory === cat.id ? 'active-item' : ''}"
            on:click={() => jumpTo(cat.id)}
          >
            <div class="item-icon-box" style="--cat-color: {cat.color || '#EA580C'}">
              <i class="{iconCls} dir-cat-icon" aria-hidden="true"></i>
            </div>

            <div class="item-details">
              <div class="item-title-row">
                <span class="item-name">{cat.name}</span>
                <span class="item-count-badge">{cat.totalCount} items</span>
              </div>

              <div class="item-sub-row">
                <span class="item-sub">{cat.subtitle || ''}</span>
              </div>

              <div class="item-meta-row">
                <span class="item-diet-breakdown">
                  {#if cat.vegCount > 0}
                    <span class="diet-count veg">
                      <i class="lni lni-leaf icon-veg" aria-hidden="true"></i>
                      <span>{cat.vegCount} Veg</span>
                    </span>
                  {/if}
                  {#if cat.nonvegCount > 0}
                    <span class="diet-count nonveg">
                      <i class="lni lni-dinner icon-nonveg" aria-hidden="true"></i>
                      <span>{cat.nonvegCount} Non-Veg</span>
                    </span>
                  {/if}
                </span>

                <span class="item-price-range">₹{cat.minPrice} - ₹{cat.maxPrice}</span>
              </div>
            </div>

            <div class="item-arrow">
              <i class="lni lni-chevron-right" aria-hidden="true"></i>
            </div>
          </button>
        {/each}
      </div>
    </div>
  </div>
{/if}

<style>
  /* Floating Trigger Pill */
  .floating-menu-trigger {
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 850;
    transition: bottom 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .floating-menu-trigger.with-cart-bar {
    bottom: 86px;
  }

  .btn-floating-menu {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #121217;
    color: #FFFFFF;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: var(--radius-pill);
    padding: 10px 18px;
    font-family: var(--font-sans);
    font-size: 0.86rem;
    font-weight: 700;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.28), 0 2px 6px rgba(0, 0, 0, 0.12);
    cursor: pointer;
    transition: transform 0.16s ease, filter 0.16s ease;
    user-select: none;
  }

  .btn-floating-menu:hover {
    filter: brightness(1.1);
    transform: scale(1.03);
  }

  .btn-floating-menu:active {
    transform: scale(0.96);
  }

  .badge-count {
    background: rgba(255, 255, 255, 0.2);
    color: #FFFFFF;
    font-size: 0.7rem;
    font-weight: 700;
    padding: 2px 7px;
    border-radius: var(--radius-pill);
  }

  /* Bottom Sheet Modal */
  .quick-sheet-modal {
    background: #FFFFFF;
    width: 100%;
    max-width: 520px;
    border-radius: 24px 24px 0 0;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    box-shadow: var(--shadow-float);
    animation: sheetUp 0.22s cubic-bezier(0.16, 1, 0.3, 1);
    overflow: hidden;
  }

  @media (min-width: 640px) {
    .quick-sheet-modal {
      border-radius: 24px;
      max-height: 75vh;
    }
  }

  @keyframes sheetUp {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }

  .sheet-grabber {
    width: 36px;
    height: 4px;
    background: #D1D1D8;
    border-radius: 2px;
    margin: 10px auto 4px;
  }

  .sheet-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 20px 12px;
    border-bottom: 1px solid var(--ios-separator);
  }

  .sheet-eyebrow {
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--accent-gold);
    display: block;
    margin-bottom: 2px;
  }

  .sheet-title {
    font-size: 1.25rem;
    font-weight: 800;
    color: var(--text-primary);
    margin: 0;
    letter-spacing: -0.02em;
  }

  .btn-close-sheet {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--ios-fill-secondary);
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-primary);
    cursor: pointer;
    font-size: 0.95rem;
  }

  .directory-list {
    padding: 12px 16px 24px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow-y: auto;
  }

  .directory-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 12px 14px;
    background: var(--ios-card-subtle);
    border: 1px solid var(--ios-separator);
    border-radius: var(--radius-md);
    cursor: pointer;
    text-align: left;
    transition: all 0.16s ease;
    width: 100%;
    outline: none;
  }

  .directory-item:hover {
    background: #FFFFFF;
    border-color: #D1D1D8;
    transform: translateX(3px);
  }

  .directory-item:active {
    transform: scale(0.98);
  }

  .directory-item.active-item {
    background: #F4F4F8;
    border-color: #121217;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  .item-icon-box {
    width: 44px;
    height: 44px;
    border-radius: var(--radius-sm);
    background: color-mix(in srgb, var(--cat-color) 12%, transparent);
    color: var(--cat-color);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .dir-cat-icon {
    font-size: 1.35rem;
  }

  .item-details {
    flex: 1;
    min-width: 0;
  }

  .item-title-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2px;
  }

  .item-name {
    font-size: 0.98rem;
    font-weight: 700;
    color: var(--text-primary);
  }

  .item-count-badge {
    font-size: 0.72rem;
    font-weight: 700;
    background: var(--ios-fill);
    color: var(--text-secondary);
    padding: 2px 8px;
    border-radius: var(--radius-pill);
  }

  .item-sub-row {
    margin-bottom: 6px;
  }

  .item-sub {
    font-size: 0.75rem;
    color: var(--text-muted);
  }

  .item-meta-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 4px;
    font-size: 0.72rem;
  }

  .item-diet-breakdown {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap !important;
    flex-shrink: 0 !important;
  }

  .diet-count {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-weight: 600;
    white-space: nowrap !important;
    flex-shrink: 0 !important;
  }

  .diet-count.veg {
    color: var(--accent-emerald);
  }

  .diet-count.nonveg {
    color: var(--accent-red);
  }

  .item-price-range {
    color: var(--text-secondary);
    font-weight: 700;
    white-space: nowrap !important;
    flex-shrink: 0 !important;
  }

  .item-arrow {
    color: var(--text-muted);
    flex-shrink: 0;
    font-size: 0.9rem;
  }
</style>
