import React, {useReducer} from 'react';
import Tile from './Tile';
import "./MineSweeper.css";

export const TILE_STATUSES = {
  HIDDEN: "hidden",
  MINE: "mine",
  NUMBER: "number",
  MARKED: "marked",
}

const ACTION = {
  MARK: "mark",
  REVEAL: "reveal"
}

function markTile(grid, position) {
  return grid.map(row => row.map(tile => {
    if (!positionMatch(tile, position)) {
      return tile;
    }
    if (tile.status !== TILE_STATUSES.MARKED && tile.status !== TILE_STATUSES.HIDDEN) {
      return tile;
    }
    return { 
      ...tile, 
      status: tile.status === TILE_STATUSES.MARKED ? TILE_STATUSES.HIDDEN : TILE_STATUSES.MARKED
    }
  }))
}

function revealTile(grid, position) {
  const tile = grid[position.x][position.y];
  if (tile.status !== TILE_STATUSES.HIDDEN) {
    return grid;
  }

  if (tile.mine) {
    tile.status = TILE_STATUSES.MINE;
    return replaceTileInMap(grid, tile);
  }

  tile.status = TILE_STATUSES.NUMBER;
  const adjacentTiles = nearbyTiles(grid, position);
  const mines = adjacentTiles.filter(t => t.mine);
  if (mines.length === 0) {
    adjacentTiles.forEach(revealTile.bind(null, grid))
  } else {
    tile.text = mines.length;
  }

  return replaceTileInMap(grid, tile);
}

function replaceTileInMap(grid, tile) {
  return grid.map((row, i) => row.map((item, j) => {
    if (tile.x === i && tile.y === j) {
      return tile;
    }
    return item;
  }));
}

function nearbyTiles(grid, { x, y }) {
  const tiles = [];

  for (let xOffset = -1; xOffset <= 1; xOffset++) {
    for (let yOffset = -1; yOffset <= 1; yOffset++) {
      const tile = grid[x + xOffset]?.[y + yOffset];
      if (tile) {
        tiles.push(tile);
      }
    }
  }

  return tiles;
}

function reducer(state, action) {
  switch (action.type) {
    case ACTION.MARK:
      return { 
        ...state,
        grid: markTile(state.grid, action.payload),
      }
    case ACTION.REVEAL:
      const updatedGrid = revealTile(state.grid, action.payload);
      return {
        ...state,
        grid: updatedGrid,
        won: hasWon(updatedGrid),
        lost: hasLost(updatedGrid)
      }
    default:
      return state
  }
}

function hasLost(grid) {
  return grid.some(row => row.some(tile => tile.status === TILE_STATUSES.MINE));
}

function hasWon(grid) {
  return grid.every(row => row.every(tile => 
    (tile.status === TILE_STATUSES.NUMBER) ||
    (tile.status === TILE_STATUSES.MARKED && tile.mine) ||
    (tile.status === TILE_STATUSES.HIDDEN && tile.mine)));
}

export default function MineSweeper() {
  const [{ won, lost, grid }, dispatch] = useReducer(reducer, {
    won: false,
    lost: false,
    grid: buildGrid(10, 3)
  });
  
  function clickMarkTile(x, y) {
    dispatch({
      type: ACTION.MARK,
      payload: {x, y}
    })
  }

  function clickRevealTile(x, y) {
    dispatch({
      type: ACTION.REVEAL,
      payload: {x, y}
    })
  }
  return (
    <>
      <div className="minesweeper">
        {grid.map(row => row.map(tile => <Tile key={`${tile.x}${tile.y}`} {...tile} markTile={clickMarkTile} revealTile={clickRevealTile} />))}
      </div>
      {won && <div className="banner won-banner">You Won</div>}
      {lost && <div className="banner lost-banner">You Lost</div>}
    </>
  )
}

function buildGrid(size, numberOfMines) {
  const grid = []
  const mines = getInitialMines(size, numberOfMines)

  for (let x = 0; x < size; x++) {
    const row = []
    for (let y = 0; y < size; y++) {
      const tile = {
        x,
        y,
        mine: mines.some(positionMatch.bind(null, { x, y })),
        status: TILE_STATUSES.HIDDEN,
        text: undefined
      }
      row.push(tile)
    }
    grid.push(row)
  }

  return grid;
}

function getInitialMines(gridSize, numberOfMines) {
  const positions = []

  while (positions.length < numberOfMines) {
    const position = {
      x: random(gridSize),
      y: random(gridSize),
    }

    if (!positions.some(positionMatch.bind(null, position))) {
      positions.push(position)
    }
  }

  return positions
}

function positionMatch(a, b) {
  return a.x === b.x && a.y === b.y
}

function random(size) {
  return Math.floor(Math.random() * size);
}
