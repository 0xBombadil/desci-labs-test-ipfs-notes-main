import React from "react"
import styles from "./Sidebar.module.css"
import SavedNotes from "../../SavedNotes/SavedNotes"

export default function Sidebar() {
  return (
    <div className={styles.container}>
      <SavedNotes />
    </div>
  )
}
