module.exports = {
  colors: {
    lightSkyBlue: '#92d4f7',
    nero: '#282828', // that's reall the colors name
  },

  board: {
    columns: 25,
    rows: 25,
    cellSize: 20,
  },

  directions: {
    37: { x: -1, y: 0 },
    38: { x: 0, y: -1 },
    39: { x: 1, y: 0 },
    40: { x: 0, y: 1 },
  },
  piecePointValue: 10,
  initialSnakeLength: 3,
};
