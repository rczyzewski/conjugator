---
title: Interactive Book Creation
author: John Smith
level: A1
file: book_tutorial.md
description: | 
    This is an example, how to create an interactive books, at the 
    same time it is a living example. It shows how to do basic text formating,
    add images, youtube videos and links. Then it foucuses on creating a different
    types of exercises. In the header you can see self explaining example
    "metadata" about the book. 
category: 
    - book creation
    - interactive book
tags:
  - teachers
  - book

---


## Basic text formating

This is a paragraph. Paragraph might have *bold* text as well as a `higlighted` parts. 
It might extends on manny, manny lines and text might be **bold** there.

```
Simillar concept to *paragraph* is a "panel". That is defined withing 
``` such sequence. Within this "panel"  **bold**  or `higlighted` text 
markup is not respected.
```

> Simillar to "panel" you might use "quote".
> Within `quote` both highlighted text and **bold** text is respected.
>

## Images, Links, and YouTube Embeds

This section explains how to include images, links, and YouTube videos in the document using standard Markdown and custom directives.

### Images

Images are included using standard Markdown syntax:

![cat](https://source.roboflow.com/3HSoch3gd1RER6UGp21z3BLxMt13/0YNNUrBFXhnHHhQllJ6n/original.jpg)

The text inside [] is the alternative text. The URL inside () points to the image source.

### Links

Links are also written using standard Markdown:

[La Vanguardia](https://www.lavanguardia.com/)


The text inside [] is the link label.The URL inside () is the destination.

### YouTube Embeds

YouTube videos can be embedded using the custom :::youtube directive.

:::youtube[Text]{#dZHykzPzutw width=560 height=315}
:::

Text is the accessible label or description.
The value after # is the YouTube video ID.

Optional parameters:
width and height define the iframe size.
start defines the start time in seconds.

##  Working with lists

* In the book, you might use list, that contains one or more pargraph
   
  For example this one
*  Such a list element might contain a quote
   > here is a quote
* Each element in a list might use `highlight` or **bold** text
* List might even contain other lists
    * embeded list element 1
    * embeded list element 2

If list contains less then 10 elements, you might want to consider it as ordered list:
1. element 1
2. element 2
    1. inner element
    2. inner element
3. element 3
    * unordered inner element 1
    * unordered inner element 2

## Working with quotes

Simillary as list might contain embeded elements.

> Quote might contain many paragraphs and also might contain other quotes
>
>  > This is example of embeded quote
>  > that has a few lines. It can be done, but looks strange, right? 
>  ```
>  Section with the "panel" is also permited in the 
> . ```
>  * element 1
>  * element 2 



## Working with Tables.

| header1 | header2 |
| --| --|
| cell 1 |  That line cintaining `\| --\| --\|` is *important*|
| Text must fit into a single line | cell 2 |


## Working with exercises - fill missing words



:::exercise

Lorem {ipsum} dolor sit amet, consectetur adipiscing elit. Morbi convallis tellus vitae mi bibendum, sit amet pharetra tellus {condimentum}. In ac semper lectus. Duis a aliquam purus. Praesent malesuada tincidunt enim eget auctor. Maecenas blandit hendrerit leo, in mattis orci fringilla vitae. {Aliquam} auctor suscipit congue. Sed vestibulum eleifend laoreet. {Curabitur} tellus sem, tristique vitae orci nec, mollis hendrerit orci. Nulla placerat eget arcu a accumsan. In suscipit arcu lacus, quis laoreet neque vehicula quis. In mauris sapien, bibendum sit amet elit sit amet, blandit maximus tellus. Maecenas risus felis, venenatis eu ultricies vel, eleifend ut elit. {Proin} ut luctus metus.

:::


:::exercise
Fill missing words, might contain lists, tables, and each element might be marked with `{}`
For example:

|word | definition|
|-|-|
|{year} | the time taken by the earth to make one revolution around the sun. |
|{day} | 24 hours |
:::


:::conjugation[Instructions for the exercise]
```yaml
tenses: 
    - indicativo.presente
verbs:
    - recordar
    - visitar
    - oler
```
:::


::::verify
- [x] This is how you can create an exerciese that is "true".
- [ ] This is not true(the X is missing between `[ ]`)
::::



