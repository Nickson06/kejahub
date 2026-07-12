const Storage = {

    // ==========================
    // USER
    // ==========================

    getUser() {
        return JSON.parse(localStorage.getItem("user"));
    },

    saveUser(user) {
        localStorage.setItem("user", JSON.stringify(user));
    },

    logout() {
        localStorage.removeItem("user");
        window.location.href = "login.html";
    },

    // ==========================
    // PROPERTIES
    // ==========================

    getProperties() {

    let properties = JSON.parse(localStorage.getItem("properties"));

    if (!properties || properties.length === 0) {

        properties = demoProperties;

        localStorage.setItem(
            "properties",
            JSON.stringify(properties)
        );

    }

    return properties;

},

    saveProperties(properties) {
        localStorage.setItem("properties", JSON.stringify(properties));
    },

    addProperty(property) {

        const properties = this.getProperties();

        properties.push(property);

        this.saveProperties(properties);

    },

    updateProperty(id, updatedProperty) {

        let properties = this.getProperties();

        properties = properties.map(property =>

            property.id === id ? updatedProperty : property

        );

        this.saveProperties(properties);

    },

    deleteProperty(id) {

        let properties = this.getProperties();

        properties = properties.filter(property => property.id !== id);

        this.saveProperties(properties);

    }

};
