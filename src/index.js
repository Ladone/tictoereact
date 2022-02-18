import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                winnerCombination={this.props.winnerCombination}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        )
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

function Square(props) {
    let isWinnerCell = props.winnerCombination.includes(props.value);
    // console.log(isWinnerCell);
    // console.log(props.winnerCombination);
    // console.log(props.value);
    //
    return (
        <button className={'square ' + (1 ? 1 : 0)} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            xIsNext: true,
            isHaveWinner: false,
            stepNumber: 0,
            winnerCombination: [],
        };
    }

    handleClick(i) {
        console.log(i);
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[this.state.stepNumber];
        const squares = current.squares.slice();

        this.updateWinnerCombination(squares);

        if (this.state.isHaveWinner || squares[i]) {
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';

        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
        })
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
            isHaveWinner: false,
        });
    }

    updateWinnerCombination(squares) {
        if (this.state.isHaveWinner && Object.keys(this.state.winnerCombination).length === 0 && Object.getPrototypeOf(this.state.winnerCombination) === Array.prototype) {
            this.setState({winnerCombination: getWinnerCombination(squares)});
        }
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Step to move #' + move :
                'Start new game';
            return (<li key={move}>
                <button onClick={() => this.jumpTo(move)}>{desc}</button>
            </li>)
        });

        let status;

        if (winner) {
            status = 'Winner: ' + winner;
            this.state.isHaveWinner = true;
        } else {
            status = 'Next move: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        winnerCombination={this.state.winnerCombination}
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

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

function calculateWinner(squares) {
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }

    return null;
}

function getWinnerCombination(squares) {
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return lines[i];
        }
    }
}

// ========================================

ReactDOM.render(
    <Game/>,
    document.getElementById('root')
);

