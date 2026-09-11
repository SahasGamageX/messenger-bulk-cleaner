# 🚀 Facebook Messenger Chat & Group Bulk Deleter

A lightweight JavaScript automation toolset to quickly delete conversations and leave group chats on [Messenger Web](https://www.messenger.com). Runs directly in your desktop browser console (Brave, Chrome, Edge, Firefox).

---

## 📁 Repository Contents

| File | Mode | Description |
|---|---|---|
| [`auto-delete-hover.js`](./auto-delete-hover.js) | **Hover Assisted (Fast & Reliable)** | Automatically detects the 3-dots menu when your mouse hovers over a chat, opens the menu, and auto-confirms the deletion. |
| [`bulk-delete-timer.js`](./bulk-delete-timer.js) | **Hands-Free Loop (5s Cooldown)** | Runs automatically in a loop deleting chats top-to-bottom with a 5-second safety delay to reduce rate-limit detection. |

---

## ⚙️ How to Use

### Method 1: Hover Auto-Delete (Recommended)
1. Open [Messenger Web](https://www.messenger.com) in your desktop browser (**Brave**, **Chrome**, or **Edge**).
2. Open DevTools:
   - Press **`F12`** or right-click anywhere and select **Inspect**.
   - Switch to the **Console** tab.
3. *(If prompted with a paste warning)*: Type `allow pasting` and press **Enter**.
4. Copy the entire contents of [`auto-delete-hover.js`](./auto-delete-hover.js), paste into the console, and press **Enter**.
5. **Just glide your mouse cursor over the conversations in your chat list** — the script detects the menu and completes the entire deletion and confirmation automatically!
6. To stop: Press **`F5`** (Refresh the page).

---

### Method 2: Hands-Free Bulk Delete Loop
1. Open [Messenger Web](https://www.messenger.com) and go to the **Console** (`F12`).
2. Copy the entire contents of [`bulk-delete-timer.js`](./bulk-delete-timer.js), paste, and press **Enter**.
3. The script will automatically delete chats one by one with a 5-second pause between each.
4. To stop: Type `stopDeleting()` in the console or press **`F5`**.

---

## ⚠️ Important Disclaimer & Safety

- **Account Restrictions**: Rapid bulk deletions can trigger Meta's anti-bot/spam detection. Use responsibly and avoid deleting hundreds of conversations without taking breaks.
- **Permanent Deletion**: Once deleted, conversation history cannot be recovered.
- **Language**: Make sure your Facebook/Messenger interface language is set to **English (US)** for text matching.

---

## 📄 License
MIT License - Free to use and modify.
