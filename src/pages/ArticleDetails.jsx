import { useQuery } from "react-query";
import axios from "axios";
import { LeftSideNav, Loading } from "../components";
import { Navigate, useParams } from "react-router-dom";

const BASE_URL = "https://bcbackend-pn9e.onrender.com";

const fetchArticleDetails = async (articleId) => {
  const response = await axios.get(`${BASE_URL}/api/articles/${articleId}`);
  return response.data.data.article;
};

const fetchRandomArticle = async () => {
  const response = await axios.get(`${BASE_URL}/api/articles/randomarticle`);
  console.log(response.data.data.randArticle);
  return response.data.data.randArticle;
};

const ArticleDetails = () => {
  const { articleId } = useParams();
  const {
    data: article,
    isLoading,
    error,
  } = useQuery(["article", articleId], () => fetchArticleDetails(articleId), {
    enabled: !!articleId,
  });

  const { data: randomArticle, isLoading: isLoadingRandomArticle } = useQuery(
    "randomArticle",
    fetchRandomArticle,
    {
      enabled: !!articleId,
    }
  );

  if (isLoading || isLoadingRandomArticle) {
    return <Loading />;
  }

  if (error) {
    return <Navigate to="/404" />;
  }
  if (!article) {
    return <div>Nincs ilyen hír.</div>;
  }
  return (
    <main className="rounded-lg mx-auto p-6 max-w-8xl grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-10">
      <LeftSideNav />
      {/* <!-- Fő tartalom --> */}
      <div className="bg-base-100 shadow-lg rounded-xl p-8 col-span-3 space-y-6">
        <div className="container mx-auto px-8">
          {/* <!-- Hír részletek --> */}
          <div className="space-y-6">
            <h2 className="lg:text-5xl md:text-2xl sm:text-3xl font-bold text-primary pb-4 border-b">
              {article.title}
            </h2>
            <div className="bg-base-200 p-6 rounded-xl shadow-md">
              <p className="lg:text-xl md:text-lg sm:text-md leading-relaxed mb-4">
                {article.content}
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-primary border-b pb-2">
                Ajánló
              </h3>
              <ul className="text-base list-disc pl-4 space-y-2 mt-2">
                {randomArticle &&
                  randomArticle.map((article, index) => (
                    <li key={index}>
                      <a
                        href={`https://bcfrontend.onrender.com/tudomanyoscikkek/${article._id}`}
                        className="text-primary hover:underline"
                      >
                        {article.title}
                      </a>

                      <p className="text-sm">
                        {new Date(article.createdAt).toLocaleDateString(
                          "hu-HU",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ArticleDetails;
