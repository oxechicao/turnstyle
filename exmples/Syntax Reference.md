# Markdown Syntax Reference

This document contains examples of all major markdown syntax elements.

## Table of Contents
- [Headers](#headers)
- [Text Formatting](#text-formatting)
- [Lists](#lists)
- [Links and Images](#links-and-images)
- [Code](#code)
- [Tables](#tables)
- [Blockquotes](#blockquotes)
- [Horizontal Rules](#horizontal-rules)
- [Line Breaks](#line-breaks)
- [Escape Characters](#escape-characters)
- [HTML Elements](#html-elements)
- [Task Lists](#task-lists)
- [Strikethrough](#strikethrough)
- [Footnotes](#footnotes)

## Headers

# H1 Header
## H2 Header  
### H3 Header
#### H4 Header
##### H5 Header
###### H6 Header

Alternative H1
==============

Alternative H2
--------------

## Text Formatting

**Bold text** or __bold text__

*Italic text* or _italic text_

***Bold and italic*** or ___bold and italic___

~~Strikethrough text~~

`Inline code`

==Highlighted text== (if supported)

Subscript: H~2~O (if supported)

Superscript: X^2^ (if supported)

## Lists

### Unordered Lists

- Item 1
- Item 2
  - Nested item 2.1
  - Nested item 2.2
    - Deep nested item 2.2.1
- Item 3

* Alternative bullet
+ Another alternative bullet

### Ordered Lists

1. First item
2. Second item
   1. Nested numbered item
   2. Another nested item
3. Third item

### Mixed Lists

1. First ordered item
   - Unordered sub-item
   - Another sub-item
2. Second ordered item

## Links and Images

### Links

[Inline link](https://www.example.com)

[Link with title](https://www.example.com "Example Title")

[Reference link][reference-id]

[Another reference][1]

Automatic link: <https://www.example.com>

Email link: <email@example.com>

### Images

![Alt text](https://via.placeholder.com/150x100 "Image Title")

![Reference image][image-ref]

## Code

### Inline Code

Use `console.log()` to print to the console.

### Code Blocks

```javascript
function greet(name) {
    console.log(`Hello, ${name}!`);
}

greet("World");
```

```python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(10))
```

```bash
# Shell commands
ls -la
cd /path/to/directory
git status
```

```json
{
    "name": "example",
    "version": "1.0.0",
    "dependencies": {
        "express": "^4.18.0"
    }
}
```

### Code Block without Syntax Highlighting

```
Plain text code block
No syntax highlighting
Multiple lines supported
```

Indented code block (4 spaces):

    function indentedCode() {
        return "This is indented code";
    }

## Tables

| Column 1 | Column 2 | Column 3 |
| -------- | -------- | -------- |
| Row 1    | Data 1   | Data 2   |
| Row 2    | Data 3   | Data 4   |
| Row 3    | Data 5   | Data 6   |

### Table with Alignment

| Left Aligned | Center Aligned | Right Aligned |
| :----------- | :------------: | ------------: |
| Left         |     Center     |         Right |
| Text         |      Text      |          Text |
| More         |      Data      |          Here |

### Minimal Table

| Name | Age |
| ---- | --- |
| John | 25  |
| Jane | 30  |

## Blockquotes

> This is a simple blockquote.

> This is a multi-line blockquote.
> It can span multiple lines
> and maintain formatting.

> ### Nested Elements in Blockquotes
> 
> You can use **formatting** and other elements inside blockquotes.
> 
> - Lists work too
> - Second item
> 
> ```javascript
> // Even code blocks
> console.log("Hello from blockquote");
> ```

> Blockquotes can be nested
> > This is a nested blockquote
> > > And this is deeply nested
> 
> Back to the first level

## Horizontal Rules

---

***

___

- - -

* * *

_ _ _

## Line Breaks

This line ends with two spaces  
And this is a new line.

This line ends with a backslash\
And this is also a new line.

This paragraph has a manual line break.

This is a new paragraph (separated by blank line).

## Task Lists

- [x] Completed task
- [x] Another completed task
- [ ] Incomplete task
- [ ] Another incomplete task
  - [x] Nested completed task
  - [ ] Nested incomplete task

## Strikethrough

~~This text is struck through~~

You can combine ~~strikethrough~~ with **bold** and *italic*.

## HTML Elements

You can use <em>HTML tags</em> in markdown.

<strong>Bold text using HTML</strong>

<br>Line break using HTML

<details>
<summary>Collapsible Section</summary>

This content is hidden by default and can be expanded by clicking the summary.

- You can put any markdown here
- Including lists
- **Formatted text**
- `Code snippets`

</details>

## Escape Characters

Use backslashes to escape special characters:

\*This is not italic\*

\# This is not a header

\[This is not a link\]

\`This is not code\`

## Math (KaTeX)

Inline math: $E = mc^2$

Block math:

$$
\frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$

$$
\begin{align}
f(x) &= ax^2 + bx + c \\
f'(x) &= 2ax + b \\
f''(x) &= 2a
\end{align}
$$

## Special Characters and Symbols

&copy; Copyright symbol
&trade; Trademark symbol  
&reg; Registered trademark
&larr; Left arrow
&rarr; Right arrow
&uarr; Up arrow
&darr; Down arrow

## Emojis

:smile: :heart: :thumbsup: :rocket: :fire:

😀 😃 😄 😁 😆 🤣 😂

## Definition Lists (if supported)

Apple
: A red or green fruit

Orange
: A citrus fruit

## Abbreviations (if supported)

*[HTML]: HyperText Markup Language
*[CSS]: Cascading Style Sheets

The HTML specification is maintained by the W3C.

## Footnotes

Here's a sentence with a footnote[^1].

Here's another footnote[^footnote-label].

You can also use inline footnotes^[This is an inline footnote].

[^1]: This is the first footnote.
[^footnote-label]: This is a longer footnote with multiple lines.
    
    It can contain multiple paragraphs and formatting.
    
    - Even lists
    - And other elements

---

## Reference Links

[reference-id]: https://www.example.com "Reference Link Title"
[1]: https://www.google.com
[image-ref]: https://via.placeholder.com/300x200 "Reference Image"

---

*This document demonstrates the full range of markdown syntax available in most markdown processors.*

**Note:** Some features may not be supported in all markdown processors. GitHub Flavored Markdown (GFM) supports most of these features.