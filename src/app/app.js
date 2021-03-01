// create initial grid state

const gridH = 10;
const gridW = 20;

// Keep track of start/end positions
let gridStart = 0;
let gridEnd = gridW * gridH - 1;

let editMode = 0;
let isDragging = false;
let matrixState = [];

const M = {
  empty: 0,
  wall: 1,
  start: 2,
  end: 3,
  visited: 4,
};

// Debug function
const printMatrix = (m) => {
  const t = m.map((r) => r.join('')).join('\n');
  console.log(t);
};

// Makes the UI reflect the matrix
const updateGridFromMatrix = (matrix) => {
  const getKeyByValue = (obj, val) =>
    Object.keys(obj).find((key) => obj[key] === val);

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      const valueAtPlace = matrix[i][j];
      const itemEl = document.querySelector(
        `.grid__item[data-nth="${i * matrix[i].length + j}"]`
      );
      itemEl.setAttribute(
        'class',
        `grid__item grid__item--${getKeyByValue(M, valueAtPlace)}`
      );
    }
  }
};

const setMatrixItem = (matrix, index, value) => {
  const w = matrix[0].length;
  matrix[~~(index / w)][index % w] = value;
};
const getMatrixItem = (matrix, index) => {
  const w = matrix[0].length;
  return matrix[~~(index / w)][index % w];
};

const handleGridItemEnter = (e) => {
  if (isDragging) {
    const elIndex = e.target.getAttribute('data-nth');
    const val = getMatrixItem(matrixState, elIndex);
    if (val === M.empty || val === M.wall) {
      if (editMode === M.start) {
        // remove old start
        setMatrixItem(matrixState, gridStart, M.empty);
        // update start position
        gridStart = elIndex;
      } else if (editMode === M.end) {
        // remove old end
        setMatrixItem(matrixState, gridEnd, M.empty);
        // update end position
        gridEnd = elIndex;
      }
      // set value
      setMatrixItem(matrixState, elIndex, editMode);
      // update UI
      updateGridFromMatrix(matrixState);
    }
  }
};

const handleMouseDown = (e) => {
  isDragging = true;
  const el = e.target;
  const elIndex = el.getAttribute('data-nth');
  const valAtPos = getMatrixItem(matrixState, elIndex);
  if (valAtPos === M.empty || valAtPos === M.wall) {
    // If it's empty or a wall, the edit mode becomes the opposite
    editMode = Number(!valAtPos);
    // set value
    setMatrixItem(matrixState, elIndex, editMode);
    // update UI
    updateGridFromMatrix(matrixState);
  } else {
    // Start or End, we're just moving it so keep the edit mode the same value
    editMode = valAtPos;
  }
};

const handleMouseUp = (e) => {
  isDragging = false;
};

// Creates the UI grid and returns a matrix of the same dimensions
const createEmptyGrid = (width, height) => {
  const gridEl = document.querySelector('.grid');
  const gridState = [];
  gridEl.innerHTML = '';
  gridEl.style.setProperty('--grid-h', width);
  gridEl.style.setProperty('--grid-w', height);
  gridEl.addEventListener('mousedown', handleMouseDown);
  gridEl.addEventListener('mouseup', handleMouseUp);

  for (let i = 0; i < height; i++) {
    gridState.push([]);
    for (let j = 0; j < width; j++) {
      gridState[i].push(M.empty);
      const el = document.createElement('div');
      el.setAttribute('class', 'grid__item');
      el.setAttribute('data-nth', i * width + j);
      el.addEventListener('mouseenter', handleGridItemEnter);
      gridEl.appendChild(el);
    }
  }
  setMatrixItem(gridState, gridStart, M.start);
  setMatrixItem(gridState, gridEnd, M.end);
  updateGridFromMatrix(gridState);
  return gridState;
};

matrixState = createEmptyGrid(gridW, gridH);

setMatrixItem(matrixState, 44, M.wall);
setMatrixItem(matrixState, 45, M.wall);
updateGridFromMatrix(matrixState);
