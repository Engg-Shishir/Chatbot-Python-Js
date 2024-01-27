class Chatbox {
    constructor() {
        this.args = {
            openButton: document.querySelector('.chatbox__button'),
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button')
        }

        this.state = false;
        this.messages = [];
    }

    display() {
        const {openButton, chatBox, sendButton} = this.args;

        openButton.addEventListener('click', () => this.toggleState(chatBox))

        sendButton.addEventListener('click', () => this.onSendButton(chatBox))

        const node = chatBox.querySelector('input');
        node.addEventListener("keyup", ({key}) => {
            if (key === "Enter") {
                this.onSendButton(chatBox)
            }
        })
    }

    toggleState(chatbox) {
        this.state = !this.state;

        // show or hides the box
        if(this.state) {
            chatbox.classList.add('chatbox--active')
        } else {
            chatbox.classList.remove('chatbox--active')
        }
    }

    onSendButton(chatbox) {
        var textField = chatbox.querySelector('input');
        let text1 = textField.value
        if (text1 === "") {
            return;
        }

        let msg1 = { name: "User", message: text1 }
        this.messages.push(msg1);

        fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            body: JSON.stringify({ message: text1 }),
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json'
            },
          })
          .then(r => r.json())
          .then(r => {
            let msg2 = { name: "pstu", message: r.answer };
            this.messages.push(msg2);
            this.updateChatText(chatbox)
            textField.value = ''

        }).catch((error) => {
            console.error('Error:', error);
            this.updateChatText(chatbox)
            textField.value = ''
          });
    }


    updateChatText(chatbox) {
        var html = '';
        this.messages.slice().reverse().forEach(function(item, index) {
            let con = item.message;
            let about = con.about;
            let Image = con.Image;
            let linkedin = con.Linkedin;
            let website = con.website;
                
               console.log(con);

                if (item.name ==="pstu") {
                    html += '<div class="messages__item messages__item--pstu">';
                    
                    if (typeof Image !== 'undefined') {
                        html += '<img class="profile" src="' + Image + '">';
                    }

                    if (typeof about !== 'undefined') {
                        html += '<div>'+con.about+'</div>';
                    }else{
                        html += '<div>'+con+'</div>';
                    }

                    html += '<div class="iconBox">';
                    if (typeof linkedin !== 'undefined') {
                        html +='<a class="iconlink" href="'+linkedin+'"><img class="icon" src="https://i.postimg.cc/nrJNZWkj/free-linkedin-logo-icon-2430-thumb.png"><p>'+con.Linkedin+'</p></a>';
                    }
                    if (typeof website !== 'undefined') {
                        html +='<a class="iconlink" href="'+website+'"><img class="icon" src="https://i.postimg.cc/3N8vDgCS/world-cartoon-symbol-internet-blue-circle-line-area-logo-sphere-png-clipart.jpg"><p>'+con.website+'</p></a>';
                    }
                    html += '</div>';
                  
                    html += '</div>';
                    // Left
                }else{
                    html += '<div class="messages__item messages__item--operator">' + con + '</div>';
                }
            
        });

        const chatmessage = chatbox.querySelector('.chatbox__messages');
        chatmessage.innerHTML = html;
    }
}


const chatbox = new Chatbox();
chatbox.display();