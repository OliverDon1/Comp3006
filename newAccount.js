let accountsData = "";
document.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await fetch('/getAccounts');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        accountsData = await response.json();
    } catch (error) {
        console.error('Error retrieving accounts data:', error);
    }
    finally{
        document.getElementById("backButton").addEventListener("click",() =>{
            window.location.href = "/index.html";
        })
        document.getElementById("saveButton").addEventListener("click", () =>{
            console.log("test");
            let usernameBox = document.getElementById("usernameInput");
            let newUsername = usernameBox.value;
            let passwordBox = document.getElementById("passwordInput");
            let newPassword = passwordBox.value;
            let messageDiv = document.getElementById("message");
            for(let i = 0 ; i < accountsData.length ; i++){
                if(accountsData[i].username == newUsername){
                    messageDiv.innerHTML = "Unable To Create Account : Username Taken"
                    messageDiv.style.color = "red";
                }
    
            }
            if(newUsername == undefined){
                messageDiv.innerHTML = "Unable To Create Account : Username Box Empty"
                messageDiv.style.color = "red";
            }
            if(newPassword == undefined){
                messageDiv.innerHTML = "Unable To Create Account : Password Box Empty"
                messageDiv.style.color = "red";
            }
            else{
                const socket = io();
                async function saveNewAccount() {
                try {
                    const username = newUsername; 
                    const password = newPassword; 

                    socket.emit('accountNew', { username, password });
                } catch (error) {
                    console.error("Error updating account:", error);
                }
                }
                saveNewAccount();
                messageDiv.innerHTML = "Account Created Successfully"
                messageDiv.style.color = "green";
            }
        })
    }
})