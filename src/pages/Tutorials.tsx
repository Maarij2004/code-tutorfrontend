import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// import { setCurrentCode } from '../store/slices/codeSlice'; // Add setCurrentCode
import { setCurrentCode, setLanguage } from '../store/slices/codeSlice'; // Add
// ... existing imports ...
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  LinearProgress,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  EmojiEvents,
  Star,
  Lock,
  Code as CodeIcon,
  Done,
  CheckCircle,
  Celebration,
  Grade,
  Whatshot,
} from '@mui/icons-material';
import { RootState, useAppDispatch } from '../store';
import { fetchUserProgress, updateXP } from '../store/slices/userSlice';
import api from '../services/api';

const languages = [
  { value: 'html', label: 'HTML + CSS', icon: '🌐' },
  { value: 'python', label: 'Python', icon: '🐍' },
  { value: 'cpp', label: 'C++', icon: '⚡' },
  { value: 'javascript', label: 'JavaScript', icon: '🟨' },
  { value: 'nodejs', label: 'Node.js Backend', icon: '🟩' },
  { value: 'express', label: 'Express.js', icon: '🚂' },
  { value: 'react', label: 'React', icon: '⚛️' },
  { value: 'typescript', label: 'TypeScript', icon: '🔷' },
  { value: 'flask', label: 'Flask (Python)', icon: '🧪' },
  { value: 'fastapi', label: 'FastAPI (Python)', icon: '⚡️' },
  { value: 'roblox', label: 'Roblox (Lua)', icon: '🎮' },
  { value: 'sql', label: 'SQL', icon: '🗄️' },
];

const Tutorials: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { progress } = useSelector((state: RootState) => state.user);
  const [selectedLanguage, setSelectedLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem('tutorial_selectedLanguage');
      return saved ? JSON.parse(saved) : 'javascript';
    } catch {
      return 'javascript';
    }
  });

  const [selectedTutorial, setSelectedTutorial] = useState<any>(null);
  const [tutorialDialog, setTutorialDialog] = useState(false);
  const [celebrationOpen, setCelebrationOpen] = useState(false);
  const [completedTutorial, setCompletedTutorial] = useState<any>(null);
  const [levelUp, setLevelUp] = useState(false);
  const [learningMode, setLearningMode] = useState<'beginner' | 'medium'>(() => {
    try {
      const saved = localStorage.getItem('tutorial_learningMode');
      return saved ? JSON.parse(saved) : 'beginner';
    } catch {
      return 'beginner';
    }
  });
  // Custom setter for selectedLanguage that also saves to localStorage
  const setSelectedLanguage = (language: string) => {
    setSelectedLanguageState(language);
    try {
      localStorage.setItem('tutorial_selectedLanguage', JSON.stringify(language));
    } catch (error) {
      console.warn('Failed to save tutorial language to localStorage:', error);
    }
  };

  // Custom setter for learningMode that also saves to localStorage
  const setLearningModeWithPersistence = (mode: 'beginner' | 'medium') => {
    setLearningMode(mode);
    try {
      localStorage.setItem('tutorial_learningMode', JSON.stringify(mode));
    } catch (error) {
      console.warn('Failed to save learning mode to localStorage:', error);
    }
  };
  useEffect(() => {
    dispatch(fetchUserProgress());
  }, [dispatch]);

  // Force re-render when progress changes
  useEffect(() => {
    // This will cause the component to re-render when progress updates
  }, [progress]);

  // Generate tutorial content for selected language
  const generateLanguageTutorials = (language: string, mode: 'beginner' | 'medium') => {
    const tutorials = [];
    const baseId =
      language === 'javascript' ? 1 :
      language === 'python' ? 101 :
      language === 'cpp' ? 201 :
      language === 'html' ? 301 :
      language === 'react' ? 401 :
      language === 'nodejs' ? 501 :
      language === 'express' ? 551 :
      language === 'typescript' ? 601 :
      language === 'flask' ? 701 :
      language === 'fastapi' ? 801 :
      language === 'roblox' ? 901 :
      language === 'sql' ? 1001 :
      1101;

    // Generate tutorial content with educational topics
    const getTutorialData = (level: number, difficulty: string, language: string) => {
      const beginnerTemplates = {
        python: {
          easy: [
      {
        title: "Doraemon’s First Python Line (print)",
        content: "Say hello to Python and Doraemon!",
        concepts: ["print()", "strings"],
        examples: [
          { code: `print("Hello Doraemon!")`, explanation: "Print text to the console with print()." }
        ]
      },
      {
        title: "Bheem’s Number Game (Numbers & Math)",
        content: "Play with numbers like Bheem counting ladoos.",
        concepts: ["int", "float", "basic math"],
        examples: [
          { code: `ladoos = 5
print(ladoos + 2)`, explanation: "Simple arithmetic and printing result." }
        ]
      },
      {
        title: "Shinchan’s Notes (Variables & Strings)",
        content: "Store Shinchan’s notes in variables.",
        concepts: ["variables", "string concatenation"],
        examples: [
          { code: `name = "Shinchan"
print(name + " is silly")`, explanation: "Join strings with + operator." }
        ]
      },
      {
        title: "Motu’s Choice (if/else)",
        content: "Decide between samosa or burger.",
        concepts: ["if", "else", "comparison"],
        examples: [
          { code: `hungry = True
if hungry:
  print("Eat samosa")`, explanation: "Simple if statement with boolean check." }
        ]
      },
      {
        title: "Oggy’s Toy Bag (List Basics)",
        content: "Store toy names in a list.",
        concepts: ["list", "indexing"],
        examples: [
          { code: `toys = ["Joey","Marky"]
print(toys[0])`, explanation: "Create a list and access its first element." }
        ]
      },
      {
        title: "Nobita’s Loop (for loop)",
        content: "Repeat tasks like Nobita repeating homework (oops).",
        concepts: ["for loop", "range()"],
        examples: [
          { code: `for i in range(3):
  print("Try", i)`, explanation: "Loop 0,1,2 using range." }
        ]
      },
      {
        title: "Chutki’s Function (def)",
        content: "Define a helper to share ladoos.",
        concepts: ["def", "return"],
        examples: [
          { code: `def share(x): return x-1
print(share(5))`, explanation: "Function that returns decreased value." }
        ]
      },
      {
        title: "Doraemon’s List Add (append)",
        content: "Add new gadgets to Doraemon’s list.",
        concepts: ["list.append"],
        examples: [
          { code: `gadgets=[]
gadgets.append("Door")
print(gadgets)`, explanation: "Append items to a list." }
        ]
      },
      {
        title: "Shinchan’s Sleepy Test (input)",
        content: "Ask the user a question (interactive).",
        concepts: ["input()", "type note"],
        examples: [
          { code: `name = input("Your name? ")
print("Hi", name)`, explanation: "Prompt and read user input as string." }
        ]
      },
      {
        title: "Motu’s Quick Count (len & type)",
        content: "Check how many snacks there are and their type.",
        concepts: ["len()", "type()"],
        examples: [
          { code: `snacks = [1,2,3]
print(len(snacks), type(snacks))`, explanation: "Get length and type of an object." }
        ]
      }
    ],
    medium: [
      {
        title: "Doraemon’s Dictionary (dict)",
        content: "Store gadget info as key/value pairs.",
        concepts: ["dict", "keys", "values"],
        examples: [
          { code: `g = {"name":"Door","power":100}
print(g["name"])`, explanation: "Access dictionary values by key." }
        ]
      },
      {
        title: "Bheem’s Filter (list comprehensions)",
        content: "Quickly filter and transform lists.",
        concepts: ["list comprehensions"],
        examples: [
          { code: `nums=[1,2,3]
doubles=[n*2 for n in nums]
print(doubles)`, explanation: "Create a new list by comprehension." }
        ]
      },
      {
        title: "Shinchan’s Random Trick (random module)",
        content: "Pick a random mischief for Shinchan.",
        concepts: ["import random", "random.choice"],
        examples: [
          { code: `import random
print(random.choice(["Prank","Nap","Sing"]))`, explanation: "Use random.choice to pick one item." }
        ]
      },
      {
        title: "Motu’s Timer (time.sleep)",
        content: "Pause like Motu thinking about food.",
        concepts: ["time.sleep"],
        examples: [
          { code: `import time
time.sleep(1)
print("Done")`, explanation: "Pause program execution for 1 second." }
        ]
      },
      {
        title: "Oggy’s Friend Class (OOP start)",
        content: "Create a simple class for a friend.",
        concepts: ["class", "__init__", "methods"],
        examples: [
          { code: `class Friend:
  def __init__(self,name): self.name=name
f=Friend("Oggy")
print(f.name)`, explanation: "Define a class and instantiate it." }
        ]
      },
      {
        title: "Nobita’s File Note (read/write file)",
        content: "Save Nobita’s notes to a file and read back.",
        concepts: ["open()", "read()", "write()"],
        examples: [
          { code: `with open("note.txt","w") as f: f.write("Hi")
print(open("note.txt").read())`, explanation: "Write and read a simple text file." }
        ]
      },
      {
        title: "Chutki’s Try (exception handling)",
        content: "Catch errors gently like Chutki calming Nobita.",
        concepts: ["try", "except"],
        examples: [
          { code: `try:
  print(1/0)
except ZeroDivisionError:
  print("Cannot divide by zero")`, explanation: "Catch a division by zero error." }
        ]
      },
      {
        title: "Doraemon’s Module (importing)",
        content: "Use modules like Doraemon uses gadgets.",
        concepts: ["import", "from ... import ..."],
        examples: [
          { code: `import math
print(math.sqrt(16))`, explanation: "Import math module and use sqrt." }
        ]
      },
      {
        title: "Shinchan’s Map (map & filter)",
        content: "Apply functions to lists with map and filter.",
        concepts: ["map", "filter", "lambda"],
        examples: [
          { code: `nums=[1,2,3]
print(list(map(lambda x:x*2, nums)))`, explanation: "Use map with a lambda to double numbers." }
        ]
      },
      {
        title: "Motu’s Virtual Friend (virtualenv intro)",
        content: "Simple explanation to isolate project packages.",
        concepts: ["virtualenv (concept)", "pip (concept)"],
        examples: [
          { code: `# Concept: python -m venv venv`, explanation: "Create a virtual environment for a project." }
        ]
      }
    ],
    hard:[
      {
        title: "Doraemon’s Async Surprise (asyncio basics)",
        content: "Do multiple things at once with async fun!",
        concepts: ["async", "await", "asyncio"],
        examples: [
          { code: `import asyncio
async def hi(): print("Hi")
asyncio.run(hi())`, explanation: "Define and run an async function simply." }
        ]
      },
      {
        title: "Bheem’s Decorator Magic (decorators)",
        content: "Wrap functions to add power like spices.",
        concepts: ["decorator", "wraps (concept)"],
        examples: [
          { code: `def deco(f):
  def wrapper(): return f()
  return wrapper`, explanation: "Simple decorator structure (conceptual)." }
        ]
      },
      {
        title: "Shinchan’s Generator (yield)",
        content: "Yield values one by one like Shinchan’s pranks.",
        concepts: ["generator", "yield"],
        examples: [
          { code: `def nums():
  yield 1
  yield 2
for n in nums(): print(n)`, explanation: "Simple generator yielding values lazily." }
        ]
      },
      {
        title: "Motu’s Data (pandas intro concept)",
        content: "Peek at tabular data using pandas (conceptual, install needed).",
        concepts: ["pandas.DataFrame (concept)"],
        examples: [
          { code: `# Conceptual: import pandas as pd; df = pd.DataFrame(...)`, explanation: "Intro to tabular data handling with pandas." }
        ]
      },
      {
        title: "Oggy’s Web Call (requests)",
        content: "Get data from the web like Oggy fetching snacks.",
        concepts: ["requests.get", "json (concept)"],
        examples: [
          { code: `import requests
r = requests.get("https://api.example.com")
print(r.status_code)`, explanation: "Simple HTTP GET using requests." }
        ]
      },
      {
        title: "Nobita’s Unit Tests (unittest intro)",
        content: "Check code with tests so Nobita doesn’t forget.",
        concepts: ["unittest (basic)"],
        examples: [
          { code: `import unittest
class T(unittest.TestCase): pass`, explanation: "Basic unittest skeleton to build tests." }
        ]
      },
      {
        title: "Chutki’s OOP Patterns (inheritance & super)",
        content: "Make child classes using super() for shared features.",
        concepts: ["inheritance", "super()"],
        examples: [
          { code: `class A: pass
class B(A): pass`, explanation: "Simple inheritance example." }
        ]
      },
      {
        title: "Doraemon’s Serialization (json)",
        content: "Save gadget data as JSON.",
        concepts: ["json.dumps", "json.loads"],
        examples: [
          { code: `import json
print(json.dumps({"a":1}))`, explanation: "Serialize Python object to JSON string." }
        ]
      },
      {
        title: "Shinchan’s Concurrency (threading basics)",
        content: "Run small tasks in threads (intro).",
        concepts: ["threading.Thread", "join"],
        examples: [
          { code: `import threading
t = threading.Thread(target=lambda:print("Hi"))
t.start(); t.join()`, explanation: "Start and join a simple thread." }
        ]
      },
      {
        title: "Motu’s Packaging (setup & pip basics)",
        content: "Package your code so others can install it (concept).",
        concepts: ["setup.py (concept)", "pip install (concept)"],
        examples: [
          { code: `# Concept: python setup.py sdist bdist_wheel`, explanation: "High-level steps to package a Python project." }
        ]
      }
    ]
  },
        javascript: {
          easy: [
            {
              title: "Doraemon's Talking Gadget (Using alert & console.log)",
              content: "Doraemon gives you a gadget that can talk! With JavaScript alerts and console logs, we learn how computers speak.",
              concepts: ["alert()", "console.log()", "basic output"],
              examples: [
                {
                  code: `alert("Hello, I am Doraemon's talking gadget!");

console.log("Doraemon says: Let's learn JavaScript!");`,
                  explanation: "Uses alert and console.log to show messages like Doraemon talking."
                }
              ]
            },
            {
              title: "Bheem's Ladoo Counter (Numbers & Basic Math)",
              content: "Bheem loves ladoos! Let's count them using JavaScript numbers and operations.",
              concepts: ["numbers", "+ - * /", "math basics"],
              examples: [
                {
                  code: `let ladoos = 10;

let eaten = 3;

console.log("Bheem has", ladoos - eaten, "ladoos left!");`,
                  explanation: "Simple arithmetic using variables"
                }
              ]
            },
            {
              title: "Shinchan's Mood Machine (Strings)",
              content: "Shinchan changes his mood every second. Learn about strings!",
              concepts: ["strings", "string concatenation"],
              examples: [
                {
                  code: `let mood = "naughty";

console.log("Shinchan is feeling " + mood + " today!");`,
                  explanation: "Shows how to combine strings."
                }
              ]
            },
            {
              title: "Motu Patlu's Samosa True/False Test (Booleans)",
              content: "Is Motu hungry? OF COURSE TRUE!",
              concepts: ["booleans", "true/false"],
              examples: [
                {
                  code: `let isHungry = true;

console.log("Is Motu hungry?", isHungry);`,
                  explanation: "Demonstrates boolean values."
                }
              ]
            },
            {
              title: "Oggy's Cat Counter (Arrays Basics)",
              content: "Oggy keeps track of cockroaches (ugh!).",
              concepts: ["arrays", "indexing"],
              examples: [
                {
                  code: `let cockroaches = ["Joey", "Marky", "Dee Dee"];

console.log("First cockroach:", cockroaches[0]);`,
                  explanation: "Shows simple array indexing."
                }
              ]
            },
            {
              title: "Nobita's Lazy Clock (setTimeout)",
              content: "Nobita delays everything... even messages!",
              concepts: ["setTimeout"],
              examples: [
                {
                  code: `setTimeout(() => {

  console.log("Nobita finally did something after 2 seconds!");

}, 2000);`,
                  explanation: "Delays message like Nobita delays homework."
                }
              ]
            },
            {
              title: "Chhota Bheem's Strength Meter (Variables & Updates)",
              content: "Bheem becomes stronger every time he eats ladoos!",
              concepts: ["let", "variable update"],
              examples: [
                {
                  code: `let strength = 5;

strength += 10;

console.log("Bheem's strength:", strength);`,
                  explanation: "Shows updating a variable."
                }
              ]
            },
            {
              title: "Shinchan's Joke Printer (Functions)",
              content: "Shinchan tells jokes using functions!",
              concepts: ["functions"],
              examples: [
                {
                  code: `function joke() {

  console.log("Why did Shinchan cross the road? To annoy the other side!");

}

joke();`,
                  explanation: "Simple function definition + call."
                }
              ]
            },
            {
              title: "Doraemon's Door Selector (if/else)",
              content: "Choose which Anywhere Door to open!",
              concepts: ["if else", "conditions"],
              examples: [
                {
                  code: `let door = 1;

if (door === 1) console.log("You opened Tokyo!");

else console.log("You opened Seoul!");`,
                  explanation: "Basic conditional checks."
                }
              ]
            },
            {
              title: "Bheem's Ladoo Loop (Loops)",
              content: "Bheem eats ladoos one by one.",
              concepts: ["for loop"],
              examples: [
                {
                  code: `for (let i = 1; i <= 5; i++) {

  console.log("Bheem ate ladoo", i);

}`,
                  explanation: "Simple for loop."
                }
              ]
            }
          ],
          medium: [
            {
              title: "Shinchan's Mood Randomizer (Random Numbers)",
              content: "Shinchan changes mood randomly every second.",
              concepts: ["Math.random()", "Math.floor()"],
              examples: [
                {
                  code: `let moods = ["happy", "naughty", "angry", "sleepy"];

let mood = moods[Math.floor(Math.random() * moods.length)];

console.log("Shinchan is", mood);`,
                  explanation: "Picking random array element."
                }
              ]
            },
            {
              title: "Doraemon's Gadget Inventory (Array Methods)",
              content: "Add, remove, and upgrade gadgets!",
              concepts: ["push", "pop", "shift", "unshift"],
              examples: [
                {
                  code: `let gadgets = ["Anywhere Door", "Bamboo Copter"];

gadgets.push("Time Machine");

console.log(gadgets);`,
                  explanation: "Uses array push."
                }
              ]
            },
            {
              title: "Bheem's Power Booster Function (Parameters)",
              content: "Give Bheem boosts using function parameters.",
              concepts: ["function parameters", "return"],
              examples: [
                {
                  code: `function boost(strength, ladoos) {

  return strength + ladoos * 2;

}

console.log(boost(10, 5));`,
                  explanation: "Shows parameters & return value."
                }
              ]
            },
            {
              title: "Oggy's Cockroach Finder (Searching Arrays)",
              content: "Where did those cockroaches hide?",
              concepts: ["indexOf", "includes"],
              examples: [
                {
                  code: `let roaches = ["Joey", "Marky", "Dee Dee"];

console.log(roaches.includes("Joey"));`,
                  explanation: "Search in array."
                }
              ]
            },
            {
              title: "Nobita's Grade Calculator (Comparison Operators)",
              content: "Check if Nobita passed the exam!",
              concepts: [">", "<", "==", "==="],
              examples: [
                {
                  code: `let score = 40;

if (score >= 33) console.log("Nobita passed!");

else console.log("Try again!");`,
                  explanation: "Comparison operators."
                }
              ]
            },
            {
              title: "Motu's Samosa Distributor (Loops + Arrays)",
              content: "Distribute samosas among friends.",
              concepts: ["loops", "arrays"],
              examples: [
                {
                  code: `let friends = ["Motu", "Patlu", "Dr Jhatka"];

for (let f of friends) console.log(f + " gets a samosa!");`,
                  explanation: "Using loop on array elements."
                }
              ]
            },
            {
              title: "Doraemon's Door to Objects (Object Basics)",
              content: "Store information about a gadget.",
              concepts: ["objects", "key-value"],
              examples: [
                {
                  code: `let gadget = {

  name: "Anywhere Door",

  color: "pink",

  power: 100

};

console.log(gadget.name);`,
                  explanation: "Basic object usage."
                }
              ]
            },
            {
              title: "Bheem's Team Builder (Array of Objects)",
              content: "Store full information of friends.",
              concepts: ["arrays of objects"],
              examples: [
                {
                  code: `let team = [

  { name: "Bheem", power: 100 },

  { name: "Chutki", power: 80 }

];

console.log(team[1].name);`,
                  explanation: "Accessing object inside array."
                }
              ]
            },
            {
              title: "Shinchan's Voice Recorder (Template Strings)",
              content: "Use backticks to include fun messages!",
              concepts: ["template strings"],
              examples: [
                {
                  code: `let name = "Shinchan";

console.log(\`\${name} says: I'm cute but dangerous!\`);`,
                  explanation: "Using backticks."
                }
              ]
            },
            {
              title: "Nobita's Lazy Calculator (Switch Statements)",
              content: "Nobita chooses which math to do.",
              concepts: ["switch case"],
              examples: [
                {
                  code: `let op = "add";

switch(op) {

  case "add": console.log(2 + 2); break;

  case "sub": console.log(5 - 2); break;

}`,
                  explanation: "Simple switch-case."
                }
              ]
            }
          ],
          hard: [
            {
              title: "Doraemon's Future Predictor (Callbacks)",
              content: "Use callbacks to show future events.",
              concepts: ["callbacks", "async basics"],
              examples: [
                {
                  code: `function future(message, callback) {

  console.log(message);

  callback();

}

future("Your future begins...", () => console.log("...Now!"));`,
                  explanation: "Basic callback usage."
                }
              ]
            },
            {
              title: "Nobita's Promise to Study (Promises)",
              content: "Will Nobita study today? Let's use Promises!",
              concepts: ["Promises", "then"],
              examples: [
                {
                  code: `let study = new Promise((resolve) => {

  setTimeout(() => resolve("Nobita finally studied!"), 2000);

});

study.then(console.log);`,
                  explanation: "Simple Promise."
                }
              ]
            },
            {
              title: "Shinchan's Async Adventures (async/await)",
              content: "Async tasks explained using Shinchan's mischief.",
              concepts: ["async", "await"],
              examples: [
                {
                  code: `async function getJoke() {

  return "Shinchan's funny joke!";

}

(async () => {

  console.log(await getJoke());

})();`,
                  explanation: "Using async/await."
                }
              ]
            },
            {
              title: "Oggy's Cockroach Tracker Pro (Map & Filter)",
              content: "Find or filter cockroaches!",
              concepts: ["map", "filter"],
              examples: [
                {
                  code: `let nums = [1, 2, 3];

console.log(nums.map(n => n * 2));`,
                  explanation: "Array map example."
                }
              ]
            },
            {
              title: "Doraemon's Secret Gadget Locker (Classes)",
              content: "Use classes to build gadgets!",
              concepts: ["classes", "constructor"],
              examples: [
                {
                  code: `class Gadget {

  constructor(name) {

    this.name = name;

  }

}

let g = new Gadget("Time Machine");

console.log(g.name);`,
                  explanation: "Basic class example."
                }
              ]
            },
            {
              title: "Bheem's Ultimate Battle Engine (OOP Methods)",
              content: "Methods + class = powerful Bheem!",
              concepts: ["methods", "objects"],
              examples: [
                {
                  code: `class Fighter {

  attack() { console.log("Punch!"); }

}

new Fighter().attack();`,
                  explanation: "Object method usage."
                }
              ]
            },
            {
              title: "Shinchan's Event Button Chaos (Event Listeners)",
              content: "React to user button clicks.",
              concepts: ["addEventListener"],
              examples: [
                {
                  code: `document.getElementById("btn")

  .addEventListener("click", () => console.log("Shinchan clicked!"));`,
                  explanation: "Event listener."
                }
              ]
            },
            {
              title: "Nobita's Local Storage Diary",
              content: "Save Nobita's homework (so he can't lose it!).",
              concepts: ["localStorage"],
              examples: [
                {
                  code: `localStorage.setItem("homework", "Done!");

console.log(localStorage.getItem("homework"));`,
                  explanation: "Saving & loading data locally."
                }
              ]
            },
            {
              title: "Oggy's API Call to Anime World (fetch)",
              content: "Fetch data from an API.",
              concepts: ["fetch", "Promises"],
              examples: [
                {
                  code: `fetch("https://api.example.com")

  .then(res => res.json())

  .then(data => console.log(data));`,
                  explanation: "Simple fetch example."
                }
              ]
            },
            {
              title: "Doraemon's Multiverse Door (Error Handling)",
              content: "Use try/catch to handle broken gadgets!",
              concepts: ["try/catch", "error handling"],
              examples: [
                {
                  code: `try {
  throw new Error("Gadget malfunction!");
} catch (e) {
  console.log("Error:", e.message);
}`,
                  explanation: "Basic error handling."
                }
              ]
            }
          ]
        },

        cpp: {
          easy: [
            {
              title: "Doraemon’s Hello World (Your First C++ Program)",
              content: "Doraemon says hi! Learn how to print text in C++.",
              concepts: ["iostream", "std::cout", "main()", "headers"],
              examples: [
                { code: `#include <iostream>
      int main() {
        std::cout << "Hello from Doraemon!\\n";
        return 0;
      }`, explanation: "Print text to the console using std::cout." }
              ]
            },
            {
              title: "Bheem’s Ladoo Counter (Variables & Types)",
              content: "Count ladoos with numbers and variables.",
              concepts: ["int", "double", "variable declaration", "initialization"],
              examples: [
                { code: `int ladoos = 5;
      double weight = 2.5;
      std::cout << ladoos << " ladoos, " << weight << " kg\\n";`, explanation: "Declare integer and floating variables, then print them." }
              ]
            },
            {
              title: "Shinchan’s Name Tag (Strings in C++)",
              content: "Attach a name tag using std::string.",
              concepts: ["std::string", "include <string>"],
              examples: [
                { code: `#include <string>
      std::string name = "Shinchan";
      std::cout << name << " is playful!\\n";`, explanation: "Use std::string to hold text." }
              ]
            },
            {
              title: "Motu’s Samosa Boolean (bool)",
              content: "Is Motu still hungry? true or false!",
              concepts: ["bool", "true/false"],
              examples: [
                { code: `bool isHungry = true;
      std::cout << std::boolalpha << isHungry << "\\n";`, explanation: "Store and print a boolean value." }
              ]
            },
            {
              title: "Oggy’s Toy Box (Arrays Basics)",
              content: "Keep toys in an array like Oggy keeps gadgets.",
              concepts: ["arrays", "indexing"],
              examples: [
                { code: `int toys[3] = {1,2,3};
      std::cout << toys[0] << "\\n";`, explanation: "Static array and index access." }
              ]
            },
            {
              title: "Nobita’s Delay (Simple Loops)",
              content: "Nobita counts before he runs — practice loops!",
              concepts: ["for loop"],
              examples: [
                { code: `for (int i=1; i<=5; ++i) std::cout << i << "\\n";`, explanation: "Simple for loop counting 1 to 5." }
              ]
            },
            {
              title: "Chutki’s Choice (if/else)",
              content: "Choose sweets based on a condition.",
              concepts: ["if", "else", "comparison"],
              examples: [
                { code: `int sweets = 3;
      if (sweets > 2) std::cout<<"Yum!\\n"; else std::cout<<"Share!\\n";`, explanation: "Basic if/else with comparison." }
              ]
            },
            {
              title: "Bheem’s Treasure (Constants)",
              content: "Some things never change — like Bheem’s love for ladoos!",
              concepts: ["const", "constexpr"],
              examples: [
                { code: `const int MAX_LADOOS = 100;
      std::cout << MAX_LADOOS << "\\n";`, explanation: "Define and use a constant." }
              ]
            },
            {
              title: "Doraemon’s Little Function (Functions)",
              content: "Make a magic function to greet.",
              concepts: ["functions", "return type", "parameters"],
              examples: [
                { code: `void greet() { std::cout << "Hi!\\n"; }
      int main(){ greet(); }`, explanation: "Define and call a void function." }
              ]
            },
            {
              title: "Shinchan’s Swap (Passing by Value)",
              content: "Try swapping toys — but watch the trick!",
              concepts: ["pass by value"],
              examples: [
                { code: `void swap(int a, int b) { int t=a; a=b; b=t; }
      int main(){ int x=1,y=2; swap(x,y); std::cout<<x<<","<<y; }`, explanation: "Pass-by-value does not change originals." }
              ]
            }
          ],
          medium: [
            {
              title: "Doraemon’s Reference Rope (References & Pointers)",
              content: "Use magic ropes (references) to point to things.",
              concepts: ["& (reference)", "* (pointer)", "addresses"],
              examples: [
                { code: `int x=5;
      int &r = x;
      r = 10;
      std::cout<<x<< "\\n";`, explanation: "References alias variables and change original." }
              ]
            },
            {
              title: "Bheem’s Swap Master (Pass by Reference)",
              content: "Now swap for real using references.",
              concepts: ["reference parameters"],
              examples: [
                { code: `void swap(int &a,int &b){int t=a;a=b;b=t;}
      int main(){int x=1,y=2;swap(x,y);std::cout<<x<<","<<y;}`, explanation: "Swapping by reference changes originals." }
              ]
            },
            {
              title: "Shinchan’s Toy List (std::vector)",
              content: "Grow the toy list dynamically with vector.",
              concepts: ["std::vector", "push_back", "size()"],
              examples: [
                { code: `#include <vector>
      std::vector<int> v;
      v.push_back(5);
      std::cout<<v.size();`, explanation: "Use std::vector to hold dynamic lists." }
              ]
            },
            {
              title: "Motu’s Smart Box (std::array & range-based for)",
              content: "Loop easily over items with ranges.",
              concepts: ["range-based for", "std::array"],
              examples: [
                { code: `#include <array>
      std::array<int,3> a = {1,2,3};
      for (int x : a) std::cout<<x;`, explanation: "Range-based loop over std::array." }
              ]
            },
            {
              title: "Oggy’s Toolbox (Structs)",
              content: "Group gadget info like a toolbox.",
              concepts: ["struct", "members"],
              examples: [
                { code: `struct Gadget{std::string name; int power;};
      Gadget g = {"Door",100};`, explanation: "Define and use a struct." }
              ]
            },
            {
              title: "Nobita’s Homework (File I/O basics)",
              content: "Save Nobita’s homework to a file.",
              concepts: ["fstream", "ofstream", "ifstream"],
              examples: [
                { code: `#include <fstream>
      std::ofstream out("homework.txt");
      out << "Done"; out.close();`, explanation: "Write simple text to a file." }
              ]
            },
            {
              title: "Chutki’s Checker (Functions Overloading)",
              content: "Same name, different tasks — overload functions!",
              concepts: ["function overloading"],
              examples: [
                { code: `int add(int a,int b){return a+b;}
      double add(double a,double b){return a+b;}`, explanation: "Overload functions by signature." }
              ]
            },
            {
              title: "Bheem’s Safe Box (Exception basics)",
              content: "Catch errors like falling rocks.",
              concepts: ["try", "catch", "throw"],
              examples: [
                { code: `try{ throw std::runtime_error("Oops"); }
      catch(const std::exception &e){ std::cout<<e.what(); }`, explanation: "Throw and catch a simple exception." }
              ]
            },
            {
              title: "Doraemon’s Gadget Factory (Constructors)",
              content: "Build gadgets using constructors.",
              concepts: ["constructor", "this pointer"],
              examples: [
                { code: `struct G{int p; G(int x):p(x){}};
      G g(10); std::cout<<g.p;`, explanation: "Use a constructor to initialize members." }
              ]
            },
            {
              title: "Shinchan’s Secret (Enum & Scoped Enum)",
              content: "Give names to numbers with enums.",
              concepts: ["enum", "enum class"],
              examples: [
                { code: `enum Color{RED,BLUE};
      enum class Mood{HAPPY,SAD};`, explanation: "Use enum and scoped enum for readable constants." }
              ]
            }
          ],
          hard: [
            {
              title: "Doraemon’s Blueprints (Classes & Encapsulation)",
              content: "Create gadget blueprints with classes.",
              concepts: ["class", "private/public", "methods"],
              examples: [
                { code: `class Gadget{
      private: int power;
      public:
        Gadget(int p):power(p){}
        int getPower(){return power;}
      };`, explanation: "Define a class with private member and public method." }
              ]
            },
            {
              title: "Bheem’s Super Tools (Inheritance)",
              content: "Make stronger gadgets inherit from base gadgets.",
              concepts: ["inheritance", "protected", "virtual functions"],
              examples: [
                { code: `class A{public: virtual void speak(){}}; 
      class B:public A{public: void speak() override {}};`, explanation: "Basic inheritance and virtual function override." }
              ]
            },
            {
              title: "Shinchan’s Polymagic (Polymorphism)",
              content: "Same call, different behavior — polymorphism!",
              concepts: ["polymorphism", "virtual", "base pointer"],
              examples: [
                { code: `A* a = new B();
      a->speak();`, explanation: "Call overridden method via base pointer." }
              ]
            },
            {
              title: "Motu’s Memory Map (Dynamic Memory & new/delete)",
              content: "Allocate memory like Motu borrows plates.",
              concepts: ["new", "delete", "memory leaks"],
              examples: [
                { code: `int* p = new int(5);
      delete p;`, explanation: "Allocate and free dynamic memory." }
              ]
            },
            {
              title: "Oggy’s Smart Tools (Smart Pointers)",
              content: "Use smart pointers to avoid leaks safely.",
              concepts: ["std::unique_ptr", "std::shared_ptr"],
              examples: [
                { code: `#include <memory>
      auto p = std::make_unique<int>(5);`, explanation: "Use unique_ptr to automatically manage memory." }
              ]
            },
            {
              title: "Nobita’s Fast Path (Move Semantics)",
              content: "Move instead of copy to be fast!",
              concepts: ["move constructor", "std::move"],
              examples: [
                { code: `#include <utility>
      std::string s="big"; std::string t = std::move(s);`, explanation: "Use std::move to transfer resources." }
              ]
            },
            {
              title: "Chutki’s Toolbox (Templates Basics)",
              content: "Generic tools that work for many types.",
              concepts: ["templates", "function template"],
              examples: [
                { code: `template<typename T>
      T add(T a,T b){return a+b;}`, explanation: "A template function adds any numeric type." }
              ]
            },
            {
              title: "Bheem’s Fast Sort (STL Algorithms)",
              content: "Use ready-made algorithms like magic spells.",
              concepts: ["<algorithm>", "std::sort"],
              examples: [
                { code: `#include <algorithm>
      std::vector<int> v={3,1,2}; std::sort(v.begin(),v.end());`, explanation: "Sort a vector using std::sort." }
              ]
            },
            {
              title: "Doraemon’s Threads (Intro to Multithreading)",
              content: "Run tasks in parallel like multiple gadgets working!",
              concepts: ["std::thread", "join"],
              examples: [
                { code: `#include <thread>
      void f(){ std::cout<<"Hi"; }
      std::thread t(f); t.join();`, explanation: "Start a thread and wait for it to finish." }
              ]
            },
            {
              title: "Shinchan’s Network Note (Socket/Networking Basics)",
              content: "Peek at networking basics (conceptual intro).",
              concepts: ["sockets concept", "client/server (concept)"],
              examples: [
                { code: `// Concept: create socket, bind, listen, accept (platform APIs vary)`, explanation: "Outline of socket server steps (platform-specific code omitted)." }
              ]
            }
          ]
        },
        html: {
          easy: [
            {
              title: "Doraemon’s Hello Webpage (HTML Basics)",
              content: "Make a simple webpage that says hi to Doraemon.",
              concepts: ["<!DOCTYPE html>", "<html>", "<body>", "<h1>"],
              examples: [
                { code: `<!DOCTYPE html>
      <html><body><h1>Hello Doraemon!</h1></body></html>`, explanation: "Small HTML page with a header." }
              ]
            },
            {
              title: "Bheem’s Colorful Box (CSS Colors)",
              content: "Paint a box as colorful as Bheem’s shirt.",
              concepts: ["style attribute", "background-color", "color"],
              examples: [
                { code: `<div style="background-color:yellow;color:red;padding:10px">Bheem Box</div>`, explanation: "Inline CSS to style a div." }
              ]
            },
            {
              title: "Shinchan’s Fancy Text (Fonts & Size)",
              content: "Change fonts and sizes to show personality.",
              concepts: ["font-size", "font-family", "text-align"],
              examples: [
                { code: `<p style="font-size:24px;font-family:Arial">Shinchan!</p>`, explanation: "Style text with font and size." }
              ]
            },
            {
              title: "Motu’s Button (HTML Button & Clicks)",
              content: "Create a button to click—fun!",
              concepts: ["<button> element", "basic accessibility"],
              examples: [
                { code: `<button>Click Me!</button>`, explanation: "Simple clickable button element." }
              ]
            },
            {
              title: "Oggy’s List of Bugs (Lists)",
              content: "Make a checklist of cockroaches.",
              concepts: ["<ul>", "<ol>", "<li>"],
              examples: [
                { code: `<ul><li>Joey</li><li>Marky</li></ul>`, explanation: "Unordered list example." }
              ]
            },
            {
              title: "Nobita’s Super Link (Anchors)",
              content: "Link to other pages like Nobita links to Doraemon!",
              concepts: ["<a href>", "target"],
              examples: [
                { code: `<a href="https://example.com" target="_blank">Visit</a>`, explanation: "Anchor opens a link in new tab." }
              ]
            },
            {
              title: "Chutki’s Center (Box Alignment)",
              content: "Put things in the middle — center stage!",
              concepts: ["margin:auto", "width"],
              examples: [
                { code: `<div style="width:200px;margin:0 auto">Centered</div>`, explanation: "Center a fixed-width block horizontally." }
              ]
            },
            {
              title: "Doraemon’s Picture (Images)",
              content: "Show Doraemon’s photo on the page.",
              concepts: ["<img>", "alt attribute", "width/height"],
              examples: [
                { code: `<img src="doraemon.png" alt="Doraemon" width="150">`, explanation: "Add an image with alt text." }
              ]
            },
            {
              title: "Motu’s Hover (CSS :hover)",
              content: "Make a button change when you hover.",
              concepts: [":hover", "simple transitions"],
              examples: [
                { code: `<style>button:hover{transform:scale(1.1)}</style><button>Hover me</button>`, explanation: "Scale button on hover with CSS." }
              ]
            },
            {
              title: "Shinchan’s Tiny Grid (Basic Layout)",
              content: "Place tiles like Shinchan’s stickers.",
              concepts: ["display:block", "inline-block", "simple layout"],
              examples: [
                { code: `<div style="display:inline-block;width:100px">Tile</div>`, explanation: "Inline-block tile for simple layouts." }
              ]
            }
          ],
          medium: [
            {
              title: "Doraemon’s Flex Room (Flexbox Basics)",
              content: "Arrange gadgets easily with flexbox.",
              concepts: ["display:flex", "justify-content", "align-items"],
              examples: [
                { code: `<div style="display:flex;justify-content:center;align-items:center;height:100px"><div>Gadget</div></div>`, explanation: "Center content with flexbox." }
              ]
            },
            {
              title: "Bheem’s Responsive Box (Media Queries)",
              content: "Make boxes adapt for small and big screens.",
              concepts: ["@media", "responsive design"],
              examples: [
                { code: `<style>@media(max-width:600px){body{background:lightblue}}</style>`, explanation: "Change styles on small screens." }
              ]
            },
            {
              title: "Shinchan’s Fancy Fonts (Google Fonts)",
              content: "Use a fun font from the cloud.",
              concepts: ["@import", "font-family"],
              examples: [
                { code: `/* In head: <link href='https://fonts.googleapis.com/...'> */ body{font-family:'Comic Neue',sans-serif}`, explanation: "Use a web font for playful text." }
              ]
            },
            {
              title: "Motu’s Two Column (CSS Grid Intro)",
              content: "Split layout into two columns for snacks and drinks.",
              concepts: ["display:grid", "grid-template-columns"],
              examples: [
                { code: `<div style="display:grid;grid-template-columns:1fr 1fr"><div>Left</div><div>Right</div></div>`, explanation: "Create two columns with CSS Grid." }
              ]
            },
            {
              title: "Oggy’s Sticky Header (position:sticky)",
              content: "Keep the header on top like a sticky note.",
              concepts: ["position:sticky", "top"],
              examples: [
                { code: `<header style="position:sticky;top:0">Header</header>`, explanation: "Sticky header that stays on scroll." }
              ]
            },
            {
              title: "Nobita’s Rounded Card (Box Shadow & Border Radius)",
              content: "Create a sweet card with shadows.",
              concepts: ["border-radius", "box-shadow", "padding"],
              examples: [
                { code: `<div style="padding:10px;border-radius:8px;box-shadow:0 2px 5px rgba(0,0,0,.2)">Card</div>`, explanation: "Stylish card UI with shadow and rounded corners." }
              ]
            },
            {
              title: "Chutki’s Transform (Rotate & Scale)",
              content: "Rotate and scale elements like magic tricks.",
              concepts: ["transform", "transition"],
              examples: [
                { code: `<div style="transition:transform .3s">Hover me</div><style>div:hover{transform:rotate(10deg) scale(1.1)}</style>`, explanation: "Animate transform on hover." }
              ]
            },
            {
              title: "Doraemon’s Theme (CSS Variables)",
              content: "Use variables to change theme colors quickly.",
              concepts: ["--var", "var()"],
              examples: [
                { code: `:root{--main:#f06} .btn{background:var(--main)}`, explanation: "Define and use CSS variables for theme colors." }
              ]
            },
            {
              title: "Motu’s Animated Snack (Keyframes)",
              content: "Animate a snack with keyframes.",
              concepts: ["@keyframes", "animation"],
              examples: [
                { code: `<style>@keyframes hop{0%{transform:translateY(0)}50%{transform:translateY(-10px)}100%{transform:translateY(0)}}</style><div style="animation:hop 1s infinite">Snack</div>`, explanation: "Simple up-and-down animation using keyframes." }
              ]
            },
            {
              title: "Shinchan’s Form (Form Styling Basics)",
              content: "Make forms look friendly for kids.",
              concepts: ["input", "label", "placeholder", "basic form styling"],
              examples: [
                { code: `<label>Name<input placeholder="Your name"></label>`, explanation: "Simple labelled input with placeholder." }
              ]
            }
          ],
          difficult: [
            {
              title: "Doraemon’s Responsive Grid (Advanced CSS Grid)",
              content: "Build a responsive grid layout for Doraemon’s gadgets.",
              concepts: ["grid-auto-rows", "grid-area", "media queries"],
              examples: [
                { code: `<div style="display:grid;grid-template-areas:'a b' 'c c'">...</div>`, explanation: "Use grid-template-areas to lay out complex designs." }
              ]
            },
            {
              title: "Bheem’s CSS Architecture (BEM & Naming)",
              content: "Organize styles using BEM-like naming for clarity.",
              concepts: ["BEM", "scalability", "naming conventions"],
              examples: [
                { code: `/* .card__title--large */ .card__title{font-weight:bold}`, explanation: "Example BEM class naming for maintainability." }
              ]
            },
            {
              title: "Shinchan’s SVG Playground (SVG Basics)",
              content: "Draw toys with SVG vector shapes.",
              concepts: ["<svg>", "path", "viewBox"],
              examples: [
                { code: `<svg viewBox="0 0 10 10"><circle cx="5" cy="5" r="4"/></svg>`, explanation: "Simple SVG circle inline in HTML." }
              ]
            },
            {
              title: "Motu’s CSS Variables Theming (Dark/Light)",
              content: "Switch themes by toggling CSS variables.",
              concepts: ["CSS custom properties", "prefers-color-scheme"],
              examples: [
                { code: `@media (prefers-color-scheme:dark){:root{--bg:#000}}`, explanation: "Adapt theme to user preference using media query." }
              ]
            },
            {
              title: "Oggy’s Performance (Critical CSS & Minification)",
              content: "Make the page fast by inlining critical CSS and minifying.",
              concepts: ["critical CSS", "minification", "render performance"],
              examples: [
                { code: `/* Inline critical styles in head, defer the rest */`, explanation: "Conceptual tip: inline above-the-fold styles to speed render." }
              ]
            },
            {
              title: "Nobita’s CSS Houdini (Intro Concept)",
              content: "A peek at CSS Houdini to create custom paint — advanced concept.",
              concepts: ["Houdini (concept)", "paint worklets (intro)"],
              examples: [
                { code: `/* Conceptual: registerPaint('myPaint', class{paint(ctx,...){} }) */`, explanation: "High-level snippet demonstrating a paint worklet registration idea." }
              ]
            },
            {
              title: "Chutki’s Accessibility (ARIA & Semantics)",
              content: "Make pages usable for everyone, including seniors and kids.",
              concepts: ["semantic HTML", "ARIA roles", "alt text"],
              examples: [
                { code: `<button aria-label="Close">✖</button>`, explanation: "Use aria-label to make buttons accessible." }
              ]
            },
            {
              title: "Doraemon’s Complex Animations (compose & offset-path)",
              content: "Create advanced motion using offset-path (where supported).",
              concepts: ["offset-path", "motion-path", "animation-timing"],
              examples: [
                { code: `/* Example uses motion-path specs (browser support varies) */`, explanation: "Introduce motion path concept for advanced animations." }
              ]
            },
            {
              title: "Bheem’s Component CSS (Scoped Styling Patterns)",
              content: "Scope styles per component (shadow DOM or scoped classes).",
              concepts: ["shadow DOM (intro)", "scoped CSS patterns"],
              examples: [
                { code: `/* Using a wrapper class or web component to scope styles */`, explanation: "Show approach for scoping styles to components." }
              ]
            },
            {
              title: "Shinchan’s Build Tools (PostCSS & Autoprefixer)",
              content: "Modern CSS pipelines: autoprefixing and post-processing.",
              concepts: ["PostCSS (concept)", "Autoprefixer"],
              examples: [
                { code: `/* Add vendor prefixes automatically with Autoprefixer */`, explanation: "High-level note about using tooling to ensure cross-browser support." }
              ]
            }
          ]
        },
        react: {
          easy: [
            {
              title: "Doraemon’s First Component (Hello React)",
              content: "Create a tiny component that says hi.",
              concepts: ["React component", "JSX", "render"],
              examples: [
                { code: `function Hello(){ return <h1>Hello Doraemon!</h1> }`, explanation: "A simple functional component returning JSX." }
              ]
            },
            {
              title: "Bheem’s Props (Passing Data)",
              content: "Give Bheem a name via props.",
              concepts: ["props", "component inputs"],
              examples: [
                { code: `function Buddy(props){ return <div>{props.name}</div> }`, explanation: "Receive and use props in a component." }
              ]
            },
            {
              title: "Shinchan’s State (useState)",
              content: "Shinchan changes his mind — store that in state.",
              concepts: ["useState", "state update"],
              examples: [
                { code: `const [mood,setMood]=React.useState("silly")`, explanation: "useState hook to hold component state." }
              ]
            },
            {
              title: "Motu’s Button Click (onClick)",
              content: "React to clicks with event handlers.",
              concepts: ["onClick", "event handling"],
              examples: [
                { code: `<button onClick={()=>alert('Motu!')}>Click</button>`, explanation: "Attach an onClick handler to a button." }
              ]
            },
            {
              title: "Oggy’s List (Rendering Arrays)",
              content: "Render a list of cockroaches from an array.",
              concepts: ["map()", "key prop"],
              examples: [
                { code: `const items=["a","b"]; items.map((it,i)=><div key={i}>{it}</div>)`, explanation: "Render array items into JSX with keys." }
              ]
            },
            {
              title: "Nobita’s Conditional (ternary in JSX)",
              content: "Show or hide things depending on a condition.",
              concepts: ["conditional rendering", "ternary operator"],
              examples: [
                { code: `{isHappy ? <span>😊</span> : <span>😴</span>}`, explanation: "Use ternary inside JSX for conditional UI." }
              ]
            },
            {
              title: "Chutki’s Input (controlled component)",
              content: "Control input value from React state.",
              concepts: ["controlled input", "value/onChange"],
              examples: [
                { code: `const [v,setV]=useState('');
      <input value={v} onChange={e=>setV(e.target.value)} />`, explanation: "Controlled input bound to state." }
              ]
            },
            {
              title: "Doraemon’s Effect (useEffect intro)",
              content: "Run side effects like fetching or timers.",
              concepts: ["useEffect", "dependency array"],
              examples: [
                { code: `React.useEffect(()=>{console.log('mounted')},[])`, explanation: "useEffect with empty deps runs once after mount." }
              ]
            },
            {
              title: "Shinchan’s Styling (inline & className)",
              content: "Style components with className or inline style.",
              concepts: ["className", "style prop"],
              examples: [
                { code: `<div className="box" style={{padding:10}}>Hi</div>`, explanation: "Use className and inline style object in JSX." }
              ]
            },
            {
              title: "Motu’s Composition (Child Components)",
              content: "Compose UI from small components like toys in a box.",
              concepts: ["component composition", "children prop"],
              examples: [
                { code: `function Card({children}){return <div>{children}</div>}`, explanation: "Use children to compose components." }
              ]
            }
          ],
          medium: [
            {
              title: "Doraemon’s Router (React Router Intro)",
              content: "Move between pages like Doraemon's doors.",
              concepts: ["react-router (concept)", "<Route>", "<Link>"],
              examples: [
                { code: `// Concept: <Route path="/about" element={<About/>} />`, explanation: "Route example to register a path (setup required)." }
              ]
            },
            {
              title: "Bheem’s Form (Validation basics)",
              content: "Check form fields before submission.",
              concepts: ["form handling", "simple validation"],
              examples: [
                { code: `if (!name) setError('Enter name')`, explanation: "Simple validation pattern in submit handler." }
              ]
            },
            {
              title: "Shinchan’s Context (Context API)",
              content: "Share state across components like snacks at a party.",
              concepts: ["React.createContext", "Provider", "useContext"],
              examples: [
                { code: `const C = React.createContext();
      <C.Provider value={{}}>{/* children */}</C.Provider>`, explanation: "Create and provide a context value." }
              ]
            },
            {
              title: "Motu’s Memo (useMemo & useCallback intro)",
              content: "Avoid unnecessary work with memoization.",
              concepts: ["useMemo","useCallback","performance hint"],
              examples: [
                { code: `const c = React.useMemo(()=>compute(),[a])`, explanation: "Memoize expensive computation result." }
              ]
            },
            {
              title: "Oggy’s Fetch (data fetching with useEffect)",
              content: "Load data from the web and show it.",
              concepts: ["fetch", "useEffect", "loading state"],
              examples: [
                { code: `React.useEffect(()=>{fetch(url).then(r=>r.json()).then(setData)},[])`, explanation: "Fetch data inside useEffect and set state." }
              ]
            },
            {
              title: "Nobita’s Custom Hook (reuse logic)",
              content: "Extract repeated logic into a custom hook.",
              concepts: ["custom hooks", "naming useX"],
              examples: [
                { code: `function useCounter(){ const [n,setN]=useState(0); return [n,()=>setN(n+1)]; }`, explanation: "Custom hook returning state and updater." }
              ]
            },
            {
              title: "Chutki’s Error Boundary (class component)",
              content: "Catch UI errors with an error boundary.",
              concepts: ["componentDidCatch", "ErrorBoundary (class)"],
              examples: [
                { code: `class EB extends React.Component{componentDidCatch(e){}}`, explanation: "Basic error boundary skeleton (class-based)." }
              ]
            },
            {
              title: "Doraemon’s Lazy Door (Code Splitting)",
              content: "Load parts of the app on demand to save time.",
              concepts: ["React.lazy", "Suspense"],
              examples: [
                { code: `const Comp = React.lazy(()=>import('./Comp'))`, explanation: "Dynamically import a component with React.lazy." }
              ]
            },
            {
              title: "Shinchan’s Animation (CSS transitions in React)",
              content: "Make simple animations with CSS classes.",
              concepts: ["adding/removing classes", "transition"],
              examples: [
                { code: `// toggle className to animate via CSS transitions`, explanation: "Use class changes to trigger CSS transitions." }
              ]
            },
            {
              title: "Motu’s Dev Tools (React DevTools intro)",
              content: "Inspect component trees using DevTools (tip).",
              concepts: ["React DevTools", "component inspection"],
              examples: [
                { code: `// Install React DevTools extension to inspect props and state`, explanation: "Tip to use the browser extension to debug React apps." }
              ]
            }
          ],
          hard: [
            {
              title: "Doraemon’s Server Side (SSR Intro)",
              content: "A peek at server-rendering React for faster first load.",
              concepts: ["SSR concept", "hydration (concept)"],
              examples: [
                { code: `// Conceptual: renderToString on server and hydrate on client`, explanation: "Server-side rendering flow (conceptual example)." }
              ]
            },
            {
              title: "Bheem’s Performance Lab (profiling & memo)",
              content: "Measure and optimize slow components.",
              concepts: ["React Profiler", "React.memo"],
              examples: [
                { code: `export default React.memo(MyComp)`, explanation: "Wrap component in React.memo to avoid re-renders when props don't change." }
              ]
            },
            {
              title: "Shinchan’s State Machine (statecharts intro)",
              content: "Manage complex UI states with state machines (concept).",
              concepts: ["state machines (concept)", "xstate mention"],
              examples: [
                { code: `// Concept: define states and transitions with a state machine library`, explanation: "Use statecharts to model complex UI behavior." }
              ]
            },
            {
              title: "Motu’s Testing (React Testing Library)",
              content: "Test UI interactions so Motu’s buttons never break.",
              concepts: ["@testing-library/react", "render", "fireEvent"],
              examples: [
                { code: `// render(<Comp />); fireEvent.click(screen.getByText('Click'))`, explanation: "Basic pattern to render and interact in tests." }
              ]
            },
            {
              title: "Oggy’s Accessibility (A11y in React)",
              content: "Make components usable for everyone.",
              concepts: ["semantic HTML", "aria attributes", "focus management"],
              examples: [
                { code: `<button aria-label="close">✖</button>`, explanation: "Use aria-label to improve accessibility." }
              ]
            },
            {
              title: "Nobita’s State Management (Redux intro)",
              content: "Global state store for big apps (conceptual).",
              concepts: ["Redux concept", "store", "actions"],
              examples: [
                { code: `// Concept: dispatch({type:'ADD',payload:...})`, explanation: "Dispatch actions to change global state (concept)." }
              ]
            },
            {
              title: "Chutki’s Type Safety (PropTypes/TSX note)",
              content: "Validate prop types or switch to TypeScript for safety.",
              concepts: ["prop-types", "TypeScript (concept)"],
              examples: [
                { code: `MyComp.propTypes = {name: PropTypes.string}`, explanation: "Declare PropTypes to validate props at runtime." }
              ]
            },
            {
              title: "Doraemon’s Micro Frontends (concept)",
              content: "Split huge frontend into smaller apps (concept).",
              concepts: ["micro-frontends concept", "isolation patterns"],
              examples: [
                { code: `// Conceptual: mount independent micro-apps in shell`, explanation: "High-level idea for composing multiple frontend apps." }
              ]
            },
            {
              title: "Shinchan’s Build Pipeline (webpack/Vite intro)",
              content: "Bundle and serve apps fast with bundlers.",
              concepts: ["bundlers (concept)", "transpilation"],
              examples: [
                { code: `// Conceptual: vite dev server or webpack config`, explanation: "Bundler helps transform and serve app code." }
              ]
            },
            {
              title: "Motu’s Security (XSS & safe rendering)",
              content: "Avoid unsafe HTML injection and sanitize inputs.",
              concepts: ["XSS concept", "dangerouslySetInnerHTML (danger)"],
              examples: [
                { code: `<div>{userInput}</div>`, explanation: "Never insert untrusted HTML directly; sanitize inputs." }
              ]
            }
          ]
        },
      
        typescript: {
          easy: [
            {
              title: "Doraemon’s First TS File (Types Basics)",
              content: "Hello TypeScript — add types to your variables!",
              concepts: ["type annotations", "number", "string"],
              examples: [
                { code: `let name: string = "Doraemon";
      let age: number = 100;`, explanation: "Declare typed variables with TypeScript annotations." }
              ]
            },
            {
              title: "Bheem’s Function Types",
              content: "Tell the function what types it accepts and returns.",
              concepts: ["function types", "return type"],
              examples: [
                { code: `function add(a:number,b:number):number { return a+b }`, explanation: "Typed function parameters and return value." }
              ]
            },
            {
              title: "Shinchan’s Union (either/or types)",
              content: "A variable can be one of several types — like Shinchan being silly or sleepy.",
              concepts: ["union types (|)"],
              examples: [
                { code: `let mood: "silly" | "sleepy";
      mood = "silly";`, explanation: "Use a union of string literal types." }
              ]
            },
            {
              title: "Motu’s Array Types",
              content: "Arrays with known element types — safer than plain JS arrays.",
              concepts: ["typed arrays", "Array<T> or T[]"],
              examples: [
                { code: `let nums: number[] = [1,2,3];`, explanation: "Array of numbers with TypeScript typing." }
              ]
            },
            {
              title: "Oggy’s Object Types (interfaces intro)",
              content: "Describe object shapes using interfaces.",
              concepts: ["interface", "type alias (brief)"],
              examples: [
                { code: `interface Gadget{ name: string; power:number }
      const g: Gadget = {name:'Door',power:10}`, explanation: "Define an interface and use it to type an object." }
              ]
            },
            {
              title: "Nobita’s Optional (optional props)",
              content: "Some fields may be optional like Nobita's homework sometimes.",
              concepts: ["optional properties ?"],
              examples: [
                { code: `interface P{a?:number}
      const x:P = {};`, explanation: "Optional property marked with ?." }
              ]
            },
            {
              title: "Chutki’s Any (avoid if you can!)",
              content: "Any is like wild magic — use carefully.",
              concepts: ["any type", "type safety warning"],
              examples: [
                { code: `let x: any = 5; x = "oops";`, explanation: "any disables type checks — use sparingly." }
              ]
            },
            {
              title: "Doraemon’s Tuple (fixed-length arrays)",
              content: "Store a small fixed set of values with known types.",
              concepts: ["tuple types"],
              examples: [
                { code: `let pair: [string, number] = ["Doraemon", 100];`, explanation: "Tuple with a string and a number." }
              ]
            },
            {
              title: "Shinchan’s Enum (names for numbers)",
              content: "Give names to numbers with enum for clarity.",
              concepts: ["enum"],
              examples: [
                { code: `enum Mood {Happy, Sleepy}
      let m: Mood = Mood.Happy;`, explanation: "Define an enum and use a value." }
              ]
            },
            {
              title: "Motu’s Type Inference (TS helps guess)",
              content: "TypeScript can often infer types for you.",
              concepts: ["type inference"],
              examples: [
                { code: `let x = 5; // inferred as number`, explanation: "TS infers the type so explicit annotation is optional." }
              ]
            }
          ],
          medium: [
            {
              title: "Doraemon’s Generics (Reusable types)",
              content: "Create reusable containers — genies for types!",
              concepts: ["generics", "function generics"],
              examples: [
                { code: `function id<T>(x:T):T { return x }`, explanation: "A generic identity function returning same type." }
              ]
            },
            {
              title: "Bheem’s Narrowing (type guards)",
              content: "Check types at runtime and narrow types safely.",
              concepts: ["typeof", "instanceof", "user-defined type guards"],
              examples: [
                { code: `function isString(x:any): x is string { return typeof x==='string' }`, explanation: "Type guard function example." }
              ]
            },
            {
              title: "Shinchan’s Union Handling (discriminated unions)",
              content: "Handle different shapes with a kind field.",
              concepts: ["discriminated union pattern"],
              examples: [
                { code: `type A = {kind:'a',v:number} | {kind:'b',v:string};`, explanation: "Define union types discriminated by a literal property." }
              ]
            },
            {
              title: "Motu’s Mapped Types (intro)",
              content: "Transform types like recipes transform ingredients.",
              concepts: ["mapped types (concept)", "Partial, Readonly"],
              examples: [
                { code: `type P<T> = { [K in keyof T]?: T[K] }`, explanation: "Conceptual example similar to Partial<T>." }
              ]
            },
            {
              title: "Oggy’s Module (import/export)",
              content: "Split code into modules and import them.",
              concepts: ["export", "import"],
              examples: [
                { code: `export const x = 1; import {x} from './a'`, explanation: "Export and import named values across files." }
              ]
            },
            {
              title: "Nobita’s DOM Types (TSX with DOM)",
              content: "Type elements and event handlers in React-ish TSX (concept).",
              concepts: ["Event typing", "HTMLElement types (concept)"],
              examples: [
                { code: `function onClick(e: MouseEvent){}`, explanation: "Type an event parameter (conceptual in TS/JS environment)." }
              ]
            },
            {
              title: "Chutki’s Strict Mode (tsconfig strict)",
              content: "Turn on strict mode to get stronger checks.",
              concepts: ["strict mode", "noImplicitAny"],
              examples: [
                { code: `// tsconfig.json { \"compilerOptions\": { \"strict\": true } }`, explanation: "Enable strict compiler checking for safer code." }
              ]
            },
            {
              title: "Doraemon’s Type Guards (in operator)",
              content: "Check for object properties to narrow types.",
              concepts: ["in operator", "property checks"],
              examples: [
                { code: `if ('x' in obj) { /* obj.x is safe to use */ }`, explanation: "Use 'in' to check for property existence for narrowing." }
              ]
            },
            {
              title: "Shinchan’s Utility Types (Pick & Omit)",
              content: "Create new types by selecting or dropping keys.",
              concepts: ["Pick<T,K>", "Omit<T,K>"],
              examples: [
                { code: `type Small = Pick<Gadget, 'name'>`, explanation: "Pick creates a type with only the selected keys." }
              ]
            },
            {
              title: "Motu’s Declaration Files (.d.ts intro)",
              content: "Describe JavaScript libs to TypeScript using declarations.",
              concepts: [".d.ts", "declare keyword (concept)"],
              examples: [
                { code: `declare module "some-lib";`, explanation: "Declare a module shape to satisfy the compiler (intro)." }
              ]
            }
          ],
          hard: [
            {
              title: "Doraemon’s Advanced Generics (constraints)",
              content: "Tell generics what they must look like using constraints.",
              concepts: ["extends constraint", "generic constraints"],
              examples: [
                { code: `function len<T extends {length:number}>(x:T){return x.length}`, explanation: "Generic constrained to types with length." }
              ]
            },
            {
              title: "Bheem’s Conditional Types",
              content: "Types that change depending on conditions — type-level logic!",
              concepts: ["conditional types", "infer (brief)"],
              examples: [
                { code: `type T<T> = T extends string ? number : boolean`, explanation: "Conditional type picks one type or another based on condition." }
              ]
            },
            {
              title: "Shinchan’s Mapped Key Remap (advanced)",
              content: "Transform keys and values of types creatively.",
              concepts: ["key remapping in mapped types"],
              examples: [
                { code: `type R<T> = { [K in keyof T as \`get\${string & K}\`]: T[K] }`, explanation: "Remap keys using template literal types (advanced)." }
              ]
            },
            {
              title: "Motu’s Template Literal Types",
              content: "Build stringy types using template literals at the type level.",
              concepts: ["template literal types"],
              examples: [
                { code: `type EventName<T extends string> = \`\${T}Event\`;`, explanation: "Create new string types by combining literal parts." }
              ]
            },
            {
              title: "Oggy’s Deep Readonly (recursive types)",
              content: "Make complex nested objects readonly recursively (concept).",
              concepts: ["recursive mapped types (concept)"],
              examples: [
                { code: `// Conceptual: type DeepReadonly<T> = { readonly [K in keyof T]: DeepReadonly<T[K]> }`, explanation: "Pattern to deeply freeze object types." }
              ]
            },
            {
              title: "Nobita’s Advanced Inference (infer)",
              content: "Extract types using infer inside conditional types (advanced).",
              concepts: ["infer keyword", "type extraction"],
              examples: [
                { code: `type Return<T> = T extends (...args:any)=>infer R ? R : any`, explanation: "Use infer to extract a function's return type." }
              ]
            },
            {
              title: "Chutki’s Declaration Merging",
              content: "Let multiple declarations merge into one (namespace/var merging).",
              concepts: ["declaration merging (concept)"],
              examples: [
                { code: `// interface X {a:number} interface X {b:string} // merged`, explanation: "Interfaces with same name merge their members." }
              ]
            },
            {
              title: "Doraemon’s Advanced Module Resolution",
              content: "Control how TypeScript finds files and modules.",
              concepts: ["paths", "baseUrl (tsconfig)"],
              examples: [
                { code: `// tsconfig paths mapping example (concept)`, explanation: "Configure compiler to resolve module paths easily." }
              ]
            },
            {
              title: "Shinchan’s Monorepo (project references)",
              content: "Split big projects into many packages with references.",
              concepts: ["projectReferences (concept)"],
              examples: [
                { code: `// tsconfig projectReferences example (concept)`, explanation: "Organize multi-package TypeScript projects with references." }
              ]
            },
            {
              title: "Motu’s Runtime Type Checks (io-ts / zod mention)",
              content: "Validate runtime data while keeping type safety (library mention).",
              concepts: ["runtime validation (io-ts/zod) concept"],
              examples: [
                { code: `// Concept: use zod.parse(data) to validate at runtime`, explanation: "Use a runtime schema library to validate external data." }
              ]
            }
          ]
        }

        ,
        nodejs: {
          easy: [
            { title: "Hello Server (Tiny Robot)", content: "Build a mini robot server that says hi when poked.", concepts: ["http.createServer", "response"], examples: [{ code: `const http=require('http'); http.createServer((_,res)=>res.end('hi')).listen(3000);`, explanation: "Minimal server wave." }] },
            { title: "Detective Requests", content: "Be a little detective: log who knocks (method + path).", concepts: ["req.method", "req.url"], examples: [{ code: `http.createServer((req,res)=>{console.log(req.method,req.url);res.end('ok');}).listen(0);`, explanation: "Log incoming visitors." }] },
            { title: "Candy JSON", content: "Serve sweet JSON treats with the right wrapper.", concepts: ["Content-Type", "JSON.stringify"], examples: [{ code: `res.setHeader('Content-Type','application/json'); res.end(JSON.stringify({ok:true}));`, explanation: "JSON candy wrapper." }] },
            { title: "Treasure Map Queries", content: "Find hidden clues in the URL query string.", concepts: ["url.parse", "query"], examples: [{ code: `const {query}=require('url').parse(req.url,true);`, explanation: "Read tiny clues." }] },
            { title: "Choose Your Path", content: "Pick a path: health route says OK, others say 404.", concepts: ["pathname routing"], examples: [{ code: `if(pathname==='/health') res.end('ok'); else res.end('404');`, explanation: "Fork in the road." }] },
            { title: "Message in a Bottle", content: "Catch the body text piece by piece.", concepts: ["data/end"], examples: [{ code: `let body=''; req.on('data',c=>body+=c); req.on('end',()=>res.end(body));`, explanation: "Collect message pieces." }] },
            { title: "Safe Potion Mix", content: "Try to mix JSON potion; if it spills, say 400.", concepts: ["JSON.parse", "error handling"], examples: [{ code: `try{data=JSON.parse(body);}catch{res.statusCode=400;}`, explanation: "Guard the mix." }] },
            { title: "Magic Stamps", content: "Set special status codes and headers like stamps.", concepts: ["statusCode", "setHeader"], examples: [{ code: `res.statusCode=201; res.setHeader('X-App','demo'); res.end('created');`, explanation: "Stamp your reply." }] },
            { title: "Pick-a-Port", content: "Let the server pick a port from a hat (env) or default.", concepts: ["process.env.PORT"], examples: [{ code: `const PORT=process.env.PORT||3000; server.listen(PORT);`, explanation: "Port picker." }] },
            { title: "One-Shot Server", content: "Server says hello once, then goes to sleep.", concepts: ["server.close"], examples: [{ code: `server.listen(0,()=>{http.get(url,()=>server.close());});`, explanation: "Self-close nap time." }] }
          ],
          medium: [
            { title: "Route Table", content: "Use a map of paths to handlers.", concepts: ["route map"], examples: [{ code: `const routes={'/health':(_,res)=>res.end('ok')}; (routes[path]||notFound)(req,res);`, explanation: "Dispatch map." }] },
            { title: "Middleware Chain", content: "Run small functions in sequence.", concepts: ["middleware array"], examples: [{ code: `const chain=[fn1,fn2];`, explanation: "Compose middleware." }] },
            { title: "CORS Headers", content: "Add minimal CORS support.", concepts: ["Access-Control-Allow-Origin"], examples: [{ code: `res.setHeader('Access-Control-Allow-Origin','*');`, explanation: "Enable CORS." }] },
            { title: "Validate Input", content: "Reject missing fields in JSON body.", concepts: ["field checks"], examples: [{ code: `if(!data.name){res.statusCode=400;return res.end('name required');}`, explanation: "Basic validation." }] },
            { title: "In-Memory CRUD", content: "Manage items in an array store.", concepts: ["array CRUD"], examples: [{ code: `let items=[]; // add/read/update/delete`, explanation: "Array store." }] },
            { title: "Request Metrics", content: "Count hits per route.", concepts: ["counters"], examples: [{ code: `counts[path]=(counts[path]||0)+1;`, explanation: "Increment counts." }] },
            { title: "Error Wrapper", content: "Central try/catch around handlers.", concepts: ["error handling"], examples: [{ code: `try{handler()}catch(e){res.statusCode=500;res.end('error');}`, explanation: "Wrap handler." }] },
            { title: "Serve HTML String", content: "Respond with simple HTML.", concepts: ["text/html header"], examples: [{ code: `res.setHeader('Content-Type','text/html'); res.end('<h1>Hello</h1>');`, explanation: "Inline HTML." }] },
            { title: "Path Params", content: "Extract id from URL segments.", concepts: ["pathname split"], examples: [{ code: `const id=pathname.split('/')[2];`, explanation: "Grab param." }] },
            { title: "Timeout Failsafe", content: "Force exit to avoid hanging.", concepts: ["setTimeout"], examples: [{ code: `setTimeout(()=>process.exit(0),3000);`, explanation: "Failsafe exit." }] }
          ],
          hard: [
            { title: "JWT Payload Decode", content: "Decode JWT payload without verify.", concepts: ["split token", "base64url"], examples: [{ code: `const p=token.split('.')[1]; const data=JSON.parse(Buffer.from(p,'base64').toString());`, explanation: "Decode payload." }] },
            { title: "Pagination Params", content: "Handle page & limit queries.", concepts: ["parseInt defaults"], examples: [{ code: `const page=parseInt(query.page||'1',10);`, explanation: "Pagination." }] },
            { title: "TTL Cache", content: "Cache responses in-memory with expiry.", concepts: ["Map", "Date.now"], examples: [{ code: `cache.set(key,{v,exp:Date.now()+5000});`, explanation: "Simple TTL." }] },
            { title: "Webhook Logger", content: "Log headers/body and ack 200.", concepts: ["logging", "body parse"], examples: [{ code: `console.log(req.headers);`, explanation: "Log webhook." }] },
            { title: "Graceful Shutdown", content: "Close server on signals.", concepts: ["process.on"], examples: [{ code: `process.on('SIGTERM',()=>server.close(()=>process.exit(0)));`, explanation: "Shutdown hook." }] },
            { title: "Config per Env", content: "Return config based on NODE_ENV.", concepts: ["process.env.NODE_ENV"], examples: [{ code: `const env=process.env.NODE_ENV||'dev';`, explanation: "Env switch." }] },
            { title: "Sanitize Input", content: "Trim string fields from body.", concepts: ["Object.entries"], examples: [{ code: `for(const k in data){if(typeof data[k]==='string') data[k]=data[k].trim();}`, explanation: "Sanitize." }] },
            { title: "Per-IP Counter", content: "Track requests by ip (naive).", concepts: ["ip map"], examples: [{ code: `counts[ip]=(counts[ip]||0)+1;`, explanation: "Count by ip." }] },
            { title: "File Stat", content: "Return fs.stat info for a file.", concepts: ["fs.statSync"], examples: [{ code: `const fs=require('fs'); const s=fs.statSync(__filename);`, explanation: "File stats." }] },
            { title: "Streaming Response", content: "Write chunked responses.", concepts: ["res.write", "res.end"], examples: [{ code: `res.write('part'); res.end('done');`, explanation: "Chunked send." }] }
          ]
        },

        express: {
          easy: [
            { title: "Hello Express Friend", content: "Create your first Express server that greets visitors with a friendly hello message. Express makes building web servers much easier than plain Node.js!", concepts: ["express()", "app.listen", "GET route"], examples: [{ code: `const express=require('express');\nconst app=express();\napp.get('/',(req,res)=>res.send('Hello Express!'));\napp.listen(3000);`, explanation: "Basic Express server." }] },
            { title: "JSON Response", content: "Send JSON data back to clients. Express automatically converts JavaScript objects to JSON format!", concepts: ["res.json", "JSON response"], examples: [{ code: `app.get('/api/data',(req,res)=>res.json({ok:true,message:'Hi!'}));`, explanation: "JSON response." }] },
            { title: "Path Parameters", content: "Capture values from the URL path. Learn to create dynamic routes that accept user input in the URL.", concepts: ["req.params", "route parameters"], examples: [{ code: `app.get('/user/:id',(req,res)=>res.send(\`User ID: \${req.params.id}\`));`, explanation: "Path parameter." }] },
            { title: "Query Strings", content: "Read query parameters from URLs. Query strings let users pass data through the URL like ?name=John.", concepts: ["req.query", "query parameters"], examples: [{ code: `app.get('/search',(req,res)=>res.send(\`Searching for: \${req.query.q}\`));`, explanation: "Query parameter." }] },
            { title: "POST Requests", content: "Handle POST requests to receive data from clients. POST is used when sending data to the server.", concepts: ["app.post", "POST method"], examples: [{ code: `app.post('/submit',(req,res)=>res.json({received:true}));`, explanation: "POST endpoint." }] },
            { title: "Request Body", content: "Read JSON data sent in the request body. Express needs middleware to parse JSON automatically.", concepts: ["express.json()", "req.body"], examples: [{ code: `app.use(express.json());\napp.post('/data',(req,res)=>res.json(req.body));`, explanation: "Read JSON body." }] },
            { title: "Status Codes", content: "Send different HTTP status codes. Status codes tell clients if requests succeeded or failed.", concepts: ["res.status", "HTTP codes"], examples: [{ code: `app.post('/create',(req,res)=>res.status(201).json({created:true}));`, explanation: "201 Created status." }] },
            { title: "Multiple Routes", content: "Create multiple routes in your Express app. Organize different endpoints for different purposes.", concepts: ["multiple routes", "route organization"], examples: [{ code: `app.get('/home',(req,res)=>res.send('Home'));\napp.get('/about',(req,res)=>res.send('About'));`, explanation: "Multiple routes." }] },
            { title: "Static Files", content: "Serve static files like HTML, CSS, and images. Express can serve files from a folder automatically.", concepts: ["express.static", "static files"], examples: [{ code: `app.use(express.static('public'));`, explanation: "Serve static files." }] },
            { title: "Port Configuration", content: "Configure your server port using environment variables. This makes your app flexible for different environments.", concepts: ["process.env.PORT", "port configuration"], examples: [{ code: `const PORT=process.env.PORT||3000;\napp.listen(PORT);`, explanation: "Configurable port." }] }
          ],
          medium: [
            { title: "Route Handlers", content: "Organize routes with separate handler functions. This keeps your code clean and maintainable.", concepts: ["handler functions", "code organization"], examples: [{ code: `const getUsers=(req,res)=>res.json({users:[]});\napp.get('/users',getUsers);`, explanation: "Separate handler." }] },
            { title: "Middleware Basics", content: "Use middleware to process requests before they reach routes. Middleware runs in sequence.", concepts: ["app.use", "middleware"], examples: [{ code: `app.use((req,res,next)=>{console.log('Request:',req.path);next();});`, explanation: "Logging middleware." }] },
            { title: "Error Handling", content: "Handle errors gracefully in Express. Create error handlers to catch and respond to errors properly.", concepts: ["error handler", "try-catch"], examples: [{ code: `app.use((err,req,res,next)=>res.status(500).json({error:err.message}));`, explanation: "Error handler." }] },
            { title: "CORS Middleware", content: "Enable Cross-Origin Resource Sharing so your API can be accessed from different domains.", concepts: ["cors", "CORS middleware"], examples: [{ code: `const cors=require('cors');\napp.use(cors());`, explanation: "Enable CORS." }] },
            { title: "Route Parameters", content: "Use multiple route parameters in a single route. Extract multiple values from the URL path.", concepts: ["multiple params", "route params"], examples: [{ code: `app.get('/user/:id/posts/:postId',(req,res)=>res.json({userId:req.params.id,postId:req.params.postId}));`, explanation: "Multiple params." }] },
            { title: "Request Validation", content: "Validate incoming request data before processing. Ensure data meets your requirements.", concepts: ["validation", "data checking"], examples: [{ code: `app.post('/user',(req,res)=>{\n  if(!req.body.name) return res.status(400).json({error:'Name required'});\n  res.json({ok:true});\n});`, explanation: "Basic validation." }] },
            { title: "Router Module", content: "Organize routes using Express Router. Create separate route files for better code organization.", concepts: ["express.Router", "route modules"], examples: [{ code: `const router=express.Router();\nrouter.get('/',(req,res)=>res.send('Router'));\napp.use('/api',router);`, explanation: "Router module." }] },
            { title: "URL Encoding", content: "Handle URL-encoded form data. Learn to parse data from HTML forms.", concepts: ["express.urlencoded", "form data"], examples: [{ code: `app.use(express.urlencoded({extended:true}));\napp.post('/form',(req,res)=>res.json(req.body));`, explanation: "Parse form data." }] },
            { title: "404 Handler", content: "Create a custom 404 handler for routes that don't exist. Provide helpful error messages.", concepts: ["404 handler", "not found"], examples: [{ code: `app.use((req,res)=>res.status(404).json({error:'Not found'}));`, explanation: "404 handler." }] },
            { title: "Response Headers", content: "Set custom response headers. Headers provide metadata about the response.", concepts: ["res.setHeader", "custom headers"], examples: [{ code: `app.get('/data',(req,res)=>{\n  res.setHeader('X-Custom','value');\n  res.json({data:'test'});\n});`, explanation: "Custom header." }] }
          ],
          hard: [
            { title: "Advanced Middleware", content: "Create complex middleware chains with conditional logic. Build reusable middleware functions for authentication and authorization.", concepts: ["middleware chains", "conditional middleware", "auth middleware"], examples: [{ code: `const auth=(req,res,next)=>{\n  if(req.headers.authorization) next();\n  else res.status(401).json({error:'Unauthorized'});\n};\napp.use('/protected',auth);`, explanation: "Auth middleware." }] },
            { title: "Async Route Handlers", content: "Handle asynchronous operations in routes. Use async/await to work with promises and databases.", concepts: ["async/await", "async handlers", "promises"], examples: [{ code: `app.get('/data',async(req,res)=>{\n  const data=await fetchData();\n  res.json(data);\n});`, explanation: "Async handler." }] },
            { title: "Error Middleware", content: "Implement comprehensive error handling with custom error classes and middleware. Handle different error types appropriately.", concepts: ["error middleware", "custom errors", "error types"], examples: [{ code: `app.use((err,req,res,next)=>{\n  console.error(err);\n  res.status(err.status||500).json({error:err.message});\n});`, explanation: "Error middleware." }] },
            { title: "Request Logging", content: "Implement request logging middleware to track all incoming requests. Log method, path, IP, and response time.", concepts: ["logging", "morgan", "request tracking"], examples: [{ code: `const morgan=require('morgan');\napp.use(morgan('combined'));`, explanation: "Request logging." }] },
            { title: "Rate Limiting", content: "Implement rate limiting to prevent abuse. Limit the number of requests from a single IP address.", concepts: ["rate limiting", "express-rate-limit"], examples: [{ code: `const rateLimit=require('express-rate-limit');\nconst limiter=rateLimit({windowMs:60000,max:100});\napp.use(limiter);`, explanation: "Rate limiting." }] },
            { title: "File Uploads", content: "Handle file uploads using multer middleware. Accept and process uploaded files from clients.", concepts: ["multer", "file upload", "multipart"], examples: [{ code: `const multer=require('multer');\nconst upload=multer({dest:'uploads/'});\napp.post('/upload',upload.single('file'),(req,res)=>res.json({file:req.file}));`, explanation: "File upload." }] },
            { title: "Session Management", content: "Implement session management to track user state across requests. Use express-session for persistent sessions.", concepts: ["express-session", "sessions", "state management"], examples: [{ code: `const session=require('express-session');\napp.use(session({secret:'key',resave:false,saveUninitialized:true}));`, explanation: "Session setup." }] },
            { title: "API Versioning", content: "Implement API versioning to support multiple versions of your API simultaneously. Use route prefixes for versions.", concepts: ["API versioning", "version routes"], examples: [{ code: `app.use('/api/v1',v1Router);\napp.use('/api/v2',v2Router);`, explanation: "API versioning." }] },
            { title: "Request Validation", content: "Implement comprehensive request validation using libraries like Joi or express-validator. Validate all input data thoroughly.", concepts: ["validation", "express-validator", "input sanitization"], examples: [{ code: `const {body,validationResult}=require('express-validator');\napp.post('/user',body('email').isEmail(),(req,res)=>{\n  const errors=validationResult(req);\n  if(!errors.isEmpty()) return res.status(400).json({errors:errors.array()});\n  res.json({ok:true});\n});`, explanation: "Request validation." }] },
            { title: "Production Best Practices", content: "Implement production-ready features like security headers, compression, and environment-based configuration. Secure and optimize your Express app.", concepts: ["helmet", "compression", "security", "production config"], examples: [{ code: `const helmet=require('helmet');\nconst compression=require('compression');\napp.use(helmet());\napp.use(compression());`, explanation: "Security & compression." }] }
          ]
        },

        flask: {
          easy: [
            { title: "Hello Flask Friend", content: "Spin up a tiny Flask app that says hello.", concepts: ["Flask app", "route"], examples: [{ code: `from flask import Flask\napp=Flask(__name__)\n@app.route('/')\ndef hi(): return "Hi Flask!"`, explanation: "Basic route." }] },
            { title: "Friendly JSON", content: "Return a happy JSON message.", concepts: ["jsonify"], examples: [{ code: `from flask import jsonify\n@app.route('/json')\ndef j(): return jsonify(ok=True,msg="hi")`, explanation: "JSON response." }] },
            { title: "Path Playground", content: "Grab a name from the path and wave.", concepts: ["path param"], examples: [{ code: `@app.route('/hi/<name>')\ndef hi(name): return f"Hi {name}!"`, explanation: "Path parameter." }] },
            { title: "Query Clues", content: "Read query strings like secret notes.", concepts: ["request.args"], examples: [{ code: `from flask import request\n@app.route('/echo')\ndef echo(): return request.args.get('msg','?')`, explanation: "Query read." }] },
            { title: "Postbox Echo", content: "Echo back posted JSON gently.", concepts: ["request.get_json"], examples: [{ code: `@app.route('/echo',methods=['POST'])\ndef echo(): data=request.get_json() or {}; return data`, explanation: "Echo JSON." }] },
            { title: "Happy Status", content: "Send custom status codes with a smile.", concepts: ["status code"], examples: [{ code: `return "created",201`, explanation: "Custom status." }] },
            { title: "Little Headers", content: "Add a tiny custom header.", concepts: ["Response headers"], examples: [{ code: `resp = jsonify(ok=True); resp.headers['X-Friend']='Flask'; return resp`, explanation: "Custom header." }] },
            { title: "Static Hello", content: "Serve a simple HTML greeting.", concepts: ["text/html"], examples: [{ code: `return "<h1>Hello!</h1>"`, explanation: "Inline HTML." }] },
            { title: "Debug Switch", content: "Turn on debug for quick tinkering.", concepts: ["app.run(debug=True)"], examples: [{ code: `if __name__=='__main__': app.run(debug=True)`, explanation: "Debug run." }] },
            { title: "One-Route Cleanup", content: "Keep the app tiny—one neat route.", concepts: ["minimal app"], examples: [{ code: `app = Flask(__name__)`, explanation: "Tiny app." }] }
          ],
          medium: [
            { title: "Blueprint Blocks", content: "Split routes into blueprints like toy blocks.", concepts: ["Blueprint"], examples: [{ code: `from flask import Blueprint\napi=Blueprint('api',__name__)\n@api.route('/ping')\ndef ping(): return 'pong'`, explanation: "Blueprint basics." }] },
            { title: "Middle Helpers", content: "Use before_request as a gentle guardian.", concepts: ["before_request"], examples: [{ code: `@app.before_request\ndef log(): print("hi")`, explanation: "Hook." }] },
            { title: "Form Snacks", content: "Nibble on form data from friends.", concepts: ["request.form"], examples: [{ code: `request.form.get('name')`, explanation: "Form read." }] },
            { title: "File Peek", content: "Peek at an uploaded file name.", concepts: ["request.files"], examples: [{ code: `f=request.files.get('pic'); return f.filename if f else "nope"`, explanation: "File check." }] },
            { title: "Error Blanket", content: "Catch 404s softly with handlers.", concepts: ["errorhandler"], examples: [{ code: `@app.errorhandler(404)\ndef oops(e): return "lost",404`, explanation: "404 handler." }] },
            { title: "CORS Hug", content: "Add CORS so friends can call you.", concepts: ["CORS"], examples: [{ code: `from flask_cors import CORS\nCORS(app)`, explanation: "Simple CORS." }] },
            { title: "Config Chest", content: "Store secrets in config safely.", concepts: ["app.config"], examples: [{ code: `app.config['SECRET']="shh"`, explanation: "Config use." }] },
            { title: "JSON Validate", content: "Check required JSON keys politely.", concepts: ["validation"], examples: [{ code: `data=request.get_json() or {}; assert 'name' in data`, explanation: "Basic check." }] },
            { title: "Tiny Auth Check", content: "Guard a route with a header key.", concepts: ["simple auth"], examples: [{ code: `if request.headers.get('X-Key')!='123': return 'no',401`, explanation: "Header check." }] },
            { title: "Graceful Bye", content: "Stop the dev server after a demo call.", concepts: ["shutdown"], examples: [{ code: `func=request.environ.get('werkzeug.server.shutdown'); func() if func else None`, explanation: "Shutdown hook." }] }
          ],
          hard: [
            { title: "JWT Peek", content: "Decode a JWT payload (no verify) for learning.", concepts: ["JWT decode"], examples: [{ code: `import base64,json\ndef peek(tok): return json.loads(base64.urlsafe_b64decode(tok.split('.')[1]+'=='))`, explanation: "Decode payload." }] },
            { title: "Pagination", content: "Serve pages of items with ?page & ?limit.", concepts: ["pagination"], examples: [{ code: `page=int(request.args.get('page',1))`, explanation: "Read page param." }] },
            { title: "Rate Counter", content: "Count requests per IP in memory.", concepts: ["rate limit counter"], examples: [{ code: `hits[ip]=hits.get(ip,0)+1`, explanation: "Hit counter." }] },
            { title: "Cache Basket", content: "Cache a response for a short time.", concepts: ["simple cache"], examples: [{ code: `cache['/data']={'val':v,'exp':time()+5}`, explanation: "TTL cache." }] },
            { title: "Background Task", content: "Kick off a light thread task.", concepts: ["threading"], examples: [{ code: `Thread(target=do_work).start()`, explanation: "Fire-and-forget." }] },
            { title: "Streaming", content: "Stream chunks back like story pages.", concepts: ["yield"], examples: [{ code: `def stream(): yield "part1"; yield "done"`, explanation: "Stream response." }] },
            { title: "File Stats", content: "Report file size/mtime with os.path.", concepts: ["os.stat"], examples: [{ code: `import os; s=os.stat(__file__)`, explanation: "Stat file." }] },
            { title: "Headers Filter", content: "Return safe headers, hide secrets.", concepts: ["header filtering"], examples: [{ code: `{k:v for k,v in request.headers if k.lower()!='authorization'}`, explanation: "Filter auth." }] },
            { title: "JSON Schema Lite", content: "Manually check field types.", concepts: ["type checks"], examples: [{ code: `if not isinstance(data.get('age'),int): return 'bad',400`, explanation: "Type guard." }] },
            { title: "Health Combo", content: "Health endpoint returns uptime & version.", concepts: ["health"], examples: [{ code: `return {'ok':True,'uptime':time()-start}` , explanation: "Health JSON." }] }
          ]
        },

        fastapi: {
          easy: [
            { title: "Hello FastAPI", content: "Spin a speedy hello endpoint.", concepts: ["FastAPI app", "get"], examples: [{ code: `from fastapi import FastAPI\napp=FastAPI()\n@app.get("/")\ndef hi(): return {"hi":"fast"}`, explanation: "Basic GET." }] },
            { title: "Path Buddy", content: "Greet a buddy from the path.", concepts: ["path param"], examples: [{ code: `@app.get("/hi/{name}")\ndef hi(name:str): return {"hi":name}`, explanation: "Path param." }] },
            { title: "Query Snacks", content: "Nibble query params easily.", concepts: ["Query"], examples: [{ code: `@app.get("/echo")\ndef echo(msg:str="yo"): return {"msg":msg}`, explanation: "Query default." }] },
            { title: "JSON Echo", content: "Echo posted JSON back.", concepts: ["POST", "Body"], examples: [{ code: `from fastapi import Body\n@app.post("/echo")\ndef echo(data:dict=Body(...)): return data`, explanation: "Echo body." }] },
            { title: "Status Stories", content: "Return custom status codes.", concepts: ["status_code"], examples: [{ code: `@app.post("/make",status_code=201)\ndef make(): return {"made":True}`, explanation: "201 status." }] },
            { title: "Headers Hello", content: "Send a friendly header.", concepts: ["Response headers"], examples: [{ code: `from fastapi import Response\n@app.get("/hat")\ndef hat(res:Response): res.headers["X-Hat"]="blue"; return {"ok":True}`, explanation: "Custom header." }] },
            { title: "Validation Magic", content: "Let Pydantic validate shapes for you.", concepts: ["BaseModel"], examples: [{ code: `from pydantic import BaseModel\nclass Item(BaseModel): name:str\n@app.post("/item")\ndef item(it:Item): return it`, explanation: "Model validation." }] },
            { title: "Docs Playground", content: "Open the auto docs at /docs.", concepts: ["OpenAPI"], examples: [{ code: `# visit /docs`, explanation: "Auto docs." }] },
            { title: "JSON by Default", content: "Notice responses are JSON ready.", concepts: ["auto JSON"], examples: [{ code: `return {"ok":True}`, explanation: "JSON auto." }] },
            { title: "One-Run Demo", content: "Run uvicorn for a quick show.", concepts: ["uvicorn"], examples: [{ code: `# uvicorn main:app --reload`, explanation: "Run command." }] }
          ],
          medium: [
            { title: "Path & Query Combo", content: "Mix path and query params.", concepts: ["path+query"], examples: [{ code: `@app.get("/user/{uid}")\ndef user(uid:int, q:str|None=None): return {"uid":uid,"q":q}`, explanation: "Both params." }] },
            { title: "Enum Choices", content: "Use Enums for safe choices.", concepts: ["Enum"], examples: [{ code: `class Mood(str,Enum): happy="happy";@app.get("/mood/{m}")\ndef mood(m:Mood): return m`, explanation: "Enum path." }] },
            { title: "Dependency Candy", content: "Share helpers with Depends.", concepts: ["Depends"], examples: [{ code: `from fastapi import Depends\ndef get_db(): return "db"\n@app.get("/db")\ndef db(db=Depends(get_db)): return db`, explanation: "Depends demo." }] },
            { title: "Custom Response", content: "Return HTML or plain text.", concepts: ["Response classes"], examples: [{ code: `from fastapi.responses import PlainTextResponse\n@app.get("/txt",response_class=PlainTextResponse)\ndef txt(): return "hi"`, explanation: "Plain text." }] },
            { title: "CORS Hat", content: "Add CORSMiddleware for friends.", concepts: ["CORSMiddleware"], examples: [{ code: `from fastapi.middleware.cors import CORSMiddleware\napp.add_middleware(CORSMiddleware,allow_origins=["*"])`, explanation: "CORS." }] },
            { title: "Error Handler", content: "Catch 404/500 with handlers.", concepts: ["exception_handler"], examples: [{ code: `from fastapi import Request,HTTPException\n@app.exception_handler(HTTPException)\nasync def oops(req,exc): return PlainTextResponse("no",exc.status_code)`, explanation: "Error hook." }] },
            { title: "Background Task", content: "Run a tiny task after respond.", concepts: ["BackgroundTasks"], examples: [{ code: `from fastapi import BackgroundTasks\n@app.post("/task")\ndef t(bg:BackgroundTasks): bg.add_task(print,"done"); return {"ok":True}`, explanation: "Background work." }] },
            { title: "File Upload Peek", content: "Inspect uploaded file name.", concepts: ["UploadFile"], examples: [{ code: `from fastapi import UploadFile,File\n@app.post("/up")\ndef up(f:UploadFile=File(...)): return {"name":f.filename}`, explanation: "Upload name." }] },
            { title: "Cookie Crumbs", content: "Read cookies softly.", concepts: ["Cookie"], examples: [{ code: `from fastapi import Cookie\n@app.get("/cookie")\ndef c(choco:str|None=Cookie(None)): return {"cookie":choco}`, explanation: "Cookie read." }] },
            { title: "Shutdown Event", content: "Print a goodbye on shutdown.", concepts: ["lifespan/shutdown"], examples: [{ code: `@app.on_event("shutdown")\nasync def bye(): print("bye")`, explanation: "Shutdown hook." }] }
          ],
          hard: [
            { title: "Auth Bearer Peek", content: "Parse Authorization header.", concepts: ["Header"], examples: [{ code: `from fastapi import Header\n@app.get("/auth")\ndef auth(auth: str | None = Header(None)): return {"auth":auth}`, explanation: "Read header." }] },
            { title: "Pagination", content: "Paginate list with skip/limit.", concepts: ["skip/limit"], examples: [{ code: `@app.get("/items")\ndef items(skip:int=0,limit:int=10): return DATA[skip:skip+limit]`, explanation: "Simple pagination." }] },
            { title: "Simple Cache", content: "Cache last response in memory.", concepts: ["dict cache"], examples: [{ code: `cache={'data':None};`, explanation: "Manual cache." }] },
            { title: "Webhooks", content: "Receive and log webhook JSON.", concepts: ["logging body"], examples: [{ code: `@app.post("/hook")\ndef hook(data:dict): print(data); return {"ok":True}`, explanation: "Log webhook." }] },
            { title: "Rate Counter", content: "Track calls per IP (naive).", concepts: ["ip count"], examples: [{ code: `hits[ip]=hits.get(ip,0)+1`, explanation: "Count ip." }] },
            { title: "ETag/Headers", content: "Return custom headers/etag.", concepts: ["headers"], examples: [{ code: `res=JSONResponse({"ok":1}); res.headers["ETag"]="123"; return res`, explanation: "ETag set." }] },
            { title: "Streaming", content: "Stream text chunks.", concepts: ["StreamingResponse"], examples: [{ code: `from fastapi.responses import StreamingResponse\nasync def gen(): yield "hi"; yield "bye"\n@app.get("/stream")\ndef s(): return StreamingResponse(gen())`, explanation: "Stream response." }] },
            { title: "Docs Tags", content: "Organize routes with tags.", concepts: ["tags"], examples: [{ code: `@app.get("/pets",tags=["pets"])`, explanation: "Tag route." }] },
            { title: "Dependency Override", content: "Swap dependencies in tests.", concepts: ["dependency_overrides"], examples: [{ code: `app.dependency_overrides[get_db]=fake_db`, explanation: "Override dep." }] },
            { title: "Timeout Failsafe", content: "Auto-exit demo to avoid hangs.", concepts: ["asyncio timeout"], examples: [{ code: `import asyncio; asyncio.get_event_loop().call_later(3,exit,0)`, explanation: "Fail-safe exit." }] }
          ]
        },

        roblox: {
          easy: [
            { title: "Hello Roblox World", content: "Print a welcome in the output window.", concepts: ["print"], examples: [{ code: `print("Hello, Roblox!")`, explanation: "Simple print." }] },
            { title: "Talkative Part", content: "Make a Part greet when touched.", concepts: ["Touched event"], examples: [{ code: `script.Parent.Touched:Connect(function()\n print("Hi there!")\nend)`, explanation: "Touched event." }] },
            { title: "Color Change", content: "Change a Part's color playfully.", concepts: ["BrickColor"], examples: [{ code: `script.Parent.BrickColor = BrickColor.new("Bright blue")`, explanation: "Color set." }] },
            { title: "Jump Power", content: "Boost player jump like a trampoline.", concepts: ["Humanoid.JumpPower"], examples: [{ code: `humanoid.JumpPower = 70`, explanation: "Set jump." }] },
            { title: "Chat Bubble", content: "Print a friendly chat line.", concepts: ["StarterGui:SetCore"], examples: [{ code: `game.StarterGui:SetCore("ChatMakeSystemMessage",{Text="Hi!"})`, explanation: "Chat message." }] },
            { title: "Collect Coin", content: "Increase score when touching a coin part.", concepts: ["leaderstats"], examples: [{ code: `leaderstats.Coins.Value += 1`, explanation: "Add coin." }] },
            { title: "Tween Move", content: "Tween a part to slide smoothly.", concepts: ["TweenService"], examples: [{ code: `local tw=game:GetService("TweenService")`, explanation: "Tween start." }] },
            { title: "Sound Cheer", content: "Play a cheer sound on touch.", concepts: ["Sound:Play"], examples: [{ code: `script.Parent.Sound:Play()`, explanation: "Play sound." }] },
            { title: "Spawn Friend", content: "Clone a friendly NPC.", concepts: ["Clone"], examples: [{ code: `local npc=template:Clone(); npc.Parent=workspace`, explanation: "Clone npc." }] },
            { title: "Safe Output", content: "Use pcall to guard risky code.", concepts: ["pcall"], examples: [{ code: `local ok,err=pcall(function() risky() end)`, explanation: "Guard call." }] }
          ],
          medium: [
            { title: "Leaderboard Setup", content: "Create leaderstats for coins.", concepts: ["leaderstats folder"], examples: [{ code: `game.Players.PlayerAdded:Connect(function(p)\n local l=Instance.new("Folder",p); l.Name="leaderstats"; local c=Instance.new("IntValue",l); c.Name="Coins"\nend)`, explanation: "Leaderstats." }] },
            { title: "Remote Hello", content: "Fire a RemoteEvent to greet server.", concepts: ["RemoteEvent"], examples: [{ code: `RemoteEvent:FireServer("hello")`, explanation: "Remote fire." }] },
            { title: "Server Listener", content: "Listen to RemoteEvent on server.", concepts: ["OnServerEvent"], examples: [{ code: `RemoteEvent.OnServerEvent:Connect(function(player,msg) print(player,msg) end)`, explanation: "Server receive." }] },
            { title: "Tool Pickup", content: "Give a tool when touching pad.", concepts: ["Tool clone"], examples: [{ code: `tool:Clone().Parent = player.Backpack`, explanation: "Give tool." }] },
            { title: "Simple Obby", content: "Detect fall and respawn.", concepts: ["Humanoid.Died"], examples: [{ code: `humanoid.Died:Connect(function() player:LoadCharacter() end)`, explanation: "Respawn." }] },
            { title: "Lighting Mood", content: "Change lighting for ambience.", concepts: ["Lighting"], examples: [{ code: `game.Lighting.Brightness = 2`, explanation: "Set lighting." }] },
            { title: "GUI Button", content: "Button prints a message on click.", concepts: ["MouseButton1Click"], examples: [{ code: `button.MouseButton1Click:Connect(function() print("Clicked!") end)`, explanation: "Button click." }] },
            { title: "DataStore Save", content: "Save coins (mock pattern).", concepts: ["DataStoreService"], examples: [{ code: `local ds=game:GetService("DataStoreService"):GetDataStore("Coins")`, explanation: "DataStore ref." }] },
            { title: "Raycast Peek", content: "Raycast forward to detect hits.", concepts: ["Raycast"], examples: [{ code: `workspace:Raycast(origin,direction)`, explanation: "Raycast check." }] },
            { title: "Heartbeat Loop", content: "Run logic each frame safely.", concepts: ["RunService.Heartbeat"], examples: [{ code: `game:GetService("RunService").Heartbeat:Connect(function(dt) end)`, explanation: "Frame loop." }] }
          ],
          hard: [
            { title: "Remote Security", content: "Validate RemoteEvent inputs.", concepts: ["server-side checks"], examples: [{ code: `if typeof(msg)~="string" then return end`, explanation: "Validate input." }] },
            { title: "Cooldowns", content: "Add per-player cooldown timers.", concepts: ["tick()", "os.clock"], examples: [{ code: `if tick()-last < 1 then return end`, explanation: "Cooldown gate." }] },
            { title: "Zone Detection", content: "Detect players in a region.", concepts: ["GetTouchingParts", "Region3"], examples: [{ code: `-- use Region3 or Magnitude`, explanation: "Zone check." }] },
            { title: "Custom Camera", content: "Adjust camera for cutscenes.", concepts: ["CameraType", "CFrame"], examples: [{ code: `camera.CameraType=Enum.CameraType.Scriptable`, explanation: "Scripted cam." }] },
            { title: "State Machine", content: "Track NPC states (idle/run).", concepts: ["state enum"], examples: [{ code: `local state="idle"`, explanation: "State var." }] },
            { title: "Tween Chains", content: "Chain tweens for animation.", concepts: ["Tween.Completed"], examples: [{ code: `tween.Completed:Connect(function() next:Play() end)`, explanation: "Chain tweens." }] },
            { title: "Inventory Table", content: "Manage inventory server-side.", concepts: ["tables", "replication"], examples: [{ code: `inventory[player]=inventory[player] or {}`, explanation: "Store inventory." }] },
            { title: "Server Profiling", content: "Measure execution time.", concepts: ["debug.profilebegin"], examples: [{ code: `debug.profilebegin("task")`, explanation: "Profile snippet." }] },
            { title: "Anti-Exploit Basics", content: "Sanitize client values, never trust.", concepts: ["server trust"], examples: [{ code: `if value>1000 then return end`, explanation: "Clamp values." }] },
            { title: "Chunked Spawns", content: "Spawn NPCs gradually to avoid lag.", concepts: ["wait()", "batches"], examples: [{ code: `for i=1,20 do spawnOne(); task.wait(0.05) end`, explanation: "Batch spawn." }] }
          ]
        },
        sql: {
          easy: [
            { title: "Doraemon's Toy Box (SELECT basics)", content: "See all toys in Doraemon's magic box!", concepts: ["SELECT", "FROM"], examples: [{ code: `SELECT * FROM toys;`, explanation: "Get all toys." }] },
            { title: "Bheem's Favorite Snacks (SELECT specific columns)", content: "List only ladoo names from Bheem's snack list.", concepts: ["column selection"], examples: [{ code: `SELECT name FROM snacks;`, explanation: "Pick columns." }] },
            { title: "Shinchan's Friends (WHERE filter)", content: "Find friends who are 5 years old like Shinchan.", concepts: ["WHERE"], examples: [{ code: `SELECT name FROM friends WHERE age = 5;`, explanation: "Filter rows." }] },
            { title: "Motu's Big Meals (WHERE with >)", content: "Find meals bigger than 10 plates.", concepts: ["comparison operators"], examples: [{ code: `SELECT meal FROM foods WHERE plates > 10;`, explanation: "Greater than filter." }] },
            { title: "Oggy's Clean Room (WHERE with =)", content: "Find rooms that are clean.", concepts: ["equality check"], examples: [{ code: `SELECT room FROM house WHERE status = 'clean';`, explanation: "Equal check." }] },
            { title: "Nobita's Homework (ORDER BY)", content: "Sort homework by due date.", concepts: ["ORDER BY"], examples: [{ code: `SELECT * FROM homework ORDER BY due_date;`, explanation: "Sort results." }] },
            { title: "Chutki's Toys (ORDER BY DESC)", content: "Show newest toys first.", concepts: ["DESC"], examples: [{ code: `SELECT * FROM toys ORDER BY date DESC;`, explanation: "Reverse sort." }] },
            { title: "Doraemon's Gadgets (LIMIT)", content: "Show only first 5 gadgets.", concepts: ["LIMIT"], examples: [{ code: `SELECT * FROM gadgets LIMIT 5;`, explanation: "Top N rows." }] },
            { title: "Bheem's Snacks Count (COUNT)", content: "Count how many snacks Bheem has.", concepts: ["COUNT"], examples: [{ code: `SELECT COUNT(*) FROM snacks;`, explanation: "Count rows." }] },
            { title: "Shinchan's Total Score (SUM)", content: "Add up all Shinchan's game scores.", concepts: ["SUM"], examples: [{ code: `SELECT SUM(score) FROM games;`, explanation: "Sum values." }] },
            { title: "Motu's Average Plates (AVG)", content: "Find average plates Motu eats.", concepts: ["AVG"], examples: [{ code: `SELECT AVG(plates) FROM meals;`, explanation: "Average calculation." }] },
            { title: "Oggy's Biggest Problem (MAX)", content: "Find the biggest problem Oggy faced.", concepts: ["MAX"], examples: [{ code: `SELECT MAX(size) FROM problems;`, explanation: "Maximum value." }] },
            { title: "Nobita's Smallest Grade (MIN)", content: "Find Nobita's lowest grade.", concepts: ["MIN"], examples: [{ code: `SELECT MIN(grade) FROM tests;`, explanation: "Minimum value." }] },
            { title: "Chutki's Grouped Toys (GROUP BY)", content: "Count toys by color.", concepts: ["GROUP BY"], examples: [{ code: `SELECT color, COUNT(*) FROM toys GROUP BY color;`, explanation: "Group and count." }] },
            { title: "Doraemon's Friends (DISTINCT)", content: "List unique friend names only.", concepts: ["DISTINCT"], examples: [{ code: `SELECT DISTINCT name FROM friends;`, explanation: "Unique values." }] },
            { title: "Bheem's Snacks with Ladoos (LIKE)", content: "Find snacks with 'ladoo' in name.", concepts: ["LIKE"], examples: [{ code: `SELECT * FROM snacks WHERE name LIKE '%ladoo%';`, explanation: "Pattern match." }] },
            { title: "Shinchan's Multiple Ages (IN)", content: "Find friends who are 4, 5, or 6 years old.", concepts: ["IN"], examples: [{ code: `SELECT * FROM friends WHERE age IN (4, 5, 6);`, explanation: "Multiple values." }] },
            { title: "Motu's Range of Meals (BETWEEN)", content: "Find meals between 5 and 15 plates.", concepts: ["BETWEEN"], examples: [{ code: `SELECT * FROM meals WHERE plates BETWEEN 5 AND 15;`, explanation: "Range filter." }] },
            { title: "Oggy's Not Clean Rooms (NOT)", content: "Find rooms that are NOT clean.", concepts: ["NOT"], examples: [{ code: `SELECT * FROM rooms WHERE status NOT LIKE 'clean';`, explanation: "Negation." }] },
            { title: "Nobita's Missing Homework (IS NULL)", content: "Find homework with no due date.", concepts: ["IS NULL"], examples: [{ code: `SELECT * FROM homework WHERE due_date IS NULL;`, explanation: "Null check." }] },
            { title: "Chutki's Complete Toys (IS NOT NULL)", content: "Find toys with descriptions.", concepts: ["IS NOT NULL"], examples: [{ code: `SELECT * FROM toys WHERE description IS NOT NULL;`, explanation: "Not null check." }] },
            { title: "Doraemon's AND Condition", content: "Find gadgets that are blue AND powerful.", concepts: ["AND"], examples: [{ code: `SELECT * FROM gadgets WHERE color = 'blue' AND power > 50;`, explanation: "Multiple conditions." }] },
            { title: "Bheem's OR Condition", content: "Find snacks that are ladoos OR jalebis.", concepts: ["OR"], examples: [{ code: `SELECT * FROM snacks WHERE name = 'ladoo' OR name = 'jalebi';`, explanation: "Either condition." }] },
            { title: "Shinchan's Combined Filters", content: "Find friends who are 5 years old OR named 'Kazama'.", concepts: ["OR with WHERE"], examples: [{ code: `SELECT * FROM friends WHERE age = 5 OR name = 'Kazama';`, explanation: "Combined filter." }] },
            { title: "Motu's Alias Names (AS)", content: "Rename columns with friendly names.", concepts: ["AS"], examples: [{ code: `SELECT name AS snack_name, plates AS quantity FROM meals;`, explanation: "Column aliases." }] },
            { title: "Oggy's Sorted Problems", content: "Sort problems by size, then by date.", concepts: ["multiple ORDER BY"], examples: [{ code: `SELECT * FROM problems ORDER BY size DESC, date ASC;`, explanation: "Multi-column sort." }] },
            { title: "Nobita's Top 3 Grades", content: "Show only top 3 best grades.", concepts: ["ORDER BY with LIMIT"], examples: [{ code: `SELECT * FROM grades ORDER BY score DESC LIMIT 3;`, explanation: "Top N." }] },
            { title: "Chutki's Average by Type", content: "Find average price for each toy type.", concepts: ["GROUP BY with AVG"], examples: [{ code: `SELECT type, AVG(price) FROM toys GROUP BY type;`, explanation: "Grouped average." }] },
            { title: "Doraemon's Having Clause", content: "Show colors with more than 5 toys.", concepts: ["HAVING"], examples: [{ code: `SELECT color, COUNT(*) FROM toys GROUP BY color HAVING COUNT(*) > 5;`, explanation: "Filter groups." }] },
            { title: "Bheem's Total by Category", content: "Sum snacks by category.", concepts: ["GROUP BY with SUM"], examples: [{ code: `SELECT category, SUM(quantity) FROM snacks GROUP BY category;`, explanation: "Grouped sum." }] },
            { title: "Shinchan's String Fun (CONCAT)", content: "Join friend names together.", concepts: ["CONCAT"], examples: [{ code: `SELECT CONCAT(first_name, ' ', last_name) AS full_name FROM friends;`, explanation: "Combine strings." }] },
            { title: "Motu's Date Magic (DATE functions)", content: "Find meals from last week.", concepts: ["DATE functions"], examples: [{ code: `SELECT * FROM meals WHERE meal_date >= DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY);`, explanation: "Date filtering." }] },
            { title: "Oggy's Number Rounding (ROUND)", content: "Round problem sizes to whole numbers.", concepts: ["ROUND"], examples: [{ code: `SELECT problem, ROUND(size) AS rounded_size FROM problems;`, explanation: "Round numbers." }] },
            { title: "Nobita's Smart Categories (CASE)", content: "Label grades as Good or Needs Work.", concepts: ["CASE WHEN"], examples: [{ code: `SELECT grade, CASE WHEN grade >= 60 THEN 'Good' ELSE 'Needs Work' END AS status FROM tests;`, explanation: "Conditional labels." }] }
          ],
          medium: [
            { title: "Simple Joins", content: "Join two tables to combine related data.", concepts: ["INNER JOIN"], examples: [{ code: `SELECT u.name, o.order_id FROM users u INNER JOIN orders o ON u.id = o.user_id;`, explanation: "Basic join." }] },
            { title: "Left Join", content: "Get all users even without orders.", concepts: ["LEFT JOIN"], examples: [{ code: `SELECT u.name, o.order_id FROM users u LEFT JOIN orders o ON u.id = o.user_id;`, explanation: "Left join." }] },
            { title: "Right Join", content: "Get all orders even without users.", concepts: ["RIGHT JOIN"], examples: [{ code: `SELECT u.name, o.order_id FROM users u RIGHT JOIN orders o ON u.id = o.user_id;`, explanation: "Right join." }] },
            { title: "Full Outer Join", content: "Get all records from both tables.", concepts: ["FULL OUTER JOIN"], examples: [{ code: `SELECT u.name, o.order_id FROM users u FULL OUTER JOIN orders o ON u.id = o.user_id;`, explanation: "Full join." }] },
            { title: "Self Join", content: "Join a table to itself.", concepts: ["self join"], examples: [{ code: `SELECT e1.name, e2.name AS manager FROM employees e1 JOIN employees e2 ON e1.manager_id = e2.id;`, explanation: "Self reference." }] },
            { title: "Subquery Basics", content: "Use query inside another query.", concepts: ["subquery"], examples: [{ code: `SELECT * FROM products WHERE price > (SELECT AVG(price) FROM products);`, explanation: "Subquery filter." }] },
            { title: "EXISTS Clause", content: "Check if subquery returns rows.", concepts: ["EXISTS"], examples: [{ code: `SELECT * FROM customers WHERE EXISTS (SELECT 1 FROM orders WHERE orders.customer_id = customers.id);`, explanation: "Existence check." }] },
            { title: "IN with Subquery", content: "Filter using subquery results.", concepts: ["IN subquery"], examples: [{ code: `SELECT * FROM products WHERE category_id IN (SELECT id FROM categories WHERE active = 1);`, explanation: "Subquery IN." }] },
            { title: "CASE Statements", content: "Conditional logic in SELECT.", concepts: ["CASE WHEN"], examples: [{ code: `SELECT name, CASE WHEN age < 18 THEN 'Minor' ELSE 'Adult' END AS status FROM users;`, explanation: "Conditional column." }] },
            { title: "Window Functions", content: "Calculate over row groups.", concepts: ["OVER"], examples: [{ code: `SELECT name, salary, RANK() OVER (ORDER BY salary DESC) FROM employees;`, explanation: "Ranking." }] },
            { title: "ROW_NUMBER", content: "Assign sequential numbers.", concepts: ["ROW_NUMBER"], examples: [{ code: `SELECT name, ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary) FROM employees;`, explanation: "Row numbering." }] },
            { title: "RANK and DENSE_RANK", content: "Rank with different tie handling.", concepts: ["RANK", "DENSE_RANK"], examples: [{ code: `SELECT name, RANK() OVER (ORDER BY score), DENSE_RANK() OVER (ORDER BY score) FROM students;`, explanation: "Ranking functions." }] },
            { title: "LAG and LEAD", content: "Access previous/next row values.", concepts: ["LAG", "LEAD"], examples: [{ code: `SELECT date, sales, LAG(sales) OVER (ORDER BY date) AS prev_sales FROM daily_sales;`, explanation: "Previous value." }] },
            { title: "CTE Basics", content: "Common Table Expressions for readability.", concepts: ["WITH"], examples: [{ code: `WITH high_sales AS (SELECT * FROM sales WHERE amount > 1000) SELECT * FROM high_sales;`, explanation: "CTE example." }] },
            { title: "Recursive CTE", content: "Recursive queries for hierarchies.", concepts: ["recursive CTE"], examples: [{ code: `WITH RECURSIVE tree AS (SELECT id, name, parent_id FROM nodes WHERE parent_id IS NULL UNION ALL SELECT n.id, n.name, n.parent_id FROM nodes n JOIN tree t ON n.parent_id = t.id) SELECT * FROM tree;`, explanation: "Hierarchy traversal." }] },
            { title: "UNION", content: "Combine results from multiple queries.", concepts: ["UNION"], examples: [{ code: `SELECT name FROM table1 UNION SELECT name FROM table2;`, explanation: "Combine queries." }] },
            { title: "UNION ALL", content: "Combine with duplicates.", concepts: ["UNION ALL"], examples: [{ code: `SELECT name FROM table1 UNION ALL SELECT name FROM table2;`, explanation: "Keep duplicates." }] },
            { title: "INTERSECT", content: "Find common rows between queries.", concepts: ["INTERSECT"], examples: [{ code: `SELECT id FROM table1 INTERSECT SELECT id FROM table2;`, explanation: "Common values." }] },
            { title: "EXCEPT", content: "Find rows in first but not second query.", concepts: ["EXCEPT"], examples: [{ code: `SELECT id FROM table1 EXCEPT SELECT id FROM table2;`, explanation: "Difference." }] },
            { title: "String Functions", content: "Manipulate text data.", concepts: ["CONCAT", "SUBSTRING", "LENGTH"], examples: [{ code: `SELECT CONCAT(first_name, ' ', last_name) AS full_name, SUBSTRING(email, 1, 5) AS prefix FROM users;`, explanation: "String operations." }] },
            { title: "Date Functions", content: "Work with dates and times.", concepts: ["DATE", "DATEADD", "DATEDIFF"], examples: [{ code: `SELECT DATEADD(day, 7, order_date) AS delivery_date, DATEDIFF(day, order_date, GETDATE()) AS days_ago FROM orders;`, explanation: "Date calculations." }] },
            { title: "Aggregate with GROUPING", content: "Identify grouped vs total rows.", concepts: ["GROUPING"], examples: [{ code: `SELECT category, SUM(sales), GROUPING(category) AS is_total FROM sales GROUP BY ROLLUP(category);`, explanation: "Grouping indicator." }] },
            { title: "ROLLUP", content: "Generate subtotals.", concepts: ["ROLLUP"], examples: [{ code: `SELECT region, product, SUM(sales) FROM sales GROUP BY ROLLUP(region, product);`, explanation: "Hierarchical totals." }] },
            { title: "CUBE", content: "Generate all combination subtotals.", concepts: ["CUBE"], examples: [{ code: `SELECT region, product, SUM(sales) FROM sales GROUP BY CUBE(region, product);`, explanation: "All combinations." }] },
            { title: "PIVOT", content: "Transform rows to columns.", concepts: ["PIVOT"], examples: [{ code: `SELECT * FROM (SELECT product, month, sales FROM sales_data) AS src PIVOT (SUM(sales) FOR month IN ([Jan], [Feb], [Mar])) AS pvt;`, explanation: "Pivot table." }] },
            { title: "UNPIVOT", content: "Transform columns to rows.", concepts: ["UNPIVOT"], examples: [{ code: `SELECT product, month, sales FROM sales_pivot UNPIVOT (sales FOR month IN (Jan, Feb, Mar)) AS unpvt;`, explanation: "Unpivot data." }] },
            { title: "Stored Procedures", content: "Reusable SQL code blocks.", concepts: ["CREATE PROCEDURE"], examples: [{ code: `CREATE PROCEDURE GetUserOrders @user_id INT AS SELECT * FROM orders WHERE user_id = @user_id;`, explanation: "Procedure definition." }] },
            { title: "Functions", content: "User-defined functions.", concepts: ["CREATE FUNCTION"], examples: [{ code: `CREATE FUNCTION CalculateTotal(@price DECIMAL, @quantity INT) RETURNS DECIMAL AS BEGIN RETURN @price * @quantity; END;`, explanation: "Function example." }] },
            { title: "Triggers", content: "Automatic actions on data changes.", concepts: ["CREATE TRIGGER"], examples: [{ code: `CREATE TRIGGER update_timestamp ON orders AFTER INSERT AS UPDATE orders SET updated_at = GETDATE() WHERE id IN (SELECT id FROM inserted);`, explanation: "Trigger on insert." }] },
            { title: "Transactions", content: "Ensure data consistency.", concepts: ["BEGIN TRANSACTION", "COMMIT", "ROLLBACK"], examples: [{ code: `BEGIN TRANSACTION; UPDATE accounts SET balance = balance - 100 WHERE id = 1; UPDATE accounts SET balance = balance + 100 WHERE id = 2; COMMIT;`, explanation: "Transaction example." }] }
          ],
          hard: [
            { title: "Advanced Joins", content: "Complex multi-table joins.", concepts: ["multiple joins"], examples: [{ code: `SELECT u.name, o.order_id, p.product_name FROM users u JOIN orders o ON u.id = o.user_id JOIN order_items oi ON o.id = oi.order_id JOIN products p ON oi.product_id = p.id;`, explanation: "Multi-table join." }] },
            { title: "Correlated Subqueries", content: "Subqueries referencing outer query.", concepts: ["correlated subquery"], examples: [{ code: `SELECT name, (SELECT COUNT(*) FROM orders WHERE orders.user_id = users.id) AS order_count FROM users;`, explanation: "Correlated query." }] },
            { title: "Advanced Window Functions", content: "Complex windowing operations.", concepts: ["PARTITION BY", "ROWS BETWEEN"], examples: [{ code: `SELECT date, sales, SUM(sales) OVER (PARTITION BY region ORDER BY date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS moving_avg FROM sales;`, explanation: "Moving average." }] },
            { title: "Performance Optimization", content: "Index usage and query tuning.", concepts: ["indexes", "query plan"], examples: [{ code: `CREATE INDEX idx_user_email ON users(email); SELECT * FROM users WHERE email = 'test@example.com';`, explanation: "Index usage." }] },
            { title: "Query Optimization", content: "Optimize slow queries.", concepts: ["EXPLAIN", "query hints"], examples: [{ code: `EXPLAIN SELECT * FROM orders WHERE user_id = 123;`, explanation: "Query analysis." }] },
            { title: "Advanced CTE Patterns and Optimization", content: "Master complex Common Table Expression patterns for solving sophisticated data problems. Learn to optimize recursive CTEs, chain multiple CTEs efficiently, and use CTEs for complex analytical queries that would be difficult with traditional subqueries.", concepts: ["recursive CTE optimization", "multiple CTE chaining", "CTE materialization strategies", "performance tuning for CTEs", "CTE vs subquery trade-offs", "advanced recursive patterns"], examples: [{ code: `WITH RECURSIVE hierarchy AS (SELECT id, name, parent_id, 0 AS level FROM employees WHERE manager_id IS NULL UNION ALL SELECT e.id, e.name, e.parent_id, h.level + 1 FROM employees e JOIN hierarchy h ON e.manager_id = h.id) SELECT * FROM hierarchy ORDER BY level, name;`, explanation: "Optimized recursive hierarchy query." }] },
            { title: "Query Parallelization and Distributed Processing", content: "Implement parallel query execution strategies for large-scale data processing. Learn to leverage database parallel execution capabilities, optimize for multi-core systems, and design queries that scale across distributed database architectures for maximum performance.", concepts: ["parallel query execution", "degree of parallelism", "distributed query optimization", "partition-aware queries", "parallel aggregation", "scalability patterns"], examples: [{ code: `SELECT /*+ PARALLEL(orders, 8) */ region, product_category, SUM(sales) FROM orders GROUP BY region, product_category;`, explanation: "Parallel aggregation query." }] },
            { title: "Temporal Data Management and Time-Series Analysis", content: "Handle time-based data with advanced temporal SQL techniques. Master time-series queries, temporal table features, versioning, and historical data analysis patterns for tracking changes over time and querying data as it existed at specific points in history.", concepts: ["temporal tables", "system-versioned tables", "time-series queries", "temporal joins", "historical data analysis", "change tracking patterns"], examples: [{ code: `SELECT * FROM products FOR SYSTEM_TIME AS OF '2024-01-01' WHERE category = 'Electronics';`, explanation: "Query historical data at specific time." }] },
            { title: "Advanced Materialized View Strategies", content: "Design and optimize materialized views for complex reporting scenarios. Learn incremental refresh strategies, query rewrite optimization, and how to maintain materialized views efficiently in high-transaction environments while ensuring data consistency and performance.", concepts: ["materialized view design", "incremental refresh", "fast refresh strategies", "query rewrite optimization", "materialized view maintenance", "refresh scheduling"], examples: [{ code: `CREATE MATERIALIZED VIEW sales_summary BUILD IMMEDIATE REFRESH FAST ON COMMIT AS SELECT region, product_id, SUM(amount) FROM sales GROUP BY region, product_id;`, explanation: "Fast-refresh materialized view." }] },
            { title: "Database Performance Tuning and Monitoring", content: "Master comprehensive database performance tuning techniques. Learn to identify performance bottlenecks, optimize resource utilization, implement effective caching strategies, and monitor database health for optimal performance in production environments.", concepts: ["performance monitoring", "query profiling", "resource optimization", "cache management", "connection pooling", "performance metrics analysis"], examples: [{ code: `SELECT query, execution_time, rows_processed FROM sys.query_stats WHERE execution_time > 1000 ORDER BY execution_time DESC;`, explanation: "Identify slow queries." }] }
          ]
        }
      };

      const mediumTemplates = {
        javascript: {
          easy: [
            { title: "Hello World", content: "Welcome to your JavaScript journey! Every programmer starts with a simple 'Hello World' program. This tutorial shows you how to write your very first JavaScript code and display text in the browser console. The console is like a secret window where you can see messages from your code - perfect for testing and debugging your programs!", concepts: ["console.log"], examples: [{ code: `console.log("Hello World");`, explanation: "Prints text." }] },
            { title: "Variables", content: "Variables and constants are like labeled boxes where you can store information in your program. Variables can change their contents, while constants stay the same once set. This tutorial teaches you the difference between 'let' (for variables) and 'const' (for constants), and how to properly name and use them in your JavaScript code.", concepts: ["let","const"], examples: [{ code: `let x = 5; const y = 10;`, explanation: "Declare variables and constants." }] },
            { title: "Arithmetic", content: "JavaScript can do math just like a calculator! Learn all the basic mathematical operations: addition (+), subtraction (-), multiplication (*), and division (/). You'll see how JavaScript handles numbers and calculations, making it easy to perform mathematical tasks in your programs.", concepts: ["+", "-", "*", "/"], examples: [{ code: `console.log(5+3);`, explanation: "Addition example." }] },
            { title: "Strings", content: "Strings are pieces of text in your code. Learn how to join strings together (concatenation) using the + operator, and discover the modern way with template literals using backticks (`). Template literals make it easy to insert variables directly into your text, creating dynamic messages.", concepts: ["string concatenation", "template literals"], examples: [{ code: `let name="Alice"; console.log(\`Hi \${name}\`);`, explanation: "Template literal usage." }] },
            { title: "Conditionals", content: "Make your programs smart by adding decision-making! Conditional statements let your code choose different paths based on conditions. Learn if/else if/else structures and comparison operators to create programs that can make choices, just like deciding what to do based on the weather or time of day.", concepts: ["if", "else"], examples: [{ code: `let score=70; if(score>50){console.log("Pass");}`, explanation: "If else example." }] },
            { title: "Loops", content: "Loops let you repeat actions multiple times without writing the same code over and over. Learn two types of loops: 'for' loops that run a specific number of times, and 'while' loops that continue until a condition becomes false. Perfect for tasks like counting, processing lists, or creating animations!", concepts: ["for","while"], examples: [{ code: `for(let i=0;i<3;i++){console.log(i);}`, explanation: "For loop example." }] },
            { title: "Arrays", content: "Arrays are like shopping lists for your code - they can hold multiple values in one place! Learn how to create arrays, access individual items using index numbers (starting from 0), and use the length property to know how many items are in your array. Arrays make it easy to work with collections of data.", concepts: ["array","indexing"], examples: [{ code: `let arr=[1,2,3]; console.log(arr[0]);`, explanation: "Access array element." }] },
            { title: "Functions", content: "Functions are reusable blocks of code that perform specific tasks. Think of them as mini-programs within your main program! Learn how to create functions with the 'function' keyword, pass information to them through parameters, and get results back using the 'return' statement. Functions make your code organized and prevent repetition.", concepts: ["function","return"], examples: [{ code: `function add(a,b){return a+b;} console.log(add(2,3));`, explanation: "Basic function." }] },
            { title: "Objects", content: "Objects are like containers that can hold multiple related pieces of information together. Instead of separate variables for a person's name, age, and city, you can group them in one object! Learn object literal syntax, how to access properties using dot notation or brackets, and why objects are fundamental to JavaScript programming.", concepts: ["objects","properties"], examples: [{ code: `let obj={name:"Alice"}; console.log(obj.name);`, explanation: "Access object property." }] },
            { title: "Console Methods", content: "The console is your best friend for debugging JavaScript code! Learn different console methods: console.log() for general information, console.warn() for warnings, and console.error() for errors. These tools help you understand what's happening in your code and track down problems quickly.", concepts: ["console.log","console.warn"], examples: [{ code: `console.warn("Warning"); console.error("Error");`, explanation: "Different console methods." }] }
          ],
          medium: [
            { title: "Array Methods", content: "Use built-in methods to manipulate arrays effectively! Learn powerful array methods like push() to add items, pop() to remove the last item, shift() and unshift() to work with the beginning of arrays, and splice() for more advanced modifications. These methods make working with arrays much easier and more efficient.", concepts: ["push","pop","splice"], examples: [{ code: `let arr=[1,2]; arr.push(3); arr.pop();`, explanation: "Array operations." }] },
            { title: "String Methods", content: "JavaScript provides many useful methods to work with strings! Discover methods like toUpperCase() and toLowerCase() for changing case, includes() to check if a string contains certain text, indexOf() to find positions, and slice() to extract parts of strings. These methods make text manipulation straightforward.", concepts: ["toUpperCase","includes"], examples: [{ code: `"abc".toUpperCase(); "abc".includes("a");`, explanation: "String methods." }] },
            { title: "Objects Advanced", content: "Take your object skills to the next level! Learn how to iterate through object properties using for...in loops and Object.keys()/Object.values() methods. Understand how to check if properties exist, add new properties dynamically, and work with nested objects. Objects are everywhere in JavaScript, so mastering these techniques is crucial.", concepts: ["Object.keys","for...in"], examples: [{ code: `let obj={a:1,b:2}; for(let k in obj){console.log(k,obj[k]);}`, explanation: "Iterate object." }] },
            { title: "Arrow Functions", content: "Discover the modern, concise way to write functions in JavaScript! Arrow functions (=>) provide a shorter syntax than traditional function expressions. Learn about implicit returns, lexical 'this' binding, and when to use arrow functions versus regular functions. They're especially useful for callbacks and functional programming.", concepts: ["arrow function"], examples: [{ code: `const add=(a,b)=>a+b; console.log(add(2,3));`, explanation: "Arrow function syntax." }] },
            { title: "Destructuring", content: "Extract values from arrays and objects with elegant syntax! Destructuring allows you to unpack values from arrays or properties from objects into distinct variables. Learn array destructuring with square brackets and object destructuring with curly braces. This feature makes working with complex data structures much cleaner.", concepts: ["array","object"], examples: [{ code: `let [a,b]=[1,2]; let {x,y}={x:3,y:4};`, explanation: "Destructuring arrays/objects." }] },
            { title: "Template Literals", content: "Create dynamic strings with embedded expressions! Template literals use backticks (`) instead of quotes and allow you to insert variables and expressions directly into strings using ${}. They support multi-line strings and make string interpolation much more readable than concatenation.", concepts: ["template literals"], examples: [{ code: `let name="Bob"; console.log(\`Hi \${name}\`);`, explanation: "Template string example." }] },
            { title: "Higher-Order Functions", content: "Functions that operate on other functions open up powerful programming patterns! Learn about map() to transform arrays, filter() to select items, reduce() to combine values, and forEach() to iterate. These functional programming concepts make your code more expressive and efficient.", concepts: ["map","filter","reduce"], examples: [{ code: `[1,2,3].map(x=>x*2); [1,2,3].filter(x=>x>1);`, explanation: "Map and filter example." }] },
            { title: "ES6 Modules", content: "Organize your code into reusable modules! ES6 modules allow you to export functions, variables, and classes from one file and import them in another. Learn about named exports/imports, default exports, and how modules help you build larger applications with clean, maintainable code structure.", concepts: ["import","export"], examples: [{ code: `// utils.js export function add(a,b){return a+b;} // main.js import {add} from './utils.js';`, explanation: "ES6 module example." }] },
            { title: "Promises", content: "Handle asynchronous operations gracefully with Promises! Promises represent values that may not be available yet, like data from a server. Learn about the Promise lifecycle, then() and catch() methods, and how promises solve the 'callback hell' problem. They're essential for modern JavaScript development.", concepts: ["Promise","then","catch"], examples: [{ code: `let p=Promise.resolve(5); p.then(console.log);`, explanation: "Basic promise example." }] },
            { title: "Event Handling", content: "Make your web pages interactive by responding to user actions! Learn how to attach event listeners to DOM elements using addEventListener(). Understand different event types (click, mouseover, keypress), the event object, and how to prevent default browser behavior. Events are what make web applications feel alive!", concepts: ["addEventListener"], examples: [{ code: `document.getElementById("btn").addEventListener("click",()=>console.log("Clicked"));`, explanation: "Click event example." }] }
          ],
          hard: [
            { title: "Async/Await", content: "Write clean, readable asynchronous code with async/await! This modern syntax makes working with promises much easier to understand. Learn how to use the 'async' keyword on functions and 'await' to pause execution until promises resolve. Async/await eliminates callback pyramids and makes async code look like synchronous code.", concepts: ["async","await"], examples: [{ code: `async function f(){let r=await fetch("/data");}`, explanation: "Async function." }] },
            { title: "Closures", content: "Master one of JavaScript's most powerful features - closures! A closure is when an inner function has access to variables from its outer function, even after the outer function has finished executing. Understand lexical scope, private variables, and how closures enable powerful patterns like data encapsulation and function factories.", concepts: ["closure"], examples: [{ code: `function outer(x){return function(y){return x+y;}}`, explanation: "Closure example." }] },
            { title: "Advanced Array Methods", content: "Unlock the full potential of arrays with advanced methods! Learn find() to locate specific items, some() and every() to test conditions, reduce() for complex transformations, and flatMap() for nested operations. These methods provide powerful ways to process and analyze array data efficiently.", concepts: ["find","some","every","reduce"], examples: [{ code: `[1,2,3].find(x=>x>1);`, explanation: "Advanced array." }] },
            { title: "Classes & OOP", content: "Object-oriented programming in JavaScript using ES6 classes! Learn class syntax, constructors, methods, static methods, and inheritance with 'extends'. Classes provide a cleaner way to create objects and implement inheritance compared to prototype-based approaches, making your code more organized and maintainable.", concepts: ["class","constructor","extends"], examples: [{ code: `class P{constructor(n){this.n=n;}} class E extends P{}`, explanation: "Classes example." }] },
            { title: "Error Handling", content: "Build robust applications with proper error handling! Learn try/catch/finally blocks to gracefully handle runtime errors. Understand different error types, creating custom errors, and the importance of proper error handling for user experience and debugging. Good error handling prevents crashes and provides meaningful feedback.", concepts: ["try","catch","finally"], examples: [{ code: `try{throw new Error("Err");}catch(e){console.log(e);}`, explanation: "Error handling." }] },
            { title: "Prototypes", content: "Dive deep into JavaScript's prototype-based inheritance system! Understand how objects inherit properties and methods through prototype chains. Learn to add methods to prototypes, create custom constructors, and work with Object.create(). Prototypes are fundamental to understanding how JavaScript objects really work under the hood.", concepts: ["prototype"], examples: [{ code: `function P(n){this.n=n;} P.prototype.g=function(){console.log(this.n);}`, explanation: "Prototype example." }] },
            { title: "Dynamic Imports", content: "Load JavaScript modules on-demand for better performance! Dynamic imports allow you to load modules asynchronously when needed, rather than at page load. This is perfect for code splitting, lazy loading features, and reducing initial bundle sizes. Learn the import() syntax and how it returns promises.", concepts: ["import()"], examples: [{ code: `import('./utils.js').then(m=>console.log(m.add(2,3)));`, explanation: "Dynamic import." }] },
            { title: "Set and Map", content: "Discover powerful collection data structures beyond arrays! Sets store unique values with fast lookup, while Maps allow any data type as keys. Learn methods like add(), has(), get(), set(), and understand when to use these collections instead of plain objects or arrays for better performance and functionality.", concepts: ["Set","Map"], examples: [{ code: `let s=new Set([1,2]); let m=new Map([["a",1]]);`, explanation: "Set and Map example." }] },
            { title: "Advanced Async Patterns", content: "Master complex asynchronous operations with Promise patterns! Learn Promise.all() to run multiple async operations in parallel, Promise.race() to respond to the first completion, Promise.allSettled() for handling all results regardless of success/failure, and Promise.any() for the first successful result. These patterns are essential for real-world applications.", concepts: ["Promise.all","Promise.race"], examples: [{ code: `Promise.all([Promise.resolve(1),Promise.resolve(2)]).then(console.log);`, explanation: "Multiple promises." }] }
          ]
        },

        nodejs: {
          easy: [
            { title: "Hello Server", content: "Spin up a minimal HTTP server that responds and exits.", concepts: ["http.createServer", "res.end"], examples: [{ code: `const http=require('http');http.createServer((_,res)=>res.end('ok')).listen(0);`, explanation: "Minimal server." }] },
            { title: "Route by Path", content: "Branch responses based on pathname.", concepts: ["url.parse", "pathname"], examples: [{ code: `const {pathname}=require('url').parse(req.url); if(pathname==='/health') res.end('ok');`, explanation: "Simple routing." }] },
            { title: "JSON Response", content: "Send JSON with proper headers.", concepts: ["Content-Type", "JSON.stringify"], examples: [{ code: `res.setHeader('Content-Type','application/json'); res.end(JSON.stringify({ok:true}));`, explanation: "Return JSON." }] },
            { title: "Read Body Text", content: "Collect request body as string.", concepts: ["data/end"], examples: [{ code: `let body=''; req.on('data',c=>body+=c); req.on('end',()=>res.end(body));`, explanation: "Read body." }] },
            { title: "Read Body JSON", content: "Parse JSON with error guard.", concepts: ["JSON.parse", "try/catch"], examples: [{ code: `try{data=JSON.parse(body);}catch{res.statusCode=400;}`, explanation: "Safe parse." }] },
            { title: "Query Params", content: "Extract query parameters.", concepts: ["url.parse", "query"], examples: [{ code: `const {query}=require('url').parse(req.url,true);`, explanation: "Query object." }] },
            { title: "Status & Headers", content: "Set status codes and headers manually.", concepts: ["statusCode", "setHeader"], examples: [{ code: `res.statusCode=201; res.setHeader('X-App','demo'); res.end('created');`, explanation: "Custom status." }] },
            { title: "CORS Basics", content: "Add permissive CORS headers.", concepts: ["Access-Control-Allow-Origin"], examples: [{ code: `res.setHeader('Access-Control-Allow-Origin','*');`, explanation: "Enable CORS." }] },
            { title: "Env Port", content: "Honor PORT env with fallback.", concepts: ["process.env.PORT"], examples: [{ code: `const PORT=process.env.PORT||3000; server.listen(PORT);`, explanation: "Configurable port." }] },
            { title: "Graceful Self-Close", content: "Hit the server once, then close.", concepts: ["http.get", "server.close"], examples: [{ code: `server.listen(0,()=>{http.get(url,()=>server.close());});`, explanation: "Self-close pattern." }] }
          ],
          medium: [
            { title: "Route Table", content: "Dispatch handlers from a map of paths.", concepts: ["handler map"], examples: [{ code: `const routes={'/health':(_,res)=>res.end('ok')}; (routes[path]||notFound)(req,res);`, explanation: "Route map." }] },
            { title: "Middleware Chain", content: "Compose small middleware functions.", concepts: ["middleware array"], examples: [{ code: `const chain=[fn1,fn2];`, explanation: "Chained middleware." }] },
            { title: "Validate Body", content: "Require fields in JSON payloads.", concepts: ["field checks"], examples: [{ code: `if(!data.name){res.statusCode=400;return res.end('name required');}`, explanation: "Validation." }] },
            { title: "In-Memory CRUD", content: "Manage items stored in an array.", concepts: ["array CRUD"], examples: [{ code: `let todos=[]; // add/read/update/delete`, explanation: "Array store." }] },
            { title: "Request Metrics", content: "Count requests per route.", concepts: ["counters"], examples: [{ code: `counts[path]=(counts[path]||0)+1;`, explanation: "Increment counters." }] },
            { title: "Error Wrapper", content: "Wrap handlers with try/catch.", concepts: ["error handling"], examples: [{ code: `try{handler()}catch(e){res.statusCode=500;res.end('error');}`, explanation: "Central error." }] },
            { title: "Static HTML", content: "Return simple HTML without fs.", concepts: ["Content-Type text/html"], examples: [{ code: `res.setHeader('Content-Type','text/html'); res.end('<h1>Hello</h1>');`, explanation: "Inline HTML." }] },
            { title: "Path Params", content: "Parse ids from URL segments.", concepts: ["pathname split"], examples: [{ code: `const id=pathname.split('/')[2];`, explanation: "Extract id." }] },
            { title: "TTL Cache", content: "Cache values with expiry in memory.", concepts: ["Map", "Date.now"], examples: [{ code: `cache.set(k,{v,exp:Date.now()+5000});`, explanation: "Simple TTL cache." }] },
            { title: "Graceful Shutdown", content: "Close server on signal or timeout.", concepts: ["process.on", "server.close"], examples: [{ code: `process.on('SIGTERM',()=>server.close(()=>process.exit(0)));`, explanation: "Shutdown hook." }] }
          ],
          hard: [
            { title: "JWT Decode", content: "Decode JWT payload without verification.", concepts: ["split token", "base64url"], examples: [{ code: `const p=token.split('.')[1]; const data=JSON.parse(Buffer.from(p,'base64').toString());`, explanation: "Decode payload." }] },
            { title: "Pagination", content: "Implement page & limit over a list.", concepts: ["parseInt", "defaults"], examples: [{ code: `const page=parseInt(query.page||'1',10);`, explanation: "Pagination params." }] },
            { title: "Per-IP Counter", content: "Track request counts by IP.", concepts: ["ip map"], examples: [{ code: `counts[ip]=(counts[ip]||0)+1;`, explanation: "IP tracking." }] },
            { title: "Webhook Logger", content: "Log headers/body, respond 200.", concepts: ["logging", "body parse"], examples: [{ code: `console.log(req.headers);`, explanation: "Log webhook." }] },
            { title: "File Stats", content: "Return fs.stat data for a file.", concepts: ["fs.statSync"], examples: [{ code: `const fs=require('fs'); const s=fs.statSync(__filename);`, explanation: "Stat file." }] },
            { title: "Streaming Reply", content: "Send chunked response parts.", concepts: ["res.write", "res.end"], examples: [{ code: `res.write('part'); res.end('done');`, explanation: "Chunked send." }] },
            { title: "Config by Env", content: "Switch settings via NODE_ENV.", concepts: ["process.env.NODE_ENV"], examples: [{ code: `const env=process.env.NODE_ENV||'dev';`, explanation: "Env switch." }] },
            { title: "Sanitize Input", content: "Trim string fields in body.", concepts: ["Object.entries"], examples: [{ code: `for(const k in data){if(typeof data[k]==='string') data[k]=data[k].trim();}`, explanation: "Sanitize fields." }] },
            { title: "Cache with TTL", content: "Evict expired entries on access.", concepts: ["expiry check"], examples: [{ code: `const hit=cache.get(k); if(hit && hit.exp>Date.now()) return hit.v;`, explanation: "TTL check." }] },
            { title: "Timeout Failsafe", content: "Ensure process exits to avoid hangs.", concepts: ["setTimeout exit"], examples: [{ code: `setTimeout(()=>process.exit(0),3000);`, explanation: "Failsafe exit." }] }
          ]
        },

        express: {
          easy: [
            { title: "Hello Express", content: "Create your first Express server. Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.", concepts: ["express()", "app.listen", "GET route"], examples: [{ code: `const express=require('express');\nconst app=express();\napp.get('/',(req,res)=>res.send('Hello Express!'));\napp.listen(3000);`, explanation: "Basic Express server." }] },
            { title: "JSON Response", content: "Send JSON responses to clients. Express provides the res.json() method that automatically sets the Content-Type header and converts JavaScript objects to JSON.", concepts: ["res.json", "JSON response"], examples: [{ code: `app.get('/api/data',(req,res)=>res.json({ok:true,message:'Hello'}));`, explanation: "JSON response." }] },
            { title: "Route Parameters", content: "Extract values from URL paths using route parameters. Route parameters are named URL segments that capture values at their position in the URL.", concepts: ["req.params", "route parameters"], examples: [{ code: `app.get('/user/:id',(req,res)=>res.json({userId:req.params.id}));`, explanation: "Path parameter." }] },
            { title: "Query Parameters", content: "Read query string parameters from URLs. Query parameters are key-value pairs appended to the URL after a question mark.", concepts: ["req.query", "query parameters"], examples: [{ code: `app.get('/search',(req,res)=>res.json({query:req.query.q}));`, explanation: "Query parameter." }] },
            { title: "POST Requests", content: "Handle POST requests to receive data from clients. POST is used for submitting data to be processed by the server.", concepts: ["app.post", "POST method"], examples: [{ code: `app.post('/submit',(req,res)=>res.json({received:true}));`, explanation: "POST endpoint." }] },
            { title: "JSON Body Parser", content: "Parse JSON data from request bodies. Express requires middleware to parse JSON payloads automatically.", concepts: ["express.json()", "req.body"], examples: [{ code: `app.use(express.json());\napp.post('/data',(req,res)=>res.json(req.body));`, explanation: "Read JSON body." }] },
            { title: "HTTP Status Codes", content: "Set appropriate HTTP status codes for responses. Status codes communicate the result of the request to the client.", concepts: ["res.status", "HTTP codes"], examples: [{ code: `app.post('/create',(req,res)=>res.status(201).json({created:true}));`, explanation: "201 Created status." }] },
            { title: "Multiple Routes", content: "Define multiple routes in your Express application. Organize routes logically for different resources and actions.", concepts: ["multiple routes", "route organization"], examples: [{ code: `app.get('/users',(req,res)=>res.json({users:[]}));\napp.get('/posts',(req,res)=>res.json({posts:[]}));`, explanation: "Multiple routes." }] },
            { title: "Static File Serving", content: "Serve static files like HTML, CSS, JavaScript, and images. Express can serve files from a directory automatically.", concepts: ["express.static", "static files"], examples: [{ code: `app.use(express.static('public'));`, explanation: "Serve static files." }] },
            { title: "Environment Configuration", content: "Configure your application using environment variables. This allows different settings for development, testing, and production.", concepts: ["process.env.PORT", "port configuration"], examples: [{ code: `const PORT=process.env.PORT||3000;\napp.listen(PORT);`, explanation: "Configurable port." }] }
          ],
          medium: [
            { title: "Route Handlers", content: "Organize route logic into separate handler functions. This improves code maintainability and reusability.", concepts: ["handler functions", "code organization"], examples: [{ code: `const getUsers=(req,res)=>res.json({users:[]});\napp.get('/users',getUsers);`, explanation: "Separate handler." }] },
            { title: "Middleware Introduction", content: "Understand Express middleware functions. Middleware functions have access to the request, response, and next function.", concepts: ["app.use", "middleware"], examples: [{ code: `app.use((req,res,next)=>{console.log('Request:',req.path);next();});`, explanation: "Logging middleware." }] },
            { title: "Error Handling", content: "Implement error handling in Express applications. Error-handling middleware has four parameters instead of three.", concepts: ["error handler", "try-catch"], examples: [{ code: `app.use((err,req,res,next)=>res.status(500).json({error:err.message}));`, explanation: "Error handler." }] },
            { title: "CORS Configuration", content: "Enable Cross-Origin Resource Sharing (CORS) to allow requests from different origins. CORS is essential for web APIs.", concepts: ["cors", "CORS middleware"], examples: [{ code: `const cors=require('cors');\napp.use(cors());`, explanation: "Enable CORS." }] },
            { title: "Multiple Route Parameters", content: "Use multiple route parameters in a single route. Extract several values from different positions in the URL path.", concepts: ["multiple params", "route params"], examples: [{ code: `app.get('/user/:id/posts/:postId',(req,res)=>res.json({userId:req.params.id,postId:req.params.postId}));`, explanation: "Multiple params." }] },
            { title: "Request Validation", content: "Validate incoming request data before processing. Ensure data meets your application's requirements.", concepts: ["validation", "data checking"], examples: [{ code: `app.post('/user',(req,res)=>{\n  if(!req.body.name) return res.status(400).json({error:'Name required'});\n  res.json({ok:true});\n});`, explanation: "Basic validation." }] },
            { title: "Express Router", content: "Organize routes using Express Router. Create modular route handlers in separate files for better code organization.", concepts: ["express.Router", "route modules"], examples: [{ code: `const router=express.Router();\nrouter.get('/',(req,res)=>res.send('Router'));\napp.use('/api',router);`, explanation: "Router module." }] },
            { title: "URL-Encoded Data", content: "Parse URL-encoded form data from requests. This is commonly used for HTML form submissions.", concepts: ["express.urlencoded", "form data"], examples: [{ code: `app.use(express.urlencoded({extended:true}));\napp.post('/form',(req,res)=>res.json(req.body));`, explanation: "Parse form data." }] },
            { title: "404 Not Found Handler", content: "Create a custom 404 handler for routes that don't exist. Provide helpful error messages for missing routes.", concepts: ["404 handler", "not found"], examples: [{ code: `app.use((req,res)=>res.status(404).json({error:'Route not found'}));`, explanation: "404 handler." }] },
            { title: "Custom Response Headers", content: "Set custom response headers. Headers provide metadata about the response and can control caching, CORS, and more.", concepts: ["res.setHeader", "custom headers"], examples: [{ code: `app.get('/data',(req,res)=>{\n  res.setHeader('X-Custom-Header','value');\n  res.json({data:'test'});\n});`, explanation: "Custom header." }] }
          ],
          hard: [
            { title: "Advanced Middleware", content: "Create sophisticated middleware chains with conditional logic. Build reusable middleware for authentication, logging, and data transformation.", concepts: ["middleware chains", "conditional middleware", "auth middleware"], examples: [{ code: `const auth=(req,res,next)=>{\n  if(req.headers.authorization) next();\n  else res.status(401).json({error:'Unauthorized'});\n};\napp.use('/protected',auth);`, explanation: "Auth middleware." }] },
            { title: "Async Route Handlers", content: "Handle asynchronous operations in route handlers. Use async/await to work with promises, databases, and external APIs.", concepts: ["async/await", "async handlers", "promises"], examples: [{ code: `app.get('/data',async(req,res)=>{\n  try{\n    const data=await fetchData();\n    res.json(data);\n  }catch(err){\n    res.status(500).json({error:err.message});\n  }\n});`, explanation: "Async handler." }] },
            { title: "Error Middleware", content: "Implement comprehensive error handling with custom error classes and middleware. Handle different error types appropriately.", concepts: ["error middleware", "custom errors", "error types"], examples: [{ code: `app.use((err,req,res,next)=>{\n  console.error(err.stack);\n  res.status(err.status||500).json({error:err.message});\n});`, explanation: "Error middleware." }] },
            { title: "Request Logging", content: "Implement request logging middleware to track all incoming requests. Log method, path, IP address, and response time.", concepts: ["logging", "morgan", "request tracking"], examples: [{ code: `const morgan=require('morgan');\napp.use(morgan('combined'));`, explanation: "Request logging." }] },
            { title: "Rate Limiting", content: "Implement rate limiting to prevent API abuse. Limit the number of requests from a single IP address within a time window.", concepts: ["rate limiting", "express-rate-limit"], examples: [{ code: `const rateLimit=require('express-rate-limit');\nconst limiter=rateLimit({windowMs:60000,max:100});\napp.use(limiter);`, explanation: "Rate limiting." }] },
            { title: "File Upload Handling", content: "Handle file uploads using multer middleware. Accept and process uploaded files from clients, including images and documents.", concepts: ["multer", "file upload", "multipart"], examples: [{ code: `const multer=require('multer');\nconst upload=multer({dest:'uploads/'});\napp.post('/upload',upload.single('file'),(req,res)=>res.json({file:req.file}));`, explanation: "File upload." }] },
            { title: "Session Management", content: "Implement session management to track user state across requests. Use express-session for persistent sessions with various storage options.", concepts: ["express-session", "sessions", "state management"], examples: [{ code: `const session=require('express-session');\napp.use(session({secret:'key',resave:false,saveUninitialized:true}));`, explanation: "Session setup." }] },
            { title: "API Versioning", content: "Implement API versioning to support multiple versions of your API simultaneously. Use route prefixes or headers for version management.", concepts: ["API versioning", "version routes"], examples: [{ code: `const v1Router=express.Router();\nconst v2Router=express.Router();\napp.use('/api/v1',v1Router);\napp.use('/api/v2',v2Router);`, explanation: "API versioning." }] },
            { title: "Request Validation", content: "Implement comprehensive request validation using express-validator. Validate and sanitize all input data to prevent security issues.", concepts: ["validation", "express-validator", "input sanitization"], examples: [{ code: `const {body,validationResult}=require('express-validator');\napp.post('/user',body('email').isEmail(),(req,res)=>{\n  const errors=validationResult(req);\n  if(!errors.isEmpty()) return res.status(400).json({errors:errors.array()});\n  res.json({ok:true});\n});`, explanation: "Request validation." }] },
            { title: "Production Best Practices", content: "Implement production-ready features including security headers, compression, and environment-based configuration. Secure and optimize your Express application.", concepts: ["helmet", "compression", "security", "production config"], examples: [{ code: `const helmet=require('helmet');\nconst compression=require('compression');\napp.use(helmet());\napp.use(compression());`, explanation: "Security & compression." }] }
          ]
        },

        flask: {
          easy: [
            { title: "Hello Route", content: "Create a Flask route that returns plain text.", concepts: ["route", "response"], examples: [{ code: `from flask import Flask\napp=Flask(__name__)\n@app.route('/')\ndef hi(): return "hi"`, explanation: "Plain text route." }] },
            { title: "JSON Ping", content: "Return JSON from a GET endpoint.", concepts: ["jsonify"], examples: [{ code: `from flask import jsonify\n@app.route('/ping')\ndef ping(): return jsonify(ok=True)`, explanation: "JSON response." }] },
            { title: "Path Param", content: "Read a name from the path and greet.", concepts: ["path param"], examples: [{ code: `@app.route('/hi/<name>')\ndef hi(name): return f"Hello {name}"`, explanation: "Path variable." }] },
            { title: "Query Param", content: "Echo a query parameter with default.", concepts: ["request.args"], examples: [{ code: `from flask import request\n@app.route('/echo')\ndef echo(): return request.args.get('msg','hi')`, explanation: "Query read." }] },
            { title: "POST JSON", content: "Read JSON body safely.", concepts: ["get_json"], examples: [{ code: `@app.route('/echo',methods=['POST'])\ndef echo(): data=request.get_json() or {}; return data`, explanation: "Echo JSON." }] },
            { title: "Status Code", content: "Send custom status with body.", concepts: ["status code"], examples: [{ code: `return {"ok":True},201`, explanation: "201 created." }] },
            { title: "Headers", content: "Add a custom response header.", concepts: ["headers"], examples: [{ code: `resp=jsonify(ok=True); resp.headers['X-App']='demo'; return resp`, explanation: "Custom header." }] },
            { title: "HTML Snippet", content: "Return simple HTML content.", concepts: ["text/html"], examples: [{ code: `return "<h1>Hello</h1>"`, explanation: "Inline HTML." }] },
            { title: "Blueprint Intro", content: "Register a small blueprint.", concepts: ["Blueprint"], examples: [{ code: `from flask import Blueprint\napi=Blueprint('api',__name__)\n@api.route('/health')\ndef health(): return 'ok'`, explanation: "Blueprint basics." }] },
            { title: "Debug Run", content: "Run the app in debug for dev.", concepts: ["app.run"], examples: [{ code: `if __name__=='__main__': app.run(debug=True)`, explanation: "Debug runner." }] }
          ],
          medium: [
            { title: "Blueprint Split", content: "Organize routes with blueprints.", concepts: ["blueprint structure"], examples: [{ code: `app.register_blueprint(api,url_prefix='/api')`, explanation: "Register blueprint." }] },
            { title: "before_request", content: "Log each request before handling.", concepts: ["before_request hook"], examples: [{ code: `@app.before_request\ndef log(): print(request.method,request.path)`, explanation: "Hook log." }] },
            { title: "Error Handler", content: "Custom 404 handler.", concepts: ["errorhandler"], examples: [{ code: `@app.errorhandler(404)\ndef not_found(e): return "missing",404`, explanation: "404 hook." }] },
            { title: "Simple Auth", content: "Check an API key header.", concepts: ["auth header"], examples: [{ code: `if request.headers.get('X-Key')!='123': return 'no',401`, explanation: "Header guard." }] },
            { title: "Validation", content: "Validate required JSON keys.", concepts: ["input validation"], examples: [{ code: `data=request.get_json() or {}; assert 'name' in data`, explanation: "Presence check." }] },
            { title: "CORS", content: "Enable CORS quickly.", concepts: ["flask-cors"], examples: [{ code: `from flask_cors import CORS; CORS(app)`, explanation: "CORS enable." }] },
            { title: "Config", content: "Load config values safely.", concepts: ["app.config"], examples: [{ code: `app.config.from_mapping(SECRET='shh')`, explanation: "Config mapping." }] },
            { title: "Streaming", content: "Yield streaming responses.", concepts: ["Response", "generator"], examples: [{ code: `def gen(): yield "part1"; yield "done"`, explanation: "Stream generator." }] },
            { title: "File Upload Peek", content: "Inspect uploaded file name.", concepts: ["request.files"], examples: [{ code: `f=request.files.get('file'); return f.filename if f else 'none'`, explanation: "File name." }] },
            { title: "Shutdown Hook", content: "Trigger shutdown cleanly.", concepts: ["werkzeug shutdown"], examples: [{ code: `func=request.environ.get('werkzeug.server.shutdown'); func() if func else None`, explanation: "Shutdown." }] }
          ],
          hard: [
            { title: "JWT Decode", content: "Decode JWT payload (no verify).", concepts: ["base64url"], examples: [{ code: `import base64,json\ndef decode(t): return json.loads(base64.urlsafe_b64decode(t.split('.')[1]+'=='))`, explanation: "Decode payload." }] },
            { title: "Pagination", content: "Paginate items with page/limit.", concepts: ["pagination params"], examples: [{ code: `page=int(request.args.get('page',1))`, explanation: "Page param." }] },
            { title: "Rate Counter", content: "Count requests per IP in memory.", concepts: ["rate limit"], examples: [{ code: `hits[ip]=hits.get(ip,0)+1`, explanation: "Counter." }] },
            { title: "Cache TTL", content: "Short-lived cache with expiry.", concepts: ["ttl cache"], examples: [{ code: `cache[key]=(val,time()+5)`, explanation: "Cache tuple." }] },
            { title: "Background Thread", content: "Run lightweight background task.", concepts: ["threading"], examples: [{ code: `Thread(target=do_work,daemon=True).start()`, explanation: "Thread start." }] },
            { title: "DB Connection Guard", content: "Use with-context for connections.", concepts: ["context manager"], examples: [{ code: `with sqlite3.connect(db) as conn: ...`, explanation: "With conn." }] },
            { title: "Schema Check", content: "Manual type checks on JSON.", concepts: ["type checks"], examples: [{ code: `if not isinstance(data.get('age'),int): return 'bad',400`, explanation: "Type guard." }] },
            { title: "Health Details", content: "Return uptime/version/headers.", concepts: ["health response"], examples: [{ code: `return {'ok':True,'uptime':time()-start}`, explanation: "Health JSON." }] },
            { title: "Content Negotiation", content: "Serve HTML or JSON based on Accept.", concepts: ["Accept header"], examples: [{ code: `if 'text/html' in request.headers.get('Accept',''): return '<h1>hi</h1>'`, explanation: "Negotiate." }] },
            { title: "ETag/Cache", content: "Set ETag and 304 responses.", concepts: ["etag"], examples: [{ code: `resp=jsonify(ok=True); resp.set_etag('v1')`, explanation: "ETag set." }] }
          ]
        },

        fastapi: {
          easy: [
            { title: "Hello FastAPI", content: "Return JSON from the root path.", concepts: ["FastAPI app", "get"], examples: [{ code: `from fastapi import FastAPI\napp=FastAPI()\n@app.get("/")\ndef hi(): return {"hi":"fast"}`, explanation: "Basic GET." }] },
            { title: "Path Greeting", content: "Greet a user by path param.", concepts: ["path param"], examples: [{ code: `@app.get("/hi/{name}")\ndef hi(name:str): return {"hi":name}`, explanation: "Path variable." }] },
            { title: "Query Echo", content: "Echo a query string value.", concepts: ["query params"], examples: [{ code: `@app.get("/echo")\ndef echo(msg:str="yo"): return {"msg":msg}`, explanation: "Query default." }] },
            { title: "POST JSON", content: "Receive JSON body and return it.", concepts: ["Body"], examples: [{ code: `from fastapi import Body\n@app.post("/echo")\ndef echo(data:dict=Body(...)): return data`, explanation: "Echo body." }] },
            { title: "Custom Status", content: "Respond with 201 created.", concepts: ["status_code"], examples: [{ code: `@app.post("/make",status_code=201)\ndef make(): return {"made":True}`, explanation: "201 status." }] },
            { title: "Headers Set", content: "Send custom headers in response.", concepts: ["Response headers"], examples: [{ code: `from fastapi import Response\n@app.get("/hdr")\ndef hdr(res:Response): res.headers["X-App"]="demo"; return {"ok":True}`, explanation: "Header set." }] },
            { title: "Pydantic Model", content: "Validate input with BaseModel.", concepts: ["BaseModel"], examples: [{ code: `from pydantic import BaseModel\nclass Item(BaseModel): name:str\n@app.post("/item")\ndef item(it:Item): return it`, explanation: "Model validation." }] },
            { title: "Docs", content: "Use built-in docs at /docs.", concepts: ["OpenAPI"], examples: [{ code: `# visit /docs`, explanation: "Auto docs." }] },
            { title: "Plain Text", content: "Return plain text response.", concepts: ["PlainTextResponse"], examples: [{ code: `from fastapi.responses import PlainTextResponse\n@app.get("/txt",response_class=PlainTextResponse)\ndef txt(): return "hi"`, explanation: "Text response." }] },
            { title: "Run Command", content: "Run with uvicorn locally.", concepts: ["uvicorn"], examples: [{ code: `# uvicorn main:app --reload`, explanation: "Start server." }] }
          ],
          medium: [
            { title: "Path + Query", content: "Combine path and query params.", concepts: ["path+query"], examples: [{ code: `@app.get("/user/{uid}")\ndef user(uid:int,q:str|None=None): return {"uid":uid,"q":q}`, explanation: "Mixed params." }] },
            { title: "Enum Param", content: "Restrict values with Enum.", concepts: ["Enum"], examples: [{ code: `class Mood(str,Enum): happy="happy"\n@app.get("/mood/{m}")\ndef mood(m:Mood): return m`, explanation: "Enum route." }] },
            { title: "Depends", content: "Inject dependencies with Depends.", concepts: ["Depends"], examples: [{ code: `from fastapi import Depends\ndef get_db(): return "db"\n@app.get("/db")\ndef db(db=Depends(get_db)): return db`, explanation: "Depends demo." }] },
            { title: "CORS Middleware", content: "Enable CORS for all origins.", concepts: ["CORSMiddleware"], examples: [{ code: `from fastapi.middleware.cors import CORSMiddleware\napp.add_middleware(CORSMiddleware,allow_origins=["*"])`, explanation: "CORS setup." }] },
            { title: "Exception Handler", content: "Custom HTTPException handler.", concepts: ["exception_handler"], examples: [{ code: `@app.exception_handler(HTTPException)\nasync def oops(req,exc): return PlainTextResponse("no",exc.status_code)`, explanation: "Error hook." }] },
            { title: "Background Task", content: "Run a task after response.", concepts: ["BackgroundTasks"], examples: [{ code: `from fastapi import BackgroundTasks\n@app.post("/task")\ndef t(bg:BackgroundTasks): bg.add_task(print,"done"); return {"ok":True}`, explanation: "BG task." }] },
            { title: "Upload File", content: "Accept file uploads and return name.", concepts: ["UploadFile"], examples: [{ code: `from fastapi import UploadFile,File\n@app.post("/up")\ndef up(f:UploadFile=File(...)): return {"name":f.filename}`, explanation: "Upload name." }] },
            { title: "Cookies", content: "Read cookies from requests.", concepts: ["Cookie"], examples: [{ code: `from fastapi import Cookie\n@app.get("/cookie")\ndef c(choco:str|None=Cookie(None)): return {"cookie":choco}`, explanation: "Cookie read." }] },
            { title: "Response Model", content: "Shape outputs with response_model.", concepts: ["response_model"], examples: [{ code: `class Out(BaseModel): ok:bool\n@app.get("/ok",response_model=Out)\ndef ok(): return {"ok":True}`, explanation: "Typed response." }] },
            { title: "Shutdown Hook", content: "Log on shutdown event.", concepts: ["shutdown event"], examples: [{ code: `@app.on_event("shutdown")\nasync def bye(): print("bye")`, explanation: "Shutdown hook." }] }
          ],
          hard: [
            { title: "Auth Header", content: "Read and return Authorization header.", concepts: ["Header"], examples: [{ code: `from fastapi import Header\n@app.get("/auth")\ndef auth(auth: str | None = Header(None)): return {"auth":auth}`, explanation: "Header access." }] },
            { title: "Pagination", content: "Slice data with skip/limit.", concepts: ["skip","limit"], examples: [{ code: `@app.get("/items")\ndef items(skip:int=0,limit:int=10): return DATA[skip:skip+limit]`, explanation: "Pagination." }] },
            { title: "Naive Cache", content: "Cache last result in memory.", concepts: ["dict cache"], examples: [{ code: `cache={'data':None}`, explanation: "Simple cache." }] },
            { title: "Webhook Receiver", content: "Log webhook payloads.", concepts: ["logging"], examples: [{ code: `@app.post("/hook")\ndef hook(data:dict): print(data); return {"ok":True}`, explanation: "Log body." }] },
            { title: "Rate Counter", content: "Count calls per IP (simple).", concepts: ["ip map"], examples: [{ code: `hits[ip]=hits.get(ip,0)+1`, explanation: "Counter." }] },
            { title: "ETag Header", content: "Set ETag on responses.", concepts: ["headers"], examples: [{ code: `res=JSONResponse({"ok":1}); res.headers["ETag"]="123"; return res`, explanation: "ETag set." }] },
            { title: "StreamingResponse", content: "Stream text chunks.", concepts: ["StreamingResponse"], examples: [{ code: `async def gen(): yield "hi"\n@app.get("/stream")\ndef s(): return StreamingResponse(gen())`, explanation: "Stream." }] },
            { title: "Tags", content: "Organize routes with tags.", concepts: ["tags"], examples: [{ code: `@app.get("/pets",tags=["pets"])`, explanation: "Tag route." }] },
            { title: "Dependency Override", content: "Override deps for tests.", concepts: ["dependency_overrides"], examples: [{ code: `app.dependency_overrides[get_db]=fake_db`, explanation: "Override." }] },
            { title: "Exit Failsafe", content: "Ensure exit for demos.", concepts: ["asyncio call_later"], examples: [{ code: `import asyncio; asyncio.get_event_loop().call_later(3,exit,0)`, explanation: "Failsafe exit." }] }
          ]
        },

        roblox: {
          easy: [
            { title: "Hello Roblox", content: "Print a welcome message.", concepts: ["print"], examples: [{ code: `print("Hello, Roblox!")`, explanation: "Simple print." }] },
            { title: "Touch Greet", content: "Greet when a Part is touched.", concepts: ["Touched event"], examples: [{ code: `script.Parent.Touched:Connect(function()\n print("Hi!")\nend)`, explanation: "Touched event." }] },
            { title: "Change Color", content: "Set a Part's BrickColor.", concepts: ["BrickColor"], examples: [{ code: `script.Parent.BrickColor = BrickColor.new("Bright blue")`, explanation: "Color change." }] },
            { title: "Jump Boost", content: "Increase Humanoid jump power.", concepts: ["JumpPower"], examples: [{ code: `humanoid.JumpPower = 70`, explanation: "Jump boost." }] },
            { title: "Chat Message", content: "Send a system chat line.", concepts: ["ChatMakeSystemMessage"], examples: [{ code: `game.StarterGui:SetCore("ChatMakeSystemMessage",{Text="Hi!"})`, explanation: "Chat message." }] },
            { title: "Collect Coin", content: "Increment coins on touch.", concepts: ["leaderstats"], examples: [{ code: `leaderstats.Coins.Value += 1`, explanation: "Add coin." }] },
            { title: "Tween Move", content: "Tween a Part smoothly.", concepts: ["TweenService"], examples: [{ code: `local tw=game:GetService("TweenService")`, explanation: "Tween start." }] },
            { title: "Play Sound", content: "Play a sound on touch.", concepts: ["Sound:Play"], examples: [{ code: `script.Parent.Sound:Play()`, explanation: "Play sound." }] },
            { title: "Clone NPC", content: "Clone and parent an NPC.", concepts: ["Clone"], examples: [{ code: `local npc=template:Clone(); npc.Parent=workspace`, explanation: "Clone NPC." }] },
            { title: "Safe Call", content: "Guard risky calls with pcall.", concepts: ["pcall"], examples: [{ code: `local ok,err=pcall(function() risky() end)`, explanation: "Protected call." }] }
          ],
          medium: [
            { title: "Leaderstats Setup", content: "Create leaderstats for coins.", concepts: ["leaderstats"], examples: [{ code: `game.Players.PlayerAdded:Connect(function(p)\n local l=Instance.new("Folder",p); l.Name="leaderstats"; local c=Instance.new("IntValue",l); c.Name="Coins"\nend)`, explanation: "Leaderstats." }] },
            { title: "Remote Fire", content: "Fire a RemoteEvent to server.", concepts: ["RemoteEvent"], examples: [{ code: `RemoteEvent:FireServer("hello")`, explanation: "Fire event." }] },
            { title: "Server Receive", content: "Handle RemoteEvent on server.", concepts: ["OnServerEvent"], examples: [{ code: `RemoteEvent.OnServerEvent:Connect(function(player,msg) print(player,msg) end)`, explanation: "Server handler." }] },
            { title: "Give Tool", content: "Clone a tool into Backpack.", concepts: ["Tool clone"], examples: [{ code: `tool:Clone().Parent = player.Backpack`, explanation: "Give tool." }] },
            { title: "Respawn", content: "Respawn on fall/death.", concepts: ["Humanoid.Died"], examples: [{ code: `humanoid.Died:Connect(function() player:LoadCharacter() end)`, explanation: "Respawn." }] },
            { title: "Lighting Mood", content: "Adjust lighting settings.", concepts: ["Lighting"], examples: [{ code: `game.Lighting.Brightness = 2`, explanation: "Lighting change." }] },
            { title: "GUI Button", content: "Button prints when clicked.", concepts: ["MouseButton1Click"], examples: [{ code: `button.MouseButton1Click:Connect(function() print("Clicked") end)`, explanation: "Button click." }] },
            { title: "DataStore", content: "Reference a DataStore (pattern).", concepts: ["DataStoreService"], examples: [{ code: `local ds=game:GetService("DataStoreService"):GetDataStore("Coins")`, explanation: "DataStore ref." }] },
            { title: "Raycast", content: "Raycast to detect hits.", concepts: ["Raycast"], examples: [{ code: `workspace:Raycast(origin,direction)`, explanation: "Raycast." }] },
            { title: "Heartbeat Loop", content: "Run per-frame logic safely.", concepts: ["RunService.Heartbeat"], examples: [{ code: `game:GetService("RunService").Heartbeat:Connect(function(dt) end)`, explanation: "Frame loop." }] }
          ],
          hard: [
            { title: "Validate Remote", content: "Validate RemoteEvent inputs.", concepts: ["server validation"], examples: [{ code: `if typeof(msg)~="string" then return end`, explanation: "Guard input." }] },
            { title: "Cooldowns", content: "Add per-player cooldown timers.", concepts: ["tick()", "os.clock"], examples: [{ code: `if tick()-last < 1 then return end`, explanation: "Cooldown gate." }] },
            { title: "Zone Check", content: "Detect players in a region.", concepts: ["Region3"], examples: [{ code: `-- build Region3 and find parts`, explanation: "Region check." }] },
            { title: "Camera Script", content: "Scriptable camera for cutscenes.", concepts: ["CameraType", "CFrame"], examples: [{ code: `camera.CameraType=Enum.CameraType.Scriptable`, explanation: "Scripted cam." }] },
            { title: "State Machine", content: "Track NPC states cleanly.", concepts: ["state enum"], examples: [{ code: `local state="idle"`, explanation: "State variable." }] },
            { title: "Tween Chains", content: "Chain tweens for sequences.", concepts: ["Tween.Completed"], examples: [{ code: `tween.Completed:Connect(function() next:Play() end)`, explanation: "Chain tweens." }] },
            { title: "Inventory Server", content: "Keep inventory server-side.", concepts: ["tables", "replication"], examples: [{ code: `inventory[player]=inventory[player] or {}`, explanation: "Store inventory." }] },
            { title: "Profile Snippets", content: "Profile execution sections.", concepts: ["debug.profilebegin"], examples: [{ code: `debug.profilebegin("task")`, explanation: "Profile marker." }] },
            { title: "Anti-Exploit", content: "Clamp and validate client values.", concepts: ["server trust"], examples: [{ code: `if value>1000 then return end`, explanation: "Clamp values." }] },
            { title: "Batch Spawns", content: "Spawn NPCs in batches to avoid lag.", concepts: ["task.wait", "batches"], examples: [{ code: `for i=1,20 do spawnOne(); task.wait(0.05) end`, explanation: "Batch spawning." }] }
          ]
        },
      
        python: {
          easy: [
            {
              title: "Hello World",
              content: "Welcome to Python programming! Your first Python program introduces you to the print() function, which displays text to the console. This fundamental function is how Python communicates with users, showing results, messages, and debugging information. Understanding print() is essential for all Python development and helps you verify your code works correctly.",
              concepts: ["print() function for console output", "string literals in quotation marks", "automatic newline after each print", "multiple arguments separated by commas", "escape sequences for special characters", "print() as primary debugging tool"],
              examples: [{ code: `print("Hello World")`, explanation: "Prints to console." }]
            },
            {
              title: "Variables",
              content: "Variables are named containers that store data in Python. Unlike many languages, Python doesn't require you to declare variable types explicitly - it infers them automatically. Variables make your programs flexible by allowing you to store, modify, and reuse values throughout your code. Understanding variables is crucial for any programming task.",
              concepts: ["variable assignment with equals sign", "dynamic typing without type declarations", "descriptive variable naming conventions", "variable reassignment and mutability", "built-in data types (int, str, float, bool)", "variable scope and lifetime"],
              examples: [{ code: `x=5; y="Alice"`, explanation: "Variable example." }]
            },
            {
              title: "Arithmetic",
              content: "Python provides comprehensive mathematical operations for calculations. The language supports all basic arithmetic operators and follows standard mathematical precedence rules. Understanding these operations allows you to perform calculations, process numerical data, and create mathematical algorithms in your programs.",
              concepts: ["addition (+) and subtraction (-) operators", "multiplication (*) and division (/) operators", "modulo (%) for remainders", "exponentiation (**) for powers", "operator precedence (PEMDAS/BODMAS)", "floating-point arithmetic precision"],
              examples: [{ code: `print(5+3)`, explanation: "Addition." }]
            },
            {
              title: "Strings",
              content: "Strings represent text data in Python. They can be created with single or double quotes and support various operations for text manipulation. Python provides powerful string formatting options, making it easy to combine text with variables and create dynamic messages. String handling is essential for user interfaces and data processing.",
              concepts: ["string creation with quotes", "string concatenation with + operator", "f-string formatting for variable interpolation", "string methods for text manipulation", "escape sequences for special characters", "string indexing and slicing"],
              examples: [{ code: `name="Alice"; print(f"Hi {name}")`, explanation: "String formatting." }]
            },
            {
              title: "Conditionals",
              content: "Conditional statements allow your program to make decisions based on conditions. Python uses if/elif/else structure to execute different code paths. Understanding conditionals is crucial for creating programs that respond intelligently to different inputs and situations, making your code more than just a linear sequence of instructions.",
              concepts: ["if statement for primary conditions", "elif for additional conditions", "else for fallback execution", "comparison operators (==, !=, <, >, <=, >=)", "logical operators (and, or, not)", "truthy/falsy value evaluation"],
              examples: [{ code: `if 5>3: print("Yes")`, explanation: "Conditional example." }]
            },
            {
              title: "Loops",
              content: "Loops allow you to repeat actions multiple times, making your programs more efficient. Python provides for loops for iterating over sequences and while loops for condition-based repetition. Loops are essential for processing collections of data, automating repetitive tasks, and creating dynamic programs that scale.",
              concepts: ["for loop with range() for counting", "for loop for iterating over sequences", "while loop with condition checking", "loop control with break and continue", "nested loops for complex patterns", "infinite loop prevention strategies"],
              examples: [{ code: `for i in range(3): print(i)`, explanation: "Loop example." }]
            },
            {
              title: "Lists",
              content: "Lists are Python's primary way to store collections of items. They are mutable, ordered, and can contain elements of different types. Lists support powerful operations for adding, removing, and accessing elements. Understanding lists is fundamental for data manipulation and is used extensively in Python programming.",
              concepts: ["list creation with square brackets", "zero-based indexing for element access", "negative indexing from the end", "list methods (append, insert, remove, pop)", "list slicing with colon notation", "list comprehensions for transformation"],
              examples: [{ code: `l=[1,2,3]; print(l[0])`, explanation: "List example." }]
            },
            {
              title: "Functions",
              content: "Functions are reusable blocks of code that perform specific tasks. Python functions are defined with the 'def' keyword and can accept parameters and return values. Functions help organize code, eliminate repetition, and make programs more modular and maintainable. They are a cornerstone of structured programming.",
              concepts: ["function definition with def keyword", "parameter passing and argument handling", "return statement for output values", "function calls with parentheses", "local vs global variable scope", "default parameter values"],
              examples: [{ code: `def add(a,b): return a+b; print(add(2,3))`, explanation: "Function example." }]
            },
            {
              title: "Dictionaries",
              content: "Dictionaries store data as key-value pairs, providing fast lookups by key. Unlike lists that use numeric indices, dictionaries use descriptive keys, making them ideal for structured data. They are fundamental for representing real-world objects and are used extensively in Python applications for configuration, caching, and data modeling.",
              concepts: ["dictionary creation with curly braces", "key-value pair syntax", "accessing values with square bracket notation", "dictionary methods (keys, values, items)", "membership testing with 'in' operator", "dictionary comprehensions"],
              examples: [{ code: `d={"a":1}; print(d["a"])`, explanation: "Dictionary example." }]
            },
            {
              title: "Input",
              content: "The input() function allows your program to interact with users by reading text input. This creates interactive programs that can respond to user choices and data. Understanding input handling is essential for creating user-friendly applications and processing external data sources.",
              concepts: ["input() function for user text input", "input prompts for user guidance", "string return type from input()", "type conversion for numerical input", "input validation and error handling", "interactive program flow control"],
              examples: [{ code: `name=input("Enter: "); print(name)`, explanation: "Input example." }]
            }
          ],
          medium: [
            {
              title: "List Comprehensions",
              content: "List comprehensions provide a concise and readable way to create new lists from existing iterables. They combine the functionality of loops and conditional statements into a single, elegant expression. This powerful feature makes code more Pythonic and often more performant than traditional loops for creating lists.",
              concepts: ["basic syntax: [expression for item in iterable]", "conditional filtering with if clauses", "nested comprehensions for complex transformations", "performance benefits over traditional loops", "readability and maintainability advantages", "memory efficiency for large datasets"],
              examples: [{ code: `[x*2 for x in [1,2,3]]`, explanation: "List comprehension example." }]
            },
            {
              title: "File Handling",
              content: "File handling allows your Python programs to persist data and read external information. Python provides built-in functions for opening, reading, writing, and closing files safely. Understanding file operations is essential for data persistence, configuration management, and working with external data sources.",
              concepts: ["open() function with file modes ('r', 'w', 'a')", "context managers with 'with' statement", "reading methods (read, readline, readlines)", "writing methods (write, writelines)", "file object properties and methods", "error handling for file operations"],
              examples: [{ code: `with open("f.txt","w") as f: f.write("Hi")`, explanation: "File write example." }]
            },
            {
              title: "Modules",
              content: "Modules allow you to organize Python code into reusable components. Python comes with a rich standard library and you can create your own modules. Understanding modules is crucial for building maintainable applications and leveraging existing code libraries effectively.",
              concepts: ["import statement for module loading", "from...import for specific imports", "module search path (sys.path)", "built-in modules (os, sys, datetime)", "creating custom modules", "package organization with __init__.py"],
              examples: [{ code: `import math; print(math.sqrt(16))`, explanation: "Module import example." }]
            },
            {
              title: "Exception Handling",
              content: "Exception handling allows your programs to gracefully recover from errors instead of crashing. Python uses try/except blocks to catch and handle exceptions. Proper exception handling makes programs more robust and provides better user experience by handling unexpected situations.",
              concepts: ["try block for code that might fail", "except blocks for different exception types", "finally block for cleanup code", "built-in exception hierarchy", "raising exceptions with 'raise'", "custom exception classes"],
              examples: [{ code: `try:1/0\nexcept ZeroDivisionError: print("Error")`, explanation: "Exception example." }]
            },
            {
              title: "Classes",
              content: "Classes are the foundation of object-oriented programming in Python. They allow you to create custom data types with both data and behavior. Understanding classes is essential for creating reusable, organized code and implementing complex data structures and algorithms.",
              concepts: ["class definition with class keyword", "__init__ method for initialization", "instance methods and self parameter", "class attributes vs instance attributes", "inheritance with base classes", "method overriding and super()"],
              examples: [{ code: `class P: def __init__(self,n): self.n=n\np=P(5); print(p.n)`, explanation: "Class example." }]
            },
            {
              title: "Lambda Functions",
              content: "Lambda functions are anonymous, single-expression functions that can be defined inline. They are useful for simple operations and are commonly used with higher-order functions. Understanding lambdas helps you write more concise and functional-style Python code.",
              concepts: ["lambda keyword for anonymous functions", "single expression limitation", "automatic return of expression result", "use with map(), filter(), sorted()", "lambda parameters and default values", "lambda vs regular function trade-offs"],
              examples: [{ code: `f=lambda x:x*2; print(f(3))`, explanation: "Lambda function." }]
            },
            {
              title: "Decorators",
              content: "Decorators are functions that modify the behavior of other functions or classes. They provide a clean way to add functionality like logging, caching, or access control. Decorators are a powerful Python feature for aspect-oriented programming and code reuse.",
              concepts: ["decorator syntax with @ symbol", "function decorators vs class decorators", "wrapper functions and inner functions", "functools.wraps for metadata preservation", "decorator chaining and composition", "common decorator patterns (logging, timing, caching)"],
              examples: [{ code: `def deco(f): return f`, explanation: "Decorator example." }]
            },
            {
              title: "Generators",
              content: "Generators are special functions that yield values one at a time instead of returning them all at once. They provide memory-efficient iteration over large datasets and enable lazy evaluation. Generators are essential for working with large data streams and infinite sequences.",
              concepts: ["yield keyword instead of return", "generator objects and iteration", "memory efficiency for large datasets", "generator expressions syntax", "send() method for two-way communication", "coroutine behavior with generators"],
              examples: [{ code: `def gen(): yield 1; yield 2; print(list(gen()))`, explanation: "Generator example." }]
            },
            {
              title: "Itertools",
              content: "The itertools module provides fast, memory-efficient tools for working with iterators. It contains functions for creating and combining iterators in various ways. Understanding itertools helps you write more efficient and Pythonic code for complex iteration patterns.",
              concepts: ["infinite iterators (count, cycle, repeat)", "terminating iterators (accumulate, chain, compress)", "combinatoric generators (permutations, combinations)", "groupby for grouping consecutive elements", "islice for slicing iterators", "tee for multiple iterator consumption"],
              examples: [{ code: `import itertools; print(list(itertools.permutations([1,2,3])))`, explanation: "Itertools example." }]
            },
            {
              title: "Virtual Environments",
              content: "Virtual environments isolate Python project dependencies, preventing conflicts between different projects. They allow you to create separate Python environments with their own packages and versions. Virtual environments are essential for Python development and deployment.",
              concepts: ["venv module for environment creation", "activate/deactivate scripts", "requirements.txt for dependency management", "pip install within environments", "environment isolation benefits", "production deployment considerations"],
              examples: [{ code: `# python -m venv venv`, explanation: "Virtual environment." }]
            }
          ],
          hard: [
            {
              title: "Asyncio",
              content: "Asyncio enables concurrent programming using coroutines, allowing your Python programs to handle multiple operations simultaneously without threads. This is essential for building scalable network applications, web servers, and I/O-bound programs that need to handle many concurrent operations efficiently.",
              concepts: ["async def for coroutine definition", "await keyword for suspension points", "asyncio.run() for event loop execution", "Task objects for concurrent execution", "asyncio.gather() for parallel operations", "event loop and future concepts"],
              examples: [{ code: `import asyncio\nasync def f(): return 5\nasyncio.run(f())`, explanation: "Async function." }]
            },
            {
              title: "Metaclasses",
              content: "Metaclasses are classes that create classes. They allow you to customize class creation behavior, adding powerful introspection and modification capabilities. Understanding metaclasses is essential for advanced Python frameworks and libraries that need to modify class behavior dynamically.",
              concepts: ["metaclass inheritance from type", "__new__ method for class creation", "__init_subclass__ hook for customization", "class decorator alternatives", "singleton and factory patterns", "framework development with metaclasses"],
              examples: [{ code: `# example: class Meta(type): pass`, explanation: "Metaclass skeleton." }]
            },
            {
              title: "Context Managers",
              content: "Context managers provide a clean way to manage resources that need setup and teardown operations. They ensure proper cleanup even when errors occur, making code more robust and readable. Context managers are essential for file handling, database connections, and any resource management.",
              concepts: ["with statement syntax", "__enter__ and __exit__ methods", "contextlib module utilities", "@contextmanager decorator", "multiple context managers", "exception handling in context managers"],
              examples: [{ code: `with open("f.txt") as f: pass`, explanation: "Context manager example." }]
            },
            {
              title: "Descriptors",
              content: "Descriptors are objects that customize attribute access on other objects. They provide a powerful mechanism for implementing computed properties, validation, and delegation patterns. Descriptors are fundamental to understanding how Python's attribute system works internally.",
              concepts: ["__get__, __set__, __delete__ methods", "descriptor protocol implementation", "property decorator as descriptor", "data vs non-data descriptors", "descriptor precedence rules", "common patterns (lazy properties, validation)"],
              examples: [{ code: `# example: class Desc: pass`, explanation: "Descriptor example." }]
            },
            {
              title: "Multiprocessing",
              content: "Multiprocessing allows Python programs to leverage multiple CPU cores for parallel execution. Unlike threading, multiprocessing creates separate processes with their own memory space, avoiding GIL limitations. This is crucial for CPU-bound tasks and achieving true parallelism.",
              concepts: ["Process class for subprocess creation", "Pool for parallel task distribution", "Queue and Pipe for inter-process communication", "shared memory with Value and Array", "process synchronization primitives", "GIL avoidance benefits"],
              examples: [{ code: `from multiprocessing import Pool`, explanation: "Parallel processes." }]
            },
            {
              title: "Threading",
              content: "Threading enables concurrent execution within a single process. While limited by Python's GIL for CPU-bound tasks, threading excels at I/O-bound operations and responsive user interfaces. Understanding threading is essential for building responsive applications.",
              concepts: ["Thread class for thread creation", "thread synchronization with Locks", "RLock for recursive locking", "Condition and Event objects", "daemon threads vs main threads", "thread safety and race conditions"],
              examples: [{ code: `import threading`, explanation: "Thread example." }]
            },
            {
              title: "Unit Testing",
              content: "Unit testing ensures code quality by automatically verifying that individual components work correctly. Python's unittest module provides a framework for writing and running tests. Proper testing practices are essential for maintaining reliable, bug-free code in professional development.",
              concepts: ["TestCase class for test organization", "setUp and tearDown methods", "assertion methods (assertEqual, assertTrue)", "test discovery and running", "mock objects for isolation", "test-driven development principles"],
              examples: [{ code: `import unittest`, explanation: "Unit test example." }]
            },
            {
              title: "Serialization",
              content: "Serialization converts Python objects to formats that can be stored or transmitted. JSON is the most common format for web APIs and data exchange. Understanding serialization is crucial for data persistence, network communication, and cross-platform data sharing.",
              concepts: ["json.dumps() for object serialization", "json.loads() for deserialization", "custom object serialization", "datetime and complex object handling", "JSON schema validation", "performance considerations"],
              examples: [{ code: `import json; print(json.dumps({"a":1}))`, explanation: "Serialize example." }]
            },
            {
              title: "Advanced Data Handling",
              content: "Pandas provides powerful data manipulation capabilities for structured data analysis. It introduces DataFrames and Series for efficient data processing. Understanding pandas is essential for data science, analytics, and any application dealing with tabular data.",
              concepts: ["DataFrame for tabular data structure", "Series for one-dimensional data", "data import/export methods", "indexing and selection operations", "grouping and aggregation functions", "data cleaning and transformation"],
              examples: [{ code: `import pandas as pd`, explanation: "Pandas intro." }]
            },
            {
              title: "Networking",
              content: "The requests library simplifies HTTP operations in Python. It provides an elegant API for making web requests and handling responses. Understanding HTTP networking is essential for web scraping, API integration, and building web-connected applications.",
              concepts: ["requests.get() for HTTP GET requests", "response object properties (status_code, text, json)", "query parameters and headers", "POST requests with data", "session management for cookies", "error handling and timeouts"],
              examples: [{ code: `import requests; requests.get("https://example.com")`, explanation: "HTTP request example." }]
            }
          ]
        },
      
        cpp: {
          easy: [
            {
              title: "Hello World",
              content: "Welcome to C++ programming! Every programmer starts with a simple 'Hello World' program. This tutorial introduces you to the basic structure of a C++ program, including the main() function, the iostream library for input/output operations, and the cout object for displaying text to the console. Understanding these fundamentals will give you a solid foundation for all C++ programming.",
              concepts: ["iostream library for input/output operations", "cout object for console output", "main() function as program entry point", "namespace std for standard library access", "semicolons to terminate statements", "program compilation and execution process"],
              examples: [{ code: `#include<iostream>\nusing namespace std;\nint main(){cout<<"Hello";}`, explanation: "Basic print." }]
            },
            {
              title: "Variables",
              content: "Variables are containers that store data in your C++ programs. Learn about different data types like integers, floating-point numbers, and strings. Understanding how to declare, initialize, and use variables is crucial for storing and manipulating data in your programs. Variables make your code dynamic and reusable.",
              concepts: ["int data type for whole numbers", "float/double for decimal numbers", "string for text data", "variable declaration syntax", "initialization vs assignment", "memory allocation for variables"],
              examples: [{ code: `int a=5; float b=2.5; string name="Alice";`, explanation: "Variable example." }]
            },
            {
              title: "Arithmetic",
              content: "C++ provides powerful mathematical operations to perform calculations. Learn about basic arithmetic operators and how C++ handles different number types. Understanding operator precedence and type conversions is essential for writing correct mathematical expressions in your programs.",
              concepts: ["addition (+) and subtraction (-) operators", "multiplication (*) and division (/) operators", "modulo (%) operator for remainders", "operator precedence rules", "implicit type conversions", "mathematical expression evaluation"],
              examples: [{ code: `cout<<5+3;`, explanation: "Addition." }]
            },
            {
              title: "Conditionals",
              content: "Conditional statements allow your program to make decisions based on conditions. Learn how to use if/else statements to control program flow. This is fundamental for creating programs that can respond differently to different inputs or situations.",
              concepts: ["if statement for condition checking", "else clause for alternative execution", "comparison operators (==, !=, <, >, <=, >=)", "logical operators (&&, ||, !)", "nested conditional statements", "boolean expressions evaluation"],
              examples: [{ code: `if(a>0) cout<<"Positive"; else cout<<"Non-positive";`, explanation: "Conditional example." }]
            },
            {
              title: "Loops",
              content: "Loops allow you to repeat actions multiple times, making your programs more efficient. Learn about for and while loops, which are essential for processing collections of data and creating iterative algorithms.",
              concepts: ["for loop with initialization, condition, and increment", "while loop with condition checking", "loop control variables", "infinite loop prevention", "nested loops for complex iterations", "break and continue statements"],
              examples: [{ code: `for(int i=0;i<3;i++) cout<<i;`, explanation: "For loop." }]
            },
            {
              title: "Functions",
              content: "Functions are reusable blocks of code that perform specific tasks. Learn how to define functions with parameters and return values. Functions help organize your code and make it more maintainable and reusable.",
              concepts: ["function definition with return type", "parameter passing mechanisms", "return statement for output", "function prototypes/declarations", "local vs global scope", "function overloading concepts"],
              examples: [{ code: `int add(int a,int b){return a+b;} cout<<add(2,3);`, explanation: "Function example." }]
            },
            {
              title: "Arrays",
              content: "Arrays allow you to store multiple values of the same type in a single variable. Learn about fixed-size arrays and how to access elements using indices. Arrays are fundamental for working with collections of data.",
              concepts: ["array declaration with size specification", "zero-based indexing system", "array element access and modification", "array bounds and memory layout", "multi-dimensional array concepts", "array initialization syntax"],
              examples: [{ code: `int arr[]={1,2,3}; cout<<arr[0];`, explanation: "Array example." }]
            },
            {
              title: "Vectors",
              content: "Vectors are dynamic arrays that can grow and shrink at runtime. Learn about the Standard Template Library (STL) vector class, which provides more flexibility than traditional arrays while maintaining efficient access.",
              concepts: ["vector header inclusion requirement", "dynamic size adjustment capabilities", "push_back() for element addition", "size() and capacity() methods", "iterator-based access patterns", "memory management advantages"],
              examples: [{ code: `#include<vector>\nvector<int> v={1,2,3};`, explanation: "Vector example." }]
            },
            {
              title: "Strings",
              content: "C++ strings provide powerful text manipulation capabilities. Learn about the string class and various operations you can perform on text data, from basic concatenation to more advanced string processing.",
              concepts: ["string class from standard library", "string concatenation with + operator", "length() method for string size", "substr() for string extraction", "find() and replace() methods", "string comparison operations"],
              examples: [{ code: `string s="Hi"; s+="!"; cout<<s;`, explanation: "String manipulation." }]
            },
            {
              title: "Input",
              content: "Learn how to read user input from the console using cin. Input operations are essential for creating interactive programs that can respond to user data and create dynamic experiences.",
              concepts: ["cin object for console input reading", "input stream extraction operator (>>)", "handling different data types", "input validation considerations", "whitespace handling in input", "error states and input buffers"],
              examples: [{ code: `int x; cin>>x;`, explanation: "User input." }]
            }
          ],
          medium: [
            {
              title: "Pointers",
              content: "Pointers are variables that store memory addresses. They provide direct access to memory locations and are fundamental to understanding how C++ manages memory. Learning pointers is crucial for advanced C++ programming and system-level operations.",
              concepts: ["pointer declaration with asterisk (*)", "address-of operator (&) usage", "dereferencing with asterisk (*)", "pointer arithmetic operations", "null pointers and nullptr", "pointer-to-pointer concepts"],
              examples: [{ code: `int x=5; int* p=&x; cout<<*p;`, explanation: "Pointer example." }]
            },
            {
              title: "Reference",
              content: "References provide an alias to existing variables without creating copies. They offer a safer alternative to pointers in many situations and are extensively used in function parameters and return values.",
              concepts: ["reference declaration with ampersand (&)", "reference initialization requirements", "aliasing behavior without copying", "reference vs pointer differences", "constant references for safety", "reference return types"],
              examples: [{ code: `int a=5; int &r=a; r=10; cout<<a;`, explanation: "Reference example." }]
            },
            {
              title: "Structs",
              content: "Structs allow you to group related variables together under a single name. They are fundamental to creating complex data structures and are the basis for understanding classes in object-oriented programming.",
              concepts: ["struct keyword for definition", "member variable declarations", "struct initialization syntax", "dot operator for member access", "struct assignment and copying", "nested structs capabilities"],
              examples: [{ code: `struct Point{int x,y;}; Point p={1,2}; cout<<p.x;`, explanation: "Struct example." }]
            },
            {
              title: "Classes",
              content: "Classes are the foundation of object-oriented programming in C++. Learn about encapsulation, data hiding, and the basic structure of classes including member variables and member functions.",
              concepts: ["class keyword for definition", "public and private access specifiers", "member variables (data members)", "member functions (methods)", "object instantiation syntax", "this pointer concept"],
              examples: [{ code: `class P{public:int x;}; P obj; obj.x=5;`, explanation: "Class example." }]
            },
            {
              title: "Constructors",
              content: "Constructors are special member functions that initialize objects when they are created. They ensure that objects start in a valid state and can perform necessary setup operations automatically.",
              concepts: ["constructor declaration syntax", "default constructors", "parameterized constructors", "constructor overloading", "member initialization lists", "destructor counterpart concepts"],
              examples: [{ code: `class P{public:int x; P(){x=0;}};`, explanation: "Constructor example." }]
            },
            {
              title: "Inheritance",
              content: "Inheritance allows you to create new classes based on existing ones, promoting code reuse and establishing hierarchical relationships between classes. It's a core principle of object-oriented design.",
              concepts: ["base class and derived class concepts", "public inheritance access specifier", "member inheritance rules", "constructor and destructor chaining", "polymorphism foundations", "multiple inheritance considerations"],
              examples: [{ code: `class B{}; class D:public B{};`, explanation: "Inheritance example." }]
            },
            {
              title: "STL",
              content: "The Standard Template Library provides powerful, reusable components for common programming tasks. Learn about containers, algorithms, and iterators that make C++ development more efficient and reliable.",
              concepts: ["container classes (vector, list, map)", "algorithm functions (sort, find, transform)", "iterator concepts and usage", "template-based generic programming", "memory management in STL", "performance characteristics"],
              examples: [{ code: `#include<vector>`, explanation: "STL usage." }]
            },
            {
              title: "File I/O",
              content: "File input/output operations allow your programs to persist data and read external files. Learn about streams, file opening modes, and error handling for robust file operations in C++.",
              concepts: ["ofstream for file output operations", "ifstream for file input operations", "file open modes (trunc, app, etc.)", "error checking with fail() method", "stream state management", "binary vs text file handling"],
              examples: [{ code: `#include<fstream>\nofstream f("a.txt"); f<<"Hi";`, explanation: "File output." }]
            },
            {
              title: "Operator Overloading",
              content: "Operator overloading allows you to define custom behaviors for standard operators when used with your classes. This makes your classes more intuitive to use and integrates them seamlessly with existing C++ syntax.",
              concepts: ["operator keyword in function names", "binary and unary operator overloading", "return type considerations", "parameter passing conventions", "operator precedence preservation", "assignment operator special handling"],
              examples: [{ code: `class P{public:int x; P operator+(P p){return x+p.x;}};`, explanation: "Operator overloading." }]
            },
            {
              title: "Templates",
              content: "Templates enable generic programming by allowing you to write code that works with any data type. They are the foundation of the STL and provide powerful abstraction capabilities in C++.",
              concepts: ["template<typename T> syntax", "function template instantiation", "class template concepts", "template argument deduction", "specialization capabilities", "compile-time polymorphism"],
              examples: [{ code: `template<typename T> T add(T a,T b){return a+b;}`, explanation: "Template function." }]
            }
          ],
          hard: [
            {
              title: "Smart Pointers",
              content: "Smart pointers automatically manage memory and prevent memory leaks. They use RAII (Resource Acquisition Is Initialization) to ensure proper resource cleanup, making C++ memory management much safer and more reliable.",
              concepts: ["unique_ptr for exclusive ownership", "shared_ptr for shared ownership", "weak_ptr to break circular references", "RAII principle implementation", "automatic memory deallocation", "custom deleter functions"],
              examples: [{ code: `#include<memory>\nstd::unique_ptr<int> p=new int(5);`, explanation: "Smart pointer." }]
            },
            {
              title: "Multithreading",
              content: "Multithreading allows your programs to execute multiple tasks concurrently. Learn about creating threads, synchronizing access to shared resources, and managing thread lifecycles for better performance and responsiveness.",
              concepts: ["std::thread class for thread creation", "join() and detach() thread management", "mutex for thread synchronization", "atomic operations for thread safety", "thread_local storage specifier", "race condition prevention"],
              examples: [{ code: `#include<thread>`, explanation: "Thread example." }]
            },
            {
              title: "Lambda Expressions",
              content: "Lambda expressions provide concise syntax for creating anonymous functions. They are particularly useful for callbacks, algorithms, and functional programming patterns in modern C++.",
              concepts: ["[] capture clause syntax", "parameter list specifications", "return type deduction", "mutable lambda modifier", "generic lambda with auto parameters", "capture by reference vs value"],
              examples: [{ code: `auto f=[](int x){return x*2;};`, explanation: "Lambda function." }]
            },
            {
              title: "Move Semantics",
              content: "Move semantics optimize performance by transferring ownership of resources instead of copying them. This is crucial for efficient memory management and avoiding unnecessary copies in C++.",
              concepts: ["rvalue references with && syntax", "std::move() for explicit moving", "move constructors and assignment", "perfect forwarding with &&", "resource ownership transfer", "copy elision optimization"],
              examples: [{ code: `#include<utility>\nstd::move(a);`, explanation: "Move semantics." }]
            },
            {
              title: "Exception Handling",
              content: "Exception handling provides a structured way to deal with runtime errors. Learn about try/catch blocks and proper error propagation for robust C++ applications.",
              concepts: ["try block for exception-prone code", "catch blocks with exception types", "throw keyword for exception raising", "exception hierarchy and std::exception", "stack unwinding process", "RAII exception safety"],
              examples: [{ code: `try{}catch(std::exception &e){}`, explanation: "Exception handling." }]
            },
            {
              title: "STL Algorithms",
              content: "STL algorithms provide efficient, reusable operations on containers. Learn about sorting, searching, and transforming data using these powerful generic functions.",
              concepts: ["std::sort for container sorting", "std::find for element searching", "std::transform for element modification", "algorithm complexity guarantees", "iterator requirements", "function object usage"],
              examples: [{ code: `#include<algorithm>\nsort(v.begin(),v.end());`, explanation: "STL sort example." }]
            },
            {
              title: "Advanced Templates",
              content: "Advanced template techniques enable sophisticated generic programming. Learn about template specialization, metaprogramming concepts, and SFINAE for complex type manipulation.",
              concepts: ["template specialization syntax", "partial specialization capabilities", "SFINAE (Substitution Failure is Not An Error)", "template metaprogramming concepts", "constexpr in templates", "variadic template parameters"],
              examples: [{ code: `template<> class MyClass<int>{};`, explanation: "Template specialization." }]
            },
            {
              title: "Friend Functions",
              content: "Friend functions provide controlled access to private class members. They allow non-member functions to access private data while maintaining encapsulation principles.",
              concepts: ["friend keyword declaration", "friend function definitions", "friend class relationships", "encapsulation vs accessibility trade-offs", "operator overloading with friends", "friend declaration placement"],
              examples: [{ code: `class B; class A{friend class B;};`, explanation: "Friend class example." }]
            },
            {
              title: "Type Casting",
              content: "Type casting converts values between different types. Learn about safe casting methods and when to use each type of cast for proper type conversions in C++.",
              concepts: ["static_cast for compile-time casting", "dynamic_cast for runtime polymorphism", "const_cast for const modification", "reinterpret_cast for low-level casting", "C-style casting dangers", "casting operator precedence"],
              examples: [{ code: `int a=5; double b=static_cast<double>(a);`, explanation: "Casting example." }]
            },
            {
              title: "Bit Manipulation",
              content: "Bit manipulation allows efficient operations at the binary level. Learn about bitwise operators for tasks like setting flags, masking, and efficient computations in system programming.",
              concepts: ["bitwise AND (&) operator", "bitwise OR (|) operator", "bitwise XOR (^) operator", "left shift (<<) and right shift (>>)", "bitwise NOT (~) operator", "bit masking and flag operations"],
              examples: [{ code: `int a=5; int b=a<<1;`, explanation: "Shift operator example." }]
            }
          ]
        },
      
        html: {
          easy: [
            {
              title: "Basic HTML Structure",
              content: "Every web page starts with a solid HTML foundation. Learn about the essential HTML document structure including the DOCTYPE declaration, html, head, and body elements. Understanding this structure is crucial for creating valid, well-formed web pages that browsers can properly interpret and display.",
              concepts: ["DOCTYPE declaration for HTML5 standard", "html root element containing all content", "head section for metadata and resources", "body element for visible page content", "proper nesting and closing of elements", "semantic meaning of structural elements"],
              examples: [{ code: `<html><head></head><body>Hello</body></html>`, explanation: "Basic HTML skeleton." }]
            },
            {
              title: "Headings & Paragraphs",
              content: "Headings and paragraphs form the backbone of web content. Learn how to use heading tags (h1-h6) to create content hierarchy and paragraph tags to structure text. Proper heading structure is essential for accessibility, SEO, and creating well-organized, readable web pages.",
              concepts: ["h1 for main page heading (one per page)", "h2-h6 for subsection headings", "paragraph tags for text content blocks", "heading hierarchy for content structure", "semantic meaning for screen readers", "impact on search engine optimization"],
              examples: [{ code: `<h1>Title</h1><p>Paragraph</p>`, explanation: "Text example." }]
            },
            {
              title: "Links",
              content: "Links connect web pages and create navigation. Learn about anchor tags and how to create hyperlinks to other pages, sections within the same page, or external websites. Understanding link attributes like href and target is essential for creating effective website navigation.",
              concepts: ["anchor tag (<a>) for link creation", "href attribute for link destination", "target attribute for link behavior", "relative vs absolute URLs", "link accessibility with descriptive text", "mailto and tel links for contact"],
              examples: [{ code: `<a href='https://example.com'>Link</a>`, explanation: "Anchor link." }]
            },
            {
              title: "Images",
              content: "Images make web pages visually appealing and engaging. Learn how to embed images using the img tag, specify image sources, and provide alternative text for accessibility. Understanding image attributes ensures your images load properly and are accessible to all users.",
              concepts: ["img tag for image embedding", "src attribute for image file location", "alt attribute for accessibility", "width and height for sizing", "responsive image techniques", "image formats and optimization"],
              examples: [{ code: `<img src='img.jpg' alt='Image'>`, explanation: "Image tag." }]
            },
            {
              title: "Lists",
              content: "Lists organize information in a structured, readable way. Learn about ordered lists (numbered) and unordered lists (bulleted), and how to properly nest list items. Lists are essential for presenting steps, features, navigation menus, and any content that benefits from clear organization.",
              concepts: ["unordered lists with <ul> and bullets", "ordered lists with <ol> and numbers", "list items using <li> tags", "nested list structures", "list styling and customization", "semantic meaning for content organization"],
              examples: [{ code: `<ul><li>Item</li></ul>`, explanation: "List example." }]
            },
            {
              title: "Tables",
              content: "Tables display tabular data in rows and columns. Learn about table structure with rows, headers, and data cells. Tables are perfect for displaying structured data like schedules, comparisons, financial information, and any content that fits a grid layout.",
              concepts: ["table element as container", "tr for table rows", "th for header cells", "td for data cells", "thead, tbody, tfoot for sections", "table accessibility and semantics"],
              examples: [{ code: `<table><tr><td>Cell</td></tr></table>`, explanation: "Table example." }]
            },
            {
              title: "Forms",
              content: "Forms collect user input and send data to servers. Learn about form elements like text inputs, buttons, checkboxes, and radio buttons. Understanding form structure, validation, and submission is essential for creating interactive web applications that can gather and process user data.",
              concepts: ["form element as container for inputs", "input types (text, email, password, etc.)", "label elements for accessibility", "submit buttons for form actions", "form validation attributes", "action and method attributes for submission"],
              examples: [{ code: `<form><input type='text'></form>`, explanation: "Form input." }]
            },
            {
              title: "CSS Basics",
              content: "CSS (Cascading Style Sheets) controls the visual appearance of HTML elements. Learn about basic CSS properties for colors, fonts, backgrounds, and spacing. Understanding CSS syntax and how to apply styles to HTML elements is fundamental for creating attractive, well-designed web pages.",
              concepts: ["color property for text color", "font-size for text sizing", "background-color for element backgrounds", "CSS selector syntax and specificity", "inline, internal, and external stylesheets", "CSS cascade and inheritance principles"],
              examples: [{ code: `p{color:red;}`, explanation: "CSS color example." }]
            },
            {
              title: "Classes & IDs",
              content: "CSS classes and IDs allow you to target specific HTML elements for styling. Learn about class selectors (.) and ID selectors (#), and understand when to use each. Proper use of classes and IDs is crucial for organized, maintainable CSS code and effective styling.",
              concepts: ["class attribute for reusable styling", "ID attribute for unique element targeting", "CSS class selectors with dot notation", "CSS ID selectors with hash notation", "specificity differences between classes and IDs", "semantic class naming conventions"],
              examples: [{ code: `<p class='text'></p><p id='unique'></p>`, explanation: "CSS selectors." }]
            },
            {
              title: "Box Model",
              content: "Every HTML element is surrounded by an invisible box. Learn about the CSS box model including content, padding, border, and margin. Understanding the box model is essential for controlling spacing, layout, and element sizing in web design.",
              concepts: ["content area containing text/images", "padding space inside borders", "border lines around padding", "margin space outside borders", "box-sizing property behavior", "total element width/height calculations"],
              examples: [{ code: `div{margin:10px;padding:5px;border:1px solid;}`, explanation: "Box model example." }]
            }
          ],
          medium: [
            {
              title: "Flexbox",
              content: "Flexbox is a powerful CSS layout system for creating flexible, responsive layouts. Learn about flex containers and flex items, and how to control alignment, spacing, and ordering. Flexbox makes it easy to create complex layouts that adapt to different screen sizes and content amounts.",
              concepts: ["display:flex to create flex containers", "flex-direction for layout orientation", "justify-content for main axis alignment", "align-items for cross axis alignment", "flex-wrap for multi-line flex containers", "flex-grow, flex-shrink, flex-basis for item sizing"],
              examples: [{ code: `div{display:flex; justify-content:center;}`, explanation: "Flexbox example." }]
            },
            {
              title: "Grid",
              content: "CSS Grid provides a two-dimensional layout system for creating complex web layouts. Learn about grid containers, grid lines, and grid areas to create sophisticated page layouts. Grid offers precise control over element positioning and sizing in both rows and columns.",
              concepts: ["display:grid for grid containers", "grid-template-columns for column definitions", "grid-template-rows for row definitions", "grid-gap for spacing between items", "grid-column and grid-row for item placement", "fr unit for flexible grid sizing"],
              examples: [{ code: `div{display:grid; grid-template-columns:1fr 1fr;}`, explanation: "Grid example." }]
            },
            {
              title: "CSS Positioning",
              content: "CSS positioning controls how elements are positioned on the page. Learn about static, relative, absolute, fixed, and sticky positioning. Understanding positioning is crucial for creating overlays, dropdowns, and complex page layouts.",
              concepts: ["static positioning as default behavior", "relative positioning for offset positioning", "absolute positioning for exact placement", "fixed positioning relative to viewport", "sticky positioning for scroll-based behavior", "z-index for controlling stacking order"],
              examples: [{ code: `div{position:absolute; top:10px;}`, explanation: "Positioning example." }]
            },
            {
              title: "Pseudo-classes",
              content: "Pseudo-classes target elements in specific states or positions. Learn about :hover, :focus, :active, :nth-child, and other pseudo-classes. These selectors allow you to style elements based on user interaction and element relationships.",
              concepts: [":hover for mouse hover state", ":focus for keyboard focus state", ":nth-child() for element position selection", ":first-child and :last-child selectors", ":not() for negation", ":checked for form element states"],
              examples: [{ code: `a:hover{color:red;}`, explanation: "Hover example." }]
            },
            {
              title: "Transitions",
              content: "CSS transitions create smooth animations between property changes. Learn how to animate color changes, size transformations, and position movements. Transitions add polish and interactivity to user interfaces without requiring JavaScript.",
              concepts: ["transition-property for specifying animated properties", "transition-duration for animation timing", "transition-timing-function for easing", "transition-delay for delayed starts", "shorthand transition property syntax", "animatable CSS properties list"],
              examples: [{ code: `div{transition:all 0.3s;}`, explanation: "Transition example." }]
            },
            {
              title: "Media Queries",
              content: "Media queries enable responsive design by applying different styles based on device characteristics. Learn about breakpoints, viewport widths, and device orientation. Media queries are essential for creating websites that work well on all screen sizes.",
              concepts: ["@media rule syntax and structure", "max-width and min-width breakpoints", "orientation media feature", "device aspect ratio queries", "prefers-color-scheme for dark mode", "logical operators (and, or, not)"],
              examples: [{ code: `@media(max-width:600px){body{background:red;}}`, explanation: "Responsive example." }]
            },
            {
              title: "CSS Variables",
              content: "CSS custom properties (variables) allow you to store reusable values. Learn how to define variables and use them throughout your stylesheets. Variables make it easy to maintain consistent design systems and implement theme changes.",
              concepts: ["--variable-name syntax for definition", ":root selector for global variables", "var() function for usage", "fallback values in var() function", "inheritance of custom properties", "JavaScript manipulation of CSS variables"],
              examples: [{ code: `:root{--main:red;} p{color:var(--main);}`, explanation: "CSS variable example." }]
            },
            {
              title: "Forms Advanced",
              content: "Advanced form styling and validation techniques enhance user experience. Learn about focus states, validation styling, and accessibility considerations. Well-designed forms improve usability and help prevent user errors.",
              concepts: [":focus pseudo-class for input focus styling", ":valid and :invalid for validation states", "required attribute for mandatory fields", "placeholder attribute for input hints", "form validation API", "accessibility labels and descriptions"],
              examples: [{ code: `input:focus{border-color:red;}`, explanation: "Input focus style." }]
            },
            {
              title: "Animations",
              content: "CSS animations bring web pages to life with keyframe-based motion. Learn about @keyframes rule syntax and animation properties. Animations can guide user attention, provide feedback, and create engaging interactive experiences.",
              concepts: ["@keyframes rule for defining animation sequences", "animation-name property linking", "animation-duration for timing control", "animation-iteration-count for repeats", "animation-fill-mode for start/end states", "multiple property animation capabilities"],
              examples: [{ code: `@keyframes move{from{left:0;}to{left:100px;}} div{animation:move 2s;}`, explanation: "Simple animation." }]
            },
            {
              title: "Z-index & Layers",
              content: "Z-index controls the stacking order of positioned elements. Learn how to manage element layering for creating overlays, dropdowns, and modal dialogs. Understanding the stacking context is crucial for complex layouts.",
              concepts: ["z-index property for stacking order", "stacking context creation rules", "positioned elements in stacking", "default stacking without z-index", "negative z-index values", "isolation of stacking contexts"],
              examples: [{ code: `div{position:absolute; z-index:10;}`, explanation: "Layering example." }]
            }
          ],
          hard: [
            {
              title: "CSS Grid Advanced",
              content: "Master advanced CSS Grid techniques including named grid areas, implicit grids, and complex layouts. Learn how to create sophisticated page layouts with precise control over element positioning and responsive behavior. Grid areas and template areas provide semantic layout definitions.",
              concepts: ["grid-template-areas for named regions", "grid-area for assigning elements to areas", "implicit grid creation and sizing", "grid-auto-rows and grid-auto-columns", "dense packing algorithm", "subgrid for nested grid contexts"],
              examples: [{ code: `div{display:grid; grid-template-areas:"a b";}`, explanation: "Grid area example." }]
            },
            {
              title: "Flexbox Advanced",
              content: "Dive deep into advanced Flexbox features including nested flex containers, flex item ordering, and complex alignment scenarios. Learn how to create sophisticated one-dimensional layouts that adapt to content and screen size changes.",
              concepts: ["flex-wrap for multi-line flex containers", "flex-grow, flex-shrink, flex-basis trio", "order property for visual reordering", "align-self for individual item alignment", "flex-flow shorthand property", "nested flexbox for complex layouts"],
              examples: [{ code: `div{display:flex; flex-wrap:wrap;}`, explanation: "Nested flex example." }]
            },
            {
              title: "Responsive Typography",
              content: "Create fluid, responsive typography that scales beautifully across all devices. Learn about modern CSS functions like clamp() for fluid sizing, viewport units for responsive text, and advanced font loading techniques for optimal performance.",
              concepts: ["clamp() function for fluid sizing ranges", "viewport units (vw, vh, vmin, vmax)", "font-display property for loading control", "CSS custom properties for dynamic sizing", "line-height and letter-spacing responsiveness", "font-variation-settings for variable fonts"],
              examples: [{ code: `p{font-size:clamp(1rem,2vw,2rem);}`, explanation: "Responsive font." }]
            },
            {
              title: "CSS Functions",
              content: "Harness the power of CSS mathematical and utility functions. Learn about calc() for calculations, min/max for comparisons, and advanced color functions. These functions enable dynamic, mathematical CSS that adapts to any context.",
              concepts: ["calc() for mathematical expressions", "min() and max() for value comparisons", "clamp() for constrained fluid values", "CSS color functions (hsl, rgb, oklab)", " trigonometric functions (sin, cos, tan)", "exponential functions (pow, sqrt, log)"],
              examples: [{ code: `div{width:calc(100% - 50px);}`, explanation: "Calc function example." }]
            },
            {
              title: "CSS Filters",
              content: "Apply visual effects to elements using CSS filters. Learn about blur, brightness, contrast, grayscale, and other filter effects. Filters can create stunning visual effects and are essential for modern web design.",
              concepts: ["blur() for Gaussian blur effects", "brightness() and contrast() adjustments", "grayscale() and sepia() color effects", "hue-rotate() for color shifting", "saturate() for color intensity", "drop-shadow() for shadow effects"],
              examples: [{ code: `img{filter:grayscale(100%);}`, explanation: "Filter example." }]
            },
            {
              title: "Advanced Animations",
              content: "Create complex, chained animations with multiple keyframes and timing controls. Learn about animation composition, delays, and advanced easing functions. Professional animations enhance user experience and guide attention effectively.",
              concepts: ["animation-delay for sequenced animations", "animation-fill-mode for state control", "multiple animations on single elements", "cubic-bezier() for custom easing", "animation-play-state for control", "will-change property for optimization"],
              examples: [{ code: `div{animation:move 2s 1s infinite;}`, explanation: "Animation example." }]
            },
            {
              title: "Clip-path",
              content: "Create custom shapes and masks using clip-path. Learn about basic shapes, polygons, and path-based clipping. Clip-path enables creative layouts and visual effects that would be difficult with traditional CSS.",
              concepts: ["circle() and ellipse() basic shapes", "polygon() for custom vertex shapes", "path() for complex SVG path clipping", "inset() for rectangular clipping", "clip-path with animations", "browser support and fallbacks"],
              examples: [{ code: `div{clip-path:circle(50%);}`, explanation: "Clip-path example." }]
            },
            {
              title: "CSS Variables Advanced",
              content: "Master advanced CSS custom properties techniques including dynamic theming, calculations, and JavaScript integration. Learn how to create maintainable design systems and runtime style manipulation.",
              concepts: ["CSS custom property calculations", "inheritance and cascade with variables", "JavaScript getComputedStyle access", "dynamic theme switching", "CSS variable scoping", "performance implications"],
              examples: [{ code: `div{width:calc(var(--main)*2);}`, explanation: "Variable calculation." }]
            },
            {
              title: "CSS Grid + Flex Combination",
              content: "Combine CSS Grid and Flexbox for maximum layout power. Learn when to use each layout method and how they complement each other. Hybrid layouts provide the best of both worlds for complex design requirements.",
              concepts: ["grid for page-level layout structure", "flexbox for component-level alignment", "nested grid and flex containers", "responsive hybrid approaches", "performance considerations", "browser compatibility strategies"],
              examples: [{ code: `div{display:grid;} div>div{display:flex;}`, explanation: "Grid + flex." }]
            },
            {
              title: "CSS Custom Properties & JS",
              content: "Dynamically control CSS with JavaScript through custom properties. Learn how to create interactive themes, responsive animations, and data-driven styling. This bridge between CSS and JavaScript unlocks powerful possibilities.",
              concepts: ["setProperty() method for dynamic updates", "getComputedStyle() for reading values", "CSS custom property inheritance", "performance-optimized style updates", "theme switching implementations", "reactive styling patterns"],
              examples: [{ code: `document.documentElement.style.setProperty('--main','red');`, explanation: "Dynamic CSS via JS." }]
            }
          ]
        },
      
        react: {
          easy: [
            {
              title: "React App Setup",
              content: "Setting up a React application is the first step to building modern web interfaces. Learn how to use Create React App (CRA) to bootstrap a new React project with all necessary tools and configurations. This setup provides a development server, build scripts, and optimized production builds.",
              concepts: ["Create React App command-line tool", "npm/npx package managers", "project structure and file organization", "development server with hot reload", "build scripts for production deployment", "package.json configuration file"],
              examples: [{ code: `npx create-react-app myapp`, explanation: "App setup." }]
            },
            {
              title: "JSX Basics",
              content: "JSX is a syntax extension for JavaScript that allows you to write HTML-like code in your React components. Learn how JSX combines the power of JavaScript with the familiarity of HTML, enabling dynamic content creation and component composition.",
              concepts: ["JSX syntax mixing HTML and JavaScript", "curly braces for JavaScript expressions", "self-closing tags for void elements", "JSX compilation to React.createElement", "attribute naming conventions (className, htmlFor)", "fragment syntax for multiple root elements"],
              examples: [{ code: `const el=<h1>Hello</h1>;`, explanation: "JSX example." }]
            },
            {
              title: "Components",
              content: "React components are the building blocks of React applications. Learn about functional components, which are JavaScript functions that return JSX. Components encapsulate UI logic and can be reused throughout your application.",
              concepts: ["functional component declaration syntax", "JSX return statements", "component naming conventions", "export/import of components", "component composition patterns", "pure functions in React"],
              examples: [{ code: `function App(){return <div>Hi</div>;}`, explanation: "Functional component." }]
            },
            {
              title: "Props",
              content: "Props (properties) allow you to pass data from parent components to child components. Learn how to define props in component parameters and use destructuring for clean, readable code. Props enable component reusability and data flow in React applications.",
              concepts: ["props as immutable data from parents", "destructuring props in function parameters", "default props for optional values", "prop types and validation", "children prop for nested content", "prop spreading and rest patterns"],
              examples: [{ code: `function Greet({name}){return <h1>{name}</h1>}`, explanation: "Props usage." }]
            },
            {
              title: "State",
              content: "State allows components to manage and update their own data. Learn about the useState hook, which provides a way to declare state variables and update functions. State changes trigger component re-renders, enabling dynamic user interfaces.",
              concepts: ["useState hook for state management", "array destructuring for state and setter", "initial state values and types", "state updates triggering re-renders", "multiple state variables per component", "functional state updates"],
              examples: [{ code: `const [count,setCount]=useState(0);`, explanation: "useState example." }]
            },
            {
              title: "Event Handling",
              content: "React provides a synthetic event system for handling user interactions. Learn how to attach event handlers to JSX elements using camelCase naming. Event handlers receive event objects with information about the user action.",
              concepts: ["onClick, onChange, onSubmit event handlers", "camelCase naming for event props", "event object properties and methods", "preventDefault() for form submissions", "anonymous arrow functions vs named handlers", "event propagation and stopping"],
              examples: [{ code: `<button onClick={()=>setCount(count+1)}>Add</button>`, explanation: "Button click event." }]
            },
            {
              title: "Conditional Rendering",
              content: "Conditional rendering allows you to show different UI based on state or props. Learn about ternary operators, logical AND operators, and early returns. This technique creates dynamic, responsive user interfaces.",
              concepts: ["ternary operator for if/else rendering", "logical && for conditional display", "early returns in components", "null for hiding elements", "switch statements in JSX", "conditional styling approaches"],
              examples: [{ code: `{count>0 && <p>{count}</p>}`, explanation: "Conditional rendering." }]
            },
            {
              title: "Lists & Keys",
              content: "Rendering lists of data is a common React pattern. Learn how to use the map() method to transform arrays into JSX elements and why keys are essential for React's reconciliation process. Keys help React track and update list items efficiently.",
              concepts: ["Array.map() for transforming data to JSX", "unique key props for list items", "index as keys for simple lists", "derived keys from data properties", "key prop requirements and warnings", "performance implications of keys"],
              examples: [{ code: `{[1,2,3].map(i=><li key={i}>{i}</li>)}`, explanation: "List rendering." }]
            },
            {
              title: "Forms",
              content: "Controlled components connect form inputs to React state. Learn how to create forms where React controls the input values and handles changes. This approach provides full control over form behavior and validation.",
              concepts: ["controlled vs uncontrolled components", "value and onChange prop pairing", "form submission handling", "input types and attributes", "multiple input state management", "form validation techniques"],
              examples: [{ code: `<input value={name} onChange={e=>setName(e.target.value)}/>`, explanation: "Controlled input." }]
            },
            {
              title: "useEffect Basics",
              content: "useEffect handles side effects in functional components. Learn how to run code after renders, clean up resources, and respond to state/props changes. Effects are essential for data fetching, subscriptions, and DOM manipulation.",
              concepts: ["useEffect hook for side effects", "dependency array for effect triggering", "cleanup functions in effects", "effect timing (mount, update, unmount)", "common useEffect patterns", "avoiding infinite re-render loops"],
              examples: [{ code: `useEffect(()=>{console.log("Mounted")},[]);`, explanation: "useEffect example." }]
            }
          ],
          medium: [
            {
              title: "Context API",
              content: "Context API provides a way to share data across component trees without prop drilling. Learn how to create contexts, provide values, and consume them with useContext. Context is perfect for themes, user authentication, and global application state.",
              concepts: ["createContext() for context creation", "Context.Provider for value distribution", "useContext() hook for value consumption", "default context values", "context vs prop drilling comparison", "multiple context composition"],
              examples: [{ code: `const ctx=createContext(); const val=useContext(ctx);`, explanation: "Context usage." }]
            },
            {
              title: "Custom Hooks",
              content: "Custom hooks allow you to extract and reuse stateful logic across components. Learn how to create hooks that encapsulate common patterns like data fetching, form handling, or timer management. Custom hooks follow the 'use' naming convention and can use other hooks internally.",
              concepts: ["use prefix naming convention", "extracting reusable logic patterns", "composing multiple built-in hooks", "custom hook return values", "sharing hooks between components", "testing custom hook logic"],
              examples: [{ code: `function useCount(){const [c,setC]=useState(0); return [c,setC];}`, explanation: "Custom hook example." }]
            },
            {
              title: "Routing",
              content: "React Router enables navigation between different views in single-page applications. Learn about routes, links, and navigation methods. Routing allows you to build multi-page experiences within a single HTML document.",
              concepts: ["BrowserRouter vs HashRouter", "Route component with path and element", "Link and NavLink for navigation", "useNavigate hook for programmatic navigation", "route parameters and query strings", "nested routes and route guards"],
              examples: [{ code: `<Route path="/" element={<Home/>}/>`, explanation: "Route setup." }]
            },
            {
              title: "Refs",
              content: "Refs provide direct access to DOM elements or component instances. Learn when to use refs instead of state, and how to avoid anti-patterns. Refs are useful for focus management, animations, and third-party library integration.",
              concepts: ["useRef hook for ref creation", "ref prop attachment to JSX elements", "current property access to DOM nodes", "callback refs vs useRef", "avoiding refs for declarative operations", "forwardRef for component ref forwarding"],
              examples: [{ code: `const ref=useRef(); <input ref={ref}/>`, explanation: "useRef example." }]
            },
            {
              title: "Memoization",
              content: "Memoization prevents unnecessary re-renders and expensive recalculations. Learn about React.memo for components and useMemo/useCallback for values and functions. These optimizations improve performance in complex applications.",
              concepts: ["React.memo for component memoization", "useMemo for expensive calculation caching", "useCallback for function reference stability", "dependency arrays for update control", "shallow comparison in React.memo", "performance profiling and measurement"],
              examples: [{ code: `const MemoComp=React.memo(Comp);`, explanation: "Memoization example." }]
            },
            {
              title: "Error Boundaries",
              content: "Error boundaries are React components that catch JavaScript errors anywhere in their child component tree, log those errors, and display a fallback UI instead of the component tree that crashed. They prevent entire React applications from crashing due to a single component error.",
              concepts: ["componentDidCatch lifecycle method", "static getDerivedStateFromError method", "error boundary placement strategy", "fallback UI rendering patterns", "error logging and reporting", "error boundary composition and nesting"],
              examples: [{ code: `class Err extends React.Component{componentDidCatch(e){}}`, explanation: "Error boundary." }]
            },
            {
              title: "Portals",
              content: "React Portals provide a way to render children into a DOM node that exists outside the DOM hierarchy of the parent component. This is particularly useful for modals, tooltips, and floating elements that need to break out of their container's CSS overflow or z-index constraints.",
              concepts: ["ReactDOM.createPortal method signature", "portal target DOM node selection", "event bubbling through portal boundaries", "portal use cases (modals, dropdowns, tooltips)", "CSS z-index and positioning independence", "accessibility considerations with portals"],
              examples: [{ code: `ReactDOM.createPortal(<Comp/>,document.body)`, explanation: "Portal example." }]
            },
            {
              title: "Lazy & Suspense",
              content: "React.lazy() and Suspense enable code splitting, allowing you to load components dynamically only when they're needed. This improves your application's initial load time by reducing the bundle size and loading components on-demand.",
              concepts: ["React.lazy() for dynamic component imports", "Suspense component for loading states", "dynamic import() syntax", "error boundaries with lazy loading", "route-based code splitting", "bundle analysis and optimization"],
              examples: [{ code: `const Comp=React.lazy(()=>import('./Comp'));`, explanation: "Lazy loading." }]
            },
            {
              title: "Forward Refs",
              content: "forwardRef is a technique for automatically passing a ref through a component to one of its children. This is particularly useful for higher-order components and when you need to access a DOM element or component instance from a parent component.",
              concepts: ["React.forwardRef function wrapper", "ref parameter in component function", "imperative handle pattern", "ref forwarding through multiple levels", "forwardRef with TypeScript generics", "useImperativeHandle hook combination"],
              examples: [{ code: `const Comp=forwardRef((props,ref)=> <div ref={ref}/>);`, explanation: "Forward ref example." }]
            },
            {
              title: "useReducer",
              content: "useReducer is an alternative to useState for managing complex state logic. It's inspired by Redux and is particularly useful when you have multiple related state values or when the next state depends on the previous state in complex ways.",
              concepts: ["reducer function with state and action parameters", "dispatch function for triggering updates", "action objects with type and payload", "useReducer vs useState comparison", "reducer composition patterns", "reducer testing strategies"],
              examples: [{ code: `const [state,dispatch]=useReducer(reducer,init);`, explanation: "useReducer example." }]
            }
          ],
          hard: [
            {
              title: "Server-Side Rendering",
              content: "Server-Side Rendering (SSR) generates HTML on the server instead of the client, improving initial page load performance and SEO. Frameworks like Next.js provide built-in SSR support, allowing you to build fast, SEO-friendly React applications with server-side data fetching.",
              concepts: ["getServerSideProps for per-request rendering", "getStaticProps for static generation", "hybrid rendering approaches", "SEO benefits and performance gains", "hydration process explanation", "server-side data fetching patterns"],
              examples: [{ code: `export async function getServerSideProps(){}`, explanation: "Next.js SSR." }]
            },
            {
              title: "Context + Reducer",
              content: "Combining React Context with useReducer creates a powerful global state management solution. This pattern provides a Redux-like architecture without external dependencies, enabling complex state management across large component trees with predictable updates.",
              concepts: ["Context.Provider for state distribution", "useReducer for complex state logic", "action creators and action types", "context consumer patterns", "performance optimization with memoization", "middleware-like patterns for side effects"],
              examples: [{ code: `const ctx=createContext(); useReducer(reducer,init);`, explanation: "Context + reducer." }]
            },
            {
              title: "React Profiler",
              content: "React Profiler measures the performance of React components, helping identify performance bottlenecks and optimization opportunities. It provides detailed render timing information and component interaction data for development and production monitoring.",
              concepts: ["<Profiler> component wrapper", "onRender callback with performance data", "React DevTools Profiler integration", "render phase identification", "commit phase analysis", "performance regression detection"],
              examples: [{ code: `<Profiler id="App" onRender={fn}/>`, explanation: "Profiler usage." }]
            },
            {
              title: "Suspense + Data Fetching",
              content: "Suspense enables components to 'wait' for asynchronous operations before rendering. Combined with data fetching libraries, it provides a declarative way to handle loading states and error boundaries, improving user experience during data loading.",
              concepts: ["Suspense boundary for async operations", "concurrent rendering features", "data fetching with Suspense integration", "error boundary combination", "loading state management", "server component preparation"],
              examples: [{ code: `<Suspense fallback={<div>Loading</div>}></Suspense>`, explanation: "Suspense example." }]
            },
            {
              title: "Portals Advanced",
              content: "Advanced portal usage enables sophisticated UI patterns like modals, dropdowns, and floating panels. Portals allow components to render outside their normal DOM hierarchy while maintaining React's event system and component lifecycle management.",
              concepts: ["portal-based modal implementations", "dropdown and tooltip positioning", "event handling through portal boundaries", "focus management and accessibility", "z-index stacking context management", "portal cleanup and memory management"],
              examples: [{ code: `ReactDOM.createPortal(<Modal/>,document.body)`, explanation: "Portal modal." }]
            },
            {
              title: "Hooks Rules",
              content: "The Rules of Hooks ensure hooks work correctly and predictably. Understanding these rules is crucial for writing reliable custom hooks and avoiding common pitfalls in React applications. The rules govern hook calling order and conditional usage.",
              concepts: ["call hooks only at component top level", "call hooks only from React components", "no conditional hook calls", "no loops containing hooks", "custom hook naming conventions", "eslint plugin for rule enforcement"],
              examples: [{ code: `useState(); useEffect();`, explanation: "Hook rules." }]
            },
            {
              title: "Higher-Order Components",
              content: "Higher-Order Components (HOCs) are functions that take a component and return an enhanced version. They enable component composition, logic reuse, and cross-cutting concerns like authentication, logging, and styling without modifying the original component.",
              concepts: ["HOC function signature and return pattern", "props spreading and merging techniques", "displayName for debugging support", "HOC composition and chaining", "HOC vs render props vs hooks comparison", "common HOC patterns and use cases"],
              examples: [{ code: `function HOC(Comp){return props=> <Comp {...props}/>;}`, explanation: "HOC example." }]
            },
            {
              title: "Render Props",
              content: "Render props is a pattern where a component receives a function as a prop that returns JSX. This allows parent components to control how child components render, enabling powerful composition patterns for sharing logic between components.",
              concepts: ["render prop function parameter", "children as render prop alternative", "render prop vs HOC comparison", "multiple render props support", "render prop testing approaches", "performance implications and optimization"],
              examples: [{ code: `<Comp render={data=> <div>{data}</div>}/>`, explanation: "Render prop pattern." }]
            },
            {
              title: "Custom Hook with Context",
              content: "Combining custom hooks with Context API creates reusable global logic. This pattern encapsulates complex state management and provides clean APIs for components to interact with global application state.",
              concepts: ["custom hook returning context values", "context provider component patterns", "hook composition with multiple contexts", "error boundaries in context hooks", "context value memoization", "TypeScript integration with contexts"],
              examples: [{ code: `function useAuth(){return useContext(AuthContext);}`, explanation: "Custom hook + context." }]
            },
            {
              title: "Performance Optimization",
              content: "Advanced performance optimization techniques prevent unnecessary renders and expensive recalculations. useMemo and useCallback are essential tools for optimizing React applications, especially when dealing with complex computations or frequent re-renders.",
              concepts: ["useMemo for expensive calculation caching", "useCallback for function reference stability", "React.memo for component memoization", "dependency array optimization", "profiler-guided optimization", "bundle size and code splitting"],
              examples: [{ code: `const memo=useMemo(()=>compute(),[dep]);`, explanation: "Memoize expensive function." }]
            }
          ]
        },
      
        typescript: {
          easy: [
            {
              title: "Hello World",
              content: "Welcome to TypeScript! TypeScript builds on JavaScript by adding static type checking. Learn how to write your first TypeScript program and understand the compilation process that converts TypeScript to JavaScript for browser execution.",
              concepts: ["TypeScript compilation process (tsc)", "type checking at compile time", "console.log() for debugging output", "TypeScript vs JavaScript differences", "development workflow with TypeScript", "error prevention through typing"],
              examples: [{ code: `console.log("Hello World");`, explanation: "Prints text." }]
            },
            {
              title: "Variables",
              content: "TypeScript enhances JavaScript variables with static typing. Learn the difference between 'let' for mutable variables and 'const' for immutable constants. TypeScript's type system helps catch errors before runtime.",
              concepts: ["let keyword for block-scoped variables", "const keyword for immutable bindings", "type annotation syntax with colon", "primitive types (number, string, boolean)", "type inference from initial values", "explicit vs implicit typing"],
              examples: [{ code: `let x:number=5; const y:string="Alice";`, explanation: "Type annotation." }]
            },
            {
              title: "Functions",
              content: "TypeScript functions include parameter and return type annotations. Learn how to write type-safe functions, use optional parameters, and understand function overloading in TypeScript.",
              concepts: ["function parameter type annotations", "return type specifications with colon", "optional parameters with question mark", "default parameter values", "function type expressions", "void return type for side effects"],
              examples: [{ code: `function add(a:number,b:number):number{return a+b;}`, explanation: "Typed function." }]
            },
            {
              title: "Arrays",
              content: "TypeScript provides strongly-typed arrays with compile-time type checking. Learn how to declare typed arrays, access elements safely, and use array methods with type inference.",
              concepts: ["array type annotations with brackets", "generic Array<T> type syntax", "T[] shorthand array syntax", "array literal type inference", "readonly array types", "tuple types for fixed-length arrays"],
              examples: [{ code: `let nums:number[]=[1,2,3];`, explanation: "Typed array." }]
            },
            {
              title: "Objects",
              content: "TypeScript provides structural typing for objects. Learn how to define object shapes with interfaces, use index signatures, and create type-safe object literals with proper property checking.",
              concepts: ["interface declarations for object shapes", "optional properties with question mark", "readonly properties for immutability", "index signatures for dynamic properties", "object literal type checking", "excess property checking"],
              examples: [{ code: `interface Person{name:string; age:number;}`, explanation: "Interface example." }]
            },
            {
              title: "Enums",
              content: "Enums provide a way to define named constants with auto-incrementing values. Learn about numeric and string enums, and how they improve code readability and type safety compared to magic numbers.",
              concepts: ["numeric enum with auto-incrementing values", "string enum with explicit string values", "enum value access with dot notation", "reverse mapping in numeric enums", "enum as both types and values", "const enum for better performance"],
              examples: [{ code: `enum Color{Red,Green,Blue}; let c:Color=Color.Red;`, explanation: "Enum usage." }]
            },
            {
              title: "Union Types",
              content: "Union types allow variables to hold multiple types. Learn how to use the union operator (|) to create flexible types that can represent different kinds of values with type safety.",
              concepts: ["union operator (|) for type combinations", "type narrowing with type guards", "discriminated unions with literal types", "nullable types with undefined union", "union type exhaustiveness checking", "never type for impossible cases"],
              examples: [{ code: `let val:string|number; val=5; val="Hi";`, explanation: "Union type." }]
            },
            {
              title: "Type Assertions",
              content: "Type assertions tell TypeScript to treat a value as a specific type. Learn when to use type assertions safely and understand the difference between type assertions and type casting.",
              concepts: ["as keyword for type assertion syntax", "angle bracket syntax (<Type>value)", "type assertion vs type declaration", "unsafe nature of type assertions", "when to use type assertions", "type assertion limitations"],
              examples: [{ code: `let val:any="Hello"; let str=val as string;`, explanation: "Type assertion." }]
            },
            {
              title: "Interfaces & Types",
              content: "TypeScript provides both interfaces and type aliases for creating custom types. Learn the differences between interfaces and type aliases, and when to use each approach for defining complex types.",
              concepts: ["interface for object shape definitions", "type alias for union and primitive types", "interface extension with extends", "type alias intersection with &", "declaration merging for interfaces", "computed property names"],
              examples: [{ code: `type ID=number|string;`, explanation: "Type alias example." }]
            },
            {
              title: "Optional Properties",
              content: "Optional properties allow interfaces to define properties that may or may not be present. Learn how to use the question mark (?) to mark properties as optional and handle them safely in your code.",
              concepts: ["question mark (?) for optional properties", "undefined checking for optional props", "optional property access patterns", "default values for optional properties", "strict null checks with optional props", "optional chaining with optional props"],
              examples: [{ code: `interface Person{name:string; age?:number;}`, explanation: "Optional property." }]
            }
          ],
          medium: [
            {
              title: "Generics",
              content: "Generics enable writing reusable code that works with multiple types while maintaining type safety. Learn how to create generic functions, interfaces, and classes that can work with any type without sacrificing compile-time type checking.",
              concepts: ["generic function syntax with <T>", "type parameter naming conventions", "generic constraints with extends", "multiple type parameters", "default type parameters", "generic type inference"],
              examples: [{ code: `function wrap<T>(x:T):T[]{return [x];}`, explanation: "Generic function." }]
            },
            {
              title: "Type Guards",
              content: "Type guards narrow down union types within conditional blocks. Learn how to use typeof, instanceof, and custom type guard functions to help TypeScript understand variable types in different code paths.",
              concepts: ["typeof operator for primitive type checking", "instanceof operator for class instance checking", "custom type guard functions", "is return type syntax for guards", "user-defined type guard patterns", "assertion functions with asserts"],
              examples: [{ code: `if(typeof x==="string"){}`, explanation: "Type guard." }]
            },
            {
              title: "Advanced Functions",
              content: "TypeScript provides advanced function features including optional parameters, default values, rest parameters, and function overloading. Learn how to create flexible function signatures that handle various calling patterns.",
              concepts: ["optional parameters with question mark", "default parameter values", "rest parameters with spread syntax", "function overloading with multiple signatures", "generic function constraints", "function type expressions"],
              examples: [{ code: `function f(a:number=0){}`, explanation: "Default param." }]
            },
            {
              title: "Readonly & Const",
              content: "TypeScript provides ways to create immutable data structures. Learn about readonly properties, const assertions, and readonly arrays to prevent accidental mutations and improve code safety.",
              concepts: ["readonly modifier for properties", "Readonly<T> mapped type", "const assertions with as const", "readonly arrays and tuples", "deep readonly with recursive types", "immutability patterns in TypeScript"],
              examples: [{ code: `interface P{readonly x:number;}`, explanation: "Readonly property." }]
            },
            {
              title: "Mapped Types",
              content: "Mapped types allow transforming existing types into new types. Learn how to create type transformations that modify properties of existing interfaces, making it easy to create variations like partial or required versions.",
              concepts: ["mapped type syntax { [P in K]: T }", "keyof operator for property iteration", "conditional types in mapped types", "template literal types for keys", "built-in mapped types (Partial, Required)", "homomorphic mapped types"],
              examples: [{ code: `type Keys="a"|"b"; type Obj={ [K in Keys]:string; }`, explanation: "Mapped type example." }]
            },
            {
              title: "Conditional Types",
              content: "Conditional types create types that depend on conditions. Learn how to use conditional logic at the type level to create sophisticated type transformations and utility types.",
              concepts: ["conditional type syntax T extends U ? X : Y", "distributive conditional types", "infer keyword for type extraction", "recursive conditional types", "conditional type constraints", "utility types built with conditionals"],
              examples: [{ code: `type Check<T>=T extends string?true:false;`, explanation: "Conditional type." }]
            },
            {
              title: "Modules",
              content: "TypeScript supports modern ES6 modules with full type safety. Learn how to import and export types and values, use type-only imports, and organize code into maintainable modules.",
              concepts: ["ES6 import/export syntax", "type-only imports with import type", "default vs named exports", "re-export patterns", "module resolution strategies", "ambient module declarations"],
              examples: [{ code: `export const x=5; import {x} from './file';`, explanation: "Module example." }]
            },
            {
              title: "Namespaces",
              content: "Namespaces organize code into logical containers and prevent naming conflicts. Learn how to use namespaces for organizing related functionality and creating internal modules within files.",
              concepts: ["namespace declaration syntax", "export within namespaces", "nested namespace organization", "namespace vs ES6 modules", "global namespace augmentation", "ambient namespace declarations"],
              examples: [{ code: `namespace MyNS{export const x=5;}`, explanation: "Namespace example." }]
            },
            {
              title: "Decorators",
              content: "Decorators provide a way to add metadata and modify behavior of classes and their members. Learn about the experimental decorator syntax and how to create decorator factories for advanced TypeScript patterns.",
              concepts: ["decorator factory functions", "class decorator syntax", "property and method decorators", "parameter decorators", "decorator metadata access", "experimental decorator limitations"],
              examples: [{ code: `function deco(target){}`, explanation: "Decorator example." }]
            },
            {
              title: "Advanced Generics",
              content: "Advanced generic techniques include constraints, default parameters, and conditional types. Learn how to create sophisticated generic types that provide both flexibility and type safety.",
              concepts: ["generic constraints with extends", "keyof constraints for property access", "default generic parameters", "conditional generics", "template literal types with generics", "advanced constraint patterns"],
              examples: [{ code: `function f<T extends number>(x:T){}`, explanation: "Generic constraint." }]
            }
          ],
          hard: [
            {
              title: "Utility Types",
              content: "TypeScript's built-in utility types provide powerful transformations for existing types. These utilities help create variations of types like making all properties optional, selecting specific properties, or excluding unwanted ones. Mastering utility types is essential for advanced TypeScript development.",
              concepts: ["Partial<T> makes all properties optional", "Required<T> makes all properties mandatory", "Pick<T, K> selects specific properties", "Omit<T, K> excludes specific properties", "Record<K, T> creates object types with keys", "Extract<T, U> and Exclude<T, U> for union filtering"],
              examples: [{ code: `type P=Partial<{a:number}>;`, explanation: "Partial example." }]
            },
            {
              title: "Intersection Types",
              content: "Intersection types combine multiple types into one, requiring an object to satisfy all combined type constraints. This powerful feature enables composition of complex types and is essential for creating flexible yet type-safe APIs.",
              concepts: ["& operator for type intersection", "combining interface properties", "mixin-like type composition", "intersection with primitive types", "order independence in intersections", "structural typing with intersections"],
              examples: [{ code: `type A={x:number}; type B={y:number}; type C=A&B;`, explanation: "Intersection example." }]
            },
            {
              title: "Advanced Type Guards",
              content: "Advanced type guards provide sophisticated runtime type checking with compile-time type narrowing. Custom type guard functions with 'is' return types enable complex type validation patterns essential for robust TypeScript applications.",
              concepts: ["user-defined type guard functions", "'is' return type syntax", "assertion functions with 'asserts'", "type predicate patterns", "discriminated union narrowing", "type guard composition"],
              examples: [{ code: `function isString(x:any):x is string{return typeof x==="string";}`, explanation: "Custom type guard." }]
            },
            {
              title: "Template Literal Types",
              content: "Template literal types bring string manipulation to the type system, enabling type-safe string operations and transformations. This advanced feature allows creating types that represent string patterns and transformations at compile time.",
              concepts: ["template literal syntax in types", "string manipulation at type level", "inference with template literals", "uppercase/lowercase transformations", "intrinsic string manipulation types", "mapped types with template literals"],
              examples: [{ code: `type Name<Prefix extends string>=\`\${Prefix}User\`;`, explanation: "Template literal type." }]
            },
            {
              title: "Keyof & Lookup Types",
              content: "Keyof operator extracts union types from object keys, while lookup types access property types. These advanced operators enable type-safe property access and manipulation, forming the foundation of many utility types.",
              concepts: ["keyof operator for key extraction", "T[K] indexed access types", "keyof with generic constraints", "template literal keys", "symbol and number key support", "exact property type extraction"],
              examples: [{ code: `type K=keyof Person; type T=Person[K];`, explanation: "Keyof example." }]
            },
            {
              title: "Conditional Mapping",
              content: "Conditional types combined with mapped types create sophisticated type transformations. This advanced pattern enables conditional property modification and complex type computations that adapt based on input types.",
              concepts: ["conditional types with mapped types", "T extends U ? X : Y syntax", "distributive conditional behavior", "recursive mapped type patterns", "template literal conditional mapping", "advanced utility type construction"],
              examples: [{ code: `type Read<T>= { [P in keyof T]:T[P]; }`, explanation: "Mapped type." }]
            },
            {
              title: "Strict Null Checks",
              content: "Strict null checking prevents the billion-dollar mistake of null pointer exceptions. This TypeScript feature requires explicit handling of nullable types, leading to more robust and safer code.",
              concepts: ["strictNullChecks compiler option", "nullable types with | null | undefined", "non-null assertion operator (!)", "optional chaining (?.) operator", "nullish coalescing (??) operator", "definite assignment assertions"],
              examples: [{ code: `let x:number|null=5; x=null;`, explanation: "Strict null." }]
            },
            {
              title: "Advanced Decorators",
              content: "Advanced decorators enable metadata attachment and behavior modification for classes, properties, and methods. Understanding decorator factories and composition is crucial for framework development and advanced TypeScript patterns.",
              concepts: ["decorator factory functions", "class, property, method, parameter decorators", "decorator composition and ordering", "metadata reflection capabilities", "experimental decorator limitations", "decorator vs other patterns comparison"],
              examples: [{ code: `function dec(target,key,desc){}`, explanation: "Decorator example." }]
            },
            {
              title: "Mixins",
              content: "Mixins provide a way to combine functionality from multiple classes into one. This pattern enables code reuse without traditional inheritance, allowing flexible composition of behavior in TypeScript applications.",
              concepts: ["mixin function implementation", "class constructor type constraints", "property merging strategies", "method overriding in mixins", "multiple mixin application", "mixin vs inheritance trade-offs"],
              examples: [{ code: `function M<T extends Constructor>(Base:T){return class extends Base{};}` , explanation: "Mixin pattern." }]
            },
            {
              title: "Advanced Modules",
              content: "Advanced module features include dynamic imports, ambient declarations, and complex module resolution. Mastering these features is essential for large-scale TypeScript applications and library development.",
              concepts: ["dynamic import() expressions", "top-level await in modules", "ambient module declarations", "module augmentation techniques", "path mapping and resolution", "declaration file generation"],
              examples: [{ code: `const mod=await import('./mod');`, explanation: "Dynamic import." }]
            }
          ]
        },
        sql: {
          easy: [
            { title: "SELECT Basics", content: "Learn to retrieve data from database tables using the SELECT statement. This fundamental command is the starting point for all database queries, allowing you to view and analyze stored information.", concepts: ["SELECT statement syntax", "FROM clause for table specification", "asterisk (*) for all columns", "column name selection", "query execution basics", "result set understanding"], examples: [{ code: `SELECT * FROM customers;`, explanation: "Retrieve all customer data." }] },
            { title: "Column Selection", content: "Choose specific columns instead of retrieving everything. This improves query performance and makes results more readable by focusing on relevant data.", concepts: ["specifying column names", "comma-separated column lists", "column order in results", "aliasing column names", "selecting calculated columns", "best practices for column selection"], examples: [{ code: `SELECT first_name, last_name, email FROM customers;`, explanation: "Select specific columns." }] },
            { title: "WHERE Clause", content: "Filter rows based on conditions using WHERE. This powerful clause lets you retrieve only the data that meets your specific criteria, making queries precise and efficient.", concepts: ["WHERE clause syntax", "comparison operators (=, !=, <, >)", "filtering rows conditionally", "single condition filtering", "WHERE with different data types", "case sensitivity in comparisons"], examples: [{ code: `SELECT * FROM products WHERE price > 100;`, explanation: "Filter by condition." }] },
            { title: "Comparison Operators", content: "Use various comparison operators to create flexible filtering conditions. Understanding these operators enables you to build sophisticated queries that find exactly what you need.", concepts: ["equality (=) and inequality (!=)", "greater than (>) and less than (<)", "greater or equal (>=) and less or equal (<=)", "operator precedence", "combining multiple operators", "NULL handling with operators"], examples: [{ code: `SELECT * FROM orders WHERE quantity >= 5 AND quantity <= 20;`, explanation: "Range filtering." }] },
            { title: "Logical Operators", content: "Combine multiple conditions using AND, OR, and NOT. These logical operators allow you to create complex filtering criteria that match real-world query requirements.", concepts: ["AND operator for multiple conditions", "OR operator for alternative conditions", "NOT operator for negation", "operator precedence rules", "parentheses for grouping", "complex condition building"], examples: [{ code: `SELECT * FROM products WHERE category = 'Electronics' AND price < 500;`, explanation: "Multiple conditions." }] },
            { title: "ORDER BY", content: "Sort query results in ascending or descending order. ORDER BY helps organize data for better readability and analysis, making it easier to find top performers or identify patterns.", concepts: ["ORDER BY clause syntax", "ASC for ascending order", "DESC for descending order", "sorting by single column", "default ascending behavior", "sorting with NULL values"], examples: [{ code: `SELECT * FROM products ORDER BY price DESC;`, explanation: "Sort by price descending." }] },
            { title: "Multiple Column Sorting", content: "Sort by multiple columns to create hierarchical ordering. This technique is essential for organizing complex datasets where primary and secondary sort criteria matter.", concepts: ["comma-separated sort columns", "primary and secondary sort keys", "different directions per column", "sorting priority order", "practical sorting scenarios", "performance considerations"], examples: [{ code: `SELECT * FROM employees ORDER BY department ASC, salary DESC;`, explanation: "Multi-column sort." }] },
            { title: "LIMIT Clause", content: "Restrict the number of rows returned by your query. LIMIT is crucial for pagination, performance optimization, and working with large datasets where you only need a subset of results.", concepts: ["LIMIT clause syntax", "top N rows retrieval", "pagination basics", "OFFSET for skipping rows", "LIMIT with ORDER BY", "database-specific syntax variations"], examples: [{ code: `SELECT * FROM products ORDER BY price DESC LIMIT 10;`, explanation: "Top 10 products." }] },
            { title: "DISTINCT", content: "Eliminate duplicate rows from your results. DISTINCT helps you get unique values, which is essential for analyzing data quality and creating summary reports.", concepts: ["DISTINCT keyword usage", "removing duplicates", "DISTINCT with single column", "DISTINCT with multiple columns", "NULL handling in DISTINCT", "performance implications"], examples: [{ code: `SELECT DISTINCT category FROM products;`, explanation: "Unique categories." }] },
            { title: "Aggregate Functions - COUNT", content: "Count rows or non-NULL values in your dataset. COUNT is the most fundamental aggregate function, essential for understanding data volume and creating summary statistics.", concepts: ["COUNT(*) for all rows", "COUNT(column) for non-NULL values", "COUNT with DISTINCT", "counting filtered results", "grouped counting", "NULL exclusion in counting"], examples: [{ code: `SELECT COUNT(*) FROM orders WHERE status = 'completed';`, explanation: "Count completed orders." }] },
            { title: "Aggregate Functions - SUM", content: "Calculate the total of numeric values. SUM is essential for financial calculations, inventory management, and any scenario requiring cumulative totals.", concepts: ["SUM function syntax", "summing numeric columns", "SUM with WHERE filtering", "handling NULL values", "summing calculated expressions", "data type considerations"], examples: [{ code: `SELECT SUM(total_amount) FROM orders;`, explanation: "Total revenue." }] },
            { title: "Aggregate Functions - AVG", content: "Calculate average values across your data. AVG helps identify typical values, trends, and central tendencies in your datasets.", concepts: ["AVG function usage", "average calculation", "NULL value exclusion", "AVG with filtering", "precision in averages", "grouped averages"], examples: [{ code: `SELECT AVG(price) FROM products;`, explanation: "Average product price." }] },
            { title: "Aggregate Functions - MIN and MAX", content: "Find minimum and maximum values in your data. These functions are crucial for identifying extremes, ranges, and boundaries in your datasets.", concepts: ["MIN function for minimum values", "MAX function for maximum values", "working with different data types", "MIN/MAX with dates", "MIN/MAX with strings", "NULL handling"], examples: [{ code: `SELECT MIN(price) AS lowest, MAX(price) AS highest FROM products;`, explanation: "Price range." }] },
            { title: "GROUP BY", content: "Group rows by common values and apply aggregate functions. GROUP BY is fundamental for creating summary reports and analyzing data by categories.", concepts: ["GROUP BY clause syntax", "grouping by single column", "grouping by multiple columns", "aggregate functions with groups", "grouping with WHERE", "NULL grouping behavior"], examples: [{ code: `SELECT category, COUNT(*) FROM products GROUP BY category;`, explanation: "Count by category." }] },
            { title: "HAVING Clause", content: "Filter groups after aggregation using HAVING. This clause works like WHERE but operates on grouped results, enabling you to filter based on aggregate values.", concepts: ["HAVING vs WHERE difference", "HAVING with aggregate functions", "HAVING syntax", "multiple HAVING conditions", "HAVING with GROUP BY", "performance considerations"], examples: [{ code: `SELECT category, COUNT(*) FROM products GROUP BY category HAVING COUNT(*) > 10;`, explanation: "Categories with more than 10 products." }] },
            { title: "LIKE Operator", content: "Search for patterns in text data using wildcards. LIKE enables flexible text searching when you need partial matches rather than exact values.", concepts: ["LIKE operator syntax", "percent (%) wildcard", "underscore (_) wildcard", "pattern matching basics", "case sensitivity", "escaping special characters"], examples: [{ code: `SELECT * FROM customers WHERE name LIKE 'John%';`, explanation: "Names starting with John." }] },
            { title: "IN Operator", content: "Check if a value exists in a list of values. IN simplifies queries that would otherwise require multiple OR conditions, making code more readable and maintainable.", concepts: ["IN operator syntax", "list of values", "IN with subqueries", "NOT IN usage", "NULL handling with IN", "performance considerations"], examples: [{ code: `SELECT * FROM products WHERE category IN ('Electronics', 'Books', 'Clothing');`, explanation: "Multiple category filter." }] },
            { title: "BETWEEN Operator", content: "Filter values within a range. BETWEEN provides an intuitive way to specify inclusive ranges, making range queries more readable than using >= and <= operators.", concepts: ["BETWEEN syntax", "inclusive range boundaries", "BETWEEN with numbers", "BETWEEN with dates", "NOT BETWEEN usage", "date range queries"], examples: [{ code: `SELECT * FROM orders WHERE order_date BETWEEN '2024-01-01' AND '2024-12-31';`, explanation: "Orders in 2024." }] },
            { title: "IS NULL and IS NOT NULL", content: "Handle NULL values in your queries. NULL represents missing or unknown data, and proper NULL handling is crucial for accurate data analysis.", concepts: ["NULL value concept", "IS NULL operator", "IS NOT NULL operator", "NULL in comparisons", "NULL in aggregations", "COALESCE function"], examples: [{ code: `SELECT * FROM customers WHERE email IS NOT NULL;`, explanation: "Customers with email." }] },
            { title: "Column Aliases", content: "Rename columns in query results using AS. Aliases improve result readability and are essential when working with calculated columns or joining tables with similar column names.", concepts: ["AS keyword for aliasing", "alias syntax", "aliases in SELECT", "aliases with aggregate functions", "aliases in ORDER BY", "quoted aliases for special characters"], examples: [{ code: `SELECT first_name AS fname, last_name AS lname FROM customers;`, explanation: "Renamed columns." }] },
            { title: "String Functions", content: "Manipulate text data with built-in string functions. These functions enable text processing, formatting, and analysis directly in your SQL queries.", concepts: ["CONCAT for string joining", "SUBSTRING for text extraction", "LENGTH for string size", "UPPER and LOWER for case conversion", "TRIM for whitespace removal", "REPLACE for text substitution"], examples: [{ code: `SELECT CONCAT(first_name, ' ', last_name) AS full_name FROM customers;`, explanation: "Combine names." }] },
            { title: "Date Functions", content: "Work with dates and times using date functions. Date manipulation is essential for time-based analysis, reporting, and data processing.", concepts: ["CURRENT_DATE and CURRENT_TIMESTAMP", "DATEADD for date arithmetic", "DATEDIFF for date differences", "EXTRACT for date parts", "DATE_FORMAT for formatting", "timezone considerations"], examples: [{ code: `SELECT order_date, DATEADD(day, 7, order_date) AS delivery_date FROM orders;`, explanation: "Calculate delivery date." }] },
            { title: "Numeric Functions", content: "Perform mathematical operations on numeric data. These functions enable calculations, rounding, and mathematical transformations directly in SQL.", concepts: ["ROUND for rounding numbers", "FLOOR and CEILING", "ABS for absolute values", "POWER for exponentiation", "SQRT for square roots", "MOD for modulo operations"], examples: [{ code: `SELECT price, ROUND(price * 1.1, 2) AS price_with_tax FROM products;`, explanation: "Calculate with tax." }] },
            { title: "CASE Statements", content: "Add conditional logic to your queries using CASE. This powerful feature enables data transformation, categorization, and conditional calculations within SQL.", concepts: ["CASE WHEN syntax", "simple CASE expressions", "searched CASE expressions", "ELSE clause", "nested CASE statements", "CASE in SELECT and WHERE"], examples: [{ code: `SELECT name, CASE WHEN age < 18 THEN 'Minor' ELSE 'Adult' END AS status FROM users;`, explanation: "Categorize by age." }] },
            { title: "Subqueries - Scalar", content: "Use subqueries that return a single value. Scalar subqueries enable dynamic filtering and calculations based on other query results.", concepts: ["scalar subquery concept", "subquery in WHERE clause", "subquery in SELECT", "subquery with comparison operators", "correlated vs uncorrelated", "performance considerations"], examples: [{ code: `SELECT * FROM products WHERE price > (SELECT AVG(price) FROM products);`, explanation: "Above average price." }] },
            { title: "Subqueries - Multiple Rows", content: "Use subqueries that return multiple rows with IN, ANY, or ALL. These subqueries enable complex filtering based on sets of values.", concepts: ["IN with subqueries", "ANY operator", "ALL operator", "EXISTS operator", "subquery in FROM clause", "correlated subqueries"], examples: [{ code: `SELECT * FROM customers WHERE id IN (SELECT customer_id FROM orders);`, explanation: "Customers with orders." }] },
            { title: "JOIN - INNER JOIN", content: "Combine data from multiple tables using INNER JOIN. Joins are fundamental for working with relational databases and combining related data.", concepts: ["INNER JOIN syntax", "join conditions with ON", "equality joins", "multiple table joins", "join performance", "aliasing in joins"], examples: [{ code: `SELECT u.name, o.order_id FROM users u INNER JOIN orders o ON u.id = o.user_id;`, explanation: "Join users and orders." }] },
            { title: "JOIN - LEFT JOIN", content: "Retrieve all rows from the left table with matching rows from the right. LEFT JOIN preserves all records from the first table, even without matches.", concepts: ["LEFT JOIN syntax", "NULL values in unmatched rows", "LEFT JOIN use cases", "filtering LEFT JOIN results", "multiple LEFT JOINs", "LEFT JOIN vs INNER JOIN"], examples: [{ code: `SELECT u.name, o.order_id FROM users u LEFT JOIN orders o ON u.id = o.user_id;`, explanation: "All users with orders." }] },
            { title: "JOIN - RIGHT JOIN and FULL JOIN", content: "Use RIGHT JOIN and FULL OUTER JOIN for comprehensive data combination. These joins handle cases where you need all records from one or both tables.", concepts: ["RIGHT JOIN syntax", "FULL OUTER JOIN syntax", "when to use each join type", "NULL handling", "join combinations", "database support variations"], examples: [{ code: `SELECT u.name, o.order_id FROM users u FULL OUTER JOIN orders o ON u.id = o.user_id;`, explanation: "All users and orders." }] },
            { title: "Self Joins", content: "Join a table to itself for hierarchical or comparative queries. Self joins enable you to find relationships within the same table.", concepts: ["self join concept", "table aliasing for self joins", "hierarchical data queries", "employee-manager relationships", "comparative queries", "performance with self joins"], examples: [{ code: `SELECT e1.name, e2.name AS manager FROM employees e1 JOIN employees e2 ON e1.manager_id = e2.id;`, explanation: "Employees and managers." }] }
          ],
          medium: [
            { title: "Advanced JOIN Techniques", content: "Master complex multi-table joins with multiple conditions. Learn to join three or more tables efficiently and handle complex relationship patterns in real-world databases.", concepts: ["multiple table joins", "join order optimization", "join condition complexity", "handling many-to-many relationships", "join performance tuning", "join elimination strategies"], examples: [{ code: `SELECT u.name, o.order_id, p.product_name FROM users u JOIN orders o ON u.id = o.user_id JOIN order_items oi ON o.id = oi.order_id JOIN products p ON oi.product_id = p.id;`, explanation: "Multi-table join." }] },
            { title: "Correlated Subqueries", content: "Use subqueries that reference the outer query. Correlated subqueries enable row-by-row processing and complex filtering based on related data.", concepts: ["correlated subquery concept", "execution pattern", "performance implications", "correlated subquery in SELECT", "correlated subquery in WHERE", "alternatives to correlated subqueries"], examples: [{ code: `SELECT name, (SELECT COUNT(*) FROM orders WHERE orders.user_id = users.id) AS order_count FROM users;`, explanation: "Count orders per user." }] },
            { title: "EXISTS and NOT EXISTS", content: "Check for the existence of related records efficiently. EXISTS is often more performant than IN for large datasets and provides semantic clarity for existence checks.", concepts: ["EXISTS operator syntax", "NOT EXISTS usage", "EXISTS vs IN performance", "EXISTS with correlated subqueries", "existence checking patterns", "optimization techniques"], examples: [{ code: `SELECT * FROM customers WHERE EXISTS (SELECT 1 FROM orders WHERE orders.customer_id = customers.id);`, explanation: "Customers with orders." }] },
            { title: "Window Functions - ROW_NUMBER", content: "Assign sequential numbers to rows using ROW_NUMBER. Window functions enable advanced analytical queries without self-joins or subqueries.", concepts: ["ROW_NUMBER() syntax", "OVER clause", "PARTITION BY for grouping", "ORDER BY in window functions", "row numbering use cases", "performance benefits"], examples: [{ code: `SELECT name, salary, ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS rank FROM employees;`, explanation: "Rank within department." }] },
            { title: "Window Functions - RANK and DENSE_RANK", content: "Rank rows with different tie-handling strategies. RANK and DENSE_RANK provide flexible ranking options for analytical queries.", concepts: ["RANK() function", "DENSE_RANK() function", "tie handling differences", "ranking with partitions", "ranking use cases", "comparison with ROW_NUMBER"], examples: [{ code: `SELECT name, score, RANK() OVER (ORDER BY score DESC), DENSE_RANK() OVER (ORDER BY score DESC) FROM students;`, explanation: "Student rankings." }] },
            { title: "Window Functions - LAG and LEAD", content: "Access previous and next row values. LAG and LEAD enable time-series analysis and comparative queries without self-joins.", concepts: ["LAG() function", "LEAD() function", "offset parameter", "default value handling", "partitioning with LAG/LEAD", "time-series applications"], examples: [{ code: `SELECT date, sales, LAG(sales) OVER (ORDER BY date) AS prev_sales, LEAD(sales) OVER (ORDER BY date) AS next_sales FROM daily_sales;`, explanation: "Previous and next values." }] },
            { title: "Window Functions - Aggregate", content: "Calculate aggregates over window frames. Window aggregates enable running totals, moving averages, and cumulative calculations.", concepts: ["SUM() OVER", "AVG() OVER", "COUNT() OVER", "window frame specification", "ROWS BETWEEN", "RANGE BETWEEN"], examples: [{ code: `SELECT date, sales, SUM(sales) OVER (ORDER BY date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS moving_sum FROM daily_sales;`, explanation: "Moving sum." }] },
            { title: "Common Table Expressions (CTEs)", content: "Create named temporary result sets with CTEs. CTEs improve query readability and enable recursive queries for hierarchical data.", concepts: ["WITH clause syntax", "CTE definition", "multiple CTEs", "CTE in complex queries", "readability benefits", "performance considerations"], examples: [{ code: `WITH high_sales AS (SELECT * FROM sales WHERE amount > 1000) SELECT * FROM high_sales ORDER BY amount DESC;`, explanation: "CTE example." }] },
            { title: "Recursive CTEs", content: "Query hierarchical data with recursive CTEs. This powerful feature enables tree traversal, organizational charts, and graph queries.", concepts: ["RECURSIVE keyword", "anchor member", "recursive member", "UNION ALL in recursion", "termination conditions", "hierarchy traversal patterns"], examples: [{ code: `WITH RECURSIVE tree AS (SELECT id, name, parent_id FROM nodes WHERE parent_id IS NULL UNION ALL SELECT n.id, n.name, n.parent_id FROM nodes n JOIN tree t ON n.parent_id = t.id) SELECT * FROM tree;`, explanation: "Hierarchy traversal." }] },
            { title: "UNION Operations", content: "Combine results from multiple queries. UNION operations enable data consolidation, report generation, and query result merging.", concepts: ["UNION syntax", "UNION ALL vs UNION", "column compatibility", "duplicate handling", "UNION with ORDER BY", "performance considerations"], examples: [{ code: `SELECT name FROM table1 UNION SELECT name FROM table2;`, explanation: "Combine queries." }] },
            { title: "INTERSECT and EXCEPT", content: "Find common or different rows between queries. These set operations enable sophisticated data comparison and filtering.", concepts: ["INTERSECT operator", "EXCEPT operator", "set theory concepts", "use cases for each", "performance implications", "database support variations"], examples: [{ code: `SELECT id FROM table1 INTERSECT SELECT id FROM table2;`, explanation: "Common IDs." }] },
            { title: "Advanced String Functions", content: "Master complex string manipulation techniques. Advanced string functions enable sophisticated text processing, parsing, and formatting.", concepts: ["REGEXP functions", "string splitting", "string concatenation patterns", "text extraction techniques", "pattern matching", "encoding considerations"], examples: [{ code: `SELECT REGEXP_REPLACE(phone, '[^0-9]', '') AS clean_phone FROM contacts;`, explanation: "Clean phone numbers." }] },
            { title: "Advanced Date Functions", content: "Handle complex date and time operations. Advanced date functions enable timezone conversions, date arithmetic, and temporal analysis.", concepts: ["timezone conversions", "date interval arithmetic", "extracting date parts", "date formatting variations", "business day calculations", "temporal queries"], examples: [{ code: `SELECT order_date, DATE_TRUNC('month', order_date) AS month_start FROM orders;`, explanation: "Month truncation." }] },
            { title: "PIVOT Operations", content: "Transform rows into columns for reporting. PIVOT enables cross-tabulation and matrix-style result sets for analytical reporting.", concepts: ["PIVOT syntax", "aggregation in PIVOT", "column generation", "dynamic pivoting", "PIVOT use cases", "database-specific syntax"], examples: [{ code: `SELECT * FROM (SELECT product, month, sales FROM sales_data) AS src PIVOT (SUM(sales) FOR month IN ([Jan], [Feb], [Mar])) AS pvt;`, explanation: "Pivot table." }] },
            { title: "UNPIVOT Operations", content: "Transform columns into rows for normalization. UNPIVOT reverses PIVOT operations and enables data normalization.", concepts: ["UNPIVOT syntax", "column to row transformation", "value and name columns", "UNPIVOT use cases", "data normalization", "reverse pivoting patterns"], examples: [{ code: `SELECT product, month, sales FROM sales_pivot UNPIVOT (sales FOR month IN (Jan, Feb, Mar)) AS unpvt;`, explanation: "Unpivot data." }] },
            { title: "ROLLUP and CUBE", content: "Generate hierarchical subtotals and all combination totals. These GROUP BY extensions enable comprehensive summary reporting.", concepts: ["ROLLUP syntax", "CUBE syntax", "hierarchical totals", "all combination totals", "GROUPING function", "reporting applications"], examples: [{ code: `SELECT region, product, SUM(sales) FROM sales GROUP BY ROLLUP(region, product);`, explanation: "Hierarchical totals." }] },
            { title: "GROUPING SETS", content: "Specify multiple grouping levels explicitly. GROUPING SETS provides fine-grained control over aggregation levels.", concepts: ["GROUPING SETS syntax", "explicit grouping", "combination control", "GROUPING function usage", "reporting flexibility", "performance optimization"], examples: [{ code: `SELECT region, product, SUM(sales) FROM sales GROUP BY GROUPING SETS ((region), (product), ());`, explanation: "Multiple grouping levels." }] },
            { title: "Stored Procedures", content: "Create reusable SQL code blocks with parameters. Stored procedures encapsulate business logic and improve application performance.", concepts: ["CREATE PROCEDURE", "parameter declaration", "procedure body", "execution with EXEC", "return values", "error handling"], examples: [{ code: `CREATE PROCEDURE GetUserOrders @user_id INT AS SELECT * FROM orders WHERE user_id = @user_id;`, explanation: "Parameterized procedure." }] },
            { title: "User-Defined Functions", content: "Create custom functions for reusable calculations. Functions enable code reuse and consistent business logic implementation.", concepts: ["CREATE FUNCTION", "scalar functions", "table-valued functions", "deterministic functions", "function parameters", "return types"], examples: [{ code: `CREATE FUNCTION CalculateTotal(@price DECIMAL, @quantity INT) RETURNS DECIMAL AS BEGIN RETURN @price * @quantity; END;`, explanation: "Calculation function." }] },
            { title: "Triggers", content: "Automate actions on data changes. Triggers enable audit trails, data validation, and automatic business rule enforcement.", concepts: ["CREATE TRIGGER", "AFTER triggers", "BEFORE triggers", "INSERTED and DELETED tables", "trigger execution order", "best practices"], examples: [{ code: `CREATE TRIGGER update_timestamp ON orders AFTER INSERT AS UPDATE orders SET updated_at = GETDATE() WHERE id IN (SELECT id FROM inserted);`, explanation: "Auto-update timestamp." }] },
            { title: "Transactions", content: "Ensure data consistency with transaction control. Transactions guarantee all-or-nothing execution, maintaining database integrity.", concepts: ["BEGIN TRANSACTION", "COMMIT", "ROLLBACK", "ACID properties", "transaction isolation", "deadlock handling"], examples: [{ code: `BEGIN TRANSACTION; UPDATE accounts SET balance = balance - 100 WHERE id = 1; UPDATE accounts SET balance = balance + 100 WHERE id = 2; COMMIT;`, explanation: "Transfer transaction." }] },
            { title: "Transaction Isolation Levels", content: "Control how transactions interact with concurrent operations. Isolation levels balance consistency and performance.", concepts: ["READ UNCOMMITTED", "READ COMMITTED", "REPEATABLE READ", "SERIALIZABLE", "isolation trade-offs", "concurrency control"], examples: [{ code: `SET TRANSACTION ISOLATION LEVEL READ COMMITTED; BEGIN TRANSACTION; SELECT * FROM accounts; COMMIT;`, explanation: "Isolation level setting." }] },
            { title: "Indexes - Creation and Usage", content: "Optimize query performance with indexes. Proper indexing dramatically improves query speed for large tables.", concepts: ["CREATE INDEX", "index types", "index selection", "composite indexes", "index maintenance", "query optimization"], examples: [{ code: `CREATE INDEX idx_user_email ON users(email); SELECT * FROM users WHERE email = 'test@example.com';`, explanation: "Index usage." }] },
            { title: "Query Optimization", content: "Analyze and optimize slow queries. Understanding query execution plans enables performance tuning.", concepts: ["EXPLAIN plans", "query analysis", "index usage", "join optimization", "subquery optimization", "hints and directives"], examples: [{ code: `EXPLAIN SELECT * FROM orders WHERE user_id = 123;`, explanation: "Query plan analysis." }] },
            { title: "Views", content: "Create virtual tables from queries. Views simplify complex queries, provide data abstraction, and enhance security.", concepts: ["CREATE VIEW", "view definition", "updatable views", "view limitations", "security with views", "materialized views"], examples: [{ code: `CREATE VIEW active_users AS SELECT * FROM users WHERE status = 'active'; SELECT * FROM active_users;`, explanation: "View creation." }] },
            { title: "Materialized Views", content: "Store pre-computed query results for performance. Materialized views trade storage for query speed.", concepts: ["materialized view concept", "refresh strategies", "incremental refresh", "storage considerations", "use cases", "maintenance overhead"], examples: [{ code: `CREATE MATERIALIZED VIEW sales_summary AS SELECT region, SUM(sales) FROM sales GROUP BY region;`, explanation: "Materialized view." }] },
            { title: "Dynamic SQL", content: "Build and execute SQL dynamically. Dynamic SQL enables flexible, parameterized queries that adapt to runtime conditions.", concepts: ["dynamic SQL construction", "EXECUTE statement", "parameterization", "SQL injection prevention", "use cases", "security considerations"], examples: [{ code: `DECLARE @sql NVARCHAR(MAX) = 'SELECT * FROM ' + @table_name; EXEC sp_executesql @sql;`, explanation: "Dynamic query execution." }] },
            { title: "Error Handling", content: "Implement robust error handling in SQL. Proper error handling ensures application reliability and data integrity.", concepts: ["TRY-CATCH blocks", "error functions", "transaction rollback on errors", "custom error messages", "error logging", "best practices"], examples: [{ code: `BEGIN TRY BEGIN TRANSACTION; UPDATE accounts SET balance = balance - 100; COMMIT; END TRY BEGIN CATCH ROLLBACK; THROW; END CATCH;`, explanation: "Error handling pattern." }] },
            { title: "Temporary Tables", content: "Create and use temporary tables for intermediate results. Temporary tables enable complex data processing and improve query performance for multi-step operations.", concepts: ["CREATE TEMPORARY TABLE", "temporary table scope", "session vs global temp tables", "temp table cleanup", "performance benefits", "use cases"], examples: [{ code: `CREATE TEMPORARY TABLE temp_results AS SELECT * FROM orders WHERE status = 'pending'; SELECT * FROM temp_results;`, explanation: "Temporary table creation." }] },
            { title: "Table Variables", content: "Use table variables for small result sets. Table variables provide a lightweight alternative to temporary tables with automatic cleanup.", concepts: ["DECLARE @table", "table variable syntax", "scope limitations", "performance characteristics", "when to use vs temp tables", "insertion and querying"], examples: [{ code: `DECLARE @temp TABLE (id INT, name VARCHAR(50)); INSERT INTO @temp VALUES (1, 'Test'); SELECT * FROM @temp;`, explanation: "Table variable usage." }] },
            { title: "Cursors", content: "Process rows one at a time with cursors. While generally avoided in favor of set-based operations, cursors are necessary for certain complex business logic scenarios.", concepts: ["DECLARE CURSOR", "OPEN and FETCH", "cursor types", "performance implications", "alternatives to cursors", "when cursors are appropriate"], examples: [{ code: `DECLARE cur CURSOR FOR SELECT id, name FROM users; OPEN cur; FETCH NEXT FROM cur INTO @id, @name; CLOSE cur; DEALLOCATE cur;`, explanation: "Basic cursor pattern." }] },
            { title: "Cross-Database Queries", content: "Query data across multiple databases. Cross-database queries enable data integration and reporting from distributed database systems.", concepts: ["database name qualification", "linked servers", "cross-database joins", "security considerations", "performance impact", "alternative approaches"], examples: [{ code: `SELECT * FROM db1.users u JOIN db2.orders o ON u.id = o.user_id;`, explanation: "Cross-database join." }] },
            { title: "Query Hints", content: "Influence query execution plans with hints. Query hints provide fine-grained control over optimizer decisions when automatic optimization isn't sufficient.", concepts: ["INDEX hints", "JOIN hints", "FORCE ORDER", "OPTION clause", "when to use hints", "hint maintenance"], examples: [{ code: `SELECT * FROM orders WITH (INDEX(idx_user_date)) WHERE user_id = 123;`, explanation: "Index hint usage." }] }
          ],
          hard: [
            { title: "Advanced Query Optimization", content: "Master advanced optimization techniques for complex queries. Learn to analyze execution plans, identify bottlenecks, and apply optimization strategies.", concepts: ["execution plan analysis", "statistics usage", "query hints", "parallel execution", "partition pruning", "optimization best practices"], examples: [{ code: `SELECT /*+ INDEX(orders idx_user_date) */ * FROM orders WHERE user_id = 123 AND order_date > '2024-01-01';`, explanation: "Query hint usage." }] },
            { title: "Partitioning Strategies", content: "Implement table partitioning for large datasets. Partitioning improves query performance and simplifies data management.", concepts: ["partition concepts", "range partitioning", "hash partitioning", "list partitioning", "partition pruning", "maintenance operations"], examples: [{ code: `CREATE TABLE orders (id INT, order_date DATE) PARTITION BY RANGE (order_date);`, explanation: "Partitioned table." }] },
            { title: "Advanced Window Functions", content: "Master complex windowing operations for analytical queries. Advanced window functions enable sophisticated data analysis patterns.", concepts: ["window frame specifications", "ROWS vs RANGE", "PRECEDING and FOLLOWING", "window function nesting", "performance optimization", "advanced patterns"], examples: [{ code: `SELECT date, sales, SUM(sales) OVER (ORDER BY date RANGE BETWEEN INTERVAL '7' DAY PRECEDING AND CURRENT ROW) AS week_sum FROM daily_sales;`, explanation: "Advanced windowing." }] },
            { title: "Full-Text Search", content: "Implement efficient text search capabilities. Full-text search enables fast, flexible text querying across large text columns.", concepts: ["full-text indexes", "CONTAINS predicate", "FREETEXT predicate", "ranking functions", "thesaurus configuration", "performance considerations"], examples: [{ code: `SELECT * FROM articles WHERE CONTAINS(content, 'database');`, explanation: "Full-text search." }] },
            { title: "XML and JSON Handling", content: "Work with semi-structured data formats. Modern databases support native XML and JSON operations for flexible data storage and querying.", concepts: ["XML data type", "JSON data type", "XML query methods", "JSON functions", "parsing and validation", "indexing strategies"], examples: [{ code: `SELECT JSON_VALUE(data, '$.name') AS name FROM documents WHERE JSON_EXISTS(data, '$.email');`, explanation: "JSON querying." }] },
            { title: "Advanced CTE Patterns and Optimization", content: "Master complex Common Table Expression patterns for solving sophisticated data problems. Learn to optimize recursive CTEs, chain multiple CTEs efficiently, and use CTEs for complex analytical queries that would be difficult with traditional subqueries.", concepts: ["recursive CTE optimization", "multiple CTE chaining", "CTE materialization strategies", "performance tuning for CTEs", "CTE vs subquery trade-offs", "advanced recursive patterns"], examples: [{ code: `WITH RECURSIVE hierarchy AS (SELECT id, name, parent_id, 0 AS level FROM employees WHERE manager_id IS NULL UNION ALL SELECT e.id, e.name, e.parent_id, h.level + 1 FROM employees e JOIN hierarchy h ON e.manager_id = h.id) SELECT * FROM hierarchy ORDER BY level, name;`, explanation: "Optimized recursive hierarchy query." }] },
            { title: "Query Parallelization and Distributed Processing", content: "Implement parallel query execution strategies for large-scale data processing. Learn to leverage database parallel execution capabilities, optimize for multi-core systems, and design queries that scale across distributed database architectures for maximum performance.", concepts: ["parallel query execution", "degree of parallelism", "distributed query optimization", "partition-aware queries", "parallel aggregation", "scalability patterns"], examples: [{ code: `SELECT /*+ PARALLEL(orders, 8) */ region, product_category, SUM(sales) FROM orders GROUP BY region, product_category;`, explanation: "Parallel aggregation query." }] },
            { title: "Temporal Data Management and Time-Series Analysis", content: "Handle time-based data with advanced temporal SQL techniques. Master time-series queries, temporal table features, versioning, and historical data analysis patterns for tracking changes over time and querying data as it existed at specific points in history.", concepts: ["temporal tables", "system-versioned tables", "time-series queries", "temporal joins", "historical data analysis", "change tracking patterns"], examples: [{ code: `SELECT * FROM products FOR SYSTEM_TIME AS OF '2024-01-01' WHERE category = 'Electronics';`, explanation: "Query historical data at specific time." }] },
            { title: "Advanced Materialized View Strategies", content: "Design and optimize materialized views for complex reporting scenarios. Learn incremental refresh strategies, query rewrite optimization, and how to maintain materialized views efficiently in high-transaction environments while ensuring data consistency and performance.", concepts: ["materialized view design", "incremental refresh", "fast refresh strategies", "query rewrite optimization", "materialized view maintenance", "refresh scheduling"], examples: [{ code: `CREATE MATERIALIZED VIEW sales_summary BUILD IMMEDIATE REFRESH FAST ON COMMIT AS SELECT region, product_id, SUM(amount) FROM sales GROUP BY region, product_id;`, explanation: "Fast-refresh materialized view." }] },
            { title: "Database Performance Tuning and Monitoring", content: "Master comprehensive database performance tuning techniques. Learn to identify performance bottlenecks, optimize resource utilization, implement effective caching strategies, and monitor database health for optimal performance in production environments.", concepts: ["performance monitoring", "query profiling", "resource optimization", "cache management", "connection pooling", "performance metrics analysis"], examples: [{ code: `SELECT query, execution_time, rows_processed FROM sys.query_stats WHERE execution_time > 1000 ORDER BY execution_time DESC;`, explanation: "Identify slow queries." }] }
          ]
        }
      };
      const templates = mode === 'beginner' ? beginnerTemplates : mediumTemplates;
      const langKey = language;
      const langTemplates = templates[langKey as keyof typeof templates];

      if (!langTemplates) {
        const modeTitle = mode === 'beginner' ? 'Fun' : 'Structured';
        const modeDesc = mode === 'beginner'
          ? 'Discover the magic of programming with fun, interactive tutorials!'
          : 'Master programming concepts through structured, comprehensive learning.';

        return {
          title: `${modeTitle} ${language} Tutorial ${level} ${mode === 'beginner' ? '🌟' : '📚'}`,
          content: `${modeDesc} This tutorial covers fundamental ${language} concepts.`,
          concepts: ["Basic syntax", "Variables", "Control flow"],
          examples: []
        };
      }

      const diffTemplates = langTemplates[difficulty as keyof typeof langTemplates] || [];

      // Calculate the correct index based on difficulty level
      let index: number;
      if (difficulty === 'easy') {
        index = (level - 1) % 10; // Levels 1-10 map to indices 0-9
      } else if (difficulty === 'medium') {
        index = (level - 11) % 10; // Levels 11-20 map to indices 0-9
      } else {
        index = (level - 21) % 10; // Levels 21-30 map to indices 0-9
      }

      if (diffTemplates[index]) {
        return diffTemplates[index];
      }

      return {
        title: `${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} ${language} Tutorial ${level}`,
        content: `Advanced ${language} concepts and techniques. Tutorial level ${level}.`,
        concepts: ["Advanced features", "Best practices", "Performance"],
        examples: []
      };
    };

    // Generate 100 tutorials per language
    for (let i = 1; i <= 30; i++) {
      const difficulty = i <= 10 ? 'easy' : i <= 20 ? 'medium' : 'hard';
      const tutorialData = getTutorialData(i, difficulty, language);

      tutorials.push({
        id: baseId + i - 1, // -1 because arrays are 0-indexed but IDs start at baseId
        title: tutorialData.title,
        content: tutorialData.content,
        concepts: tutorialData.concepts,
        examples: tutorialData.examples,
        difficulty,
        language,
        isLocked: i > 1 && !isTutorialCompleted(baseId + i - 2), // Check if previous tutorial is completed
      });
    }

    return tutorials;
  };

  const isTutorialCompleted = (tutorialId: number | undefined) => {
    if (!progress?.completedChallenges || tutorialId === undefined || tutorialId === null) return false;
    // Check both as number and as string to handle mixed types from backend
    const completed = progress.completedChallenges as (number | string)[];
    return completed.includes(tutorialId) || 
           completed.includes(String(tutorialId)) ||
           completed.includes(tutorialId.toString());
  };

  const languageTutorials = generateLanguageTutorials(selectedLanguage, learningMode);
  const tutorialProgress = languageTutorials.filter(t => isTutorialCompleted(t.id)).length;
  const tutorialProgressPercent = tutorialProgress > 0 ? (tutorialProgress / 30) * 100 : 0;

  const handleOpenTutorial = (tutorial: any) => {
    setSelectedTutorial(tutorial);
    setTutorialDialog(true);
  };

  const handleMarkTutorialCompleted = async (tutorial?: any) => {
    const tutorialToComplete = tutorial || selectedTutorial;
    if (tutorialToComplete) {
      try {
        // Call the backend to complete the tutorial and update XP
        const result = await api.post(`/api/tutorials/${tutorialToComplete.id}/complete`);

        // Refresh user progress to get updated data
        dispatch(fetchUserProgress());

        setCompletedTutorial(tutorialToComplete);
        setLevelUp(result.data.levelUp);
        setCelebrationOpen(true);

        setTutorialDialog(false);
        setSelectedTutorial(null);
      } catch (error) {
        console.error('Error completing tutorial:', error);
        // Fallback to old method if new endpoint fails
        dispatch(updateXP(15));
        setCompletedTutorial(tutorialToComplete);
        setLevelUp(false);
        setCelebrationOpen(true);
        setTutorialDialog(false);
        setSelectedTutorial(null);
      }
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        Learning Tutorials 📚
      </Typography>

      {/* Language Selector */}
      <Box sx={{ mb: 4 }}>
        <FormControl fullWidth sx={{ maxWidth: 300 }}>
          <InputLabel>Select Language</InputLabel>
          <Select
            value={selectedLanguage}
            label="Select Language"
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            {languages.map((lang) => (
              <MenuItem key={lang.value} value={lang.value}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>{lang.icon}</span>
                  <span>{lang.label}</span>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Learning Mode Toggle */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          Choose Your Learning Style 🎯
        </Typography>
        <ToggleButtonGroup
          value={learningMode}
          exclusive
          onChange={(_, newMode) => newMode && setLearningMode(newMode)}
          aria-label="learning mode"
          sx={{
            '& .MuiToggleButton-root': {
              px: 4,
              py: 2,
              borderRadius: 3,
              mx: 1,
              fontWeight: 'bold',
              fontSize: '1.1rem',
              textTransform: 'none',
              transition: 'all 0.3s ease',
              '&.Mui-selected': {
                backgroundColor: learningMode === 'beginner' ? '#4ecdc4' : '#ff6b6b',
                color: 'white',
                transform: 'scale(1.05)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                '&:hover': {
                  backgroundColor: learningMode === 'beginner' ? '#45b7d1' : '#ff5252',
                }
              },
              '&:hover': {
                transform: 'scale(1.02)',
              }
            }
          }}
        >
          <ToggleButton value="beginner" aria-label="beginner mode">
            👶 Junior
          </ToggleButton>
          <ToggleButton value="medium" aria-label="medium mode">
            👨‍💼 Senior
          </ToggleButton>
        </ToggleButtonGroup>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, ml: 1 }}>
          {learningMode === 'beginner'
            ? '🎨 Fun, animated tutorials designed for kids and beginners! All tutorials are colorful and interactive.'
            : '🚀 Structured learning path from beginner to advanced concepts. Perfect for serious learners.'
          }
        </Typography>
      </Box>

      {/* Progress Overview */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {languages.find(l => l.value === selectedLanguage)?.icon} {languages.find(l => l.value === selectedLanguage)?.label} Tutorials Progress
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Typography variant="body1">
              {tutorialProgress}/30 Tutorials Completed
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ({tutorialProgressPercent.toFixed(1)}%)
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={tutorialProgressPercent}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </CardContent>
      </Card>

      {/* Tutorial Grid */}
      <Grid container spacing={3}>
        {languageTutorials.map((tutorial) => (
          <Grid item xs={12} md={6} lg={4} key={tutorial.id}>
            <Card sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              opacity: tutorial.isLocked ? 0.6 : 1,
              border: tutorial.isLocked ? '2px solid #ccc' : 'none'
            }}>
              <CardContent sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{
                    bgcolor: isTutorialCompleted(tutorial.id) ? 'success.main' : tutorial.isLocked ? 'grey.400' : 'info.main',
                    mr: 2
                  }}>
                    {isTutorialCompleted(tutorial.id) ? <CheckCircle /> : tutorial.isLocked ? <Lock /> : <EmojiEvents />}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {tutorial.title}
                    </Typography>
                    <Chip
                      label={tutorial.difficulty}
                      size="small"
                      color={getDifficultyColor(tutorial.difficulty) as any}
                    />
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {tutorial.content.substring(0, 100)}...
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {tutorial.concepts.slice(0, 3).map((concept: string, index: number) => (
                    <Chip
                      key={index}
                      label={concept}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Star sx={{ color: 'warning.main', fontSize: 16 }} />
                  <Typography variant="body2">
                    +15 XP
                  </Typography>
                </Box>
              </CardContent>

              <Box sx={{ p: 2, pt: 0 }}>
                {!tutorial.isLocked && (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      startIcon={<EmojiEvents />}
                      onClick={() => handleOpenTutorial(tutorial)}
                      size="small"
                      fullWidth
                    >
                      View Tutorial
                    </Button>
                    {!isTutorialCompleted(tutorial.id) && (
                      <Button
                        variant="contained"
                        startIcon={<Done />}
                        onClick={() => handleMarkTutorialCompleted(tutorial)}
                        size="small"
                        fullWidth
                      >
                        Mark Completed
                      </Button>
                    )}
                  </Box>
                )}
                {tutorial.isLocked && (
                  <Button
                    variant="outlined"
                    startIcon={<Lock />}
                    disabled
                    size="small"
                    fullWidth
                  >
                    Locked
                  </Button>
                )}
                {isTutorialCompleted(tutorial.id) && (
                  <Chip
                    label="Completed ✓"
                    color="success"
                    size="small"
                    sx={{ width: '100%' }}
                  />
                )}
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Tutorial Viewing Dialog */}
      <Dialog
        open={tutorialDialog}
        onClose={() => setTutorialDialog(false)}
        maxWidth="lg"
        fullWidth
        scroll="paper"
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <EmojiEvents sx={{ color: 'info.main' }} />
          {selectedTutorial?.title}
        </DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Overview
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            {selectedTutorial?.content}
          </Typography>

          <Typography variant="h6" gutterBottom>
            Key Concepts
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
            {selectedTutorial?.concepts.map((concept: string, index: number) => (
              <Chip
                key={index}
                label={concept}
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>

          <Typography variant="h6" gutterBottom>
            Code Examples
          </Typography>
          {selectedTutorial?.examples.map((example: any, index: number) => (
            <Box key={index} sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                Example {index + 1}: {example.explanation}
              </Typography>
              <Paper sx={{
                p: 2,
                backgroundColor: '#1e1e1e',
                color: '#ffffff',
                fontFamily: 'monospace',
                border: '1px solid rgba(144, 202, 249, 0.2)'
              }}>
                <Typography variant="body2" component="pre" sx={{
                  whiteSpace: 'pre-wrap',
                  margin: 0,
                  fontFamily: 'inherit'
                }}>
                  {example.code}
                </Typography>
              </Paper>
            </Box>
          ))}

          {(!selectedTutorial?.examples || selectedTutorial.examples.length === 0) && (
            <Typography variant="body2" color="text.secondary">
              No code examples available for this tutorial.
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
      <Button
        variant="outlined"
        startIcon={<CodeIcon />}
        onClick={() => {
          // Extract tutorial code and set it in the editor
          if (selectedTutorial?.examples && selectedTutorial.examples.length > 0) {
            const tutorialCode = selectedTutorial.examples
              .map((example: any) => example.code)
              .join('\n\n// Next Example:\n');
            
            dispatch(setCurrentCode(tutorialCode));
            // Map React to JavaScript for the code editor, keep other languages as-is
            const editorLanguage = selectedLanguage === 'react' ? 'javascript' : selectedLanguage;
            dispatch(setLanguage(editorLanguage));
          }
          
          navigate('/dashboard/editor');
          setTutorialDialog(false);
        }}
      >
        Open Code Editor
      </Button>
          {!isTutorialCompleted(selectedTutorial?.id) && (
            <Button
              variant="contained"
              startIcon={<Done />}
              onClick={handleMarkTutorialCompleted}
              color="success"
            >
              Mark as Completed (+15 XP)
            </Button>
          )}
          <Button onClick={() => setTutorialDialog(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Celebration Dialog */}
      <Dialog
        open={celebrationOpen}
        onClose={() => setCelebrationOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
            border: '2px solid #90caf9',
            borderRadius: 3,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 50% 50%, rgba(144, 202, 249, 0.1) 0%, transparent 70%)',
              animation: 'pulse 3s infinite',
            }
          }
        }}
      >
        {/* Animated confetti background */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}>
          {[...Array(20)].map((_, i) => (
            <Box
              key={i}
              sx={{
                position: 'absolute',
                left: Math.random() * 100 + '%',
                top: '-10px',
                width: '8px',
                height: '8px',
                backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b'][Math.floor(Math.random() * 5)],
                borderRadius: '50%',
                animation: 'fall ' + (2 + Math.random() * 3) + 's linear ' + (Math.random() * 2) + 's infinite',
                '@keyframes fall': {
                  '0%': { transform: 'translateY(-10px) rotate(0deg)', opacity: 1 },
                  '100%': { transform: 'translateY(100vh) rotate(360deg)', opacity: 0 },
                },
              }}
            />
          ))}
        </Box>

        <DialogTitle sx={{
          textAlign: 'center',
          color: '#90caf9',
          fontSize: '2rem',
          fontWeight: 'bold',
          animation: 'bounceIn 0.6s ease-out',
          '@keyframes bounceIn': {
            '0%': { transform: 'scale(0.3)', opacity: 0 },
            '50%': { transform: 'scale(1.05)', opacity: 1 },
            '70%': { transform: 'scale(0.9)', opacity: 1 },
            '100%': { transform: 'scale(1)', opacity: 1 },
          },
        }}>
          <Celebration sx={{ fontSize: '3rem', color: '#f9ca24', mb: 1 }} />
          Congratulations! 🎉
        </DialogTitle>

        <DialogContent sx={{ textAlign: 'center', py: 3 }}>
          <Typography variant="h5" sx={{
            color: '#ffffff',
            mb: 2,
            fontWeight: 'bold',
            animation: 'fadeInUp 0.8s ease-out 0.2s both',
          }}>
            Tutorial Completed!
          </Typography>

          <Typography variant="h6" sx={{
            color: '#4ecdc4',
            mb: 3,
            fontWeight: 'bold',
            animation: 'fadeInUp 0.8s ease-out 0.4s both',
          }}>
            {completedTutorial?.title}
          </Typography>

          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            mb: 3,
            animation: 'fadeInUp 0.8s ease-out 0.6s both',
          }}>
            <Grade sx={{ fontSize: '2rem', color: '#f9ca24' }} />
            <Typography variant="h4" sx={{ color: '#90caf9', fontWeight: 'bold' }}>
              +15 XP Earned!
            </Typography>
          </Box>

          {levelUp && (
            <Box sx={{
              background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
              borderRadius: 2,
              p: 2,
              mb: 3,
              animation: 'levelUp 1s ease-out 1s both',
              '@keyframes levelUp': {
                '0%': { transform: 'scale(0.8)', opacity: 0 },
                '50%': { transform: 'scale(1.1)' },
                '100%': { transform: 'scale(1)', opacity: 1 },
              },
            }}>
              <Whatshot sx={{ fontSize: '2rem', color: '#ffffff', mb: 1 }} />
              <Typography variant="h5" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                LEVEL UP! 🚀
              </Typography>
              <Typography variant="body1" sx={{ color: '#ffffff' }}>
                You've reached a new level!
              </Typography>
            </Box>
          )}

          <Typography variant="body1" sx={{
            color: 'rgba(255, 255, 255, 0.8)',
            animation: 'fadeInUp 0.8s ease-out 0.8s both',
          }}>
            Keep up the great work! Continue learning to unlock more advanced tutorials.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => setCelebrationOpen(false)}
            sx={{
              backgroundColor: '#90caf9',
              color: '#0a0a0a',
              fontWeight: 'bold',
              px: 4,
              py: 1.5,
              borderRadius: 3,
              '&:hover': {
                backgroundColor: '#64b5f6',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
              animation: 'fadeInUp 0.8s ease-out 1s both',
            }}
          >
            Continue Learning 🎯
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Tutorials;
