function register(){


const user={


name:
document.getElementById("name").value,


email:
document.getElementById("email").value,


password:
document.getElementById("password").value,


role:
document.getElementById("role").value



};



localStorage.setItem(
"user",
JSON.stringify(user)
);



alert(
"Account created successfully"
);



window.location.href="dashboard.html";


}





function login(){


const email =
document.getElementById("loginEmail").value;


const password =
document.getElementById("loginPassword").value;



const user =
JSON.parse(
localStorage.getItem("user")
);



if(
user &&
user.email===email &&
user.password===password
){


localStorage.setItem(
"loggedIn",
true
);


window.location.href="dashboard.html";


}

else{


alert(
"Invalid login details"
);


}


}
