import React, { Component } from 'react'
import classNames from 'classnames'
import SvgInline from 'react-inlinesvg'

import arrowDown from 'svg/arrow-down.svg'
import help from 'svg/help.svg'
import close from 'svg/cross.svg'
import check from 'svg/ready.svg'
import ns from 'utils/ns'

import './ButtonIcon.less'

const ICONS = {
  help,
  arrowDown,
  check,
  close
}

class ButtonIcon extends Component {
  render() {
    const { icon, onClick } = this.props

    const className = classNames('buttonIcon', `buttonIcon--${icon}`)

    return (
      <button className={ns(className)} onClick={onClick}>
        <span className={ns('buttonIcon-icon')}>
          <SvgInline src={ICONS[icon]} />
        </span>
      </button>
    )
  }
}

export default ButtonIcon
