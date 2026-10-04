import { Chip } from '@mui/material'

interface Props {
  text: string
  color: 'default' | 'warning' | 'success' | 'error' | 'info'
}

export default function StatusChip({ text, color }: Props) {
  return <Chip size="small" label={text} color={color} variant={color === 'default' ? 'outlined' : 'filled'} />
}
