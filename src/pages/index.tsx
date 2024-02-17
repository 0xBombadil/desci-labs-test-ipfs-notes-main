import Head from "next/head"
import { Inter } from "@next/font/google"
import Header from "../features/Layout/Header/Header"
import Footer from "../features/Layout/Footer/Footer"
import Viewer from "../features/Viewer/Viewer"
import Sidebar from "../features/Layout/Sidebar/Sidebar"
const inter = Inter({ subsets: ["latin"] })

export default function Home() {
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
        <Viewer />
      </main>
      <Footer />
    </>
  )
}
