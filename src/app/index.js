import './select-ui.js';
// import './app.js';
// import '../styles/main.scss';

import MazeGrid from './MazeGrid';

const mazeGrid = new MazeGrid(
  document.querySelector('.grid__container'),
  20,
  10
);

console.log(mazeGrid);
