import React from 'react'
import classNames from 'classnames'
import ns from 'utils/ns'

import './Button.less'

export default ({ className, disabled, onClick, title, type }) => {
  const classes = classNames(
    'button',
    {
      [`button--${type}`]: type
    },
    className
  )
  return (
    <button className={ns(classes)} onClick={onClick} disabled={disabled}>
      {title}
    </button>
  )
}
