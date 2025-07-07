import React, { useEffect, useRef, useState } from 'react';
import './_style.scss';
import ReactDOM from 'react-dom';

export type Direction =
  | 'upper-right'
  | 'upper-left'
  | 'center'
  | 'bottom-center'
  | 'bottom-right'
  | 'bottom-left';

interface IProps {
  from: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  componentClassName?: string;
  width?: number;
  direction?: Direction;
  customPortalElement?: HTMLElement;
  forceOpen?: boolean;
  footer?: React.ReactNode;
}

const sideOffset = 10;

const InfoHover = ({
  from,
  children,
  width,
  className,
  componentClassName,
  customPortalElement,
  direction = 'center',
  forceOpen,
  footer,
}: IProps) => {
  const fromRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{
    left?: number;
    top?: number;
    bottom?: number;
    right?: number;
  }>({ left: 0, top: 0 });

  const [isHovering, setIsHovering] = useState(false);

  const updateTooltipCoords = () => {
    const rect = fromRef.current?.getBoundingClientRect();
    if (rect) {
      switch (direction) {
        case 'center':
          setCoords({
            left: rect.x + rect.width / 2,
            bottom: window.innerHeight - (rect.y + window.scrollY),
          });
          break;
        case 'upper-right':
          setCoords({
            left: rect.x + rect.width / 2 - sideOffset,
            bottom: window.innerHeight - (rect.y + window.scrollY),
          });
          break;
        case 'upper-left':
          setCoords({
            right: window.innerWidth - rect.x - rect.width / 2 - sideOffset,
            bottom: window.innerHeight - (rect.y + window.scrollY),
          });
          break;
        case 'bottom-center':
          setCoords({
            left: rect.x + rect.width / 2,
            top: rect.top + rect.height + window.scrollY,
          });
          break;
        case 'bottom-right':
          setCoords({
            left: rect.x + rect.width / 2 - sideOffset,
            top: rect.top + rect.height + window.scrollY,
          });
          break;
        case 'bottom-left':
          setCoords({
            right: window.innerWidth - rect.x - rect.width - sideOffset,
            top: rect.y + rect.height,
          });
          break;
      }
    }
  };

  useEffect(() => {
    updateTooltipCoords();
  }, [isHovering, forceOpen, direction]);

  useEffect(() => {
    if (isHovering) {
      document.addEventListener('scroll', updateTooltipCoords, true);
      document.addEventListener('resize', updateTooltipCoords, true);
    }

    return () => {
      document.removeEventListener('scroll', updateTooltipCoords, true);
      document.removeEventListener('resize', updateTooltipCoords, true);
    };
  }, [updateTooltipCoords, isHovering]);

  return (
    <div
      onMouseEnter={() => {
        setIsHovering(true);
      }}
      onMouseLeave={() => {
        setIsHovering(false);
      }}
      className={'component-infohover ' + (componentClassName ?? '')}
    >
      <div ref={fromRef} className='activator'>
        {from}
      </div>
      {ReactDOM.createPortal(
        <div
          style={{ width, ...coords }}
          className={`component hover-info ${className ?? ''} ${
            isHovering || forceOpen ? '' : 'hidden '
          } ${direction ?? ''} `}
        >
          {children}
          {footer ? <div className='footer'>{footer}</div> : <></>}
        </div>,
        customPortalElement ?? (document.getElementById('root') as HTMLElement),
      )}
    </div>
  );
};

export { InfoHover };
