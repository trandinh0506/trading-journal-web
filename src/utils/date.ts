export const formatTradeTime = (utcString: string | null) => {
  if (!utcString) return { date: '---', time: '---' }
  const date = new Date(utcString.endsWith('Z') ? utcString : `${utcString}Z`)

  return {
    date: date.toLocaleDateString('en-GB'),
    time: date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }
}
