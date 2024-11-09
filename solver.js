document.addEventListener('DOMContentLoaded', () => {
  const board = document.getElementById('sudoku-board');
  const solveBtn = document.getElementById('solve-btn');
  const resetBtn = document.getElementById('reset-btn');
  const errorMessage = document.getElementById('error-message');

  generateGrid(9);

  function generateGrid(dimension) {
    board.innerHTML = '';
    for (let row = 0; row < dimension; row++) {
      const tr = document.createElement('tr');
      for (let col = 0; col < dimension; col++) {
        const td = document.createElement('td');
        const input = document.createElement('input');
        input.type = 'text';
        input.maxLength = 1;
        input.classList.add('cell');
        
        input.addEventListener('input', (event) => validateInput(event, row, col));
        
        td.appendChild(input);
        tr.appendChild(td);
      }
      board.appendChild(tr);
    }
  }

  function validateInput(event, row, col) {
    const input = event.target;
    const value = input.value;

    if (!/^[1-9]$/.test(value)) {
      input.classList.add('invalid-input');
      showError('Invalid input! Please enter a number between 1-9.');
    } else {
      if (isDuplicate(value, row, col)) {
        input.classList.add('invalid-input');
        showError('Duplicate number in row, column, or 3x3 grid!');
      } else {
        input.classList.remove('invalid-input');
        clearError();
      }
    }
  }

  function isDuplicate(value, row, col) {
    const grid = getGrid();
    for (let i = 0; i < 9; i++) {
      if ((grid[row][i] == value && i !== col) || (grid[i][col] == value && i !== row)) {
        return true;
      }
    }

    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = startRow; i < startRow + 3; i++) {
      for (let j = startCol; j < startCol + 3; j++) {
        if (grid[i][j] == value && (i !== row || j !== col)) {
          return true;
        }
      }
    }

    return false;
  }

  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
  }

  function clearError() {
    errorMessage.textContent = '';
    errorMessage.classList.add('hidden');
  }

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

  resetBtn.addEventListener('click', () => {
    document.querySelectorAll('.cell').forEach(cell => cell.value = '');
    clearError();
  });

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

  function setGrid(grid) {
    const rows = board.querySelectorAll('tr');
    grid.forEach((rowData, rowIndex) => {
      const cells = rows[rowIndex].querySelectorAll('input');
      rowData.forEach((cellValue, colIndex) => {
        cells[colIndex].value = cellValue !== 0 ? cellValue : '';
      });
    });
  }

  function solveSudoku(grid) {
    const findEmpty = (grid) => {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (grid[row][col] === 0) return [row, col];
        }
      }
      return null;
    };

    const isValid = (grid, row, col, num) => {
      for (let i = 0; i < 9; i++) {
        if (grid[row][i] === num || grid[i][col] === num) return false;
      }

      const startRow = Math.floor(row / 3) * 3;
      const startCol = Math.floor(col / 3) * 3;
      for (let i = startRow; i < startRow + 3; i++) {
        for (let j = startCol; j < startCol + 3; j++) {
          if (grid[i][j] === num) return false;
        }
      }

      return true;
    };

    const emptyCell = findEmpty(grid);
    if (emptyCell === null) return true;

    const [row, col] = emptyCell;

    for (let num = 1; num <= 9; num++) {
      if (isValid(grid, row, col, num)) {
        grid[row][col] = num;

        if (solveSudoku(grid)) return true;

        grid[row][col] = 0;
      }
    }

    return false;
  }

  function validateGrid(grid) {
    return grid.every(row => row.every(cell => (cell >= 1 && cell <= 9) || cell === 0));
  }
});
