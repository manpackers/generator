const dater = new Date()
/**
 *
 */
const format = (pattern = 'yyyy-mm-dd') => {
  let month = dater.getMonth() + 1
  let date = dater.getDate()

  try {
    return [
      dater.getFullYear(), (month > 10 ? month : `0${month}`), date > 10 ? date : `0${date}`
    ].join(
      pattern.match(/^(y{4})([^ymd])*(m{2})\2(d{2})$/).splice(2, 1)
    )
  } catch (err) { console.warn('Example: yyyy-mm-dd or yyyy/mm/dd') }
}
module.exports = { format }
