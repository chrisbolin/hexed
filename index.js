import P5 from "p5";

const getHashId = () => parseInt(location.hash.split('#')[1]);

const setHashId = (hashId) => location.hash = hashId;

const program = ( p5 ) => {
  const {
    HSB,
    DEGREES,
    CENTER,
    CLOSE
  } = p5;

  let points = {};
  let forefront = {};
  let ruleArray;

  const config = {
    printCoordinates: false,
    size: 14,
    pitch: .84,
  };

  p5.setup = () => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight);
    p5.noStroke();
    p5.colorMode(HSB);
    p5.angleMode(DEGREES);
    p5.textAlign(CENTER);
    p5.frameRate(0.5);
    p5.noLoop();
  }

  const hexagon = (x, y, radius) => {
    var angle = 360 / 6;
    p5.beginShape();
    for (var a = angle/2; a < 360+angle/2; a += angle) {
      var sx = x + p5.cos(a) * radius;
      var sy = y + p5.sin(a) * radius;
      p5.vertex(sx, sy);
    }
    p5.endShape(CLOSE);
  }

  const intToBinaryArray = (n) => (
    ('00000000' + (n).toString(2)) // left-padded string
    .split('')
    .map(n => parseInt(n, 10)) // "1" => 1
    .reverse().slice(0, 8).reverse() // last(8)
  );

  // private

  const toXY = (a, b) => {
    const _a = a;
    const _b = b;
    const x = ((_a * p5.sin(30) + _b)) * config.size * config.pitch + p5.windowWidth/2;
    const y = (_a * p5.sin(60)) * config.size * config.pitch + p5.windowHeight/2;
    return ({x, y});
  };

  const toKey = (a, b) => `${a},${b}`;

  const toPoint = (a, b) => {
    return {
      a, b,
      key: toKey(a, b)
    };
  };


  const getNeighbors = (p, filterMode) => {
    return ([
      toPoint(p.a + 1, p.b), // 1,0
      toPoint(p.a + 1, p.b - 1), // 1,-1
      toPoint(p.a, p.b - 1), // 0,-1
      toPoint(p.a - 1, p.b), // -1,0
      toPoint(p.a - 1, p.b + 1), // -1,1
      toPoint(p.a, p.b + 1), // 0,1
    ]).map(
      (n, i) => ({ ...n, ...points[n.key], order: i })
    ).filter(n => {
      if (filterMode === 'NEW') {
        return !points[n.key];
      } else if (filterMode === 'OLD') {
        return points[n.key];
      }
      return true;
    });
  };

  const paint = (p, value) => {
    if (value === 0) {
      p5.fill(0, 0, 0, 0); // transparent
    } else if (value === 1) {
      p5.fill(0, 0, 28); // dark
    }
    const { x, y } = toXY(p.a, p.b);

    hexagon(x, y, config.size / 2);
    if (config.printCoordinates) {
      p5.textSize(5);
      p5.fill(0, 0, 100);
      p5.text(p.key, x, y + 2);
    }
  };

  const addToForefront = (p, value) => {
    p.order = null;
    if (value !== undefined) {
      p.value = value;
    } else {
      p.value = calculateValue(p);
    }

    points[p.key] = p;
    forefront[p.key] = p;
    paint(p, p.value);
  };

  const removeFromForefront = (p) => {
    delete forefront[p.key];
  };

  const cullForefront = () => {
    Object.values(forefront).forEach((p) => {
      const finished = getNeighbors(p, 'OLD');
      // remove if every neighbor is done
      if (finished.length >= 5) {
        removeFromForefront(p);
      }
    });
  };

  const growForefront = (p) => {
    Object.values(forefront).forEach(p => {
      const newNeighbors = getNeighbors(p, 'NEW');
      let chosen;
      for (let i = 0; i < newNeighbors.length; i++) {
        const n = newNeighbors[i];
        if (!chosen) {
          chosen = n;
        } else if (chosen.order + 1 === n.order) {
          chosen = n;
        } else {
          break;
        }
      }
      if (chosen) {
        addToForefront(chosen);
      }
    });
  };

  const step = () => {
    growForefront();
    cullForefront();
  };

  const calculateValue = (p) => {
    const ns = orderNeighbors(getNeighbors(p, 'OLD'));
    const index = 7 - parseInt(ns.map(n => n.value).join(''), 2);
    const value = ruleArray[index];
    return value;
  };

  const orderNeighbors = (neighbors) => {
    const length = neighbors.length;
    for (let i = 0; i < length; i++) {
      let _array = neighbors.slice(i, neighbors.length)
        .concat(neighbors.slice(0, i));
      let prev = _array[0].order;
      for (let j = 1; j < length; j++) {
        const value = _array[j].order;
        if (((prev + 1) % 6) !== value) {
          break;
        } else if (j === length - 1) {
          return _array;
        }
        prev = value;
      }
    }
    return neighbors;
  };

  const getRandomRule = () => p5.random([
    105, 150, 182, 230, 198, 90, 106, 165, 45, 195, 99, 115, 7, 135, 71, 212, 97, 91, 75
  ]);

  const initialize = () => {
    points = {};
    forefront = {};
    const origin = toPoint(0, 0);
    addToForefront(origin, 1);
    getNeighbors(origin).forEach(n => {
      addToForefront(n, 1);
    });
  };

  p5.draw = (direction=0) => {
    p5.clear();
    const currentCode = getHashId();

    if (!currentCode) {
      setHashId(getRandomRule());
      return;
    }

    const iterations = Math.round(
      Math.max(p5.windowWidth, p5.windowHeight * 1.2)/ config.size / config.pitch * 1.2
    );

    if (!currentCode) return;

    ruleArray = intToBinaryArray(currentCode);
    initialize();
    for (let i = 0; i < iterations; i++) {
      step();
    }
    p5.fill(270, 0, 100);
  };

  p5.mouseClicked = () => {
    setHashId(getRandomRule());
  }

  p5.keyPressed = () => {
    switch (p5.keyCode) {
      case 32: // space
        setHashId(getRandomRule());
        break;
      case 37: // left
        setHashId(getHashId() - 1);
        break;
      case 39: // right
        setHashId(getHashId() + 1);
        break;
      default:

    }
  };

  window.onhashchange = () => p5.draw();
  window.p5 = p5;
};

new P5(program);
