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
    let [lastState, setLastState] = useState(8)
    let [lat, setLat] = useState(0)
    let [lon, setLon] = useState(0)
    // astronomical_begin, nautical_begin, civil_begin, sunrise, solar_noon, sunset, civil_end, nautical_end, astronomical_end
    let [sunriseSunsetTimes, setSunriseSunsetTimes] = useState({})
    let [backgroundTimes, setBackgroundTimes] = useState([])
    
    const delay = ms => new Promise(
        resolve => setTimeout(resolve, ms)
    )

    useEffect(() => {
        getSunsetSunrise()
        //setTimes()

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
        await delay(200)    // Small delay to get lat and lon BEFORE fetching json data
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

            //setSunriseSunsetTimes(newTimes)
            sunriseSunsetTimes = newTimes
            //console.log("RAW ", data)
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
        //const os = 0      // Used for testing. Change offset to 'appear' in different timezones
        //console.log("OFF ", os)

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
    }

    // Helper function for setTimes()
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
        //console.log(sunriseSunsetTimes['astronomical_begin'])
        //console.log("lat ", lat, " lon ", lon)
        console.log(backgroundTimes)
        changeTime()
        if (lastTime != time) {
            //setLastTime(time)
            lastTime = time
            console.log("CHECKING")
            if (time >= backgroundTimes[0] && time < backgroundTimes[1]) change(0)
        }
    }

    // Change background image according to the index provided
    function change(index) {
        // Checks if background should be changed
        if (index != lastState) {
            setLastState(index)
        }
        else {
            return
        }

        // TODO Add transition if time allows

        // Changes the url in backgroundImage using the index provided
        console.log("CHANGING BACKGROUND ", lastState)
        setBackgroundImage(backgroundStates[index])
    }

    return (
        <div>
            <img src={backgroundImage} alt="Background image" />
        </div>
    )
}