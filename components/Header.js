import Link from "next/link";
import { useStoreActions, useStoreState } from "easy-peasy";
import axios from "axios";

const Header = () => {
  const user = useStoreState((state) => state.user.user);

  const showSignUp = useStoreActions(
    (actions) => actions.modals.setShowRegistrationModal
  );

  const showLogin = useStoreActions(
    (actions) => actions.modals.setShowLoginModal
  );

  const setUser = useStoreActions((actions) => actions.user.setUser);

  return (
    <div className="nav-container">
      <Link href="/">
        <a>
          <img src="/img/logo.png" alt="" />
        </a>
      </Link>
      <nav>
        {user ? (
          <ul>
            <li className="username">{user}</li>
            <li>
              <a
                href="#"
                onClick={async () => {
                  await axios.post("/api/auth/logout");
                  setUser(null);
                }}
              >
                Log out
              </a>
            </li>
          </ul>
        ) : (
          <ul>
            <li>
              <a onClick={showSignUp}>Sign up</a>
            </li>
            <li>
              <a onClick={showLogin}>Log in</a>
            </li>
          </ul>
        )}
      </nav>

      <style jsx>{`
        li {
          display: block;
          float: left;
        }

        .nav-container {
          border-bottom: 2px solid #eee;
          height: 50px;
        }

        a {
          text-decoration: none;
          display: block;
          margin-right: 15px;
          color: #333;
        }

        img {
          float: left;
          height: 50px;
        }

        nav a {
          padding: 1em 0.5em;
        }

        ul {
          float: right;
          margin: 0;
          padding: 0;
        }

        .username {
          padding: 1em 0.5em;
        }
      `}</style>
    </div>
  );
};
export default Header;
