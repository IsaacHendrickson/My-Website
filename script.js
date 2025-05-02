const output = document.getElementById("output");
const form = document.getElementById("gameForm");
const inputField = document.getElementById("userInput");

let room = 500;
let inventory = [];

const rooms = {
  500: ["forward", "left"],
  499: ["right", "left"],
  550: ["forward", "back", "sword"],
  600: ["back"],
  549: ["left"],
  551: ["right"]
};

function print(text) {
  output.innerText += text + "\n";
  output.scrollTop = output.scrollHeight;
}

function enterRoom(roomNumber) {
  if (roomNumber === 500) {
    print("You are back in the ruined dungeon where your journey began.");
  } else if (roomNumber === 550) {
    print("A narrow hall leads to an old torture room, cold and silent.");
  }

  for (let item of rooms[roomNumber]) {
    if (item === "forward") print("You see a passage leading forward.");
    else if (item === "back") print("You see a passage leading back.");
    else if (item === "left") print("You see a passage leading left.");
    else if (item === "right") print("You see a passage leading right.");
    else if (item === "sword") print("You see a sword driven point-first into the ground.");
  }
}

function handleCommand(command) {
  const userInput = command.toLowerCase().trim();

  if (userInput === "quit") {
    print("Please Play Again");
    return;
  }

  if (userInput === "check") {
    print(rooms[room].includes("forward") ? "true" : "false");
  } else if (userInput === "go forward" || userInput === "go") {
    if (rooms[room].includes("forward")) {
      room += 50;
      enterRoom(room);
    } else {
      print("There's nowhere to go forward.");
    }
  } else if (userInput === "go back" || userInput === "back") {
    if (rooms[room].includes("back")) {
      room -= 50;
      enterRoom(room);
    } else {
      print("There's nowhere to go back.");
    }
  } else if (userInput === "go left") {
    if (rooms[room].includes("left")) {
      room -= 1;
      enterRoom(room);
    } else {
      print("There's nowhere to go left.");
    }
  } else if (userInput === "go right") {
    if (rooms[room].includes("right")) {
      room += 1;
      enterRoom(room);
    } else {
      print("There's nowhere to go right.");
    }
  } else if (userInput.startsWith("grab") && userInput.endsWith("sword")) {
    if (rooms[room].includes("sword")) {
      print("You reach out and grab it. Yoink!");
      inventory.push("sword");
      rooms[room] = rooms[room].filter(item => item !== "sword");
      print("Inventory: " + inventory.join(", "));
    }
  } else {
    print("I don't understand that command.");
  }
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const command = inputField.value;
  print("> " + command);
  handleCommand(command);
  inputField.value = "";
});

// Initial description
print("You stand on the cold stone floor of a ruined dungeon...");
enterRoom(room);
