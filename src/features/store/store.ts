import axios from "axios"
import { create } from "zustand"

type Store = {
  cidQuery: string
  cidQueryValid: boolean
  note: {
    title: string
    text: string
  }
  loading: boolean
  savedNotesCids: string[]
}

export const useStore = create<Store>(() => ({
  cidQuery: "",
  cidQueryValid: false,
  note: {
    title: "",
    text: "",
  },
  loading: false,
  savedNotesCids: [],
}))

export function setCidQuery(cidQuery: string) {
  let cidQueryValid = false
  if (cidQuery.length == 46 && cidQuery.startsWith("Qm")) cidQueryValid = true
  useStore.setState({ cidQuery, cidQueryValid })
}

export async function handleSearch() {
  if (!useStore.getState().cidQueryValid) throw Error("cidQuery is invalid")
  useStore.setState({ loading: true })
  const { data } = await axios.get(`/api/ipfs?cid=${useStore.getState().cidQuery}`)
  useStore.setState({ note: { title: data.content.title, text: data.content.text } })
  useStore.setState({ loading: false })
}

export async function handleLoad(cid: string) {
  useStore.setState({ loading: true })
  const { data } = await axios.get(`/api/ipfs?cid=${cid}`)
  useStore.setState({ note: { title: data.content.title, text: data.content.text } })
  useStore.setState({ loading: false })
}

export function setTitle(title: string) {
  useStore.setState(s => ({ note: { title: title, text: s.note.text } }))
}

export function setText(text: string) {
  useStore.setState(s => ({ note: { title: s.note.title, text: text } }))
}

export async function handleSave() {
  useStore.setState({ loading: true })
  const note = useStore.getState().note
  console.log({ note })
  const { data } = await axios.post("/api/ipfs", { note })
  const savedNotesCids = JSON.parse(localStorage.getItem("savedNotesCids") || "[]")
  localStorage.setItem("savedNotesCids", JSON.stringify([...savedNotesCids, data.cid]))
  useStore.setState(s => ({ savedNotesCids: [...s.savedNotesCids, data.cid] }))
  useStore.setState({ note: { title: data.content.title, text: data.content.text } })
  useStore.setState({ loading: false })
}
