import { useEffect, RefObject } from 'react';

type EventType = 'click' | 'mousedown';

export const useOutsideClick = (
  ref: RefObject<HTMLElement>,
  callback: () => void,
  eventType: EventType = 'mousedown',
  optionalDocument?: Document,
) => {
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) return;
      callback();
    };

    (optionalDocument || document).addEventListener(eventType, listener);
    return () => (optionalDocument || document).removeEventListener(eventType, listener);
  }, [ref, callback, eventType]);
};
