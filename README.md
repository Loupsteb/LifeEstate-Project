# Projet de soutenance - Life Estate

# Présentation

Ce projet a pour but de permettre de créer des nft représentant des biens immobiliers viagers et de les vendre sous forme de parts de type ERC1155. Chaque bien est indépendant et peut être vendu en totalité ou en partie a travers une phase de mint. Par la suite les possesseurs de parts peuvent les revendre sur le marché secondaire.

---

## Vidéo de présentation

**Loom**: https://www.loom.com/share/18cd68aafb744f50a13fd528160d2071?sid=5328882a-1d93-49fc-a10e-a7269105e9c1

---

## Equipe

**Dévelopeur** : Esteban Loup

**Consultants** : Piazza Cedric - Segura Manuel - Dahbi Youssouf

---

## Deploiement

- Lien déploiement : https://life-estate-project.vercel.app
- Factory address : 0xb14b5D3d17Bcde4A287a28fb8B759b6Be4E249ED
- Marketplace address : 0xF13d1377b4AE31804d01cB39f353F025C62EC250
- LUSDT address : 0x047a81b38BDd6566d00d407870aAaa87fbbAaa0C

---

## Stack

Voici la liste de la stack utilisée pour ce projet :

- HardHat
- Viem
- Wagmi
- RainbowKit
- NExtJs
- Tailwind
- Vercel

## Scénario

- je me connecte avec l'adresse du owner : j'accède à la page admin
- en tant qu'owner je créé une propriété avec des spécificités précises
- en tant qu'owner je créé les parts associées avec la supply disponible pour le mint et le prix associé a chaque part
- Je soumet ma demande et inscrit le bien sur la blockchain

---

- en tant qu'utilisateur de la plateforme j'accede a la page de mint
- en tant qu'utilisateur je selectionne l'adresse de la propriété
- en tant qu'utilisateur je selectionne l'adresse de token que je souhaite pour payer
- en tant qu'utilisateur je rentre l'id de la part que je souhaite acheter
- en tant qu'utilisateur je rentre le nombre de part que je souhaite acheter
- en tant qu'utilisateur je confirme mon choix en cliquant sur mint

---

## Stack

- en tant qu'utilisateur j'accede à la page de market place
- en tant qu'utilisateur je vais dans la section achat
- en tant qu'utilisateur je clique sur le bouton acheter de l'annonce qui m'intéresse

---

- en tant que vendeur de part je vais dans la section market place
- en tant que vendeur de part je vais dans la section vente
- en tant que vendeur de part je mentionne le montant de part que je souhaite vendre
- en tant que vendeur de part je mentionne le prix de vente auquel je souhaite vendre mes parts
- en tant que vendeur de part je clique sur le bouton vendre afin de confirmer la mise en ligne de mon annonce

## Usage Local

- Clone de projet : git clone [https://github.com/Loupsteb/LifeEstate-Project](https://github.com/Loupsteb/LifeEstate-Project)
- cd life-estate
- cd backend : npm install cd frontend/LifeEstate-Project : npm install
- Lancement de hardhat node : npx hardhat node
- Backend : cd backend && npx hardhat run scripts/deploy.js --network localhost
- ## Frontend : cd frontend && npm run dev

## Scénario

- je me connecte avec l'adresse du owner : j'accède à la page admin
- en tant qu'owner je créé une propriété avec des spécificités précises
- en tant qu'owner je créé les parts associées avec la supply disponible pour le mint et le prix associé a chaque part
- Je soumet ma demande et inscrit le bien sur la blockchain

---

- en tant qu'utilisateur de la plateforme j'accede a la page de mint
- en tant qu'utilisateur je selectionne l'adresse de la propriété
- en tant qu'utilisateur je selectionne l'adresse de token que je souhaite pour payer
- en tant qu'utilisateur je rentre l'id de la part que je souhaite acheter
- en tant qu'utilisateur je rentre le nombre de part que je souhaite acheter
- en tant qu'utilisateur je confirme mon choix en cliquant sur mint

---

- en tant qu'utilisateur j'accede à la page de market place
- en tant qu'utilisateur je vais dans la section achat
- en tant qu'utilisateur je clique sur le bouton acheter de l'annonce qui m'intéresse

---

- en tant que vendeur de part je vais dans la section market place
- en tant que vendeur de part je vais dans la section vente
- en tant que vendeur de part je mentionne le montant de part que je souhaite vendre
- en tant que vendeur de part je mentionne le prix de vente auquel je souhaite vendre mes parts
- en tant que vendeur de part je clique sur le bouton vendre afin de confirmer la mise en ligne de mon annonce

## Usage Local

- Clone de projet : git clone [https://github.com/Loupsteb/LifeEstate-Project](https://github.com/Loupsteb/LifeEstate-Project)
- cd life-estate
- cd backend : npm install cd frontend/LifeEstate-Project : npm install
- Lancement de hardhat node : npx hardhat node
- Backend : cd backend && npx hardhat run scripts/deploy.js --network localhost
- Frontend : cd frontend && npm run dev
