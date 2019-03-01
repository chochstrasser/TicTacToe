import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

function Square(props) {
  return (
    <button className='square' onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {    
  renderSquares() {
    let board = [];
    let index = 0;
    console.log(this.props.squares.length);
    
    for (let i = index; i < this.props.squares.length; i+=3) {
      let children = [];
      for (; index < i+3; index++) {
        children.push(<Square 
                       value={this.props.squares[index]}
                       onClick={() => this.props.onClick(index)} 
                     />);
      }
      board.push(<div className="board-row">{children}</div>);
    }
    return board;
  }

  render() {
    return (
      <div>
        {this.renderSquares()}
      </div>
    );
  }
}

        // <div className="board-row">
        //   {this.renderSquare(0)}
        //   {this.renderSquare(1)}
        //   {this.renderSquare(2)}
        // </div>
        // <div className="board-row">
        //   {this.renderSquare(3)}
        //   {this.renderSquare(4)}
        //   {this.renderSquare(5)}
        // </div>
        // <div className="board-row">
        //   {this.renderSquare(6)}
        //   {this.renderSquare(7)}
        //   {this.renderSquare(8)}
        // </div>

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    }
  }
  
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      history: history.concat([{
        squares: squares,
        row: Math.ceil(Math.ceil(i+1/3)/3),
        column: (i%3)+1,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      stepBtnPressed: false,
    });
  }
  
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      stepBtnPressed: true,
    });
  }
  
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    
    const moves = history.map((step, move) => {      
      const desc = move ?
        'Go to move #' + move + ' (' + step.column + ',' + step.row + ')' :
        'Go to game start';
      return (
        <li key={move}>
          <button 
            className={this.state.stepNumber == move && this.state.stepBtnPressed ? 'font-weight-bold': ''} 
            onClick={() => this.jumpTo(move)}>
            {desc}
          </button>
        </li>
      );
    });
    
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}  
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{ status }</div>
          <ol>{ moves }</ol>
        </div>
      </div>
    );
  }
}

export default Game;

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
