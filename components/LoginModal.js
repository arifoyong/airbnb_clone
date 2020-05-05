import { useState } from "react";
import { useStoreActions } from "easy-peasy";
import axios from "axios";

export default (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleChange = (event) => {
    switch (event.target.id) {
      case "email":
        setEmail(event.target.value);
        break;
      case "password":
        setPassword(event.target.value);
        break;
    }
  };

  const setHideModal = useStoreActions(
    (actions) => actions.modals.setHideModal
  );

  const setUser = useStoreActions((actions) => actions.user.setUser);

  const submit = async () => {
    try {
      const response = await axios.post("api/auth/login", {
        email,
        password,
      });

      if (response.data.status === "error") {
        console.log("server return error");
        alert(response.data.message);
        return;
      }

      setUser(email);
      setHideModal();
    } catch (err) {
      alert(err);
      return;
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <div>
        <form
          onSubmit={(event) => {
            console.log(email, password);
            console.log("login");
            submit();
            event.preventDefault();
          }}
        >
          <input
            id="email"
            value={email}
            type="email"
            placeholder="Email Address"
            onChange={(e) => handleChange(e)}
          />
          <input
            id="password"
            value={password}
            type="password"
            placeholder="Password"
            onChange={(e) => handleChange(e)}
          />
          <button>Log In</button>
        </form>

        <p>
          Don't have account yet?{" "}
          <a href="#" onClick={() => props.showSignUp()}>
            Sign Up
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
