// ==========================================
// KEJAHUB DASHBOARD
// ==========================================

const user = Storage.getUser() || {
    name: "KejaHub Landlord",
    email: "",
    phone: "",
    location: "Kisumu, Kenya"
};

let properties = Utils.properties();


// ==========================================
// NAVIGATION
// ==========================================

const pages = {
    overview: document.getElementById("overviewPage"),
    properties: document.getElementById("propertiesPage"),
    requests: document.getElementById("requestsPage"),
    messages: document.getElementById("messagesPage"),
    profile: document.getElementById("profilePage")
};

const pageTitles = {
    overview: "Dashboard",
    properties: "My Properties",
    requests: "Viewing Requests",
    messages: "Messages",
    profile: "My Profile"
};


function openPage(pageName) {

    if (!pages[pageName]) return;

    document
        .querySelectorAll(".dashboard-page")
        .forEach(page => page.classList.remove("active"));

    document
        .querySelectorAll(".nav-item[data-page]")
        .forEach(item => item.classList.remove("active"));

    pages[pageName].classList.add("active");

    const activeNav =
        document.querySelector(
            `.nav-item[data-page="${pageName}"]`
        );

    if (activeNav) {
        activeNav.classList.add("active");
    }

    document.getElementById("pageTitle").textContent =
        pageTitles[pageName];

    document
        .getElementById("sidebar")
        .classList.remove("open");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


document
    .querySelectorAll("[data-page]")
    .forEach(button => {

        button.addEventListener("click", () => {
            openPage(button.dataset.page);
        });

    });


document
    .querySelectorAll("[data-open-page]")
    .forEach(button => {

        button.addEventListener("click", () => {
            openPage(button.dataset.openPage);
        });

    });


// ==========================================
// USER
// ==========================================

function loadUser() {

    const name =
        user.name ||
        user.fullName ||
        "KejaHub Landlord";

    const firstName =
        name.split(" ")[0];

    const initial =
        firstName.charAt(0).toUpperCase();

    document.getElementById("welcomeUser").textContent =
        `Welcome back, ${firstName}`;

    document.getElementById("topbarUser").textContent =
        name;

    document.getElementById("userAvatar").textContent =
        initial;

    document.getElementById("profileAvatar").textContent =
        initial;

    document.getElementById("profileDisplayName").textContent =
        name;

    document.getElementById("profileName").value =
        name;

    document.getElementById("profileEmail").value =
        user.email || "";

    document.getElementById("profilePhone").value =
        user.phone || "";

    document.getElementById("profileLocation").value =
        user.location || "Kisumu, Kenya";
}


// ==========================================
// STATS
// ==========================================

function updateStats() {

    properties = Utils.properties();

    const available =
        properties.filter(property => property.available).length;

    const totalViews =
        properties.reduce(
            (total, property) =>
                total + (property.views || 0),
            0
        );

    const requests =
        getRequests();

    document.getElementById("totalProperties").textContent =
        properties.length;

    document.getElementById("activeProperties").textContent =
        available;

    document.getElementById("totalViews").textContent =
        totalViews;

    document.getElementById("totalRequests").textContent =
        requests.length;

    document.getElementById("requestBadge").textContent =
        requests.length;
}


// ==========================================
// PROPERTY CARD
// ==========================================

function propertyCard(property) {

    const image =
        property.images?.[0] ||
        "https://placehold.co/800x600?text=KejaHub";

    return `
        <article class="dashboard-property-card">

            <div class="property-image">

                <img
                    src="${image}"
                    alt="${property.title}">

                <span class="status-badge
                    ${property.available ? "available" : "unavailable"}">

                    ${property.available
                        ? "Available"
                        : "Unavailable"}

                </span>

            </div>


            <div class="property-body">

                <span class="property-location">

                    <i class="bi bi-geo-alt"></i>

                    ${property.estate}, ${property.county}

                </span>


                <h3>
                    ${property.title}
                </h3>


                <strong class="property-price">

                    KES ${property.price.toLocaleString()}

                    <small>/ month</small>

                </strong>


                <div class="property-actions">

                    <a
                        href="property.html?id=${property.id}"
                        title="View">

                        <i class="bi bi-eye"></i>

                    </a>


                    <button
                        onclick="toggleAvailability(${property.id})"
                        title="Change availability">

                        <i class="bi bi-arrow-repeat"></i>

                    </button>


                    <button
                        class="delete-action"
                        onclick="deleteProperty(${property.id})"
                        title="Delete">

                        <i class="bi bi-trash"></i>

                    </button>

                </div>

            </div>

        </article>
    `;
}


// ==========================================
// RENDER PROPERTIES
// ==========================================

function renderProperties() {

    properties = Utils.properties();

    const recentContainer =
        document.getElementById("recentPropertyList");

    recentContainer.innerHTML =
        properties
            .slice(0, 3)
            .map(propertyCard)
            .join("");

    filterDashboardProperties();
}


function filterDashboardProperties() {

    const search =
        document
            .getElementById("propertySearch")
            .value
            .toLowerCase();

    const status =
        document
            .getElementById("propertyStatusFilter")
            .value;

    const filtered =
        properties.filter(property => {

            const matchesSearch =
                property.title
                    .toLowerCase()
                    .includes(search) ||

                property.estate
                    .toLowerCase()
                    .includes(search);

            const matchesStatus =
                status === "all" ||

                (
                    status === "available" &&
                    property.available
                ) ||

                (
                    status === "unavailable" &&
                    !property.available
                );

            return matchesSearch && matchesStatus;

        });


    const container =
        document.getElementById("allPropertyList");


    if (!filtered.length) {

        container.innerHTML = `

            <div class="dashboard-empty">

                <i class="bi bi-house"></i>

                <h3>No properties found</h3>

                <p>
                    Try changing your search or add
                    a new property.
                </p>

            </div>
        `;

        return;
    }


    container.innerHTML =
        filtered
            .map(propertyCard)
            .join("");
}


// ==========================================
// PROPERTY ACTIONS
// ==========================================

function toggleAvailability(id) {

    const property =
        properties.find(item => item.id === id);

    if (!property) return;

    const updatedProperty = {
        ...property,
        available: !property.available
    };

    Storage.updateProperty(
        id,
        updatedProperty
    );

    refreshDashboard();

    showToast(
        updatedProperty.available
            ? "Property marked as available"
            : "Property marked as unavailable"
    );
}


function deleteProperty(id) {

    const property =
        properties.find(item => item.id === id);

    if (!property) return;

    const confirmed =
        confirm(
            `Delete "${property.title}"? This action cannot be undone.`
        );

    if (!confirmed) return;

    Storage.deleteProperty(id);

    refreshDashboard();

    showToast("Property deleted");
}


// ==========================================
// REQUESTS
// ==========================================

function getRequests() {

    return JSON.parse(
        localStorage.getItem("viewingRequests")
    ) || [];
}


function renderRequests() {

    const requests =
        getRequests();

    const container =
        document.getElementById("requestsList");


    if (!requests.length) {

        container.innerHTML = `

            <div class="dashboard-empty">

                <i class="bi bi-calendar-check"></i>

                <h3>No viewing requests yet</h3>

                <p>
                    New tenant requests will appear here.
                </p>

            </div>
        `;

        return;
    }


    container.innerHTML =
        requests.map(request => `

            <div class="request-card">

                <div class="request-avatar">

                    ${
                        (request.name || "T")
                            .charAt(0)
                            .toUpperCase()
                    }

                </div>


                <div class="request-info">

                    <h4>
                        ${request.name || "Prospective Tenant"}
                    </h4>

                    <p>
                        ${request.propertyTitle || "Property viewing"}
                    </p>

                    <span>

                        <i class="bi bi-calendar"></i>

                        ${request.date || "Date not selected"}

                    </span>

                </div>


                <div class="request-actions">

                    <button
                        class="accept-btn"
                        onclick="updateRequestStatus(
                            '${request.id}',
                            'accepted'
                        )">

                        Accept

                    </button>

                    <button
                        class="decline-btn"
                        onclick="updateRequestStatus(
                            '${request.id}',
                            'declined'
                        )">

                        Decline

                    </button>

                </div>

            </div>

        `).join("");
}


function updateRequestStatus(id, status) {

    const requests =
        getRequests().map(request => {

            if (String(request.id) === String(id)) {

                return {
                    ...request,
                    status
                };

            }

            return request;

        });


    localStorage.setItem(
        "viewingRequests",
        JSON.stringify(requests)
    );

    showToast(
        `Request ${status}`
    );
}


// ==========================================
// MESSAGES
// ==========================================

document
    .getElementById("messageForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        const input =
            document.getElementById("messageInput");

        const message =
            input.value.trim();

        if (!message) return;


        document
            .getElementById("chatMessages")
            .insertAdjacentHTML(
                "beforeend",
                `
                    <div class="message sent">
                        ${message}
                    </div>
                `
            );


        input.value = "";


        const chat =
            document.getElementById("chatMessages");

        chat.scrollTop =
            chat.scrollHeight;

    });


// ==========================================
// PROFILE
// ==========================================

document
    .getElementById("profileForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();


        const updatedUser = {

            ...user,

            name:
                document
                    .getElementById("profileName")
                    .value
                    .trim(),

            email:
                document
                    .getElementById("profileEmail")
                    .value
                    .trim(),

            phone:
                document
                    .getElementById("profilePhone")
                    .value
                    .trim(),

            location:
                document
                    .getElementById("profileLocation")
                    .value
                    .trim()

        };


        Storage.saveUser(updatedUser);

        showToast("Profile updated successfully");

        setTimeout(() => {
            location.reload();
        }, 700);

    });


// ==========================================
// MOBILE SIDEBAR
// ==========================================

document
    .getElementById("menuToggle")
    .addEventListener("click", () => {

        document
            .getElementById("sidebar")
            .classList
            .add("open");

    });


document
    .getElementById("sidebarClose")
    .addEventListener("click", () => {

        document
            .getElementById("sidebar")
            .classList
            .remove("open");

    });


// ==========================================
// SEARCH EVENTS
// ==========================================

document
    .getElementById("propertySearch")
    .addEventListener(
        "input",
        filterDashboardProperties
    );


document
    .getElementById("propertyStatusFilter")
    .addEventListener(
        "change",
        filterDashboardProperties
    );


// ==========================================
// LOGOUT
// ==========================================

document
    .getElementById("logoutBtn")
    .addEventListener("click", () => {

        Storage.logout();

    });


// ==========================================
// TOAST
// ==========================================

function showToast(message) {

    const toast =
        document.getElementById("dashboardToast");

    document.getElementById("toastMessage").textContent =
        message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}


// ==========================================
// REFRESH
// ==========================================

function refreshDashboard() {

    properties = Utils.properties();

    updateStats();

    renderProperties();

    renderRequests();
}


// ==========================================
// INITIALIZE
// ==========================================

loadUser();

refreshDashboard();
