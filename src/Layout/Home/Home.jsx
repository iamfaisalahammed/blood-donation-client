import Banner from "./Banner";
import ContactUs from "./ContactUs";
import WhyChooseUs from "./WhyChooseUs";
import SearchPage from "./SearchPage";

const Home = () => {
  return (
    <div>
      <Banner></Banner>
      <WhyChooseUs></WhyChooseUs>
      <SearchPage></SearchPage>
      <ContactUs></ContactUs>
    </div>
  );
};

export default Home;
