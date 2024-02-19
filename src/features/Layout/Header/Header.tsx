import React from "react"
import styles from "./Header.module.css"
import Search from "../../Search/Search"
import ConnectWallet from "../../Wallet/components/ConnectWallet"
export default function Header() {
  return (
    <header className={styles.container}>
      <h1>IPFS Notes</h1>
      <Search />
      <div>
        <ConnectWallet />
      </div>
    </header>
  )
}
