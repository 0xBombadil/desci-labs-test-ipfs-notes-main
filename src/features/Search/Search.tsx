import React from "react"
import styles from "./Search.module.css"
import { handleSearch, setCidQuery, useStore } from "../store/store"

export default function Search() {
  const cidQuery = useStore(s => s.cidQuery)
  const cidQueryValid = useStore(s => s.cidQueryValid)

  const loading = useStore(s => s.loading)

  return (
    <div className={styles.container}>
      <input
        className={styles.input}
        type="text"
        name="cid"
        value={cidQuery}
        onChange={v => setCidQuery(v.target.value)}
        placeholder="Search by CID..."
      />
      <button className={`${styles.button} ${loading ? styles.loading : ""}`} onClick={handleSearch} disabled={!cidQueryValid || loading}>
        {loading ? "Loading..." : "Retrieve Data"}
      </button>
    </div>
  )
}
