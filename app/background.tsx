import {useState, useEffect} from "react"
import Image from 'next/image'
import './background.css'

export default function background({state}) {
    // Holds the urls for the various backgrounds
    let backgroundStates = [
        "https://i.imgur.com/7MfEpiD.jpg",  // night
        "https://i.imgur.com/Ke47oIH.jpg",  // dawn
        "https://i.imgur.com/qv5eVN2.jpg",  // sunrise
        "https://i.imgur.com/SGcWzDv.jpg",  // early_morning
        "https://i.imgur.com/zgnraKm.jpg",  // day
        "https://i.imgur.com/06THQ9s.jpg",  // golden_hour
        "https://i.imgur.com/XZoJlFt.jpg",  // sunset
        "https://i.imgur.com/ZvltyRN.jpg",  // dusk
        "https://i.imgur.com/KGoIKwH.jpg",  // placeholder
    ]
    let [backgroundImage, setBackgroundImage] = useState(backgroundStates[8])
    let [time, setTime] = useState(1)
    let [lastTime, setLastTime] = useState(0)
    let [lat, setLat] = useState(0)
    let [lon, setLon] = useState(0)
    // astronomical_begin, nautical_begin, civil_begin, sunrise, solar_noon, sunset, civil_end, nautical_end, astronomical_end
    let [sunriseSunsetTimes, setSunriseSunsetTimes] = useState([])
    
    const delay = ms => new Promise(
        resolve => setTimeout(resolve, ms)
    )

    useEffect(() => {
        getSunsetSunrise()

        // Timer for updating background
        const interval = setInterval(() => {
            update()
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    // Caches the data from sunrise-sunset api
    function getSunsetSunrise() {
        // Grabbing lat and long data from browser
        navigator.geolocation.getCurrentPosition((position) => {
            
            setLat(position.coords.latitude)
            lat = position.coords.latitude
            setLon(position.coords.longitude)
            lon = position.coords.longitude
        })
        console.log("lat ", lat, " lon ", lon)

        // Using location data to fetch data from api
        fetch(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&date=today&formatted=0`)
            .then(res=>res.json())
            .then(data=> {
                //setSunriseSunsetTimes(data)
                sunriseSunsetTimes = data
                console.log(data)
            })
        console.log(sunriseSunsetTimes)
    }

    // Updates the current time
    // Time is a 4 digit int; so 10:37am => 1037 and 3:52pm => 1552
    function changeTime() {
        let rawTime = new Date()
        let curTime = (rawTime.getHours() * 100) + rawTime.getMinutes()
        //setTime(curTime)
        time = curTime
        console.log("Current time: ", time)
    }

    // Checks time and changes image accordingly
    function update() {
        changeTime()
        if (lastTime != time) {
            //setLastTime(time)
            lastTime = time
            // bunch of if statements
        }
    }

    return (
        <div>
            <img src={backgroundImage} alt="Background image" />
        </div>
    )
}