import { create } from "zustand";

const useLogIn = create((set) => {
  const loggedIn = sessionStorage.getItem("loggedIn") === "true";
  const user = sessionStorage.getItem("user") || "";
  const isAdmin = sessionStorage.getItem("isAdmin") === "true";

  return {
    loggedIn,
    user,
    isAdmin,
    setLoggedIn: (loggedIn) => {
      sessionStorage.setItem("loggedIn", loggedIn);
      set({ loggedIn });
    },
    setUser: (user) => {
      sessionStorage.setItem("user", user);
      set({ user });
    },
    setIsAdmin: (isAdmin) => {
      sessionStorage.setItem("isAdmin", isAdmin);
      set({ isAdmin });
    },
    logOut: () => {
      sessionStorage.clear();
      set({ loggedIn: false, user: "", isAdmin: false });
    },
  };
});

export default useLogIn;
