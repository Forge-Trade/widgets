import { tokens } from '@uniswap/default-token-list'
import { TokenInfo } from '@uniswap/token-lists'
import {
  darkTheme,
  defaultTheme,
  DialogAnimationType,
  lightTheme,
  SupportedChainId,
  SwapWidget,
} from '@forge-trade/widgets'
import Row from 'components/Row'
import { CHAIN_NAMES_TO_IDS } from 'constants/chains'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useValue } from 'react-cosmos/fixture'

import { DAI, USDC_MAINNET, WRAPPED_NATIVE_CURRENCY } from '../constants/tokens'
import EventFeed, { Event, HANDLERS } from './EventFeed'
import useOption from './useOption'
import useProvider from './useProvider'
import { USDC_EVMOS, WEVMOS_EVMOS } from '@forge-trade/smart-order-router'

const TOKEN_WITH_NO_LOGO = {
  chainId: 1,
  decimals: 18,
  symbol: 'HDRN',
  name: 'Hedron',
  address: '0x3819f64f282bf135d62168C1e513280dAF905e06',
}
export const EVMOS_LIST = 'https://raw.githubusercontent.com/Forge-Trade/tokenlist/main/src/tokenlist.json'

const mainnetTokens = tokens.filter((token) => token.chainId === SupportedChainId.MAINNET)
const tokenLists: Record<string, TokenInfo[] | string> = {
  Default: EVMOS_LIST,
  Extended: 'https://extendedtokens.uniswap.org/',
  'Mainnet only': mainnetTokens,
  Logoless: [TOKEN_WITH_NO_LOGO],
}

function Fixture() {
  const [events, setEvents] = useState<Event[]>([])
  const useHandleEvent = useCallback(
    (name: string) =>
      (...data: unknown[]) =>
        setEvents((events) => [{ name, data }, ...events]),
    []
  )

  const [convenienceFee] = useValue('convenienceFee', { defaultValue: 1 })
  const [convenienceFeeRecipient] = useValue('convenienceFeeRecipient', {
    defaultValue: '0x24BF5955eED3622b7779e07487dA7A24efD6E2de',
  })

  // TODO(zzmp): Changing defaults has no effect if done after the first render.
  const currencies: Record<string, string> = {
    Native: 'NATIVE',
    USDC: USDC_EVMOS.address,
    WEVMOS: WRAPPED_NATIVE_CURRENCY[9001].address,
  }
  const defaultInputToken = useOption('defaultInputToken', {
    options: currencies,
    defaultValue: WEVMOS_EVMOS,
  })
  const [defaultInputAmount] = useValue('defaultInputAmount', { defaultValue: 0 })
  const defaultOutputToken = useOption('defaultOutputToken', { options: currencies, defaultValue: currencies.USDC })
  const [defaultOutputAmount] = useValue('defaultOutputAmount', { defaultValue: 0 })

  const [brandedFooter] = useValue('brandedFooter', { defaultValue: true })
  const [hideConnectionUI] = useValue('hideConnectionUI', { defaultValue: false })
  const [pageCentered] = useValue('pageCentered', { defaultValue: false })

  const [width] = useValue('width', { defaultValue: 360 })

  const [theme, setTheme] = useValue('theme', { defaultValue: defaultTheme })
  const [darkMode] = useValue('darkMode', { defaultValue: true })
  useEffect(() => setTheme((theme) => ({ ...theme, ...(darkMode ? darkTheme : lightTheme) })), [darkMode, setTheme])

  const defaultNetwork = useOption('defaultChainId', {
    options: Object.keys(CHAIN_NAMES_TO_IDS),
    defaultValue: 'evmos',
  })
  const defaultChainId = defaultNetwork ? CHAIN_NAMES_TO_IDS[defaultNetwork] : undefined

  const connector = useProvider(9001)

  const tokenList = useOption('tokenList', { options: tokenLists, defaultValue: 'Default', nullable: false })

  const [routerUrl] = useValue('routerUrl', { defaultValue: 'https://forge-router.evmosdao.xyz/' })

  const dialogAnimation = useOption('dialogAnimation', {
    defaultValue: DialogAnimationType.FADE,
    options: [DialogAnimationType.SLIDE, DialogAnimationType.FADE, DialogAnimationType.NONE],
  })

  const eventHandlers = useMemo(
    // eslint-disable-next-line react-hooks/rules-of-hooks
    () => HANDLERS.reduce((handlers, name) => ({ ...handlers, [name]: useHandleEvent(name) }), {}),
    [useHandleEvent]
  )

  const widget = (
    <SwapWidget
      permit2
      convenienceFee={convenienceFee}
      convenienceFeeRecipient={convenienceFeeRecipient}
      defaultInputTokenAddress={defaultInputToken}
      defaultInputAmount={defaultInputAmount}
      defaultOutputTokenAddress={defaultOutputToken}
      defaultOutputAmount={defaultOutputAmount}
      hideConnectionUI={hideConnectionUI}
      defaultChainId={defaultChainId}
      provider={connector}
      theme={theme}
      tokenList={tokenList}
      width={width}
      routerUrl={routerUrl}
      brandedFooter={brandedFooter}
      dialogOptions={{
        animationType: dialogAnimation,
        pageCentered,
      }}
      {...eventHandlers}
    />
  )

  // If framed in a different origin, only display the SwapWidget, without any chrome.
  // This is done to faciliate iframing in the documentation (https://docs.uniswap.org).
  if (!window.frameElement) return widget

  return (
    <Row flex align="start" justify="start" gap={0.5}>
      {widget}
      <EventFeed events={events} onClear={() => setEvents([])} />
    </Row>
  )
}

export default <Fixture />
