import { Trans } from '@lingui/macro'
import Row from 'components/Row'
import { Logo } from 'icons'
import { memo } from 'react'
import styled from 'styled-components/macro'
import { AnimationSpeed, brand, ThemedText } from 'theme'

import ExternalLink from './ExternalLink'

const UniswapA = styled(ExternalLink)`
  color: ${({ theme }) => theme.secondary};
  cursor: pointer;
  text-decoration: none;

  ${Logo} {
    fill: ${({ theme }) => theme.secondary};
    height: 1rem;
    transition: transform ${AnimationSpeed.Medium} ease, fill ${AnimationSpeed.Medium} ease;
    width: 1rem;
    will-change: transform;
  }

  :hover ${Logo} {
    fill: ${brand};
    transform: rotate(-5deg);
  }
`
const Wrapper = styled(Row)`
  margin-top: 12px;
`

export default memo(function BrandedFooter() {
  return (
    <Wrapper justify="center">
      <UniswapA href={`https://app.forge.trade/`}>
        <Row gap={0.25}>
          <ThemedText.Caption>
            <Trans>🔥 Powered by Forge on Evmos</Trans>
          </ThemedText.Caption>
        </Row>
      </UniswapA>
    </Wrapper>
  )
})
