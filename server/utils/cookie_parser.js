const parseCookie = (name,cookie) => {
  let value = "; " + cookie;
  let parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

export default parseCookie;

// http://stackoverflow.com/questions/10730362/get-cookie-by-name
