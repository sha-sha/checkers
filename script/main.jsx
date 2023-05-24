

class Position {
  row = 0
  col = 0
  constructor(row, col) {
    this.row = row
    this.col = col
  }

  toString() {
    return `[${this.row},${this.col}]`
  }

  isEqual(other) {
    return this.row === other.row && this.col === other.col
  }
}

class BoardDataBuilder {
  constructor(boardData) {
    if (boardData) {
      this.content = [...boardData.content]
    } else {
      this.content = new Array(8)
      for (let row = 0; row < 8; row++) {
        this.content[row] = new Array(8).fill(null)
      }
    }
  }

  newGame() {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if ((row + col) % 2 == 0) {
          this.content[row][col] = null;
        } else if (row <= 2) {
          this.content[row][col] = BLACK_SINGLE_ELEMENT;
        } else if (row >= 5) {
          this.content[row][col] = WHITE_SINGLE_ELEMENT;
        } else {
          this.content[row][col] = EMPTY_ELEMENT;
        }
      }
    }
    return this
  }

  move(from, to, emptyType = EMPTY_ELEMENT) {
    this.content[to.row][to.col] = this.content[from.row][from.col]
    this.content[from.row][from.col] = emptyType
    return this
  }

  clear(pos, emptyType = EMPTY_ELEMENT) {
    this.content[pos.row][pos.col] = emptyType
    return this
  }

  build() {
    return new BoardData(this.content)
  }
}

class BoardData {
  constructor(content) {
    if (content) {
      this.content = [...content]
    } else {
      this.content = new Array(8)
      for (let row = 0; row < 8; row++) {
        this.content[row] = new Array(8).fill(null)
      }
    }
  }

  toBoardElements(onClick) {
    const elements = []
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const type = this.content[row][col]
        if (type && type != EMPTY_ELEMENT) {
          elements.push(<BoardElement
            onClick={() => { onClick(row, col, type) }}
            key={`${row},${col}`} row={row} col={col} type={type} />)
        }
      }
    }
    return elements
  }

  possibleMoves(pos) {
    console.info(`possibleMoves for ${pos}`)
    const { row, col } = pos
    const type = this.content[row][col]
    if (!type || type == EMPTY_ELEMENT) return []
    const opponent = type == WHITE_SINGLE_ELEMENT ? BLACK_SINGLE_ELEMENT : WHITE_SINGLE_ELEMENT
    const verticalMove = type == WHITE_SINGLE_ELEMENT ? -1 : 1

    const moves = []

    const fwdLeft = new Position(row + verticalMove, col - 1)
    const fwdRight = new Position(row + verticalMove, col + 1)
    const fwdDblLeft = new Position(row + verticalMove * 2, col - 2)
    const fwdDblRight = new Position(row + verticalMove * 2, col + 2)

    console.info(`checking ${[fwdLeft, fwdRight, fwdDblLeft, fwdDblRight]}`)

    const s = []
    // simple
    moves.push(...[fwdLeft, fwdRight].filter(pos => this.isEmpty(pos)))

    // eating once
    if (this.getType(fwdLeft) == opponent && this.isEmpty(fwdDblLeft)) {
      moves.push(fwdDblLeft)
    }
    if (this.getType(fwdRight) == opponent && this.isEmpty(fwdDblRight)) {
      moves.push(fwdDblRight)
    }
    console.info(`moves: ${moves}`)
    return moves
  }

  getType(pos) {
    if (pos.row < 0 || pos.row >= 8) return null
    if (pos.col < 0 || pos.col >= 8) return null
    return this.content[pos.row][pos.col]
  }

  isPlayer(pos) {
    return this.getType(pos) == WHITE_SINGLE_ELEMENT || this.getType(pos) == BLACK_SINGLE_ELEMENT
  }

  isWhite(pos) {
    return this.getType(pos) == WHITE_SINGLE_ELEMENT
  }

  isBlack(pos) {
    return this.getType(pos) == BLACK_SINGLE_ELEMENT
  }

  isEmpty(pos) {
    return this.getType(pos) == EMPTY_ELEMENT
  }
}


function Game() {
  const [whiteTurn, setWhiteTurn] = React.useState(true)
  const [selected, setSelected] = React.useState(null)
  const [possibleMoves, setPossibleMoves] = React.useState([])
  const [board, setBoard] = React.useState(null)

  if (!board) {
    const b = new BoardDataBuilder().newGame().build()
    setBoard(b)
  }

  const onClick = (row, col, type) => {
    const pos = new Position(row, col)
    if (possibleMoves.find(p => p.isEqual(pos))) {
      setBoard(new BoardDataBuilder(board).move(selected, pos).build())
      setSelected(null)
      setPossibleMoves([])
      setWhiteTurn(!whiteTurn)
    } else if (board.isPlayer(pos) && (board.isWhite(pos) == whiteTurn)) {
      setSelected(pos)
      setPossibleMoves(board.possibleMoves(pos))
    }
  }

  return <>
    <Board zoom={0.8} width={200} height={200}>
      {board && board.toBoardElements(onClick)}
      {possibleMoves.map(
        pos => <BoardElement onClick={() => onClick(pos.row, pos.col, MARKER_ELEMENT)} key={`m${pos}`} row={pos.row} col={pos.col} type={MARKER_ELEMENT} />
      )}
    </Board>
  </>

}

function MyApp() {
  return <Game />
}

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<MyApp />);