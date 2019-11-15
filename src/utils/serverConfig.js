const SERVER_URL = 'https://dcpg2gtwapp1.compass-group.digital:8024'
const PRODUCTION_PATH = '/sap/bc/ui5_ui5/sap/zreactapp'

const getDomainPath = () => {
  if (process.env.NODE_ENV === 'development') {
    return ''
  }
  return PRODUCTION_PATH
}

export { SERVER_URL, PRODUCTION_PATH }
export { getDomainPath }
