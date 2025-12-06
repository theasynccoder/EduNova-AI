import { createContext } from "react";

const UserDetailContext = createContext({
  userDetail: null,
  setUserDetail: () => {}
});

export default UserDetailContext;
