"use client"
import {useState, useEffect} from "react"
import Background from "./background"
import settings from "./settings"

export default function Page() {

    return (
    <div>
        <Background state={0} />
    </div>
    )
}