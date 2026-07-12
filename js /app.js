// ====================================
// KEJAHUB HOMEPAGE
// ====================================

// Load all properties

const storedProperties = Storage.getProperties();

const allProperties = [

    ...properties,

    ...storedProperties

];

// ------------------------------------
// LOGIN BUTTON
// ------------------------------------

const loginBtn = document.querySelector(".btn.btn-primary");

loginBtn.onclick = () => {

    window.location.href = "login.html";

};

// ------------------------------------
// LIST PROPERTY
// ------------------------------------

const listPropertyLink = document.querySelectorAll(".nav-link")[2];

listPropertyLink.onclick = function(e){

    e.preventDefault();

    const user = Storage.getUser();

    if(!user){

        window.location.href="login.html";

        return;

    }

    if(user.role==="landlord"){

        window.location.href="add-property.html";

    }

    else{

        alert("Only landlords can list properties.");

    }

};

// ------------------------------------
// HERO SEARCH
// ------------------------------------

const searchButton =
document.querySelector(".search-box button");

searchButton.onclick=function(){

    const location=
document.querySelector(".search-box input").value;

    const category=
document.querySelector(".search-box select").value;

    localStorage.setItem("searchLocation",location);

    localStorage.setItem("searchCategory",category);

    window.location.href="listings.html";

};

/*==================================
POPULAR LOCATIONS
==================================*/

const locationContainer =
document.getElementById("locationContainer");

const locationImages={

"Nairobi":"https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200",

"Kisumu":"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200",

"Mombasa":"https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200",

"Nakuru":"https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200",

"Eldoret":"https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200"

};

const counts={};

allProperties.forEach(property=>{

const county=property.county;

counts[county]=(counts[county]||0)+1;

});

locationContainer.innerHTML=

Object.keys(locationImages)

.map(city=>`

<div class="col-lg-4 col-md-6">

<div class="destination-card">

<img

src="${locationImages[city]}"

alt="${city}">

<div class="destination-overlay">

<div>

<span class="destination-count">

${counts[city]||0} Properties

</span>

<h3>

${city}

</h3>

<a

href="listings.html?county=${city}"

class="explore-btn">

Explore Homes

<i class="bi bi-arrow-right"></i>

</a>

</div>

</div>

</div>

</div>

`)

.join("");
// ====================================
// FEATURED HOMES
// ====================================

const featured =
document.getElementById("featuredHomes");

const featuredProperties =
allProperties.slice(0,3);

featured.innerHTML = featuredProperties.map(property => `

<div class="col-lg-4 col-md-6">

<div class="property-card">

<div class="property-image">

<img src="${property.images[0]}" alt="${property.title}">

<div class="verified-badge">

<i class="bi bi-patch-check-fill"></i>

Verified

</div>

<div class="wishlist">

<i class="bi bi-heart"></i>

</div>

</div>

<div class="property-content">

<div class="property-rating">

<i class="bi bi-star-fill"></i>

4.9

<span>(128 Reviews)</span>

</div>

<h4>

${property.title}

</h4>

<p class="location">

<i class="bi bi-geo-alt-fill"></i>

${property.area}, ${property.county}

</p>

<div class="property-features">

<span>

<i class="bi bi-door-open"></i>

${property.bedrooms || 2} Beds

</span>

<span>

<i class="bi bi-droplet"></i>

2 Baths

</span>

<span>

<i class="bi bi-car-front"></i>

Parking

</span>

</div>

<div class="property-footer">

<div>

<h3>

KES ${property.price.toLocaleString()}

</h3>

<small>/ month</small>

</div>

<a
href="property.html?id=${property.id}"
class="btn btn-primary">

View

</a>

</div>

</div>

</div>

</div>

`).join("");

/*====================================
STATISTICS
====================================*/

document.getElementById("propertyCount").textContent=

allProperties.length;

document.getElementById("countyCount").textContent=

Object.keys(counts).length;

const landlords=

new Set(allProperties.map(p=>p.owner));

document.getElementById("landlordCount").textContent=

landlords.size;

/*=====================================
RECENTLY ADDED
=====================================*/

const recentSlider = document.getElementById("recentSlider");

const latest = [...allProperties]
.sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt))
.slice(0,6);

recentSlider.innerHTML = latest.map(property=>`

<div class="recent-card">

<div class="recent-image">

<span class="new-badge">

NEW

</span>

<img src="${property.images[0]}">

</div>

<div class="recent-body">

<div class="property-rating">

<i class="bi bi-star-fill"></i>

4.9

</div>

<h4>

${property.title}

</h4>

<p>

<i class="bi bi-geo-alt-fill"></i>

${property.area}, ${property.county}

</p>

<div class="d-flex justify-content-between align-items-center mt-4">

<div>

<div class="recent-price">

KES ${property.price.toLocaleString()}

</div>

<small>/ month</small>

</div>

<a

href="property.html?id=${property.id}"

class="btn btn-primary">

View

</a>

</div>

</div>

</div>

`).join("");

/*=====================================
CAROUSEL
=====================================*/

let currentSlide = 0;

const slider = document.getElementById("recentSlider");

const cardWidth = 390;

document.getElementById("recentNext").onclick = () => {

    const maxSlides = Math.max(0, latest.length - 3);

    if(currentSlide < maxSlides){

        currentSlide++;

        slider.style.transform =
            `translateX(-${currentSlide * cardWidth}px)`;

    }

};

document.getElementById("recentPrev").onclick = () => {

    if(currentSlide > 0){

        currentSlide--;

        slider.style.transform =
            `translateX(-${currentSlide * cardWidth}px)`;

    }

};
setInterval(()=>{

const maxSlides = Math.max(0, latest.length - 3);

currentSlide++;

if(currentSlide > maxSlides){

currentSlide = 0;

}

slider.style.transform =
`translateX(-${currentSlide * cardWidth}px)`;

},5000);
