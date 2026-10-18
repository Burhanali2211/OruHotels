<script>
  import { cartSummary, isDrawerOpen, APP_CONFIG } from '../stores/cart.js';
  import { hapticLight } from '../utils/haptics.js';

  export let restaurant;

  function openTray() {
    hapticLight();
    isDrawerOpen.set(true);
  }
</script>

<header class="ios-nav-header">
  <div class="nav-inner">
    <!-- Brand -->
    <div class="brand-group">
      <div class="brand-monogram">
        <i class="lni lni-diamond-alt monogram-icon" aria-hidden="true"></i>
      </div>
      <div class="brand-text">
        <h1 class="brand-title">{restaurant.name}</h1>
      </div>
    </div>

    <!-- Right Cart Trigger -->
    {#if APP_CONFIG.isOrderingEnabled}
      <button
        class="btn-cart-nav"
        type="button"
        on:click={openTray}
        aria-label="View Order Tray ({$cartSummary.totalItems} items)"
      >
        <i class="lni lni-shopping-basket cart-icon" aria-hidden="true"></i>
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
    background: rgba(246, 246, 249, 0.92);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border-bottom: 1px solid var(--ios-separator);
    padding: 10px 16px;
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
    min-width: 0;
  }

  .brand-monogram {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    background: linear-gradient(135deg, #24242A 0%, #121217 100%);
    color: var(--accent-gold);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    flex-shrink: 0;
  }

  .monogram-icon {
    font-size: 1.15rem;
  }

  .brand-text {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .brand-title {
    font-size: 1.15rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--text-primary);
    line-height: 1.2;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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
    border: 1px solid var(--ios-separator);
    color: var(--text-primary);
    cursor: pointer;
    box-shadow: var(--shadow-sm);
    transition: transform 0.15s ease, background 0.15s ease;
    flex-shrink: 0;
  }

  .cart-icon {
    font-size: 1.15rem;
  }

  .btn-cart-nav:active {
    transform: scale(0.92);
    background: var(--ios-fill-secondary);
  }

  .cart-pill-badge {
    position: absolute;
    top: -3px;
    right: -3px;
    background: #121217;
    color: #FFFFFF;
    font-size: 0.66rem;
    font-weight: 800;
    min-width: 18px;
    height: 18px;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 4px;
    border: 2px solid #FFFFFF;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    animation: popBadge 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }

  @keyframes popBadge {
    0% { transform: scale(0.5); }
    80% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }

  @media (max-width: 380px) {
    .ios-nav-header {
      padding: 8px 12px;
    }

    .brand-title {
      font-size: 1.05rem;
    }

    .btn-cart-nav {
      width: 34px;
      height: 34px;
    }

    .cart-icon {
      font-size: 1.05rem;
    }
  }
</style>
