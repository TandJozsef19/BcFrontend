import {
  OverviewConferences,
  OverviewStatistics,
  OverviewArticles,
} from "../components";

const Overview = () => {
  return (
    <section className="lg:col-span-4 md:col-span-2 col-span-1">
      <h2 className="text-5xl font-bold text-primary pb-2 mb-4">Áttekintés</h2>
      <OverviewStatistics />
      <OverviewConferences />
      <OverviewArticles />
    </section>
  );
};

export default Overview;
