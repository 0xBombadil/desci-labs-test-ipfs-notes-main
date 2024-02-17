import { useEffect } from "react"
import "../styles/globals.css"
import type { AppProps } from "next/app"
import { useStore } from "../features/store/store"

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (typeof localStorage === "undefined") return
    useStore.setState({ savedNotesCids: JSON.parse(localStorage.getItem("savedNotesCids") || "[]") })
  }, [])
  return <Component {...pageProps} />
}
