import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import type { FetchResponse } from 'ofetch'
import type { PayloadDataCollectionPaginated, ResponseError } from '~/types/response'

dayjs.extend(duration)

const cutText = (text: string, length: number) => {
  if (text.split(' ').length > 1) {
    const string = text.substring(0, length)
    const splitText = string.split(' ')
    splitText.pop()
    return splitText.join(' ') + '...'
  } else {
    return text
  }
}

const formatDate = (date: string, format: string) => {
  return dayjs(date).format(format)
}

const capitalizeFirstLetter = (string: string) => {
  if (string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  } else {
    return ''
  }
}

const onlyNumber = (string: string) => {
  if (string) {
    return string.replace(/\D/g, '')
  } else {
    return ''
  }
}

const formatCurrency = (number: number) => {
  if (number) {
    const formattedNumber = number.toString().replace(/\D/g, '')
    const rest = formattedNumber.length % 3
    let currency = formattedNumber.substr(0, rest)
    const thousand = formattedNumber.substr(rest).match(/\d{3}/g)
    let separator

    if (thousand) {
      separator = rest ? '.' : ''
      currency += separator + thousand.join('.')
    }

    return currency
  } else {
    return ''
  }
}

const timeAgo = (time: string) => {
  const date = new Date((time || '').replace(/-/g, '/').replace(/[TZ]/g, ' '))
  const diff = (new Date().getTime() - date.getTime()) / 1000
  const dayDiff = Math.floor(diff / 86400)

  if (isNaN(dayDiff) || dayDiff < 0 || dayDiff >= 31) {
    return dayjs(time).format('MMMM DD, YYYY')
  }

  return (
    (dayDiff === 0 &&
      ((diff < 60 && 'just now') ||
        (diff < 120 && '1 minute ago') ||
        (diff < 3600 && Math.floor(diff / 60) + ' minutes ago') ||
        (diff < 7200 && '1 hour ago') ||
        (diff < 86400 && Math.floor(diff / 3600) + ' hours ago'))) ||
    (dayDiff === 1 && 'Yesterday') ||
    (dayDiff < 7 && dayDiff + ' days ago') ||
    (dayDiff < 31 && Math.ceil(dayDiff / 7) + ' weeks ago')
  )
}

const diffTimeByNow = (time: string) => {
  const startDate = dayjs(dayjs().format('YYYY-MM-DD HH:mm:ss').toString())
  const endDate = dayjs(dayjs(time).format('YYYY-MM-DD HH:mm:ss').toString())

  const duration = dayjs.duration(endDate.diff(startDate))
  const milliseconds = Math.floor(duration.asMilliseconds())

  const days = Math.round(milliseconds / 86400000)
  const hours = Math.round((milliseconds % 86400000) / 3600000)
  let minutes = Math.round(((milliseconds % 86400000) % 3600000) / 60000)
  const seconds = Math.round((((milliseconds % 86400000) % 3600000) % 60000) / 1000)

  if (seconds < 30 && seconds >= 0) {
    minutes += 1
  }

  return {
    days: days.toString().length < 2 ? '0' + days : days,
    hours: hours.toString().length < 2 ? '0' + hours : hours,
    minutes: minutes.toString().length < 2 ? '0' + minutes : minutes,
    seconds: seconds.toString().length < 2 ? '0' + seconds : seconds,
  }
}

/**
 * Renders a duration the API reports in (fractional) milliseconds.
 *
 * Sub-millisecond is shown as "<1 ms" rather than "0 ms": most background jobs
 * here finish in microseconds, and a column of zeroes reads as "not measured"
 * when it actually means "instant".
 */
const formatDuration = (ms: number | null | undefined) => {
  if (ms === null || ms === undefined) return '—'
  if (ms < 1) return '<1 ms'
  if (ms < 1000) return `${Math.round(ms)} ms`
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)} s`
  return `${Math.floor(ms / 60_000)}m ${Math.round((ms % 60_000) / 1000)}s`
}

/** Renders an age in seconds — the queue's backlog figure. */
const formatAge = (seconds: number | null | undefined) => {
  if (seconds === null || seconds === undefined) return '—'
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ${seconds % 60}s`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ${minutes % 60}m`
  return `${Math.floor(hours / 24)}d ${hours % 24}h`
}

const isset = (obj: object | string) => {
  if (obj !== null && obj !== undefined) {
    if (typeof obj === 'object' || Array.isArray(obj)) {
      return Object.keys(obj).length
    } else {
      return obj.toString().length
    }
  }

  return false
}
const toSimpleRaw = (obj: object) => {
  return JSON.parse(JSON.stringify(obj))
}

const randomNumbers = (from: number, to: number, length: number) => {
  const numbers = [0]
  for (let i = 1; i < length; i++) {
    numbers.push(Math.ceil(Math.random() * (from - to) + to))
  }

  return numbers
}

const stringToHTML = (arg: string) => {
  const parser = new DOMParser(),
    DOM = parser.parseFromString(arg, 'text/html')
  return DOM.body.childNodes[0] as HTMLElement
}

const slideUp = (el: HTMLElement, duration = 300, callback = (el: HTMLElement) => {}) => {
  el.style.transitionProperty = 'height, margin, padding'
  el.style.transitionDuration = duration + 'ms'
  el.style.height = el.offsetHeight + 'px'
  el.offsetHeight
  el.style.overflow = 'hidden'
  el.style.height = '0'
  el.style.paddingTop = '0'
  el.style.paddingBottom = '0'
  el.style.marginTop = '0'
  el.style.marginBottom = '0'
  window.setTimeout(() => {
    el.style.display = 'none'
    el.style.removeProperty('height')
    el.style.removeProperty('padding-top')
    el.style.removeProperty('padding-bottom')
    el.style.removeProperty('margin-top')
    el.style.removeProperty('margin-bottom')
    el.style.removeProperty('overflow')
    el.style.removeProperty('transition-duration')
    el.style.removeProperty('transition-property')
    callback(el)
  }, duration)
}

const slideDown = (el: HTMLElement, duration = 300, callback = (el: HTMLElement) => {}) => {
  el.style.removeProperty('display')
  let display = window.getComputedStyle(el).display
  if (display === 'none') display = 'block'
  el.style.display = display
  let height = el.offsetHeight
  el.style.overflow = 'hidden'
  el.style.height = '0'
  el.style.paddingTop = '0'
  el.style.paddingBottom = '0'
  el.style.marginTop = '0'
  el.style.marginBottom = '0'
  el.offsetHeight
  el.style.transitionProperty = 'height, margin, padding'
  el.style.transitionDuration = duration + 'ms'
  el.style.height = height + 'px'
  el.style.removeProperty('padding-top')
  el.style.removeProperty('padding-bottom')
  el.style.removeProperty('margin-top')
  el.style.removeProperty('margin-bottom')
  window.setTimeout(() => {
    el.style.removeProperty('height')
    el.style.removeProperty('overflow')
    el.style.removeProperty('transition-duration')
    el.style.removeProperty('transition-property')
    callback(el)
  }, duration)
}

function isFetchResponseError(error: any): error is FetchResponse<ResponseError> {
  return error && typeof error === 'object' && '_data' in error
}

function getDefaultPerPage() {
  return 10
}

function getDefaultPage() {
  return 1
}

function createDefaultPaginated<T>(): PayloadDataCollectionPaginated<T> {
  return {
    meta: {
      current_page: 1,
      from: 0,
      to: 0,
      last_page: 1,
      path: '',
      per_page: getDefaultPerPage(),
      total: 0,
    },
    data: [],
  }
}

export {
  createDefaultPaginated,
  getDefaultPerPage,
  getDefaultPage,
  cutText,
  formatDate,
  capitalizeFirstLetter,
  onlyNumber,
  formatCurrency,
  timeAgo,
  formatDuration,
  formatAge,
  diffTimeByNow,
  isset,
  toSimpleRaw,
  randomNumbers,
  stringToHTML,
  slideUp,
  slideDown,
  isFetchResponseError,
}
