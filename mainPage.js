let bookData = "";
document.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await fetch('/getBooks');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        bookData = await response.json();
    } catch (error) {
        console.error('Error retrieving book data:', error);
    }
    finally{
        const urlParams = new URLSearchParams(window.location.search);
        let currentUser = urlParams.get('user');
        const bookslistDiv = document.getElementById("bookList");
        for(let i = 0;i < bookData.length ; i++){
            let bookName = bookData[i].name;
            let bookGenre = bookData[i].genre;
            let bookDiv = document.createElement("div");
            bookDiv.style.border = "1px solid #000";
            bookDiv.classList.add("book");
            bookDiv.innerHTML = `<div>${bookName}</div><p>Genre:${bookGenre}</p>`;
            bookDiv.addEventListener("click", () =>{
                console.log("click");
                window.location.href = `/bookPage.html?user=${encodeURIComponent(currentUser)}&title=${encodeURIComponent(bookName)}`;
            })
            bookslistDiv.appendChild(bookDiv);
        }
        document.getElementById("currentReservedButton").addEventListener("click", () => {
            window.location.href = `/bookReturn.html?user=${encodeURIComponent(currentUser)}`;
        });
        document.getElementById("logoutButton").addEventListener("click",() =>{
            window.location.href = "/index.html";
        });
    }
});
