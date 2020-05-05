import houses from "./houses.json";
import House from "../components/House";
import Layout from "../components/Layout";

const Index = () => (
  <div>
    <Layout>
      <div className="houses">
        {houses.map((house, index) => {
          return <House key={index} {...house} />;
        })}
      </div>
    </Layout>
    <style jsx>{`
      .houses {
        display: grid;
        grid-template-columns: 50% 50%;
        grid-template-rows: 300px 300px;
        grid-gap: 40px;
      }
    `}</style>
  </div>
);

export default Index;
