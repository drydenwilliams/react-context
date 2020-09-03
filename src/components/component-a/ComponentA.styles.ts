import styled from 'styled-components'

export const StyledComponentA = styled.div(({ theme }) => ({
  backgroundColor: theme.colors.black,
  padding: '20px',
}))
