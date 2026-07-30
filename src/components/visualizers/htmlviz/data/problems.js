export const problems = [
    // EASY PROBLEMS
    {
        id: 1,
        title: "The First Heading",
        difficulty: "Easy",
        category: "Text",
        description: "Create a level-one heading (h1) with the text 'My First Website'.",
        initialCode: "<!-- Write your code here -->",
        validation: { type: "includes", value: ["<h1>", "My First Website", "</h1>"] }
    },
    {
        id: 2,
        title: "Paragraph Power",
        difficulty: "Easy",
        category: "Text",
        description: "Create a paragraph (p) with the text 'HTML is fun!'.",
        initialCode: "",
        validation: { type: "includes", value: ["<p>", "HTML is fun!", "</p>"] }
    },
    {
        id: 3,
        title: "Bold Statement",
        difficulty: "Easy",
        category: "Text",
        description: "Make the word 'Important' bold using the strong tag.",
        initialCode: "<p>This is Important text.</p>",
        validation: { type: "includes", value: ["<strong>Important</strong>"] }
    },
    {
        id: 4,
        title: "Clickable Link",
        difficulty: "Easy",
        category: "Links",
        description: "Create a link to 'https://google.com' with the text 'Search'.",
        initialCode: "",
        validation: { type: "regex", value: /<a\s+href=["']https:\/\/google\.com["']\s*>Search<\/a>/ }
    },
    {
        id: 5,
        title: "Image Insertion",
        difficulty: "Easy",
        category: "Media",
        description: "Insert an image with src 'cat.jpg' and alt text 'A cute cat'.",
        initialCode: "",
        validation: { type: "regex", value: /<img\s+src=["']cat\.jpg["']\s+alt=["']A cute cat["']\s*\/?>/ }
    },
    {
        id: 6,
        title: "Unordered List",
        difficulty: "Easy",
        category: "Lists",
        description: "Create an unordered list (ul) with three items: 'Apple', 'Banana', 'Cherry'.",
        initialCode: "",
        validation: { type: "includes", value: ["<ul>", "<li>Apple</li>", "<li>Banana</li>", "<li>Cherry</li>", "</ul>"] }
    },
    {
        id: 7,
        title: "Input Field",
        difficulty: "Easy",
        category: "Forms",
        description: "Create a text input field with a placeholder 'Enter your name'.",
        initialCode: "",
        validation: { type: "regex", value: /<input\s+type=["']text["']\s+placeholder=["']Enter your name["']\s*\/?>/ }
    },
    {
        id: 8,
        title: "Line Break",
        difficulty: "Easy",
        category: "Text",
        description: "Add a line break (br) between 'Hello' and 'World'.",
        initialCode: "Hello World",
        validation: { type: "regex", value: /Hello\s*<br\s*\/?>\s*World/ }
    },
    {
        id: 9,
        title: "Horizontal Rule",
        difficulty: "Easy",
        category: "Structure",
        description: "Add a horizontal rule (hr) to separate content.",
        initialCode: "",
        validation: { type: "includes", value: ["<hr"] }
    },
    {
        id: 10,
        title: "Button Click",
        difficulty: "Easy",
        category: "Interactive",
        description: "Create a button with the text 'Submit'.",
        initialCode: "",
        validation: { type: "includes", value: ["<button>", "Submit", "</button>"] }
    },
    {
        id: 21,
        title: "Italic Text",
        difficulty: "Easy",
        category: "Text",
        description: "Make the word 'Fancy' italic using the i tag.",
        initialCode: "<p>This is Fancy text.</p>",
        validation: { type: "includes", value: ["<i>Fancy</i>"] }
    },
    {
        id: 22,
        title: "Underlined Text",
        difficulty: "Easy",
        category: "Text",
        description: "Underline the word 'Underlined' using the u tag.",
        initialCode: "<p>This is Underlined text.</p>",
        validation: { type: "includes", value: ["<u>Underlined</u>"] }
    },
    {
        id: 23,
        title: "Small Text",
        difficulty: "Easy",
        category: "Text",
        description: "Make the copyright text small using the small tag.",
        initialCode: "<p>Copyright 2023</p>",
        validation: { type: "includes", value: ["<small>Copyright 2023</small>"] }
    },
    {
        id: 24,
        title: "Ordered List",
        difficulty: "Easy",
        category: "Lists",
        description: "Create an ordered list (ol) with two items: 'First', 'Second'.",
        initialCode: "",
        validation: { type: "includes", value: ["<ol>", "<li>First</li>", "<li>Second</li>", "</ol>"] }
    },
    {
        id: 25,
        title: "Password Input",
        difficulty: "Easy",
        category: "Forms",
        description: "Create a password input field.",
        initialCode: "",
        validation: { type: "regex", value: /<input\s+type=["']password["']\s*\/?>/ }
    },
    {
        id: 26,
        title: "Radio Button",
        difficulty: "Easy",
        category: "Forms",
        description: "Create a radio button with name 'gender' and value 'male'.",
        initialCode: "",
        validation: { type: "regex", value: /<input\s+type=["']radio["']\s+name=["']gender["']\s+value=["']male["']\s*\/?>/ }
    },
    {
        id: 27,
        title: "Main Content",
        difficulty: "Easy",
        category: "Structure",
        description: "Wrap the content in a main tag.",
        initialCode: "<h1>Welcome</h1><p>Content</p>",
        validation: { type: "includes", value: ["<main>", "<h1>Welcome</h1>", "<p>Content</p>", "</main>"] }
    },
    {
        id: 28,
        title: "Article Tag",
        difficulty: "Easy",
        category: "Structure",
        description: "Create an article tag with a heading 'News'.",
        initialCode: "",
        validation: { type: "includes", value: ["<article>", "<h2>News</h2>", "</article>"] }
    },
    {
        id: 29,
        title: "Section Tag",
        difficulty: "Easy",
        category: "Structure",
        description: "Create a section tag.",
        initialCode: "",
        validation: { type: "includes", value: ["<section>", "</section>"] }
    },
    {
        id: 30,
        title: "Audio Player",
        difficulty: "Easy",
        category: "Media",
        description: "Create an audio tag with controls.",
        initialCode: "",
        validation: { type: "includes", value: ["<audio controls>", "</audio>"] }
    },

    // MEDIUM PROBLEMS
    {
        id: 11,
        title: "Simple Table",
        difficulty: "Medium",
        category: "Tables",
        description: "Create a table with one row containing two headers: 'Name' and 'Age'.",
        initialCode: "",
        validation: { type: "includes", value: ["<table>", "<tr>", "<th>Name</th>", "<th>Age</th>", "</tr>", "</table>"] }
    },
    {
        id: 12,
        title: "Form Submission",
        difficulty: "Medium",
        category: "Forms",
        description: "Create a form that submits to '/login' using the POST method.",
        initialCode: "",
        validation: { type: "regex", value: /<form\s+action=["']\/login["']\s+method=["']POST["']\s*>/ }
    },
    {
        id: 13,
        title: "Div Container",
        difficulty: "Medium",
        category: "Structure",
        description: "Create a div with the class 'container' containing a paragraph 'Inside div'.",
        initialCode: "",
        validation: { type: "regex", value: /<div\s+class=["']container["']\s*>\s*<p>Inside div<\/p>\s*<\/div>/ }
    },
    {
        id: 14,
        title: "Internal Link",
        difficulty: "Medium",
        category: "Links",
        description: "Create an anchor link that jumps to the element with id 'footer'. Text should be 'Go to Bottom'.",
        initialCode: "",
        validation: { type: "regex", value: /<a\s+href=["']#footer["']\s*>Go to Bottom<\/a>/ }
    },
    {
        id: 15,
        title: "Checkbox Input",
        difficulty: "Medium",
        category: "Forms",
        description: "Create a checkbox input with the id 'agree' and a label 'I agree' associated with it.",
        initialCode: "",
        validation: { type: "regex", value: /<input\s+type=["']checkbox["']\s+id=["']agree["']\s*\/?>\s*<label\s+for=["']agree["']\s*>I agree<\/label>/ }
    },
    {
        id: 31,
        title: "Table Row",
        difficulty: "Medium",
        category: "Tables",
        description: "Create a table row (tr) with two data cells (td) containing 'A' and 'B'.",
        initialCode: "",
        validation: { type: "includes", value: ["<tr>", "<td>A</td>", "<td>B</td>", "</tr>"] }
    },
    {
        id: 32,
        title: "Textarea",
        difficulty: "Medium",
        category: "Forms",
        description: "Create a textarea with 4 rows and 50 columns.",
        initialCode: "",
        validation: { type: "regex", value: /<textarea\s+rows=["']4["']\s+cols=["']50["']\s*><\/textarea>/ }
    },
    {
        id: 33,
        title: "Labelled Input",
        difficulty: "Medium",
        category: "Forms",
        description: "Create a label for 'email' and an input with id 'email'.",
        initialCode: "",
        validation: { type: "regex", value: /<label\s+for=["']email["']\s*>.*<\/label>\s*<input\s+id=["']email["']\s*\/?>/ }
    },
    {
        id: 34,
        title: "New Tab Link",
        difficulty: "Medium",
        category: "Links",
        description: "Create a link to 'https://example.com' that opens in a new tab.",
        initialCode: "",
        validation: { type: "regex", value: /<a\s+href=["']https:\/\/example\.com["']\s+target=["']_blank["']\s*>/ }
    },
    {
        id: 35,
        title: "Mailto Link",
        difficulty: "Medium",
        category: "Links",
        description: "Create a link to send an email to 'info@example.com'.",
        initialCode: "",
        validation: { type: "regex", value: /<a\s+href=["']mailto:info@example\.com["']\s*>/ }
    },
    {
        id: 36,
        title: "Picture Tag",
        difficulty: "Medium",
        category: "Media",
        description: "Create a picture tag with an img tag inside.",
        initialCode: "",
        validation: { type: "includes", value: ["<picture>", "<img", "</picture>"] }
    },
    {
        id: 37,
        title: "Details Widget",
        difficulty: "Medium",
        category: "Interactive",
        description: "Create a details tag with a summary 'More Info'.",
        initialCode: "",
        validation: { type: "includes", value: ["<details>", "<summary>More Info</summary>", "</details>"] }
    },
    {
        id: 38,
        title: "Aside Content",
        difficulty: "Medium",
        category: "Structure",
        description: "Create an aside tag with a paragraph 'Sidebar'.",
        initialCode: "",
        validation: { type: "includes", value: ["<aside>", "<p>Sidebar</p>", "</aside>"] }
    },
    {
        id: 39,
        title: "Navigation",
        difficulty: "Medium",
        category: "Structure",
        description: "Create a nav tag with a link 'Home'.",
        initialCode: "",
        validation: { type: "includes", value: ["<nav>", "<a", "Home", "</a>", "</nav>"] }
    },
    {
        id: 40,
        title: "Definition List",
        difficulty: "Medium",
        category: "Lists",
        description: "Create a definition list (dl) with one term (dt) and description (dd).",
        initialCode: "",
        validation: { type: "includes", value: ["<dl>", "<dt>", "<dd>", "</dl>"] }
    },

    // HARD PROBLEMS
    {
        id: 16,
        title: "Complex Table",
        difficulty: "Hard",
        category: "Tables",
        description: "Create a table where the first cell spans 2 columns (colspan). Row 1: 'Header' (spans 2). Row 2: 'A', 'B'.",
        initialCode: "",
        validation: { type: "includes", value: ["colspan=\"2\"", "Header", "<td>A</td>", "<td>B</td>"] }
    },
    {
        id: 17,
        title: "Semantic Layout",
        difficulty: "Hard",
        category: "Structure",
        description: "Structure a page using semantic tags: header, nav, main, footer.",
        initialCode: "",
        validation: { type: "includes", value: ["<header>", "<nav>", "<main>", "<footer>"] }
    },
    {
        id: 18,
        title: "Video Embed",
        difficulty: "Hard",
        category: "Media",
        description: "Embed a video 'movie.mp4' with controls and width 320.",
        initialCode: "",
        validation: { type: "regex", value: /<video\s+.*src=["']movie\.mp4["'].*controls.*width=["']320["'].*>|<video\s+.*width=["']320["'].*controls.*src=["']movie\.mp4["'].*>/ }
    },
    {
        id: 19,
        title: "Select Dropdown",
        difficulty: "Hard",
        category: "Forms",
        description: "Create a dropdown (select) with name 'cars' and options 'Volvo', 'Saab'. 'Volvo' should be selected by default.",
        initialCode: "",
        validation: { type: "includes", value: ["<select name=\"cars\">", "<option value=\"Volvo\" selected>Volvo</option>", "<option value=\"Saab\">Saab</option>"] }
    },
    {
        id: 20,
        title: "Meta Tags",
        difficulty: "Hard",
        category: "Meta",
        description: "Add a meta tag for viewport settings to make the page responsive.",
        initialCode: "<head>\n</head>",
        validation: { type: "regex", value: /<meta\s+name=["']viewport["']\s+content=["']width=device-width,\s*initial-scale=1\.0["']\s*\/?>/ }
    },
    {
        id: 41,
        title: "Datalist",
        difficulty: "Hard",
        category: "Forms",
        description: "Create an input linked to a datalist with id 'browsers'.",
        initialCode: "",
        validation: { type: "regex", value: /<input\s+list=["']browsers["']\s*\/?>\s*<datalist\s+id=["']browsers["']\s*>/ }
    },
    {
        id: 42,
        title: "Optgroup",
        difficulty: "Hard",
        category: "Forms",
        description: "Create a select with an optgroup labeled 'Cars'.",
        initialCode: "",
        validation: { type: "includes", value: ["<select>", "<optgroup label=\"Cars\">", "</optgroup>", "</select>"] }
    },
    {
        id: 43,
        title: "Fieldset Legend",
        difficulty: "Hard",
        category: "Forms",
        description: "Group form data with a fieldset and a legend 'Personal Info'.",
        initialCode: "",
        validation: { type: "includes", value: ["<fieldset>", "<legend>Personal Info</legend>", "</fieldset>"] }
    },
    {
        id: 44,
        title: "Table Structure",
        difficulty: "Hard",
        category: "Tables",
        description: "Create a table with thead, tbody, and tfoot.",
        initialCode: "",
        validation: { type: "includes", value: ["<table>", "<thead>", "<tbody>", "<tfoot>", "</table>"] }
    },
    {
        id: 45,
        title: "Table Caption",
        difficulty: "Hard",
        category: "Tables",
        description: "Add a caption 'Monthly Savings' to a table.",
        initialCode: "<table></table>",
        validation: { type: "includes", value: ["<table>", "<caption>Monthly Savings</caption>", "</table>"] }
    },
    {
        id: 46,
        title: "Charset Meta",
        difficulty: "Hard",
        category: "Meta",
        description: "Define the character set as UTF-8.",
        initialCode: "<head></head>",
        validation: { type: "regex", value: /<meta\s+charset=["']UTF-8["']\s*\/?>/ }
    },
    {
        id: 47,
        title: "Description Meta",
        difficulty: "Hard",
        category: "Meta",
        description: "Add a meta description 'Free Web Tutorials'.",
        initialCode: "<head></head>",
        validation: { type: "regex", value: /<meta\s+name=["']description["']\s+content=["']Free Web Tutorials["']\s*\/?>/ }
    },
    {
        id: 48,
        title: "Dialog Modal",
        difficulty: "Hard",
        category: "Interactive",
        description: "Create an open dialog tag with text 'Hello'.",
        initialCode: "",
        validation: { type: "includes", value: ["<dialog open>", "Hello", "</dialog>"] }
    },
    {
        id: 49,
        title: "Class Attribute",
        difficulty: "Hard",
        category: "Global",
        description: "Create a p tag with class 'intro'.",
        initialCode: "",
        validation: { type: "regex", value: /<p\s+class=["']intro["']\s*>/ }
    },
    {
        id: 50,
        title: "ID Attribute",
        difficulty: "Hard",
        category: "Global",
        description: "Create a h1 tag with id 'main-title'.",
        initialCode: "",
        validation: { type: "regex", value: /<h1\s+id=["']main-title["']\s*>/ }
    }
];
