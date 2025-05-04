const output = document.getElementById("output");
const form = document.getElementById("gameForm");
const inputField = document.getElementById("userInput");

let inventory = [];
let holding = "";
let health = 10;
let coins = 0;
let ac = 10;

let room = 155;
let temp = "";


const rooms = {
  155: {
    description: "You are in the clearing where your journey began.",
    exits: ["forward", "left"],
    items: ["coin"]
  },
  165: {
    description: "You walk down the path and walk up to the old house.",
    exits: ["forward", "back"],
    items: ["sword"]
  },
  175: {
    description: "You enter the house, it is old and appears abandoned.",
    exits: ["back", "topStairs"],
    items: []
  },
  154: {
    description: "You see the remnants of an old structure.",
    exits: ["right"],
    enemies: ["speedDemon"]
  },
  255: {
    description: "You walk down the stairs into an old cellar.",
    exits: ["bottomStairs", "forward"],
    items: []
  },
  265: {
    description: "This room is empty.",
    exits: ["back"],
    enemies: ["rat"]
  }
};


const enemyStats = {
  rat: {
    hp: 5,
    resethp: 5,
    ac: 10,
    hitPlus: 2,
    damage: [1, 2],
    attackDescriptions: {
      miss: ["The rat missed", "You dodged the rats attack", "The rat sucks at attacking"],
      hit: ["The rat hits you", "The rat wacks you", ""]
    }
  },
  secondrat: {
    hp: 5,
    resethp: 5,
    ac: 10,
    hitPlus: 2,
    damage: [1, 2],
    attackDescriptions: {
      miss: ["The rat missed", "You dodged the rats attack", "The rat sucks at attacking"],
      hit: ["The rat hits you", "The rat wacks you", ""]
    }
  },
  speedDemon: {
    hp: 2,
    resethp: 2,
    ac: 20,
    hitPlus: 5,
    damage: [1],
    attackDescriptions: {
      miss: ["The demon missed", "You dodged the demon attack", "The demon sucks at attacking"],
      hit: ["The demon hits you", "The demon wacks you"]
    }
  },
  tankDemon: {
    hp: 10,
    resethp: 10,
    ac: 15,
    hitPlus: 0,
    damage: [1,2],
    attackDescriptions: {
      miss: ["The demon is too slow", "You dodged the demon attack", "The demon sucks at attacking"],
      hit: ["The demon hits you", "The demon wacks you"]
    }
  }
};

function print(text) {
  // Append the text to the output box
  output.innerHTML += text + "<br>"; // Use <br> for line breaks
  output.scrollTop = output.scrollHeight; // Ensure the output box scrolls to the bottom
}

function checkArray(array, checkItem) {
  for (let i = 0; i < array.length; i++) {
    if (array[i] === checkItem) {
      return true;
    }
  }
  return false;
}

function enemyTurn() {
  const enemies = rooms[room].enemies || [];
  if (enemies.length > 0) {
    for (let i = 0; i < enemies.length; i++) {
      const enemyName = enemies[i];
      const enemy = enemyStats[enemyName];
//enemy death
      if (enemy) {
        if (enemy.hp <= 0) {
          const index = rooms[room].enemies.indexOf(enemyName);
          if (index > -1) {
            rooms[room].enemies.splice(index, 1);
          }
          print(rooms[room].enemies);
        }
        const attackRoll = randomNumber(1, 20) + enemy.hitPlus;
        if (attackRoll >= ac) {
          const dmg = enemy.damage[Math.floor(Math.random() * enemy.damage.length)];
          
          // Random hit description
          const hitMsg = enemy.attackDescriptions.hit[Math.floor(Math.random() * enemy.attackDescriptions.hit.length)];
          print(`${hitMsg} for ${dmg} damage!`);
          health -= dmg;
          print(`Your health is now ${health}`);
        } else {
          // Random miss description
          print(enemy.attackDescriptions.miss[Math.floor(Math.random() * enemy.attackDescriptions.miss.length)]);
        }
      }
    }
  }

  if (health <= 0) {
    print("You have been slain!");
    setTimeout(() => {
      location.reload();
    }, 2000);
  }
}

function randomNumber(min, max){
  return Math.floor(Math.random()*max)+min;
}

function enterRoom(roomNumber) {

  room = roomNumber;
  const currentRoom = rooms[room];
  print(roomNumber)
  print(currentRoom.description);
  print(" ");

  for (let exit of currentRoom.exits) {
    if (exit === "forward") print("You can go forward.");
    else if (exit === "back") print("You can go back.");
    else if (exit === "left") print("You can go left.");
    else if (exit === "right") print("You can go right.");
    else if (exit === "topStairs") print("You can go down.");
    else if (exit === "bottomStairs") print("You can go up.");
  }

  if (currentRoom.items) {
    for (let item of currentRoom.items) {
      if (item === "sword") print("You see a sword driven point-first into the ground.");
      else if (item === "coin") print("You see a small golden coin");
    }
  }

  if (currentRoom.enemies) {
    for (let enemy of currentRoom.enemies) {
      if (enemy === "rat") print("You see an enormous rat in front of you!");
      if (enemy === "secondrat") print("You see a second enormous rat in front of you!")
      else if (enemy === "speedDemon") print("You see a speed demon in front of you!");
    }
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
    if (rooms[room].exits.includes("forward")) {
      room += 10;
      enterRoom(room);
    } else {
      print("There's nowhere to go forward.");
    }
  } else if (userInput === "go back" || userInput === "back") {
    if (rooms[room].exits.includes("back")) {
      room -= 10;
      enterRoom(room);
    } else {
      print("There's nowhere to go back.");
    }
  } else if (userInput === "go left") {
    if (rooms[room].exits.includes("left")) {
      room -= 1;
      enterRoom(room);
    } else {
      print("There's nowhere to go left.");
    }
  } else if (userInput === "go right") {
    if (rooms[room].exits.includes("right")) {
      room += 1;
      enterRoom(room);
    } else {
      print("There's nowhere to go right.");
    } 
  }  else if (userInput === "go down") {
    print("room")
      if (room === 175) {
        enterRoom(255)
      } else {
        print("There's nowhere to go down.");
      }  
  }  else if (userInput === "go up") {
      if (room === 255) {
          room = 175;
        } else {
          print("There's nowhere to go up.");
        }
      enterRoom(room);
//picking up items
} else if (userInput === "help") {
  print("yo");
}
else if (userInput.startsWith("grab")) {
  temp = userInput.split(" ")[1];
  const roomItems = rooms[room].items || [];
  if (roomItems.includes(temp)) {
    print(`You grab the ${temp}.`);
    inventory.push(temp);
    rooms[room].items = roomItems.filter(item => item !== temp);
    print("Inventory: " + inventory.join(", "));
    if(temp === "sword"){
      holding = "sword";
    }
  } else {
    print("You can't grab that.");
  }
//holding items
  } else if (userInput.startsWith("use")){
    print("use found")
    if(userInput.endsWith("sword") && checkArray(inventory, "sword")){
      holding = "sword"
      print("You pull out your sword")
    }
// look
  } else if (userInput === "look"){
    enterRoom(room);
//attacking
}else if(userInput.startsWith("attack")){
  const currentRoom = rooms[room];
  let enemyInput = userInput.slice(7).trim();
  enemyInput = enemyInput.replace(/\s+/g, "");
  print (enemyInput+ " enemtonfie")
  const enemyList = currentRoom.enemies || [];
  const enemy = enemyList.find(e => e.toLowerCase() === enemyInput.toLowerCase());

  if (enemy) {
    if (holding === "sword") {
      enemyStats[enemy].hp -= 5;
      print(enemyStats[enemy].hp + " enemy hp");
    } else {
      print("You're not holding a weapon.");
    }
  } else {
    print("There's no such enemy here.");
  }

  } else if (userInput.startsWith("go") === false) {
    enemyTurn();
  }
  print("\n");


  //attack
  if(userInput.startsWith("go") === false){
    enemyTurn();
  }

  print("\n");
}
//input
form.addEventListener("submit", function (e) {
  e.preventDefault();
  const command = inputField.value;
  print("> " + command);
  handleCommand(command);
  inputField.value = "";
});

// Initial description
print("You stand in a clearing, tall dark trees surround you like wall. There are two paths through the dense forests one to the left winds out of view ahead at the end of the other path you can see an old house\n");
enterRoom(room);
