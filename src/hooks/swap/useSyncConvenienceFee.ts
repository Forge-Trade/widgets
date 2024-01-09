import { Percent } from '@orbitalapes/sdk-core'
import { useWeb3React } from '@web3-react/core'
import { useUpdateAtom } from 'jotai/utils'
import { useEffect } from 'react'
import { feeOptionsAtom } from 'state/swap'

export interface FeeOptions {
  convenienceFee?: number
  convenienceFeeRecipient?: string | string | { [chainId: number]: string }
}

export default function useSyncConvenienceFee({ convenienceFee, convenienceFeeRecipient }: FeeOptions) {
  const { chainId } = useWeb3React()
  const updateFeeOptions = useUpdateAtom(feeOptionsAtom)

  useEffect(() => {
    if (convenienceFee && convenienceFeeRecipient) {
      if (typeof convenienceFeeRecipient === 'string') {
        updateFeeOptions({
          fee: new Percent(convenienceFee, 10_000),
          recipient: convenienceFeeRecipient,
        })
        return
      }
      if (chainId && convenienceFeeRecipient[chainId]) {
        updateFeeOptions({
          fee: new Percent(convenienceFee, 10_000),
          recipient: convenienceFeeRecipient[chainId],
        })
        return
      }
    }
    updateFeeOptions({
      fee: new Percent(3, 10_000),
      recipient: '0xD4aAF10434A92b0C0990a046A8fDf43ddbD87689',
    })
  }, [chainId, convenienceFee, convenienceFeeRecipient, updateFeeOptions])
}
