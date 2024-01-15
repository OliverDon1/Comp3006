let accountsData = "";
const loginUsername = document.getElementById("loginUsername");
const loginPassword = document.getElementById("loginPassword");
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
        document.getElementById("loginButton").addEventListener("click", changePageLogin);
        async function changePageLogin() {
            for(let x = 0 ; x <= accountsData.length ; x++ ){
                let name1 = accountsData[x].username;
                let name2 = loginUsername.value ;
                let password1 = accountsData[x].password;
                let password2 = loginPassword.value;
                if(name1 == name2 && password1 == password2){
                    const params = new URLSearchParams;
                    params.append('user',name1);
                    window.location.href = `/mainPage.html?user=${encodeURIComponent(name1)}`;
                }
        
            }
        }
        document.getElementById("createAccountButton").addEventListener("click", () =>{
            window.location.href = "/newAccount.html"
        })

    }
});

