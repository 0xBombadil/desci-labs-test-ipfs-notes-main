import React from "react"
import styles from "./Header.module.css"
import Search from "../../Search/Search"
export default function Header() {
  return (
    <header className={styles.container}>
      <h1>IPFS Notes</h1>
      <Search />
      <div>
        <button>Connect Wallet</button>
      </div>
    </header>
  )
}
