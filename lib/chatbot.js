const ui = `<div class="chatui hidden absolute bottom-4 right-4 w-full h-[80vh] rounded-xl sm:max-w-[400px] z-[99999]">
    <div class="max-w-full w-full bg-transparent justify-end h-full items-end flex flex-col space-y-4 right-0">
      <div class="h-full bg-white flex flex-col rounded-2xl overflow-hidden w-full">
        <div class="accent-color-elem relative rounded-t-2xl flex items-center justify-start w-full h-fit p-4 py-6">
          <button id="toggleButtonClose" class="inline-flex z-[99999999] items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full absolute top-2 text-white right-2 h-fit" style="background: transparent">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x p-1">
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
          <div class="flex items-center justify-center space-x-3">
            <img id="company-logo" alt="company logo" class="w-10 h-10 rounded-full object-cover" />
            <div class="flex flex-col">
              <label id="company-name" class="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-semibold text-white text-lg leading-5 capitalize"></label>
              <label id="company-subheading" class="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize text-white/80 text-xs leading-5"></label>
            </div>
          </div>
        </div>
        <div class="flex flex-col overflow-hidden w-full h-full">
          <div class="w-full h-full bg-white flex items-center justify-center overflow-hidden">
            <div id="messages-list" class="w-full h-full flex flex-col overflow-y-scroll scrollbar-hide"></div>
          </div>
          <div class="border-t"></div>
          <form class="flex items-center">
            <input class="flex w-full rounded-md border-input bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 h-10 text-base focus-visible:ring-0 focus-visible:ring-offset-0 border-0" id="userInput" value="" name="userInput" />
            <button type="submit" id="send" class="text-gray-400 relative h-full min-w-[30px] flex items-center justify-start">
              <svg viewBox="0 0 20 20" id="accent-color-elem2" class="rotate-90 w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
  <button id="toggleButtonOpen" class="accent-color-elem inline-flex z-[99999999] items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full absolute bottom-4 right-4 p-2 h-fit">
    <img id="chat-bubble-icon" alt="chat bubble icon" class="w-8 h-8 invert" />
  </button>`;

document.write(ui);

document.addEventListener("DOMContentLoaded", async function () {
  // DOM elements
  const toggleButtonOpen = document.getElementById("toggleButtonOpen");
  const toggleButtonClose = document.getElementById("toggleButtonClose");
  const userInputField = document.getElementById("userInput");
  const messages_list = document.getElementById("messages-list");
  const fetch_initial = await fetch(
    "https://web-production-949d.up.railway.app/api/fetch-user",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        token: "65903b837654dc2ccdf70d42"
      })
    }
  );

  const chatbotUI = await fetch_initial.json();
  // console.log(chatbotUI);

  document.getElementById("company-logo").src = chatbotUI?.company_logo;
  document.getElementById("company-name").textContent = chatbotUI?.company_name;
  document.getElementById("company-subheading").textContent =
    chatbotUI?.subheading;
  document.getElementById("accent-color-elem2").style.fill =
    chatbotUI?.accent_colour;
  document.getElementById("chat-bubble-icon").src = chatbotUI?.chat_bubble_icon;
  userInputField.placeholder = chatbotUI?.input_box_placeholder;
  const accentColorElements = document.querySelectorAll(".accent-color-elem");

  // Iterate over each element in the NodeList
  accentColorElements.forEach((element) => {
    // Apply the background color from chatbotUI.accent_color
    element.style.background = chatbotUI?.accent_colour;
  });

  // Further processing based on the response

  function message_template(object) {
    if (object?.role === "assistant") {
      return `
            <div class="relative p-4 flex space-x-1 items-start justify-start">
            <div class="p-1 mt-1.5 border border-black rounded-full">
                <img id="chat-bubble-icon" src=${chatbotUI?.chat_bubble_icon} alt="chat bubble icon" class="w-3 h-3" />
              </div>
              <div class="text-sm p-2 px-2 bg-gray-100 shadow-md max-w-[250px] rounded-xl">
              <p>${object?.message}</p>
              </div>
              </div>
              `;
    } else {
      return `
            <div class="relative p-4 flex space-x-1 items-start justify-end">
              <div class="text-sm bg-[${chatbotUI?.accent_colour}] text-white p-2 px-2  shadow-md max-w-[250px] rounded-xl">
              <p>${object?.message}</p>
              </div>
              <div class="p-1 mt-1.5 border border-[${chatbotUI?.accent_colour}] text-[${chatbotUI?.accent_colour}] rounded-full">
                <svg
                stroke="currentColor"
                  fill="currentColor"
                  stroke-width="0"
                  viewBox="0 0 24 24"
                  class="text-xs"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              </div>
              `;
    }
  }

  messages_list.innerHTML = message_template({
    message: chatbotUI?.welcome_message,
    role: "assistant"
  });

  const create_thread = await fetch(
    "https://web-production-949d.up.railway.app/api/create-thread",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_key: chatbotUI?.profile?.user_key
      })
    }
  );

  const thread_id = await create_thread.json();
  // console.log(thread_id);

  // Toggle button click event
  toggleButtonOpen.addEventListener("click", function () {
    // Toggle the visibility of the chat UI
    const chatUI = document.querySelector(".chatui");
    chatUI.classList.remove("hidden");
    toggleButtonOpen.classList.add("hidden");
  });

  toggleButtonClose.addEventListener("click", function () {
    // Toggle the visibility of the chat UI
    const chatUI = document.querySelector(".chatui");
    chatUI.classList.add("hidden");
    toggleButtonOpen.classList.remove("hidden");
  });

  // Form submit event
  const form = document.querySelector("form");
  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    // Get user input
    const userInput = userInputField.value;

    const question = userInput.trim();

    if (question === "" || !question) return;

    const create_user_message = await fetch(
      "https://web-production-949d.up.railway.app/api/create-user-message",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user_key: chatbotUI?.profile?.user_key,
          thread_id: thread_id,
          query: question
        })
      }
    );

    const user_message = await create_user_message.json();

    if (user_message?.statusCode) {
      // console.log(user_message?.message);
      return;
    }

    messages_list.innerHTML += message_template({
      role: "user",
      message: user_message
    });

    // Clear the input field
    userInputField.value = "";
    userInputField.placeholder = "Wait a second...";
    userInputField.disabled = true;
    document.getElementById("send").disabled = true;

    const get_bot_message = await fetch(
      "https://web-production-949d.up.railway.app/api/get-bot-message",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user_key: chatbotUI?.profile?.user_key,
          thread_id: thread_id,
          assistant_id: chatbotUI?.bot_id
        })
      }
    );

    const bot_message = await get_bot_message.json();

    if (bot_message?.statusCode) {
      // console.log(bot_message?.message);
      return;
    }

    messages_list.innerHTML += message_template({
      role: bot_message?.role,
      message: bot_message?.message
    });

    userInputField.placeholder = chatbotUI?.input_box_placeholder;
    userInputField.disabled = false;
    document.getElementById("send").disabled = false;
  });
});
