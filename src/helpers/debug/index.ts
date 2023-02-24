export const printObjectAsGroup = (obj: object) => {
  console.group();
  for (const key in obj) {
    console.log(key, obj[key]);
  }
  console.groupEnd();
}