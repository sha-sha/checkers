const WHITE_SINGLE_ELEMENT = "tok-wh-1"
const BLACK_SINGLE_ELEMENT = "tok-bl-1"
const MARKER_ELEMENT = "tok-marker"
const EMPTY_ELEMENT = "empty"

const BOARD_PADDING = { x: 28, y: 25 }
const BOARD_SIZE = { x: 678, y: 678 }
const ELEMENT_SIZE = { x: 78, y: 78 }

const ASSETS = {
  "tok-wh-1": "assets/white_1.png",
  "tok-bl-1": "assets/black_1.png",
  "tok-marker": "assets/marker.png"
}

const createContext = React.createContext
const useContext = React.useContext

const ZoomContext = createContext(null);

function BoardElement({ row = 0, col = 0, type = WHITE_SINGLE_ELEMENT, onClick = () => { } }) {
  const zoom = useContext(ZoomContext)
  const cubeSize = {
    x: ELEMENT_SIZE.x * zoom,
    y: ELEMENT_SIZE.y * zoom,
  }
  const bStyle = {
    width: cubeSize.x,
    height: cubeSize.y,
    top: BOARD_PADDING.y * zoom + row * cubeSize.y,
    left: BOARD_PADDING.x * zoom + col * cubeSize.x
  }
  return <div onClick={onClick} style={bStyle} className="boardElement">
    <img src={ASSETS[type]} className={`${type}`} />
  </div>
}

function Board({ zoom = 1, children = [] }) {
  const bStyle = {
    width: BOARD_SIZE.x * zoom,
    height: BOARD_SIZE.y * zoom,
  }
  return (
    <ZoomContext.Provider value={zoom}>
      <div style={bStyle} className="board">
        {children}
      </div>
    </ZoomContext.Provider>)
}


/*
    {
      content.map(element => <BoardElement key={`${element.row},${element.col}`} zoom={zoom} {...element} />)
    }

*/