/*
# CM2030 Image Processing Application Commentary

# Introduction

As per requirements, I have created an image processing application using `p5.js` and 
`Object Detect`  library. All options for the application are labelled at the top. Most 
of the details can be found in the `README.md` file. 

# Conversion

For the colour space conversions, I have converted RGB into CMYK and HSL for image 
processing accordingly, using provided formulas from attached resource. 

With the CMYK colour conversion, you can see that it is almost inverse of RGB, as CMYK is 
commonly seen as the “inverse” of RGB. The formula for CMYK and the displayed results 
help proof this claim. 

For HSL, hue and saturation are displayed by Red and Green respectively, the more 
red/green the image shows, the higher these values are. I would like to focus more on the 
Blue, where it represents the Lightness(Brightness) of the image. We can easily use this 
value to help indicate the amount of light in a room/image. 

# Threshold

For Thresholding, available options are labelled at the top of the application. The 
sliders follows the requirements for the RGB Thresholding. 

## CMYK Threshold

For the 1st colour space conversion, I converted RGB into CMYK and displayed it 
accordingly. CMYK is later thresholded using the CMY individual sliders at the top to 
conduct thresholding. This can be used to help to showcase how much ink is needed to print 
the image using a CMYK printer. 

## HSL Lightness

For my 2nd colour space conversion, I converted RGB into HSL and displayed it accordingly. 
To threshold it, I had opted to use the Lightness value in HSL to conduct threshold. This 
can be useful in identifying if an area is well lit, and to automatically turn on/off a set
of lights. 

# Camera

The application uses the camera input from your device to conduct image processing. Once 
loaded, the live-view is displayed at the top, together with 2 buttons. Choosing “Take 
Picture” will make the application run image processing using the image snapshot, and save 
the image to the device. Choosing “Select Picture” will let the user upload an image to run 
image processing on. Note that these 2 buttons have no effect on the face detection as it’s 
a requirement for it to use a live camera.

Note that I have added a filter option at the top, labelled as “Face Detection” where various 
filters can be selected. They can be selected by pressing keyboard numbers. 

# Extension

I have added a “Focus Face” effect, where it brightens up your face, and darkens all other 
areas. This will help users to focus more on your face rather than the background of your 
room, making it a useful feature. I have chosen this as my extension as I believe that if 
implemented into video calling applications, this would be frequently used by users who would 
prefer a non-fake background, while drawing attention to the user, and away from what is in 
the background of the user.
*/

// Declare constant variables
const frameRateCap = 30
const cameraSize = { x: 160, y: 120 }
const classifier = objectdetect.frontalface

var canvas
var cameraDisplay
var video
var ui

var detector

// Enumerators
const faceEffect = {
    GRAYSCALE: 'grayscale',
    BLUR: 'blur',
    CONVERT_CMYK: 'convertCMYK',
    CONVERT_HSL: 'convertHSL',
    PIXELATE: 'pixelate',
    FOCUS_FACE: 'focusFace'
}

/**
 * @brief This function sets up the camera and the display.
 * 
 * This function sets up the camera and the display and adds the camera to the display objects manually.
 * 
 * @example
 * setupCamera()
 */
function setupCamera() {
    // Create a display to show the Camera
    cameraDisplay = new Display("Camera", 120, 160, "row1")

    // Create the Camera
    video = new Camera(cameraDisplay.body, () => {
        // Add the camera to the display objects manually
        cameraDisplay.objects.push(video.camera)
        detector = new objectdetect.detector(video.originalWidth, video.originalHeight, 1.2, classifier)
    })

    // Add the other objects
    // Add the button to take a picture
    let button = createButton("Take Picture")
    button.mousePressed(() => {
        // save the picture
        video.camera.loadPixels()
        let img = createImage(cameraSize.x, cameraSize.y)
        img.copy(video.camera, 0, 0, cameraSize.x, cameraSize.y, 0, 0, cameraSize.x, cameraSize.y)
        img.save("image", "png")

        // load the pixels into video.pixels[]
        video.pixels = video.camera.pixels
    })

    // Add the button to the display
    cameraDisplay.addObject(button)

    // Add the button to select a picture
    button = createButton("Select Picture")
    button.mousePressed(() => {
        // Upload the picture
        let input = createFileInput((file) => {
            // Hide the input if not already hidden. 
            input.hide()

            // Check if the file is an image
            if (file.type === "image") {
                console.log("Loaded " + file.name)

                // load img and extract pixels
                loadImage(file.data, (image) => {
                    // Resize the image to the camera size
                    image.resize(cameraSize.x, cameraSize.y)
                    image.loadPixels()

                    // load the pixels into video.pixels[]
                    video.pixels = image.pixels
                })
            }
            else {
                // Alert the user that the file is not an image
                alert("Please upload an image file")
            }
        })
        // Hide the input.
        input.hide()

        // Click the input to open the file dialog
        input.elt.click()
    })

    // Add the button to the display
    cameraDisplay.addObject(button)
}

function setup() {
    // Setup cameras
    setupCamera()

    // Create the canvas
    canvas = createCanvas(cameraSize.x * 3, getY(6))
    canvas.parent("display")

    // Setup the Canvas settings
    background(250)
    frameRate(frameRateCap)

    // Create the UI
    ui = new UI()
}

function draw() {
    // Draw a grey background
    background(250)

    // Apply text settings
    textSize(24)
    fill(0)

    // Check if camera loaded
    if (!video.loaded && video.pixels.length <= 0) return

    // Check if the filters are enabled
    if (ui.toggles[0].objects[0].checked()) {
        // Draw the cameras
        // Draw the 2 webcam images
        image(video.getImgFromPixels(), getX(0), getY(0), 160, 120)
        image(video.getImgFromPixels(), getX(0), getY(3), 160, 120)

        // Add labels
        text("Original", getX(0), getY(1) - 12)
        text("Original", getX(0), getY(4) - 12)

        // Draw the grayscale img
        image(video.getGrayscale(), getX(1), getY(0), 160, 120)

        // Draw rgb channel
        image(video.getRGB(), getX(0), getY(1), 480, 120)

        // Draw the threshold img
        image(video.getThreshold(ui.rgb[0].objects[0].value(), ui.rgb[1].objects[0].value(), ui.rgb[2].objects[0].value()), getX(0), getY(2), 480, 120)

        // Add labels
        text("Grayscale", getX(1), getY(1) - 12)

        text("Red", getX(0), getY(2) - 12)
        text("Green", getX(1), getY(2) - 12)
        text("Blue", getX(2), getY(2) - 12)

        text("Threshold", getX(0), getY(3) - 12)
        text("Threshold", getX(1), getY(3) - 12)
        text("Threshold", getX(2), getY(3) - 12)

        // Draw the CMYK
        image(video.getConvertedCMYK(), getX(1), getY(3), 160, 120)

        // Draw the HSL
        image(video.getConvertedHSL(), getX(2), getY(3), 160, 120)

        // Draw threshold cmyk
        image(video.getThresholdCMYK(ui.colourSpace[1].objects[0].value(), ui.colourSpace[2].objects[0].value(), ui.colourSpace[3].objects[0].value()), getX(1), getY(4), 160, 120)

        // Draw threshold hsl
        image(video.getThresholdHSL(ui.colourSpace[0].objects[0].value()), getX(2), getY(4), 160, 120)

        // Add labels
        text("CMYK", getX(1), getY(4) - 12)
        text("HSL", getX(2), getY(4) - 12)

        text("Threshold", getX(1), getY(5) - 12)
        text("Threshold", getX(2), getY(5) - 12)
    }

    // Check if the face detection are enabled
    if (ui.toggles[1].objects[0].checked() && video.loaded) {
        // Detect the faces in the camera
        // The detector is heavily CPU based, so it will result in low FrameRate on most devices. 
        // Uncheck the Face Detection toggle to improve performance.
        let faces = detector.detect(video.camera.elt)

        // Save a copy of current camera image
        video.camera.loadPixels()
        let faceImg = video.getImgFromPixels(video.camera.pixels)

        // Prepare for filters
        faceImg.loadPixels()

        // Apply the face effects
        faces.forEach((face) => {
            if (face[4] > 4) {
                // Scale the values of the detector down to camera size
                face[0] = Math.floor(map(face[0], 0, video.originalWidth, 0, faceImg.width))
                face[1] = Math.floor(map(face[1], 0, video.originalHeight, 0, faceImg.height))
                face[2] = Math.floor(map(face[2], 0, video.originalWidth, 0, faceImg.width))
                face[3] = Math.floor(map(face[3], 0, video.originalHeight, 0, faceImg.height))

                // Create a new image for the face
                let edited = createImage(face[2], face[3])
                edited.loadPixels()

                // Copy the face pixels to the new image
                let i = 0
                for (let x = face[0]; x <= face[0] + face[2]; x++) {
                    let j = 0
                    for (let y = face[1]; y <= face[1] + face[3]; y++) {
                        let index = (y * faceImg.width + x) * 4
                        let editIndex = (j * edited.width + i) * 4
                        edited.pixels[editIndex] = faceImg.pixels[index]
                        edited.pixels[editIndex + 1] = faceImg.pixels[index + 1]
                        edited.pixels[editIndex + 2] = faceImg.pixels[index + 2]
                        edited.pixels[editIndex + 3] = faceImg.pixels[index + 3]
                        j++;
                    }
                    i++;
                }
                edited.updatePixels()

                // Apply the face effects
                switch (ui.faceEffects[0].objects[0].value()) {
                    case faceEffect.GRAYSCALE:
                        edited = video.getGrayscale(edited)
                        break
                    case faceEffect.BLUR:
                        edited = blurImage(edited)
                        break
                    case faceEffect.CONVERT_HSL:
                        edited = video.getConvertedHSL(edited)
                        break
                    case faceEffect.CONVERT_CMYK:
                        edited = video.getConvertedCMYK(edited)
                        break
                    case faceEffect.PIXELATE:
                        edited = video.getGrayscale(edited)
                        edited = pixelate(edited)
                        break
                    case faceEffect.FOCUS_FACE:
                        edited = focusImg(faceImg, face[0], face[1], face[2] * 2)
                        break
                }

                // Copy the edited face back to the original image
                if (ui.faceEffects[0].objects[0].value() != faceEffect.FOCUS_FACE) faceImg.copy(edited, 0, 0, face[2], face[3], face[0], face[1], face[2], face[3])
            }
        })

        // Draw the face image
        image(faceImg, getX(0), getY(4), 160, 120)
    }
}

function keyPressed(event) {
    // Change the face effect with the number keys
    if (event.key == 1) {
        ui.faceEffects[0].objects[0].elt.value = faceEffect.GRAYSCALE
    }
    else if (event.key == 2) {
        ui.faceEffects[0].objects[0].elt.value = faceEffect.BLUR
    }
    else if (event.key == 3) {
        ui.faceEffects[0].objects[0].elt.value = faceEffect.CONVERT_CMYK
    }
    else if (event.key == 4) {
        ui.faceEffects[0].objects[0].elt.value = faceEffect.CONVERT_HSL
    }
    else if (event.key == 5) {
        ui.faceEffects[0].objects[0].elt.value = faceEffect.PIXELATE
    }
    else if (event.key == 6) {
        ui.faceEffects[0].objects[0].elt.value = faceEffect.FOCUS_FACE
    }
}

/**
 * @brief This function returns the x value for the given index.
 * 
 * This function returns the x value for the given index.
 * 
 * @param {number} i The index to get the x value for.
 * 
 * @returns {number} The x value for the given index.
 * 
 * @example
 * getX(0)
 */
function getX(i) {
    return i * cameraSize.x
}

/**
 * @brief This function returns the y value for the given index.
 * 
 * This function returns the y value for the given index.
 * 
 * @param {number} i The index to get the y value for.
 * 
 * @returns {number} The y value for the given index.
 * 
 * @example
 * getY(0)
 */
function getY(i) {
    return i * cameraSize.y + i * 36
}

