chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "majStats") {
    const { site, supprimées } = message;

    // 🔴 Badge rouge avec le nombre d'offres supprimées
    chrome.action.setBadgeText({ text: `${supprimées}` });
    chrome.action.setBadgeBackgroundColor({ color: "#FF0000" });

    // 🔔 Notification système
    if (supprimées > 0 && chrome.notifications && chrome.notifications.create) {
      const notifId = `notif_${Date.now()}`;
      chrome.notifications.create(notifId, {
        type: "basic",
        iconUrl: "icons/icon.png",
        title: "Anti-Écoles",
        message: `${supprimées} offre(s) supprimée(s) sur ${site}`,
      });
      // Auto-close after 5 seconds
      setTimeout(() => chrome.notifications.clear(notifId), 5000);
    }
  }
});
