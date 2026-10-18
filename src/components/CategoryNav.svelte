<script>
  import { onMount } from 'svelte';
  import { activeCategory, isQuickMenuOpen } from '../stores/cart.js';

  export let categories = [];

  // Lineicons class map for categories
  const iconClassMap = {
    all: 'lni lni-restaurant',
    'nonveg-pizza': 'lni lni-pizza',
    'veg-pizza': 'lni lni-leaf',
    'fish-special': 'lni lni-drop',
    'beverages': 'lni lni-fresh-juice'
  };

  let scrollerEl;
  let pillRefs = {};
  let isManualScrolling = false;

  function selectCategory(id) {
    activeCategory.set(id);
    isManualScrolling = true;

    if (id === 'all') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(`section-${id}`);
      if (el) {
        // Adjust for sticky header + nav offset
        const yOffset = -110;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }

    centerPill(id);

    setTimeout(() => {
      isManualScrolling = false;
    }, 600);
  }

  function centerPill(id) {
    const pill = pillRefs[id];
    if (pill && scrollerEl) {
      pill.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
    }
  }

  onMount(() => {
    // Intersection Observer for scroll-spy
    const observerCallback = (entries) => {
      if (isManualScrolling) return;

      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id.replace('section-', '');
          if (sectionId && sectionId !== $activeCategory) {
            activeCategory.set(sectionId);
            centerPill(sectionId);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '-20% 0px -65% 0px',
      threshold: 0
    });

    // Observe each section
    categories.forEach(cat => {
      if (cat.id !== 'all') {
        const el = document.getElementById(`section-${cat.id}`);
        if (el) observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  });
</script>

<nav class="ios-category-bar" aria-label="Menu categories">
  <div class="category-wrapper">
    <div class="category-scroller no-scrollbar" bind:this={scrollerEl}>
      {#each categories as cat (cat.id)}
        {@const iconCls = iconClassMap[cat.id] || 'lni lni-restaurant'}
        <button
          type="button"
          bind:this={pillRefs[cat.id]}
          class="cat-pill {$activeCategory === cat.id ? 'active' : ''}"
          on:click={() => selectCategory(cat.id)}
          aria-current={$activeCategory === cat.id ? 'true' : 'false'}
        >
          <i class="{iconCls} pill-icon" aria-hidden="true"></i>
          <span class="pill-name">{cat.name}</span>
          {#if cat.itemCount}
            <span class="pill-badge">{cat.itemCount}</span>
          {/if}
        </button>
      {/each}
    </div>

    <!-- Quick Jump Menu Trigger Button -->
    <button
      type="button"
      class="btn-menu-drawer"
      on:click={() => isQuickMenuOpen.set(true)}
      aria-label="Open Full Menu Directory"
      title="Menu Directory"
    >
      <i class="lni lni-menu menu-btn-icon" aria-hidden="true"></i>
    </button>
  </div>
</nav>

<style>
  .ios-category-bar {
    position: sticky;
    top: 57px;
    z-index: 750;
    background: rgba(246, 246, 249, 0.92);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border-bottom: 1px solid var(--ios-separator);
    padding: 8px 12px;
  }

  .category-wrapper {
    max-width: var(--max-width);
    margin: 0 auto;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .category-scroller {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 8px;
    overflow-x: auto;
    scroll-behavior: smooth;
    padding: 2px 0;
  }

  .cat-pill {
    background: #FFFFFF;
    border: 1px solid var(--ios-separator);
    border-radius: var(--radius-pill);
    padding: 6px 14px;
    font-family: var(--font-sans);
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--text-secondary);
    cursor: pointer;
    white-space: nowrap;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
    flex-shrink: 0;
  }

  .pill-icon {
    font-size: 0.9rem;
  }

  .cat-pill:hover {
    color: var(--text-primary);
    border-color: #D1D1D8;
  }

  .cat-pill:active {
    transform: scale(0.95);
  }

  .cat-pill.active {
    background: #121217;
    border-color: #121217;
    color: #FFFFFF;
    box-shadow: 0 3px 10px rgba(18, 18, 23, 0.22);
  }

  .pill-badge {
    font-size: 0.68rem;
    font-weight: 700;
    background: var(--ios-fill);
    color: var(--text-secondary);
    padding: 1px 6px;
    border-radius: var(--radius-pill);
    margin-left: 2px;
    transition: all 0.18s ease;
  }

  .cat-pill.active .pill-badge {
    background: rgba(255, 255, 255, 0.22);
    color: #FFFFFF;
  }

  .btn-menu-drawer {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: #FFFFFF;
    border: 1px solid var(--ios-separator);
    color: var(--text-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: var(--shadow-sm);
    flex-shrink: 0;
    transition: transform 0.15s ease, background 0.15s ease;
  }

  .menu-btn-icon {
    font-size: 1rem;
  }

  .btn-menu-drawer:hover {
    background: var(--ios-fill-secondary);
  }

  .btn-menu-drawer:active {
    transform: scale(0.92);
  }
</style>
