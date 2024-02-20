import axios from "axios"
import { create } from "zustand"
import { useWalletStore } from "../Wallet/wallet"
import { Address, verifyMessage } from "viem"

type Store = {
  cidQuery: string
  cidQueryValid: boolean
  viewedNote: {
    title: string
    text: string
    author: Address | null
    signature: Address | null
    signatureValid: boolean
  }
  editedNote: {
    title: string
    text: string
    author: Address | null
    signature: Address | null
    signatureValid: boolean
  }
  loading: boolean
  savedNotesCids: [string, string][]
  mode: "edit" | "view" | "menu"
}

export const useStore = create<Store>(() => ({
  cidQuery: "",
  cidQueryValid: false,
  viewedNote: {
    title: "",
    text: "",
    author: null,
    signature: null,
    signatureValid: false,
  },
  editedNote: {
    title: "",
    text: "",
    author: null,
    signature: null,
    signatureValid: false,
  },
  loading: false,
  savedNotesCids: [],
  mode: "menu",
}))

export function setCidQuery(cidQuery: string) {
  let cidQueryValid = false
  if (cidQuery.length == 46 && cidQuery.startsWith("Qm")) cidQueryValid = true
  useStore.setState({ cidQuery, cidQueryValid })
}

export async function handleSearch() {
  useStore.setState({ loading: true })
  try {
    if (!useStore.getState().cidQueryValid) throw Error("cidQuery is invalid")
    const { data } = await axios.get(`/api/ipfs?cid=${useStore.getState().cidQuery}`)
    console.log({ data })
    const unverifiedNote = { title: data.title, text: data.text, author: data.author, signature: data.signature }

    const address = useWalletStore.getState().account?.address
    if (address === unverifiedNote.author) {
      useStore.setState({
        mode: "edit",
        editedNote: {
          ...unverifiedNote,
          signatureValid: await verifySignature(unverifiedNote),
        },
      })
    } else {
      useStore.setState({
        mode: "view",
        viewedNote: {
          ...unverifiedNote,
          signatureValid: await verifySignature(unverifiedNote),
        },
      })
    }
  } catch (error) {
    console.error(error)
  } finally {
    useStore.setState({ loading: false })
  }
}

export async function handleLoad(cid: string) {
  useStore.setState({ loading: true })
  try {
    const address = useWalletStore.getState().account?.address
    const { data } = await axios.get(`/api/ipfs?cid=${cid}`)
    const unverifiedNote = { title: data.title, text: data.text, author: data.author, signature: data.signature }
    console.log(data)
    if (address === unverifiedNote.author) {
      useStore.setState({
        mode: "edit",
        editedNote: {
          ...unverifiedNote,
          signatureValid: await verifySignature(unverifiedNote),
        },
      })
    } else {
      useStore.setState({
        mode: "view",
        viewedNote: {
          ...unverifiedNote,
          signatureValid: await verifySignature(unverifiedNote),
        },
      })
    }
  } catch (error) {
    console.error(error)
  } finally {
    useStore.setState({ loading: false })
  }
}

export function setMode(mode: Store["mode"]) {
  useStore.setState({ mode })
}

export function setTitle(title: string) {
  useStore.setState(s => ({ editedNote: { ...s.editedNote, title, signatureValid: false, signature: null } }))
}
export function setText(text: string) {
  useStore.setState(s => ({ editedNote: { ...s.editedNote, text, signatureValid: false, signature: null } }))
}
export function setAuthor(author: Address | null) {
  useStore.setState(s => ({ editedNote: { ...s.editedNote, author, signatureValid: false, signature: null } }))
}

export async function handleSave() {
  useStore.setState({ loading: true })
  try {
    let note = useStore.getState().editedNote
    const address = useWalletStore.getState().account?.address
    console.log({ note })

    if (!note.signature) {
      await handleSign()
      note = useStore.getState().editedNote
    }
    if (!note.signatureValid) throw new Error("Signature is invalid")

    const { data } = await axios.post("/api/ipfs", { note })
    const savedNotesCids = JSON.parse(localStorage.getItem("savedNotesCids") || "[]")
    // if (!address) throw Error("address is null")

    localStorage.setItem("savedNotesCids", JSON.stringify([...savedNotesCids, [data.cid, note.title]]))
    useStore.setState(s => ({ savedNotesCids: [...s.savedNotesCids, [data.cid, note.title]] }))
    useStore.setState({
      editedNote: {
        title: data.title,
        text: data.text,
        author: address || null,
        signature: data.text.signature,
        signatureValid: true,
      },
    })
  } catch (error) {
    console.error(error)
  } finally {
    useStore.setState({ loading: false })
  }
}

export async function handleSign() {
  useStore.setState({ loading: true })
  const client = useWalletStore.getState().client
  if (!client || !client.account) {
    useStore.setState({ loading: false })
    return
  }
  const note = useStore.getState().editedNote

  try {
    console.log("signing message:")
    console.log("title:", note.title)
    console.log("text:", note.text)
    console.log("author:", client.account.address)
    console.log(
      "message:",
      JSON.stringify({
        title: note.title,
        text: note.text,
        author: client.account.address,
      })
    )

    const signature = await client.signMessage({
      account: client.account.address,
      message: JSON.stringify({
        title: note.title,
        text: note.text,
        author: client.account.address,
      }),
    })
    console.log("signature:", signature)

    useStore.setState(s => ({ editedNote: { ...s.editedNote, signature, signatureValid: true } }))
  } catch (error) {
    console.error(error)
  } finally {
    useStore.setState({ loading: false })
  }
}

export async function verifySignature(note: Omit<Store["editedNote"], "signatureValid"> | Omit<Store["viewedNote"], "signatureValid">) {
  useStore.setState({ loading: true })
  try {
    if (!note.author) throw Error("author is null")
    if (!note.signature) throw Error("signature is null")

    console.log("verifying message:")
    console.log(
      "message:",
      JSON.stringify({
        title: note.title,
        text: note.text,
        author: note.author,
      })
    )

    const isValid = await verifyMessage({
      address: note.author,
      message: JSON.stringify({
        title: note.title,
        text: note.text,
        author: note.author,
      }),
      signature: note.signature,
    })

    return isValid
  } catch (error) {
    console.error(error)
    return false
  } finally {
    useStore.setState({ loading: false })
  }
}
