import { Link as RouterLink } from 'react-router-dom'
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import PageHeader from '../components/PageHeader'
import StatusChip from '../components/StatusChip'
import { advances, trips } from '../data/mock'
import { advanceStatusLabel, formatDate, formatMoney } from '../data/labels'

export default function AdvancesPage() {
  return (
    <>
      <PageHeader title="Авансы" subtitle="Запросы и выдача авансов на командировки" />
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Командировка</TableCell>
              <TableCell>Дата запроса</TableCell>
              <TableCell align="right">Сумма</TableCell>
              <TableCell>Статус</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {advances.map((a) => {
              const trip = trips.find((t) => t.id === a.tripId)
              return (
                <TableRow key={a.id} hover>
                  <TableCell><RouterLink to={`/trips/${a.tripId}`}>{trip?.destination}</RouterLink></TableCell>
                  <TableCell>{formatDate(a.requestedAt)}</TableCell>
                  <TableCell align="right">{formatMoney(a.amount)}</TableCell>
                  <TableCell><StatusChip {...advanceStatusLabel[a.status]} /></TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}
