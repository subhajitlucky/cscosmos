import {
  Layout, Type, Box, Table, MousePointer, Image, Link as LinkIcon,
  Code, List, Database, Globe, Layers, Settings, Terminal, FileText, Anchor, AlignLeft, Grid
} from 'lucide-react';

export const htmlTags = [
  // SECTION: CORE CONCEPTS
  {
    id: 'box-model',
    tag: 'Box Model',
    category: 'Core Concept',
    description: 'How elements are laid out.',
    icon: Box,
    explanation: "The CSS Box Model is essentially a box that wraps around every HTML element. It consists of: margins, borders, padding, and the actual content. Understanding the box model is crucial for controlling layout and spacing.",
    exampleCode: `<div class="box">
  I am a box!
</div>

<style>
.box {
  width: 200px;
  padding: 20px;
  border: 5px solid green;
  margin: 20px;
  background: lightgray;
}
</style>`
  },
  {
    id: 'semantics',
    tag: 'Semantics',
    category: 'Core Concept',
    description: 'Meaning over presentation.',
    icon: FileText,
    explanation: "Semantic HTML means using tags that convey the *meaning* of the content, rather than just its appearance. For example, using `<article>` for a blog post instead of `<div>`. This improves accessibility (screen readers) and SEO (search engines).",
    exampleCode: `<!-- Bad (Non-semantic) -->
<div class="header">Title</div>
<div class="nav">Menu</div>

<!-- Good (Semantic) -->
<header><h1>Title</h1></header>
<nav>Menu</nav>`
  },
  {
    id: 'accessibility',
    tag: 'Accessibility',
    category: 'Core Concept',
    level: 'Concept',
    description: 'Web for everyone.',
    icon: MousePointer,
    explanation: "Web Accessibility (a11y) means designing and developing websites so that people with disabilities can use them. In HTML, this means using semantic tags, providing `alt` text for images, and ensuring forms have labels.",
    exampleCode: `<!-- Accessible Image -->
<img src="chart.png" alt="Sales chart showing 20% growth">

<!-- Accessible Form -->
<label for="email">Email:</label>
<input type="email" id="email" name="email">`
  },
  // SECTION: DOCUMENT STRUCTURE
  {
    id: 'html',
    tag: '<html>',
    category: 'Structure',
    level: '1. Foundation',
    description: 'The root element of an HTML page.',
    icon: Globe,
    explanation: "The `<html>` element is the top-level element of an HTML document, often referred to as the root element. All other elements must be descendants of this element. It tells the browser that this is an HTML document. You should always include the `lang` attribute inside the `<html>` tag to declare the language of the Web page, which is crucial for accessibility and search engines.",
    exampleCode: `<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Page Title</title>
  </head>
  <body>
    <h1>Hello World</h1>
  </body>
</html>`
  },
  {
    id: 'head',
    tag: '<head>',
    category: 'Structure',
    level: '1. Foundation',
    description: 'Contains metadata and settings.',
    icon: Settings,
    explanation: "The `<head>` element is a container for metadata (data about data) and is placed between the `<html>` tag and the `<body>` tag. Metadata is not displayed on the page itself but defines important settings like the document's title, character set, styles, scripts, and other meta information used by browsers and search engines.",
    exampleCode: `<head>
  <title>My Title</title>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="styles.css">
</head>`
  },
  {
    id: 'title',
    tag: '<title>',
    category: 'Structure',
    level: '1. Foundation',
    description: 'Defines the document title.',
    icon: Type,
    explanation: "The `<title>` tag defines the title of the document. The title must be text-only, and it is shown in the browser's title bar or in the page's tab. It is crucial for SEO and usability.",
    exampleCode: `<head>
  <title>My Awesome Website</title>
</head>`
  },
  {
    id: 'body',
    tag: '<body>',
    category: 'Structure',
    level: '1. Foundation',
    description: 'Contains the visible page content.',
    icon: Layout,
    explanation: "The `<body>` element contains all the contents of an HTML document, such as headings, paragraphs, images, hyperlinks, tables, lists, etc. There can be only one `<body>` element in an HTML document. This is where you put everything you want the user to actually see.",
    exampleCode: `<body>
  <h1>This is a heading</h1>
  <p>This is a paragraph.</p>
</body>`
  },
  {
    id: 'div',
    tag: '<div>',
    category: 'Structure',
    level: '3. Layout',
    description: 'A generic container for grouping content.',
    icon: Box,
    explanation: "The `<div>` tag defines a division or a section in an HTML document. It is the most common container used in web development. By itself, it has no effect on the content or layout. However, when styled with CSS, it becomes a powerful tool for creating layouts, grouping elements, and applying styles to sections of content.",
    realWorld: {
      app: "Instagram",
      feature: "Post Container",
      description: "Every single post card on your feed is wrapped in a <div>. It holds the header, the image, and the comments together.",
      color: "from-pink-500 via-red-500 to-yellow-500"
    },
    exampleCode: `<div style="background-color: #333; color: white; padding: 20px;">
  <h2>I am a Div</h2>
  <p>I group content together.</p>
</div>`
  },
  {
    id: 'span',
    tag: '<span>',
    category: 'Structure',
    level: '3. Layout',
    description: 'A generic inline container for text.',
    icon: Type,
    explanation: "The `<span>` tag is an inline container used to mark up a part of a text, or a part of a document. Unlike `<div>`, which is a block-level element, `<span>` does not start on a new line. It is useful for styling a specific section of text within a paragraph without breaking the flow of content.",
    realWorld: {
      app: "Twitter / X",
      feature: "Character Count",
      description: "The little number showing how many characters you have left? That's likely a <span> styled to turn red when you're close to the limit.",
      color: "from-blue-400 to-blue-600"
    },
    exampleCode: `<p>My mother has <span style="color:blue; font-weight:bold;">blue</span> eyes.</p>`
  },

  // SECTION: SEMANTIC HTML
  {
    id: 'header', tag: '<header>', category: 'Semantic', level: '3. Layout', description: 'Introductory content or navigation.', icon: Layout, explanation: 'The `<header>` element represents a container for introductory content or a set of navigational links. It typically contains a logo, a search form, the author name, and other introductory elements. You can have multiple `<header>` elements in one document (e.g., one for the page, one for an article).',
    realWorld: {
      app: "YouTube",
      feature: "Top Bar",
      description: "The bar at the top with the Search, Create, and Profile buttons is the <header> of the page.",
      color: "from-red-600 to-red-800"
    },
    exampleCode: '<header><h1>Page Title</h1></header>'
  },
  {
    id: 'nav', tag: '<nav>', category: 'Semantic', level: '3. Layout', description: 'Navigation links.', icon: Layout, explanation: 'The `<nav>` element defines a set of navigation links. Notice that not all links of a document should be inside a `<nav>` element. The `<nav>` element is intended only for major block of navigation links, such as the main menu or a table of contents.',
    realWorld: {
      app: "Spotify",
      feature: "Sidebar Menu",
      description: "The sidebar with 'Home', 'Search', and 'Your Library' is a classic <nav> element.",
      color: "from-green-400 to-green-600"
    },
    exampleCode: '<nav><a href="/home">Home</a> | <a href="/about">About</a></nav>'
  },
  { id: 'main', tag: '<main>', category: 'Semantic', level: '3. Layout', description: 'The dominant content of the body.', icon: Layout, explanation: 'The `<main>` tag specifies the main content of a document. The content inside the `<main>` element should be unique to the document. It should not contain content that is repeated across documents such as sidebars, navigation links, copyright information, site logos, and search forms.', exampleCode: '<main><h1>Main Content</h1><p>Unique content...</p></main>' },
  { id: 'footer', tag: '<footer>', category: 'Semantic', level: '3. Layout', description: 'Footer for a document or section.', icon: Layout, explanation: 'The `<footer>` element defines a footer for a document or section. A footer typically contains the author of the document, copyright information, links to terms of use, contact information, etc. You can have several `<footer>` elements in one document.', exampleCode: '<footer><p>&copy; 2023 Company Name</p></footer>' },
  { id: 'article', tag: '<article>', category: 'Semantic', level: '3. Layout', description: 'Self-contained composition.', icon: FileText, explanation: 'The `<article>` element specifies independent, self-contained content. An article should make sense on its own, and it should be possible to distribute it independently from the rest of the web site. Examples include forum posts, blog posts, news stories, and comments.', exampleCode: '<article><h2>Blog Post Title</h2><p>Content of the post...</p></article>' },
  { id: 'section', tag: '<section>', category: 'Semantic', level: '3. Layout', description: 'Thematic grouping of content.', icon: Layers, explanation: 'The `<section>` element defines a section in a document. According to W3C\'s HTML documentation: "A section is a thematic grouping of content, typically with a heading." Examples of use include chapters, introduction, news items, and contact information.', exampleCode: '<section><h2>Section Title</h2><p>Content...</p></section>' },
  { id: 'aside', tag: '<aside>', category: 'Semantic', level: '3. Layout', description: 'Content aside from the content.', icon: AlignLeft, explanation: 'The `<aside>` element defines some content aside from the content it is placed in (like a sidebar). The aside content should be indirectly related to the surrounding content. It is often used for sidebars, call-out boxes, and advertising.', exampleCode: '<aside><h4>Related Posts</h4><ul><li>Post 1</li></ul></aside>' },
  { id: 'details', tag: '<details>', category: 'Semantic', level: '6. Interactive', description: 'Disclosure widget.', icon: List, explanation: 'The `<details>` tag specifies additional details that the user can open and close on demand. The `<details>` tag is often used to create an interactive widget that the user can open and close. By default, the widget is closed. When open, it expands, and displays the content within.', exampleCode: '<details><summary>Click to show more</summary><p>Here is the hidden content!</p></details>' },
  { id: 'summary', tag: '<summary>', category: 'Semantic', level: '6. Interactive', description: 'Summary for details.', icon: List, explanation: 'The `<summary>` tag defines a visible heading for the `<details>` element. The heading can be clicked to view/hide the details. The first child element of the `<details>` element should be a `<summary>` element.', exampleCode: '<details><summary>FAQ Question</summary><p>Answer...</p></details>' },

  // SECTION: TEXT CONTENT
  {
    id: 'h1',
    tag: '<h1>',
    category: 'Text',
    level: '2. Content',
    description: 'The most important heading.',
    icon: Type,
    explanation: "The `<h1>` to `<h6>` tags are used to define HTML headings. `<h1>` defines the most important heading. `<h6>` defines the least important heading. Search engines use the headings to index the structure and content of your web pages. Users often skim a page by its headings. It is important to use headings to show the document structure.",
    exampleCode: `<h1>Main Title</h1>
<h2>Subheading</h2>
<p>Some text content...</p>`
  },
  { id: 'p', tag: '<p>', category: 'Text', level: '2. Content', description: 'A paragraph of text.', icon: Type, explanation: "The `<p>` tag defines a paragraph. Browsers automatically add a single blank line before and after each `<p>` element. This is the most basic building block of text content on the web.", exampleCode: `<p>This is a paragraph.</p>\n<p>This is another paragraph.</p>` },
  { id: 'br', tag: '<br>', category: 'Text', level: '2. Content', description: 'A single line break.', icon: Type, explanation: "The `<br>` tag inserts a single line break. It is useful for writing addresses or poems where the division of lines is significant. The `<br>` tag is an empty tag which means that it has no end tag.", exampleCode: 'Line 1<br>Line 2<br>Line 3' },
  { id: 'hr', tag: '<hr>', category: 'Text', level: '2. Content', description: 'A thematic break (horizontal rule).', icon: Type, explanation: "The `<hr>` tag defines a thematic break in an HTML page (e.g. a shift of topic). The `<hr>` element is most often displayed as a horizontal rule that is used to separate content (or define a change) in an HTML page.", exampleCode: '<p>Section 1</p><hr><p>Section 2</p>' },
  { id: 'strong', tag: '<strong>', category: 'Text', level: '2. Content', description: 'Important text (usually bold).', icon: Type, explanation: "The `<strong>` tag is used to define text with strong importance. The content inside is typically displayed in bold. Use `<strong>` when the text is important, and `<b>` when you just want bold text without semantic importance.", exampleCode: 'This is <strong>very important</strong> text.' },
  { id: 'em', tag: '<em>', category: 'Text', level: '2. Content', description: 'Emphasized text (usually italic).', icon: Type, explanation: "The `<em>` tag is used to define emphasized text. The content inside is typically displayed in italic. A screen reader will pronounce the words in `<em>` with an emphasis, using verbal stress.", exampleCode: 'I <em>really</em> mean it.' },
  { id: 'blockquote', tag: '<blockquote>', category: 'Text', level: '2. Content', description: 'A section that is quoted from another source.', icon: Type, explanation: "The `blockquote` tag specifies a section that is quoted from another source. Browsers usually indent `blockquote` elements.", exampleCode: '<blockquote cite="http://www.worldwildlife.org/who/index.html">\nFor 50 years, WWF has been protecting the future of nature.\n</blockquote>' },
  { id: 'code', tag: '<code>', category: 'Text', level: '2. Content', description: 'Inline code.', icon: Code, explanation: "The `<code>` tag is used to define a piece of computer code. The content inside is displayed in the browser's default monospace font.", exampleCode: 'The <code>console.log()</code> method writes a message to the console.' },
  { id: 'pre', tag: '<pre>', category: 'Text', level: '2. Content', description: 'Preformatted text.', icon: Code, explanation: "The `<pre>` tag defines preformatted text. Text in a `<pre>` element is displayed in a fixed-width font, and the text preserves both spaces and line breaks. The text will be displayed exactly as written in the HTML source code.", exampleCode: '<pre>\n  Text in a pre element\n  is displayed in a fixed-width\n  font, and it preserves\n  both      spaces and\n  line breaks\n</pre>' },
  { id: 'b', tag: '<b>', category: 'Text', level: '2. Content', description: 'Bold text (stylistic).', icon: Type, explanation: "The `<b>` tag specifies bold text without any extra importance. It is purely stylistic. For important text, use `<strong>` instead.", exampleCode: 'This text is <b>bold</b>.' },
  { id: 'i', tag: '<i>', category: 'Text', level: '2. Content', description: 'Italic text (stylistic).', icon: Type, explanation: "The `<i>` tag defines a part of text in an alternate voice or mood. The content inside is typically displayed in italic. It is often used for technical terms, phrases from another language, or thoughts.", exampleCode: 'The <i>Titanic</i> sailed in 1912.' },
  { id: 'u', tag: '<u>', category: 'Text', level: '2. Content', description: 'Underlined text.', icon: Type, explanation: "The `<u>` tag represents some text that is unarticulated and styled differently from normal text, such as misspelled words or proper names in Chinese text. The content inside is typically displayed with an underline.", exampleCode: 'This is <u>underlined</u> text.' },
  { id: 'small', tag: '<small>', category: 'Text', level: '2. Content', description: 'Smaller text.', icon: Type, explanation: "The `<small>` tag defines smaller text (like copyright and other side-comments).", exampleCode: '<p>Copyright <small>&copy; 2023</small></p>' },
  { id: 'time', tag: '<time>', category: 'Text', level: '2. Content', description: 'A specific time or date.', icon: Type, explanation: "The `<time>` tag defines a specific time (or datetime). This element can include the `datetime` attribute to translate the time into a machine-readable format so that browsers can offer to add date reminders through the user's calendar, and search engines can produce smarter search results.", exampleCode: '<p>Open from <time>10:00</time> to <time>21:00</time>.</p>' },

  // SECTION: LISTS
  { id: 'ul', tag: '<ul>', category: 'Lists', level: '4. Lists & Tables', description: 'An unordered list (bullet points).', icon: List, explanation: "The `<ul>` tag defines an unordered (bulleted) list. Use the `<ul>` tag together with the `<li>` tag to create unordered lists.", exampleCode: `<ul><li>Item 1</li><li>Item 2</li></ul>` },
  { id: 'ol', tag: '<ol>', category: 'Lists', level: '4. Lists & Tables', description: 'An ordered list (numbered).', icon: List, explanation: "The `<ol>` tag defines an ordered list. An ordered list can be numerical or alphabetical. Use the `<ol>` tag together with the `<li>` tag to create ordered lists.", exampleCode: `<ol><li>First</li><li>Second</li></ol>` },
  { id: 'li', tag: '<li>', category: 'Lists', level: '4. Lists & Tables', description: 'A list item.', icon: List, explanation: "The `<li>` tag defines a list item. The `<li>` tag is used inside ordered lists (`<ol>`), unordered lists (`<ul>`), and in menu lists (`<menu>`).", exampleCode: `<ul><li>Item</li></ul>` },

  // SECTION: LINKS & MEDIA
  { id: 'a', tag: '<a>', category: 'Media', level: '5. Media', description: 'A hyperlink to other pages.', icon: LinkIcon, explanation: "The `<a>` tag defines a hyperlink, which is used to link from one page to another. The most important attribute of the `<a>` element is the `href` attribute, which indicates the link's destination. By default, links appear underlined and blue.", exampleCode: `<a href="https://google.com">Go to Google</a>` },
  { id: 'img', tag: '<img>', category: 'Media', level: '5. Media', description: 'Embeds an image.', icon: Image, explanation: "The `<img>` tag is used to embed an image in an HTML page. Images are not inserted into a web page; they are linked to web pages. The `<img>` tag creates a holding space for the referenced image. The `src` attribute specifies the path to the image.", exampleCode: `<img src="https://via.placeholder.com/150" alt="Placeholder Image" />` },
  { id: 'video', tag: '<video>', category: 'Media', level: '5. Media', description: 'Embeds video content.', icon: Image, explanation: "The `<video>` tag specifies video, such as a movie clip or other video streams. Currently, there are 3 supported video formats for the `<video>` element: MP4, WebM, and Ogg.", exampleCode: `<video width="320" height="240" controls>\n  <source src="movie.mp4" type="video/mp4">\n  Your browser does not support the video tag.\n</video>` },
  {
    id: 'picture', tag: '<picture>', category: 'Media', level: '5. Media', description: 'Responsive image container.', icon: Image, explanation: "The `<picture>` tag gives web developers more flexibility in specifying image resources. It allows you to define multiple `<source>` elements for different screen sizes or formats, with an `<img>` tag as a fallback.", exampleCode: `<picture>
  <source media="(min-width: 650px)" srcset="img_pink_flowers.jpg">
  <source media="(min-width: 465px)" srcset="img_white_flower.jpg">
  <img src="img_orange_flowers.jpg" alt="Flowers" style="width:auto;">
</picture>` },
  {
    id: 'source', tag: '<source>', category: 'Media', level: '5. Media', description: 'Media resource for video/audio.', icon: Image, explanation: "The `<source>` tag is used to specify multiple media resources for media elements, such as `<video>`, `<audio>`, and `<picture>`. The browser will choose the first source it supports.", exampleCode: `<audio controls>
  <source src="horse.ogg" type="audio/ogg">
  <source src="horse.mp3" type="audio/mpeg">
</audio>` },

  // SECTION: TABLES
  { id: 'table', tag: '<table>', category: 'Tables', level: '4. Lists & Tables', description: 'Defines a table.', icon: Table, explanation: "The `<table>` tag defines an HTML table. An HTML table consists of one `<table>` element and one or more `<tr>`, `<th>`, and `<td>` elements.", exampleCode: `<table border="1"><tr><td>Cell</td></tr></table>` },
  { id: 'tr', tag: '<tr>', category: 'Tables', level: '4. Lists & Tables', description: 'A row in a table.', icon: Table, explanation: "The `<tr>` tag defines a row in an HTML table. A `<tr>` element contains one or more `<th>` or `<td>` elements.", exampleCode: `<tr><td>Data</td></tr>` },
  { id: 'td', tag: '<td>', category: 'Tables', level: '4. Lists & Tables', description: 'A cell in a table.', icon: Table, explanation: "The `<td>` tag defines a standard data cell in an HTML table. The text in `<td>` elements are regular and left-aligned by default.", exampleCode: `<td>Data</td>` },
  { id: 'th', tag: '<th>', category: 'Tables', level: '4. Lists & Tables', description: 'A header cell in a table.', icon: Table, explanation: "The `<th>` tag defines a header cell in an HTML table. The text in `<th>` elements are bold and centered by default.", exampleCode: `<th>Header</th>` },
  {
    id: 'caption', tag: '<caption>', category: 'Tables', level: '4. Lists & Tables', description: 'Table caption.', icon: Table, explanation: "The `<caption>` tag defines a table caption. The `<caption>` tag must be inserted immediately after the `<table>` tag.", exampleCode: `<table>
  <caption>Monthly savings</caption>
  <tr>
    <th>Month</th>
    <th>Savings</th>
  </tr>
</table>` },

  // SECTION: FORMS
  {
    id: 'form', tag: '<form>', category: 'Forms', level: '6. Forms', description: 'A section for user input.', icon: MousePointer, explanation: "The `<form>` tag is used to create an HTML form for user input. The `<form>` element can contain one or more of the following form elements: `<input>`, `<textarea>`, `<button>`, `<select>`, `<option>`, `<optgroup>`, `<fieldset>`, `<label>`, `<output>`.",
    realWorld: {
      app: "Netflix",
      feature: "Login Box",
      description: "The entire box asking for your Email and Password is a <form>. It handles sending that data to the server.",
      color: "from-red-600 to-black"
    },
    exampleCode: `<form action="/submit">\n  <label for="fname">First name:</label><br>\n  <input type="text" id="fname" name="fname"><br>\n  <input type="submit" value="Submit">\n</form>`
  },
  {
    id: 'input', tag: '<input>', category: 'Forms', level: '6. Forms', description: 'An input field.', icon: MousePointer, explanation: "The `<input>` tag specifies an input field where the user can enter data. The `<input>` element is the most important form element. The `<input>` element can be displayed in several ways, depending on the `type` attribute.",
    realWorld: {
      app: "Google",
      feature: "Search Bar",
      description: "The most famous <input> in the world. It accepts text and sends it to find your answers.",
      color: "from-blue-500 via-green-500 to-yellow-500"
    },
    exampleCode: `<input type="text" placeholder="Enter text here">`
  },
  {
    id: 'button', tag: '<button>', category: 'Forms', level: '6. Forms', description: 'A clickable button.', icon: MousePointer, explanation: "The `<button>` tag defines a clickable button. Inside a `<button>` element you can put text (and tags like `<i>`, `<b>`, `<strong>`, `<br>`, `<img>`, etc.). That is not possible with a button created with the `<input>` element!",
    realWorld: {
      app: "Amazon",
      feature: "Buy Now",
      description: "That orange 'Buy Now' button that takes your money? It's a <button> designed to be clicked.",
      color: "from-yellow-400 to-orange-500"
    },
    exampleCode: `<button type="button" onclick="alert('Hello!')">Click Me!</button>`
  },
  { id: 'label', tag: '<label>', category: 'Forms', level: '6. Forms', description: 'A label for an input element.', icon: MousePointer, explanation: "The `<label>` tag defines a label for several form elements. The `<label>` element is useful for screen-reader users, because the screen-reader will read out loud the label when the user focus on the input element. It also helps users who have difficulty clicking on very small regions (such as radio buttons or checkboxes) - because when the user clicks the text within the `<label>` element, it toggles the control.", exampleCode: `<label for="male">Male</label>\n<input type="radio" name="gender" id="male" value="male">` },
  {
    id: 'select', tag: '<select>', category: 'Forms', level: '6. Forms', description: 'A drop-down list.', icon: MousePointer, explanation: "The `<select>` element is used to create a drop-down list. The `<option>` tags inside the `<select>` element define the available options in the list.", exampleCode: `<select name="cars" id="cars">
  <option value="volvo">Volvo</option>
  <option value="saab">Saab</option>
</select>` },
  { id: 'textarea', tag: '<textarea>', category: 'Forms', level: '6. Forms', description: 'Multiline text input.', icon: MousePointer, explanation: "The `<textarea>` tag defines a multi-line text input control. The `<textarea>` element is often used in a form, to collect user inputs like comments or reviews.", exampleCode: `<textarea name="message" rows="10" cols="30">The cat was playing in the garden.</textarea>` },
  {
    id: 'optgroup', tag: '<optgroup>', category: 'Forms', level: '6. Forms', description: 'Group related options.', icon: MousePointer, explanation: "The `<optgroup>` tag is used to group related options in a `<select>` element (drop-down list). If you have a long list of options, grouping of related options are easier to handle for a user.", exampleCode: `<select>
  <optgroup label="Swedish Cars">
    <option value="volvo">Volvo</option>
    <option value="saab">Saab</option>
  </optgroup>
</select>` },
  {
    id: 'datalist', tag: '<datalist>', category: 'Forms', level: '6. Forms', description: 'Pre-defined options for input.', icon: MousePointer, explanation: "The `<datalist>` tag specifies a list of pre-defined options for an `<input>` element. The `<datalist>` tag is used to provide an 'autocomplete' feature for `<input>` elements. Users will see a drop-down list of pre-defined options as they input data.", exampleCode: `<input list="browsers">
<datalist id="browsers">
  <option value="Edge">
  <option value="Firefox">
  <option value="Chrome">
</datalist>` },
  {
    id: 'output', tag: '<output>', category: 'Forms', level: '6. Forms', description: 'Result of a calculation.', icon: MousePointer, explanation: "The `<output>` tag represents the result of a calculation (like one performed by a script).", exampleCode: `<form oninput="x.value=parseInt(a.value)+parseInt(b.value)">
  <input type="range" id="a" value="50"> +
  <input type="number" id="b" value="50"> =
  <output name="x" for="a b"></output>
</form>` },
  { id: 'dialog', tag: '<dialog>', category: 'Interactive', level: '6. Forms', description: 'A dialog box or window.', icon: Layers, explanation: "The `<dialog>` tag defines a dialog box or subwindow. The `<dialog>` element makes it easy to create popup dialogs and modals on a web page.", exampleCode: `<dialog open>This is an open dialog window</dialog>` },
];
