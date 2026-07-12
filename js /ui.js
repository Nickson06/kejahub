const UI = {

    // ==========================
    // TOAST NOTIFICATION
    // ==========================

    toast(message, type = "success") {

        const oldToast = document.querySelector(".kh-toast");

        if (oldToast) oldToast.remove();

        const toast = document.createElement("div");

        toast.className = `kh-toast ${type}`;

        toast.innerHTML = `
            <span>${message}</span>
        `;

        document.body.appendChild(toast);

        setTimeout(() => {

            toast.classList.add("show");

        },100);

        setTimeout(() => {

            toast.classList.remove("show");

            setTimeout(() => toast.remove(),300);

        },3000);

    },



    // ==========================
    // LOADER
    // ==========================

    showLoader(){

        let loader=document.getElementById("pageLoader");

        if(loader){

            loader.style.display="flex";

        }

    },

    hideLoader(){

        let loader=document.getElementById("pageLoader");

        if(loader){

            loader.style.display="none";

        }

    },



    // ==========================
    // CONFIRM DELETE
    // ==========================

    confirmDelete(callback){

        if(confirm("Delete this property?")){

            callback();

        }

    },



    // ==========================
    // FORMAT PRICE
    // ==========================

    formatPrice(price){

        return "KES " + Number(price).toLocaleString();

    },



    // ==========================
    // SHORT TEXT
    // ==========================

    truncate(text,length=80){

        if(text.length<=length)

            return text;

        return text.substring(0,length)+"...";

    },



    // ==========================
    // PAGE TITLE
    // ==========================

    setTitle(title){

        document.title=`${title} | KejaHub`;

    }

};
