<div id="top" align="center">
  <h3 align="center">CM2030-Image-Processing-Application</h3>

  <p align="center">
    Project assigned by SIM GE - UOL for the purpose of CM2030 Graphics Programming 
  </p>
</div>

# About The Project
    Project assigned by SIM GE - UOL for the purpose of CM2030 Graphics Programming 

## Built With
<a href="https://p5js.org/"><img src="https://img.shields.io/badge/p5.js-e61e5b?style=for-the-badge&logo=p5.js&logoColor=f7f7f7"></a>
<a href=""><img src="https://img.shields.io/badge/object detect-72e896?style=for-the-badge&logo=objectdetect&logoColor=49525f"></a>
![javascript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=000000)


# Usage
To start, open the `index.html` file using a Live Server extension.

Alternatively, visit this website hosted by [Vercel](https://vercel.com/): [CM2030 Graphics Programming Snooker](https://cm-2030-graphics-programming-snooker.vercel.app/)

<p align="right"><a href="#top">back to top</a></p>

# Commentary (Word Count: 447)
## Introduction

As per requirements, I have created an image processing application using `p5.js` and `Object Detect`  library. All options for the application are labelled at the top. Most of the details can be found in the `README.md` file. 

## Conversion

For the colour space conversions, I have converted RGB into CMYK and HSL for image processing accordingly, using provided formulas from attached resource. 

With the CMYK colour conversion, you can see that it is almost inverse of RGB, as CMYK is commonly seen as the “inverse” of RGB. The formula for CMYK and the displayed results help proof this claim. 

For HSL, hue and saturation are displayed by Red and Green respectively, the more red/green the image shows, the higher these values are. I would like to focus more on the Blue, where it represents the Lightness(Brightness) of the image. We can easily use this value to help indicate the amount of light in a room/image. 

## Threshold

For Thresholding, available options are labelled at the top of the application. The sliders follows the requirements for the RGB Thresholding. 

### CMYK Threshold

For the 1st colour space conversion, I converted RGB into CMYK and displayed it accordingly. CMYK is later thresholded using the CMY individual sliders at the top to conduct thresholding. This can be used to help to showcase how much ink is needed to print the image using a CMYK printer. 

### HSL Lightness

For my 2nd colour space conversion, I converted RGB into HSL and displayed it accordingly. To threshold it, I had opted to use the Lightness value in HSL to conduct threshold. This can be useful in identifying if an area is well lit, and to automatically turn on/off a set of lights. 

## Camera

The application uses the camera input from your device to conduct image processing. Once loaded, the live-view is displayed at the top, together with 2 buttons. Choosing “Take Picture” will make the application run image processing using the image snapshot, and save the image to the device. Choosing “Select Picture” will let the user upload an image to run image processing on. Note that these 2 buttons have no effect on the face detection as it’s a requirement for it to use a live camera.

Note that I have added a filter option at the top, labelled as “Face Detection” where various filters can be selected. They can be selected by pressing keyboard numbers. 

## Extension

I have added a “Focus Face” effect, where it brightens up your face, and darkens all other areas. This will help users to focus more on your face rather than the background of your room, making it a useful feature. I have chosen this as my extension as I believe that if implemented into video calling applications, this would be frequently used by users who would prefer a non-fake background, while drawing attention to the user, and away from what is in the background of the user.

## Video Demonstration
The following is a video demonstration of my project, as per the requirements.

[Video Demonstration](./docs/Video%20Demonstration.mp4)

### Watch on YouTube
[![YouTube Video Demonstration](http://img.youtube.com/vi/Gbv4HchGpK0/0.jpg)](http://www.youtube.com/watch?v=Gbv4HchGpK0 "CM2030 Snooker")

<p align="right"><a href="#top">back to top</a></p>

# Acknowledgments
## External Sources Utilized
- p5.js Library from [p5.js](https://p5js.org/)
- objectdetect.js Library by Marti`n Tschirsich

## Tools Utilized
- <a href="https://github.com/"><img src="https://img.shields.io/badge/GitHub-black?style=for-the-badge&logo=github&logoColor=white" alt="github"></a>
- <a href="https://www.adobe.com/sg/products/photoshop.html"><img src="https://img.shields.io/badge/Photoshop-001d34?style=for-the-badge&logo=photoshop&logoColor=2fa3f7" alt="photoshop"></a>
- <a href="https://code.visualstudio.com/"><img src="https://img.shields.io/badge/Visual Studio Code-218bd3?style=for-the-badge&logo=visualstudio&logoColor=white" alt="vscode"></a>
- <a href="https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer"><img src="https://img.shields.io/badge/Live Server-41205f?style=for-the-badge&logo=liveserver&logoColor=white" alt="vscode"></a>

<p align="right"><a href="#top">back to top</a></p>
