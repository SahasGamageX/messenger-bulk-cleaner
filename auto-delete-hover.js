/**
 * ==============================================================================
 * Messenger Hover Auto-Delete Script (Recommended)
 * ==============================================================================
 * How it works:
 * - When you hover your mouse cursor over any conversation, Meta generates the
 *   three-dots ("...") menu button.
 * - This script instantly detects that button, triggers the click, selects
 *   "Delete chat" / "Leave group", and automatically confirms the deletion.
 *
 * Usage:
 * 1. Open https://www.messenger.com on desktop (Brave, Chrome, Edge).
 * 2. Press F12 -> Go to the Console tab.
 * 3. Paste this code and press Enter.
 * 4. Simply hover your mouse over each chat in your inbox!
 * 5. To stop: Refresh the page (F5).
 * ==============================================================================
 */

(function setupHoverAutoDelete() {
  console.log("%c🎯 Fully Automated Hover Delete is ACTIVE!", "color: #00ff00; font-size: 15px; font-weight: bold;");
  console.log("👉 Move your mouse cursor over any conversation in the list — it will automatically delete!");
  console.log("🛑 To stop: Press F5 (Refresh page).");

  let isBusy = false;
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  // Force dispatch of all mouse click events for Meta's React framework
  function forceClick(element) {
    const opts = { bubbles: true, cancelable: true, view: window };
    element.focus();
    element.dispatchEvent(new MouseEvent('mousedown', opts));
    element.dispatchEvent(new MouseEvent('mouseup', opts));
    element.click();
  }

  async function detectAndAutoDelete() {
    if (isBusy) return;

    // Search for all active buttons rendered in the DOM
    const allButtons = Array.from(document.querySelectorAll('div[role="button"], button, [aria-haspopup="menu"]'));

    const activeMenuBtn = allButtons.find(btn => {
      // Must belong to the conversation list (avoids clicking profile/logout menu)
      const row = btn.closest('[role="row"]') || btn.closest('li') || btn.parentElement;
      const isInsideChat = row && (row.querySelector('a[href*="/t/"], a[href*="/e2ee/t/"]') || btn.closest('a[href*="/t/"]'));
      if (!isInsideChat) return false;

      // Must be visible on the viewport
      const rect = btn.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0 || rect.top < 0 || rect.bottom > window.innerHeight) return false;

      const label = (btn.getAttribute('aria-label') || '').toLowerCase();
      const hasPopup = btn.getAttribute('aria-haspopup') === 'menu';
      const hasSvg = !!btn.querySelector('svg');

      return hasPopup || label.includes('menu') || label.includes('more') || label.includes('action') || hasSvg;
    });

    if (activeMenuBtn) {
      isBusy = true;
      try {
        console.log("🎯 Menu button detected! Opening menu...");
        forceClick(activeMenuBtn);
        await delay(400);

        // 1. Find and click 'Delete chat' or 'Leave group'
        const menuItems = Array.from(document.querySelectorAll('[role="menuitem"], [role="button"], div, span'));
        const deleteOption = menuItems.find(el => {
          const text = (el.innerText || el.textContent || '').trim().toLowerCase();
          return text.includes('delete chat') || text.includes('delete conversation') || text.includes('leave group');
        });

        if (!deleteOption) {
          document.body.click();
          await delay(800);
          isBusy = false;
          return;
        }

        forceClick(deleteOption);
        console.log("👉 Selected 'Delete' from dropdown...");

        // 2. Poll for the final confirmation dialog (up to 1.5 seconds)
        let confirmBtn = null;
        for (let i = 0; i < 15; i++) {
          await delay(100);
          const dialog = document.querySelector('[role="dialog"]');
          if (dialog) {
            const btns = Array.from(dialog.querySelectorAll('[role="button"], button'));
            confirmBtn = btns.find(b => {
              const t = (b.innerText || b.textContent || '').trim().toLowerCase();
              const aria = (b.getAttribute('aria-label') || '').toLowerCase();
              if (t.includes('cancel') || aria.includes('close')) return false;
              return t.includes('delete') || t.includes('leave') || aria.includes('delete') || aria.includes('leave');
            });
            if (confirmBtn) break;
          }
        }

        // 3. Auto-click the final confirm button
        if (confirmBtn) {
          forceClick(confirmBtn);
          console.log("%c🔥 [DONE] Chat deleted successfully!", "color: #00ff00; font-weight: bold;");
        } else {
          console.log("⚠️ Confirmation button not found.");
        }

        // Short pause between deletions
        await delay(1500);
      } catch (err) {
        console.error("Error during deletion:", err);
      } finally {
        isBusy = false;
      }
    }
  }

  // Poll every 250ms for the visible 3-dots button under cursor
  setInterval(detectAndAutoDelete, 250);
})();
