import axios from 'axios';
import swal from 'sweetalert';

const addProductWrapper = document.querySelector('.add-product-wrapper');
const newProductForm = document.querySelector('.new-product-form');
const closeIcon = document.querySelector('.close-icon');
const addProduct = document.querySelector('.add-product');
const productError = document.querySelectorAll('.product-error')
const inputs = document.querySelectorAll('.new-product-form input');
const deleteBtn = document.querySelectorAll('.delete');
const updateBtn = document.querySelectorAll('.update');
const updateForm = document.querySelector('#update-form');
const cartCounter = document.querySelector('.cart-counter');
const addToCart = document.querySelectorAll('.add-to-cart');
const addProductForm = document.querySelector('#add-new-product-form');
const removeOrderBtn = document.querySelectorAll('.remove-order')
const newBannerBtn = document.querySelector('.add-banner-wrapper')
const newBannerForm = document.querySelector('.new-banner-form');
const orderBtn = document.querySelector('.order-btn');
const forgetPassword = document.querySelector('#forget-password');
const resetPassword = document.querySelector("#reset-password");


const deleteOrder = document.querySelectorAll('.delete-order');
if(deleteOrder){
  deleteOrder.forEach((deleteBtn)=>{
    deleteBtn.addEventListener('click',async()=>{
      const id = JSON.parse(deleteBtn.dataset.orderid);
      try{
        const res = await axios.delete(`/order/${id}`,{});
        swal("Message", "Deleted successfully", "success");
        setTimeout(()=>{
          window.location.reload();
        },2000)
      }catch(error){
        swal("Message", "Error", "error");
      }
    })
  })
}

const contactForm = document.querySelector('#update-form');
if(contactForm){
  contactForm.addEventListener('submit',async(e)=>{
    e.preventDefault();
    const formData = new FormData(contactForm);
    const contactObj = {};
    for(let [key,value] of formData.entries()){
      contactObj[key] = value;
    }
    try{
      const res =  await axios.post('/contact',contactObj);
      console.log(res.data)
      swal("Message", "Email Send successfully", "success");
      setTimeout(()=>{
        window.location.reload();
      },2000)
    }catch(error){
      const contactError = document.querySelector('#contact-error');
      contactError.innerHTML = error.response.data.message; 
      setTimeout(()=>{
        contactError.innerHTML = ""    
      },2000)
    }
  })
}

const updateProfile = document.querySelector('#update-profile-form');
if(updateProfile){
  updateProfile.addEventListener('submit',async(e)=>{
    e.preventDefault();
    const formData = new FormData(updateProfile);
    const userData = {};
    for(let [key,value] of formData.entries()){
      userData[key] = value;
    }
    const profileBtn = document.querySelector('#update-profile-btn')
    const userId =  JSON.parse(profileBtn.dataset.userid);
    try{
      const res = await axios.put(`/account/${userId}`,userData);
      swal("Message", "Password Updated Successfully", "success");
      setTimeout(()=>{
        window.location.reload();
      },2000)  
    }catch(error){
      const profileError = document.querySelector('#profile-error');
      profileError.innerHTML = error.response.data.message; 
      setTimeout(()=>{
        profileError.innerHTML = ""    
      },3000)  
    }
  })
}

if(forgetPassword){
forgetPassword.addEventListener('submit',async(e)=>{
  e.preventDefault();
  let dataObj = {};
  const formData = new FormData(forgetPassword);
  for(let [key,value] of formData.entries()){
   dataObj[key] = value; 
  }
  try{
    const res = await axios.post('/forget-password',dataObj);
    swal("Message", "Email send to your account", "success");
  }
  catch(error){
    const forgetError = document.querySelector('#forget-error');
    forgetError.innerHTML = error.response.data.message; 
    setTimeout(()=>{
        forgetError.innerHTML = ""    
    },3000)
  }
})
}

if(resetPassword){
resetPassword.addEventListener('submit',async(e)=>{
  e.preventDefault();
  const formData = new FormData(resetPassword);
  let resetObj = {};
  for(let [key,value] of formData.entries()){
    resetObj[key] = value;
  }
  try{
    const res = await axios.put(window.location.pathname,resetObj);
    swal("Message", "Password Updated Successfuly", "success");
      setTimeout(()=>{
        window.location.href= res.data.url;
      },1000)

  }catch(error){
    const resetError = document.querySelector('#reset-error');
    resetError.innerHTML = error.response.data.message; 
    setTimeout(()=>{
        resetError.innerHTML = ""    
    },3000)
    }
  })
}

const paymentForm = document.querySelector('#payment-form');
if(paymentForm){
paymentForm.addEventListener('submit',async(e)=>{
  e.preventDefault();
  const formData = new FormData(paymentForm);
  let data = {};
  for (let [key,value] of formData.entries()){
    data[key] = value
  }
  try{
    const res = await axios.post('/create-checkout-session',data);
    if(res.data.url){
      window.location.href = res.data.url;
    }else{
      swal("Message", "Order Placed Successfully", "success");
      window.location.reload();
    }

  }catch(error){
   error.response.data.message
    }
  })
}

// Count down ends here

if(orderBtn){
  removeOrderBtn.forEach((btn)=>{
    btn.addEventListener('click',async()=>{
      const productId = JSON.parse(btn.dataset.pid);
      await axios.put(`/cart/${productId}`,{});
      swal("Message", "Product Removed From Cart", "success");
      setTimeout(()=>{
        window.location.reload();
      },2000)
    })
  })
}


if(addProductForm){
  addProductForm.addEventListener('submit',async(e)=>{
    e.preventDefault();
    var data = new FormData(addProductForm);
    
    try{
      const response = await axios.post('/product',data);
      swal("Message", "Product Added Successfully", "success");
      window.location.reload();
    }catch(error){
      const addError = document.querySelector('#add-error');
      addError.innerHTML = error.response.data.message; 
      setTimeout(()=>{
          addError.innerHTML = ""    
      },3000)  
    }
  })
  

  closeIcon.addEventListener('click',()=>{
    newProductForm.style.display = "none";
    productError.forEach((product)=>{
      product.textContent = '';
    })
    inputs.forEach((input)=>{
      input.value = '';
    })
  })
  
  addProductWrapper.addEventListener('click',()=>{
    newProductForm.style.display = "block";  
  })
}

addToCart.forEach((btn)=>{
  btn.addEventListener('click',(e)=>{
    let product = JSON.parse(btn.dataset.product);
    updateCart(product);
  })
})

function updateCart(product) {
  axios.post('/cart', product).then(res => {
      cartCounter.innerText = res.data.totalQty
      swal("Message", "Product Added to Cart Successfully!", "success");
  }).catch(err => {
    swal("Message", "Something Wents Wrong", "error");     
  })
}

let fileInput = document.getElementById("file");
if(fileInput){
let imageContainer = document.getElementById("images");
fileInput.addEventListener('change',()=>{
  preview();
})
function preview(){
    imageContainer.innerHTML = "";
    for(let i of fileInput.files){
        let reader = new FileReader();
        let figure = document.createElement("figure");
        let figCap = document.createElement("figcaption");
        figCap.innerText = i.name;
        figure.appendChild(figCap);
        reader.onload=()=>{
            let img = document.createElement("img");
            img.setAttribute("src",reader.result);
            figure.insertBefore(img,figCap);
        }
        imageContainer.appendChild(figure);
        reader.readAsDataURL(i);
    }
  }
}

deleteBtn.forEach( btn=>{
  btn.addEventListener('click',(e)=>{
    const productId = JSON.parse(e.target.dataset.productid);
    deleteProduct(productId.Id);
  })
})

let updateId;
updateBtn.forEach((btn)=>{
  btn.addEventListener('click',(e)=>{
    updateId = JSON.parse(btn.dataset.productid);
    const updateProductForm = document.querySelector('.update-product-form');
    updateProductForm.style.display = "block";
    const updateCloseIcon = document.querySelector('.update-close-icon')
    updateCloseIcon.addEventListener('click',()=>{
      updateProductForm.style.display = "none";  
    })
  })
})

if(updateForm){
  updateForm.addEventListener('submit',async(e)=>{
    e.preventDefault();
    var data = new FormData(updateForm);
    for(let [key,value] of data.entries()){
      console.log(key,value)
    }

    try{
      const res = await axios.put(`/product/${updateId.Id}`,data);
      swal("Message", "Product updated successfully", "success");
      window.location.reload();
    }
    catch(error){
      const updateError = document.querySelector('#update-error');
      updateError.innerHTML = error.response.data.message; 
      setTimeout(()=>{
          updateError.innerHTML = ""    
      },3000)
    }
  })  
}

// functions 
const deleteProduct = async (id)=>{
    const res = await axios.delete(`/product/${id}`);
    swal("Message", "Product Deleted Successfully", "success");
    window.location.reload();    
  }

// count down start here
const endDate = "31 December 2022 08:20:00 PM"
const countdownInputs = document.querySelectorAll(".countdown-cols input")
   
function clock() {
    const end = new Date(endDate)
    const now = new Date()
    const diff = (end - now) / 1000;
    if (diff < 0) return;

    // convert into days;
    countdownInputs[0].value = Math.floor(diff / 3600 / 24);
    countdownInputs[1].value = Math.floor(diff / 3600) % 24;
    countdownInputs[2].value = Math.floor(diff / 60) % 60;
    countdownInputs[3].value = Math.floor(diff) % 60;
}

// initial call
clock()

setInterval(
    () => {
        clock()
    },
    1000
)