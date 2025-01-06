const xhr = new XMLHttpRequest();

xhr.addEventListener('load',()=>{// load is response is loading
    xhr.response;
}); 

xhr.open('GET','https://supersimplebackend.dev');
xhr.send(); // Viene triggherato EventListener
