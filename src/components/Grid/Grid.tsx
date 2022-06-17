import { FC, useEffect, useState } from "react";
import { start } from "repl";

import { Cell } from "../Cell/Cell";
import './Grid.css'
interface IGridProps {
    size: number
}
enum Direction {
    Up,
    Down,
    Left,
    Right
}


const createGrid = (size: number): number[][] => {
    let array = new Array()
    for (let i = 0; i < size; i++) {
        array.push(new Array(size).fill(0))
    }
    return array
}
export const Grid: FC<IGridProps> = ({ size }) => {

    const [grid, setGrid] = useState(createGrid(size))
    const [startingPosition, setStartingPosition] = useState([size / 2, size / 2])
    const [isPlaying, setIsPlaying] = useState<boolean>(false)
    const [gameTime, setGameTime] = useState<number>(0)
    const [direction, setDirection] = useState<Direction>(Direction.Up)
    const [length, setLength] = useState<number>(3)
    const [body, setBody] = useState([[startingPosition[0], startingPosition[1]], [startingPosition[0], startingPosition[1] - 1], [startingPosition[0], startingPosition[1] - 2]])
    const setup = () => {
        // starting position
        let newArr = [...grid]; // copying the old datas array
        newArr[startingPosition[0]][startingPosition[1]] = 3
        newArr[startingPosition[0]][startingPosition[1] - 1] = 3
        newArr[startingPosition[0]][startingPosition[1] - 2] = 3

        setGrid(newArr)

    }
    // detect where to go 
    const keypress = (e: any) => {
        e.preventDefault()
        if (e.key === "ArrowUp") return setDirection(() => Direction.Up)
        if (e.key === "ArrowDown") return setDirection(Direction.Down)
        if (e.key === "ArrowLeft") return setDirection(Direction.Left)
        if (e.key === "ArrowRight") return setDirection(Direction.Right)

    }

    useEffect(() => {
        const interval = setInterval(() => {
            if (isPlaying) setGameTime((_prevTime) => _prevTime + 1)
        }, 100);
        return () => clearInterval(interval)
    }, [isPlaying]);

    const autoMove = () => {
        // moves right
        let newArr = [...grid]; // copying the old datas array
        let newPositon = [...startingPosition]
        let newBody = [...body]
        // console.log(body)
        if (isPlaying) {

            // setBody([[startingPosition[0], startingPosition[1]], ])
            switch (direction) {
                case Direction.Up:
                    // newArr[startingPosition[0] - 1][startingPosition[1]] = 3;
                    newPositon[0] = newPositon[0] - 1
                    break;
                case Direction.Down:
                    // newArr[startingPosition[0] + 1][startingPosition[1]] = 3;
                    newPositon[0] = newPositon[0] + 1
                    break;
                case Direction.Left:
                    // newArr[startingPosition[0]][startingPosition[1] - 1] = 3;
                    newPositon[1] = newPositon[1] - 1
                    break;
                case Direction.Right:
                    // newArr[startingPosition[0]][startingPosition[1] + 1] = 3;
                    newPositon[1] = newPositon[1] + 1
                    break;

            }

            let temp0 = newBody[0]
            let temp1 = newBody[1]
            newBody[2] = temp1
            newBody[1] = temp0
            newBody[0] = newPositon

          

            

            setBody(newBody)
            setStartingPosition(newPositon)
        }
        newArr = createGrid(size)
        newArr[newBody[0][0]][newBody[0][1]] = 3;
        newArr[newBody[1][0]][newBody[1][1]] = 3;
        newArr[newBody[2][0]][newBody[2][1]] = 3;
        setGrid(newArr)

    }

    useEffect(() => {
        autoMove()
    }, [gameTime])
    useEffect(() => {
        setup()
        // console.log(grid)

        window.addEventListener('keydown', (e) => keypress(e))
        return () => window.removeEventListener('keydown', keypress)
    }, [])




    return (
        <>
            <div>
                <div className="game-header">
                    <button onClick={() => { setIsPlaying(() => !isPlaying); setGameTime(() => 0) }}>{!isPlaying ? "Start Game" : "Stop Game"}</button>
                    <p>Game Time {gameTime !== 0 && gameTime}</p>
                    <p>Direction {direction}</p>
                </div>
                <div className="gridContainer">

                    {
                        grid.map((element: any, indexA: number) => {
                            return element.map((element: any, indexB: number) => {
                                return <Cell key={`${indexA},${indexB}`} value={element} />
                            })
                        })
                    }
                </div>
            </div>

        </>

    )

}