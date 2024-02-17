import React from "react"
import styles from "./SavedNotes.module.css"
import { handleLoad, useStore } from "../store/store"

export default function SavedNotes() {
  const savedNotesCids = useStore(s => s.savedNotesCids)

  return (
    <div className={styles.container}>
      <h2>Saved Notes</h2>
      <div className={styles.content}>
        <br />
        {savedNotesCids.map(cid => (
          <button className={styles.entry} onClick={() => handleLoad(cid)} key={cid}>
            {cid}
          </button>
        ))}
        {savedNotesCids.length === 0 && <div className={styles.empty_message}>You have no saved notes yet...</div>}
      </div>
    </div>
  )
}
