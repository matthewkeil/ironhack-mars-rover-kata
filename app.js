const environment = {
  rovers: [],
  obstacles: [],
  size: {
    x: 10,
    y: 10
  },
  isOccupied: (location) => {
    const { x, y } = location;

    let objects = [...environment.rovers, ...environment.obstacles];
    
    let [occupant] = objects.filter((val, index) => {
      if (x === val.location.x && y === val.location.y) {
        return objects[index];
      }
    });
    
    return occupant;
  },
  scan: (location) => {
    const { x, y } = location;
    
    if (x < 0 || x > (environment.size.x - 1)) {
      throw new Error('x coordinate is out of bounds');
    }

    if (y < 0 || y > (environment.size.y - 1)) {
      throw new Error('y coordinate is out of bounds');
    }

    const occupant = environment.isOccupied(location);

    if (!!occupant) {
      throw new Error(`that location is occupied by ${occupant.name}`);
    }

    return true;
  },
  land: (rover) => {
    if (!(rover instanceof Rover)) {
      throw new Error('we only handle Rover landings!!!');
    }
    
    environment.scan(rover.location);
    
    return environment.rovers.push(rover);
  },
  getLocation: () => ({
      x: Math.floor(Math.random() * environment.size.x),
      y: Math.floor(Math.random() * environment.size.y)
  }),
  addObstacle: () => {
    
    const obstacle = {
      location: environment.getLocation(),
      name: `an obstacle`
    };

    let placed = false;

    do {
      try {
        environment.scan(obstacle.location);
        environment.obstacles.push(obstacle)
        placed = true;
      } catch (err) {
        obstacle.location = environment.getLocation();   
      }
    } while (!placed)

    console.log(`Obstacle added at x: ${obstacle.location.x}, y: ${obstacle.location.y}`);
  }
};

/** 
 * Rover constructor function
 * 
 */
class Rover {

  get name() {
    return `Rover #${this._number}`;
  }

  get direction() {
    return this._directions[this._direction_index];
  }

  constructor(environment) {

    if (!environment) {
      throw new Error('No environment detected.  Wipe off the sensors, silly!!');
    }

    this.location = {
      x: 0,
      y: 0
    };

    this._directions = [ "N", "E", "S", "W" ];
    
    this._direction_index = 0;
    
    this._travelog = [];
    
    this._attemptLanding(environment);
  }

  turnLeft() {
    if (this._direction_index === 0) {
      this._direction_index = 3;
    } else {
      this._direction_index--;
    }
  
    console.log(`${this.name} turned left. Now facing ${this.direction}`);
  }

  turnRight() {
    if (this._direction_index === 3) {
      this._direction_index = 0;
    } else {
      this._direction_index++;
    }
  
    console.log(`${this.name} turned right. Now facing ${this.direction}`);
  }

  moveForward() {
    const new_location = {...this.location};

    switch(this.direction) {
      case "N":
        new_location.y++
        break;
      case "E":
        new_location.x++;
        break;
      case "S":
        new_location.y--;
        break;
      case "W":
        new_location.x--;
        break;
    }

    return this._moveTo(new_location);
  }

  moveBackwards() {
    const new_location = {...this.location};

    switch(this.direction) {
      case "N":
        new_location.y--
        break;
      case "E":
        new_location.x--;
        break;
      case "S":
        new_location.y++;
        break;
      case "W":
        new_location.x++;
        break;
    }

    return this._moveTo(new_location);
  }

  run(command) {

    let list = command;

    while(!!list.length) {
      
      switch(list[0]) {
        case "l":
          this.turnLeft();
          break;
        case "f":
          this.moveForward();
          break;
        case "r":
          this.turnRight();
          break;
        case "b":
          this.moveBackwards();
          break;
        default:
          console.error(`${list[0]} is not a valid command letter`);
      }

      list = list.substr(1);
    }

    console.log(this._travelog);
  }

  _attemptLanding(environment) {

    const self = this;

    do {
      try {
        self._number = environment.land(self);
        
        console.log(`landing zone detected!!\n${this.name} initiating decent sequence\nspooky...\n${this.name} facing ${this.direction}\nlocated at x: ${this.location.x}, y: ${this.location.y}`);
        
      } catch (err) {
        console.warn(`an error was detected when attempting to land...`);
        console.error(`>>>\n>>> ${err.message}\n>>>`);
        console.warn(`trying another set of coordinates\n`);

        self.location = environment.getLocation();

        console.warn(`new landing zone will be at\n x: ${self.location.x}, y: ${self.location.y}`);
      }
    } while (!self._number)
  }

  _scan(location) {
    try {
    
      return environment.scan(location);
    
    } catch (err) { console.error(err); }

    return false;
  }
   
  _moveTo(new_location) {

    if (this._scan(new_location)) {
      this._travelog.push({...this.location});
      
      this.location = {...new_location};
      
      console.log(`${this.name} moving to x:${this.location.x}, y: ${this.location.y}`);
    
      return true;
    };
    
    console.error('cannot execute move');
    return false;
  }
};

let rover = new Rover(environment);