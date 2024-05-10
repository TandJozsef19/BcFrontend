import { LeftSideNav } from "../components";
import { landingPanels, landingQA, landingConnections } from "../../data";
import { useSelector } from "react-redux";
import LandingLogged from "./LandingLogged";

const Landing = () => {
  const user = useSelector((state) => state.user.user);

  return user ? (
    <LandingLogged />
  ) : (
    <main className="rounded-lg mx-auto p-6 max-w-8xl grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-10">
      <LeftSideNav />
      {/* Oldal közepe */}
      <div className="bg-base-100 shadow-md rounded-lg p-6 col-span-3">
        <h1 className="text-4xl font-bold text-primary border-b pb-2 mb-4">
          Csatlakozzon hozzánk!
        </h1>
        <p className="mb-6">
          Kapcsolódjon be és ismerkedjen meg az iparág kiemelkedő szakértőivel,
          akik megosztják tapasztalataikat és tudásukat Önnel!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6">
          {landingPanels.map((panel) => {
            const { id, label, text } = panel;
            return (
              <div className="bg-base-200 p-4 rounded shadow-md" key={id}>
                <h3 className="text-xl font-semibold border-b border-base-300 pb-2 mb-4">
                  {label}
                </h3>
                <p className="text-md md:text-sm lg:text-md">{text}</p>
              </div>
            );
          })}
        </div>

        <section className="mt-10 bg-base-100 p-6 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-primary border-b pb-2 mb-6">
            Gyakran Ismételt Kérdések
          </h2>
          <div className="space-y-6">
            {landingQA.map((question) => {
              const { id, label, text } = question;
              return (
                <div key={id}>
                  <h3 className="text-xl font-semibold mb-2">{label}</h3>
                  <p>{text}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Kapcsolat Szekció */}
        <section className="mt-10 bg-base-100 p-6 rounded-lg">
          {landingConnections.map((connection) => {
            const { id, label, text, email, href } = connection;
            return (
              <div key={id}>
                <h2 className="text-3xl font-bold text-primary border-b pb-2 mb-6">
                  {label}
                </h2>
                <p>{text}</p>
                <a
                  href={href}
                  className="text-primary-focus hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {email}
                </a>
              </div>
            );
          })}
        </section>
      </div>
    </main>
  );
};

export default Landing;
