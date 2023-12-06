# CSCI-331-FeatureProject

## Description

Group Number: 32

Group Members: Bryce Lehnen, John Hartman

Description: Using NextJS, we created a website that it meant to be used as the homepage when opening a new tab in browsers.

---
## Links

Website Link: http://csci331.cs.montana.edu:5031/

Github Link: https://github.com/BryceLehnen/CSCI-331-FeatureProject

---
## Goal of the Project

There has been a clear lack of expression when it comes to browser homepages. Chrome has a boring frontpage that just takes you to Google and provides a few basic links to Youtube or Gmail. We set out to spruce it up, and expand on the idea of the link components. The clear issues were that homepages on browsers tend to be boring without a lot of function, so we solved just that. The background will showcase one of Daka's Firewatch backgrounds which change based on the time. Along with this is a settings menu that controls the link components that can be customized to give you quick access to the links you use the most.

---
## Technical Summary

NextJs was the framework used for this project. It allowed to create components for the links that made coding the project much easier.

The only API used was sunrise-sunset API. It allowed us to use the users geolocation to send a fetch request for various timestamps. These timestamps told us when sunrise, solar noon, and sunset were. Along with those basic times were the three stages twighlight both before sunrise and after sunset. These times determined when the background would change to the cooresponding image that would idealy match what it looked like outside the users window on a clear day.

Working with time or dates in the normal sense would have made this project much more complicated. Time is not base 10, but we wanted it to be a simple integer, so that it would be easier to compare to other converted times. The basic idea is that we convert 24hr time to a four digit integer. The first 2 digits contain the hour and the last 2 contain the min, so 4:37pm would be 1637 as an int. This was simple enough, and with it we could convert the time from sunrise-sunset API and the current time from the users clock. Comparing these integers was easy as we could simply check to see if one was greater or less than the other as an integer like 1261 would not be possible.

---
## Individual Member Notes

### Bryce Lehnen

I mostly worked on the background and with sunrise-sunset API. The API is pretty straightforward to use, but React did not enjoy working with it. I had a lot of issues with timing since it was crucial that certain parts of the code ran before others. However, React wanted to reload the page at the start, and run the code out of order. Mostly when using console.log() with variable values it would print out what the value was before it was changed. This naturally made debugging a nightmare, but eventually I was able to get a delay function working that would wait a certain amount of milliseconds along with getting parts of the program to wait for the json data from sunrise-sunset API.

### John Hartman

I worked on the settings functionality, enabling users to manage their preferred websites through checkboxes within the Settings component. Additionally, I developed the shortcut feature, displaying selected websites as links within the shortcuts container on the main page. These clickable shortcuts redirect users to their chosen websites, enhancing navigation efficiency. Future implementation will include representing each website by an image, offering a visually intuitive selection process, and a method for persistance of shorcut selections.

---
## Conclusion



---
## References


