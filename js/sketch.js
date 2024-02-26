// Declare constant variables
const cameraSize = { x: 160, y: 120 }

let canvas
let cameraDisplay
let video
let rgbSlider = []

/**
 * Setup all cameras
 */
function setupCamera() {
    // Create a display to show the 
    cameraDisplay = new Display("Camera", 120, 160, "row1")

    // Create the Camera
    video = new Camera(cameraDisplay.body, () => {
        // Add the camera to the display objects manually
        cameraDisplay.objects.push(video.camera)
        
    })

    
        // Add the other objects
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
        cameraDisplay.addObject(button)

        // another button to upload picture
        button = createButton("Select Picture")
        button.mousePressed(() => {
            // upload the picture
            let input = createFileInput((file) => {
                if (file.type === "image") {
                    console.log(file)

                    // load img and extract pixels
                    loadImage(file.data, (image) => {
                        image.resize(cameraSize.x, cameraSize.y)
                        image.loadPixels()
                        video.pixels = image.pixels
                        console.log("call")
                        console.log(video.pixels.length)
                    })

                    // image(file, 0, 0, 160, 120)

                    // // load the pixels into video.pixels[]
                    // canvas.loadPixels()

                    // // create an image object 
                    // let img = createImage(160, 120)
                    // img.copy(canvas, 0, 0, 160, 120, 0, 0, 160, 120)

                    // // extract into video.pixels
                    // img.loadPixels()
                    // video.pixels = img.pixels                   
                }
            })
            input.elt.click()
        })

        cameraDisplay.addObject(button)
}

function setup() {
    // setup cameras
    setupCamera()

    // Create the canvas
    canvas = createCanvas(cameraSize.x * 3, cameraSize.y * 5)
    canvas.parent("display")

    background(250)
    frameRate(30)

    // create 3 sliders
    rgbSlider.push(new Display("Red", 0, 255, "row2", [createSlider(0, 255, 100)]))
    rgbSlider.push(new Display("Green", 0, 255, "row2", [createSlider(0, 255, 100)]))
    rgbSlider.push(new Display("Blue", 0, 255, "row2", [createSlider(0, 255, 100)]))

}

function draw() {
    // draw a grey background
    background(250)

    // Check if camera loaded
    if (!video.loaded && video.pixels.length <= 0) return

    // Draw the cameras
    // draw the 2 webcam images
    image(video.getImgFromPixels(), getX(0), getY(0), 160, 120)
    image(video.getImgFromPixels(), getX(0), getY(3), 160, 120)


    loadPixels()
    // console.log("aa")
    // draw the grayscale img
    image(video.getGrayscale(), getX(1), getY(0), 160, 120)

    // image(video.getImgFromPixels(), getX(2), getY(0), 160, 120)

    // draw rgb channel
    image(video.getRGB(), getX(0), getY(1), 480, 120)

    // draw the threshold img
    image(video.getThreshold(rgbSlider[0].objects[0].value(), rgbSlider[1].objects[0].value(), rgbSlider[2].objects[0].value()), getX(0), getY(2), 480, 120)

    // draw the CMYK
    image(video.getConvertedCMYK(), getX(1), getY(3), 160, 120)

    // draw the HSL
    image(video.getConvertedHSL(), getX(2), getY(3), 160, 120)
}

function getX(i) {
    // console.log(i)
    return i * cameraSize.x
}

function getY(i) {
    return i * cameraSize.y
}