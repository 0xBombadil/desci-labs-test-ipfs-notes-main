import { useEffect } from "react"
import { useConnectWallet } from "@web3-onboard/react"
import { prettyAddress } from "../../../utils"
import { Address, createWalletClient, custom } from "viem"
import { setAccount, setClient, setConnecting, useWalletStore } from "../wallet"
import { setAuthor } from "../../store/store"
import styles from "./ConnectWallet.module.css"

export default function ConnectWallet() {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
  const account = useWalletStore(s => s.account)
  //   const [ethersProvider, setProvider] = useState<ethers.providers.Web3Provider | null>()
  //   const [account, setAccount] = useState<Account | null>(null)

  useEffect(() => {
    if (wallet?.provider) {
      const { name, avatar } = wallet?.accounts[0].ens ?? {}
      setAccount({
        address: wallet.accounts[0].address as Address,
        // balance: wallet.accounts[0].balance,
        ens: { name, avatar: avatar?.url },
      })
    }
  }, [wallet])

  useEffect(() => {
    setConnecting(connecting)
  }, [connecting])

  useEffect(() => {
    // If the wallet has a provider than the wallet is connected
    if (wallet?.accounts[0].address) {
      setAuthor(wallet.accounts[0].address as Address)
    } else {
      setAuthor(null)
    }

    if (wallet?.provider && typeof window !== "undefined" && (window as any).ethereum) {
      const client = createWalletClient({ account: wallet.accounts[0].address as Address, transport: custom((window as any).ethereum) })
      setClient(client)
    }
  }, [wallet])

  if (wallet?.provider && account) {
    return (
      <div className={styles.container}>
        {account.ens?.avatar ? <img src={account.ens?.avatar} alt="ENS Avatar" /> : null}
        <div className={styles.name}>{account.ens?.name ? account.ens.name : prettyAddress(account.address as Address)}</div>
        <button
          className={styles.disconnect_button}
          onClick={() => {
            disconnect({ label: wallet.label })
          }}
        >
          {disconnectSVG}
        </button>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <button className={styles.connect_button} disabled={connecting} onClick={() => connect()}>
        <span className={styles.icon}>{connectSVG}</span> Connect Wallet
      </button>
    </div>
  )
}

const disconnectSVG = (
  <svg height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 7V12M8 8.99951C7.37209 9.83526 7 10.8742 7 12C7 14.7614 9.23858 17 12 17C14.7614 17 17 14.7614 17 12C17 10.8742 16.6279 9.83526 16 8.99951M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
const connectSVG = (
  <svg height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M18 8V7.2C18 6.0799 18 5.51984 17.782 5.09202C17.5903 4.71569 17.2843 4.40973 16.908 4.21799C16.4802 4 15.9201 4 14.8 4H6.2C5.07989 4 4.51984 4 4.09202 4.21799C3.71569 4.40973 3.40973 4.71569 3.21799 5.09202C3 5.51984 3 6.0799 3 7.2V8M21 12H19C17.8954 12 17 12.8954 17 14C17 15.1046 17.8954 16 19 16H21M3 8V16.8C3 17.9201 3 18.4802 3.21799 18.908C3.40973 19.2843 3.71569 19.5903 4.09202 19.782C4.51984 20 5.07989 20 6.2 20H17.8C18.9201 20 19.4802 20 19.908 19.782C20.2843 19.5903 20.5903 19.2843 20.782 18.908C21 18.4802 21 17.9201 21 16.8V11.2C21 10.0799 21 9.51984 20.782 9.09202C20.5903 8.71569 20.2843 8.40973 19.908 8.21799C19.4802 8 18.9201 8 17.8 8H3Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
