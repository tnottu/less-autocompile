# less-autocompile package

Auto compile LESS file on save.

Added support for PostCSS plugins.

---

Add the parameters on the first line of the LESS file.

| Parameter   | Type           | Description                 |
| :-----------| :------------- | :-------------------------- |
| out         | string         | Path of CSS file to create  |
| sourcemap   | boolean        | Create sourcemap file       |
| compress    | boolean        | Compress CSS file           |
| main        | string         | Path to your main LESS file to be compiled. Separate multiple files with "&#124;" |
| autoprefix  | boolean&#124;string | Boolean value uses default settings. String value is passed as [browserslist](https://github.com/ai/browserslist#queries) to the autoprefixer-plugin. Separate multiple entires with a ";" character.
| oldie       | true           | Oldie makes a separate IE8 compatible version of the CSS file (removes mediaqueries etc). |

## Example
`styles/main.less`
```scss
// out: ../dist/main.css, sourcemap: true, compress: true, autoprefix: true

@import "../components/carousel/carousel.less";
```

`components/carousel/carousel.less`
```scss
// main: ../../main.less

.carousel {
  height: 400px;
}
```
