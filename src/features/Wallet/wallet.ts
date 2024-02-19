import { init, useWallets } from "@web3-onboard/react"
import injectedModule from "@web3-onboard/injected-wallets"
import { create } from "zustand"
import { Address, createWalletClient } from "viem"

const injected = injectedModule()

const wallets = [injected]

const chains = [
  {
    id: "0x1",
    token: "ETH",
    label: "Ethereum Mainnet",
    rpcUrl: `https://eth.llamarpc.com	`,
  },
]

const appMetadata = {
  name: "Connect Wallet Example",
  icon: "<svg>My App Icon</svg>",
  description: "Example showcasing how to connect a wallet.",
  recommendedInjectedWallets: [
    { name: "MetaMask", url: "https://metamask.io" },
    { name: "Coinbase", url: "https://wallet.coinbase.com/" },
  ],
}

export const web3Onboard = init({
  wallets,
  chains,
  appMetadata,
  connect: { autoConnectLastWallet: true },
  accountCenter: { desktop: { enabled: false }, mobile: { enabled: false } },
  theme: "dark",
})

interface Account {
  address: Address
  ens: { name: string | undefined; avatar: string | undefined }
}

type WalletStore = {
  account: Account | null
  client: ReturnType<typeof createWalletClient> | null
  connecting: boolean
}

export const useWalletStore = create<WalletStore>(() => ({
  account: null,
  client: null,
  connecting: false,
}))

export function setConnecting(connecting: boolean) {
  useWalletStore.setState({ connecting })
}

export function setAccount(account: Account) {
  useWalletStore.setState({ account })
}

export function setClient(client: ReturnType<typeof createWalletClient> | null) {
  useWalletStore.setState({ client })
}
