const scrollButton = document.getElementById('scroll-button');
const message = document.querySelector("#message")



// scroll page
scrollButton.addEventListener("click", () => {
    window.scroll({ top: topOfMain, behavior: "smooth" });
  })

// contact message count
const handleMessageCount = () => {
    let msg = document.getElementById("message").value;
    let msgCount = document.getElementById("message-count")
    let msgLength = msg.length;
    const maxLength = 1000;
    let charLeft = maxLength - msgLength;
    msgCount.innerText = charLeft;
};

message.addEventListener("input", handleMessageCount);

const contactMessage = document.querySelector('.success-message');
    if (window.location.search.includes('success')) {
    contactMessage.innerHTML = "Thank you for your message, I'll get back to you as soon as I can &#128578;"
}