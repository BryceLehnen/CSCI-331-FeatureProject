import {useState, useEffect} from "react"
import Image from 'next/image'
import './background.css'

export default function background({state}) {
    let [backgroundImage, setBackgroundImage] = useState("")

    return (
        <div>
            <img src="https://i.imgur.com/06THQ9s.jpeg" alt="Background image" />
        </div>
    )
}