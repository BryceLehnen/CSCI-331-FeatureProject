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
    let [futureBackground, setFutureBackground] = useState(backgroundStates[8])
    //const opacityToggle = {opacity: 1}
    let [opacityToggle, setOpacityToggle] = useState(1)
    let [time, setTime] = useState(1)
    let [lastTime, setLastTime] = useState(0)
    let [lastState, setLastState] = useState(8)
    let [lat, setLat] = useState(0)
    let [lon, setLon] = useState(0)
    // astronomical_begin, nautical_begin, civil_begin, sunrise, solar_noon, sunset, civil_end, nautical_end, astronomical_end
    let [sunriseSunsetTimes, setSunriseSunsetTimes] = useState({})
    let [backgroundTimes, setBackgroundTimes] = useState([])
    // Times used for icons
    let [sunrise, setSunrise] = useState("00:00 AM")
    let [sunset, setSunset] = useState("00:00 AM")
    
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
    async function getSunsetSunrise() {
        // Grabbing lat and long data from browser
        navigator.geolocation.getCurrentPosition((position) => {
            
            setLat(position.coords.latitude)
            lat = position.coords.latitude
            setLon(position.coords.longitude)
            lon = position.coords.longitude
        })
        await delay(500)    // Small delay to get lat and lon BEFORE fetching json data
        console.log("lat ", lat, " lon ", lon)

        // Using location data to fetch data from api
        const res = await fetch(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&date=today&formatted=0`)
        if (!res.ok) {
            throw new Error('Failed to fetch data')
        }
        else {
            const data = await res.json()
            const newTimes = 
            {astronomical_begin: data.results.astronomical_twilight_begin,
            nautical_begin: data.results.nautical_twilight_begin,
            civil_begin: data.results.civil_twilight_begin,
            sunrise: data.results.sunrise,
            solar_noon: data.results.solar_noon,
            sunset: data.results.sunset,
            civil_end: data.results.civil_twilight_end,
            nautical_end: data.results.nautical_twilight_end,
            astronomical_end: data.results.astronomical_twilight_end}

            // Sets object data to sunriseSunsetTimes
            sunriseSunsetTimes = newTimes
            console.log(sunriseSunsetTimes)

            // Call setTimes now that we have the json data
            setTimes()
        }
    }

    // Takes the UTC times given from sunrise-sunset API and converts it to your local time by checking current time and getting
    // the offset from it and UTC
    // Once converted, it sets the times for when the backgrounds should change and stores this info in backgroundTimes[]
    async function setTimes() {
        // Creating the offset and converting it to hours
        const now = new Date()
        let offset = now.getTimezoneOffset()
        const os = (offset / 60)

        // Times in chronological order
        backgroundTimes[0] = 0                                                          // night
        backgroundTimes[1] = utcToLocal(sunriseSunsetTimes['astronomical_begin'], os)   // dusk
        backgroundTimes[2] = utcToLocal(sunriseSunsetTimes['nautical_begin'], os)       // dawn
        backgroundTimes[3] = utcToLocal(sunriseSunsetTimes['civil_begin'], os)          // sunrise
        backgroundTimes[4] = utcToLocal(sunriseSunsetTimes['sunrise'], os) + 100        // early_morning
        backgroundTimes[5] = utcToLocal(sunriseSunsetTimes['solar_noon'], os)           // day
        backgroundTimes[6] = utcToLocal(sunriseSunsetTimes['sunset'], os) - 100         // golden_hour
        backgroundTimes[7] = utcToLocal(sunriseSunsetTimes['sunset'], os)               // sunset
        backgroundTimes[8] = utcToLocal(sunriseSunsetTimes['nautical_end'], os)         // dusk
        backgroundTimes[9] = utcToLocal(sunriseSunsetTimes['astronomical_end'], os)     // night

        // Sets the times for sunrise sunset icons
        //sunrise = iconTime(sunriseSunsetTimes['sunrise'], os)
        setSunrise(iconTime(sunriseSunsetTimes['sunrise'], os))
        //sunset = iconTime(sunriseSunsetTimes['sunset'], os)
        setSunset(iconTime(sunriseSunsetTimes['sunset'], os))
    }

    // Helper functions for setTimes()
    // Returns the time as a 4 digit int when givin a UTC time from sunriseSunsetTimes
    function utcToLocal(stringTime, os) {
        let intTime = parseInt(stringTime.substring(11, 13))
        let sethour = 0
        let setmin = 0
        let diff = 0
        if (intTime >= os) {
            sethour = (intTime - os) * 100
        }
        else {
            diff = os - intTime
            sethour = (24 - diff) * 100
        }
        setmin = parseInt(stringTime.substring(14, 16))
        return sethour + setmin
    }

    // Returns the time as a string, in 12hr time from UTC 24hr
    function iconTime(stringTime, os) {
        let intTime = parseInt(stringTime.substring(11, 13))
        let setmin = stringTime.substring(14, 16)
        let sethour = 0
        let diff = 0
        let meridian = "AM"
        if (intTime >= os) {
            sethour = (intTime - os)
        }
        else {
            diff = os - intTime
            sethour = (24 - diff)
        }

        // Convert to 12hr time and set meridian
        if (sethour < 12) {
            meridian = "AM"
        }
        else {
            sethour = sethour - 12
            meridian = "PM"
        }

        // Convert to string and concat the final time
        sethour.toString()
        let finaltime = sethour + ":" + setmin + " " + meridian
        return finaltime
    }

    // Updates the current time
    // Time is a 4 digit int; so 10:37am => 1037 and 3:52pm => 1552
    function changeTime() {
        let rawTime = new Date()
        let curTime = (rawTime.getHours() * 100) + rawTime.getMinutes()
        time = curTime
        console.log("Current time: ", time)

        // For testing purposes
        // time = time + 5
        // if (time > 2400) time = 0
        // console.log("Current time: ", time)
    }

    // Checks time and changes image accordingly
    function update() {
        changeTime()
        if (lastTime != time) {
            //setLastTime(time)
            lastTime = time
            //console.log("CHECKING")
            if (time >= backgroundTimes[0] && time < backgroundTimes[1]) change(0)
            else if (time >= backgroundTimes[1] && time < backgroundTimes[2]) change(7)
            else if (time >= backgroundTimes[2] && time < backgroundTimes[3]) change(1)
            else if (time >= backgroundTimes[3] && time < backgroundTimes[4]) change(2)
            else if (time >= backgroundTimes[4] && time < backgroundTimes[5]) change(3)
            else if (time >= backgroundTimes[5] && time < backgroundTimes[6]) change(4)
            else if (time >= backgroundTimes[6] && time < backgroundTimes[7]) change(5)
            else if (time >= backgroundTimes[7] && time < backgroundTimes[8]) change(6)
            else if (time >= backgroundTimes[8] && time < backgroundTimes[9]) change(7)
            else if (time >= backgroundTimes[9]) change(0)
        }
    }

    // Change background image according to the index provided
    async function change(index) {
        let previousIndex = lastState
        // Checks if background should be changed
        if (index != lastState) {
            lastState = index
        }
        else {
            return
        }

        // Sets future to the next background, but user doesn't see as it is behind the other background image
        setFutureBackground(backgroundStates[index])
        await transition()
        setBackgroundImage(backgroundStates[index])
    }

    // Slowly decreases the opacity of the current background to reveal the next background
    function transition() {
        return new Promise(function (resolve, reject) {
            var del = 0.01
            var op = 1
            var id = setInterval(changeOpacity, 20)
            
            function changeOpacity() {
                op = op - del
                setOpacityToggle(op)
                if (op <= 0) {
                    clearInterval(id)
                    resolve
                }
            }
        })
    }

    return (
        <div>
            <img id="futureBackground" src={futureBackground} alt="Future background image" />
            <img id="background" src={backgroundImage} alt="Background image" style={{opacity: opacityToggle.toString()}} />
            <img id="sunriseimg" src="https://i.imgur.com/qUibc2y.png" alt="sunrise icon" />
            <img id="sunsetimg" src="https://i.imgur.com/zKXL1r5.png" alt="sunset icon" />
            <p id="sunrise">{sunrise}</p>
            <p id="sunset">{sunset}</p>
        </div>
    )
}