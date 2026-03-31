export function timeAgo(dateISO: string): string {
  const now = new Date();
  const date = new Date(dateISO);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return `${seconds} secs ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} mins ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hrs ago`;

  const days = Math.floor(hours / 24);
  return `${days} days ago`;
}