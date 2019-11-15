import format from 'date-fns/format'

export const parseODataDate = str =>
  str ? Number(str.replace(/\D+/g, '')) : null

export const convertToJsonODataDate = date => {
  const time = new Date(date).getTime()
  return `/Date(${time})/`
}

export const convertToEdmDateTime = date => {
  const formattedDate = format(date, 'YYYY-MM-DDTHH:mm:ss')
  return `datetime'${formattedDate}'`
}
