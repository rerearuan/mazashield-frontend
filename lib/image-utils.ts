export const COW_IMAGES = [
  "https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1596733430284-f7437f61a1a9?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1551334787-21e6bd3ab135?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1527153351910-4ff6505d9717?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1545468241-01f144a1eb1d?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1601369344403-121545de20b8?auto=format&fit=crop&q=80&w=800"
];

export const DEFAULT_COW_IMAGE = COW_IMAGES[0];

const getDeterministicIdx = (id: number | string | undefined, listLength: number) => {
  if (!id) return Math.floor(Math.random() * listLength);
  const hash = typeof id === 'number' ? id : id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return hash % listLength;
};

export const getRandomCowImage = (id?: number | string) => {
  return COW_IMAGES[getDeterministicIdx(id, COW_IMAGES.length)];
};

export const getRandomMeatImage = (id?: number | string) => {
  return COW_IMAGES[getDeterministicIdx(id, COW_IMAGES.length)];
};
