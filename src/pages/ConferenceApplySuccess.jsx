import { Link } from "react-router-dom";
import { LeftSideNav } from "../components";

const ConferenceApplySuccess = () => {
  return (
    <main className="rounded-lg mx-auto p-6 max-w-8xl grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-10">
      <LeftSideNav />
      <div className="bg-base-100 shadow-md rounded-lg p-6 col-span-3">
        <h1 className="text-5xl font-bold text-primary border-b pb-2 mb-4">
          Konferencia Jelentkezés
        </h1>
        <div className="flex flex-col items-center">
          <h2 className="text-4xl font-semibold text-primary mb-4 border-b">
            Sikeres Jelentkezés
          </h2>
          <p className="text-md text-center">
            Köszönjük, hogy sikeresen jelentkeztél a konferenciára! Nagyon
            örülünk, hogy csatlakozni fogsz hozzánk.
          </p>
          <p className="text-md text-center mt-4">
            Mostantól részese lehetsz a konferencia izgalmas eseményeinek,
            előadásoknak. Lesz lehetőséged új embereket megismerni,
            tapasztalatokat cserélni és inspirációt meríteni.
          </p>
          <p className="text-md text-center mt-4">
            A részletekkel kapcsolatban hamarosan értesítéseket küldünk neked az
            e-mail címedre. Addig is, kérjük, látogasd meg a honlapunkat és
            kísérj minket, hogy ne maradj le semmiről!
          </p>
          <p className="text-md text-center mt-4">
            Ha bármilyen kérdésed vagy észrevételed van, ne habozz kapcsolatba
            lépni velünk az alábbi e-mail címen: info@konferencia.hu
          </p>
          <p className="text-md text-center mt-4">
            Várunk szeretettel a konferencián, és reméljük, hogy hasznos és
            inspiráló élményekkel gazdagodsz majd!
          </p>
          <div className="text-center max-w-xl mt-5">
            <Link to="/" className="btn btn-primary uppercase py-2">
              Tovább a Jelentkezésekhez
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ConferenceApplySuccess;
