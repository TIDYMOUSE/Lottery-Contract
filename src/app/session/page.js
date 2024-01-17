'use client';

import React, { useEffect, useState } from "react";
import { Network, ethers } from "ethers";
import contractJSON from "@/contractJSON/Lottery.json";
import detectEthereumProvider from '@metamask/detect-provider';
import useProviderhook from "../Hooks/useProviderhook";

export default function Session() {
    const [contract, setContract] = useState({
        provider: null,
        contractObj: null,
    });
    const { account } = useProviderhook()
    const [bal, setBal] = useState("");
    const [fee, setFee] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (account !== "Not connected") {

                    const contractProvider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_SEPOLIA_URL)

                    const walletProvider = await detectEthereumProvider()


                    if (contractProvider) {
                        const Lottery = new ethers.Contract(
                            contractJSON.address,
                            contractJSON.abi,
                            contractProvider
                        );

                        setContract({ provider: contractProvider, contractObj: Lottery });


                        let feeVal = await Lottery.getEntranceFee();
                        feeVal = ethers.formatEther(feeVal);
                        setFee(feeVal)

                        const currbal = await contractProvider.getBalance(account)

                        setBal(ethers.formatEther(currbal));
                    } else {
                        console.error("Ethereum provider not available.");
                    }
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };

        fetchData();
    }, [account]);

    return (
        <React.StrictMode>
            <p>
                Connected account : {account} </p>
            <p>
                Balance : {bal}
            </p>
            <p>
                Lottery Fee : {fee}
            </p>
        </React.StrictMode>
    );
}
