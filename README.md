# less-postcss-autocompile package

Auto compile LESS file on save and process the CSS further with [PostCSS](https://github.com/postcss/postcss) plugins.

Currently supports these PostCSS plugins:
 * [autoprefixer](https://github.com/postcss/autoprefixer)
 * [oldie](https://github.com/jonathantneal/oldie)
 * [cssnano](https://github.com/ben-eb/cssnano)

---

Add the parameters on the first line of the LESS file.

| Parameter     | Type           | Description                 |
| :------------ | :------------- | :-------------------------- |
| out           | string         | Path of CSS file to create  |
| sourcemap     | boolean        | Create sourcemap file       |
| compress      | boolean        | Compress CSS file           |
| main          | string         | Path to your main LESS file to be compiled. Separate multiple files with "&#124;" |
| autoprefixer  | boolean&#124;string | Boolean value uses default settings. String value is passed as [browserslist](https://github.com/ai/browserslist#queries) to the autoprefixer-plugin. Separate multiple entires with a ";" character.
| oldie         | boolean        | Oldie makes a separate IE8 compatible version of the CSS file (removes mediaqueries etc). |

## Example
`styles/main.less`
```scss
// out: ../dist/main.css, sourcemap: true, compress: true, autoprefixer: true

@import "../components/carousel/carousel.less";
```

`components/carousel/carousel.less`
```scss
// main: ../../main.less

.carousel {
  height: 400px;
}
```
