



class BoardData {
  constructor() {
    this.content = []
    this.clear()
  }

  clear() {
    this.content = new Array(8)
    for (let row = 0; row < 8; row++) {
      this.content[row] = new Array(8).fill(null)
    }
  }

  resetNewGame() {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if ((row + col) % 2 == 0) {
          this.content[row][col] = null;
        } else if (row <= 2) {
          this.content[row][col] = BLACK_SINGLE_ELEMENT;
        } else if (row >= 5) {
          this.content[row][col] = WHITE_SINGLE_ELEMENT;
        }
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

  possibleMoves(row, col) {
    const type = this.content[row][col]
    if (!type || type == EMPTY_ELEMENT) return []
    const opponent = type == WHITE_SINGLE_ELEMENT ? BLACK_SINGLE_ELEMENT : WHITE_SINGLE_ELEMENT
    const verticalMove = type == WHITE_SINGLE_ELEMENT ? -1 : 1

    const moves = []

    const fwdLeft = { row: verticalMove, col: col - 1 }
    const fwdRight = { row: verticalMove, col: col + 1 }
    const fwdDblLeft = { row: verticalMove * 2, col: col - 2 }
    const fwdDblRight = { row: verticalMove * 2, col: col + 2 }

    const s = []
    // simple
    moves.push(...[fwdLeft, fwdRight].filter(pos => getType(pos) == EMPTY_ELEMENT))

    // eating once
    if (getType(fwdLeft) == opponent && getType(fwdDblLeft) == EMPTY_ELEMENT) {
      moves.push(fwdDblLeft)
    }
    if (getType(fwdRight) == opponent && getType(fwdDblRight) == EMPTY_ELEMENT) {
      moves.push(fwdDblRight)
    }
    return moves
  }

  getType(pos) {
    if (pos.row < 0 || pos.row >= 8) return null
    if (pos.col < 0 || pos.col >= 8) return null
    return this.content[pos.row][pos.col]
  }

}


function MyApp() {
  let board = new BoardData()
  board.resetNewGame()

  const onClick = (row, col, type) => {
    console.info(`click ${row} ${col} ${type}`)
  }


  return <>
    <Board zoom={0.8} width={200} height={200}>
      {board.toBoardElements(onClick)}
    </Board>
  </>
}

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<MyApp />);