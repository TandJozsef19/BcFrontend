import { Outlet, useLocation, useNavigation } from "react-router-dom";
import { useEffect } from "react";
import { Header, Footer, Loading } from "../components";

const HomeLayout = () => {
  const navigation = useNavigation();
  const isPageLoading = navigation.state === "loading";
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return (
    <>
      <Header />
      {isPageLoading ? <Loading /> : <Outlet />}
      <Footer />
    </>
  );
};

export default HomeLayout;
