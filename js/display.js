class Display {
    constructor(name, height, width, parent = "body", objects = []) {
        // setup variables
        this.name = name
        this.height = height
        this.width = width
        this.parent = parent
        this.body = null
        this.objects = []

        this.createParent()

        objects.forEach(element => {
            this.addObject(element)
        });
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

    addObject(object) {
        // Add the object to the parent
        object.parent(this.body)
        this.objects.push(object)
    }
}