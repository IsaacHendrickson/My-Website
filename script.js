const output = document.getElementById("output");
const form = document.getElementById("gameForm");
const inputField = document.getElementById("userInput");

let inventory = [];
let holding = "";
let health = 10;
let coins = 0;
let ac = 10;
let holdingDaggers = false;

let deepLook = false;


let knowjoaquin = false;

let lastInput = ""

let room = 155;


const rooms = {
  155: {
    description: "You are in the clearing where your journey began.",
    exits: ["forward", "left"],
    items: ["coin"],
    hidden: {
      description: [" There seems to be an old path behind you, though it's so overgrown you would need somthing sharp to cut the vines away"],
      item: []
    }
  },
  145: {
    description: ["You see an old overgrown well"],
    items: [],
    exits: ["forward"]
  },
  165: {
    description: "You walk onto the old path.",
    exits: ["forward", "back"],
    items: ["sword"]
  },
  175: {
    description: "You enter the house, it is old and appears abandoned.  ",
    exits: ["back", "topStairs"],
    items: [],
    hidden: {
      item: ["coin"]
    }
  },
  154: {
    description: "You see the remnants of an old structure, in the center on a dias there is an indent that would fit a cut gemstone",
    exits: ["right"],
    enemies: [],
    items: []
  },
  255: {
    description: "You hear scraching sounds coming from the room ahead of you",
    exits: ["bottomStairs", "forward", "left"],
    items: []
  },
  254: {
    description: "You enter a dark passage",
    exits: ["left", "right"],
    items: [],
    enemies: ["rat"]
  },
  253: {
    description: "You enter a small room various tools line the walls",
    exits: ["right"],
    items: ["daggers"]
  },
  265: {
    description: "This room is empty.",
    exits: ["back"],
    enemies: ["rat"],
    items: []
  },
  //
  355: {
    description: "You see an old structure, in the center floating above a dias lays a large ruby",
    exits: ["forward", "portal"],
    items: []
  },
  365: {
    description: "I'm working on it, i'll add more at some point",
    exits: ["back"],
    items: [],
    npcs: ["joaquin"]
  }
};


const enemyStats = {
  rat: {
    hp: 5,
    resethp: 5,
    ac: 20,
    hitPlus: 2,
    damage: [1, 2],
    attackDescriptions: {
      miss: ["The rat missed", "You dodged the rats attack", "The rat sucks at attacking"],
      hit: ["The rat hits you", "The rat wacks you"]
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
      hit: ["The rat hits you", "The rat wacks you"]
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
          print(`You killed the ${enemyName}`);
          if(enemy){
            print(rooms[room].enemies);
          }
          enemy.hp = enemy.resethp;
          extraEvents("enemyDeath", enemyName);
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

// all that other stuff that i dont want clogging up the stuff
function extraEvents(event, variable){
  if(event === "attack"){
    if (checkArray(inventory, "sword") && room === 155){
      rooms[155].exits.push("back");
      print("Using your sword you cut through the vines blocking your path")
    }
  }else if(event === "drop"){
    if(room === 145 && variable === "coin"){
      print("You drop the coin into the well, and a moment later you feel a weight in your hand. You glance dow and see a small crystal that glows softly.")
      delete rooms[145].items["coin"];
      inventory.push("crystal");
      //portal
    }else if (room === 154 && variable === "ruby"){
      print(";aoiefh")
      rooms[154].exits.push("portal");
      print("You place the ruby on the dias, for a moment nothing happens then the ruby begins to vibrate and floats obive the middle of the dias and a large portal of swirling energy appears behind the dias");
    }
    if(variable === "sword"){
      holding = "";
    }else if (variable === "daggers"){
      holding = "";
    }
  }else if(event === "grab"){
    if(variable === "sword"){
      holding = "sword";
    }else if (variable === "daggers"){
      holding = "daggers";
    }
    //ruby portal
    if(variable === "ruby"){
      rooms[154].exits = rooms[154].exits.filter(exit => exit !== "portal");
      print("As you grab the ruby the portal dissapears");
    }
  }else if(event === "use"){

  }else if(event === "enemyDeath"){
    if(room === 265 && variable === "rat"){
      let item = "ruby";
      let grabItem = "ruby"
      const roomItems = rooms[room].items || [];
      print("You see a ruby");
      rooms[265].items.push("ruby");
    }
  }else if(event === "joaquin"){
    print("(1) Who are you?");
    print("(2) What do you want");
    print("\n");
    if(variable === "1"){
      print("Name's Joaquin");
      knowjoaquin = true;
    }else if(variable === "2"){
      print("For my music to be heard");
    }
  }
}

function randomNumber(min, max){
  return Math.floor(Math.random()*max)+min;
}

function enterRoom(roomNumber) {

  room = roomNumber;
  const currentRoom = rooms[room];
  //print(roomNumber)
  print(currentRoom.description);
  if(deepLook === true && rooms[room].hidden && rooms[room].hidden.description.length > 0){
    print(currentRoom.hidden.description);
  }
  print(" ");

  for (let exit of currentRoom.exits) {
    if (exit === "forward") print("You can go forward.");
    else if (exit === "back") print("You can go back.");
    else if (exit === "left") print("You can go left.");
    else if (exit === "right") print("You can go right.");
    else if (exit === "topStairs") print("You can go down.");
    else if (exit === "bottomStairs") print("You can go up.");
    else if (exit === "portal") print("You see a swirling portal in front of you")
  }

  if (currentRoom.items) {
    for (let item of currentRoom.items) {
      if (item === "sword") print("You see a sword driven point-first into the ground.");
      else if (item === "coin") print("You see a small golden coin");
      else if (item === "crystal") print("You see a mysterious crystal");
      else if (item === "daggers") print("You see a small pair of daggers laying next to each other");
      else if (item === "ruby") print("You see a small ruby");
    }
  }

  if (currentRoom.enemies) {
    for (let enemy of currentRoom.enemies) {
      if (enemy === "rat") print("You see an enormous rat in front of you!");
      else if (enemy === "secondrat") print("You see a second enormous rat in front of you!")
      else if (enemy === "speedDemon") print("You see a speed demon in front of you!");
    }
  }
  if(currentRoom.npcs) {
    for (let npc of currentRoom.npcs){
      print(" ");
      if(npc === "joaquin"){
        if(knowjoaquin === false){
          print("You see a traveling minstrel");
          print(" ");
        }else{
          print("You see Joaquin")
          print(" ");
        }
        extraEvents("joaquin","")
      }
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
  } else if (userInput === "go down") {
    print("room")
      if (room === 175) {
        enterRoom(255)
      } else {
        print("There's nowhere to go down.");
      }  
  } else if (userInput === "go up") {
      if (room === 255) {
          room = 175;
        } else {
          print("There's nowhere to go up.");
        }
      enterRoom(room);
//picking up items
  } else if (userInput.endsWith("portal")){
    if(rooms[room].exits.includes("portal"))
    if(room === 154){
      enterRoom(355);
    }else if(room === 355){
      enterRoom(154);
    }
  } else if (userInput === "help") {
  print("yo");
  } else if (userInput.startsWith("grab")) {
  let grabItem = userInput.split(" ")[1];
  const roomItems = rooms[room].items || [];
  if (roomItems.includes(grabItem)) {
    print(`You grab the ${grabItem}.`);
    inventory.push(grabItem);
    rooms[room].items = roomItems.filter(item => item !== grabItem);
    print("Inventory: " + inventory.join(", "));
  } else {
    print("You can't grab that.");
  }

  extraEvents("grab", grabItem)
// droping items
  } else if (userInput.startsWith("drop")){
  let dropItem = userInput.split(" ")[1];
  print(dropItem);
  if(checkArray(inventory, dropItem)){
    rooms[room].items.push(dropItem);
    const index = inventory.indexOf(dropItem);
    inventory.splice(index,1);
    print(`(${dropItem} dropped)`)
    extraEvents("drop",dropItem);
  }


//holding items
  } else if (userInput.startsWith("use")){
    print("use found")
    if(userInput.endsWith("sword") && checkArray(inventory, "sword")){
      holding = "sword"
      print("You pull out your sword")
    }
    if(userInput.endsWith("daggers") && checkArray(inventory, "daggers")){
      holding = "daggers";
      print("You pull out your daggers");
    }


// look
  } else if (userInput === "look"){

    deepLook = true;
    enterRoom(room);
    deepLook = false;
  
  } else if (userInput === "1" || userInput === "2" || userInput === "3" || userInput === "4" || userInput === "5" || userInput === "6" || userInput === "7" || userInput === "8" || userInput === "9"){
  if (rooms[room].npcs) {
    for (let npcKey in rooms[room].npcs) {
      let npc = rooms[room].npcs[npcKey];
      extraEvents(npc, userInput);
    }
  }
  } else if (userInput.endsWith("inventory")){
    print("Inventory: " + inventory.join(", "));
  } else if(userInput.startsWith("attack")){
  const currentRoom = rooms[room];
  let enemyInput = userInput.slice(7).trim();
  enemyInput = enemyInput.replace(/\s+/g, "");
  const enemyList = currentRoom.enemies || [];
  const enemy = enemyList.find(e => e.toLowerCase() === enemyInput.toLowerCase());
  extraEvents("attack","");
  if (enemy) {
    //sword
    if (holding === "sword") {
      enemyStats[enemy].hp -= 5;
      //daggers
    } else if (holding === "daggers"){
      enemyStats[enemy].hp -= 3;
    }
    else {
      print("You're not holding a weapon.");
    }
    print(enemyStats[enemy].hp + " enemy hp");
  } else if(enemyInput != "") {
    print("There's no such enemy here.");
  }

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
  print("\n");
  print("> " + command);
  handleCommand(command);
  inputField.value = "";
  lastInput = command;
  if (holding === "daggers" && !holdingDaggers) {
    holdingDaggers = true;
    ac += 5;
  } else if (holding !== "daggers" && holdingDaggers) {
    holdingDaggers = false;
    ac -= 5;
  }
});

// Initial description
print("You stand in a clearing, tall dark trees surround you like wall. There are two paths through the dense forests one to the left winds out of view ahead at the end of the other path you can see an old house\n");
enterRoom(room);
