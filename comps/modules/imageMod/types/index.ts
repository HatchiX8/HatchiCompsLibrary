export type imageMeta = {
  url: string;
  time: string;
  key: string;
};
export type Side = 'north' | 'south';
export type imageMap = {
  north: imageMeta;
  south: imageMeta;
};
