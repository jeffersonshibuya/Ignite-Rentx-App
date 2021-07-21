import { eachDayOfInterval, format } from 'date-fns';
import { MarkedDatesProps, DayProps } from '.';

import theme from '../../styles/theme';
import { getPlatformDate } from '../../utils/getPlatformDate'

export function generateInterval(start: DayProps, end: DayProps) {
  let interval: MarkedDatesProps = {};

  const startDate = new Date(start.timestamp)
  const endDate = new Date(end.timestamp)

  eachDayOfInterval({
    start: new Date(startDate.valueOf() + startDate.getTimezoneOffset() * 60 * 1000),
    end: new Date(endDate.valueOf() + endDate.getTimezoneOffset() * 60 * 1000),
  }).forEach(item => {
    // const date = format(getPlatformDate(item), 'yyyy-MM-dd');
    const date = format(item, 'yyyy-MM-dd');

    interval = {
      ...interval,
      [date]: {
        color: start.dateString === date || end.dateString === date
          ? theme.colors.main : theme.colors.main_light,

        textColor: start.dateString === date || end.dateString === date
          ? theme.colors.main_light : theme.colors.main,
      }
    }
  })

  return interval;

}