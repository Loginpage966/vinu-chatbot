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
    lower.startsWith("who is ") ||
    lower.startsWith("what is ") ||
    lower.startsWith("what are ") ||
    lower.startsWith("tell me about ")
  ) {
    const topic = message.replace(/(who is |what is |what are |tell me about )/i, "").trim();
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
    { keywords: ["micro‑organisms"], reply: "Micro-organisms are tiny living organisms that can only be seen under a microscope. They include bacteria, viruses, fungi, and protozoa. Micro-organisms play essential roles in various ecosystems, including nutrient cycling, decomposition, and even human health." },
    { keywords: ["bacteria"], reply: "Bacteria are single-celled organisms that can be found in various environments, including soil, water, and the human body. They can be beneficial or harmful, playing crucial roles in processes like digestion and disease." },
    { keywords: ["virus"], reply: "Viruses are microscopic infectious agents that can only replicate inside the living cells of an organism. They can cause diseases in humans, animals, and plants, and are composed of genetic material (DNA or RNA) surrounded by a protein coat." },
    { keywords: ["fungi"], reply: "Fungi are a diverse group of organisms that include yeasts, molds, and mushrooms. They play important roles in decomposition and nutrient cycling, and some can cause diseases in plants and animals." },
    { keywords: ["protozoa"], reply: "Protozoa are single-celled eukaryotic organisms that can be found in various environments, including water and soil. They are often motile and can be free-living or parasitic, playing important roles in ecosystems as predators of bacteria and other microorganisms." },
    { keywords: ["algae"], reply: "Algae are simple, photosynthetic organisms that can be found in various aquatic environments. They range from single-celled phytoplankton to large seaweeds and play a crucial role in producing oxygen and serving as a food source for many aquatic organisms." },
    { keywords: ["pathogen"], reply: "A pathogen is a microorganism that can cause disease in its host. Pathogens can include bacteria, viruses, fungi, and protozoa, and they can infect humans, animals, and plants." },
    { keywords: ["disease"], reply: "A disease is a disorder of structure or function in a living organism, often characterized by specific signs and symptoms. Diseases can be caused by various factors, including pathogens, genetic mutations, environmental influences, and lifestyle choices." },
    { keywords: ["antibiotic"], reply: "An antibiotic is a type of medication used to treat bacterial infections by killing or inhibiting the growth of bacteria. Antibiotics are ineffective against viral infections." },
    { keywords: ["examples for antibiotics"], reply: "Some common examples of antibiotics include penicillin, amoxicillin, and ciprofloxacin." },
    { keywords: ["toxins"], reply: "Bio-chemical substances produced by pathogenic bacteria which harm the host's activity are known as toxins.    This is the definition for toxins, is there anything else to talk about." },
    { keywords: ["countries in the world"], reply: `
      <strong>🌍 Here are some countries in the world:</strong><br>
      <ul>
        <li>🇺🇸 United States</li>
        <li>🇮🇳 India</li>
        <li>🇧🇷 Brazil</li>
        <li>🇯🇵 Japan</li>
        <li>🇫🇷 France</li>
        <li>🇬🇧 United Kingdom</li>
        <li>🇨🇳 China</li>
        <li>🇿🇦 South Africa</li>
        <li>🇷🇺 Russia</li>
        <li>🇪🇬 Egypt</li>
      </ul>
    ` }
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

});

