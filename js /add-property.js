// ==========================================
// KEJAHUB PROPERTY WIZARD
// ==========================================

const steps = document.querySelectorAll(".step");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const progressBar = document.getElementById("progressBar");

let currentStep = 0;

// ----------------------------
// INITIALIZE
// ----------------------------

showStep(currentStep);

// ----------------------------
// NEXT BUTTON
// ----------------------------

nextBtn.addEventListener("click", () => {

    // Last step = Publish
    if (currentStep === steps.length - 1) {

        publishProperty();

        return;
    }

    if (!validateStep(currentStep)) return;

    currentStep++;

    showStep(currentStep);

});

// ----------------------------
// PREVIOUS BUTTON
// ----------------------------

prevBtn.addEventListener("click", () => {

    if (currentStep === 0) return;

    currentStep--;

    showStep(currentStep);

});

// ----------------------------
// SHOW STEP
// ----------------------------

function showStep(step) {

    steps.forEach(s => s.classList.remove("active"));

    steps[step].classList.add("active");

    const progress = ((step + 1) / steps.length) * 100;

    progressBar.style.width = progress + "%";

    if (step === 0) {

        prevBtn.style.visibility = "hidden";

    } else {

        prevBtn.style.visibility = "visible";

    }

    if (step === steps.length - 1) {

        nextBtn.textContent = "Publish Property";

    } else {

        nextBtn.textContent = "Next";

    }

}

// ----------------------------
// VALIDATION
// ----------------------------

function validateStep(step) {

    switch(step){

        case 0:

            if(
                document.getElementById("title").value.trim()===""
            ){

                alert("Enter property name.");

                return false;

            }

            break;

        case 1:

            if(
                document.getElementById("county").value.trim()==="" ||

                document.getElementById("area").value.trim()===""
            ){

                alert("Enter property location.");

                return false;

            }

            break;

        case 2:

            if(
                document.getElementById("price").value===""
            ){

                alert("Enter monthly rent.");

                return false;

            }

            break;

    }

    return true;

}

// ----------------------------
// IMAGE PREVIEW
// ----------------------------

const imageInput = document.getElementById("imageUpload");

const preview = document.getElementById("previewImage");

let imageData = "";

imageInput.addEventListener("change", function(){

    const file = this.files[0];

    if(!file) return;

    const reader = new FileReader();

    reader.onload = function(e){

        imageData = e.target.result;

        preview.src = imageData;

        preview.style.display = "block";

    }

    reader.readAsDataURL(file);

});

// ----------------------------
// PUBLISH PROPERTY
// ----------------------------

function publishProperty(){

    const user = Storage.getUser();

    if(!user){

        alert("Please login first.");

        window.location.href = "login.html";

        return;

    }

    const property = {

        id: Date.now(),

        owner: user.email,

        title: document.getElementById("title").value,

        category: document.getElementById("category").value,

        county: document.getElementById("county").value,

        area: document.getElementById("area").value,

        price: Number(document.getElementById("price").value),

        bedrooms: Number(document.getElementById("bedrooms").value),

        description: document.getElementById("description").value,

        images: [

            imageData ||

            "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200"

        ],

        status: "Available",

        views: 0,

        requests: 0,

        rating: 5,

        createdAt: new Date().toISOString()

    };

    Storage.addProperty(property);

    alert("🎉 Property published successfully!");

    window.location.href = "dashboard.html";

}
