document.addEventListener('DOMContentLoaded', () => {
  const board = document.getElementById('sudoku-board');
  const solveBtn = document.getElementById('solve-btn');
  const resetBtn = document.getElementById('reset-btn');
  const dimensionSelector = document.getElementById('dimension');

  // Function to generate a grid based on selected dimension
  function generateGrid(dimension) {
    board.innerHTML = ''; // Clear previous grid
    for (let row = 0; row < dimension; row++) {
      const tr = document.createElement('tr');
      for (let col = 0; col < dimension; col++) {
        const td = document.createElement('td');
        const input = document.createElement('input');
        input.type = 'text';
        input.maxLength = dimension === 16 ? '2' : '1';
        input.classList.add('cell');
        td.appendChild(input);
        tr.appendChild(td);
      }
      board.appendChild(tr);
    }
  }

  // Initial grid generation
  generateGrid(9);

  // Change grid dimensions based on selector
  dimensionSelector.addEventListener('change', () => {
    const dimension = parseInt(dimensionSelector.value);
    generateGrid(dimension);
  });

  // Solve button click event
  solveBtn.addEventListener('click', () => {
    const grid = getGrid();
    if (solveSudoku(grid)) {
      setGrid(grid);
    } else {
      alert('No solution exists!');
    }
  });

  // Reset button click event
  resetBtn.addEventListener('click', () => {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
      cell.value = '';
    });
  });

  // Get grid values from the inputs
  function getGrid() {
    const dimension = parseInt(dimensionSelector.value);
    const grid = [];
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell, index) => {
      const value = parseInt(cell.value) || 0;
      const row = Math.floor(index / dimension);
      const col = index % dimension;
      if (!grid[row]) grid[row] = [];
      grid[row][col] = value;
    });
    return grid;
  }

  // Set solved grid values back to inputs
  function setGrid(grid) {
    const cells = document.querySelectorAll('.cell');
    const dimension = parseInt(dimensionSelector.value);
    cells.forEach((cell, index) => {
      const row = Math.floor(index / dimension);
      const col = index % dimension;
      cell.value = grid[row][col] || '';
    });
  }
});
