import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../features/user/userSlice";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError("");

    try {
      const actionResult = await dispatch(login(loginData)).unwrap();
      navigate("/");
    } catch (error) {
      setIsLoading(false);

      if (
        error.message ===
        "A felhasználói fiók még nem aktív. Kérjük, erősítse meg regisztrációját."
      ) {
        setLoginError(error.message);
        setTimeout(() => {
          navigate("/regisztraciomegerosites", {
            state: { email: loginData.email },
          });
        }, 1500);
      } else {
        setLoginError(error.message || "Hiba történt a bejelentkezés során");
      }
    }
  };
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="bg-base-100 shadow-lg rounded-lg py-5 px-12 max-w-xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6 text-center text-primary border-b-2 pb-2">
          Bejelentkezés
        </h1>
        <p className="mb-8 text-center primary-content">
          Üdvözöljük újra! Jelentkezz be és folytasd a böngészést.
        </p>

        <form onSubmit={handleLogin}>
          {/* <!-- E-mail --> */}
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block mb-1 text-sm font-medium text-primary"
            >
              Email cím
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full bg-base-100 border rounded-md px-3 py-2 focus:outline-none focus:border-primary"
              placeholder="pelda@valami.hu"
              required
              value={loginData.email}
              onChange={handleChange}
            />
          </div>

          {/* <!-- Jelszó --> */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block mb-1 text-sm font-medium text-primary"
            >
              Jelszó
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Jelszó"
              className="w-full bg-base-100 border rounded-md px-3 py-2 focus:outline-none focus:border-primary"
              required
              value={loginData.password}
              onChange={handleChange}
            />
          </div>

          {/* <!-- Jelszó emlékeztető --> */}
          <div className="mb-6 text-right">
            <Link
              to="/elfelejtettjelszo"
              className="text-blue-500 underline hover:text-blue-700 text-sm"
            >
              Elfelejtetted a jelszavad?
            </Link>
          </div>

          <div>
            {loginError && (
              <p className="mb-4 text-center text-red-600">{loginError}</p>
            )}
          </div>

          <div className="mb-4 flex items-center justify-center">
            {isLoading ? (
              <button className="btn w-full py-2 uppercase">
                <span className="loading loading-spinner"></span>
                Bejelentkezés...
              </button>
            ) : (
              <button
                className="btn btn-primary w-full py-2 bg-primary hover:bg-primary-focus uppercase"
                onClick={handleLogin}
                disabled={isLoading}
              >
                Bejelentkezés
              </button>
            )}
          </div>
        </form>

        <p className="text-center text-sm">
          Nincs fiókod?
          <a
            href="/regisztracio"
            className="text-blue-500 underline ml-1 hover:text-blue-700"
          >
            Regisztrálj most!
          </a>
        </p>
        <div className="divider uppercase">vagy</div>
        <div className="mt-4 text-center">
          <Link
            to="/"
            className="btn btn-outline btn-primary uppercase bg-base-100 w-full py-2 border border-primary hover:bg-primary"
          >
            Vissza a főoldalra
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
