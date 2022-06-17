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
    const [errorMessage, setErrorMessage] = useState<string>('')
    const setup = () => {
        // starting position
        let newArr = [...grid]; // copying the old datas array

        newArr[startingPosition[0]][startingPosition[1]] = 3
        newArr[startingPosition[0]][startingPosition[1] - 1] = 3
        newArr[startingPosition[0]][startingPosition[1] - 2] = 3

        createFood()
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
            if (isPlaying) {
                setGameTime((_prevTime) => _prevTime + 1);
                setErrorMessage('')
            }
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
            try {

                switch (direction) {
                    case Direction.Up:
                        if (newPositon[0] - 1 < 0) throw new Error('You lost')
                        // if body contains one above it error
                            console.log(newBody)
                            console.log(newPositon)

                            newPositon[0] = newPositon[0] - 1

                        break;
                    case Direction.Down:
                        if (newPositon[0] + 1 > size - 1) throw new Error('You lost')
                        newPositon[0] = newPositon[0] + 1
                        break;
                    case Direction.Left:
                        if (newPositon[1] - 1 < 0) throw new Error('You lost')
                        newPositon[1] = newPositon[1] - 1
                        break;
                    case Direction.Right:
                        if (newPositon[1] + 1 > size - 1) throw new Error('You lost')
                        newPositon[1] = newPositon[1] + 1
                        break;

                }

                newBody.splice(-1, 1)
                newBody.unshift(newPositon)
                newArr = createGrid(size)
                for (let i = 0; i < newBody.length; i++) {
                    newArr[newBody[i][0]][newBody[i][1]] = 3;
                }

                newArr[food[0]][food[1]] = 2
                // if head = food 
                if (newPositon[0] === food[0] && newPositon[1] === food[1]) {
                    // ADD LENGTH
                    newBody.unshift(newPositon)
                    // remove food 
                    newArr[food[0]][food[1]] = 1
                    createFood()
                    setLength(() => length + 1)

                }


                // detect collision with itself


            } catch (error: any) {
                // detect if there is a collision with a wall 
                setErrorMessage(error.message)
                setIsPlaying(!isPlaying)
                setGameTime(0)
                setLength(3)
                newArr = createGrid(size)
                newBody = [[startingPosition[0], startingPosition[1]], [startingPosition[0], startingPosition[1] - 1], [startingPosition[0], startingPosition[1] - 2]]
                newPositon = [size / 2, size / 2]

            } finally {

                setBody(newBody)
                setStartingPosition(newPositon)
                setGrid(newArr)
            }



        }
    }

    const createFood = () => {
        // creates random food where not body 
        // only 1 food at a time 
        setFood([Math.floor(Math.random() * size), Math.floor(Math.random() * size)])
    }


    useEffect(() => {
        autoMove()
    }, [gameTime])
    useEffect(() => {
        setup()

        window.addEventListener('keydown', (e) => keypress(e))
        return () => window.removeEventListener('keydown', keypress)
    }, [])




    return (
        <>
            <div>
                <div className="game-header">
                    <button onClick={() => { setIsPlaying(() => !isPlaying); setGameTime(() => 0) }}>{!isPlaying ? "Start Game" : "Stop Game"}</button>
                    <p>{errorMessage.toString()}</p>
                    <p>Game Time {gameTime !== 0 && gameTime}</p>
                    {/* <p>Direction {direction}</p> */}
                </div>
                <div className="gridContainer">

                    {
                        grid.map((element: any, indexA: number) => {
                            return element.map((element: any, indexB: number) => {
                                return <Cell className={`${indexA} ${indexB}`} key={`${indexA},${indexB}`} value={element} />
                            })
                        })
                    }
                </div>
            </div>

        </>

    )

}