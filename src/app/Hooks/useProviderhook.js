import { useContext } from "react";
import { AccountContext } from "../Context/Providers";



export default function useProviderhook() {
    const context = useContext(AccountContext)
    if (!context) {
        throw new Error("AccountContext not found")
    }

    return context;
}