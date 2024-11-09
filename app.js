document.addEventListener('DOMContentLoaded', () => {
  const board = document.getElementById('sudoku-board');
  const solveBtn = document.getElementById('solve-btn');
  const resetBtn = document.getElementById('reset-btn');
  const dimensionSelector = document.getElementById('dimension');
  const startBtn = document.getElementById('start-btn');
  const sudokuArea = document.getElementById('sudoku-area');
  const dimensionSelection = document.getElementById('dimension-selection');

  // Initialize the grid after selecting a dimension
  startBtn.addEventListener('click', () => {
    const dimension = parseInt(dimensionSelector.value);
    generateGrid(dimension);
    sudokuArea.classList.remove('hidden');
    dimensionSelection.classList.add('hidden');
  });

  // Generate the grid with pre-filled and empty cells
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

  // Solve button functionality
  solveBtn.addEventListener('click', () => {
    const grid = getGrid();
    if (validateGrid(grid)) {
      if (solveSudoku(grid)) {
        setGrid(grid);
      } else {
        alert('No solution exists!');
      }
    } else {
      alert('Please enter valid numbers only!');
    }
  });

  // Reset button to clear the grid
  resetBtn.addEventListener('click', () => {
    document.querySelectorAll('.cell').forEach(cell => cell.value = '');
  });

  // Get grid values
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

  // Set grid values after solving
  function setGrid(grid) {
    const cells = document.querySelectorAll('.cell');
    const dimension = parseInt(dimensionSelector.value);
    cells.forEach((cell, index) => {
      const row = Math.floor(index / dimension);
      const col = index % dimension;
      cell.value = grid[row][col] || '';
    });
  }

  // Validate user inputs
  function validateGrid(grid) {
    const dimension = parseInt(dimensionSelector.value);
    const maxValue = dimension === 16 ? 16 : 9;
    return grid.every(row => row.every(cell => cell >= 0 && cell <= maxValue));
  }
});
