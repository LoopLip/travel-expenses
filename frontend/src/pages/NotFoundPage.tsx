import { Link as RouterLink } from 'react-router-dom'
import { Box, Button, Typography } from '@mui/material'

export default function NotFoundPage() {
  return (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <Typography variant="h3" component="h1" gutterBottom>404</Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>Страница не найдена</Typography>
      <Button component={RouterLink} to="/" variant="contained">На главную</Button>
    </Box>
  )
}
