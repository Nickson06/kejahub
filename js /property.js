// ==========================================
// KEJAHUB PROPERTY DETAILS
// ==========================================

// Get ID from URL
const params = new URLSearchParams(window.location.search);
const propertyId = Number(params.get("id"));

// Get property from our shared data source
const property = Utils.property(propertyId);

// Get page container
const container = document.getElementById("propertyDetails");


// ==========================================
// PROPERTY NOT FOUND
// ==========================================

if (!property) {

    container.innerHTML = `
        <div class="container py-5 text-center">

            <h2>Property not found</h2>

            <p>
                This property may have been removed
                or the link is incorrect.
            </p>

            <a href="listings.html"
               class="btn btn-success">

                Browse Properties

            </a>

        </div>
    `;

} else {

    loadProperty();

}


// ==========================================
// LOAD PROPERTY
// ==========================================

function loadProperty() {

    const images = property.images || [];

    const mainImage =
        images[0] || "https://placehold.co/1200x800";

    const secondImage =
        images[1] || mainImage;

    const thirdImage =
        images[2] || mainImage;


    container.innerHTML = `

        <!-- GALLERY -->

        <div class="gallery">

            <img
                src="${mainImage}"
                alt="${property.title}"
            >

            <div>

                <img
                    src="${secondImage}"
                    alt="${property.title}"
                >

                <img
                    src="${thirdImage}"
                    alt="${property.title}"
                >

            </div>

        </div>


        <!-- PROPERTY CONTENT -->

        <div class="row mt-5 g-5">

            <div class="col-lg-8">

                <span class="property-type">
                    ${property.category}
                </span>

                <h1>
                    ${property.title}
                </h1>

                <p class="location">
                    📍 ${property.estate}, ${property.county}
                </p>


                <div class="rating">

                    ⭐ ${property.rating}

                    <span>
                        (${property.reviews} reviews)
                    </span>

                </div>


                <h2 class="price">

                    KES ${property.price.toLocaleString()}

                    <span>
                        / month
                    </span>

                </h2>


                <!-- PROPERTY FEATURES -->

                <div class="property-features">

                    <span>
                        🛏 ${property.bedrooms}
                        Bedrooms
                    </span>

                    <span>
                        🚿 ${property.bathrooms}
                        Bathrooms
                    </span>

                    <span>
                        📐 ${property.size}
                    </span>

                </div>


                <hr>


                <h3>
                    About this home
                </h3>

                <p>
                    ${property.description}
                </p>


                <h3>
                    Amenities
                </h3>

                <div class="amenities">

                    ${property.amenities.map(item => `

                        <span>
                            ✓ ${item}
                        </span>

                    `).join("")}

                </div>

            </div>


            <!-- HOST CARD -->

            <div class="col-lg-4">

                <div class="host-card">

                    <p>
                        Hosted by
                    </p>

                    <h3>
                        ${property.host.name}
                    </h3>


                    ${
                        property.host.verified
                        ? `
                            <span class="verified">
                                ✓ Verified Landlord
                            </span>
                        `
                        : ""
                    }


                    <div class="host-listings">

                        ${property.host.listings}
                        active listings

                    </div>


                    <a
                        href="tel:${property.host.phone}"
                        class="contact-btn">

                        Contact Landlord

                    </a>


                    <button
                        class="view-btn"
                        onclick="requestViewing()">

                        Request Viewing

                    </button>

                </div>

            </div>

        </div>

    `;

}


// ==========================================
// REQUEST VIEWING
// ==========================================

function requestViewing() {

    alert(
        `Viewing request for ${property.title}`
    );

}
