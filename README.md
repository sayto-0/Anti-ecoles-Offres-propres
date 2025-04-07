# 🧹 Anti-Écoles – Offres Propres

> Extension Chrome pour supprimer automatiquement les offres d'écoles et de formations sur les sites d'emploi.

## 🔍 Description

**Anti-Écoles** est une extension Chrome qui nettoie votre expérience de recherche d'emploi en **filtrant les offres d’écoles, formations et alternances non souhaitées** sur les sites suivants :

- [Hellowork](https://www.hellowork.com/)
- [Indeed](https://www.indeed.fr/)
- [Welcome to the Jungle](https://www.welcometothejungle.com/)

Idéal si vous êtes **déjà diplômé**, **en poste**, ou simplement en recherche **d’un vrai emploi**, pas d’une école 😅

---

## ⚙️ Fonctionnalités

- 🛑 Suppression automatique des offres contenant certains mots-clés
- 📝 Personnalisation de la blacklist (mots interdits)
- ☑️ Activation/désactivation du filtre à tout moment
- 🔁 Rechargement manuel du filtre
- 💾 Export/Import de la blacklist en JSON
- 📊 Statistiques des offres supprimées
- 📂 Export CSV des suppressions
- 🌗 Mode jour/nuit personnalisable
- 🔔 Notification + badge sur l’icône Chrome

---

## 🚀 Installation manuelle

1. Clone ou télécharge ce repo :
   [`https://github.com/sayto-0/Anti-ecoles-Offres-propres`](https://github.com/sayto-0/Anti-ecoles-Offres-propres)
2. Ouvre `chrome://extensions/` dans Chrome
3. Active le **Mode développeur**
4. Clique sur **"Charger l’extension non empaquetée"**
5. Sélectionne le dossier du projet

---

## 🧪 Comment ça marche ?

L’extension :
- Scrute les offres dès le chargement de page ou lors du scroll
- Compare chaque offre avec les mots de la blacklist
- Supprime l’offre de l’interface si elle correspond
- Enregistre les stats et notifie l’utilisateur

---

## 📦 Code source

👉 Le code est public et disponible ici :  
**https://github.com/sayto-0/Anti-ecoles-Offres-propres**

---

## 📥 Contributions

Suggestions, bugs ou améliorations ?  
Ouvre une issue ou propose une pull request sur GitHub !

---

## 🛡 Permissions utilisées

- `storage` – pour stocker la blacklist et les stats
- `scripting` – pour injecter le filtre
- `notifications` – pour informer l’utilisateur après chaque suppression

---

## 🧠 Idée originale

Créée par **SAYTO** pour retrouver des résultats d’offres plus propres.  
Merci aux sites d'emploi... mais non merci aux pubs déguisées en formations 😉

---


