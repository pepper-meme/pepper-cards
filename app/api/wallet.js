import { createAppKit, useAppKitAccount, useAppKitProvider } from '@reown/appkit/react'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import { base } from '@reown/appkit/networks'

const appKit = createAppKit({
    adapters: [new EthersAdapter()],
    metadata: {
        name: process.env.NEXT_PUBLIC_NAME,
        description: process.env.NEXT_PUBLIC_DESCRIPTION,
        url: process.env.NEXT_PUBLIC_URL,
        icons: []
    },
    networks: [base],
    projectId: process.env.NEXT_PUBLIC_WEB3MODAL_ID,
    features: {
        analytics: true,
        email: false,
        socials: false
    }
})

export function getAppKit() {
    return appKit
}

export { useAppKitAccount, useAppKitProvider }

