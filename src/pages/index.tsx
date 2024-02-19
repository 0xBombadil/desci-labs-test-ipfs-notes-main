import Head from "next/head"
import { Inter } from "@next/font/google"
import Header from "../features/Layout/Header/Header"
import Footer from "../features/Layout/Footer/Footer"
import Editor from "../features/Editor/Editor"
import Viewer from "../features/Viewer/Viewer"
import Sidebar from "../features/Layout/Sidebar/Sidebar"
import { useStore } from "../features/store/store"
import Menu from "../features/Menu/Menu"
const inter = Inter({ subsets: ["latin"] })

export default function Home() {
  const mode = useStore(s => s.mode)
  return (
    <>
      <Head>
        <title>IPFS Notes</title>
        <meta name="description" content="IPFS Notes" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main>
        <Sidebar />
        {mode === "menu" && <Menu />}
        {mode === "view" && <Viewer />}
        {mode === "edit" && <Editor />}
      </main>
      <Footer />
    </>
  )
}
