/**
 * 格式化时间 默认格式: YYYY-MM-DD HH:mm
 */
const format = (time, pattern = 'YYYY-MM-DD HH:mm') => {
  let dater = new Date(time)
  let year = dater.getFullYear()
  let month = dater.getMonth() + 1
  let day = dater.getDate()
  let hour = dater.getHours()
  let minute = dater.getMinutes()

  return pattern.replace('YYYY', year)
    .replace('MM', month < 10 ? `0${month}` : month)
    .replace('DD', day < 10 ? `0${day}` : day)
    .replace('HH', hour < 10 ? `0${hour}` : hour)
    .replace('mm', minute < 10 ? `0${minute}` : minute)
}
module.exports = { format }
