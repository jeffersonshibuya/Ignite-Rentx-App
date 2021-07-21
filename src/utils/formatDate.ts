
function formatDate(date: Date) {
  return new Date(date.valueOf() + date.getTimezoneOffset() * 60 * 1000)
}

export { formatDate };