// limits text length with charLimit arg and appends "..."
export const truncateText = (text: string, charLimit: number) => {
  if (text.length > charLimit) {
    // subtracting 3 from charLimit allows ellipsis to be in string & string be charLimit
    return text.slice(0, charLimit - 3) + '...';
  }
  return text;
};
