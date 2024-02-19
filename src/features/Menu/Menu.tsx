import React from "react"
import styles from "./Menu.module.css"
import { setMode } from "../store/store"

export default function Menu() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div>
          <button className={styles.create_button} onClick={() => setMode("edit")}>
            <div>+</div>
            <div>Create a new note</div>
          </button>
        </div>
        <div>or search for an existing note by CID.</div>
      </div>
    </div>
  )
}
