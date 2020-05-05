// import { createContext, useReducer } from "react";

// const initialState = {
//   user: null,
//   showModal: false,
//   showLoginModal: false,
//   showRegistrationModal: false,
// };

// const RootReducer = (state, action) => {
//   switch (action.type) {
//     case "seUser":
//       return {
//         ...state,
//         user: action.payload,
//       };
//     case "setShowModal":
//       return {
//         ...state,
//         showModal: true,
//       };
//     case "setHideModal":
//       return {
//         ...state,
//         showModal: false,
//       };
//     case "setShowLoginModal":
//       return {
//         ...state,
//         showModal: true,
//         showLoginModal: true,
//         showRegistrationModal: false,
//       };
//     case "setShowRegistrationModal":
//       return {
//         ...state,
//         showModal: true,
//         showLoginModal: false,
//         showRegistrationModal: true,
//       };
//     default:
//       return state;
//   }
// };

// const StateContext = createContext(initialState);

// const StateProvider = (props) => {
//   const [state, dispatch] = useReducer(RootReducer, initialState);

//   return (
//     <StateContext.Provider value={{ value: state, dispatch: dispatch }}>
//       {props.children}
//     </StateContext.Provider>
//   );
// };

// export { StateContext, StateProvider };

import { createStore, action } from "easy-peasy";

export default createStore({
  modals: {
    showModal: false,
    showLoginModal: false,
    showRegistrationModal: false,
    setShowModal: action((state) => {
      state.showModal = true;
    }),
    setHideModal: action((state) => {
      state.showModal = false;
    }),
    setShowLoginModal: action((state) => {
      state.showModal = true;
      state.showLoginModal = true;
      state.showRegistrationModal = false;
    }),
    setShowRegistrationModal: action((state) => {
      state.showModal = true;
      state.showLoginModal = false;
      state.showRegistrationModal = true;
    }),
  },
  user: {
    user: null,
    setUser: action((state, payload) => {
      state.user = payload;
    }),
  },
});
