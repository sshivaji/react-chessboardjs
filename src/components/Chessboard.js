import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import Coordinate from './Coordinate'
import Piece from './Piece'
import PieceDragLayer from './PieceDragLayer'
import Square from './Square'

import { getFenParts } from '../fen'
import { orientationTypes } from '../types'

class Chessboard extends Component {
  renderSquares = () => {
    const { fen, orientation, showCoordinates } = this.props
    const fenParts = getFenParts(fen)
    const squares = []
    for (let i = 0; i < 8; i += 1) {
      for (let j = 0; j < 8; j += 1) {
        const rank = orientation === 'w' ? i : Math.abs(i - 7)
        const file = orientation === 'w' ? j : Math.abs(j - 7)
        const fileChar = String.fromCharCode(file + 97)
        const rankChar = (Math.abs(rank - 7) + 1).toString()
        const algebraic = `${fileChar}${rankChar}`
        const isBlackSquare = (rank + file) % 2 !== 0
        const piece = fenParts[rank].charAt(file)
        squares.push(
          <Square
            key={algebraic}
            algebraic={algebraic}
            isBlackSquare={isBlackSquare}
            piece={piece !== '1' ? piece : null}
          >
            {showCoordinates && ((orientation === 'w' && rank === 7) || (orientation === 'b' && rank === 0))
              && <Coordinate display="file" text={fileChar} />}
            {showCoordinates && ((orientation === 'w' && file === 0) || (orientation === 'b' && file === 7))
              && <Coordinate display="rank" text={rankChar} />}
            {piece !== '1' && (
              <Piece
                piece={piece}
                square={algebraic}
              />
            )}
          </Square>,
        )
      }
    }
    return squares
  }

  render() {
    const { isDraggable } = this.props
    return (
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          height: '100%',
          width: '100%',
        }}
      >
        {this.renderSquares()}
        {isDraggable && <PieceDragLayer />}
      </div>
    )
  }
}

Chessboard.propTypes = {
  fen: PropTypes.string.isRequired, // injected by react-redux
  isDraggable: PropTypes.bool.isRequired, // injected by react-redux
  orientation: PropTypes.oneOf(orientationTypes).isRequired, // injected by react-redux
  showCoordinates: PropTypes.bool.isRequired, // injected by react-redux
}

const mapState = state => ({
  fen: state.fen,
  isDraggable: state.isDraggable,
  orientation: state.orientation,
  showCoordinates: state.showCoordinates,
})

export default connect(mapState)(DragDropContext(HTML5Backend)(Chessboard))