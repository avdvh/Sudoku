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
        input.addEventListener('input', (event) => validateInput(event, row, col));
        
        td.appendChild(input);
        tr.appendChild(td);
      }
      board.appendChild(tr);
    }
  }

  // Validate user input (only numbers 1-9)
  function validateInput(event, row, col) {
    const input = event.target;
    const value = input.value;

    // Check if value is a number and between 1-9
    if (!/^\d$/.test(value) || parseInt(value) < 1 || parseInt(value) > 9) {
      input.classList.add('invalid-input');
      showError('Invalid input! Please enter a number between 1-9.');
    } else {
      // Check for duplicates in row, column, or 3x3 grid
      if (isDuplicate(value, row, col)) {
        input.classList.add('invalid-input');
        showError('Duplicate number in row, column, or 3x3 grid!');
      } else {
        input.classList.remove('invalid-input');
        clearError();
      }
    }
  }

  // Check for duplicate numbers in the same row, column, or 3x3 box
  function isDuplicate(value, row, col) {
    const grid = getGrid();
    value = parseInt(value); // Ensure value is treated as an integer
    
    // Check row and column for duplicates
    for (let i = 0; i < 9; i++) {
      if ((grid[row][i] === value && i !== col) || (grid[i][col] === value && i !== row)) {
        return true;
      }
    }

    // Check 3x3 subgrid for duplicates
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = startRow; i < startRow + 3; i++) {
      for (let j = startCol; j < startCol + 3; j++) {
        if (grid[i][j] === value && (i !== row || j !== col)) {
          return true;
        }
      }
    }

    return false;
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
    document.querySelectorAll('.cell').forEach(cell => cell.value = '');
    clearError();
  });

  // Get the current grid data
  function getGrid() {
    const grid = [];
    const rows = board.querySelectorAll('tr');
    rows.forEach((row, rowIndex) => {
      const rowData = [];
      const cells = row.querySelectorAll('input');
      cells.forEach((cell, colIndex) => {
        rowData.push(cell.value ? parseInt(cell.value) : 0);
      });
      grid.push(rowData);
    });
    return grid;
  }

  // Set the solved grid values back to the UI
  function setGrid(grid) {
    const rows = board.querySelectorAll('tr');
    grid.forEach((rowData, rowIndex) => {
      const cells = rows[rowIndex].querySelectorAll('input');
      rowData.forEach((value, colIndex) => {
        cells[colIndex].value = value !== 0 ? value : '';
      });
    });
  }

  // Validate the entire grid before solving
  function validateGrid(grid) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] !== 0 && isDuplicate(grid[row][col], row, col)) {
          return false;
        }
      }
    }
    return true;
  }

  // Solving the Sudoku using backtracking
  function solveSudoku(grid) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (!isDuplicate(num.toString(), row, col)) {
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
});
