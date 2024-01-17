'use client'

import { createContext, useEffect, useState } from "react"
import checkConnectedAccount from "../utils/checkConnectedAccount";
import accountChanged from "../utils/checkAccountChanged";
import { redirect } from "next/navigation";

export const AccountContext = createContext();

export default function Providers({ children }) {

    const [account, setAccount] = useState("Not connected")

    useEffect(() => {
        const accChecking = async () => {
            const acc = await checkConnectedAccount()
            if (acc) {
                setAccount(acc)
            }
            const newacc = accountChanged()
            if (newacc) {
                setAccount(newacc)
            }
        }
        accChecking()
    }, [])



    if (!account) {
        return redirect("/")
    }

    return (
        <AccountContext.Provider value={{ account, setAccount }}>
            {children}
        </AccountContext.Provider>
    )
}

