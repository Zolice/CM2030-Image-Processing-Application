// Declare constant variables
const cameraSize = { x: 160, y: 120 }
const classifier = objectdetect.frontalface

var canvas
var cameraDisplay
var video
var sliders
var dropdowns
var checkboxes

var detector

var currentFaceEffect

// Enumerators
const faceEffect = {
    GRAYSCALE: 'grayscale',
    BLUR: 'blur',
    CONVERT_CMYK: 'convertCMYK',
    CONVERT_HSL: 'convertHSL',
    PIXELATE: 'pixelate'
}

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
        detector = new objectdetect.detector(video.originalWidth, video.originalHeight, 1.2, classifier);
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
            input.hide()
            if (file.type === "image") {
                console.log(file)

                // load img and extract pixels
                loadImage(file.data, (image) => {
                    image.resize(cameraSize.x, cameraSize.y)
                    image.loadPixels()
                    video.pixels = image.pixels
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
            else {
                alert("Please upload an image file")
            }
        })
        input.elt.click()
    })

    cameraDisplay.addObject(button)
}

function setup() {
    sliders = []
    dropdowns = []
    checkboxes = []
    currentFaceEffect = faceEffect.GRAYSCALE

    // setup cameras
    setupCamera()

    // Create the canvas
    canvas = createCanvas(cameraSize.x * 3, getY(6))
    canvas.parent("display")

    background(250)
    frameRate(30)

    // create 3 rgb sliders
    sliders.push(new Display("Red", 0, 255, "row2", [createSlider(0, 255, 100)]))
    sliders.push(new Display("Green", 0, 255, "row2", [createSlider(0, 255, 100)]))
    sliders.push(new Display("Blue", 0, 255, "row2", [createSlider(0, 255, 100)]))

    // create 2 colourspace conversion sliders
    sliders.push(new Display("HSL Lightness", 0, 255, "row3", [createSlider(0, 255, 100)]))
    sliders.push(new Display("CMYK Cyan", 0, 255, "row3", [createSlider(0, 255, 100)]))
    sliders.push(new Display("CMYK Magenta", 0, 255, "row3", [createSlider(0, 255, 100)]))
    sliders.push(new Display("CMYK Yellow", 0, 255, "row3", [createSlider(0, 255, 100)]))
    // sliders.push(new Display("CMYK", 0, 255, "row3", [createSlider(0, 255, 100)]))

    // create a checkbox to turn on/off the face detection and filters
    checkboxes.push(new Display("Face Effects", 0, 255, "row4", [createCheckbox("Face Effects", true)]))
    checkboxes.push(new Display("Face Detection", 0, 255, "row4", [createCheckbox("Face Detection", true)]))

    // create the dropdown for the face effects
    let dropdown = createSelect()
    dropdown.option("1-Grayscale", faceEffect.GRAYSCALE)
    dropdown.option("2-Blur", faceEffect.BLUR)
    dropdown.option("3-Convert to CMYK", faceEffect.CONVERT_CMYK)
    dropdown.option("4-Convert to HSL", faceEffect.CONVERT_HSL)
    dropdown.option("5-Pixelate", faceEffect.PIXELATE)

    dropdowns.push(new Display("Face Effects", 0, 255, "row4", [dropdown]))
}

function draw() {
    // draw a grey background
    background(250)

    // text settings
    textSize(24)
    fill(0)

    // Check if camera loaded
    if (!video.loaded && video.pixels.length <= 0) return

    if (checkboxes[0].objects[0].checked()) {
        // Draw the cameras
        // draw the 2 webcam images
        image(video.getImgFromPixels(), getX(0), getY(0), 160, 120)
        image(video.getImgFromPixels(), getX(0), getY(3), 160, 120)

        // add labels
        text("Original", getX(0), getY(1) - 12)
        text("Original", getX(0), getY(4) - 12)

        // loadPixels()
        // draw the grayscale img
        image(video.getGrayscale(), getX(1), getY(0), 160, 120)

        // draw rgb channel
        image(video.getRGB(), getX(0), getY(1), 480, 120)

        // draw the threshold img
        image(video.getThreshold(sliders[0].objects[0].value(), sliders[1].objects[0].value(), sliders[2].objects[0].value()), getX(0), getY(2), 480, 120)

        // add labels
        text("Grayscale", getX(1), getY(1) - 12)

        text("Red", getX(0), getY(2) - 12)
        text("Green", getX(1), getY(2) - 12)
        text("Blue", getX(2), getY(2) - 12)

        text("Threshold", getX(0), getY(3) - 12)
        text("Threshold", getX(1), getY(3) - 12)
        text("Threshold", getX(2), getY(3) - 12)

        // draw the CMYK
        image(video.getConvertedCMYK(), getX(1), getY(3), 160, 120)

        // draw the HSL
        image(video.getConvertedHSL(), getX(2), getY(3), 160, 120)

        // draw threshold cmyk
        image(video.getThresholdCMYK(sliders[4].objects[0].value(), sliders[5].objects[0].value(), sliders[6].objects[0].value()), getX(1), getY(4), 160, 120)

        // draw threshold hsl
        image(video.getThresholdHSL(sliders[3].objects[0].value()), getX(2), getY(4), 160, 120)

        // add labels
        text("CMYK", getX(1), getY(4) - 12)
        text("HSL", getX(2), getY(4) - 12)

        text("Threshold", getX(1), getY(5) - 12)
        text("Threshold", getX(2), getY(5) - 12)
    }

    // face detection
    if (checkboxes[1].objects[0].checked() && video.loaded) {
        let faces = detector.detect(video.camera.elt)
        let faceImg = video.getImgFromPixels()

        // image(faceImg, getX(2), getY(5))

        faceImg.loadPixels()
        // console.log("faceimg", faceImg.pixels[3])

        // console.log(video.camera.elt.height)

        // edit the faces 
        // console.log("faces.length", faces.length)
        faces.forEach((face) => {
            // console.log(face[4])
            if (face[4] > 4) {
                // scale the values of the detector down to camera size
                console.log("before", face[0], face[1], face[2], face[3])
                face[0] = Math.floor(map(face[0], 0, video.originalWidth, 0, faceImg.width))
                face[1] = Math.floor(map(face[1], 0, video.originalHeight, 0, faceImg.height))
                face[2] = Math.floor(map(face[2], 0, video.originalWidth, 0, faceImg.width))
                face[3] = Math.floor(map(face[3], 0, video.originalHeight, 0, faceImg.height))

                console.log("after", face[0], face[1], face[2], face[3])


                let edited = createImage(face[2], face[3])
                console.log(edited.width, edited.height)
                edited.loadPixels()
                // edited.copy(faceImg, face[0], face[1], face[2], face[3], 0, 0, face[2], face[3])

                // let i = 0
                // let j = 0

                // let counter = 0
                // for (let x = face[0]; x <= face[0] + face[2]; x++) {
                //     for (let y = face[1]; y <= face[1] + face[3]; y++) {
                //         let index = (y * faceImg.width + x) * 4
                //         let editIndex = (j * edited.width + i) * 4
                //         j++
                //         // edited.pixels[editIndex] = faceImg.pixels[index]
                //         edited.pixels[editIndex] = 255
                //         edited.pixels[editIndex + 1] = faceImg.pixels[index + 1]
                //         edited.pixels[editIndex + 2] = faceImg.pixels[index + 2]
                //         edited.pixels[editIndex + 3] = faceImg.pixels[index + 3]
                //         counter++
                //     }
                //     i++
                // }

                let i = 0;
                for (let x = face[0]; x <= face[0] + face[2]; x++) {
                    let j = 0;
                    for (let y = face[1]; y <= face[1] + face[3]; y++) {
                        let index = (y * faceImg.width + x) * 4;
                        let editIndex = (j * edited.width + i) * 4;
                        edited.pixels[editIndex] = faceImg.pixels[index]
                        edited.pixels[editIndex + 1] = faceImg.pixels[index + 1];
                        edited.pixels[editIndex + 2] = faceImg.pixels[index + 2];
                        edited.pixels[editIndex + 3] = faceImg.pixels[index + 3];
                        j++;
                    }
                    i++;
                }
                // console.log("counter", counter)

                edited.updatePixels()

                // image(edited, getX(1), getY(5))

                // console.log(edited)

                // switch (dropdowns[0].value()) {
                console.log(dropdowns[0])
                switch (dropdowns[0].objects[0].value()) {
                    case faceEffect.GRAYSCALE:
                        edited = video.getGrayscale(edited)
                        // console.log("edited")
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
                        break
                }

                // edited.updatePixels()

                // console.log("check alpha", edited.pixels[3])

                image(edited, getX(0), getY(5))

                faceImg.copy(edited, 0, 0, face[2], face[3], face[0], face[1], face[2], face[3])
                // faceImg.updatePixels()
                // console.log("copied over")
            }
        })

        // draw the face detection
        image(faceImg, getX(0), getY(4), 160, 120)
        // console.log(faceImg)
    }

    // performance checker
    console.log("Frame Rate", frameRate())
}

function keyPressed(event) {
    if (event.key == 1){
        // set fitler to 1
        dropdowns[0].objects[0].elt.value = faceEffect.GRAYSCALE
    }
    else if (event.key == 2){
        // set fitler to 2
        dropdowns[0].objects[0].elt.value = faceEffect.BLUR
    }
    else if (event.key == 3){
        // set fitler to 3
        dropdowns[0].objects[0].elt.value = faceEffect.CONVERT_CMYK
    }
    else if (event.key == 4){
        // set fitler to 4
        dropdowns[0].objects[0].elt.value = faceEffect.CONVERT_HSL
    }
    else if (event.key == 5){
        // set fitler to 5
        dropdowns[0].objects[0].elt.value = faceEffect.PIXELATE
    }
}

function getX(i) {
    // console.log(i)
    return i * cameraSize.x
}

function getY(i) {
    return i * cameraSize.y + i * 36
}

function blurImage(image) {
    if (!image) return null

    let m = [];
    let size = 2
    for (let i = 0; i < size; i++) {
        let n = [];
        for (let j = 0; j < size; j++) {
            n.push(1 / (size * size));
        }
        m.push(n);
    }

    image.loadPixels();

    for (var x = 0; x < image.width; x++) {
        for (var y = 0; y < image.height; y++) {
            var pixelIndex = ((image.width * y) + x) * 4;
            var r = image.pixels[pixelIndex + 0];
            //calculate the convolution value for that pixel
            var c = convolution(x, y, m, image);
            //update each pixel with new RGB value
            image.pixels[pixelIndex + 0] = c[0];
            image.pixels[pixelIndex + 1] = c[1];
            image.pixels[pixelIndex + 2] = c[2];
        }
    }

    image.updatePixels();
    return image
}

function convolution(x, y, matrix, img) {
    var matrixSize = matrix.length;
    var totalRed = 0.0;
    var totalGreen = 0.0;
    var totalBlue = 0.0;
    var offset = floor(matrixSize / 2);

    // convolution matrix loop
    for (var i = 0; i < matrixSize; i++) {
        for (var j = 0; j < matrixSize; j++) {
            // Get pixel loc within convolution matrix
            var xloc = x + i - offset;
            var yloc = y + j - offset;

            // ensure we don't address a pixel that doesn't exist
            if (xloc < 0 || xloc >= img.width || yloc < 0 || yloc >= img.height) {
                continue;
            }

            var index = (xloc + img.width * yloc) * 4;

            // multiply all values with the mask and sum up
            totalRed += img.pixels[index + 0] * matrix[i][j];
            totalGreen += img.pixels[index + 1] * matrix[i][j];
            totalBlue += img.pixels[index + 2] * matrix[i][j];
        }
    }
    // return the new color as an array
    return [totalRed, totalGreen, totalBlue];
}