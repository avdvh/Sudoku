document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('sudoku-board');
    const solveBtn = document.getElementById('solve-btn');
    for (let row = 0; row < 9; row++) {
      const tr = document.createElement('tr');
      for (let col = 0; col < 9; col++) {
        const td = document.createElement('td');
        const input = document.createElement('input');
        input.type = 'text';
        input.maxLength = '1';
        input.classList.add('cell');
        td.appendChild(input);
        tr.appendChild(td);
      }
      board.appendChild(tr);
    }
  
    solveBtn.addEventListener('click', () => {
      const grid = getGrid();
      if (solveSudoku(grid)) {
        setGrid(grid);
      } else {
        alert('No solution exists!');
      }
    });
    function getGrid() {
      const grid = [];
      const cells = document.querySelectorAll('.cell');
      cells.forEach((cell, index) => {
        const value = parseInt(cell.value) || 0;
        const row = Math.floor(index / 9);
        const col = index % 9;
        if (!grid[row]) grid[row] = [];
        grid[row][col] = value;
      });
      return grid;
    }
    function setGrid(grid) {
      const cells = document.querySelectorAll('.cell');
      cells.forEach((cell, index) => {
        const row = Math.floor(index / 9);
        const col = index % 9;
        cell.value = grid[row][col] || '';
      });
    }
  });
  