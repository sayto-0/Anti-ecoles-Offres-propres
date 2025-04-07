const addBtn = document.getElementById("addBtn");
const newWordInput = document.getElementById("newWord");
const blacklistContainer = document.getElementById("blacklist");
const toggle = document.getElementById("filterToggle");
const statusMsg = document.getElementById("statusMessage");
const statDisplay = document.getElementById("statistiques");
const modeToggle = document.getElementById("modeToggle");

// ✅ Initialisation
addBtn.onclick = addWord;
document.addEventListener("DOMContentLoaded", () => {
  loadBlacklist();
  afficherStats();
  initTheme(); // initialisation du thème ici
});

// 🔄 Réception des stats
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "majStats") {
    statDisplay.textContent = `🧹 ${message.supprimées} offres supprimées sur ${message.analysées}`;
  }
});

// ✅ Chargement de la blacklist
function loadBlacklist() {
  chrome.storage.local.get(["blacklist"], (result) => {
    const blacklist = result.blacklist || [];
    blacklistContainer.innerHTML = "";
    blacklist.forEach((word, index) => {
      const li = document.createElement("li");
      li.textContent = word;
      const btn = document.createElement("button");
      btn.textContent = "❌";
      btn.onclick = () => removeWord(index);
      li.appendChild(btn);
      blacklistContainer.appendChild(li);
    });
  });
}

// ✅ Ajouter un mot
function addWord() {
  const word = newWordInput.value.trim().toLowerCase();
  if (!word) return;

  chrome.storage.local.get(["blacklist"], (result) => {
    const blacklist = result.blacklist || [];
    if (!blacklist.includes(word)) {
      blacklist.push(word);
      chrome.storage.local.set({ blacklist }, () => {
        loadBlacklist();
        notifyContentScript();
      });
    }
  });
  newWordInput.value = "";
}

// ✅ Supprimer un mot
function removeWord(index) {
  chrome.storage.local.get(["blacklist"], (result) => {
    const blacklist = result.blacklist || [];
    blacklist.splice(index, 1);
    chrome.storage.local.set({ blacklist }, () => {
      loadBlacklist();
      notifyContentScript();
    });
  });
}

// ✅ Activation du filtre
chrome.storage.local.get(["filterEnabled"], (result) => {
  toggle.checked = result.filterEnabled !== false;
});

toggle.addEventListener("change", () => {
  chrome.storage.local.set({ filterEnabled: toggle.checked });
  notifyContentScript();
});

// ✅ Notification à content.js
function notifyContentScript() {
  statusMsg.style.display = "none";
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs || tabs.length === 0) return;

    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        func: () => {
          if (typeof lancerFiltrage === "function") {
            lancerFiltrage();
          } else {
            chrome.runtime.sendMessage({ action: "rechargerBlacklist" });
          }
        },
      },
      (results) => {
        if (chrome.runtime.lastError || !results || results.length === 0) {
          statusMsg.textContent = "⚠️ Le filtre ne peut pas s’appliquer ici.";
          statusMsg.style.display = "block";
        } else {
          statusMsg.style.display = "none";
        }
      }
    );
  });
}

// ✅ Export JSON
document.getElementById("exportBtn").onclick = () => {
  chrome.storage.local.get(["blacklist"], (result) => {
    const blob = new Blob([JSON.stringify(result.blacklist || [])], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "blacklist.json";
    a.click();
  });
};

// ✅ Import JSON
document.getElementById("importInput").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (Array.isArray(data)) {
        chrome.storage.local.set({ blacklist: data }, () => {
          loadBlacklist();
          notifyContentScript();
        });
      }
    } catch (err) {
      alert("Fichier invalide");
    }
  };
  reader.readAsText(file);
});

// ✅ Export CSV
document.getElementById("exportCSVBtn").addEventListener("click", () => {
  chrome.storage.local.get("offresSupprimées", (data) => {
    const lignes = ["Site;Titre;Date"]; // ← séparateur ; ici
    (data.offresSupprimées || []).forEach((o) => {
      // On remplace les virgules par des points-virgules dans le titre aussi, par sécurité
      const titre = o.titre.replace(/,/g, " ");
      lignes.push(`${o.site};${titre};${o.date}`);
    });
    const blob = new Blob(["\uFEFF" + lignes.join("\n")], {
      type: "text/csv;charset=utf-8;",
    }); // BOM UTF-8
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "offres_supprimees.csv";
    a.click();
  });
});

// ✅ Recharger le filtre à la demande
document
  .getElementById("btnReload")
  .addEventListener("click", notifyContentScript);

// ✅ Mise à jour des stats en temps réel
chrome.storage.onChanged.addListener(() => afficherStats());

function afficherStats() {
  chrome.storage.local.get(["lastStats"], (result) => {
    if (result.lastStats) {
      statDisplay.textContent = `🧹 ${result.lastStats.supprimées} offres supprimées sur ${result.lastStats.analysées}`;
    }
  });
}

// 🌗 Thème jour/nuit
function applyTheme(theme) {
  document.body.classList.toggle("dark", theme === "dark");
  modeToggle.textContent = theme === "dark" ? "🌞" : "🌙";
}

function initTheme() {
  chrome.storage.local.get(["theme"], (data) => {
    const theme = data.theme || "light";
    applyTheme(theme);
  });

  modeToggle.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark");
    const newTheme = isDark ? "dark" : "light";
    chrome.storage.local.set({ theme: newTheme });
    applyTheme(newTheme);
  });
}
