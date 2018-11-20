import _ from 'lodash';

const getAllItems = () => {
  return [{
    id: 1,
    packageId: 1,
    dayNo: 1,
    daySeq: 1,
    attractionId: 1,
    attractionName: 'The Forbidden Palace',
    attractionImageUrl: 'media/Beijing_ForbiddenPalace.jpg',
    description: 'Day tour at The Forbidden Palace',
  },
  {
    id: 2,
    packageId: 1,
    dayNo: 2,
    daySeq: 1,
    attractionId: 2,
    attractionName: 'Tian An Men',
    attractionImageUrl: 'media/Beijing_TianAnMen.jpg',
    description: 'Day tour at Tian An Men',
  },
  {
    id: 3,
    packageId: 1,
    dayNo: 3,
    daySeq: 1,
    attractionId: 3,
    attractionName: 'Longhua Temple',
    attractionImageUrl: 'media/Shanghai_LonghuaTemple.jpg',
    description: 'Day tour at Shanghai Longhua Temple',
  },
  {
    id: 4,
    packageId: 1,
    dayNo: 4,
    daySeq: 1,
    attractionId: 4,
    attractionName: 'Yu Garden',
    attractionImageUrl: 'media/Shanghai_YuGarden.jpg',
    description: 'Day tour at the Yu Garden',
  },
  {
    id: 5,
    packageId: 2,
    dayNo: 1,
    daySeq: 1,
    attractionId: 1,
    attractionName: 'The Forbidden Palace',
    attractionImageUrl: 'media/Beijing_ForbiddenPalace.jpg',
    description: 'Day tour at The Forbidden Palace',
  },
  {
    id: 6,
    packageId: 2,
    dayNo: 2,
    daySeq: 1,
    attractionId: 2,
    attractionName: 'Tian An Men',
    attractionImageUrl: 'media/Beijing_TianAnMen.jpg',
    description: 'Day tour at Tian An Men',
  },
  {
    id: 7,
    packageId: 2,
    dayNo: 3,
    daySeq: 1,
    attractionId: 3,
    attractionName: 'Longhua Temple',
    attractionImageUrl: 'media/Shanghai_LonghuaTemple.jpg',
    description: 'Day tour at Shanghai Longhua Temple',
  },
  {
    id: 8,
    packageId: 2,
    dayNo: 3,
    daySeq: 2,
    attractionId: 4,
    attractionName: 'Yu Garden',
    attractionImageUrl: 'media/Shanghai_YuGarden.jpg',
    description: 'Day tour at the Yu Garden',
  }];
};

const getItemsByPackageId = (packageId) => {
  return _.filter(getAllItems(), {packageId: Number(packageId)});
};

export default {
  getAllItems,
  getItemsByPackageId,
};
