<script>
  import { activeCategory } from '../stores/cart.js';

  export let categories = [];

  function selectCategory(id) {
    activeCategory.set(id);
    if (id !== 'all') {
      const el = document.getElementById(`section-${id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }
</script>

<nav class="ios-category-bar">
  <div class="category-scroller no-scrollbar">
    {#each categories as cat}
      <button
        type="button"
        class="cat-pill {$activeCategory === cat.id ? 'active' : ''}"
        on:click={() => selectCategory(cat.id)}
      >
        <span>{cat.name}</span>
      </button>
    {/each}
  </div>
</nav>

<style>
  .ios-category-bar {
    position: sticky;
    top: 57px;
    z-index: 750;
    background: rgba(242, 242, 247, 0.88);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 0.5px solid var(--ios-separator);
    padding: 8px 16px;
  }

  .category-scroller {
    max-width: var(--max-width);
    margin: 0 auto;
    display: flex;
    align-items: center;
    gap: 8px;
    overflow-x: auto;
  }

  .cat-pill {
    background: #FFFFFF;
    border: 0.5px solid var(--ios-separator);
    border-radius: var(--radius-pill);
    padding: 6px 14px;
    font-family: var(--font-system);
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--text-secondary);
    cursor: pointer;
    white-space: nowrap;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
    transition: all 0.15s ease;
  }

  .cat-pill:hover {
    color: var(--text-primary);
  }

  .cat-pill:active {
    transform: scale(0.95);
  }

  .cat-pill.active {
    background: #000000;
    border-color: #000000;
    color: #FFFFFF;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.18);
  }
</style>
