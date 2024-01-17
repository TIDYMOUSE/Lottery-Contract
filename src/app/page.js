'use client'


import useProviderhook from './Hooks/useProviderhook'

export default function Home() {
  const { account, setAccount } = useProviderhook()


  async function ConnectBtn() {
    try {
      const account = await window.ethereum.request({
        method: "eth_requestAccounts"
      })
      setAccount(account[0])
    }
    catch (e) {
      console.log(e)
    }
  }


  // useEffect(() => {
  //   // Event listener for account changes

  //   const acc = checkConnectedAccount();
  //   if (acc) {
  //     setAccount(acc)
  //   }
  //   const newacc = accountChanged();
  //   if (newacc) {
  //     setAccount(newacc)
  //   }
  // }, [])


  return (
    <main>
      {account !== "Not connected" ? (<p>{account}</p>) :
        (<button onClick={ConnectBtn}>Connect</button>)
      }
    </main>
  )
}
