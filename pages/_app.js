import App from "next/app";
import "react-day-picker/lib/style.css";
// import { StateProvider } from "../store";
// import { useContext } from "react";
// import { StateContext } from "../store";
import { StoreProvider } from "easy-peasy";
import store from "../store";

function MyApp({ Component, pageProps, user }) {
  if (user) {
    store.getActions().user.setUser(user);
  }

  return (
    <StoreProvider store={store}>
      <Component {...pageProps} />
    </StoreProvider>
  );
}

MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext);

  let user = null;
  if (
    appContext.ctx.req &&
    appContext.ctx.req.session &&
    appContext.ctx.req.session.passport &&
    appContext.ctx.req.session.passport.user
  ) {
    user = appContext.ctx.req.session.passport.user;
  }

  return { ...appProps, user: user };
};

export default MyApp;
