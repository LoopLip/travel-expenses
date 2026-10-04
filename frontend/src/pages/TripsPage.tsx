import { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import {
  Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ToggleButton, ToggleButtonGroup,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import PageHeader from '../components/PageHeader'
import StatusChip from '../components/StatusChip'
import { trips } from '../data/mock'
import { formatDate, formatMoney, tripStatusLabel } from '../data/labels'
import type { TripStatus } from '../types'

type Filter = 'all' | TripStatus

export default function TripsPage() {
  const [filter, setFilter] = useState<Filter>('all')
  const navigate = useNavigate()
  const visible = filter === 'all' ? trips : trips.filter((t) => t.status === filter)

  return (
    <>
      <PageHeader
        title="Командировки"
        subtitle="Заявки сотрудников и их статусы"
        action={
          <Button component={RouterLink} to="/trips/new" variant="contained" startIcon={<AddIcon />}>
            Новая заявка
          </Button>
        }
      />

      <ToggleButtonGroup
        size="small"
        exclusive
        value={filter}
        onChange={(_, v: Filter | null) => v && setFilter(v)}
        sx={{ mb: 2, flexWrap: 'wrap' }}
      >
        <ToggleButton value="all">Все</ToggleButton>
        {(Object.keys(tripStatusLabel) as TripStatus[]).map((s) => (
          <ToggleButton key={s} value={s}>{tripStatusLabel[s].text}</ToggleButton>
        ))}
      </ToggleButtonGroup>

      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Направление</TableCell>
              <TableCell>Сотрудник</TableCell>
              <TableCell>Даты</TableCell>
              <TableCell align="right">План</TableCell>
              <TableCell>Статус</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visible.map((t) => (
              <TableRow key={t.id} hover sx={{ cursor: 'pointer' }} onClick={() => navigate(`/trips/${t.id}`)}>
                <TableCell>{t.destination}</TableCell>
                <TableCell>{t.employee}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatDate(t.startDate)} — {formatDate(t.endDate)}</TableCell>
                <TableCell align="right">{formatMoney(t.plannedAmount)}</TableCell>
                <TableCell><StatusChip {...tripStatusLabel[t.status]} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}
