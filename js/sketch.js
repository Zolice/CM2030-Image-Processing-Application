// Declare constant variables
const cameraSize = {x: 160, y: 120}

let canvas
let camera
let rgbSlider = []

/**
 * Setup all cameras
 */
function setupCamera() {
    // Create the Camera
    video = new Camera()
}

function setup() {
    // setup cameras
    setupCamera()

    // Create the canvas
    canvas = createCanvas(cameraSize.x * 3, cameraSize.y * 5)
    canvas.parent("display")

    background(125)

    // create 3 sliders
    rgbSlider.push(new Display("Red", 0, 255, "row1", createSlider(0, 255, 100)))
    rgbSlider.push(new Display("Green", 0, 255, "row1", createSlider(0, 255, 100)))
    rgbSlider.push(new Display("Blue", 0, 255, "row1", createSlider(0, 255, 100)))

}

function draw() {
    // draw a grey background
    background(125)

    // Check if camera loaded
    if (!video.loaded) return

    // Draw the cameras
    // draw the 2 webcam images
    image(video.getCamera(), getX(0), getY(0), 160, 120)
    image(video.getCamera(), getX(0), getY(3), 160, 120)

    
    loadPixels()
    // console.log("aa")
    // draw the grayscale img
    image(video.getGrayscale(), getX(1), getY(0), 160, 120)

    // draw rgb channel
    image(video.getRGB(), getX(0), getY(1), 480, 120)

    // draw the threshold img
    image(video.getThreshold(rgbSlider[0].object.value, rgbSlider[1].object.value, rgbSlider[2].object.value, ), getX(0), getY(2), 480, 120)
}

function getX(i) {
    // console.log(i)
    return i * cameraSize.x
}

function getY(i) {
    return i * cameraSize.y
}