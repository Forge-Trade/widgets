import { initializeConnector } from '@web3-react/core'
import { MetaMask } from '@web3-react/metamask'
import { Connector } from '@web3-react/types'
import { useEffect, useState } from 'react'

import useOption from './useOption'

enum Wallet {
  MetaMask = 'MetaMask',
}
const [metaMask] = initializeConnector<MetaMask>((actions) => new MetaMask({ actions }))

export default function useProvider(defaultChainId?: number) {
  const connectorType = useOption('provider', { options: [Wallet.MetaMask] })
  const [connector, setConnector] = useState<Connector>()
  useEffect(() => {
    let stale = false
    activateConnector(connectorType)
    return () => {
      stale = true
    }

    async function activateConnector(connectorType: Wallet | undefined) {
      let connector: Connector | undefined
      switch (connectorType) {
        case Wallet.MetaMask:
          await metaMask.activate(defaultChainId)
          connector = metaMask
          break
      }
      if (!stale) {
        setConnector((oldConnector) => {
          oldConnector?.deactivate?.()
          return connector
        })
      }
    }
  }, [connectorType, defaultChainId])

  return connector?.provider
}
