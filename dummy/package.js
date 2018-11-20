import _ from 'lodash';

const getAllPackage = () => {
  return [{
    id: 1,
    name: '4 Days China Tour',
    description: 'It\'s a 4 Days China Tour. First 2 days in Beijing, then 2 days in Shanghai.',
    finePrint: 'Depart every Tuesday and Friday from 01/06/2019 to 30/09/2019. extra 500 for single traveller',
    notes: 'No surcharge for families.',
    days: 4,
    maxParticipant: 30,
    isPromoted: true,
    isActive: true,
    isExtention: false,
    images: [{
      imageUrl: 'media/Beijing_ForbiddenPalace.jpg',
      isCoverPage: true,
    },
    {
      imageUrl: 'media/Beijing_TianAnMen.jpg',
      isCoverPage: false,
    },
    {
      imageUrl: 'media/Shanghai_LonghuaTemple.jpg',
      isCoverPage: false,
    },
    {
      imageUrl: 'media/Shanghai_YuGarden.jpg',
      isCoverPage: false,
    }],
  },
  {
    id: 2,
    name: '3 Days China Tour',
    description: 'It\'s a 3 Days China Tour. First 2 days in Beijing, then 1 day in Shanghai.',
    finePrint: 'Depart every Tuesday and Friday from 01/06/2019 to 30/09/2019. extra 500 for single traveller',
    notes: 'No surcharge for families.',
    days: 3,
    maxParticipant: 20,
    isPromoted: true,
    isActive: true,
    isExtention: false,
    images: [{
      imageUrl: 'media/Beijing_ForbiddenPalace.jpg',
      isCoverPage: false,
    },
    {
      imageUrl: 'media/Beijing_TianAnMen.jpg',
      isCoverPage: true,
    },
    {
      imageUrl: 'media/Shanghai_YuGarden.jpg',
      isCoverPage: false,
    }],
  }];
};

const getAllPromotedPackage = () => {
  return _.filter(getAllPackage(), {isPromoted: true});
};

const getPackage = (packageId) => {
  return _.filter(getAllPackage(), {id: Number(packageId)});
};

export default {
  getAllPackage,
  getAllPromotedPackage,
  getPackage,
};
