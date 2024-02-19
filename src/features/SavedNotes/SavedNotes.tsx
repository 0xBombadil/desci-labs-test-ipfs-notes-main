import React from "react"
import styles from "./SavedNotes.module.css"
import { handleLoad, setMode, useStore } from "../store/store"

export default function SavedNotes() {
  const savedNotesCids = useStore(s => s.savedNotesCids)

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {savedNotesCids.length === 0 ? (
          <div className={styles.empty_message}>You have no saved notes yet...</div>
        ) : (
          savedNotesCids.map(([cid, title]) => (
            <div className={styles.entry} key={cid}>
              <div className={styles.entry_content}>
                <div className={styles.entry_title}>{title}</div>
                <div className={styles.entry_cid}>{cid}</div>
              </div>
              <button className={styles.view_button} onClick={() => handleLoad(cid)}>
                {rightArrowSVG}
              </button>
            </div>
          ))
        )}
        <div className={styles.new_note}>
          <button className={styles.create_button} onClick={() => setMode("edit")}>
            <div>+</div>
            <div>Create a new note</div>
          </button>
        </div>
      </div>
    </div>
  )
}

const rightArrowSVG = (
  <svg fill="currentColor" height="1em" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <polygon points="150.46 478 129.86 456.5 339.11 256 129.86 55.49 150.46 34 382.14 256 150.46 478" />
  </svg>
)
