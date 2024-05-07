export const NavLinks = [
  { id: 0, name: "Főoldal", href: "/" },
  { id: 1, name: "Konferenciák", href: "/konferenciak" },
  { id: 2, name: "Tudományos Cikkek", href: "/tudomanyoscikkek" },
];

export const topicsAndSubtopics = [
  {
    id: "engineering",
    name: "Mérnöki Tudományok",
    subTopics: [
      { id: "mechanical", name: "Gépészmérnöki Innovációk" },
      { id: "electrical", name: "Elektrotechnika és Elektronika" },
      { id: "computerScience", name: "Informatikai Mérnökség" },
      { id: "environmental", name: "Környezetmérnöki Technológiák" },
      { id: "biomedical", name: "Biomedikai Mérnökség" },
      { id: "civil", name: "Építőmérnöki Tudományok" },
      { id: "chemical", name: "Vegyészmérnöki Kutatások" },
      { id: "aerospace", name: "Űrkutatás és Repüléstudományok" },
      { id: "industrial", name: "Ipari és Rendszertervezési Mérnökség" },
      { id: "materials", name: "Anyagmérnöki és Nanotechnológia" },
    ],
  },
  {
    id: "medical",
    name: "Orvosi és Egészségtudomány",
    subTopics: [
      { id: "clinicalResearch", name: "Klinikai Kutatások Új Irányai" },
      { id: "healthTech", name: "Egészségügyi Technológiák" },
      { id: "pharmaceutical", name: "Gyógyszerészeti Innovációk" },
      { id: "publicHealth", name: "Közegészségügy és Epidemológia" },
      { id: "medicalGenetics", name: "Orvosi Genetika" },
      { id: "nursing", name: "Ápolás és Egészségügyi Szolgáltatások" },
      { id: "nutrition", name: "Táplálkozástudomány és Dietetika" },
      { id: "mentalHealth", name: "Mentális Egészség és Pszichoterápia" },
      {
        id: "alternativeMedicine",
        name: "Alternatív Gyógyászat és Természetes Gyógymódok",
      },
      { id: "veterinary", name: "Állatorvostudomány és Állategészségügy" },
    ],
  },
  {
    id: "naturalSciences",
    name: "Természettudományok",
    subTopics: [
      { id: "mathModeling", name: "Matematikai Modellezés" },
      { id: "physics", name: "Fizikai Kísérletek és Elméletek" },
      { id: "chemistry", name: "Kémiai Technológiák" },
      { id: "biology", name: "Biológiai Diverzitás" },
      { id: "geology", name: "Geológia és Földtudományok" },
      {
        id: "environmentalScience",
        name: "Környezettudományok és Fenntarthatóság",
      },
      { id: "astronomy", name: "Csillagászat és Asztronómiai Kutatások" },
      { id: "oceanography", name: "Óceánográfia és Tengeri Tudományok" },
      { id: "meteorology", name: "Meteorológia és Éghajlatkutatás" },
      { id: "botany", name: "Botanika és Növénytudomány" },
    ],
  },
  {
    id: "socialSciences",
    name: "Társadalomtudományok",
    subTopics: [
      {
        id: "politicalScience",
        name: "Politikatudomány és Nemzetközi Kapcsolatok",
      },
      { id: "sociology", name: "Szociológiai Vizsgálatok" },
      { id: "psychology", name: "Pszichológiai Innovációk" },
      { id: "education", name: "Oktatási Technológiák és Pedagógia" },
      { id: "anthropology", name: "Antropológia és Kulturális Kutatások" },
      {
        id: "communicationStudies",
        name: "Kommunikációs Tanulmányok és Média",
      },
      { id: "linguistics", name: "Nyelvészet és Nyelvtudományok" },
      { id: "history", name: "Történettudomány és Historiográfia" },
      { id: "law", name: "Jogtudomány és Jogszabályok" },
    ],
  },
  {
    id: "artsHumanities",
    name: "Művészetek és Bölcsészet",
    subTopics: [
      { id: "literature", name: "Irodalmi Elemzések" },
      { id: "history", name: "Történeti Kutatások Új Megközelítései" },
      { id: "philosophy", name: "Filozófiai Diskurzusok" },
      { id: "visualArts", name: "Vizuális Művészetek Új Tendenciái" },
      { id: "music", name: "Zenei Innovációk és Hatások" },
      { id: "performingArts", name: "Előadó Művészetek és Színházi Kutatások" },
      { id: "linguistics", name: "Nyelvészet és Nyelvfilozófia" },
      {
        id: "culturalStudies",
        name: "Kulturális Tanulmányok és Kulturális Antropológia",
      },
      {
        id: "religiousStudies",
        name: "Vallási Tanulmányok és Vallási Filozófia",
      },
      { id: "archaeology", name: "Régészet és Kulturális Örökségvédelem" },
    ],
  },
  {
    id: "economics",
    name: "Gazdaságtudományok",
    subTopics: [
      { id: "microeconomics", name: "Mikrogazdaságtan" },
      { id: "macroeconomics", name: "Makrogazdaságtan" },
      { id: "financialEconomics", name: "Pénzügyi Gazdaságtan" },
      { id: "developmentEconomics", name: "Fejlődéstudományok" },
      { id: "internationalEconomics", name: "Nemzetközi Gazdaságtan" },
      { id: "corporateEconomics", name: "Vállalati Gazdaságtan" },
      { id: "financialManagement", name: "Pénzügyi Menedzsment" },
      { id: "economicPolicy", name: "Gazdaságpolitika" },
      { id: "tradeStudies", name: "Kereskedelmi Tanulmányok" },
      { id: "economicDevelopment", name: "Gazdasági Fejlesztés" },
      { id: "econometrics", name: "Econometria" },
      { id: "economicStrategy", name: "Gazdasági Stratégiák és Innovációk" },
    ],
  },
];

export const landingPanels = [
  {
    id: 0,
    label: "Előadók",
    text: "Ismerd meg a konferencia előadóit, akik a világ minden tájáról érkeznek.",
  },
  {
    id: 1,
    label: "Program",
    text: "Nézd meg a konferencia részletes programját és válassz az előadások közül.",
  },
  {
    id: 2,
    label: "Regisztráció",
    text: "Biztosítsd helyedet most, mert a helyek korlátozottak!",
  },
];

export const landingQA = [
  {
    id: 0,
    label: "Hogyan regisztrálhatok az oldalra?",
    text: 'Látogass el a "Regisztráció" oldalra és kövesd a lépéseket.',
  },
  {
    id: 1,
    label: "Kapok visszaigazolást a regisztrációról?",
    text: "Igen, a regisztráció befejezése után automatikusan küldünk egy visszaigazoló e-mailt a megadott e-mail címre. Ebben az e-mailben megtalálja az összes szükséges információt.",
  },
  {
    id: 2,
    label: "Hol találom meg a konferencia részletes programját?",
    text: " A konferencia részletes programját az adott konferencia weboldalán találhatja meg.",
  },
];

export const landingConnections = [
  {
    id: 0,
    label: "Kapcsolat",
    text: "Van kérdésed? Írj nekünk az alábbi e-mail címen:",
    email: "konferenciabc@gmail.com",
    href: "mailto:konferenciabc@gmail.com",
  },
];

export const privacyPolicyText = `Adatvédelmi Szabályzat

Üdvözöljük a Konferencia hivatalos weboldalán!

1. Adatgyűjtés
A weboldalunkon történő jelentkezéskor az alábbi személyes adatokat gyűjtjük: név, e-mail cím, szervezeti hovatartozás, és telefonszám. Ezeket az információkat kizárólag a konferenciával kapcsolatos kommunikációhoz és szervezéshez használjuk fel.

2. Adatok Felhasználása
Az általunk gyűjtött adatokat arra használjuk, hogy tájékoztassuk Önt a konferencia részleteiről, változásairól, és hogy kapcsolatba lépjünk Önnel szükség esetén. E-mail címét hírlevelek küldésére is felhasználhatjuk, amennyiben ehhez hozzájárulást adott.

3. Adatvédelem és Biztonság
Elkötelezettek vagyunk amellett, hogy megőrizzük személyes adatainak biztonságát. Megfelelő technikai és szervezeti intézkedéseket alkalmazunk annak érdekében, hogy megvédjük adatait az illetéktelen hozzáféréstől, módosítástól, közzétételtől vagy megsemmisítéstől.

4. Hozzáférés és Módosítás
Ön bármikor jogosult hozzáférni a ránk bízott személyes adataihoz, kérheti azok módosítását vagy törlését az konferencia@info.hu címen keresztül.

5. Cookie-k Használata
Weboldalunk cookie-kat használ a felhasználói élmény javítása érdekében. Ezek a cookie-k nem tartalmaznak személyes adatokat, és kizárólag a weboldal működéséhez szükségesek.

6. Kapcsolat
Amennyiben kérdése van adatvédelmi gyakorlatainkkal kapcsolatban, kérjük, lépjen velünk kapcsolatba az [e-mail cím] címen.

Köszönjük, hogy a Konferencia iránt érdeklődik!`;
