class Display {
    constructor(name, height, width, parent = "body", object) {
        // setup variables
        this.name = name
        this.height = height
        this.width = width
        this.parent = parent
        this.body = null

        this.createParent()

        this.createObject(object)
    }

    createParent() {
        // create a divider
        this.body = createDiv()
        if (this.parent != "body") this.body.parent(this.parent)
        this.body.class("item")

        // add a header to show what this is showing
        let h = createP(this.name)
        h.parent(this.body)
        h.elt.width = "100%"
    }

    createObject(object) {
        // Add the object to the parent
        this.object = object
        this.object.parent(this.body)
    }
}