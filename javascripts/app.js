const environment = {
  size: {
    x: 10,
    y: 10
  },
  rovers: [],
  obstacles: [],
  isOccupied: (location) => {
    let objects = [...environment.rovers, ...environment.obstacles];

    let [occupant] = objects.filter((val, index) => {
      if (location.x === val.x && location.y === val.y) {
        return objects[index];
      }
    });

    return occupant;
  },
  validate: (location) => {
    if (!location) {
      throw new Error('must pass location to be validated');
    }

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
  landRover: (rover) => {
    if (!(rover instanceof Rover)) {
      throw new Error('we only handle Rover landings!!!');
    }
    
    environment.validate(rover);
    
    return environment.rovers.push(rover);
  },
  addObstacle: (object) => {
    if (!object) {
      throw Error('What are ya adding...');
    }

    if (!(!!object.location && !!object.location.x && !!object.location.y)) {
      throw new Error('objects must have a valid location property')
    }

    environment.validate(object);
    
    environment.obstacles.push(object);
    
    console.log(`Obstacle added at x: ${object.location.x}, y: ${object.location.y}`);   
  }
};

/** 
 * Rover constructor function
 * 
 */
class Rover {

  constructor() {
    this._directions = [ "N", "E", "S", "W" ];

    this._direction_index = 0;
    
    this.location = {
      x: 0,
      y: 0
    };
    
    this.travelog = [];

    if (!environment) {
      throw new Error('No environment detected.  Wipe off the sensors, silly!!');
    }
  
    do {
      try {
        this._number = environment.landRover(this);
        
        console.log(`landing zone detected!!\n${this.name} initiating decent sequence\nspooky... ${this.name} facing ${this.direction}\nlocated at x: ${this.location.x}, y: ${this.location.y}`);
        
      } catch (err) {
        console.error('An error was detected when attempting to land...\n trying another set of coordinates\n', err);

        this.location = {
          x: Math.floor(Math.random() * environment.size.x),
          y: Math.floor(Math.random() * environment.size.y)
        }

        continue;
      }

    } while (false);

  }

  get name() {
    return `Rover #${this._number}`;
  }

  get direction() {
    return this._directions[this._direction_index];
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

  _scan(location) {
    try {
    
      return environment.validate(location);
    
    } catch (err) { console.error(err); }

    return false;
  }
   
  _moveTo(new_location) {

    if (this._scan(new_location)) {
      this.travelog.push({...this.location});
      
      this.location = {...new_location};
      
      console.log(`${this.name} moving to x:${this.location.x}, y: ${this.location.y}`);
    
      return true;
    };
    
    console.error('cannot execute move');
    return false;
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

    console.log(this.travelog);
  }
};

let rover = new Rover();
