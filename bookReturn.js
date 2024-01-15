let accountsData = "";
let bookData = "";

document.addEventListener("DOMContentLoaded", async function () {
    try {
        const responseBooks = await fetch('/getBooks');
        if (!responseBooks.ok) {
            throw new Error(`HTTP error! Status: ${responseBooks.status}`);
        }

        bookData = await responseBooks.json();

        const responseAccounts = await fetch('/getAccounts');
        if (!responseAccounts.ok) {
            throw new Error(`HTTP error! Status: ${responseAccounts.status}`);
        }

        accountsData = await responseAccounts.json();
    } catch (error) {
        console.error('Error retrieving data:', error);
    }

    const urlParams = new URLSearchParams(window.location.search);
    let currentUser = urlParams.get('user');

    for (let i = 0; i < accountsData.length; i++) {
        if (accountsData[i].username == currentUser) {
            currentUser = accountsData[i];
            break;
        }
    }

    
    document.getElementById("backButton").addEventListener("click", () => {
        window.location.href = `/mainPage.html?user=${encodeURIComponent(currentUser.username)}`;
    });
    let CRB = undefined;
    try{
        CRB = currentUser.CRB;
    }
    catch{

    }
    const bookslistDiv = document.getElementById("bookList");
    if (CRB != undefined) {
        for (let i = 0; i < CRB.length; i++) {
            let returnButton = document.createElement("button");
            let bookDiv = document.createElement("div");
            returnButton.id = "returnButton";
            returnButton.innerHTML = `Mark As Return`;
            bookDiv.classList.add("book");
            bookDiv.innerHTML = `<div>${CRB[i]}</div>`;
            bookDiv.style.border = "1px solid #000";
            bookslistDiv.appendChild(bookDiv);
            bookslistDiv.appendChild(returnButton);

            returnButton.addEventListener("click", async () => {
                try {
                    const response = await fetch("/reserveBook", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            name: CRB[i],
                            genre: bookData[i].genre,
                            available: true,
                            description: bookData[i].description,
                            url: bookData[i].url,
                        }),
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
                } finally {
                    let newCRB = CRB.filter((book, index) => index !== i);

                    try {
                        const response = await fetch("/accountChange", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                username: currentUser.username,
                                password: currentUser.password,
                                CRB: newCRB,
                            }),
                        });

                        if (response.ok) {
                            const result = await response.json();
                            console.log(result.message);
                        } else {
                            const error = await response.json();
                            console.error(error.error);
                        }
                    } catch (error) {
                        console.error("Error updating account:", error);
                    }

                    window.location.href = `/bookReturn.html?user=${encodeURIComponent(currentUser.username)}`;
                }
            });
        }
    }
});
