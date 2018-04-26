/**
 * Get text colour depending on tint colour (white or black)
 * @param {*} colour 
 */
export function getTextColour(colour) {
  var number = colour.replace('#', '');
  // Get red green blue
  let red = parseInt(number.substr(0, 2), 16);
  let green = parseInt(number.substr(2, 2), 16);
  let blue = parseInt(number.substr(4, 2), 16);
  // White or Black
  if (red * 0.299 + green * 0.587 + blue * 0.114 > 186) return '#000000';
  else return '#ffffff'
}

function statusBarColour(colour) {
  if (getTextColour(colour) == '#000000') return 'dark';
  else return 'light';
}

export function navStyle() {
  return {
    navBarTextColor: getTextColour(global.theme[500]),
    navBarBackgroundColor: global.theme[500],
    statusBarTextColorScheme: statusBarColour(global.theme[500]),
    navBarButtonColor: getTextColour(global.theme[500]),
    statusBarColor: global.theme[700],
    screenBackgroundColor: 'white'
  }
}