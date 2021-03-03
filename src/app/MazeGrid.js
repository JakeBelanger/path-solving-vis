import { CELL } from './constants';

class MazeGrid {
  constructor(el, width, height) {
    this.containerEl = el;
    this.w = width;
    this.h = height;

    // Keep track of maze's start and end goals
    this.start = 0;
    this.end = this.w * this.h - 1;
    this.under_start = CELL.empty;
    this.under_end = CELL.empty;

    // Dragging states
    this.dragging = false;
    this.editMode = 0;

    // bind
    this.handleCellMouseEnter = this.handleCellMouseEnter.bind(this);
    this.startDragging = this.startDragging.bind(this);
    this.endDragging = this.endDragging.bind(this);

    // Initiate
    this.matrix = this.createMatrix(width, height);
    this.gridEL = this.createElsFromMatrix();
    this.reset();
  }

  toString() {
    return this.matrix.map((r) => r.join('')).join('\n');
  }

  createMatrix(w, h) {
    return new Array(h).fill(0).map(() => new Array(w).fill(CELL.empty));
  }

  createElsFromMatrix() {
    // Create the grid element
    const gridEl = document.createElement('div');
    // Set attributes
    gridEl.setAttribute('class', 'grid');
    gridEl.style.setProperty('--grid-h', this.w);
    gridEl.style.setProperty('--grid-w', this.h);
    // Add event listeners
    gridEl.addEventListener('mousedown', this.startDragging);
    document
      .querySelector('body')
      .addEventListener('mouseup', this.endDragging);
    // gridEl.addEventListener('mouseleave', this.endDragging);

    // Add children
    for (let i = 0; i < this.matrix.length; i++) {
      for (let j = 0; j < this.matrix[i].length; j++) {
        const index = i * this.matrix[i].length + j;
        const el = document.createElement('div');
        el.setAttribute('class', 'grid__item');
        el.setAttribute('data-nth', index);
        el.addEventListener('mouseenter', this.handleCellMouseEnter);
        gridEl.appendChild(el);
      }
    }

    // Empty container element
    this.containerEl.innerHTML = '';

    // Append to container
    this.containerEl.appendChild(gridEl);
    // this.containerEL.appendChild(gridEl);

    return gridEl;
  }

  updateDOM() {
    const getKey = (v) => Object.keys(CELL).find((key) => CELL[key] === v);

    for (let i = 0; i < this.matrix.length; i++) {
      for (let j = 0; j < this.matrix[i].length; j++) {
        const valueAtPlace = this.matrix[i][j];
        const itemEl = document.querySelector(
          `.grid__item[data-nth="${i * this.matrix[i].length + j}"]`
        );
        itemEl.setAttribute(
          'class',
          `grid__item grid__item--${getKey(valueAtPlace)}`
        );
      }
    }
  }

  setMatrixItem(index, value) {
    this.matrix[~~(index / this.w)][index % this.w] = value;
  }

  getMatrixItem(index) {
    return this.matrix[~~(index / this.w)][index % this.w];
  }

  reset() {
    this.start = 0;
    this.end = this.w * this.h - 1;
    // zero out the matrix
    this.matrix = this.matrix.map((r) => r.fill(CELL.empty));

    // Set start and end
    this.setMatrixItem(this.start, CELL.start);
    this.setMatrixItem(this.end, CELL.end);

    // Update
    this.updateDOM();
  }

  // Event Handlers

  handleCellMouseEnter(e) {
    if (this.dragging) {
      const elIndex = e.target.getAttribute('data-nth');
      const val = this.getMatrixItem(elIndex);
      if (val === CELL.empty || val === CELL.wall) {
        if (this.editMode === CELL.start) {
          // remove old start
          this.setMatrixItem(this.start, this.under_start);
          // update start position
          this.start = elIndex;
          this.under_start = val;
        } else if (this.editMode === CELL.end) {
          // remove old end
          this.setMatrixItem(this.end, this.under_end);
          // update end position
          this.end = elIndex;
          this.under_end = val;
        }
        // set value
        this.setMatrixItem(elIndex, this.editMode);
        // update UI
        this.updateDOM();
      }
    }
  }

  startDragging(e) {
    this.dragging = true;
    const elIndex = e.target.getAttribute('data-nth');
    const valAtPos = this.getMatrixItem(elIndex);
    if (valAtPos === CELL.empty || valAtPos === CELL.wall) {
      // If it's empty or a wall, the edit mode becomes the opposite
      this.editMode = valAtPos === CELL.empty ? CELL.wall : CELL.empty;
      // set value
      this.setMatrixItem(elIndex, this.editMode);
      // update UI
      this.updateDOM();
    } else {
      // Start or End, we're just moving it so keep the edit mode the same value
      this.editMode = valAtPos;
    }
  }

  endDragging() {
    this.dragging = false;
  }
}

export default MazeGrid;
