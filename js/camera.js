class Camera {
    constructor() {
        this.loaded = false

        this.camera = createCapture(VIDEO, () => {
            this.loaded = true
            this.camera.size(cameraSize.x, cameraSize.y)
            // this.camera.hide()
        })
    }

    getImage() {
        if (!this.loaded) return null
        // this.camera.loadPixels()
        // return this.camera.pixels
    }

    getCamera() {
        if (!this.loaded) return null
        return this.camera
    }

    getGrayscale() {
        if (!this.loaded) return null
        this.camera.loadPixels()
        let img = createImage(this.camera.width, this.camera.height)
        // load the image 
        img.copy(this.camera, 0, 0, this.camera.width, this.camera.height, 0, 0, this.camera.width, this.camera.height)
        img.loadPixels()

        // console.log(this.camera.pixels.length)
        let grayscale = createImage(cameraSize.x, cameraSize.y)
        grayscale.loadPixels()

        for (let i = 0; i < cameraSize.x * cameraSize.y; i++) {
            let index = i * 4
            let r = img.pixels[index]
            let g = img.pixels[index + 1]
            let b = img.pixels[index + 2]
            let a = img.pixels[index + 3]

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

    getRGB() {
        if (!this.loaded) return null
        this.camera.loadPixels()
        let img = createImage(this.camera.width * 3, this.camera.height)
        // load the image 
        // copy 3 times for all 3 channels
        img.copy(this.camera, 0, 0, this.camera.width, this.camera.height, 0, 0, this.camera.width, this.camera.height)
        img.copy(this.camera, 0, 0, this.camera.width, this.camera.height, getX(1), 0, this.camera.width, this.camera.height)
        img.copy(this.camera, 0, 0, this.camera.width, this.camera.height, getX(2), 0, this.camera.width, this.camera.height)

        img.loadPixels()

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

        // img.updatePixels()
        // image(img, getX(0), getY(2))

        img.updatePixels()
        this.rgb = img
        return img
    }

    getThreshold(red, green, blue) {
        if (!this.loaded) return null

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
                
                if(x < cameraSize.x) {
                    img.pixels[index] = r > red ? 255 : 0
                }
                if(x >= cameraSize.x && x <= cameraSize.x * 2) {
                    img.pixels[index + 1] = g > green ? 255 : 0
                }
                if(x >= cameraSize.x * 2) {
                    img.pixels[index + 2] = b > blue ? 255 : 0
                }
                img.pixels[index + 3] = a


            }
        }
        img.updatePixels()
        return img
    }
}