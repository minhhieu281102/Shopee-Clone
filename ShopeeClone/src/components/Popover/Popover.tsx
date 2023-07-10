import { useFloating, FloatingPortal, FloatingArrow, arrow, shift, offset } from '@floating-ui/react'
import React, { useRef, useState, useId, type ElementType } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  children: React.ReactNode
  className?: string
  renderPopover: React.ReactNode
  as?: ElementType
  initialOpen?: boolean
}

export default function Popover({ children, renderPopover, className, as: Element = 'div', initialOpen }: Props) {
  const [isOpen, setIsOpen] = useState(initialOpen || false)
  const arrowRef = useRef(null)
  const id = useId()
  const { refs, context, x, y, strategy, middlewareData } = useFloating({
    middleware: [
      offset(6),
      shift(),
      arrow({
        element: arrowRef
      })
    ],
    placement: 'bottom-end'
  })
  const showPopover = () => {
    setIsOpen(true)
  }
  const hidePopover = () => {
    setIsOpen(false)
  }
  return (
    <Element className={className} ref={refs.setReference} onMouseEnter={showPopover} onMouseLeave={hidePopover}>
      {children}

      <AnimatePresence>
        {isOpen && (
          <FloatingPortal id={id}>
            <motion.div
              ref={refs.setFloating}
              style={{
                position: strategy,
                left: x,
                top: y,
                width: 'max-content',
                transformOrigin: `${middlewareData.arrow?.x}px top`
              }}
              initial={{ opacity: 0, transform: 'scale(0)' }}
              animate={{ opacity: 1, transform: 'scale(1)' }}
              exit={{ opacity: 0, transform: 'scale(0)' }}
              transition={{ duration: 0.2 }}
            >
              <FloatingArrow ref={arrowRef} context={context} className='  fill-white ' />
              {renderPopover}
            </motion.div>
          </FloatingPortal>
        )}
      </AnimatePresence>
    </Element>
  )
}
