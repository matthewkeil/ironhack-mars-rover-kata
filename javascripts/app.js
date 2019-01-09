// Grid Object Goes Here
// =====================
const Environment = {
  size: {
    x: 10,
    y: 10
  },
  objects: {
    rovers: [],
    obstacles: []
  },
  validate(location) {
    if (!location) {
      throw new Error('must pass location to be validated');
    }

    const { x, y } = location;

    if (x < 0 || x > (this.size.x - 1)) {
      throw new Error('x coordinate is out of bounds');
    }

    if (y < 0 || y > (this.size.y - 1)) {
      throw new Error('y coordinate is out of bounds');
    }

    const occupant = this.is_occupied(location);
    if (occupant) {
      throw new Error(`that location is occupied by ${occupant.name}`);
    }
 
    return true;
  },
  addObject(object) {
    if (!object) {
      throw Error('What are ya adding...');
    }

    if (!object.location && !isObject(object.location)) {
      throw new Error('objects must have a location property')
    }

    try {

      if (object instanceof Rover && this.validate_location(object)) {
        this.objects.rovers.push(object);
        return (this.objects.rovers.length - 1);
      }
      
      if (!!object.location.x && !!object.location.y && this.validate_location(object)) {
        console.log(`Obstacle added at x: ${object.location.x}, y: ${object.location.y}`); 
        return void this.obstacles.push(object);
      }
    } catch (err) {
      console.error(err);
    }
  }
};
// =====================

// Rover Object Goes Here
// ======================
function Rover(environment) { 
  
  if (!environment) {
    throw new Error('No environment detected.  Wipe off the sensors, silly!!');
  }

  try {
  
    this._number = this._environment.addObject(this);
  
    console.log(`landing zone detected!! ${this.name} initiating decent sequence\nspooky... ${this.name} heading ${this.direction} at located at\nx: ${this.location.x}, y: ${this.location.y}`);
  } catch (err) {
    console.error('An error was detected when attempting to land...\n', err);
  }

  this.name = () => {
    return `Rover #${this._number}`;
  };

  this._directions = [ "N", "E", "S", "W" ];

  this._direction_index = 0;

  this.direction = this._directions[this._direction_index];
  
  this.location = {
    x: 0,
    y: 0
  };

  this.turnLeft = () => {

    if (this.direction_index === 0) {
      this.direction_index = 3;
    } else {
      this.direction_index--;
    }
  
    console.log(`Rover #${this.number} turned left. Now facing ${this.directions[this.direction_index]}`);
  };

  this.turnRight = () => {

    if (this.direction_index === 3) {
      this.direction_index = 0;
    } else {
      this.direction_index++;
    }
  
    console.log(`Rover #${this.number} turned right. Now facing ${this.directions[this.direction_index]}`);
  };

  this._scan = (location) => {
    try {
    
      return environment.validate(location);
    
    } catch (err) { console.error(err); }

    return false;
  };

  this._moveTo = (new_location) => {
    if (this._scan(new_location)) {
      this.location = {...new_location};
      console.log(`${this.name} moving to x:${this.location.x}, y: ${this.location.y}`);
      return true;
    };
    
    console.error('cannot execute move');
    return false;
  };

  this.moveForward = () => {
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
  };

  this.moveBackwards = () => {
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
  };
};
// ======================
