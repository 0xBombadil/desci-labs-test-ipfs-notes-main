import React from "react"
import { handleSave, setText, setTitle, useStore } from "../store/store"
import styles from "./Viewer.module.css"

export default function Viewer() {
  const title = useStore(s => s.note.title)
  const text = useStore(s => s.note.text)
  const loading = useStore(s => s.loading)

  return (
    <div className={styles.container}>
      <button onClick={handleSave} className={`${styles.button} ${loading ? styles.loading : ""}`}>
        {loading ? "Loading..." : "Save Data"}
      </button>
      <input className={styles.titleInput} name="title" onChange={v => setTitle(v.target.value)} value={title} placeholder="Title" type="text" />
      <textarea
        className={styles.textInput}
        name="content"
        onChange={v => setText(v.target.value)}
        value={text}
        placeholder="Take a note..."
        rows={10}
      />
    </div>
  )
}
