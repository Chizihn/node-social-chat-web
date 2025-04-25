export function cn(...classes: TemplateStringsArray | string[]) {
  return classes.filter(Boolean).join(" ");
}

export const timeAgo = (input: string | Date): string => {
  const date = input instanceof Date ? input : new Date(input);
  const now = new Date().getTime();
  const past = date.getTime();
  const seconds = Math.floor((now - past) / 1000);

  const intervals = [
    { label: "y", seconds: 31536000 },
    { label: "mo", seconds: 2592000 },
    { label: "w", seconds: 604800 },
    { label: "d", seconds: 86400 },
    { label: "h", seconds: 3600 },
    { label: "m", seconds: 60 },
    { label: "s", seconds: 1 },
  ];

  for (const { label, seconds: intervalSeconds } of intervals) {
    const count = Math.floor(seconds / intervalSeconds);
    if (count >= 1) return `${count}${label}`;
  }

  return "just now";
};
