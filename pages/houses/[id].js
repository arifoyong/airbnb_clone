import { useState, useEffect } from "react";
// import houses from "../houses.json";
import Head from "next/head";
import Layout from "../../components/Layout";
import DateRangePicker from "../../components/DateRangePicker";
import fetch from "isomorphic-unfetch";

const House = (props) => {
  const [dateChosen, setDateChosen] = useState(false);
  const [numberOfNightsBetweenDates, setNumberOfNightsBetweenDates] = useState(
    0
  );
  const calcNumberOfNightsBetweenDates = (startDate, endDate) => {
    const start = new Date(startDate); //clone
    const end = new Date(endDate); //clone
    let dayCount = 0;

    while (end > start) {
      dayCount++;
      start.setDate(start.getDate() + 1);
    }
    console.log("Daycount", dayCount);
    return dayCount;
  };

  return (
    <Layout>
      <div className="container">
        <Head>
          <title>{props.house.title}</title>
        </Head>
        <article>
          <img src={props.house.picture} width="100%" alt="House picture" />
          <p>
            {props.house.type} - {props.house.town}
          </p>
          <p>{props.house.title}</p>
          <p>Review count:{props.house.reviewsCount}</p>
          <p>{props.house.description}</p>
          {props.house.reviewsCount ? (
            <div className="reviews">
              <h3>{props.house.reviewsCount} Reviews</h3>

              {props.house.reviews.map((review, index) => {
                return (
                  <div key={index}>
                    <p>{new Date(review.createdAt).toDateString()}</p>
                    <p>{review.comment}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <></>
          )}
        </article>{" "}
        <aside>
          <h2>Add dates for price</h2>
          <DateRangePicker
            datesChanged={(startDate, endDate) => {
              setNumberOfNightsBetweenDates(
                calcNumberOfNightsBetweenDates(startDate, endDate)
              );

              setDateChosen(true);
            }}
          />

          {dateChosen && (
            <div>
              <h2>Price per night</h2>
              <p>${props.house.price}</p>
              <h2>Total price for booking</h2>
              <p>
                ${(numberOfNightsBetweenDates * props.house.price).toFixed(2)}
              </p>
              <button className="reserve">Reserve</button>
            </div>
          )}
        </aside>
        <style jsx>{`
          .container {
            display: grid;
            grid-template-columns: 60% 40%;
            grid-gap: 30px;
          }

          aside {
            border: 1px solid #ccc;
            padding: 20px;
          }

          button {
            background-color: rgb(255, 90, 95);
            color: white;
            font-size: 13px;
            width: 100%;
            border: none;
            height: 40px;
            border-radius: 20px;
            cursor: pointer;
          }
        `}</style>
      </div>
    </Layout>
  );
};

House.getInitialProps = async ({ query }) => {
  const { id } = query;

  const res = await fetch(`http://localhost:3000/api/house/${id}`);
  const house = await res.json();

  return {
    house,
  };
};

export default House;
