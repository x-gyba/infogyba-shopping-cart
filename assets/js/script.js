const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".navbar");
toggle.addEventListener("click", function () {
  toggle.classList.toggle("active");
  nav.classList.toggle("active");
});

/* open  cart */
let cartForm = document.querySelector(".carrinho");
document.querySelector("#cart-btn").onclick = () => {
  cartForm.classList.toggle("active");
};

/* close cart */
let closeCart = document.querySelector(".carrinho-close");
closeCart.onclick = () => {
  cartForm.classList.remove("active");
};





 
