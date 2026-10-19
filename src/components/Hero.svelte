<script>
  import { searchQuery, dietFilter, viewMode } from '../stores/cart.js';
  import { hapticLight } from '../utils/haptics.js';

  function toggleDiet(val) {
    hapticLight();
    dietFilter.set(val);
  }

  function toggleViewMode(mode) {
    hapticLight();
    viewMode.set(mode);
  }
</script>

<div class="ios-controls-section">
  <!-- Apple Spotlight Style Search -->
  <div class="spotlight-search">
    <i class="lni lni-search search-icon" aria-hidden="true"></i>
    <input
      type="search"
      placeholder="Search pizza, chicken, cheese, or trout..."
      bind:value={$searchQuery}
      class="search-input"
      aria-label="Search menu"
    />
    {#if $searchQuery}
      <button 
        type="button" 
        class="btn-clear" 
        on:click={() => $searchQuery = ''} 
        aria-label="Clear Search"
      >
        <i class="lni lni-close" aria-hidden="true"></i>
      </button>
    {/if}
  </div>

  <!-- Row 2: Dietary Segmented Control & View Mode Switcher -->
  <div class="filter-controls-row">
    <!-- iOS Native Segmented Control -->
    <div class="ios-segmented-control" role="tablist" aria-label="Dietary filter">
      <button
        type="button"
        class="segment-item {$dietFilter === 'all' ? 'active' : ''}"
        on:click={() => toggleDiet('all')}
        role="tab"
        aria-selected={$dietFilter === 'all'}
      >
        <i class="lni lni-restaurant segment-icon" aria-hidden="true"></i>
        <span>All</span>
      </button>
      <button
        type="button"
        class="segment-item {$dietFilter === 'veg' ? 'active' : ''}"
        on:click={() => toggleDiet('veg')}
        role="tab"
        aria-selected={$dietFilter === 'veg'}
      >
        <i class="lni lni-leaf icon-veg segment-icon" aria-hidden="true"></i>
        <span>Veg</span>
      </button>
      <button
        type="button"
        class="segment-item {$dietFilter === 'nonveg' ? 'active' : ''}"
        on:click={() => toggleDiet('nonveg')}
        role="tab"
        aria-selected={$dietFilter === 'nonveg'}
      >
        <i class="lni lni-dinner icon-nonveg segment-icon" aria-hidden="true"></i>
        <span>Non-Veg</span>
      </button>
    </div>

    <!-- View Mode Switcher (Cards vs Compact) -->
    <div class="view-mode-toggle" role="group" aria-label="Layout view mode">
      <button
        type="button"
        class="mode-btn {$viewMode === 'cards' ? 'active' : ''}"
        on:click={() => toggleViewMode('cards')}
        title="Visual Cards"
        aria-label="Visual Cards"
      >
        <i class="lni lni-grid-alt" aria-hidden="true"></i>
      </button>
      <button
        type="button"
        class="mode-btn {$viewMode === 'compact' ? 'active' : ''}"
        on:click={() => toggleViewMode('compact')}
        title="Compact List"
        aria-label="Compact List"
      >
        <i class="lni lni-list" aria-hidden="true"></i>
      </button>
    </div>
  </div>
</div>

<style>
  .ios-controls-section {
    padding: 14px 16px 8px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  /* Spotlight Search */
  .spotlight-search {
    display: flex;
    align-items: center;
    background: #FFFFFF;
    border: 1px solid var(--ios-separator);
    border-radius: var(--radius-pill);
    padding: 0 14px;
    height: 44px;
    box-shadow: var(--shadow-sm);
    transition: all 0.16s ease;
  }

  .spotlight-search:focus-within {
    border-color: #121217;
    box-shadow: 0 2px 12px rgba(18, 18, 23, 0.12);
  }

  .search-icon {
    font-size: 1.1rem;
    color: var(--text-muted);
    flex-shrink: 0;
    margin-right: 8px;
  }

  .search-input {
    width: 100%;
    border: none;
    background: transparent;
    font-family: var(--font-sans);
    font-size: 0.9rem;
    color: var(--text-primary);
    outline: none;
  }

  .search-input::placeholder {
    color: var(--text-muted);
  }

  .btn-clear {
    background: var(--text-muted);
    color: #FFFFFF;
    border: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
    font-size: 0.7rem;
  }

  /* Filter Controls Row */
  .filter-controls-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* Native iOS Segmented Control */
  .ios-segmented-control {
    flex: 1;
    display: flex;
    background: var(--ios-fill);
    border-radius: var(--radius-pill);
    padding: 3px;
  }

  .segment-item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    background: transparent;
    border: none;
    border-radius: var(--radius-pill);
    padding: 6px 0;
    font-family: var(--font-sans);
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .segment-icon {
    font-size: 0.95rem;
  }

  .segment-item:active {
    transform: scale(0.96);
  }

  .segment-item.active {
    background: #FFFFFF;
    color: var(--text-primary);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12), 0 1px 1px rgba(0, 0, 0, 0.04);
  }

  /* View Mode Switcher */
  .view-mode-toggle {
    display: flex;
    background: var(--ios-fill);
    border-radius: var(--radius-pill);
    padding: 3px;
    flex-shrink: 0;
  }

  .mode-btn {
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    border-radius: 50%;
    color: var(--text-muted);
    cursor: pointer;
    transition: all 0.16s ease;
    font-size: 0.9rem;
  }

  .mode-btn.active {
    background: #FFFFFF;
    color: var(--text-primary);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
  }

  @media (max-width: 380px) {
    .ios-controls-section {
      padding: 10px 12px 6px;
      gap: 8px;
    }

    .spotlight-search {
      height: 40px;
      padding: 0 12px;
    }

    .search-input {
      font-size: 0.84rem;
    }

    .segment-item {
      font-size: 0.74rem;
      gap: 3px;
      padding: 5px 0;
      white-space: nowrap !important;
    }

    .segment-icon {
      font-size: 0.85rem;
    }
  }
</style>
