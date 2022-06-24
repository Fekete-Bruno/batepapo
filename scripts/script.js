
let userName = prompt('Digite o seu nome de usuário:');
testUsername(); 

const messageboard = document.querySelector('ul');
let lastMessage = '';
let lastFrom='';
//let myInterval2;

function testUsername(){
    let user =  {
                    name: userName
                }
    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants',user);

    promise.then();
    promise.catch(tryAgain);
}

function loadMessages(){
    const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promise.then(showMessages);
    promise.catch(logError);
}

function showMessages(response){
    messageboard.innerHTML = '';

    // Writes all messages:
    for (let i = 0; i < response.data.length; i++) {
        writeMessage(response.data[i]);
    }

    // Scroll into view if the message is different:
    let lastText = response.data[response.data.length-1].text;
    let lastUser = response.data[response.data.length-1].from;
    scrollMessages(lastText,lastUser);
};

function writeMessage (message){
    switch(message.type){

        case 'status':
            messageboard.innerHTML+=`
                <li class="box ${message.type}"> 
                    <span class="timestamp">${message.time}</span>
                    <span class="username">${message.from}</span><span>${message.text}</span>
                 </li>`
            break;

        case 'message':
            messageboard.innerHTML+=`
                <li class="box ${message.type}">
                    <span class="timestamp">${message.time}</span>
                    <span class="username">${message.from}</span> para <span class="username">${message.to}</span> <span>${message.text}</span>
                </li>
            `
            break;
        case 'private_message':
            if(message.to === userName || message.to === 'Todos'){
                messageboard.innerHTML+=`
                <li class="box ${message.type}">
                    <span class="timestamp">${message.time}</span>
                    <span class="username">${message.from}</span> para <span class="username">${message.to}</span> <span>${message.text}</span>
                </li>
            `
            }
    }
}

function scrollMessages(lastText,lastUser){
    if (lastText !== lastMessage || lastUser !== lastFrom){
        lastMessage = lastText;
        lastFrom = lastUser;
        document.querySelectorAll('.box')[document.querySelectorAll('.box').length-1].scrollIntoView();
    }
}

function logError(error) {
    console.log("Status code: " + error.response.status);
    console.log("Error message: " + error.response.data); 
}
function tryAgain(error){
    logError(error);
    userName = prompt('Erro! Digite novamente seu nome de usuário:');
    testUsername();
}
// function isOnline(){
//     myInterval2 = setInterval(pingServer,4000);
// }

// function pingServer(){
//     const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants',{name:userName});
// }

loadMessages();
const myInterval = setInterval(loadMessages,3000);