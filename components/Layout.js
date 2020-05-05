// import { useContext } from "react";
// import { StateContext } from "../store";
import Header from "./Header";
import Modal from "./Modal";
import LoginModal from "./LoginModal";
import RegistrationModal from "./RegistrationModal";

import { useStoreActions, useStoreState } from "easy-peasy";

const Layout = (props) => {
  // const { value, dispatch } = useContext(StateContext);

  const showModal = useStoreState((state) => state.modals.showModal);
  const showLoginModal = useStoreState((state) => state.modals.showLoginModal);
  const showRegistrationModal = useStoreState(
    (state) => state.modals.showRegistrationModal
  );

  const setHideModal = useStoreActions(
    (actions) => actions.modals.setHideModal
  );

  const showSignUp = useStoreActions(
    (actions) => actions.modals.setShowRegistrationModal
  );

  const setShowLoginModal = useStoreActions(
    (actions) => actions.modals.setShowLoginModal
  );

  return (
    <div>
      <Header />
      <main>{props.children}</main>

      {showModal && (
        <Modal close={setHideModal}>
          {showLoginModal && <LoginModal showSignUp={() => showSignUp()} />}
          {showRegistrationModal && (
            <RegistrationModal showLogin={() => setShowLoginModal()} />
          )}
        </Modal>
      )}

      <style jsx global>{`
        body {
          margin: 0;
          font-family: Roboto, -apple-system, BlinkMacSystemFont, Segoe UI,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
          font-size: 14px;
          line-height: 1.5;
          color: #333;
        }
      `}</style>

      <style jsx>{`
        main {
          position: relative;
          max-width: 56em;
          background-color: white;
          padding: 2em;
          margin: 0 auto;
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
};

export default Layout;
