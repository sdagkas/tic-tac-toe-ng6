import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  PLAYER_COMPUTER = { name: 'Computer', symbol: 'o' };
  PLAYER_HUMAN = { name: 'You', symbol: 'x' };
  DRAW = { name: 'Draw', symbol: '' };

  board: any[];
  currentPlayer = this.PLAYER_HUMAN;
  prompt: string;
  gameOver: boolean;

  constructor() { }

  ngOnInit() {
    this.showCurrentPlayerPrompt();
    this.newGame();
  }

  showCurrentPlayerPrompt() {
    this.prompt = 'Current player: ' + this.currentPlayer.name;
  }

  square_click(square) {
    if(square.value === '' && !this.gameOver) {
      square.value = this.currentPlayer.symbol;

      if(this.isWinner(this.PLAYER_HUMAN.symbol))
        this.showGameOver(this.PLAYER_HUMAN);
      else if(!this.availableSquaresExist())
        this.showGameOver(this.DRAW);
      else {
        this.setCurrentPlayer();
        this.showCurrentPlayerPrompt();
        
        setTimeout(() => {
          this.computerMove();
        }, 600);
      }
    }
  }

  computerMove(firstMove: boolean = false) {
    let square = firstMove ? this.board[4] : this.getRandomAvailableSquare();
    square.value = this.PLAYER_COMPUTER.symbol;

    if(this.isWinner(this.PLAYER_COMPUTER.symbol))
      this.showGameOver(this.PLAYER_COMPUTER);
    else if(!this.availableSquaresExist())
      this.showGameOver(this.DRAW);
    else {
      this.setCurrentPlayer();
      this.showCurrentPlayerPrompt();
    }
  }

  setCurrentPlayer() {
    this.currentPlayer = (this.currentPlayer == this.PLAYER_COMPUTER ? this.PLAYER_HUMAN : this.PLAYER_COMPUTER);
  }

  availableSquaresExist(): boolean {
    for(let square of this.board) {
      if(square.value === '') return true;
    }

    return false;
  }

  getRandomAvailableSquare(): any {
    let availableSquares = this.board.filter(s => s.value === '');
    var squareIndex = this.getRndInteger(0, availableSquares.length - 1);

    return availableSquares[squareIndex];
  }

  showGameOver(winner) {
    this.gameOver = true;
    this.prompt = 'Game over. Winner: ' + winner.name;

    if(winner !== this.DRAW) {
      this.currentPlayer = winner;
    }    
  }

  getWinner(): string {
    if(this.getWinnerPatterns(this.PLAYER_HUMAN.symbol).indexOf(this.board) > -1)
      return 'You';
    else if(this.getWinnerPatterns(this.PLAYER_COMPUTER.symbol).indexOf(this.board) > -1)
      return 'Computer';
    else
      return 'Draw';
  }

  getWinnerPatterns(symbol: string): any[] {
    return [
      [
        { value: symbol }, { value: symbol }, { value: symbol },
        { value: '' }, { value: '' }, { value: '' },
        { value: '' }, { value: '' }, { value: '' }
      ],
      [
        { value: '' }, { value: '' }, { value: '' },
        { value: symbol }, { value: symbol }, { value: symbol },
        { value: '' }, { value: '' }, { value: '' }
      ],
      [
        { value: '' }, { value: '' }, { value: '' },
        { value: '' }, { value: '' }, { value: '' },
        { value: symbol }, { value: symbol }, { value: symbol }
      ],
      [
        { value: symbol }, { value: '' }, { value: '' },
        { value: symbol }, { value: '' }, { value: '' },
        { value: symbol }, { value: '' }, { value: '' }
      ],
      [
        { value: '' }, { value: symbol }, { value: '' },
        { value: '' }, { value: symbol }, { value: '' },
        { value: '' }, { value: symbol }, { value: '' }
      ],
      [
        { value: '' }, { value: '' }, { value: symbol },
        { value: '' }, { value: '' }, { value: symbol },
        { value: '' }, { value: '' }, { value: symbol }
      ],
      [
        { value: symbol }, { value: '' }, { value: '' },
        { value: '' }, { value: symbol }, { value: '' },
        { value: '' }, { value: '' }, { value: symbol }
      ],
      [
        { value: '' }, { value: '' }, { value: symbol },
        { value: '' }, { value: symbol }, { value: '' },
        { value: symbol }, { value: '' }, { value: '' }
      ],
    ];
  }

  isWinner(symbol): boolean {
    const patterns = this.getWinnerPatterns(symbol);

    for(let pattern of patterns) {
      let foundWinner = true;

      for(let i = 0; i < 9; i++) {
        if(pattern[i].value == symbol && pattern[i].value != this.board[i].value)
          foundWinner = false;
      }

      if(foundWinner) {
        for(let i = 0; i < 9; i++) {
          if(pattern[i].value == symbol)
            this.board[i].class = 'winner';
        }

        return true;
      }
    }

    return false;
  }

  newGame() {
    this.board = [
      { value: '' }, { value: '' }, { value: '' },
      { value: '' }, { value: '' }, { value: '' },
      { value: '' }, { value: '' }, { value: '' }
    ];

    this.gameOver = false;

    if(this.currentPlayer == this.PLAYER_COMPUTER)
      this.computerMove(true);
  }

  getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
  }
}
