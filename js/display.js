/**
 * @file display.js
 * @brief Display class to create a display window
 * 
 * The Display class is responsible for creating a display window to show the UI elements.
 * 
 * The Display class contains the following properties:
 * - name: This property contains the name of the display window.
 * - height: This property contains the height of the display window.
 * - width: This property contains the width of the display window.
 * - parent: This property contains the parent element to add the display window to.
 * - body: This property contains the body element of the display window.
 * - objects: This property contains the objects to add to the display window.
 * 
 * The Display class contains the following methods:
 * - createParent: This method creates the parent element for the display window.
 * - addObject: This method adds a p5.Element to the display window.
 * 
 * The Display class is used by the main script to create the display window for the application.
 * 
 * 
 * @example
 * var display = new Display("RGB Sliders", 200, 400, "row2", [createSlider(0, 255, 100)])
 */
class Display {
    /**
     * @brief The constructor for the Display class.
     * 
     * The constructor for the Display class initializes the properties for the display window and calls the createParent method to create the parent element for the display window.
     * 
     * @param {string} name The name of the display window.
     * @param {number} height The height of the display window.
     * @param {number} width The width of the display window.
     * @param {string} parent The parent element to add the display window to.
     * @param {array} objects The p5.Elements to add to the display window.
     * 
     * @example
     * var display = new Display("RGB Sliders", 200, 400, "row2", [createSlider(0, 255, 100)])
     */
    constructor(name, height, width, parent = "body", objects = []) {
        // Setup variables
        this.name = name
        this.height = height
        this.width = width
        this.parent = parent
        this.body = null
        this.objects = []

        // Setup UI
        this.createParent()

        // Add objects
        objects.forEach(element => {
            this.addObject(element)
        })
    }

    /**
     * @brief This method creates the parent element for the display window.
     * 
     * This method creates the parent element for the display window and adds it to the parent element.
     * 
     * @example
     * display.createParent()
     */
    createParent() {
        // Create the parent element
        this.body = createDiv()
        if (this.parent != "body") this.body.parent(this.parent)
        this.body.class("item")

        // Create the header
        let h = createP(this.name)
        h.parent(this.body)
    }

    /**
     * @brief This method adds an object to the display window.
     * 
     * This method adds an object to the display window and adds it to the parent element.
     * 
     * @param {p5.Element} object The object to add to the display window.
     * 
     * @example
     * display.addObject(createSlider(0, 255, 100))
     */
    addObject(object) {
        // Add the object to the parent
        object.parent(this.body)
        this.objects.push(object)
    }
}