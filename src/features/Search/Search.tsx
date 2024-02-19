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
        {searchSVG}
      </button>
    </div>
  )
}

const searchSVG = (
  <svg height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M11 6C13.7614 6 16 8.23858 16 11M16.6588 16.6549L21 21M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
