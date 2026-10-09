<script>
  import { Check, X, Plus } from '@lucide/svelte';
  import { isReceiptOpen, activeOrder } from '../stores/cart.js';

  function closeReceipt() {
    isReceiptOpen.set(false);
  }

  function handleBackdropKey(e) {
    if (e.key === 'Escape') closeReceipt();
  }
</script>

{#if $isReceiptOpen && $activeOrder}
  <div
    class="ios-backdrop"
    on:click={closeReceipt}
    on:keydown={handleBackdropKey}
    role="presentation"
  >
    <div
      class="receipt-sheet"
      on:click|stopPropagation
      on:keydown|stopPropagation
      role="dialog"
      aria-modal="true"
      aria-labelledby="receipt-title"
      tabindex="-1"
    >
      <button class="btn-sheet-close" type="button" on:click={closeReceipt} aria-label="Close">
        <X size={16} />
      </button>

      <!-- Checkmark -->
      <div class="receipt-icon-circle">
        <Check size={28} strokeWidth={3} />
      </div>

      <div class="receipt-header">
        <div class="receipt-status">Order Confirmed</div>
        <h2 class="receipt-code" id="receipt-title">Order {$activeOrder.orderCode}</h2>
        <p class="receipt-meta">Table 08 &bull; Sent to kitchen at {$activeOrder.placedAt}</p>
      </div>

      <!-- Live tracker steps -->
      <div class="tracker-card">
        <div class="step-item active">
          <div class="step-indicator done">✓</div>
          <div>
            <div class="step-label">Order Received</div>
            <div class="step-time">Logged for Table 08</div>
          </div>
        </div>

        <div class="step-item active">
          <div class="step-indicator in-progress">●</div>
          <div>
            <div class="step-label">Kitchen Preparing</div>
            <div class="step-time">Est. 15–20 mins</div>
          </div>
        </div>

        <div class="step-item">
          <div class="step-indicator pending">○</div>
          <div>
            <div class="step-label">Serve to Table 08</div>
            <div class="step-time">Captain will deliver to table</div>
          </div>
        </div>
      </div>

      <!-- Receipt Docket Details -->
      <div class="docket-card">
        <div class="docket-list">
          {#each $activeOrder.items as item}
            <div class="docket-row">
              <span class="docket-qty">{item.quantity}×</span>
              <span class="docket-name">{item.dish.name}</span>
              <span class="docket-price">₹{item.unitPrice * item.quantity}</span>
            </div>
          {/each}
        </div>

        {#if $activeOrder.kitchenNote}
          <div class="docket-note">Note: "{$activeOrder.kitchenNote}"</div>
        {/if}

        <div class="docket-total">
          <span>Total Amount</span>
          <span>₹{$activeOrder.grandTotal}</span>
        </div>
      </div>

      <!-- Action -->
      <div class="receipt-footer">
        <button class="btn-apple-primary btn-apple-center" type="button" on:click={closeReceipt}>
          <Plus size={18} strokeWidth={2.5} />
          <span class="btn-label">Add More Dishes</span>
        </button>
      </div>

    </div>
  </div>
{/if}

<style>
  .receipt-sheet {
    background: #FFFFFF;
    width: 100%;
    max-width: 440px;
    border-radius: 20px;
    padding: 24px 20px 20px;
    position: relative;
    box-shadow: var(--shadow-float);
    animation: sheetScale 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    text-align: center;
    max-height: 88vh;
    overflow-y: auto;
  }

  @keyframes sheetScale {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }

  .btn-sheet-close {
    position: absolute;
    top: 14px;
    right: 14px;
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

  .receipt-icon-circle {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: #E8F8EE;
    color: var(--accent-emerald);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 12px;
  }

  .receipt-status {
    font-size: 0.76rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--accent-emerald);
    margin-bottom: 2px;
  }

  .receipt-code {
    font-size: 1.45rem;
    font-weight: 800;
    color: var(--text-primary);
    margin: 0 0 2px;
  }

  .receipt-meta {
    font-size: 0.8rem;
    color: var(--text-muted);
    margin: 0 0 18px;
  }

  .tracker-card {
    background: var(--ios-bg);
    border-radius: var(--radius-sm);
    padding: 12px 14px;
    text-align: left;
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 14px;
  }

  .step-item {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .step-indicator {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.72rem;
    font-weight: 700;
  }

  .step-indicator.done {
    background: var(--accent-emerald);
    color: #FFFFFF;
  }

  .step-indicator.in-progress {
    background: #000000;
    color: #FFFFFF;
  }

  .step-indicator.pending {
    background: #E5E5EA;
    color: var(--text-muted);
  }

  .step-label {
    font-size: 0.82rem;
    font-weight: 700;
    color: var(--text-primary);
  }

  .step-time {
    font-size: 0.72rem;
    color: var(--text-muted);
  }

  .docket-card {
    background: var(--ios-bg);
    border-radius: var(--radius-sm);
    padding: 12px 14px;
    text-align: left;
    margin-bottom: 16px;
  }

  .docket-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding-bottom: 8px;
    border-bottom: 0.5px solid var(--ios-separator);
  }

  .docket-row {
    display: flex;
    align-items: center;
    font-size: 0.82rem;
  }

  .docket-qty {
    font-weight: 700;
    margin-right: 6px;
    color: var(--text-secondary);
  }

  .docket-name {
    flex-grow: 1;
    font-weight: 600;
    color: var(--text-primary);
  }

  .docket-price {
    font-weight: 700;
    color: var(--text-primary);
  }

  .docket-note {
    font-size: 0.76rem;
    color: var(--text-muted);
    font-style: italic;
    padding: 6px 0;
    border-bottom: 0.5px solid var(--ios-separator);
  }

  .docket-total {
    display: flex;
    justify-content: space-between;
    padding-top: 8px;
    font-size: 0.95rem;
    font-weight: 800;
    color: var(--text-primary);
  }
</style>
