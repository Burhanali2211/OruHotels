<script>
  import { activeOrder, isReceiptOpen, APP_CONFIG } from '../stores/cart.js';

  function openReceipt() {
    isReceiptOpen.set(true);
  }

  function handleKey(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openReceipt();
    }
  }
</script>

{#if APP_CONFIG.isOrderingEnabled && $activeOrder}
  <div
    class="active-banner-ios"
    on:click={openReceipt}
    on:keydown={handleKey}
    role="button"
    tabindex="0"
    aria-label="View active order receipt"
  >
    <div class="banner-inner">
      <div class="banner-left">
        <span class="live-pulse"></span>
        <div class="banner-text">
          <span class="order-tag">
            <i class="lni lni-chef-hat" aria-hidden="true"></i>
            Order {$activeOrder.orderCode} In Kitchen
          </span>
          <span class="table-tag">Freshly Preparing &bull; Est. 15–20 mins</span>
        </div>
      </div>

      <button class="btn-receipt-pill" type="button" on:click|stopPropagation={openReceipt}>
        Receipt
      </button>
    </div>
  </div>
{/if}

<style>
  .active-banner-ios {
    background: #000000;
    color: #FFFFFF;
    padding: 9px 16px;
    cursor: pointer;
    outline: none;
  }

  .banner-inner {
    max-width: var(--max-width);
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .banner-left {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
  }

  .live-pulse {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #34C759;
    box-shadow: 0 0 0 3px rgba(52, 199, 89, 0.3);
    flex-shrink: 0;
  }

  .banner-text {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .order-tag {
    font-size: 0.8rem;
    font-weight: 700;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .table-tag {
    font-size: 0.68rem;
    color: #8E8E93;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .btn-receipt-pill {
    background: rgba(255, 255, 255, 0.2);
    color: #FFFFFF;
    border: none;
    border-radius: var(--radius-pill);
    padding: 4px 12px;
    font-size: 0.74rem;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap !important;
    flex-shrink: 0 !important;
  }
</style>
