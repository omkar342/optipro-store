// import { useRouter } from "next/navigation";
import { api } from "./url";

// Define types for the user data
interface StoreData {
  _id: string;
  name: string;
  username: string;
  // Add other user fields as needed
}

// Define the type for the `setStoreData` function
type setStoreData = (data: StoreData) => void;

// export const useCheckToken = () => {
//   const router = useRouter();

//   // The function now expects a `path` string and a `setStoreData` function of type `setStoreData`
//   const checkToken = (
//     path: string,
//     setStoreData: setStoreData,
//     setToken: (token: string | null) => void
//   ) => {
//     const accessToken = localStorage.getItem("accessToken");

//     if (accessToken) {
//       loginWithAccessToken(accessToken, setStoreData, setToken);
//     } else {
//       router.push("/");
//     }
//   };

//   return checkToken;
// };

export const loginWithAccessToken = async (
  accessToken: string,
  setStoreData: (storeData: StoreData) => void,
  setToken: (token: string | null) => void
): Promise<boolean> => {
  // Change return type to Promise<boolean>
//   const router = useRouter();
  try {
    const response: { status: number, data: { status: number; storeData: StoreData } } =
      await api({
        url: "/store/verify-access-token",
        type: "get",
        data: { accessToken },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

    console.log(response, "response");

    const data = response.data;
    if (response.status === 200) {
      setStoreData(data.storeData);
      setToken(accessToken);
    //   router.push("/store-dashboard");
      return true; // Token is valid
    } else {
    //   router.push("/");
      return false; // Token is invalid
    }
  } catch (error) {
    console.log(error);
    return false; // In case of an error (e.g., network error, invalid token)
  }
};
