/**
 * ==============================================================================
 * Messenger Hands-Free Bulk Delete Loop (With Safe Delay)
 * ==============================================================================
 * How it works:
 * - Automatically finds the topmost chat in your conversation list.
 * - Simulates user focus and right-click/menu actions to reveal options.
 * - Clicks "Delete chat" / "Leave group" and confirms the modal.
 * - Waits for a 5-second cooldown to help mitigate Facebook rate limits.
 *
 * Usage:
 * 1. Open https://www.messenger.com on desktop (Brave, Chrome, Edge).
 * 2. Press F12 -> Go to the Console tab.
 * 3. Paste this code and press Enter.
 * 4. Sit back and watch it delete row by row!
 * 5. To stop: Type stopDeleting() or refresh the page (F5).
 * ==============================================================================
 */

(async function bulkDeleteMessengerChats() {
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  console.log("%c🚀 Hands-Free Bulk Chat Deleter Started...", "color: #00ff00; font-size: 14px; font-weight: bold;");
  console.log("🛑 To stop: Type stopDeleting() in console or press F5.");

  let count = 0;
  window._stopDeleting = false;

  window.stopDeleting = () => {
    window._stopDeleting = true;
    console.log("%c🛑 Deletion loop stopped by user!", "color: red; font-weight: bold;");
  };

  function forceClick(element) {
    const opts = { bubbles: true, cancelable: true, view: window };
    element.focus();
    element.dispatchEvent(new MouseEvent('mousedown', opts));
    element.dispatchEvent(new MouseEvent('mouseup', opts));
    element.click();
  }

  function simulateRightClick(element) {
    const rect = element.getBoundingClientRect();
    const evt = new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
      view: window,
      button: 2,
      buttons: 2,
      clientX: rect.left + rect.width / 2,
      clientY: rect.top + rect.height / 2
    });
    element.dispatchEvent(evt);
  }

  while (!window._stopDeleting) {
    try {
      // 1. Locate the first conversation in the list
      const chatLinks = Array.from(document.querySelectorAll('a[href*="/t/"], a[href*="/e2ee/t/"]'));
      if (!chatLinks || chatLinks.length === 0) {
        console.log("⚠️ No more chats found in the sidebar. All done!");
        break;
      }

      const firstChat = chatLinks[0];
      const row = firstChat.closest('[role="row"]') || firstChat.parentElement.parentElement || firstChat;

      // Trigger hover
      firstChat.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
      firstChat.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      await delay(600);

      // 2. Look for the three dots button
      const allButtons = Array.from(row.querySelectorAll('div[role="button"], button, [aria-haspopup="menu"]'));
      let dotsBtn = allButtons.find(b => {
        if (b === firstChat) return false;
        const label = (b.getAttribute('aria-label') || '').toLowerCase();
        const hasPopup = b.getAttribute('aria-haspopup') === 'menu';
        const hasSvg = !!b.querySelector('svg');
        return hasPopup || label.includes('menu') || label.includes('more') || label.includes('action') || hasSvg;
      });

      if (dotsBtn) {
        forceClick(dotsBtn);
        console.log("👉 Clicked 3-dots button...");
      } else {
        console.log("👉 3-dots not visible; using ContextMenu (Right-click)...");
        simulateRightClick(firstChat);
      }

      await delay(1200);

      // 3. Select 'Delete chat' or 'Leave group' from the dropdown
      const menuItems = Array.from(document.querySelectorAll('[role="menuitem"], [role="button"], div, span'));
      const deleteOption = menuItems.find(el => {
        const text = (el.innerText || el.textContent || '').trim().toLowerCase();
        return text.includes('delete chat') || text.includes('delete conversation') || text.includes('leave group');
      });

      if (!deleteOption) {
        console.log("⚠️ Delete option not found in menu. Dismissing...");
        document.body.click();
        await delay(2000);
        continue;
      }

      forceClick(deleteOption);
      console.log("👉 Selected 'Delete' option...");

      // 4. Wait for and confirm the modal dialog
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

      if (confirmBtn) {
        forceClick(confirmBtn);
        count++;
        console.log(`%c✅ [${count}] Conversation deleted successfully!`, "color: #00ff00; font-weight: bold;");
      }

      // Safe Delay of 5 seconds to reduce rate limit triggers
      console.log("⏳ Waiting 5 seconds before next chat (Rate Limit Safety)...");
      await delay(5000);

    } catch (err) {
      console.error("Encountered error:", err);
      await delay(3000);
    }
  }

  console.log(`%c🎉 Completed! Total conversations deleted: ${count}`, "color: #00ff00; font-size: 16px; font-weight: bold;");
})();
