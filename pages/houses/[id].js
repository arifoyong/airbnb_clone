import { useState, useEffect } from "react";
// import houses from "../houses.json";
import Head from "next/head";
import Layout from "../../components/Layout";
import DateRangePicker from "../../components/DateRangePicker";
import fetch from "isomorphic-unfetch";
import axios from "axios";

import { useStoreActions, useStoreState } from "easy-peasy";

const House = (props) => {
  const [dateChosen, setDateChosen] = useState(false);
  const [numberOfNightsBetweenDates, setNumberOfNightsBetweenDates] = useState(
    0
  );
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const calcNumberOfNightsBetweenDates = (startDate, endDate) => {
    const start = new Date(startDate); //clone
    const end = new Date(endDate); //clone
    let dayCount = 0;

    while (end > start) {
      dayCount++;
      start.setDate(start.getDate() + 1);
    }

    return dayCount;
  };

  const user = useStoreState((state) => state.user.user);
  const showLogin = useStoreActions(
    (actions) => actions.modals.setShowLoginModal
  );

  const reserveHandle = async () => {
    try {
      const res = await axios.post("/api/house/reserve", {
        houseId: props.house.id,
        startDate: startDate,
        endDate: endDate,
      });

      if (res.status.data === "error") {
        alert(res.status.message);
        return;
      }

      console.log(res);
      alert(res.data.message);
    } catch (err) {
      console.log(err);
      return;
    }
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
              setStartDate(startDate);
              setEndDate(endDate);
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
            </div>
          )}
          <div>
            {user ? (
              <button className="reserve" onClick={reserveHandle}>
                Reserve
              </button>
            ) : (
              <button className="login" onClick={showLogin}>
                Login
              </button>
            )}
          </div>
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
            margin-top: 10px;
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
