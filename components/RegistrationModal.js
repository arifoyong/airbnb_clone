import { useState, useEffect } from "react";
import { useStoreActions } from "easy-peasy";
import axios from "axios";

export default (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordconfirmation, setPasswordconfirmation] = useState("");

  const handleChange = (event) => {
    switch (event.target.id) {
      case "email":
        setEmail(event.target.value);
        break;
      case "password":
        setPassword(event.target.value);
        break;
      case "passwordConfirmation":
        setPasswordconfirmation(event.target.value);
        break;
    }
  };

  const setHideModal = useStoreActions(
    (actions) => actions.modals.setHideModal
  );

  const setUser = useStoreActions((actions) => actions.user.setUser);

  const submit = async () => {
    try {
      const response = await axios.post("api/auth/register", {
        email,
        password,
        passwordconfirmation,
      });

      if (response.data.status === "error") {
        alert(response.data.message);
        return;
      }

      setUser(email);
      setHideModal();
    } catch (err) {
      alert(err.response.data.message);
      return;
    }
  };

  return (
    <div>
      <h2>Registration</h2>
      <div>
        <form
          onSubmit={(event) => {
            submit();
            event.preventDefault();
          }}
        >
          <input
            id="email"
            type="email"
            placeholder="Email Address"
            onChange={(event) => handleChange(event)}
          />
          <input
            id="password"
            type="password"
            placeholder="Password"
            onChange={(event) => handleChange(event)}
          />
          <input
            id="passwordConfirmation"
            type="password"
            placeholder="Enter password again"
            onChange={(event) => handleChange(event)}
          />
          <button>Sign up</button>
        </form>

        <p>
          Already have an account?{" "}
          <a href="#" onClick={() => props.showLogin()}>
            Login
          </a>
        </p>
      </div>

      <style jsx>{`
        button {
          background-color: rgb(255, 90, 95);
          color: white;
          font-size: 13px;
          width: 100%;
          border: none;
          height: 40px;
          border-radius: 4px;
          cursor: pointer;
        }

        input[type="text"],
        input[type="email"],
        input[type="password"] {
          display: block;
          padding: 20px;
          margin-bottom: 20px;
          border: 1px solid #ccc;
          font-size: 20px !important;
          box-sizing: border-box;
          width: 100%;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};
