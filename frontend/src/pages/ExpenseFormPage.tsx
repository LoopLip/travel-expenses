import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Alert, Button, Card, CardContent, Grid, MenuItem, Stack, TextField, Typography } from '@mui/material'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import PageHeader from '../components/PageHeader'
import { trips } from '../data/mock'
import { categoryLabel } from '../data/labels'
import type { ExpenseCategory } from '../types'

// Демонстрация сценария «фото чека → предзаполнение формы».
// Распознавание здесь имитируется фиксированными значениями; реальный OCR не подключён.
const DEMO_RECOGNIZED = { amount: '3450', date: '2026-10-12' }

export default function ExpenseFormPage() {
  const [fileName, setFileName] = useState<string | null>(null)
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState('')

  const handleFile = (file: File | undefined) => {
    if (!file) return
    setFileName(file.name)
    setAmount(DEMO_RECOGNIZED.amount)
    setDate(DEMO_RECOGNIZED.date)
  }

  return (
    <>
      <PageHeader title="Новый расход" subtitle="Загрузите фото чека — сумма и дата подставятся автоматически" />
      <Card>
        <CardContent>
          <Stack spacing={2} sx={{ mb: 3 }}>
            <Button component="label" variant="outlined" startIcon={<UploadFileIcon />} sx={{ alignSelf: 'flex-start' }}>
              Загрузить фото чека
              <input hidden type="file" accept="image/*" onChange={(e) => handleFile(e.target.files?.[0])} />
            </Button>
            {fileName && (
              <Alert severity="info">
                Файл «{fileName}» обработан (демо-режим). Проверьте распознанные значения перед сохранением.
              </Alert>
            )}
          </Stack>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Командировка" select fullWidth defaultValue={trips[0].id}>
                {trips.map((t) => (
                  <MenuItem key={t.id} value={t.id}>{t.destination}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Категория" select fullWidth defaultValue="transport">
                {(Object.keys(categoryLabel) as ExpenseCategory[]).map((c) => (
                  <MenuItem key={c} value={c}>{categoryLabel[c]}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField label="Описание" fullWidth />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Сумма, ₽" type="number" fullWidth value={amount} onChange={(e) => setAmount(e.target.value)} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Дата"
                type="date"
                fullWidth
                value={date}
                onChange={(e) => setDate(e.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>
          </Grid>

          <Typography variant="caption" color="text.secondary" component="p" sx={{ mt: 2 }}>
            Сохранение будет подключено после реализации backend.
          </Typography>
          <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
            <Button variant="contained">Сохранить</Button>
            <Button component={RouterLink} to="/expenses">Отмена</Button>
          </Stack>
        </CardContent>
      </Card>
    </>
  )
}
