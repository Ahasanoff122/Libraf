 window.handlePopUp = function (status) {
            const popLayer = document.getElementById("popLayer");
            if (!popLayer) {
                console.error("popLayer not found");
                return;
            }
            popLayer.style.display = status ? "block" : "none";
            console.log("Popup status:", status);
        };


        document.getElementById("popLayer").addEventListener("click", function (event) {

            if (event.target === this) {
                window.handlePopUp(false);
            }
        });


        document.querySelector("#popLayer > div").addEventListener("click", function (event) {
            event.stopPropagation();
        });


        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") window.handlePopUp(false);
        });

