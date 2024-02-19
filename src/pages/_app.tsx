import { useEffect } from "react"
import "../styles/globals.css"
import type { AppProps } from "next/app"
import { useStore } from "../features/store/store"
import { Web3OnboardProvider } from "@web3-onboard/react"
import { web3Onboard } from "../features/Wallet/wallet"

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (typeof localStorage === "undefined") return
    useStore.setState({ savedNotesCids: JSON.parse(localStorage.getItem("savedNotesCids") || "[]") })
  }, [])
  return (
    <Web3OnboardProvider web3Onboard={web3Onboard}>
      <Component {...pageProps} />
    </Web3OnboardProvider>
  )
}
