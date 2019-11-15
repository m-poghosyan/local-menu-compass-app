import { format } from 'date-fns'
import { parseODataDate } from '../utils/dates'

// -- Dates ----------

export const dateRange = (
  from,
  to,
  odata = false,
  dateFormat = 'DD/MM/YYYY',
  separator = '~'
) => {
  const fromDate = odata ? new Date(parseODataDate(from)) : new Date(from)
  const toDate = odata ? new Date(parseODataDate(to)) : new Date(to)

  return `
    ${format(fromDate, dateFormat)}
    ${separator}
    ${format(toDate, dateFormat)}`
}

export const isNumberOrEmpty = (value, emptyChar = '-') =>
  typeof value === 'number' && !Number.isNaN(value) ? value : emptyChar

export const formatDecimal = (value, decimals = 2) => {
  const num = typeof value === 'number' ? value : Number(value)
  return num.toFixed(decimals)
}
