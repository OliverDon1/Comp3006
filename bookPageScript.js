let bookTitle = "";
let bookData = "";
let bookNumber = "";
let currentUser = "";
let accountData = "";
document.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await fetch('/getAccounts');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        accountData = await response.json();
    } catch (error) {
        console.error('Error retrieving accounts data:', error);
    }
    finally{
        console.log(accountData);

    }
    try {
        const response = await fetch('/getBooks');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const urlParams = new URLSearchParams(window.location.search);
        bookTitle = urlParams.get('title');
        currentUser = urlParams.get('user');
        console.log(currentUser);
        bookData = await response.json();
    } catch (error) {
        console.error('Error retrieving accounts data:', error);
    }
    finally{
        let account = "";
        console.log(bookTitle);
        for(let i = 0; i < bookData.length ; i++){
            if(bookData[i].name == bookTitle){
                bookNumber = i;
                break
            }
        }
        for(let i = 0 ; i < accountData.length; i++){
            if(accountData[i].username == currentUser){
                account = accountData[i];
                break
            }
        }
        console.log(account);
        console.log(bookData);
        let accountCRB = account.CRB;
        const bookTitlePreview = document.createElement("div");
        bookTitlePreview.innerText = `Title: ${bookData[bookNumber].name}`;
        bookTitlePreview.id = "bookTitle";
        const bookImagePreview = document.createElement("img");
        bookImagePreview.id = "bookImage";
        bookImagePreview.src = bookData[bookNumber].url;
        bookImagePreview.height = 500;
        bookImagePreview.width = 300;
        document.body.appendChild(bookTitlePreview);
        document.body.appendChild(bookImagePreview);
        const bookDescPreview = document.createElement("div");
        bookDescPreview.innerText = bookData[bookNumber].description;
        bookDescPreview.id = "bookDescription";
        document.body.appendChild(bookDescPreview);
        const availabilityPreview = document.createElement("div");
        const reserveButton = document.createElement("button");
        reserveButton.innerText = "Reserve Book";
        reserveButton.style.visibility = "hidden";
        reserveButton.id = "reserveButton";
        if(bookData[bookNumber].available){
            availabilityPreview.innerText = "Availability: Currently Availible ";
            availabilityPreview.style.color = "green";
            reserveButton.style.visibility = "visible";
        }
        else{
            availabilityPreview.innerText = "Availability: Currently Unavailible ";
            availabilityPreview.style.color = "red";
        }
        availabilityPreview.id = "bookAvailability";
        document.body.appendChild(availabilityPreview);
        document.body.appendChild(reserveButton);
        const returnButton = document.createElement("button");
        returnButton.innerText = "Back To Book List";
        returnButton.id = "returnButton";
        document.body.appendChild(returnButton);
        document.getElementById("returnButton").addEventListener("click", () => {
            window.location.href = `/mainPage.html?user=${encodeURIComponent(account.username)}`;
        });
        document.getElementById("reserveButton").addEventListener("click", async () => {
            try {
                const response = await fetch("/reserveBook", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ name: bookData[bookNumber].name , genre : bookData[bookNumber].genre, available : false, description : bookData[bookNumber].description , url : bookData[bookNumber].description}),
                });
        
                if (response.ok) {
                    const result = await response.json();
                    console.log(result.message);
                } else {
                    const error = await response.json();
                    console.error(error.error);
                }
            } catch (error) {
                console.error("Error reserving book:", error);
            }
            try {
                accountCRB.unshift(bookTitle);
                const response = await fetch("/accountChange", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ username: account.username , password: account.password,  CRB: accountCRB}),
                });
        
                if (response.ok) {
                    const result = await response.json();
                    console.log(result.message);
                    window.location.reload();
                } else {
                    const error = await response.json();
                    console.error(error.error);
                }
            } catch (error) {
                console.error("Error updating account:", error);
            }
        });
            
        
        
    }
});

