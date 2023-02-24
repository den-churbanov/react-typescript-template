export { isDate } from 'lodash';

export function formatDateDDMMYYYY(date: Date) {
  return date.toLocaleDateString('ru', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

export function formatDateYYYY(date: Date) {
  return date.toLocaleDateString('ru', {
    year: 'numeric'
  })
}

/**
 * @example <br/>понедельник, 05.09.22 г., 15:24
 */
export const getLongDateString = (timestamp?: string) => {
  const date = timestamp ? new Date(timestamp) : new Date();
  return date.toLocaleDateString('ru', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * @example <br/> 05.09.22 г., 15:24
 */
export const getDateDDMMYYYYHHMM = (date: Date | string = new Date()) => {
  if (typeof date === 'string') {
    return new Date(date).toLocaleDateString('ru', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      formatMatcher: 'best fit'
    })
  }

  return date.toLocaleDateString('ru', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    formatMatcher: 'best fit'
  })
}