const output = document.getElementById("output");
const form = document.getElementById("gameForm");
const inputField = document.getElementById("userInput");

let room = 11010;
let inventory = [];

const rooms = {
  //start room
  11010: ["forward", "left"],
  //one forward
  11110: ["forward", "back", "sword"],
  //two forward
  11210: ["back"],
  //one left
  11009: ["right"]
};

function print(text) {
  // Append the text to the output box
  output.innerHTML += text + "<br>"; // Use <br> for line breaks
  output.scrollTop = output.scrollHeight; // Ensure the output box scrolls to the bottom
}

function enterRoom(roomNumber) {
  print(roomNumber);
  if (roomNumber === 11010) {
    print("You are back in the clearing where your journey began.");
  } else if (roomNumber === 11110) {
    print("You see a small house in front of you");
  }
  else if (roomNumber === 11009) {
    print("You see the rements of an old strucure");
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
//movement
  } else if (userInput === "go forward" || userInput === "go") {
    if (rooms[room].includes("forward")) {
      room += 100;
      enterRoom(room);
    } else {
      print("There's nowhere to go forward.");
    }
  } else if (userInput === "go back" || userInput === "back") {
    if (rooms[room].includes("back")) {
      room -= 100;
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
//picking up items
  } else if (userInput.startsWith("grab") && userInput.endsWith("sword")) {
    if (rooms[room].includes("sword")) {
      print("You reach out and grab it. Yoink!");
      inventory.push("sword");
      rooms[room] = rooms[room].filter(item => item !== "sword");
      print("Inventory: " + inventory.join(", "));
    }
  } else if (userInput === "look"){
    enterRoom(room)
  }
    
  print("\n");
}
form.addEventListener("submit", function (e) {
  e.preventDefault();
  const command = inputField.value;
  print("> " + command);
  handleCommand(command);
  inputField.value = "";
});

// Initial description
print("You stand in a clearing, ahead through the forest you can see a house");
enterRoom(room);
