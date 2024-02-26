class Camera {
    constructor(parent, callback = null) {
        this.loaded = false
        console.log("aa")

        this.camera = createCapture(VIDEO, () => {
            console.log("aab")
            this.loaded = true
            this.camera.size(cameraSize.x, cameraSize.y)
            if (parent) {
                this.camera.parent(parent)
            }
            else {
                this.camera.hide()
            }
            if (callback) callback()
            // this.camera.hide()
        })

        this.pixels = []
        this.rgb = null
        this.convertCMYK = null
        this.convertHSL = null
    }

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

    getImgFromPixels(pixels = this.loadPixels()) {
        let img = createImage(cameraSize.x, cameraSize.y);
        img.loadPixels();
        for (let i = 0; i < pixels.length; i++) {
            img.pixels[i] = pixels[i];
        }
        img.updatePixels();
        return img;
    }

    getCamera() {
        if (!this.loaded && this.pixels.length <= 0) return null
        return this.camera
    }

    getGrayscale(original = this.getImgFromPixels()) {
        if (!this.loaded && this.pixels.length <= 0) return null
        // let original = this.getImgFromPixels()

        // console.log(this.camera.pixels.length)
        let grayscale = createImage(original.width, original.height)
        grayscale.loadPixels()

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

        // img.updatePixels()
        // image(img, getX(1), getY(1))

        grayscale.updatePixels()
        return grayscale
    }

    getRGB(original = this.getImgFromPixels()) {
        if (!this.loaded && this.pixels.length <= 0) return null
        // let original = this.loadPixels()
        // let original = this.getImgFromPixels()
        let img = createImage(original.width * 3, original.height)
        // console.log(img)
        // load the image 
        // copy 3 times for all 3 channels

        img.copy(original, 0, 0, original.width, original.height, 0, 0, original.width, original.height)
        img.copy(original, 0, 0, original.width, original.height, getX(1), 0, original.width, original.height)
        img.copy(original, 0, 0, original.width, original.height, getX(2), 0, original.width, original.height)

        // img.set(0,0, original)
        // img.set(getX(1), 0, original)
        // img.set(getX(2), 0, original)
        img.loadPixels()

        // let diff = 0 // difference between original's x and the img's x
        // // console.log(img.pixels.length)
        // for (let x = 0; x < cameraSize.x; x++) {
        //     for (let y = 0; y < cameraSize.y; y++) {
        //         let index = (x + y * img.width)*4
        //         // img.pixels[index] = original[index - diff]
        //         // img.pixels[index + 1] = original[index - diff + 1]
        //         // img.pixels[index + 2] = original[index - diff + 2]
        //         // img.pixels[index + 3] = original[index + 3 - diff]
        //         let r = original.pixels[index]
        //         let g = original.pixels[index + 1]
        //         let b = original.pixels[index + 2]
        //         let a = original.pixels[index + 3]

        //         img.set(x + diff, y, [r, g, b, a])
        //     }
        // }
        // console.log(img.pixels.length)

        // diff = getX(1)
        // for (let x = 0; x < img.width; x++) {
        //     for (let y = 0; y < img.height; y++) {
        //         let index = (x + y * img.width) * 4
        //         img.pixels[index + 1] = original[index - diff + 1]
        //     }
        // }

        for (let x = 0; x < img.width; x++) {
            for (let y = 0; y < img.height; y++) {
                let index = (x + y * img.width) * 4
                let r = img.pixels[index]
                let g = img.pixels[index + 1]
                let b = img.pixels[index + 2]
                let a = img.pixels[index + 3];

                (x < cameraSize.x) ? img.pixels[index] = r : img.pixels[index] = 0;
                (x >= cameraSize.x && x <= cameraSize.x * 2) ? img.pixels[index + 1] = g : img.pixels[index + 1] = 0;
                (x >= cameraSize.x * 2) ? img.pixels[index + 2] = b : img.pixels[index + 2] = 0;
                img.pixels[index + 3] = a
            }
        }

        img.updatePixels()
        this.rgb = img
        return img
    }

    getThreshold(red, green, blue) {
        if (!this.loaded && this.pixels.length <= 0) return null

        if (!this.rgb) return null

        // directly apply threshold
        this.rgb.loadPixels()
        let img = createImage(this.rgb.width, this.rgb.height)
        img.copy(this.rgb, 0, 0, this.rgb.width, this.rgb.height, 0, 0, this.rgb.width, this.rgb.height)
        img.loadPixels()

        for (let x = 0; x < img.width; x++) {
            for (let y = 0; y < img.height; y++) {
                let index = (x + y * img.width) * 4
                let r = img.pixels[index]
                let g = img.pixels[index + 1]
                let b = img.pixels[index + 2]
                let a = img.pixels[index + 3]

                if (x < cameraSize.x) {
                    img.pixels[index] = r > red ? 255 : 0
                    img.pixels[index + 1] = r > red ? 255 : 0
                    img.pixels[index + 2] = r > red ? 255 : 0
                }
                if (x >= cameraSize.x && x <= cameraSize.x * 2) {
                    img.pixels[index] = g > green ? 255 : 0
                    img.pixels[index + 1] = g > green ? 255 : 0
                    img.pixels[index + 2] = g > green ? 255 : 0
                }
                if (x >= cameraSize.x * 2) {
                    img.pixels[index] = b > blue ? 255 : 0
                    img.pixels[index + 2] = b > blue ? 255 : 0
                    img.pixels[index + 1] = b > blue ? 255 : 0
                }
                img.pixels[index + 3] = a
            }
        }
        img.updatePixels()
        return img
    }

    getConvertedCMYK(original = this.getImgFromPixels()) {
        if (!this.loaded && this.pixels.length <= 0) return null
        // get the original
        // let original = this.getImgFromPixels()

        // directly edit the original
        original.loadPixels()

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

        original.updatePixels()

        // save the img as this.convertCMYK
        this.convertCMYK = original
        return original
    }

    getConvertedHSL(original = this.getImgFromPixels()) {
        if (!this.loaded && this.pixels.length <= 0) return null
        // get the original
        // let original = this.getImgFromPixels()

        // directly edit the original
        original.loadPixels()

        for (let x = 0; x < original.width; x++) {
            for (let y = 0; y < original.height; y++) {
                let index = (x + y * original.width) * 4
                let r = original.pixels[index]
                let g = original.pixels[index + 1]
                let b = original.pixels[index + 2]
                let a = original.pixels[index + 3]

                // convert to HSL
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
                original.pixels[index + 2] = l * 255
                original.pixels[index + 3] = a
            }
        }

        original.updatePixels()

        // save the img as this.convertHSL
        this.convertHSL = original
        return original
    }

    getThresholdCMYK(threshold, original = this.convertCMYK) {
        if (!this.loaded && this.pixels.length <= 0) return null
        if (!original) return null

        // apply threshold
        original.loadPixels()
        for (let x = 0; x < original.width; x++) {
            for (let y = 0; y < original.height; y++) {
                let index = (x + y * original.width) * 4
                let c = original.pixels[index]
                let m = original.pixels[index + 1]
                let yellow = original.pixels[index + 2]
                let a = original.pixels[index + 3]

                let avg = (c + m + yellow) / 3
                original.pixels[index] = avg > threshold ? 255 : 0
                original.pixels[index + 1] = avg > threshold ? 255 : 0
                original.pixels[index + 2] = avg > threshold ? 255 : 0
                original.pixels[index + 3] = a
            }
        }

        original.updatePixels()
        return original
    }

    getThresholdHSL(threshold, original = this.convertHSL) {
        if(!this.loaded && this.pixels.length <= 0) return null
        if(!original) return null

        // apply threshold
        original.loadPixels()
        for (let x = 0; x < original.width; x++) {
            for (let y = 0; y < original.height; y++) {
                let index = (x + y * original.width) * 4
                let h = original.pixels[index]
                let s = original.pixels[index + 1]
                let l = original.pixels[index + 2]
                let a = original.pixels[index + 3]

                let avg = (h + s + l) / 3

                original.pixels[index] =  threshold > avg ? 255 : 0
                original.pixels[index + 1] = threshold > avg? 255 : 0
                original.pixels[index + 2] = threshold > avg? 255 : 0
                original.pixels[index + 3] = a
            }
        }

        original.updatePixels()
        return original
    }
}