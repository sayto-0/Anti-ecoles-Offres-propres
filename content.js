function estUneOffreDEcole(texte, blacklist) {
  return blacklist.some((mot) => texte.includes(mot.toLowerCase()));
}

// 🔹 Hellowork
function filtrerHellowork(blacklist) {
  const offres = document.querySelectorAll('li[data-id-storage-target="item"]');
  let totalAnalysées = 0;
  let totalSupprimées = 0;

  console.groupCollapsed(`🔍 Analyse de ${offres.length} offres Hellowork`);

  offres.forEach((offre, index) => {
    const texteOffre = offre.innerText.toLowerCase().trim();
    if (!texteOffre || texteOffre.length < 5) {
      console.log(`⛔ Offre #${index} : contenu vide`);
      return;
    }
    totalAnalysées++;
    const motTrouvé = blacklist.find((mot) =>
      texteOffre.includes(mot.toLowerCase())
    );
    if (motTrouvé) {
      console.log(
        `❌ Offre #${index} SUPPRIMÉE - Mot trouvé : "${motTrouvé}"`,
        texteOffre
      );
      offre.remove();
      totalSupprimées++;
    } else {
      console.log(`✅ Offre #${index} OK`);
    }
  });

  console.groupEnd();
  console.info(
    `📊 Résultat Hellowork : ${totalSupprimées}/${totalAnalysées} supprimées`
  );
  enregistrerStats(totalSupprimées, totalAnalysées, "Hellowork");
}

// 🌸 Indeed
function filtrerIndeed(blacklist) {
  const offres = document.querySelectorAll("li.css-1ac2h1w.eu4oa1w0");
  let totalAnalysées = 0;
  let totalSupprimées = 0;

  console.groupCollapsed(`🔍 Analyse de ${offres.length} offres Indeed`);

  offres.forEach((offre, index) => {
    const texteOffre = offre.innerText.toLowerCase().trim();
    if (!texteOffre || texteOffre.length < 5) {
      console.log(`⛔ Offre #${index} : contenu vide`);
      return;
    }
    totalAnalysées++;
    const motTrouvé = blacklist.find((mot) =>
      texteOffre.includes(mot.toLowerCase())
    );
    if (motTrouvé) {
      console.log(`❌ Offre #${index} SUPPRIMÉE - Mot trouvé : "${motTrouvé}"`);
      offre.remove();
      totalSupprimées++;
    } else {
      console.log(`✅ Offre #${index} OK`);
    }
  });

  console.groupEnd();
  console.info(
    `📊 Résultat Indeed : ${totalSupprimées}/${totalAnalysées} supprimées`
  );
  enregistrerStats(totalSupprimées, totalAnalysées, "Indeed");
}

// 🐯 Welcome to the Jungle
function filtrerWTTJ(blacklist) {
  const offres = document.querySelectorAll(
    'li[data-testid="search-results-list-item-wrapper"]'
  );
  let totalAnalysées = 0;
  let totalSupprimées = 0;

  console.groupCollapsed(`🔍 Analyse de ${offres.length} offres WTTJ`);

  offres.forEach((offre, index) => {
    const texteOffre = offre.innerText.toLowerCase().trim();
    if (!texteOffre || texteOffre.length < 5) {
      console.log(`⛔ Offre #${index} vide`);
      return;
    }
    totalAnalysées++;
    const motTrouvé = blacklist.find((mot) =>
      texteOffre.includes(mot.toLowerCase())
    );
    if (motTrouvé) {
      console.log(`❌ Offre #${index} SUPPRIMÉE - Mot trouvé : "${motTrouvé}"`);
      offre.remove();
      totalSupprimées++;
    } else {
      console.log(`✅ Offre #${index} OK`);
    }
  });

  console.groupEnd();
  console.info(
    `📊 Résultat WTTJ : ${totalSupprimées}/${totalAnalysées} supprimées`
  );
  enregistrerStats(totalSupprimées, totalAnalysées, "WTTJ");
}

// 🧾 Stockage commun
function enregistrerStats(supprimées, analysées, site) {
  if (!chrome.runtime?.id) return;

  // Envoi des stats immédiates au popup (sans stockage permanent)
  chrome.runtime.sendMessage({
    action: "majStats",
    supprimées,
    analysées,
    site,
  });

  // Facultatif : historique CSV
  if (supprimées > 0) {
    chrome.storage.local.get("offresSupprimées", (data) => {
      const historique = data.offresSupprimées || [];
      const now = new Date().toLocaleString();
      historique.push({
        site,
        titre: `${supprimées} offre(s) supprimée(s)`,
        date: now,
      });
      chrome.storage.local.set({ offresSupprimées: historique });
    });
  }
}

// 🚀 Lancer le filtrage
function lancerFiltrage() {
  try {
    const site = window.location.hostname; // ← déplacer ici
    chrome.storage.local.get(["blacklist", "filterEnabled"], (result) => {
      if (result.filterEnabled === false) return;

      const blacklist = result.blacklist || [];

      if (site.includes("hellowork")) {
        filtrerHellowork(blacklist);
      } else if (site.includes("indeed")) {
        filtrerIndeed(blacklist);
      } else if (site.includes("welcometothejungle")) {
        filtrerWTTJ(blacklist);
      }
    });
    console.log(
      `✅ Filtrage terminé sur ${site} à ${new Date().toLocaleTimeString()}`
    );
  } catch (e) {
    console.warn("❌ Erreur dans lancerFiltrage :", e.message);
  }
}

// ⏱ Retard au démarrage pour éviter conflits DOM
setTimeout(lancerFiltrage, 1500);

// 👀 Sur mutation du DOM
const observer = new MutationObserver(() => {
  lancerFiltrage();
  observer.disconnect();
});
observer.observe(document.body, { childList: true, subtree: true });

// 🔄 Depuis popup
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "rechargerBlacklist") {
    lancerFiltrage();
  }
});
