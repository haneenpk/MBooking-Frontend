import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import CarousalImage from "../../components/Users/CarousalImage";
import CarousalContent from "../../components/Users/CarousalContent";
import CarouselButton from "../../components/Users/CarouselButton";
import defBanner from "../../assets/images/slide-02.jpg";

const Home = () => {
  const navigate = useNavigate();

  const [banners, setBanners] = useState([]);

  useEffect(() => {
    const getBanner = async () => {
      try {
        const response = await getActiveBanners();
        setBanners(response.banners);
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };

    getBanner();
  }, []);

  const showNextPrevButtons = banners.length > 1;

  return (
    <div className="relative">
      {showNextPrevButtons && (
        <div className="absolute top-0 left-0 right-0 flex justify-between">
          <CarouselButton type="prev" />
          <CarouselButton type="next" />
        </div>
      )}
      {banners.length ? (
        <div className="relative">
          {banners.map((banner, index) => (
            <div key={index} className="relative">
              <CarousalImage src={banner.image} className="w-full h-96 object-cover" />
              <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white p-4">
                <CarousalContent title={banner.title} description={banner.description} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="relative">
          <CarousalImage src={defBanner} className="w-full h-96 object-cover" />
          <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white p-4">
            <CarousalContent
              title={"First slide label"}
              description={"Nulla vitae elit libero, a pharetra augue mollis interdum."}
            />
          </div>
        </div>
      )}
      <section className="py-5 py-xl-8">
        {/* Your additional content goes here */}
      </section>
    </div>
  );
};

export default Home;