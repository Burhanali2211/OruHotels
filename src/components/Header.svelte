<script>
  import { ShoppingBag } from '@lucide/svelte';
  import { cartSummary, isDrawerOpen, APP_CONFIG } from '../stores/cart.js';

  export let restaurant;
</script>

<header class="ios-nav-header">
  <div class="nav-inner">
    <!-- Brand & Table -->
    <div class="brand-group">
      <div class="brand-title">{restaurant.name}</div>
      <div class="table-badge">
        <span class="live-dot"></span>
        <span>{restaurant.table}</span>
      </div>
    </div>

    <!-- Right Cart Trigger -->
    {#if APP_CONFIG.isOrderingEnabled}
      <button
        class="btn-cart-nav"
        type="button"
        on:click={() => isDrawerOpen.set(true)}
        aria-label="View Order Tray"
      >
        <ShoppingBag size={18} strokeWidth={2.2} />
        {#if $cartSummary.totalItems > 0}
          <span class="cart-pill-badge">{$cartSummary.totalItems}</span>
        {/if}
      </button>
    {/if}
  </div>
</header>

<style>
  .ios-nav-header {
    position: sticky;
    top: 0;
    z-index: 800;
    background: rgba(242, 242, 247, 0.85);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 0.5px solid var(--ios-separator);
    padding: 12px 16px;
  }

  .nav-inner {
    max-width: var(--max-width);
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .brand-group {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .brand-title {
    font-size: 1.25rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--text-primary);
  }

  .table-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: #FFFFFF;
    border: 0.5px solid var(--ios-separator);
    border-radius: var(--radius-pill);
    padding: 4px 10px;
    font-size: 0.76rem;
    font-weight: 600;
    color: var(--text-secondary);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  }

  .live-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent-emerald);
  }

  .btn-cart-nav {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: #FFFFFF;
    border: 0.5px solid var(--ios-separator);
    color: var(--text-primary);
    cursor: pointer;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
    transition: transform 0.15s ease;
  }

  .btn-cart-nav:active {
    transform: scale(0.92);
  }

  .cart-pill-badge {
    position: absolute;
    top: -2px;
    right: -2px;
    background: #000000;
    color: #FFFFFF;
    font-size: 0.68rem;
    font-weight: 700;
    min-width: 18px;
    height: 18px;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 4px;
    border: 2px solid #FFFFFF;
  }
</style>
