// ==========================================
// KEJAHUB LISTINGS
// ==========================================

const allProperties = Utils.properties();

let filteredProperties = [...allProperties];

let selectedBedroom = "";


// ==========================================
// ELEMENTS
// ==========================================

const propertyGrid =
    document.getElementById("propertyGrid");

const resultsCount =
    document.getElementById("resultsCount");

const emptyState =
    document.getElementById("emptyState");

const estateFilter =
    document.getElementById("estateFilter");

const categoryFilter =
    document.getElementById("categoryFilter");

const priceFilter =
    document.getElementById("priceFilter");

const parkingFilter =
    document.getElementById("parkingFilter");

const furnishedFilter =
    document.getElementById("furnishedFilter");

const petsFilter =
    document.getElementById("petsFilter");

const availableFilter =
    document.getElementById("availableFilter");

const sortFilter =
    document.getElementById("sortFilter");

const activeFilters =
    document.getElementById("activeFilters");


// ==========================================
// POPULATE ESTATES
// ==========================================

function populateEstates() {

    const estates = [
        ...new Set(
            allProperties.map(property => property.estate)
        )
    ];

    estates.sort();

    estates.forEach(estate => {

        estateFilter.innerHTML += `
            <option value="${estate}">
                ${estate}
            </option>
        `;

    });

}


// ==========================================
// POPULATE CATEGORIES
// ==========================================

function populateCategories() {

    const categories = [
        ...new Set(
            allProperties.map(property => property.category)
        )
    ];

    categories.sort();

    categories.forEach(category => {

        categoryFilter.innerHTML += `
            <option value="${category}">
                ${category}
            </option>
        `;

    });

}


// ==========================================
// RENDER PROPERTIES
// ==========================================

function renderProperties(properties) {

    resultsCount.textContent =
        `${properties.length} ${
            properties.length === 1
                ? "Property"
                : "Properties"
        }`;


    if (properties.length === 0) {

        propertyGrid.innerHTML = "";

        propertyGrid.classList.add("d-none");

        emptyState.classList.remove("d-none");

        return;

    }


    propertyGrid.classList.remove("d-none");

    emptyState.classList.add("d-none");


    propertyGrid.innerHTML =
        properties.map(property => {

            const savedProperties =
                JSON.parse(
                    localStorage.getItem("savedProperties")
                ) || [];

            const isSaved =
                savedProperties.includes(property.id);


            return `

                <article class="listing-card">

                    <div class="listing-image">

                        <img
                            src="${property.images[0]}"
                            alt="${property.title}"
                            loading="lazy"
                        >

                        ${
                            property.featured
                                ? `
                                    <span class="property-badge">
                                        FEATURED
                                    </span>
                                `
                                : ""
                        }

                        <button
                            class="save-btn ${isSaved ? "saved" : ""}"
                            onclick="toggleSave(${property.id}, this)"
                            aria-label="Save property">

                            <i class="bi ${
                                isSaved
                                    ? "bi-heart-fill"
                                    : "bi-heart"
                            }"></i>

                        </button>

                    </div>


                    <div class="listing-body">

                        <div class="listing-location">

                            <i class="bi bi-geo-alt"></i>

                            ${property.estate}, ${property.county}

                        </div>


                        <h3>
                            ${property.title}
                        </h3>


                        <div class="listing-meta">

                            <span>

                                <i class="bi bi-door-open"></i>

                                ${property.bedrooms} Bed

                            </span>

                            <span>

                                <i class="bi bi-droplet"></i>

                                ${property.bathrooms} Bath

                            </span>

                            ${
                                property.parking
                                    ? `
                                        <span>

                                            <i class="bi bi-car-front"></i>

                                            Parking

                                        </span>
                                    `
                                    : ""
                            }

                        </div>


                        <div class="listing-footer">

                            <div class="listing-price">

                                <strong>

                                    KES
                                    ${property.price.toLocaleString()}

                                </strong>

                                <small>
                                    per month
                                </small>

                            </div>


                            <a
                                href="property.html?id=${property.id}"
                                class="details-btn"
                                aria-label="View property">

                                <i class="bi bi-arrow-up-right"></i>

                            </a>

                        </div>

                    </div>

                </article>

            `;

        }).join("");

}


// ==========================================
// FILTER PROPERTIES
// ==========================================

function filterProperties() {

    const estate =
        estateFilter.value;

    const category =
        categoryFilter.value;

    const maximumPrice =
        Number(priceFilter.value);


    filteredProperties =
        allProperties.filter(property => {


            const matchesEstate =
                !estate ||
                property.estate === estate;


            const matchesCategory =
                !category ||
                property.category === category;


            const matchesPrice =
                !maximumPrice ||
                property.price <= maximumPrice;


            const matchesBedrooms =
                !selectedBedroom ||

                (
                    selectedBedroom === "4"
                        ? property.bedrooms >= 4
                        : property.bedrooms ===
                          Number(selectedBedroom)
                );


            const matchesParking =
                !parkingFilter.checked ||
                property.parking;


            const matchesFurnished =
                !furnishedFilter.checked ||
                property.furnished;


            const matchesPets =
                !petsFilter.checked ||
                property.petsAllowed;


            const matchesAvailability =
                !availableFilter.checked ||
                property.available;


            return (

                matchesEstate &&

                matchesCategory &&

                matchesPrice &&

                matchesBedrooms &&

                matchesParking &&

                matchesFurnished &&

                matchesPets &&

                matchesAvailability

            );

        });


    sortProperties();

    renderActiveFilters();

}


// ==========================================
// SORT
// ==========================================

function sortProperties() {

    const sort =
        sortFilter.value;


    if (sort === "price-low") {

        filteredProperties.sort(
            (a, b) => a.price - b.price
        );

    }


    else if (sort === "price-high") {

        filteredProperties.sort(
            (a, b) => b.price - a.price
        );

    }


    else if (sort === "rating") {

        filteredProperties.sort(
            (a, b) => b.rating - a.rating
        );

    }


    else {

        filteredProperties.sort(

            (a, b) =>

                new Date(b.createdAt) -
                new Date(a.createdAt)

        );

    }


    renderProperties(filteredProperties);

}


// ==========================================
// ACTIVE FILTER CHIPS
// ==========================================

function renderActiveFilters() {

    const filters = [];


    if (estateFilter.value) {

        filters.push(estateFilter.value);

    }


    if (categoryFilter.value) {

        filters.push(categoryFilter.value);

    }


    if (priceFilter.value) {

        filters.push(

            `Under KES ${
                Number(
                    priceFilter.value
                ).toLocaleString()
            }`

        );

    }


    if (selectedBedroom) {

        filters.push(

            selectedBedroom === "4"

                ? "4+ Bedrooms"

                : `${selectedBedroom} Bedroom`

        );

    }


    if (parkingFilter.checked) {

        filters.push("Parking");

    }


    if (furnishedFilter.checked) {

        filters.push("Furnished");

    }


    if (petsFilter.checked) {

        filters.push("Pet Friendly");

    }


    if (availableFilter.checked) {

        filters.push("Available Now");

    }


    activeFilters.innerHTML =
        filters.map(filter => `

            <span class="filter-chip">

                ${filter}

            </span>

        `).join("");

}


// ==========================================
// BEDROOM FILTER
// ==========================================

document
    .querySelectorAll(".bedroom-btn")
    .forEach(button => {

        button.addEventListener(
            "click",
            function () {

                document
                    .querySelectorAll(".bedroom-btn")
                    .forEach(btn =>
                        btn.classList.remove("active")
                    );


                this.classList.add("active");


                selectedBedroom =
                    this.dataset.bedroom;


                filterProperties();

            }
        );

    });


// ==========================================
// SAVE / WISHLIST
// ==========================================

function toggleSave(id, button) {

    let savedProperties =
        JSON.parse(
            localStorage.getItem("savedProperties")
        ) || [];


    if (savedProperties.includes(id)) {

        savedProperties =
            savedProperties.filter(
                propertyId =>
                    propertyId !== id
            );

    }

    else {

        savedProperties.push(id);

    }


    localStorage.setItem(

        "savedProperties",

        JSON.stringify(savedProperties)

    );


    const icon =
        button.querySelector("i");


    button.classList.toggle("saved");


    if (button.classList.contains("saved")) {

        icon.className =
            "bi bi-heart-fill";

    }

    else {

        icon.className =
            "bi bi-heart";

    }

}


// ==========================================
// RESET FILTERS
// ==========================================

function resetFilters() {

    estateFilter.value = "";

    categoryFilter.value = "";

    priceFilter.value = "";

    parkingFilter.checked = false;

    furnishedFilter.checked = false;

    petsFilter.checked = false;

    availableFilter.checked = false;

    sortFilter.value = "newest";

    selectedBedroom = "";


    document
        .querySelectorAll(".bedroom-btn")
        .forEach(button =>
            button.classList.remove("active")
        );


    document
        .querySelector(
            '[data-bedroom=""]'
        )
        .classList
        .add("active");


    filterProperties();

}


// ==========================================
// GRID / LIST VIEW
// ==========================================

document
    .getElementById("gridView")
    .addEventListener(
        "click",
        function () {

            propertyGrid
                .classList
                .remove("list-view");


            document
                .getElementById("listView")
                .classList
                .remove("active");


            this.classList.add("active");

        }
    );


document
    .getElementById("listView")
    .addEventListener(
        "click",
        function () {

            propertyGrid
                .classList
                .add("list-view");


            document
                .getElementById("gridView")
                .classList
                .remove("active");


            this.classList.add("active");

        }
    );


// ==========================================
// EVENTS
// ==========================================

document
    .getElementById("searchButton")
    .addEventListener(
        "click",
        filterProperties
    );


document
    .getElementById("clearFilters")
    .addEventListener(
        "click",
        resetFilters
    );


document
    .getElementById("emptyReset")
    .addEventListener(
        "click",
        resetFilters
    );


sortFilter.addEventListener(
    "change",
    sortProperties
);


parkingFilter.addEventListener(
    "change",
    filterProperties
);


furnishedFilter.addEventListener(
    "change",
    filterProperties
);


petsFilter.addEventListener(
    "change",
    filterProperties
);


availableFilter.addEventListener(
    "change",
    filterProperties
);


// ==========================================
// INITIALIZE
// ==========================================

populateEstates();

populateCategories();

sortProperties();
