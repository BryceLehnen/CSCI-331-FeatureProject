# CSCI-331-FeatureProject

## Description

Group Number: 32

Group Members: Bryce Lehnen, John Hartman

Description: Using NextJS, we created a website that it meant to be used as the homepage when opening a new tab in browsers.

---
## Links

Website Link (Bryce): http://csci331.cs.montana.edu:5031/

Website Link (John): http://csci331.cs.montana.edu:5016/

Github Link: https://github.com/BryceLehnen/CSCI-331-FeatureProject

---
## Goal of the Project

There has been a clear lack of expression when it comes to browser homepages. Chrome has a boring frontpage that just takes you to Google and provides a few basic links to Youtube or Gmail. We set out to spruce it up, and expand on the idea of the link components. The clear issues were that homepages on browsers tend to be boring without a lot of function, so we solved just that. The background will showcase one of Daka's Firewatch backgrounds which change based on the time. Along with this is a settings menu that controls the link components that can be customized to give you quick access to the links you use the most.

---
## Technical Summary

NextJs was the framework used for this project. It allowed us to create components for the links that made coding the project much easier. The settings menu that controls which links are displayed was accomplished using components. In javascript, there would have needed to be a lot of copying and pasting to properly implement this feature, but with NextJs, we were able to do it quite easily.

The only API used was sunrise-sunset API. It allowed us to use the user's geolocation to send a fetch request for various timestamps. These timestamps told us when sunrise, solar noon, and sunset were. Along with those basic times were the three stages of twilight both before sunrise and after sunset. These times determined when the background would change to the corresponding image that would ideally match what it looked like outside the user's window on a clear day.

Working with time or dates in the normal sense would have made this project much more complicated. Time is not base 10, but we wanted it to be a simple integer, so that it would be easier to compare to other converted times. The basic idea is that we convert 24hr time to a four digit integer. The first 2 digits contain the hour and the last 2 contain the min, so 4:37pm would be 1637 as an int. This was simple enough, and with it we could convert the time from sunrise-sunset API and the current time from the user's clock. Comparing these integers was easy as we could simply check to see if one was greater or less than the other as an integer like 1261 would not be possible.

The background transition is slightly unorthodox, but it does work in the end. Essentially, there are 2 backgrounds with the future background directly behind the current one. When the backgrounds need to be changed, the future background is changed appropriately to the next image. After this, the current background slowly lowers its opacity from 1 to 0, thus making it completely transparent leaving only the future image visible. Then the current image is reset to the next image and its opacity turned back to 1.

---
## Individual Member Notes

### Bryce Lehnen

I mostly worked on the background and with sunrise-sunset API. The API is pretty straightforward to use, but React did not enjoy working with it. I had a lot of issues with timing since it was crucial that certain parts of the code ran before others. However, React wanted to reload the page at the start, and run the code out of order. Mostly when using console.log() with variable values it would print out what the value was before it was changed. This naturally made debugging a nightmare, but eventually I was able to get a delay function working that would wait a certain amount of milliseconds along with getting parts of the program to wait for the json data from sunrise-sunset API.

All in all, I would prefer not to use React as it gives me headaches.

### John Hartman

I worked on the settings functionality, enabling users to manage their preferred websites through checkboxes within the Settings component. Additionally, I developed the shortcut feature, displaying selected websites as links within the shortcuts container on the main page. These clickable shortcuts redirect users to their chosen websites, enhancing navigation efficiency. Future implementation will include representing each website by an image, offering a visually intuitive selection process, and a method for persistence of shortcut selections.

---
## Conclusion

Overall, NextJs made parts of the project easier and other parts far more difficult than they needed to be. We could have something work in another project, then apply the exact same code to almost the same scenario and have it not work. Getting started with NextJs is a pain, but once the ball is rolling, it isn't the worst thing we've used. We definitely got a lot more experience with NextJs and React which will hopefully prove useful later on, but the experience was still well worth it. We would have liked to make the links completely user customizable, but it was out of the scope of this project. The only problem it currently has is due to the school server. Since the server uses http instead of https, the site cannot grab geolocation data which is used for controlling the background, so the server site will always place the user at Lat: 0 and Long: 0.

---
## References

### Coding:

https://nextjs.org/

### Images:

https://dakadibuja.artstation.com/projects/1VBvq
