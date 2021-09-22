function createColorGame(levelConfig, enableSound) {
  const correct_audio =
    "data:audio/wav;base64,/+MYxAAMyRqsAUp4AP////88888wwwwwwwww888889BAAKCbi5lzUc7xWKxkZ379+/j3B8EAQ/DAPh///lAfD6obt2/N/mUr/+MYxAcOMi68AYKgAH/WYlIiwbN6JLeo1AOAAsrMkki8Yl0GigFGSfwQkhSRn8uqS6S0f///6jIu G3/l7/52E6k6yT9+v////+MYxAkPggpsAdCoAP/6NRDhCYLBAaBb0AuDgMXmYDTqVA14oQMaAsMKlgnl0W///////6zqCX+iiyyqOcXn///qCQ9jeX///+MYxAYOmgY8AC0KcP///2TNBzwMALCzgjcTwAMqA338D6LQxsGKRSRKlA0N2f///////MIh0Vb+swwAjmf//4K1AYaIHZ2//+MYxAYM+Q28ACheTP//+EiMpBJxWVRHSXIgojwkInAnYpo5C5ng0xJV0kUywOcV4FBoSP///////9RMQU1FMy45OC4yqqqq/+MYxA0AAANIAAAAAKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq";
  const incorrect_audio =
    "data:audio/wav;base64,UklGRrolAABXQVZFZm10IBAAAAABAAIARKwAABCxAgAEABAAZGF0YdQkAAAAAAAAAAAAAAAA//8AAAIAAAD+/wAAAgABAP7//v8CAAIA/f/+/wQAAgD8////AwAAAP//AAD//wAAAgAAAP3/AAADAP///v8CAAEA/f8AAAQAAAD7/wAABQD///z/AQADAP///v8BAAEAAQAAAP7/AAABAAEA///+/wAAAQACAAEA/v/+/wEAAgAAAP7///8CAAIA///+/wAAAgAAAP7/AAACAAEA/v///wIAAAD//wIAAAD9/wEABAD///z/AQADAP////8BAAAA//8AAAEAAQAAAP7///8DAAEA/f///wMAAQD+/wAAAQD/////AQAAAP//AQABAAAA/////wEAAgAAAP//AAAAAAEAAQD/////AAABAAAAAQAAAP7/AAADAAEA/v///wEAAAD///////8BAAEA//8AAAEAAgAAAP//AAAEAAIA/v8DAAYA///8/wIABgAAAPz/AAAFAAEA/v8BAAIAAAABAAEAAgABAAMAAAACAAMAAwACAAIAAAACAAMAAwD+/wIAAwAEAAIABgAEAAcACAAIAAcACwAKAAYACAANAAoABgAJAA4ADQALAAwADQAPABEADgAMABEAEwAQAA0AEgARABIAEAASABAAFQASABEAEwASABAAEQAUAA0ADAAPABIAEAAOAA4AEwAVAA8ADQATAA4ACwAKABAABwAPAA8AGQARACAAHQAkACAAKAAjACEAIAAhAB0AHAAeACMAIAAlACYAJwAlACgAIwAcABoAFAAMAAgACAABAAIABwAJAA0ACgAUABQAGQALABAACwAGAPr/9v/u/+f/5f/k/97/4f/h/+P/3v/h/+L/3P/Z/9j/2f/W/9D/2f/S/97/1P/e/9r/5f/i/+L/5//r/+z/7v/w//T/9f/2//n/+P8CAPb/CAAAABAACwAXABUAGAAjABoAGAATABoAEwASAAwAHAATACwAFQA8ACIAQwAcADcAHwAmABIAGAAYABUAHAAyADoASwBQAGIAbABkAG4AUgBtAEMAYgBMAHIAcACMAMMAxgAPAQYBZgE7AYUBYgGbAWgBiQFpAYsBWQGfAWoB1wGFARgCuAFFAt4BQwLyAREC0gHeAbQBpAGZAbEBnAHTAcsBAgL3ARkCDQIAAgMC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u/+u/7j/rv+9/7T/x/+8/83/w//V/83/4v/S/9j/1P/k/9j/2v/W/+b/3v/p/+T/9//r//r/9f8BAPP/AAD6////8/8GAP7/AwD3/w8ABgAMAAYAFgAMABUAEAAbABMAGAAQABcAFwAVABEAFAAQABIAEQASAAkADwAKAA4A//8GAPz/BgD1//v/+P8BAPf//P/8//7/+v/7//b/8//x//P/6v/o/+D/6P/i/+L/2//i/+D/4v/k/+b/4v/k/+X/5v/i/+L/3//g/97/4P/h/+X/4f/o/+r/6//m/+f/5f/k/97/3f/X/9r/1v/c/9r/3f/b/+L/4//l/93/5P/j/+X/2//m/+P/5f/g/+r/5v/o/+X/6f/o/+v/5f/n/+r/7P/n/+r/6//s/+v/7v/t/+7/7P/0/+7/8P/s//X/7P/u/+v/8f/n/+//6v/v/+n/8//u//D/7f/x/+//7v/p/+r/6v/r/+b/6//r/+z/6f/u/+//8P/q/+7/7v/0/+z/7f/u//T/7v/u//H/8//y//L/9P/1//b/9f/4//v/+v/2//v//P/6//f/+f/7//n/+f/6/////f////7/AwAEAAEA/f8BAAMA/f/8//z/+v/6/wAA+//6/wAAAwACAAEAAgADAAUAAwD//wMAAQD///3/AAD+////AAD+/wEABgAEAAAABQAHAAQAAgAFAAEAAgACAAQAAAABAAEABQADAAQABAAJAAcABgAIAAkABQAFAAYABQADAAIAAwAHAAQAAwACAAkABwAIAAQABQAHAAsAAwABAAYABgABAAMABAACAAEAAgACAAIAAAAAAAMAAgD+/wAAAgD///3////9//z//v////n//P////7/+f/9//7//P/8//3/+//9//3//f/8//7//P/9//3//v/8//v/+/////7/+//7/////P/9///////9/wAA///////////9//7//v/+//7////+////AAD///3/AQADAAAA/f8BAAMAAAD//wEAAAD//wEABAACAAAAAQAEAAMAAgABAAAAAAAFAAQA/////wMABAACAAEAAQACAAMAAwACAAEAAwADAAMAAwADAAIAAAACAAUAAQD+/wMABgAAAPz/AwAHAAEA/P8DAAgAAQD9/wMABQAAAP//BAADAP//AQAEAAIAAQACAAIAAwAEAAEAAAADAAQAAAAAAAMAAwD/////BAADAP7/AAADAAIA//8AAAQAAgD9////BAADAP3//v8EAAMA/v/+/wIAAgD//wAAAQABAAEAAAD//wAAAgAAAP7/AgADAP3//v8EAAIA/f8AAAIA/f///wUAAAD7////BAACAP3//v8BAAIAAQD9//3/AgACAP3//f8CAAIA///9//7/AwADAP3//P8BAAMAAAD+//7///8CAAIA/v/9/wEAAwD+//3/AwABAPz///8EAAEA/f8BAAIA/v8AAAIA/v/+/wMAAQD9/wEAAwD+////AgD/////AgABAP7///8DAAEA/f8AAAQA///9/wQAAgD7////BQABAP3/AAACAAEA/////wIAAQD+////AwADAP7//P8AAAUAAwD8//z/AwAEAP7//f8CAAIA/////wEAAQAAAP///v8CAAMA/f/+/wMAAQD+/wAAAgD///7/AQACAAAA/v8AAAIAAAD//wAA//8AAAIAAAD//wAAAAABAAAA//8AAAAA//8BAAIA/v///wMA///9/wIAAwD9//3/AwADAP7//v8BAAEAAAD/////AQABAP////8CAAEA/v8AAAEAAAAAAP////8CAAEA/v///wIAAgD+/0xJU1RSAAAASU5GT0lOQU0EAAAAUG9wAElBUlQgAAAAeHRyZ2FtcidzIDUwIGZyZWVzb3VuZCwgdm9sLiAxAABJQ01UEgAAAChjKSAyMDE0IHh0cmdhbXIAAGlkMyBgAAAASUQzAwAAAAAAVlRJVDIAAAAEAAAAUG9wVFBFMQAAAB8AAAB4dHJnYW1yJ3MgNTAgZnJlZXNvdW5kLCB2b2wuIDFDT01NAAAAFQAAAAAAAAAoYykgMjAxNCB4dHJnYW1y";

  var container = $("div.body-content");
  var level = 0,
    correctPosition, //Random Position/index set for correct result
    correctSound = new Audio(correct_audio),
    inCorrectSound = new Audio(incorrect_audio),
    intervalId,
    gamePaused = false;
    counter = 60;

  var colorGame = {
    nextLevel: function (level) {
      //Find size and diff from the config
      var size;
      if (level < levelConfig.size.length) {
        size = levelConfig.size[level];
      } else {
        size = levelConfig.size[levelConfig.size.length - 1];
      }
      var diff;
      if (level < levelConfig.diff.length) {
        diff = levelConfig.diff[level];
      } else {
        diff = levelConfig.diff[levelConfig.diff.length - 1];
      }

      //Width in percentage for one item
      var width = 100 / size;

      //Total items
      var items = size * size;

      //Create a random index to mark it as correct result
      correctPosition = Math.round(Math.random() * (items - 1));

      //Find colors
      var colors = colorGame.getColors(diff);

      //Create all items
      for (let index = 0; index < items; index++) {
        var item = colorGame.createItem(index, width, colors);
        container.append(item);
      }
    },
    getColors: function (diff) {
      //Generate random RGB colors
      var color = [
        Math.round(Math.random() * 256),
        Math.round(Math.random() * 256),
        Math.round(Math.random() * 256),
      ];

      //Find difference based on the diff
      var difference = (160 * (100 - diff)) / 100;

      //Add difference to the color to find a different color
      var diffColor = [
        color[0] + difference,
        color[1] + difference,
        color[2] + difference,
      ];

      return [
        "rgb(" + color.join(",") + ")",
        "rgb(" + diffColor.join(",") + ")",
      ];
    },
    createItem: function (index, width, colors) {
      //Create span and set it's properties
      var span = document.createElement("span");
      span.id = "span-" + index;
      span.classList.add("item");
      span.style.width = width + "%";
      span.style.height = width + "%";
      span.style.backgroundColor = colors[0];

      //Change color for correct position
      if (index == correctPosition) {
        span.style.backgroundColor = colors[1];
      }

      //Bind click event to calculate result
      span.onclick = colorGame.calculateResult;
      return span;
    },
    calculateResult: function () {
      //If current item has same position as randomly created position then it is correct.
      if (this.id == "span-" + correctPosition) {
        container.empty();
        level++;
        colorGame.nextLevel(level);
        enableSound && correctSound.play();
        $("#score").html(level);
      } else {
        enableSound && inCorrectSound.play();
      }
    },
    pauseGame: function() {
      $('.content').toggleClass('hide');
      $('.pause-content').toggleClass('hide');
      gamePaused = true;
    },
    resumeGame: function() {
      $('.content').toggleClass('hide');
      $('.pause-content').toggleClass('hide');
      gamePaused = false;
    },
    setCounter() {
      //Update counter every second.
      intervalId = setInterval(() => {
        //Return when game is paused.
        if(gamePaused) {
          return;
        }

        //Add danger class when counter reaches 5.
        if(counter == 5) {
          $(".counter").toggleClass('danger');
        }

        //Reset counter when it reaches 0.
        if (counter == 0) {
          clearInterval(intervalId);
          gameover(level);
          return;
        }

        $(".counter").html(counter--);
        
      }, 1000);
    },
    init: function () {
      colorGame.setCounter();
      $("#score").html(level);
      colorGame.nextLevel(level);
      $(".btn-pause").click(colorGame.pauseGame);
      $(".btn-resume").click(colorGame.resumeGame);
    },
  };
  colorGame.init();
}

$(function () {
  var gameConfigObj = {
    size: [2, 2, 2, 3, 3, 3, 4, 4, 4, 5],
    diff: [50, 55, 60, 60, 65, 90],
  };
  createColorGame(gameConfigObj, true);
});
