import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import {
  HomeLayout,
  Landing,
  Error,
  Register,
  Login,
  Conferences,
  Articles,
  AdminPanel,
  MyProfile,
  NewConference,
  NewArticle,
  AllUsersInAdmin,
  ArticleDetails,
  ConferenceDetails,
  ConferenceApplication,
  SendEmail,
  ConferenceApplySuccess,
  ConferenceData,
  ConferenceDataOverview,
  ConferenceDataFacultativePrograms,
  ConferenceDataApplications,
  ConferenceDataSpeakers,
  ConferenceDataMenu,
  ConferenceDataAccomodation,
  RegistrationConfirm,
  ForgotPassword,
  Overview,
} from "./pages";
import { ErrorElement } from "./components";
import ConferenceSpeakerApplications from "./pages/ConferenceSpeakerApplications";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Landing />,
        errorElement: <ErrorElement />,
      },
      {
        path: "konferenciak",
        element: <Conferences />,
        errorElement: <ErrorElement />,
      },
      {
        path: "tudomanyoscikkek",
        element: <Articles />,
        errorElement: <ErrorElement />,
      },
      {
        path: "tudomanyoscikkek/:articleId",
        element: <ArticleDetails />,
      },
      {
        path: "konferenciak/:conferenceId",
        element: <ConferenceDetails />,
      },
      {
        path: "konferenciak/:conferenceId/applytoconference",
        element: <ConferenceApplication />,
      },
      {
        path: "konferenciak/:conferenceId/applysuccess",
        element: <ConferenceApplySuccess />,
      },
      {
        path: "/adminpanel/:conferenceId/konferenciadatok",
        element: <ConferenceData />,
        errorElement: <ErrorElement />,
        children: [
          {
            index: true,
            path: "konferenciaattekintes",
            element: <ConferenceDataOverview />,
            errorElement: <ErrorElement />,
          },
          {
            path: "fakultativprogramok",
            element: <ConferenceDataFacultativePrograms />,
            errorElement: <ErrorElement />,
          },
          {
            path: "jelentkezok",
            element: <ConferenceDataApplications />,
            errorElement: <ErrorElement />,
          },
          {
            path: "eloadok",
            element: <ConferenceDataSpeakers />,
            errorElement: <ErrorElement />,
          },
          {
            path: "etkezesmenu",
            element: <ConferenceDataMenu />,
            errorElement: <ErrorElement />,
          },
          {
            path: "rezervaciok",
            element: <ConferenceDataAccomodation />,
            errorElement: <ErrorElement />,
          },
        ],
      },
      {
        path: "adminpanel",
        element: <AdminPanel />,
        errorElement: <ErrorElement />,
        children: [
          {
            index: true,
            path: "/adminpanel/attekintes",
            element: <Overview />,
            errorElement: <ErrorElement />,
          },
          {
            path: "/adminpanel/ujkonferencia",
            element: <NewConference />,
            errorElement: <ErrorElement />,
          },
          {
            path: "/adminpanel/cikk",
            element: <NewArticle />,
            errorElement: <ErrorElement />,
          },
          {
            path: "/adminpanel/emailkuldes",
            element: <SendEmail />,
            errorElement: <ErrorElement />,
          },
          {
            path: "/adminpanel/jelentkezoeloadok",
            element: <ConferenceSpeakerApplications />,
            errorElement: <ErrorElement />,
          },
          {
            path: "/adminpanel/felhasznalok",
            element: <AllUsersInAdmin />,
            errorElement: <ErrorElement />,
          },
        ],
      },
      {
        path: "profilom",
        element: <MyProfile />,
        errorElement: <ErrorElement />,
      },
    ],
  },
  {
    path: "/bejelentkezes",
    element: <Login />,
    errorElement: <Error />,
  },
  {
    path: "/regisztracio",
    element: <Register />,
    errorElement: <Error />,
  },
  {
    path: "/regisztraciomegerosites",
    element: <RegistrationConfirm />,
    errorElement: <Error />,
  },
  {
    path: "/elfelejtettjelszo",
    element: <ForgotPassword />,
    errorElement: <Error />,
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
