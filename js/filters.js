/**
 * @brief This method blurs the image. 
 * 
 * This method blurs the image by applying a convolution matrix to the image.
 * 
 * @param {p5.Image} img The image to be filtered.
 * 
 * @return {p5.Image} The filtered image.
 * 
 * @example
 * blurImage(image)
 */
function blurImage(image) {
    if (!image) return null

    // Create a 3x3 matrix with all values equal to 1/9
    let m = []
    let size = 2
    for (let i = 0; i < size; i++) {
        let n = []
        for (let j = 0; j < size; j++) {
            n.push(1 / (size * size))
        }
        m.push(n)
    }

    // Apply the convolution matrix to the image
    image.loadPixels()

    for (let x = 0; x < image.width; x++) {
        for (let y = 0; y < image.height; y++) {
            let pixelIndex = ((image.width * y) + x) * 4
            let r = image.pixels[pixelIndex + 0]
            //calculate the convolution value for that pixel
            let c = convolution(x, y, m, image)
            //update each pixel with new RGB value
            image.pixels[pixelIndex + 0] = c[0]
            image.pixels[pixelIndex + 1] = c[1]
            image.pixels[pixelIndex + 2] = c[2]
        }
    }

    // Update the pixels and return the image
    image.updatePixels()
    return image
}

/**
 * @brief This method applies the convolution matrix to the image. 
 * 
 * This method applies the convolution matrix to the image to create a new image.
 * 
 * @param {number} x The x coordinate of the pixel.
 * @param {number} y The y coordinate of the pixel.
 * @param {array} matrix The convolution matrix.
 * @param {p5.Image} img The image to be filtered.
 * 
 * @return {array} The new RGB value of the pixel.
 * 
 * @example
 * convolution(x, y, matrix, img)
 */
function convolution(x, y, matrix, img) {
    let matrixSize = matrix.length
    let totalRed = 0.0
    let totalGreen = 0.0
    let totalBlue = 0.0
    let offset = floor(matrixSize / 2)

    // Loop through each pixel in the convolution matrix
    for (let i = 0; i < matrixSize; i++) {
        for (let j = 0; j < matrixSize; j++) {
            // Get pixel loc within convolution matrix
            let xloc = x + i - offset
            let yloc = y + j - offset

            // ensure we don't address a pixel that doesn't exist
            if (xloc < 0 || xloc >= img.width || yloc < 0 || yloc >= img.height) {
                continue
            }

            let index = (xloc + img.width * yloc) * 4

            // Calculate the convolution
            totalRed += img.pixels[index + 0] * matrix[i][j]
            totalGreen += img.pixels[index + 1] * matrix[i][j]
            totalBlue += img.pixels[index + 2] * matrix[i][j]
        }
    }
    // Return the new color
    return [totalRed, totalGreen, totalBlue]
}

/**
 *  @brief This method pixelates the image.
 * 
 * This method pixelates the image by painting each block with the average RGB value of that block.
 * 
 * @param {p5.Image} img The image to be filtered.
 * @param {number} pixelatedSize The size of the block to be pixelated.
 * 
 * @return {p5.Image} The filtered image.
 * 
 * @example
 * filterImage(img)
 */
function pixelate(img, pixelatedSize = 5) {
    img.loadPixels()

    //process block by block
    for (let y = 0; y < img.height; y += pixelatedSize) {
        for (let x = 0; x < img.width; x += pixelatedSize) {

            let sumRed = 0
            let sumGreen = 0
            let sumBlue = 0

            //get the sum of RGB of that block
            for (let i = 0; i < pixelatedSize; i++) {
                for (let j = 0; j < pixelatedSize; j++) {
                    let pixelIndex = ((img.width * (y + j)) + (x + i)) * 4
                    let pixelRed = img.pixels[pixelIndex + 0]
                    let pixelGreen = img.pixels[pixelIndex + 1]
                    let pixelBlue = img.pixels[pixelIndex + 2]
                    sumRed += pixelRed
                    sumGreen += pixelGreen
                    sumBlue += pixelBlue
                }
            }
            //calcualte the ave of RGB of that block
            let aveRed = sumRed / (pixelatedSize * pixelatedSize)
            let aveGreen = sumGreen / (pixelatedSize * pixelatedSize)
            let aveBlue = sumBlue / (pixelatedSize * pixelatedSize)

            //paint the block with the ave RGB value
            for (let i = 0; i < pixelatedSize; i++) {
                for (let j = 0; j < pixelatedSize; j++) {
                    let pixelIndex = ((img.width * (y + j)) + (x + i)) * 4
                    img.pixels[pixelIndex + 0] = aveRed
                    img.pixels[pixelIndex + 1] = aveGreen
                    img.pixels[pixelIndex + 2] = aveBlue
                }
            }
        }
    }
    img.updatePixels();

    return img
}

/**
 * @brief **Project Extension** This method adds a glow effect to the image.
 * 
 * **Project Extension** This method adds a glow effect to the image by increasing the brightness of the pixels.
 * 
 * @param {p5.Image} img The image to be filtered.
 * 
 * @return {p5.Image} The filtered image.
 * 
 * @example
 * filterImage(img)
 */
function focusImg(img, x, y, radiusMax) {
    img.loadPixels();
    for (let i = 0; i < img.width; i++) {
        for (let j = 0; j < img.height; j++) {
            let d = dist(x, y, i, j)
            let index = (i + j * img.width) * 4
            d > radiusMax ? d = 0.5 : d = map(d, 0, radiusMax, 1.5, 0.5)
            // d = min(map(d, 0, radiusMax, 1.5, 1), 1.5)

            let r = img.pixels[index + 0] * d
            let g = img.pixels[index + 1] * d
            let b = img.pixels[index + 2] * d

            img.pixels[index + 0] = min(r, 255)
            img.pixels[index + 1] = min(g, 255)
            img.pixels[index + 2] = min(b, 255)
        }
    }
    img.updatePixels()
    return img
}