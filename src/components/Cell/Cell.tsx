import { FC } from "react"

import './Cell.css'

interface ICellProps {
    value: number
}
export const Cell: FC<ICellProps> = ({ value }) => {
    return (<div className="cell">
        {
            value === 3 && 'X'
        }
    </div>)
}