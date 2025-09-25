
      import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";

      import {
        getAuth,
        createUserWithEmailAndPassword,
        signInWithEmailAndPassword,
        signOut,
        onAuthStateChanged,
        sendEmailVerification,
        sendPasswordResetEmail,
        browserLocalPersistence,
        setPersistence,
      } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

      const firebaseConfig = {
        apiKey: "AIzaSyD6MLOOhj1AbAP4mSW9800bLKr7dKyB5QU",
        authDomain: "libraff-2d9de.firebaseapp.com",
        projectId: "libraff-2d9de",
        storageBucket: "libraff-2d9de.firebasestorage.app",
        messagingSenderId: "935006086000",
        appId: "1:935006086000:web:518181af1ca12d680ea5b5",
        measurementId: "G-1RGYRR5776",
      };

      const app = initializeApp(firebaseConfig);
      const auth = getAuth(app);

      setPersistence(auth, browserLocalPersistence)
        .then(() => console.log("Sessiya localStorage-da saxlanacaq."))
        .catch((error) => console.error(error.message));
        

      // Modal funksiyaları
        function openModal(type) {
          document.getElementById("authModal").classList.remove("hidden");
          document.getElementById("loginForm").classList.add("hidden");
          document.getElementById("registerForm").classList.add("hidden");
          if (type === "login")
            document.getElementById("loginForm").classList.remove("hidden");
          else document.getElementById("registerForm").classList.remove("hidden");
        }
        function closeModal() {
          document.getElementById("authModal").classList.add("hidden");
        }

        function openResetModal() {
          document.getElementById("resetModal").classList.remove("hidden");
          closeModal();
        }
        function closeResetModal() {
          document.getElementById("resetModal").classList.add("hidden");
        }
  // Cart funksiyaları
  // 1️⃣ Səbətə əlavə et funksiyası
  document.addEventListener("DOMContentLoaded", () => {
      // ✅ CART MODAL
      const cartIcon = document.getElementById("cart-icon");
      const closeCartBtn = document.getElementById("close-cart");
      const cartModal = document.getElementById("cart-modal");

      if (cartIcon && cartModal) {
          cartIcon.addEventListener("click", () => {
              renderCartModal();
              cartModal.classList.remove("translate-x-full");
          });
      }

    if (closeCartBtn && cartModal) {
        closeCartBtn.addEventListener("click", () => {
            cartModal.classList.add("translate-x-full");
        });
    }

    updateCartCount();

    // ✅ LIKE MODAL
    const likeIcon = document.getElementById("like-icon");
    const closeLikeBtn = document.getElementById("close-like");
    const likeModal = document.getElementById("like-modal");

    if (likeIcon && likeModal) {
        likeIcon.addEventListener("click", () => {
            renderLikeModal();
            likeModal.classList.remove("translate-x-full");
        });
    }

    if (closeLikeBtn && likeModal) {
        closeLikeBtn.addEventListener("click", () => {
            likeModal.classList.add("translate-x-full");
        });
    }

    updateLikeCount();
});

function addToLike(book) {
    let liked = JSON.parse(localStorage.getItem("liked")) || [];
    const urlsInLiked = liked.map(item => String(item.product_url));

    if (!urlsInLiked.includes(String(book.product_url))) {
        liked.push(book);
        localStorage.setItem("liked", JSON.stringify(liked));
        updateLikeCount();
        renderLikeModal();
        showToast(`${book.name} bəyənilənlərə əlavə olundu!`, "success");
    } else {
        showToast("Bu kitab artıq bəyənilənlərdədir!", "error");
    }
}

// Kitab əlavə etmək
// CART FUNKSİYALARI
function addToCart(book) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const urlsInCart = cart.map(item => item.product_url.toString());

    if (!urlsInCart.includes(book.product_url.toString())) {
        cart.push(book);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCartModal();
        updateCartCount(); // Bu sətri renderCartModal-dan sonra əlavə et
        showToast(`${book.name} səbətə əlavə olundu!`, "success");
    } else {
        showToast("Bu kitab artıq səbətdədir!", "error");
    }
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    document.getElementById("cart-count").textContent = cart.length;
}

function renderCartModal() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const list = document.getElementById("cart-list");
    list.innerHTML = "";

    cart.forEach((book, index) => {
        const li = document.createElement("li");
        li.className = "border p-2 rounded flex flex-col space-y-2";
        li.innerHTML = `
             <div class="flex space-x-3">
                <img src="${book.image}" alt="${book.name}" class="w-20 h-28 object-cover rounded-lg">
                <div class="flex-1 flex flex-col justify-between">
                    <div>
                        <h2 class="font-bold text-gray-800 text-sm">${book.name}</h2>
                        <p class="text-gray-500 text-xs">${book.author || ''}</p>
                    </div>
                    <div class="price">
  <span class="text-gray-400 line-through mr-2">${book.list_price}</span>
  <span class="text-red-500 font-bold">${book.price}₼</span>
</div>
                    <div class="mt-2 flex items-center justify-between">
                        <a href="pages/viewdetail.html?product=${book.product_url}" target="_blank" class="text-blue-500 text-xs hover:underline">View Details</a>
                        <button class="remove-btn text-red-500 text-xs px-2 py-1 rounded border border-red-500 hover:bg-red-500 hover:text-white transition">Sil</button>
                    </div>
                </div>
            </div>
        `;
        list.appendChild(li);

        li.querySelector(".remove-btn").addEventListener("click", () => {
            removeFromCart(index);
        });
    });

    // const countBottom = document.getElementById("cart-count-bottom");
    // if (countBottom) countBottom.textContent = cart.length;
}

function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    renderCartModal();
}


// LIKE FUNKSİYALARI
function likeBook(book) {
    let liked = JSON.parse(localStorage.getItem("likedBooks")) || [];
    const urlsInLiked = liked.map(item => String(item.product_url));

    if (!urlsInLiked.includes(String(book.product_url))) {
        liked.push(book);
        localStorage.setItem("likedBooks", JSON.stringify(liked));
        updateLikeCount();
        renderLikeModal();
        showToast(`${book.name} bəyənildi!`, "success");
    } else {
        showToast("Bu kitab artıq bəyənilib!", "error");
    }
}

function updateLikeCount() {
    const liked = JSON.parse(localStorage.getItem("likedBooks")) || [];
    document.getElementById("like-count").textContent = liked.length;
}

function renderLikeModal() {
    const liked = JSON.parse(localStorage.getItem("likedBooks")) || [];
    const list = document.getElementById("like-list");
    list.innerHTML = "";

    liked.forEach((book, index) => {
        const li = document.createElement("li");
        li.className = "border p-2 rounded flex flex-col space-y-2";
        li.innerHTML = `
             <div class="flex space-x-3">
                <img src="${book.image}" alt="${book.name}" class="w-20 h-28 object-cover rounded-lg">
                <div class="flex-1 flex flex-col justify-between">
                    <div>
                        <h2 class="font-bold text-gray-800 text-sm">${book.name}</h2>
                        <p class="text-gray-500 text-xs">${book.author || ''}</p>
                        <a href="pages/viewdetail.html?product=${book.product_url}" target="_blank" class="text-blue-500 text-xs hover:underline">View Details</a>
                    </div>
                    <div class="price">
  <span class="text-gray-400 line-through mr-2">${book.list_price}</span>
  <span class="text-red-500 font-bold">${book.price}₼</span>
</div>
                    <div class="mt-2 flex items-center justify-between">
                         <button class="add-to-cart-btn bg-green-500 text-white px-3 py-1 rounded text-xs">Səbətə əlavə et</button>
                        <button class="remove-btn text-red-500 text-xs px-2 py-1 rounded border border-red-500 hover:bg-red-500 hover:text-white transition">Sil</button>
                    </div>
                </div>
            </div>
        `;
        list.appendChild(li);
        li.querySelector(".add-to-cart-btn").addEventListener("click", () => {
            addToCart(book);
        });

        li.querySelector(".remove-btn").addEventListener("click", () => {
            removeFromLiked(index);
        });
    });

    const countBottom = document.getElementById("like-count-bottom");
    if (countBottom) countBottom.textContent = liked.length;
}

function removeFromLiked(index) {
    let liked = JSON.parse(localStorage.getItem("likedBooks")) || [];
    liked.splice(index, 1);
    localStorage.setItem("likedBooks", JSON.stringify(liked));
    updateLikeCount();
    renderLikeModal();
}


// Modern Toast
function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.className = `fixed bottom-4 right-4 px-4 py-2 rounded shadow-lg text-white z-50 ${
        type === "success" ? "bg-green-500" : "bg-red-500"
    }`;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 2000);
}




// 4️⃣ SVG kliklərini div-ə bağla (SVG overlay problemi üçün)
document.getElementById("cart-wrapper").addEventListener("click", () => {
    renderCartModal();
    document.getElementById("cart-modal").classList.remove("translate-x-full");
});

document.getElementById("").addEventListener("click", () => {
    document.getElementById("cart-modal").classList.add("translate-x-full");
});

// 5️⃣ Sayt açılan kimi cart sayı göstərilsin
updateCartCount(); 
      // Register
      function registerUser() {
        const email = document.getElementById("regEmail").value.trim();
        const password = document.getElementById("regPassword").value.trim();
        const regMsg = document.getElementById("regMsg");
        regMsg.textContent = "";

        if (!email || !password) {
          regMsg.textContent = "Bütün sahələr doldurulmalıdır!";
          return;
        }

        createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    sendEmailVerification(userCredential.user)
      .then(() => showToast("Hesab yaradıldı. Emailinizi yoxlayın!", "success"))
      .catch((err) => showToast(err.message, "error"));
  })
  .catch((error) => {
    switch (error.code) {
      case "auth/invalid-email":
        regMsg.textContent = "Email düzgün formatda deyil!";
        showToast("Email düzgün formatda deyil!", "error");
        break;
      case "auth/email-already-in-use":
        regMsg.textContent = "Bu email artıq istifadə olunur!";
        showToast("Bu email artıq istifadə olunur!", "error");
        break;
      case "auth/weak-password":
        regMsg.textContent = "Şifrə çox zəifdir!";
        showToast("Şifrə çox zəifdir!", "error");
        break;
      default:
        regMsg.textContent = error.message;
        showToast(error.message, "error");
    }
  });
      }

      // Login
      function loginUser() {
        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value.trim();
        const loginMsg = document.getElementById("loginMsg");
        loginMsg.textContent = "";

        if (!email || !password) {
          loginMsg.textContent = "Bütün sahələr doldurulmalıdır!";
          return;
        }

        signInWithEmailAndPassword(auth, email, password)
          .then(() => {
            loginMsg.textContent = "Uğurla daxil olundu!";
            loginMsg.classList.remove("text-red-500");
            loginMsg.classList.add("text-green-500");
            closeModal();
          })
          .catch((error) => {
            switch (error.code) {
              case "auth/invalid-email":
                loginMsg.textContent = "Email düzgün formatda deyil!";
                break;
              case "auth/user-not-found":
                loginMsg.textContent = "İstifadəçi tapılmadı!";
                break;
              case "auth/wrong-password":
                loginMsg.textContent = "Şifrə yanlışdır!";
                break;
              default:
                loginMsg.textContent = error.message;
            }
            loginMsg.classList.add("text-red-500");
          });
      }

      // Logout
      function logoutUser() {
        signOut(auth)
          .then(() => {
            showToast("Uğurla çıxış etdiniz!");
            updateAuthUI(null); // UI-ni yenilə
          })
          .catch((error) => {
            showToast("Xəta baş verdi: " + error.message, "red");
          });
      }

      // Toast göstərmək üçün funksiyanı əlavə et
      function showToast(message, bgColor = "green") {
        const toast = document.getElementById("toast");
        toast.textContent = message;
        toast.classList.remove("opacity-0", "pointer-events-none");
        toast.classList.add(`bg-${bgColor}-500`);
        setTimeout(() => {
          toast.classList.add("opacity-0", "pointer-events-none");
        }, 1500); // 3 saniyə görünür
      }

      // Update UI
      const authButtons = document.getElementById('authButtons');
        function updateAuthUI(user) {
            authButtons.innerHTML = '';
            if (user) {
                authButtons.innerHTML = `
            <span class="text-gray-700 mr-2">${user.email}</span>
            <button onclick="logoutUser()" class="bg-gray-700 text-white px-4 py-1 rounded">Logout</button>
        `;
            } else {
                authButtons.innerHTML = `
            <button onclick="openModal('login')" class="bg-red-600 text-white px-4 py-1 rounded">Login</button>
            <button onclick="openModal('register')" class="bg-blue-600 text-white px-4 py-1 rounded">Register</button>
        `;
            }
        }
      function handlePopUp(show) {
        const popLayer = document.getElementById("popLayer");
        if (show) {
          popLayer.classList.remove("hidden");
        } else {
          popLayer.classList.add("hidden");
        }
      }

      function toggleCrudPopup(show) {
        const crudPopup = document.getElementById("crudPopup");
        if (show) {
          crudPopup.classList.remove("hidden");
        } else {
          crudPopup.classList.add("hidden");
        }
      }

      // Firebase auth state listener
     onAuthStateChanged(auth, (user) => updateAuthUI(user));

// CART MODAL
document.addEventListener("DOMContentLoaded", () => {
    const cartIcon = document.getElementById("cart-icon");
    const closeCartBtn = document.getElementById("close-cart");
    const cartModal = document.getElementById("cart-modal");

    // Aç
    if (cartIcon && cartModal) {
        cartIcon.addEventListener("click", () => {
            renderCartModal();
            cartModal.classList.remove("translate-x-full");
        });
    }

    // Bağla
    if (closeCartBtn && cartModal) {
        closeCartBtn.addEventListener("click", () => {
            cartModal.classList.add("translate-x-full");
        });
    }

    updateCartCount();
});

// LIKE MODAL
document.addEventListener("DOMContentLoaded", () => {
    const likeIcon = document.getElementById("like-icon");
    const closeLikeBtn = document.getElementById("close-like"); // ❗ burada ID ayrıca olmalıdır
    const likeModal = document.getElementById("like-modal");

    // Aç
    if (likeIcon && likeModal) {
        likeIcon.addEventListener("click", () => {
            renderLikeModal(); // ayrıca render funksiyan yoxdursa, renderCartModal() da qoya bilərsən
            likeModal.classList.remove("translate-x-full");
        });
    }

    // Bağla
    if (closeLikeBtn && likeModal) {
        closeLikeBtn.addEventListener("click", () => {
            likeModal.classList.add("translate-x-full");
        });
    }

    updateLikeCount();
});



      function resetPassword() {
        const email = document.getElementById("resetEmail").value.trim();
        if (!email) {
          alert("Email daxil edin!");
          return;
        }

        sendPasswordResetEmail(auth, email)
          .then(() => alert("Reset link emailinizə göndərildi!"))
          .catch((err) => alert(err.message));
      }


      window.resetPassword = resetPassword;

      // Globally
      window.openModal = openModal;
      window.closeModal = closeModal;
      window.loginUser = loginUser;
      window.registerUser = registerUser;
      window.logoutUser = logoutUser;
      window.openResetModal = openResetModal;
      window.closeResetModal = closeResetModal;
      window.resetPassword = resetPassword;
    