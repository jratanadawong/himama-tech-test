<template>
  <div id='app'>
    <router-view />
  </div>
</template>

<style lang='scss'>
:root {
    --indigo: #6610f2;
    --pink: #e83e8c;
    --red: #cb4e4b;
    --orange: #f78f1e;
    --teal: #0f8790;
    --cyan: #acdee6;
    --white: #fff;
    --gray: #6c757d;
    --gray-dark: #343a40;
    --grey: #6c757d;
    --grey-dark: #343a40;
    --primary: #79be43;
    --secondary: #43b9c6;
    --success: #ddd;
    --info: #acdee6;
    --warning: #6a55a1;
    --danger: #cb4e4b;
    --light: #fff;
    --dark: #43b9c6;
    --blue: #43b9c6;
    --yellow: #ffc32f;
    --yellow-light: #feed7f;
    --green: #79be43;
    --yellow-dark: #d4ab2a;
    --purple: #6a55a1;
    --font-family: "Open Sans", sans-serif;
    --bg-primary: white;
    --bg-secondary: #f2f2f2;
    --entry: #9ad46e;
    --font: #333;
    --border-radius: .3rem;
    --box-shadow: 0 .5rem 1rem rgba(0,0,0,.15);
}
// Mixins
@mixin flex($direction: row, $align: center, $justify: center) {
  display: flex;
  // overflow: hidden;
  align-items: $align;
  flex-direction: $direction;
  justify-content: $justify;
}
@mixin page-view($height: 100%) {
  @include flex();
  height: $height;
  width: 100vw;
}

html, body {
    padding: 0;
    margin: 0;
    font-size: 1em;
    font-family: var(--font-family);
}
#app {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--font);
    background-color: var(--bg-secondary);
}
h1 {
    font-family: "Bree Serif";
}
p {
font-size: 2em;
text-align: center;
}
a {
    font-size: 0.8em;
}
</style>
