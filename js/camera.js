/**
 * @file camera.js
 * @brief This file contains the Camera class which is responsible for capturing and processing images from the camera.
 * 
 * The Camera class is responsible for capturing and processing images from the camera. It contains the following methods:
 * - loadPixels: This method loads the pixels from the camera.
 * - getImgFromPixels: This method creates an image from the pixels.
 * - getCamera: This method returns the camera element.
 * - getGrayscale: This method returns the grayscale image.
 * - getRGB: This method returns the RGB image.
 * - getThreshold: This method returns the thresholded image.
 * - getConvertedCMYK: This method returns the CMYK image.
 * - getConvertedHSL: This method returns the HSL image.
 * - getThresholdCMYK: This method returns the thresholded CMYK image.
 * - getThresholdHSL: This method returns the thresholded HSL image.
 * 
 * The Camera class also contains the following properties:
 * - camera: This property contains the camera element.
 * - pixels: This property contains the pixels from the camera.
 * - rgb: This property contains the RGB image.
 * - convertCMYK: This property contains the CMYK image.
 * - convertHSL: This property contains the HSL image.
 * 
 * The Camera class is used by the main script to capture and process images from the camera.
 * 
 * @example
 * var camera = new Camera()
 */
class Camera {
    /**
     * @brief The constructor for the Camera class.
     * 
     * The constructor for the Camera class initializes
     * the properties for the camera element and the pixels
     * from the camera.
     * 
     * @param {string} parent The parent element to add the camera to.
     * @param {function} callback The callback function to call when the camera is loaded.
     * 
     * @example
     * var camera = new Camera()
     */
    constructor(parent, callback = null) {
        // Setup variables
        this.loaded = false
        this.pixels = []
        this.rgb = null
        this.convertCMYK = null
        this.convertHSL = null

        // Setup camera
        this.camera = createCapture(VIDEO, () => {
            console.log("Camera Loaded!")

            // Save the original size
            this.originalHeight = this.camera.height
            this.originalWidth = this.camera.width

            // Setup Camera Settings
            this.loaded = true
            this.camera.size(cameraSize.x, cameraSize.y)
            if (parent) {
                this.camera.parent(parent)
            }
            else {
                this.camera.hide()
            }

            // Call the callback function
            if (callback) callback()
        })
    }

    /**
     * @brief This method loads the pixels from the camera.
     * 
     * This method loads the pixels from the camera and returns
     * the pixels if they have been loaded.
     * 
     * @returns {array} The pixels from the camera.
     * 
     * @example
     * var pixels = camera.loadPixels()
     */
    loadPixels() {
        if (!this.loaded && this.pixels.length <= 0) return null
        if (this.pixels.length <= 1) {
            this.camera.loadPixels()
            return this.camera.pixels
        }
        else {
            return this.pixels
        }
    }

    /**
     * @brief This method creates an image from the pixels.
     * 
     * This method creates an image from the pixels and returns
     * the image if the pixels have been loaded.
     * 
     * @param {array} pixels The pixels to create the image from.
     * 
     * @returns {p5.Image} The image created from the pixels.
     * 
     * @example
     * var img = camera.getImgFromPixels()
     */
    getImgFromPixels(pixels = this.loadPixels()) {
        // Create an image from the pixels
        let img = createImage(cameraSize.x, cameraSize.y)
        img.loadPixels()

        // Copy the pixels over
        for (let i = 0; i < pixels.length; i++) {
            img.pixels[i] = pixels[i]
        }

        // Return the image
        img.updatePixels()
        return img
    }

    /**
     * @brief This method returns the camera element.
     * 
     * This method returns the camera element if the camera
     * has been loaded.
     * 
     * @returns {p5.Element} The camera element.
     * 
     * @example
     * var cameraElement = camera.getCamera()
     */
    getCamera() {
        if (!this.loaded && this.pixels.length <= 0) return null
        return this.camera
    }

    /**
     * @brief This method returns the grayscale image.
     * 
     * This method returns the grayscale image if the camera
     * has been loaded.
     * 
     * @param {p5.Image} original The original image to convert to grayscale.
     * 
     * @returns {p5.Image} The grayscale image.
     * 
     * @example
     * var grayscale = camera.getGrayscale()
     */
    getGrayscale(original = this.getImgFromPixels()) {
        if (!original) return

        // Create an image to work on
        let grayscale = createImage(original.width, original.height)
        grayscale.loadPixels()

        // Convert the image to grayscale
        for (let i = 0; i < grayscale.width * grayscale.height; i++) {
            let index = i * 4
            let r = original.pixels[index]
            let g = original.pixels[index + 1]
            let b = original.pixels[index + 2]
            let a = original.pixels[index + 3]

            let gray = (r + g + b) / 3

            grayscale.pixels[index] = min(gray * 1.2, 255)
            grayscale.pixels[index + 1] = min(gray * 1.2, 255)
            grayscale.pixels[index + 2] = min(gray * 1.2, 255)
            grayscale.pixels[index + 3] = a
        }

        // Update the pixels and return the image
        grayscale.updatePixels()
        return grayscale
    }

    /**
     * @brief This method returns the RGB image.
     * 
     * This method returns the RGB image if the camera
     * has been loaded.
     * 
     * @param {p5.Image} original The original image to convert to RGB.
     * 
     * @returns {p5.Image} The RGB image.
     * 
     * @example
     * var rgb = camera.getRGB()
     */
    getRGB(original = this.getImgFromPixels()) {
        if (!this.loaded && this.pixels.length <= 0) return null

        // load the image 
        let img = createImage(original.width * 3, original.height)

        // Copy 3 times for all 3 channels
        img.copy(original, 0, 0, original.width, original.height, 0, 0, original.width, original.height)
        img.copy(original, 0, 0, original.width, original.height, getX(1), 0, original.width, original.height)
        img.copy(original, 0, 0, original.width, original.height, getX(2), 0, original.width, original.height)

        img.loadPixels()

        // Apply the RGB filter
        for (let x = 0; x < img.width; x++) {
            for (let y = 0; y < img.height; y++) {
                let index = (x + y * img.width) * 4
                let r = img.pixels[index]
                let g = img.pixels[index + 1]
                let b = img.pixels[index + 2]
                let a = img.pixels[index + 3];

                // Red Filter
                (x < cameraSize.x) ? img.pixels[index] = r : img.pixels[index] = 0;

                // Green Filter
                (x >= cameraSize.x && x <= cameraSize.x * 2) ? img.pixels[index + 1] = g : img.pixels[index + 1] = 0;

                // Blue Filter
                (x >= cameraSize.x * 2) ? img.pixels[index + 2] = b : img.pixels[index + 2] = 0;

                img.pixels[index + 3] = a
            }
        }

        // Update the pixels and return the image
        img.updatePixels()
        this.rgb = img
        return img
    }

    /**
     * @brief This method returns the thresholded image.
     * 
     * This method returns the thresholded image if the camera
     * has been loaded.
     * 
     * @param {number} red The red threshold value.
     * @param {number} green The green threshold value.
     * @param {number} blue The blue threshold value.
     * 
     * @returns {p5.Image} The thresholded image.
     * 
     * @example
     * var threshold = camera.getThreshold(100, 100, 100)
     */
    getThreshold(red, green, blue) {
        if (!this.loaded && this.pixels.length <= 0) return null
        if (!this.rgb) return null

        // load the image
        this.rgb.loadPixels()
        let img = createImage(this.rgb.width, this.rgb.height)
        img.copy(this.rgb, 0, 0, this.rgb.width, this.rgb.height, 0, 0, this.rgb.width, this.rgb.height)
        img.loadPixels()

        // Apply the threshold filter
        for (let x = 0; x < img.width; x++) {
            for (let y = 0; y < img.height; y++) {
                let index = (x + y * img.width) * 4
                let r = img.pixels[index]
                let g = img.pixels[index + 1]
                let b = img.pixels[index + 2]
                let a = img.pixels[index + 3]

                // Red Filter
                if (x < cameraSize.x) {
                    img.pixels[index] = r > red ? 255 : 0
                    img.pixels[index + 1] = r > red ? 255 : 0
                    img.pixels[index + 2] = r > red ? 255 : 0
                }
                // Green Filter
                else if (x >= cameraSize.x && x <= cameraSize.x * 2) {
                    img.pixels[index] = g > green ? 255 : 0
                    img.pixels[index + 1] = g > green ? 255 : 0
                    img.pixels[index + 2] = g > green ? 255 : 0
                }
                // Blue Filter
                else if (x >= cameraSize.x * 2) {
                    img.pixels[index] = b > blue ? 255 : 0
                    img.pixels[index + 2] = b > blue ? 255 : 0
                    img.pixels[index + 1] = b > blue ? 255 : 0
                }

                img.pixels[index + 3] = a
            }
        }

        // Update the pixels and return the image
        img.updatePixels()
        return img
    }

    /**
     * @brief This method returns the CMYK image.
     * 
     * This method returns the CMYK image if the camera
     * has been loaded.
     * 
     * @param {p5.Image} original The original image to convert to CMYK.
     * 
     * @returns {p5.Image} The CMYK image.
     * 
     * @example
     * var cmyk = camera.getConvertedCMYK()
     */
    getConvertedCMYK(original = this.getImgFromPixels()) {
        if (!this.loaded && this.pixels.length <= 0) return null

        // load the image
        original.loadPixels()

        // Apply the CMYK filter
        for (let x = 0; x < original.width; x++) {
            for (let y = 0; y < original.height; y++) {
                let index = (x + y * original.width) * 4
                let r = original.pixels[index]
                let g = original.pixels[index + 1]
                let b = original.pixels[index + 2]
                let a = original.pixels[index + 3]

                let c = 1 - r / 255
                let m = 1 - g / 255
                let yellow = 1 - b / 255
                let k = min(c, m, yellow)

                original.pixels[index] = (c - k) / (1 - k) * 255
                original.pixels[index + 1] = (m - k) / (1 - k) * 255
                original.pixels[index + 2] = (yellow - k) / (1 - k) * 255
                original.pixels[index + 3] = a
            }
        }

        // Update the pixels and return the image
        original.updatePixels()
        this.convertCMYK = original
        return original
    }

    /**
     * @brief This method returns the HSL image.
     * 
     * This method returns the HSL image if the camera
     * has been loaded.
     * 
     * @param {p5.Image} original The original image to convert to HSL.
     * 
     * @returns {p5.Image} The HSL image.
     * 
     * @example
     * var hsl = camera.getConvertedHSL()
     */
    getConvertedHSL(original = this.getImgFromPixels()) {
        if (!this.loaded && this.pixels.length <= 0) return null

        // load the image
        original.loadPixels()

        // Apply the HSL filter
        for (let x = 0; x < original.width; x++) {
            for (let y = 0; y < original.height; y++) {
                let index = (x + y * original.width) * 4
                let r = original.pixels[index]
                let g = original.pixels[index + 1]
                let b = original.pixels[index + 2]
                let a = original.pixels[index + 3]

                // Convert to HSL
                let h = 0
                let s = 0
                let l = 0

                let maximum = max(r, g, b)
                let minimum = min(r, g, b)

                l = (maximum + minimum) / 2

                if (maximum == minimum) {
                    h = 0
                    s = 0
                }
                else {
                    let d = maximum - minimum
                    s = l > 0.5 ? d / (2 - maximum - minimum) : d / (maximum + minimum)

                    if (maximum == r) {
                        h = (g - b) / d + (g < b ? 6 : 0)
                    }
                    else if (maximum == g) {
                        h = (b - r) / d + 2
                    }
                    else {
                        h = (r - g) / d + 4
                    }

                    h /= 6
                }

                original.pixels[index] = h * 255
                original.pixels[index + 1] = s * 255
                original.pixels[index + 2] = l
                original.pixels[index + 3] = a
            }
        }

        // Update the pixels and return the image
        original.updatePixels()
        this.convertHSL = original
        return original
    }

    /**
     * @brief This method returns the thresholded CMYK image.
     * 
     * This method returns the thresholded CMYK image if the camera
     * has been loaded.
     * 
     * @param {number} thresholdC The threshold value for C.
     * @param {number} thresholdM The threshold value for M.
     * @param {number} thresholdY The threshold value for Y.
     * @param {p5.Image} original The original image to threshold.
     * 
     * @returns {p5.Image} The thresholded CMYK image.
     * 
     * @example
     * var thresholdCMYK = camera.getThresholdCMYK(100, 100, 100)
     */
    getThresholdCMYK(thresholdC, thresholdM, thresholdY, original = this.convertCMYK) {
        if (!this.loaded && this.pixels.length <= 0) return null
        if (!original) return null

        // Load the image
        original.loadPixels()

        // Apply the CMYK Threshold
        for (let x = 0; x < original.width; x++) {
            for (let y = 0; y < original.height; y++) {
                let index = (x + y * original.width) * 4
                let c = original.pixels[index]
                let m = original.pixels[index + 1]
                let yellow = original.pixels[index + 2]
                let a = original.pixels[index + 3]

                // check all 3 conditions
                let final = 0
                if (c >= thresholdC && m >= thresholdM && yellow >= thresholdY) final = 255

                original.pixels[index] = final
                original.pixels[index + 1] = final
                original.pixels[index + 2] = final
                original.pixels[index + 3] = a
            }
        }

        // Update the pixels and return the image
        original.updatePixels()
        return original
    }

    /**
     * @brief This method returns the thresholded HSL image.
     * 
     * This method returns the thresholded HSL image if the camera
     * has been loaded.
     * 
     * @param {number} threshold The threshold value for L.
     * @param {p5.Image} original The original image to threshold.
     * 
     * @returns {p5.Image} The thresholded HSL image.
     * 
     * @example
     * var thresholdHSL = camera.getThresholdHSL(100)
     */
    getThresholdHSL(threshold, original = this.convertHSL) {
        if (!this.loaded && this.pixels.length <= 0) return null
        if (!original) return null

        // Load Image
        original.loadPixels()

        // Apply the HSL Threshold
        for (let x = 0; x < original.width; x++) {
            for (let y = 0; y < original.height; y++) {
                let index = (x + y * original.width) * 4
                let l = original.pixels[index + 2]
                let a = original.pixels[index + 3]

                original.pixels[index] = threshold > l ? 255 : 0
                original.pixels[index + 1] = threshold > l ? 255 : 0
                original.pixels[index + 2] = threshold > l ? 255 : 0
                original.pixels[index + 3] = a
            }
        }

        // Update the pixels and return the image
        original.updatePixels()
        return original
    }
}