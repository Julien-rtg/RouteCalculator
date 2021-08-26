const requestOptions = { // GEOAPIFY
    method: 'GET',
};

fetch("https://api.geoapify.com/v1/geocode/autocomplete?text=Mosco&apiKey=81cda06477964467af0be6387ec25d3a", requestOptions)
    .then(response => response.json())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));


//     The addressAutocomplete takes as parameters:
// -    a container element(div)
//     - callback to notify about address selection
//         - geocoder options:
// -    placeholder - placeholder text for an input element
//     - type - location type
        
function addressAutocomplete(containerElement, callback, options) {
    // create input element
    const inputElement = document.createElement("input");
    inputElement.setAttribute("type", "text");
    inputElement.setAttribute("placeholder", options.placeholder);
    containerElement.appendChild(inputElement);

    /* Current autocomplete items data (GeoJSON.Feature) */
    let currentItems;

    /* Active request promise reject function. To be able to cancel the promise when a new request comes */
    let currentPromiseReject;

    /* Focused item in the autocomplete list. This variable is used to navigate with buttons */
    let focusedItemIndex;

    /* Execute a function when someone writes in the text field: */
    inputElement.addEventListener("input", function (e) {
        let currentValue = this.value;

        /* Close any already open dropdown list */
        closeDropDownList();

        // Cancel previous request promise
        if (currentPromiseReject) {
            currentPromiseReject({
                canceled: true
            });
        }

        /* Create a new promise and send geocoding request */
        const promise = new Promise((resolve, reject) => {
            currentPromiseReject = reject;

            const apiKey = "81cda06477964467af0be6387ec25d3a";
            const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(currentValue)}&limit=5&apiKey=${apiKey}`;

            if (options.type) {
                url += `&type=${options.type}`;
            }

            fetch(url)
                .then(response => {
                    // check if the call was successful
                    if (response.ok) {
                        response.json().then(data => resolve(data));
                    } else {
                        response.json().then(data => reject(data));
                    }
                });
        });

        promise.then((data) => {
            currentItems = data.features;

            /*create a DIV element that will contain the items (values):*/
            const autocompleteItemsElement = document.createElement("div");
            autocompleteItemsElement.setAttribute("class", "autocomplete-items");
            containerElement.appendChild(autocompleteItemsElement);

            /* For each item in the results */
            data.features.forEach((feature, index) => {
                /* Create a DIV element for each element: */
                const itemElement = document.createElement("DIV");
                /* Set formatted address as item value */
                itemElement.innerHTML = feature.properties.formatted;

                /* Set the value for the autocomplete text field and notify: */
                itemElement.addEventListener("click", function (e) {
                    inputElement.value = currentItems[index].properties.formatted;

                    callback(currentItems[index]);

                    /* Close the list of autocompleted values: */
                    closeDropDownList();
                });

                autocompleteItemsElement.appendChild(itemElement);
            });
        }, (err) => {
            if (!err.canceled) {
                console.log(err);
            }
        });
    });

    /* Add support for keyboard navigation */
    inputElement.addEventListener("keydown", function (e) {
        const autocompleteItemsElement = containerElement.querySelector(".autocomplete-items");
        if (autocompleteItemsElement) {
            const itemElements = autocompleteItemsElement.getElementsByTagName("div");
            if (e.keyCode == 40) {
                e.preventDefault();
                /*If the arrow DOWN key is pressed, increase the focusedItemIndex variable:*/
                focusedItemIndex = focusedItemIndex !== itemElements.length - 1 ? focusedItemIndex + 1 : 0;
                /*and and make the current item more visible:*/
                setActive(itemElements, focusedItemIndex);
            } else if (e.keyCode == 38) {
                e.preventDefault();

                /*If the arrow UP key is pressed, decrease the focusedItemIndex variable:*/
                focusedItemIndex = focusedItemIndex !== 0 ? focusedItemIndex - 1 : focusedItemIndex = (itemElements.length - 1);
                /*and and make the current item more visible:*/
                setActive(itemElements, focusedItemIndex);
            } else if (e.keyCode == 13) {
                /* If the ENTER key is pressed and value as selected, close the list*/
                e.preventDefault();
                if (focusedItemIndex > -1) {
                    closeDropDownList();
                }
            }
        } else {
            if (e.keyCode == 40) {
                /* Open dropdown list again */
                const event = document.createEvent('Event');
                event.initEvent('input', true, true);
                inputElement.dispatchEvent(event);
            }
        }
    });

    function setActive(items, index) {
        if (!items || !items.length) return false;

        for (let i = 0; i < items.length; i++) {
            items[i].classList.remove("autocomplete-active");
        }

        /* Add class "autocomplete-active" to the active element*/
        items[index].classList.add("autocomplete-active");

        // Change input value and notify
        inputElement.value = currentItems[index].properties.formatted;
        callback(currentItems[index]);
    }

    function closeDropDownList() {
        const autocompleteItemsElement = containerElement.querySelector(".autocomplete-items");
        if (autocompleteItemsElement) {
            containerElement.removeChild(autocompleteItemsElement);
        }

        focusedItemIndex = -1;
    }

    /* Close the autocomplete dropdown when the document is clicked. 
        Skip, when a user clicks on the input field */
    document.addEventListener("click", function (e) {
        if (e.target !== inputElement) {
            closeDropDownList();
        } else if (!containerElement.querySelector(".autocomplete-items")) {
            // open dropdown list again
            var event = document.createEvent('Event');
            event.initEvent('input', true, true);
            inputElement.dispatchEvent(event);
        }
    });

}

addressAutocomplete(document.getElementById("autocomplete-container"), (data) => {
    console.log("Selected option: ");
    console.log(data);
    calcDistance(data);
}, {
    placeholder: "Enter an address here"
});


function calcDistance(data){
    let MY_COORDS = {
        lat: 48.8589507, 
        lon: 2.2770205
    };
    
    let SCOPE_COORDS = {
        lat: data.properties.lat,
        lon: data.properties.lon
    };
    
    let getDistance = Distance.between(MY_COORDS, SCOPE_COORDS);
    
    console.log('' + getDistance.human_readable());
    
    if(data.properties.city == 'Paris'){
        console.log("We are in Paris");
    } else {
        console.log("Not in Paris")
    }
}



