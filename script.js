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
      setTimeout(typeLetter, 1);
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
    { keywords: ["❤️", "💕"], reply: `<strong>❤️ What's on your mind?</strong><br> ` },
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
    { keywords: ["🙏 You're welcome!"
    { keywords: ["countries in the world"], reply: `
      <strong>There are 195 countries in the world today. This total comprises 193 countries that are member states of the United Nations and 2 countries that are non-member observer states: the Holy See and the State of Palestine.</strong><br>
      <strong>🌍 Here are all the countries in the world:</strong><br>
      <ul>
        <li>🇦🇫 Afghanistan</li>
<li>🇦🇱 Albania</li>
<li>🇩🇿 Algeria</li>
<li>🇦🇩 Andorra</li>
<li>🇦🇴 Angola</li>
<li>🇦🇬 Antigua & Barbuda</li>
<li>🇦🇷 Argentina</li>
<li>🇦🇲 Armenia</li>
<li>🇦🇺 Australia</li>
<li>🇦🇹 Austria</li>
<li>🇦🇿 Azerbaijan</li>
<li>🇧🇸 Bahamas</li>
<li>🇧🇭 Bahrain</li>
<li>🇧🇩 Bangladesh</li>
<li>🇧🇧 Barbados</li>
<li>🇧🇾 Belarus</li>
<li>🇧🇪 Belgium</li>
<li>🇧🇿 Belize</li>
<li>🇧🇯 Benin</li>
<li>🇧🇹 Bhutan</li>
<li>🇧🇴 Bolivia</li>
<li>🇧🇦 Bosnia & Herzegovina</li>
<li>🇧🇼 Botswana</li>
<li>🇧🇷 Brazil</li>
<li>🇧🇳 Brunei</li>
<li>🇧🇬 Bulgaria</li>
<li>🇧🇫 Burkina Faso</li>
<li>🇧🇮 Burundi</li>
<li>🇨🇻 Cabo Verde</li>
<li>🇰🇭 Cambodia</li>
<li>🇨🇲 Cameroon</li>
<li>🇨🇦 Canada</li>
<li>🇨🇫 Central African Republic</li>
<li>🇹🇩 Chad</li>
<li>🇨🇱 Chile</li>
<li>🇨🇳 China</li>
<li>🇨🇴 Colombia</li>
<li>🇰🇲 Comoros</li>
<li>🇨🇬 Congo - Brazzaville</li>
<li>🇨🇩 Congo - Kinshasa</li>
<li>🇨🇷 Costa Rica</li>
<li>🇭🇷 Croatia</li>
<li>🇨🇺 Cuba</li>
<li>🇨🇾 Cyprus</li>
<li>🇨🇿 Czechia</li>
<li>🇩🇰 Denmark</li>
<li>🇩🇯 Djibouti</li>
<li>🇩🇲 Dominica</li>
<li>🇩🇴 Dominican Republic</li>
<li>🇪🇨 Ecuador</li>
<li>🇪🇬 Egypt</li>
<li>🇸🇻 El Salvador</li>
<li>🇬🇶 Equatorial Guinea</li>
<li>🇪🇷 Eritrea</li>
<li>🇪🇪 Estonia</li>
<li>🇸🇿 Eswatini</li>
<li>🇪🇹 Ethiopia</li>
<li>🇫🇯 Fiji</li>
<li>🇫🇮 Finland</li>
<li>🇫🇷 France</li>
<li>🇬🇦 Gabon</li>
<li>🇬🇲 Gambia</li>
<li>🇬🇪 Georgia</li>
<li>🇩🇪 Germany</li>
<li>🇬🇭 Ghana</li>
<li>🇬🇷 Greece</li>
<li>🇬🇩 Grenada</li>
<li>🇬🇹 Guatemala</li>
<li>🇬🇳 Guinea</li>
<li>🇬🇼 Guinea-Bissau</li>
<li>🇬🇾 Guyana</li>
<li>🇭🇹 Haiti</li>
<li>🇭🇳 Honduras</li>
<li>🇭🇺 Hungary</li>
<li>🇮🇸 Iceland</li>
<li>🇮🇳 India</li>
<li>🇮🇩 Indonesia</li>
<li>🇮🇷 Iran</li>
<li>🇮🇶 Iraq</li>
<li>🇮🇪 Ireland</li>
<li>🇮🇱 Israel</li>
<li>🇮🇹 Italy</li>
<li>🇯🇲 Jamaica</li>
<li>🇯🇵 Japan</li>
<li>🇯🇴 Jordan</li>
<li>🇰🇿 Kazakhstan</li>
<li>🇰🇪 Kenya</li>
<li>🇰🇮 Kiribati</li>
<li>🇰🇼 Kuwait</li>
<li>🇰🇬 Kyrgyzstan</li>
<li>🇱🇦 Laos</li>
<li>🇱🇻 Latvia</li>
<li>🇱🇧 Lebanon</li>
<li>🇱🇸 Lesotho</li>
<li>🇱🇷 Liberia</li>
<li>🇱🇾 Libya</li>
<li>🇱🇮 Liechtenstein</li>
<li>🇱🇹 Lithuania</li>
<li>🇱🇺 Luxembourg</li>
<li>🇲🇬 Madagascar</li>
<li>🇲🇼 Malawi</li>
<li>🇲🇾 Malaysia</li>
<li>🇲🇻 Maldives</li>
<li>🇲🇱 Mali</li>
<li>🇲🇹 Malta</li>
<li>🇲🇭 Marshall Islands</li>
<li>🇲🇷 Mauritania</li>
<li>🇲🇺 Mauritius</li>
<li>🇲🇽 Mexico</li>
<li>🇫🇲 Micronesia</li>
<li>🇲🇩 Moldova</li>
<li>🇲🇨 Monaco</li>
<li>🇲🇳 Mongolia</li>
<li>🇲🇪 Montenegro</li>
<li>🇲🇦 Morocco</li>
<li>🇲🇿 Mozambique</li>
<li>🇲🇲 Myanmar</li>
<li>🇳🇦 Namibia</li>
<li>🇳🇷 Nauru</li>
<li>🇳🇵 Nepal</li>
<li>🇳🇱 Netherlands</li>
<li>🇳🇿 New Zealand</li>
<li>🇳🇮 Nicaragua</li>
<li>🇳🇪 Niger</li>
<li>🇳🇬 Nigeria</li>
<li>🇲🇰 North Macedonia</li>
<li>🇰🇵 North Korea</li>
<li>🇳🇴 Norway</li>
<li>🇴🇲 Oman</li>
<li>🇵🇰 Pakistan</li>
<li>🇵🇼 Palau</li>
<li>🇵🇸 Palestine</li>
<li>🇵🇦 Panama</li>
<li>🇵🇬 Papua New Guinea</li>
<li>🇵🇾 Paraguay</li>
<li>🇵🇪 Peru</li>
<li>🇵🇭 Philippines</li>
<li>🇵🇱 Poland</li>
<li>🇵🇹 Portugal</li>
<li>🇶🇦 Qatar</li>
<li>🇷🇴 Romania</li>
<li>🇷🇺 Russia</li>
<li>🇷🇼 Rwanda</li>
<li>🇰🇳 Saint Kitts & Nevis</li>
<li>🇱🇨 Saint Lucia</li>
<li>🇻🇨 Saint Vincent & Grenadines</li>
<li>🇼🇸 Samoa</li>
<li>🇸🇲 San Marino</li>
<li>🇸🇹 São Tomé & Príncipe</li>
<li>🇸🇦 Saudi Arabia</li>
<li>🇸🇳 Senegal</li>
<li>🇷🇸 Serbia</li>
<li>🇸🇨 Seychelles</li>
<li>🇸🇱 Sierra Leone</li>
<li>🇸🇬 Singapore</li>
<li>🇸🇰 Slovakia</li>
<li>🇸🇮 Slovenia</li>
<li>🇸🇧 Solomon Islands</li>
<li>🇸🇴 Somalia</li>
<li>🇿🇦 South Africa</li>
<li>🇰🇷 South Korea</li>
<li>🇸🇸 South Sudan</li>
<li>🇪🇸 Spain</li>
<li>🇱🇰 Sri Lanka</li>
<li>🇸🇩 Sudan</li>
<li>🇸🇷 Suriname</li>
<li>🇸🇪 Sweden</li>
<li>🇨🇭 Switzerland</li>
<li>🇸🇾 Syria</li>
<li>🇹🇼 Taiwan</li>
<li>🇹🇯 Tajikistan</li>
<li>🇹🇿 Tanzania</li>
<li>🇹🇭 Thailand</li>
<li>🇹🇱 Timor-Leste</li>
<li>🇹🇬 Togo</li>
<li>🇹🇴 Tonga</li>
<li>🇹🇹 Trinidad & Tobago</li>
<li>🇹🇳 Tunisia</li>
<li>🇹🇷 Turkey</li>
<li>🇹🇲 Turkmenistan</li>
<li>🇹🇻 Tuvalu</li>
<li>🇺🇬 Uganda</li>
<li>🇺🇦 Ukraine</li>
<li>🇦🇪 United Arab Emirates</li>
<li>🇬🇧 United Kingdom</li>
<li>🇺🇸 United States</li>
<li>🇺🇾 Uruguay</li>
<li>🇺🇿 Uzbekistan</li>
<li>🇻🇺 Vanuatu</li>
<li>🇻🇪 Venezuela</li>
<li>🇻🇳 Vietnam</li>
<li>🇾🇪 Yemen</li>
<li>🇿🇲 Zambia</li>
<li>🇿🇼 Zimbabwe</li>
</ul>
    ` },
    { keywords: ["history of Sri Lanka"], reply: "Sri Lanka's history dates back to the 6th century BCE, with the arrival of Prince Vijaya. The island nation has been influenced by various cultures, including Buddhism, Hinduism, and European colonial powers. From ancient kingdoms to colonial rule and independence, Sri Lanka's history is rich and complex." },
    { keywords: ["❤", "🧡", "💛", "💚", "💙", "💜", "🤎", "🖤", "💕"], reply: "I’m here for you ❤️ Want to talk about Love?" },
    { keywords: ["srilanka capital"], reply: "The capital of Sri Lanka is Sri Jayawardenepura Kotte (administrative capital) and Colombo (commercial capital)." },
    { keywords: ["srilanka culture"], reply: "Sri Lankan culture is a rich blend of Buddhist, Hindu, Muslim, and Western influences. It's known for its vibrant festivals, delicious cuisine, and traditional arts." },
    { keywords: ["srilanka tourist attractions"], reply: "Some popular tourist attractions in Sri Lanka include Sigiriya (Lion's Rock), Kandy (the cultural capital), Mirissa Beach, and Yala National Park."}

];

  for (let item of responses) {
    for (let keyword of item.keywords) {
      if (lower.includes(keyword)) {
        return item.reply;
      }
    }
  }

  return `Hmm... I don't understand that yet 🤖. You can try searching on Google:<br>
<a href="https://www.google.com/search?q=${encodeURIComponent(message)}" target="_blank" rel="noopener noreferrer">Search Google for "${message}"</a>`;
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
document.getElementById("userInput").addEventListener("paste", function (e) {
  e.preventDefault();
  alert("🚫 Pasting is disabled!");
});

const emojiMap = {
  happy: "😊",
  hello: "👋",
  hi: "👋",
  sad: "😢",
  love: "❤️",
  fire: "🔥",
  angry: "😠",
  cool: "😎",
  laugh: "😂",
  thank: "🙏",
  clap: "👏",
  wow: "😮",
  scared: "😱",
  party: "🎉",
  bored: "🥱",
  sleep: "😴",
  tired: "😫",
  food: "🍕",
  idea: "💡",
};

function showEmojiSuggestions() {
  const input = document.getElementById("input").value.toLowerCase();
  const suggestionBox = document.getElementById("emoji-suggestions");
  suggestionBox.innerHTML = "";

  for (const [word, emoji] of Object.entries(emojiMap)) {
    if (input.includes(word)) {
      const span = document.createElement("span");
      span.className = "emoji-suggestion";
      span.textContent = emoji;
      span.onclick = () => {
        document.getElementById("input").value += " " + emoji;
        suggestionBox.innerHTML = "";
      };
      suggestionBox.appendChild(span);
    }
  }
}
