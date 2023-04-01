import { useContext } from "react";
import { AuthContext } from "./server/AuthContext";

export const useAuthContext = () => {
    const context = useContext(AuthContext)

    if (!context) {
        throw Error("cannot use")
    }

    return context
}