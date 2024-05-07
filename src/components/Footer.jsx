import { Form, Link } from "react-router-dom";
import { useState } from "react";
import { Modal } from "../components";
const Footer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    children: null,
  });

  const handleOpenModal = (title, text) => {
    const textLines = text.split("\n");
    const formattedText = textLines.map((line, index) => (
      <div key={index}>
        <p>{line}</p>
        <br />
      </div>
    ));

    setModalContent({
      title,
      children: <div>{formattedText}</div>,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const termsOfUseText = `Felhasználási Feltételek

  Üdvözöljük a Konferencia Szervező Oldalán! Kérjük, olvassa el a következő felhasználási feltételeket és feltételekkel kapcsolatos információkat.
  
  1. Regisztráció és Fiók
  A konferencia részvételhez regisztrálnod kell egy fiókot. A fiók létrehozásakor a megadott adatoknak pontosnak és naprakésznek kell lenniük. A fiók adatait biztonságban kell tartani.
  
  2. Konferencia Regisztráció
  A konferenciára történő regisztráció során az általunk gyűjtött információkat kizárólag a konferencia szervezéséhez és kommunikációhoz használjuk fel. Az adatvédelem fontos számunkra, és soha nem adjuk ki azokat harmadik feleknek.
  
  3. Viselkedési Szabályok 
  A konferencián tiszteletteljes és elfogadható viselkedésre számítunk minden résztvevőtől. Tilos a zaklatás, a trágár nyelv használata és más résztvevők megzavarása.
  
  4. Felelősség
  A konferencia szervezői nem vállalnak felelősséget a résztvevők vagy harmadik felek által okozott károkért.
  
  5. Kapcsolat
  Ha kérdése vagy észrevétele van a felhasználási feltételekkel vagy a konferenciával kapcsolatban, lépjen velünk kapcsolatba az alábbi címen: info@konferenciaszervezo.hu.
  
  Köszönjük, hogy a Konferencia Szervező Oldalát választotta!`;
  const contactText = `Kapcsolatfelvételi információ:\n\nCím: 1234 Komárom, Példa utca 1.\nTelefon: +36 1 234 5678\nE-mail: info@konferencia.hu`;

  const privacyPolicyText = `Adatvédelmi Szabályzat\n\nÜdvözöljük a Konferencia hivatalos weboldalán!\n\n1. Adatgyűjtés\nA weboldalunkon történő jelentkezéskor az alábbi személyes adatokat gyűjtjük: név, e-mail cím, szervezeti hovatartozás, és telefonszám. Ezeket az információkat kizárólag a konferenciával kapcsolatos kommunikációhoz és szervezéshez használjuk fel.\n\n2. Adatok Felhasználása\nAz általunk gyűjtött adatokat arra használjuk, hogy tájékoztassuk Önt a konferencia részleteiről, változásairól, és hogy kapcsolatba lépjünk Önnel szükség esetén. E-mail címét hírlevelek küldésére is felhasználhatjuk, amennyiben ehhez hozzájárulást adott.\n\n3. Adatvédelem és Biztonság\nElkötelezettek vagyunk amellett, hogy megőrizzük személyes adatainak biztonságát. Megfelelő technikai és szervezeti intézkedéseket alkalmazunk annak érdekében, hogy megvédjük adatait az illetéktelen hozzáféréstől, módosítástól, közzétételtől vagy megsemmisítéstől.\n\n4. Hozzáférés és Módosítás\nÖn bármikor jogosult hozzáférni a ránk bízott személyes adataihoz, kérheti azok módosítását vagy törlését az info@konferencia.hu címen keresztül.\n\n5. Cookie-k Használata\nWeboldalunk cookie-kat használ a felhasználói élmény javítása érdekében. Ezek a cookie-k nem tartalmaznak személyes adatokat, és kizárólag a weboldal működéséhez szükségesek.\n\n6. Kapcsolat\nAmennyiben kérdése van adatvédelmi gyakorlatainkkal kapcsolatban, kérjük, lépjen velünk kapcsolatba az info@konferencia.hu címen.\n\nKöszönjük, hogy a Konferencia iránt érdeklődik!`;

  return (
    <footer className="bg-base-200 py-6 mt-60">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between gap-2 items-center mb-6 py-3 border-b">
          {/* <!-- Bal oldali cím/logó --> */}
          <Link
            to="/"
            className="text-base-100 text-2xl font-bold cursor-pointer bg-primary px-3 py-1 rounded-md"
          >
            Konferencia
          </Link>
          {/* <!-- Jobb oldali linkek --> */}

          <div className="space-x-4">
            <button
              onClick={() => handleOpenModal("Adatvédelem", privacyPolicyText)}
              className="p-2 rounded hover:text-primary hover:bg-base-300"
            >
              Adatvédelem
            </button>
            <button
              onClick={() =>
                handleOpenModal("Felhasználási feltételek", termsOfUseText)
              }
              className="p-2 rounded hover:text-primary hover:bg-base-300"
            >
              Felhasználási feltételek
            </button>
            <button
              onClick={() => handleOpenModal("Kapcsolat", contactText)}
              className="p-2 rounded hover:text-primary hover:bg-base-300"
            >
              Kapcsolat
            </button>
          </div>
        </div>

        {/* <!-- Copyright szöveg --> */}
        <div className="text-center">
          <span className="text-primary">©</span> 2023 Konferencia. Minden jog
          fenntartva.
        </div>
      </div>

      <Modal
        show={isModalOpen}
        onClose={handleCloseModal}
        title={modalContent.title}
      >
        {modalContent.children}
      </Modal>
    </footer>
  );
};
export default Footer;
