<script>
  export let restaurant;

  function openTray() {
    hapticLight();
    isDrawerOpen.set(true);
  }
</script>

<header class="ios-nav-header">
  <div class="nav-inner">
    <!-- Brand & Subtitle -->
    <div class="brand-group">
      <div class="brand-icon-box" title="New Diamond Cafe">
        <svg
          class="diamond-icon-svg"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
        >
          <path
            d="M6 3H18L22 9L12 22L2 9L6 3Z"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M2 9H22"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M12 22L7 9L10 3"
            stroke="currentColor"
            stroke-width="1.4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M12 22L17 9L14 3"
            stroke="currentColor"
            stroke-width="1.4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <div class="brand-text">
        <h1 class="brand-title">{restaurant.name}</h1>
        {#if restaurant.subtitle}
          <span class="brand-subtitle">{restaurant.subtitle}</span>
        {/if}
      </div>
    </div>

    <!-- Digital Menu / OruPOS Badge Link -->
    <a
      href="https://orupos.in"
      target="_blank"
      rel="noopener noreferrer"
      class="menu-status-badge"
      title="Powered by OruPOS • Modern Hospitality Software"
    >
      <span class="pulse-dot"></span>
      <span class="badge-text">by <strong>orupos.in</strong></span>
    </a>
  </div>
</header>

<style>
  .ios-nav-header {
    position: sticky;
    top: 0;
    z-index: 800;
    background: rgba(242, 242, 247, 0.92);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 0.5px solid var(--ios-separator);
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

  .brand-icon-box {
    width: 36px;
    height: 36px;
    border-radius: 9px;
    background: linear-gradient(145deg, #18181B 0%, #09090B 100%);
    color: #F8FAFC;
    border: 1px solid rgba(255, 255, 255, 0.16);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .diamond-icon-svg {
    filter: drop-shadow(0 1px 2px rgba(255, 255, 255, 0.2));
  }

  .brand-text {
    display: flex;
    flex-direction: column;
  }

  .brand-title {
    font-size: 1.15rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--text-primary);
    margin: 0;
    line-height: 1.15;
  }

  .brand-subtitle {
    font-size: 0.7rem;
    font-weight: 600;
    color: var(--text-muted);
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }

  .menu-status-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #FFFFFF;
    border: 0.5px solid var(--ios-separator);
    border-radius: var(--radius-pill);
    padding: 5px 12px;
    font-size: 0.74rem;
    color: var(--text-secondary);
    text-decoration: none;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
    transition: all 0.15s ease;
  }

  .menu-status-badge:hover {
    background: #000000;
    color: #FFFFFF;
    border-color: #000000;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  }

  .badge-text strong {
    font-weight: 700;
  }

  .pulse-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent-emerald);
  }
</style>
