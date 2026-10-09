<script>
  import { X, Trash2, Plus, Minus, ShoppingBag } from '@lucide/svelte';
  import { isDrawerOpen, isReceiptOpen, cartSummary, updateQuantity, removeItem, clearCart, activeOrder } from '../stores/cart.js';
  import { hapticLight, hapticSuccess } from '../utils/haptics.js';

  let kitchenNote = '';
  let isTransmitting = false;

  function closeDrawer() {
    isDrawerOpen.set(false);
  }

  function handleBackdropKey(e) {
    if (e.key === 'Escape') closeDrawer();
  }

  function handlePlaceOrder() {
    if ($cartSummary.entries.length === 0) return;

    isTransmitting = true;

    setTimeout(() => {
      const orderCode = `#${Math.floor(1000 + Math.random() * 9000)}`;
      const now = new Date();
      const placedAt = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      activeOrder.set({
        orderCode,
        items: [...$cartSummary.entries],
        subtotal: $cartSummary.subtotal,
        taxes: $cartSummary.taxes,
        grandTotal: $cartSummary.grandTotal,
        kitchenNote: kitchenNote.trim(),
        placedAt
      });

      isTransmitting = false;
      kitchenNote = '';
      clearCart();
      closeDrawer();
      hapticSuccess();

      setTimeout(() => {
        isReceiptOpen.set(true);
      }, 200);
    }, 1000);
  }

  function inc(key) {
    hapticLight();
    updateQuantity(key, 1);
  }

  function dec(key) {
    hapticLight();
    updateQuantity(key, -1);
  }

</script>

{#if $isDrawerOpen}
  <div
    class="ios-backdrop"
    on:click={closeDrawer}
    on:keydown={handleBackdropKey}
    role="presentation"
  >
    <div
      class="ios-drawer-sheet"
      on:click|stopPropagation
      on:keydown|stopPropagation
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-title"
      tabindex="-1"
    >
      <div class="sheet-handle-bar"></div>

      <!-- Drawer Header -->
      <div class="drawer-header">
        <div>
          <div class="table-pill">Table 08</div>
          <h2 class="drawer-title" id="drawer-title">Your Order</h2>
        </div>

        <button class="btn-sheet-close" type="button" on:click={closeDrawer} aria-label="Close">
          <X size={16} />
        </button>
      </div>

      <!-- Content -->
      {#if $cartSummary.entries.length === 0}
        <div class="empty-state">
          <div class="empty-icon">
            <ShoppingBag size={28} />
          </div>
          <h3>Your tray is empty</h3>
          <p>Tap + ADD on any dish to begin your order.</p>
          <button class="btn-apple-secondary" type="button" on:click={closeDrawer}>
            Browse Menu
          </button>
        </div>
      {:else}
        <div class="drawer-body no-scrollbar">
          
          <!-- Items List -->
          <div class="items-list">
            {#each $cartSummary.entries as entry (entry.key)}
              <div class="drawer-item-row">
                <img src={entry.dish.image} alt={entry.dish.name} class="item-thumb" />

                <div class="item-text">
                  <div class="item-name">{entry.dish.name}</div>
                  {#if entry.spiceLevel}
                    <div class="item-sub">{entry.spiceLevel}</div>
                  {/if}
                  <div class="item-price">₹{entry.unitPrice * entry.quantity}</div>
                </div>

                <div class="item-stepper-wrap">
                  <div class="ios-stepper">
                    <button type="button" on:click={() => dec(entry.key)} aria-label="Decrease">
                      <Minus size={12} strokeWidth={2.5} />
                    </button>
                    <span>{entry.quantity}</span>
                    <button type="button" on:click={() => inc(entry.key)} aria-label="Increase">
                      <Plus size={12} strokeWidth={2.5} />
                    </button>
                  </div>

                  <button
                    type="button"
                    class="btn-trash"
                    on:click={() => { hapticLight(); removeItem(entry.key); }}
                    title="Remove item"
                    aria-label="Remove item"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            {/each}
          </div>

          <!-- Note for kitchen -->
          <div class="note-box">
            <input
              type="text"
              class="note-input"
              placeholder="Add note for kitchen (e.g. less spicy)..."
              bind:value={kitchenNote}
            />
          </div>

          <!-- Bill Breakdown -->
          <div class="bill-box">
            <div class="bill-row">
              <span>Subtotal</span>
              <span>₹{$cartSummary.subtotal}</span>
            </div>
            <div class="bill-row">
              <span>Taxes (5% GST)</span>
              <span>₹{$cartSummary.taxes}</span>
            </div>
            <div class="bill-divider"></div>
            <div class="bill-row total-row">
              <span>Total</span>
              <span>₹{$cartSummary.grandTotal}</span>
            </div>
          </div>

        </div>

        <!-- Sticky Footer Action -->
        <div class="drawer-footer">
          <button
            class="btn-apple-primary"
            type="button"
            disabled={isTransmitting}
            on:click={handlePlaceOrder}
          >
            <span class="btn-label">
              {#if isTransmitting}
                Sending to Kitchen...
              {:else}
                Place Order • Table 08
              {/if}
            </span>
            <span class="btn-price-badge">₹{$cartSummary.grandTotal}</span>
          </button>
        </div>
      {/if}

    </div>
  </div>
{/if}

<style>
  .ios-drawer-sheet {
    background: #FFFFFF;
    width: 100%;
    max-width: 480px;
    border-radius: 20px 20px 0 0;
    max-height: 88vh;
    display: flex;
    flex-direction: column;
    position: relative;
    box-shadow: var(--shadow-float);
    animation: sheetUp 0.22s cubic-bezier(0.16, 1, 0.3, 1);
  }

  @media (min-width: 640px) {
    .ios-drawer-sheet {
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
    margin: 10px auto 2px;
  }

  .drawer-header {
    padding: 12px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 0.5px solid var(--ios-separator);
  }

  .table-pill {
    display: inline-block;
    background: #000000;
    color: #FFFFFF;
    font-size: 0.68rem;
    font-weight: 700;
    padding: 2px 7px;
    border-radius: var(--radius-xs);
    margin-bottom: 2px;
  }

  .drawer-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0;
  }

  .btn-sheet-close {
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

  .drawer-body {
    padding: 16px 20px;
    overflow-y: auto;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .items-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .drawer-item-row {
    display: flex;
    align-items: center;
    gap: 12px;
    background: var(--ios-bg);
    padding: 10px 12px;
    border-radius: var(--radius-sm);
  }

  .item-thumb {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    object-fit: cover;
    flex-shrink: 0;
  }

  .item-text {
    flex-grow: 1;
    min-width: 0;
  }

  .item-name {
    font-size: 0.88rem;
    font-weight: 700;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .item-sub {
    font-size: 0.72rem;
    color: var(--text-muted);
  }

  .item-price {
    font-size: 0.84rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-top: 2px;
  }

  .item-stepper-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .btn-trash {
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .btn-trash:hover {
    color: var(--accent-red);
  }

  .note-box {
    background: var(--ios-bg);
    border-radius: var(--radius-sm);
    padding: 2px;
  }

  .note-input {
    width: 100%;
    background: transparent;
    border: none;
    padding: 10px 12px;
    font-family: var(--font-system);
    font-size: 0.82rem;
    outline: none;
  }

  .bill-box {
    background: var(--ios-bg);
    border-radius: var(--radius-sm);
    padding: 12px 14px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 0.82rem;
    color: var(--text-secondary);
  }

  .bill-row {
    display: flex;
    justify-content: space-between;
  }

  .bill-divider {
    border-top: 0.5px solid var(--ios-separator);
    margin: 4px 0;
  }

  .total-row {
    font-size: 0.95rem;
    font-weight: 800;
    color: var(--text-primary);
  }

  .drawer-footer {
    padding: 14px 20px;
    border-top: 0.5px solid var(--ios-separator);
    background: #FFFFFF;
  }

  .empty-state {
    padding: 40px 20px;
    text-align: center;
  }

  .empty-icon {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: var(--ios-bg);
    color: var(--text-muted);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 12px;
  }

  .empty-state h3 {
    font-size: 1.15rem;
    margin-bottom: 4px;
  }

  .empty-state p {
    font-size: 0.82rem;
    color: var(--text-muted);
    margin-bottom: 16px;
  }
</style>
