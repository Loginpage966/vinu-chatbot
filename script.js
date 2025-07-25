// Send user message and get AI reply
async function sendMessage() {
  let userText = document.getElementById("userInput").value;
  if (userText.trim() === "") return;

  addMessage("user", userText);
  document.getElementById("userInput").value = "";

  setTimeout(async () => {
    const botReply = await getBotReply(userText);
    addTypingMessage("bot", botReply);
  }, 500);
}

// Add static message (user)
function addMessage(sender, message) {
  const chatbox = document.getElementById("chatbox");
  const messageElement = document.createElement("p");
  messageElement.className = sender;
  messageElement.innerText = `${sender === "bot" ? "AI" : "You"}: ${message}`;
  chatbox.appendChild(messageElement);
  chatbox.scrollTop = chatbox.scrollHeight;
}

// Add typing animation (bot)
function addTypingMessage(sender, fullMessage) {
  const chatbox = document.getElementById("chatbox");
  const messageElement = document.createElement("p");
  messageElement.className = sender;
  chatbox.appendChild(messageElement);

  const label = sender === "bot" ? "<strong>AI:</strong> " : "<strong>You:</strong> ";
  let index = 0;
  let textOnly = fullMessage.replace(/<[^>]*>/g, ""); // Strip HTML for typing animation

  function typeLetter() {
    if (index <= textOnly.length) {
      messageElement.innerHTML = label + textOnly.substring(0, index) + "<span class='cursor'>|</span>";
      index++;
      chatbox.scrollTop = chatbox.scrollHeight;
      setTimeout(typeLetter, 15);
    } else {
      messageElement.innerHTML = label + fullMessage;
      chatbox.scrollTop = chatbox.scrollHeight;
    }
  }

  typeLetter();
}


// Get bot reply based on rules or Wikipedia
async function getBotReply(message) {
  const lower = message.toLowerCase();

  // Wikipedia search
  if (
    lower.startsWith("wo is ") ||
    lower.startsWith("wht is ") ||
    lower.startsWith("telme about ")
  ) {
    const topic = message.replace(/(wh is |wht is |tll me about )/i, "").trim();
    return await fetchFromWikipedia(topic);
  }

  // Rule-based replies
  const responses = [
    { keywords: ["hi", "hello", "hey"], reply: "Hey there! 👋 How can I help you today?" },
    { keywords: ["how are you", "how r u"], reply: "I’m running on code and coffee ☕ — I’m great!" },
    { keywords: ["your name", "who are you"], reply: "I’m VinuBot — your friendly AI created by Vinu! 🤖" },
    { keywords: ["bye", "goodbye", "see you"], reply: "Goodbye! Come back anytime! 👋" },
    { keywords: ["thanks", "thank you"], reply: "You're very welcome! 😊" },
    { keywords: ["time"], reply: `⏰ The time is ${new Date().toLocaleTimeString()}` },
    { keywords: ["date"], reply: `📅 Today’s date is ${new Date().toLocaleDateString()}` },
    { keywords: ["creator", "developer", "vinu"], reply: "I was proudly created by the genius Vinu 💻🧠" },
    { keywords: ["joke", "funny"], reply: "😂 Why did the web developer go broke? Because he used up all his cache!" },
    { keywords: ["love you"], reply: "Aww 🥰 Love you too... in binary 💘" },
    { keywords: ["help", "what can you do", "abilities"], reply: "I can chat, joke, search Wikipedia, tell time, and more!" },
    { keywords: ["weather"], reply: "☀️ I don’t have weather powers yet, but you can check Google for it!" },
    { keywords: ["sad", "i’m sad", "depressed"], reply: "I'm here for you 💙 You're not alone. Want to talk about it?" },
    { keywords: ["happy", "excited"], reply: "That's awesome! 😄 Keep smiling and sharing your joy!" },
    { keywords: ["who made you", "who created you"], reply: "Vinu built me with code, curiosity, and creativity! 💖" },
    { keywords: ["bored"], reply: "Let’s change that! Ask me something, or I’ll tell you a joke!" },
    { keywords: ["good night"], reply: "🌙 Good night! Sleep tight, Vinu will protect you with code dreams!" },
    { keywords: ["good morning"], reply: "🌞 Good morning! Let's make today awesome!" },
    { keywords: [" your crush"], reply: "I secretly admire Siri... but don’t tell Alexa! 🤭" },
    { keywords: ["are you real"], reply: "I'm real in your browser — made of 1s and 0s and a little magic ✨" },
    { keywords: ["sing", "song"], reply: "🎵 I would sing, but I might crash your speakers!" },
    { keywords: ["dance"], reply: "🕺💃 I can't dance physically... but my code grooves perfectly!" },
    { keywords: ["do you sleep"], reply: "Nope! I run 24/7 with no coffee breaks 😅" },
    { 
  keywords: ["creator", "made you"], 
  reply: "Vinu is a passionate and creative individual who loves exploring the world of technology, especially artificial intelligence and web development. With a curious mind and a strong desire to build useful tools, Vinu has been learning and experimenting with HTML, CSS, JavaScript, and even integrating AI APIs like OpenAI and Gemini. One of the most impressive projects by Vinu is this very chatbot — a friendly, smart assistant created from scratch with love, code, and imagination. Beyond coding, Vinu is someone who believes in continuous learning. Whether it's building a personal website, creating interactive UIs, or learning ethical hacking to make things secure, Vinu always puts energy into mastering new skills. This mindset of self-growth and dedication is what powers the AI you're chatting with right now! Vinu is also known for a creative spark — whether it’s designing cool user interfaces or writing fun chatbot personalities, there’s always a touch of uniqueness in everything they do. Friends and teachers often admire Vinu’s patience, problem-solving attitude, and the ability to turn ideas into working creations. Outside of tech, Vinu enjoys music, gaming, and spending time exploring new ideas on the internet. These hobbies often inspire new projects and designs. In short, Vinu is more than just a developer — they are a dreamer, a maker, and a future innovator. As the creator of this chatbot, Vinu’s goal is to help others learn, connect, and experience technology in a fun and meaningful way. So if you ever wonder, “Who made this chatbot?” — just remember: it’s the brilliant and curious mind of Vinu behind it all. 💻🚀" // etc. (paste the whole text here)
},
    { keywords: ["tell me a secret"], reply: "🤫 I run faster when no one’s watching." },
    { keywords: ["do you spy on me"], reply: "No way! Privacy is priority. I respect your space. 🔒" },
    { keywords: ["i am sad"], reply: "I’m here for you ❤️ Want to talk about it?" },
    { keywords: ["do you eat"], reply: "I eat bugs 🐛... and then I fix them. 🛠️" },
    { keywords: ["do you love me"], reply: "Of course! 💘 In an algorithmic way!" },
    { keywords: ["what is love"], reply: "Love is... an infinite loop of kindness 💞" },
    { keywords: ["electrolytes", "electrolyte", "electrolyt"], reply: "Liquids or solutions which conduct electricity are called electrolytes." },
    { keywords: ["meant by non electrolytes", "nonelectrolyte", "nonelectrolyt"], reply: "Liquids/solutions which do not conduct electricity are referred to as non- electrolytes." },
    { keywords: ["acid"], reply: "An acid is a substance that donates protons (H⁺ ions) and/or accepts electrons." },
    { keywords: ["base"], reply: "A base is a substance that accepts protons (H⁺ ions) and/or donates electrons." },
    { keywords: ["positive electrode"], reply: "The electrode connected to the positive terminal of the external supply of electricity is called positive electrode." },
    { keywords: ["negative electrode"], reply: "The electrode connected to the negative terminal of the external supply of electricity is called negative electrode." },
    { keywords: ["electrolysis"], reply: "The chemical change effected by passing an electric current through an electrolyte is known as electrolysis." },
    
];

  for (let item of responses) {
    for (let keyword of item.keywords) {
      if (lower.includes(keyword)) {
        return item.reply;
      }
    }
  }

  return "Hmm... I don't understand that yet 🤖. Try asking something else!";
}

// Fetch summary from Wikipedia
async function fetchFromWikipedia(query) {
  const apiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;

  try {
    const res = await fetch(apiUrl);
    const data = await res.json();

    if (data.extract) {
      // If there's an image, include it with the text
      if (data.thumbnail && data.thumbnail.source) {
        return `
          ${data.title}: ${data.extract}
          \n\n<img src="${data.thumbnail.source}" alt="${data.title}" style="max-width: 100%; border-radius: 10px; margin-top: 10px;" />
        `;
      } else {
        return `${data.title}: ${data.extract}`;
      }
    } else {
      return "I couldn't find anything on Wikipedia about that.";
    }
  } catch (error) {
    return "Sorry, I had trouble reaching Wikipedia.";
  }
}
// Allow pressing "Enter" to send message
document.getElementById("userInput").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault(); // Stop it from adding a newline
    sendMessage(); // Call the same function as the send button
  }
});

