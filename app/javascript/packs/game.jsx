import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

const Game = props => (
  <div>Hello {props.name}!</div>
)

Game.defaultProps = {
  name: 'David'
}

Game.propTypes = {
  name: PropTypes.string
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Game name="React" />,
    document.body.appendChild(document.createElement('div')),
  )
})
