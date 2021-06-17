import React from 'react'
import {TILE_STATUSES} from './MineSweeper';
import "./Tile.css";

export default function Tile({ x, y, mine, text, status, markTile, revealTile }) {

  function getTileColor() {
    if (status === TILE_STATUSES.MARKED) {
      return 'yellow';
    }
    if (status === TILE_STATUSES.MINE) {
      return 'red';
    }
    if (status === TILE_STATUSES.NUMBER) {
      return 'lightgray';
    }
    return 'gray';
  }

  function onMarkTile(e) {
    e.preventDefault()
    markTile(x, y);
  }
  return (
    <div className="tile" 
      title={`x: ${x}, y: ${y}`}
      style={{
        backgroundColor: getTileColor()
      }}
      onContextMenu={onMarkTile}
      onClick={revealTile.bind(null, x, y)}>
        {text}
    </div>
  )
}
