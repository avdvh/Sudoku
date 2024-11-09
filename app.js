document.addEventListener('DOMContentLoaded', () => {
  const board = document.getElementById('sudoku-board');
  const solveBtn = document.getElementById('solve-btn');
  const resetBtn = document.getElementById('reset-btn');
  const errorMessage = document.getElementById('error-message');

  // Generate the Sudoku grid (9x9)
  generateGrid(9);

  // Create the Sudoku Grid
  function generateGrid(dimension) {
    board.innerHTML = '';
    for (let row = 0; row < dimension; row++) {
      const tr = document.createElement('tr');
      for (let col = 0; col < dimension; col++) {
        const td = document.createElement('td');
        const input = document.createElement('input');
        input.type = 'text';
        input.maxLength = 1; // Only one digit
        input.classList.add('cell');
        
        // Add event listener to handle input validation
        input.addEventListener('input', (event) => validateInput(event));
        
        td.appendChild(input);
        tr.appendChild(td);
      }
      board.appendChild(tr);
    }
  }

  // Validate user input (only numbers 1-9)
  function validateInput(event) {
    const input = event.target;
    const value = input.value;

    if (!/^\d$/.test(value) || parseInt(value) < 1 || parseInt(value) > 9) {
      input.classList.add('invalid-input');
      showError('Invalid input! Please enter a number between 1-9.');
    } else {
      input.classList.remove('invalid-input');
      clearError();
    }
  }

  // Show error messages
  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
  }

  // Clear error messages
  function clearError() {
    errorMessage.textContent = '';
    errorMessage.classList.add('hidden');
  }

  // Solve the Sudoku puzzle
  solveBtn.addEventListener('click', () => {
    const grid = getGrid();
    if (validateGrid(grid)) {
      if (solveSudoku(grid)) {
        setGrid(grid);
      } else {
        showError('No solution exists!');
      }
    } else {
      showError('Ensure all cells contain valid numbers!');
    }
  });

  // Reset the board
  resetBtn.addEventListener('click', () => {
    document.querySelectorAll('.cell').forEach(cell => {
      cell.value = '';
      cell.classList.remove('invalid-input');
    });
    clearError();
  });

  // Get the grid values from the inputs
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

  // Set the grid values after solving
  function setGrid(grid) {
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell, index) => {
      const row = Math.floor(index / 9);
      const col = index % 9;
      cell.value = grid[row][col] || '';
    });
  }

  // Validate if the grid is filled with valid numbers
  function validateGrid(grid) {
    return grid.every(row => row.every(cell => cell >= 0 && cell <= 9));
  }

  // Sudoku solver algorithm (Backtracking)
  function solveSudoku(grid) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isSafe(grid, row, col, num)) {
              grid[row][col] = num;
              if (solveSudoku(grid)) {
                return true;
              }
              grid[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  // Check if placing num is safe at (row, col)
  function isSafe(grid, row, col, num) {
    for (let i = 0; i < 9; i++) {
      if (grid[row][i] === num || grid[i][col] === num) {
        return false;
      }
    }
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = startRow; i < startRow + 3; i++) {
      for (let j = startCol; j < startCol + 3; j++) {
        if (grid[i][j] === num) {
          return false;
        }
      }
    }
    return true;
  }
});
