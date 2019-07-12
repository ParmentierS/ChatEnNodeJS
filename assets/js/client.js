(function(){
    let element = function(id){
        return document.getElementById(id);
    }
    // Get Elements
    let status = element('status');
    let messages = element('messages');
    let textarea = element('textarea');
    let username = element('username');
    let clearBtn = element('clear');
    // Set default status
    let statusDefault = status.textContent;
    let setStatus = function(s){
        // Set status
        status.textContent = s;
        if(s !== statusDefault){
            let delay = setTimeout(function(){
                setStatus(statusDefault);
            }, 4000);
        }
    }
    // Connect to socket.io
    let socket = io.connect('http://10.203.0.99:4000');
    // Check for connection
    if(socket !== undefined){
        console.log('Connected to socket...');
        // Handle Output
        socket.on('output', function(data){
            //console.log(data);
            if(data.length){
                for(let x = 0;x < data.length;x++){
                    // Build out message section
                    let message = document.createElement('section');
                    message.setAttribute('class', 'chat-message col-10 offset-1 row');
                    message.textContent = data[x].name+": "+data[x].message;

                    /*let date = document.createElement("p");
                    date.setAttribute('class', 'date-message offset-1 col-4"');
                    date.innerHTML="21/07/2019 25h17"
                    let pseudo = document.createElement("p");
                    pseudo.setAttribute('class', 'pseudo-message offset-1 col-4');
                    pseudo.innerHTML=data[x].name;
                    let messageBody=document.createElement("p");  
                    messageBody.setAttribute('class', 'body-message col-12');  
                    messageBody.innerHTML=data[x].message;
                    message.appendChild(pseudo)
                    message.appendChild(date)      
                    message.appendChild(messageBody) */ 
                    messages.appendChild(message);
                    messages.insertBefore(message, messages.firstChild);
                }
            }
        });
        // Get Status From Server
        socket.on('status', function(data){
            // get message status
            setStatus((typeof data === 'object')? data.message : data);
            // If status is clear, clear text
            if(data.clear){
                textarea.value = '';
            }
        });
        // Handle Input
        textarea.addEventListener('keydown', function(event){
            if(event.which === 13 && event.shiftKey == false){
                // Emit to server input
                socket.emit('input', {
                    name:username.value,
                    message:textarea.value
                });
                event.preventDefault();
            }
        })
        // Handle Chat Clear
        clearBtn.addEventListener('click', function(){
            socket.emit('clear');
        });
        // Clear Message
        socket.on('cleared', function(){
            messages.textContent = '';
        });
    }
})();