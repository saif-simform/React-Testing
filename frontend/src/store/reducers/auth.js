import { TOKEN_KEY } from "../../configs/constant";

const initialState = {
  isAuthenticated: false,
  currentUser: null,
};

export const user = (state = initialState, action) => {
  switch (action.type) {
    case "SET_AUTH": {
      // console.log(action.payload);
      return { ...state, currentUser: action.payload, isAuthenticated: true };
    }
    case "PURGE_AUTH": {
      // console.log("Token key",localStorage.getItem(TOKEN_KEY));
      localStorage.removeItem(TOKEN_KEY);

      // history.push("/login");
      return { ...state, currentUser: null, isAuthenticated: false };
    }
    default: {
      return state;
    }
  }
};

export default user;
