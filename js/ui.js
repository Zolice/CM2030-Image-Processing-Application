/**
 * @file ui.js
 * @brief This file contains the UI class which is responsible for creating the UI elements for the application.
 * 
 * The UI class is responsible for creating the UI elements for the application. It contains the following methods:
 * - setupRGB: This method creates the UI elements for the RGB sliders.
 * - setupColourSpace: This method creates the UI elements for the HSL and CMYK sliders.
 * - setupToggles: This method creates the UI elements for the filter and face effect toggles.
 * - setupFaceEffects: This method creates the UI elements for the face effect dropdown.
 * 
 * The UI class also contains the following properties:
 * - rgb: This property contains the UI elements for the RGB sliders.
 * - colourSpace: This property contains the UI elements for the HSL and CMYK sliders.
 * - toggles: This property contains the UI elements for the filter and face effect toggles.
 * - faceEffects: This property contains the UI elements for the face effect dropdown.
 * 
 * The UI class is used by the main script to create the UI elements for the application.
 * 
 * 
 * @example
 * var ui = new UI()
 */
class UI {
    /**
     * @brief The constructor for the UI class.
     * 
     * The constructor for the UI class initializes
     * the properties for the UI elements and calls the
     * setup methods to create the UI elements.
     * 
     * @example
     * var ui = new UI()
     */
    constructor() {
        // Setup variables
        this.rgb = []
        this.colourSpace = []
        this.toggles = []
        this.faceEffects = []

        // Setup UI
        this.setupRGB()
        this.setupColourSpace()
        this.setupToggles()
        this.setupFaceEffects()
    }

    /**
     * @brief This method creates the UI elements for the RGB sliders.
     * 
     * This method creates the UI elements for the RGB sliders and adds them to the UI.
     * 
     * @param {string} parent The parent element to add the UI elements to.
     * 
     * @example
     * ui.setupRGB()
     */
    setupRGB(parent = "row2") {
        this.rgb.push(new Display("Red", 0, 255, parent, [createSlider(0, 255, 100)]))
        this.rgb.push(new Display("Green", 0, 255, parent, [createSlider(0, 255, 100)]))
        this.rgb.push(new Display("Blue", 0, 255, parent, [createSlider(0, 255, 100)]))
    }

    /**
     * @brief This method creates the UI elements for the HSL and CMYK sliders.
     * 
     * This method creates the UI elements for the HSL and CMYK sliders and adds them to the UI.
     * 
     * @param {string} parent The parent element to add the UI elements to.
     * 
     * @example
     * ui.setupColourSpace()
     */
    setupColourSpace(parent = "row3") {
        this.colourSpace.push(new Display("HSL Lightness", 0, 255, parent, [createSlider(0, 255, 100)]))
        this.colourSpace.push(new Display("CMYK Cyan", 0, 100, parent, [createSlider(0, 255, 0)]))
        this.colourSpace.push(new Display("CMYK Magenta", 0, 100, parent, [createSlider(0, 255, 100)]))
        this.colourSpace.push(new Display("CMYK Yellow", 0, 100, parent, [createSlider(0, 255, 100)]))
    }

    /**
     * @brief This method creates the UI elements for the filter and face effect toggles.
     * 
     * This method creates the UI elements for the filter and face effect toggles and adds them to the UI.
     * 
     * @param {string} parent The parent element to add the UI elements to.
     * 
     * @example
     * ui.setupToggles()
     */
    setupToggles(parent = "row4") {
        this.toggles.push(new Display("Filters", 0, 255, parent, [createCheckbox("Filters", true)]))
        this.toggles.push(new Display("Face Effects", 0, 255, parent, [createCheckbox("Face Effects", true)]))
    }

    /**
     * @brief This method creates the UI elements for the face effect dropdown.
     * 
     * This method creates the UI elements for the face effect dropdown and adds them to the UI.
     * 
     * @param {string} parent The parent element to add the UI elements to.
     * 
     * @example
     * ui.setupFaceEffects()
     */
    setupFaceEffects(parent = "row4") {
        // Create a dropdown for the face effects
        let dropdown = createSelect()
        dropdown.option("1-Grayscale", faceEffect.GRAYSCALE)
        dropdown.option("2-Blur", faceEffect.BLUR)
        dropdown.option("3-Convert to CMYK", faceEffect.CONVERT_CMYK)
        dropdown.option("4-Convert to HSL", faceEffect.CONVERT_HSL)
        dropdown.option("5-Pixelate", faceEffect.PIXELATE)
        dropdown.option("6-Focus Face", faceEffect.FOCUS_FACE)

        // Add the dropdown to the UI
        this.faceEffects.push(new Display("Face Detection", 0, 255, parent, [dropdown]))
    }
}