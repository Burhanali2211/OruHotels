<script>
  import { Check } from '@lucide/svelte';
  import { toast } from '../stores/cart.js';
</script>

{#if $toast.visible}
  <div class="oru-toast-wrapper">
    <div class="oru-toast-glass">
      <div class="toast-icon-wrap">
        <Check size={14} strokeWidth={3} />
      </div>
      <span class="toast-text">{$toast.message}</span>
    </div>
  </div>
{/if}

<style>
  .oru-toast-wrapper {
    position: fixed;
    top: 24px; /* Native iOS notification position */
    left: 50%;
    transform: translateX(-50%);
    z-index: 2000;
    pointer-events: none;
    animation: toastSlideDown 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    width: 90%;
    max-width: 400px;
    display: flex;
    justify-content: center;
  }

  @keyframes toastSlideDown {
    0% { opacity: 0; transform: translate(-50%, -20px) scale(0.9); }
    100% { opacity: 1; transform: translate(-50%, 0) scale(1); }
  }

  .oru-toast-glass {
    background: rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    color: var(--text-primary);
    border-radius: var(--radius-pill);
    padding: 8px 16px 8px 8px;
    font-size: 0.86rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06);
    border: 0.5px solid rgba(0, 0, 0, 0.08);
    width: fit-content;
    max-width: 100%;
  }

  .toast-icon-wrap {
    background: #000000;
    color: #FFFFFF;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .toast-text {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    white-space: normal;
    line-height: 1.35;
    padding-right: 4px;
  }
</style>
