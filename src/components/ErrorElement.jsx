import { useRouteError } from "react-router-dom";

const ErrorElement = () => {
  const error = useRouteError();
  return (
    <div className="text-center">
      <p className="text-9xl font-semibold text-primary">404</p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
        Valami hiba történt.
      </h1>
    </div>
  )
}

export default ErrorElement;
