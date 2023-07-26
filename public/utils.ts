import { AmOrPm } from './types';
import { AlertProps, DateProps, ScrollElementProps } from './interfaces';

export const showAlert = ({
  msg,
  duration = 4000,
  textColor = '#fff',
  bgColor = '#2f2d52',
}: AlertProps) => {
  const alert: HTMLDivElement = document.querySelector('#alert')!;

  // show alert only when alert box is initially hidden
  if (alert?.style?.bottom === '-100px') {
    alert.style.background = bgColor;
    alert.style.color = textColor;
    alert.innerHTML = msg;
    alert.style.bottom = '0px';

    setTimeout(() => {
      alert.style.bottom = '-100px';
    }, duration);
  }
};

export const scrollElement = ({
  top,
  left,
  delay,
  toTop,
  toLeft,
  toRight,
  toBottom,
  targetSelector,
  behavior = 'smooth',
}: ScrollElementProps) => {
  const element: HTMLElement | null = document.querySelector(targetSelector);

  if (!element) {
    return console.error(
      `Div container with target: '${targetSelector}' does not exist in the DOM`
    );
  }

  const elementScrollWidth: number = element.scrollWidth;
  const elementScrollHeight: number = element.scrollHeight;
  let scrollProps: { top?: number; left?: number; behavior?: globalThis.ScrollBehavior } = {};

  if (toTop) {
    scrollProps = { top: 0 };
  } else if (toBottom) {
    scrollProps = { top: elementScrollHeight };
  } else if (toLeft) {
    scrollProps = { left: 0 };
  } else if (toRight) {
    scrollProps = { left: elementScrollWidth };
  } else {
    scrollProps = { top, left };
  }

  if (delay) setTimeout(() => element.scrollTo({ ...scrollProps, behavior }), delay);
  else element.scrollTo({ ...scrollProps, behavior });
};

export const getDateProps = (date: string | number | Date): DateProps => {
  const [shortDayOfWeek, shortMonthName, monthDate, year, time24, gmt]: string[] = new Date(date)
    .toString()
    .split(' ');
  const [hour24, minutes, seconds]: string[] = time24.split(':');
  const hour24Number: number = Number(hour24);

  const hour12: string = (hour24Number > 12 ? hour24Number - 12 : hour24).toString();
  const am_or_pm: AmOrPm = hour24Number >= 12 ? 'pm' : 'am';

  return {
    gmt,
    year,
    time24,
    hour12,
    hour24,
    minutes,
    seconds,
    am_or_pm,
    monthDate,
    shortMonthName,
    shortDayOfWeek,
  };
};
