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
    const [food, setFood] = useState<number[]>([])
    const setup = () => {
        // starting position
        let newArr = [...grid]; // copying the old datas array
        newArr[startingPosition[0]][startingPosition[1]] = 3
        newArr[startingPosition[0]][startingPosition[1] - 1] = 3
        newArr[startingPosition[0]][startingPosition[1] - 2] = 3
        let newFood = [...food]
        newFood = [5, 10]

        setFood(newFood)
        setGrid(newArr)

    }
    // detect where to go 
    const keypress = (e: any) => {
        e.preventDefault()
        if (e.key === "ArrowUp" || e.key === "w") return setDirection(() => Direction.Up)
        if (e.key === "ArrowDown" || e.key === "s") return setDirection(Direction.Down)
        if (e.key === "ArrowLeft" || e.key === "a") return setDirection(Direction.Left)
        if (e.key === "ArrowRight" || e.key === "d") return setDirection(Direction.Right)

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

            switch (direction) {
                case Direction.Up:
                    newPositon[0] = newPositon[0] - 1
                    break;
                case Direction.Down:
                    newPositon[0] = newPositon[0] + 1
                    break;
                case Direction.Left:
                    newPositon[1] = newPositon[1] - 1
                    break;
                case Direction.Right:
                    newPositon[1] = newPositon[1] + 1
                    break;

            }
            newBody.splice(-1, 1)
            newBody.unshift(newPositon)
            newArr = createGrid(size)
            for (let i = 0; i < newBody.length; i++) {
                newArr[newBody[i][0]][newBody[i][1]] = 3;

            }

            // adds food
            newArr[food[0]][food[1]] = 2
            // if head = food 
            if (newPositon[0] === food[0] && newPositon[1] === food[1]) {
                // ADD LENGTH
                newBody.unshift(newPositon)
                setLength(() => length + 1)

            }
            setBody(newBody)
            setStartingPosition(newPositon)
            setGrid(newArr)
        }
    }

    const createFood = () => {
        // creates random food where not body 
        // only 1 food at a time 
        setFood([1, 2])

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
                    {/* <p>Direction {direction}</p> */}
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