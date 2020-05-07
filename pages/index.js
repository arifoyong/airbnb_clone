// import houses from "./houses.json";
import fetch from "isomorphic-unfetch";
import House from "../components/House";
import Layout from "../components/Layout";

const Index = ({ houses }) => (
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

Index.getInitialProps = async () => {
  const res = await fetch(`http://localhost:3000/api/house`);

  const houses = await res.json();

  return { houses };
};

export default Index;
