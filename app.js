document.addEventListener('DOMContentLoaded', () => {
  const board = document.getElementById('sudoku-board');
  const solveBtn = document.getElementById('solve-btn');
  const resetBtn = document.getElementById('reset-btn');
  const errorMessage = document.getElementById('error-message');

  // Generate the 9x9 grid
  generateGrid(9);

  // Event listener to handle input validation
  function generateGrid(dimension) {
    board.innerHTML = ''; // Clear any existing grid
    for (let row = 0; row < dimension; row++) {
      const tr = document.createElement('tr');
      for (let col = 0; col < dimension; col++) {
        const td = document.createElement('td');
        const input = document.createElement('input');
        input.type = 'text';
        input.maxLength = 1;
        input.classList.add('cell');
        
        // Add input event listener to validate each cell
        input.addEventListener('input', (event) => validateInput(event));
        
        td.appendChild(input);
        tr.appendChild(td);
      }
      board.appendChild(tr);
    }
  }

  // Validate input: Only allow numbers (1-9), highlight invalid input
  function validateInput(event) {
    const input = event.target;
    const value = input.value;

    if (!/^\d$/.test(value)) {
      input.classList.add('invalid-input');
      showError('Only numbers (1-9) are allowed!');
    } else {
      input.classList.remove('invalid-input');
      clearError();
    }
  }

  // Show error message
  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
  }

  // Clear error message
  function clearError() {
    errorMessage.textContent = '';
    errorMessage.classList.add('hidden');
  }

  // Solve button functionality
  solveBtn.addEventListener('click', () => {
    const grid = getGrid();
    if (validateGrid(grid)) {
      if (solveSudoku(grid)) {
        setGrid(grid);
      } else {
        showError('No solution exists!');
      }
    } else {
      showError('Ensure all cells have valid numbers before solving.');
    }
  });

  // Reset button functionality
  resetBtn.addEventListener('click', () => {
    document.querySelectorAll('.cell').forEach(cell => {
      cell.value = '';
      cell.classList.remove('invalid-input');
    });
    clearError();
  });

  // Get grid values
  function getGrid() {
    const grid = [];
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell, index) => {
      const row = Math.floor(index / 9);
      const col = index % 9;
      const value = parseInt(cell.value) || 0;
      if (!grid[row]) grid[row] = [];
      grid[row][col] = value;
    });
    return grid;
  }

  // Set grid values after solving
  function setGrid(grid) {
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell, index) => {
      const row = Math.floor(index / 9);
      const col = index % 9;
      cell.value = grid[row][col] || '';
    });
  }

  // Validate the entire grid (numbers between 1-9)
  function validateGrid(grid) {
    return grid.every(row => row.every(cell => cell >= 0 && cell <= 9));
  }
});
