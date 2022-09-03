export const fromString = (value: string, defaultValue:number = 0): number => {
    const parsedValue = parseInt(value, 10);
    if (!isNaN) {
      return parsedValue;
    } else {
        return defaultValue;
    }
}