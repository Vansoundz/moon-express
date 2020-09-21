import { Auth } from "../../models/UserModel";

type Action = {
  type: string;
  payload?: any;
};

const initialState: Auth = {
  user: null,
  loading: true,
};

const authReducer = (state: Auth, action: Action): Auth => {
  const { type } = action;

  switch (type) {
    case `LOGIN`:
      return {
        ...state,
        user: action.payload,
        loading: false,
      };
    case `LOGOUT`:
      return {
        ...state,
        user: null,
        loading: false,
      };
    case `STOP`:
      return { ...state, loading: false };

    default:
      return state;
  }
};

export { authReducer, initialState };
export type { Action };
