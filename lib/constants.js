const get = () => {
  return {
    Global: {
      appId: '749657255797506',
      dateFormat: 'DD/MM/YYYY',
      defaultCountry: 'Australia',
      defaultPeople: 1,
      defaultRooms: 1,
      maxDayItems: 3,
      timePlannable: 8,
      minDaysAhead: 7,
      minCarTime: 4,
      maxCarTime: 8,
      maxPeopleSelection: 10,
      standardRoomCapacity: 2,
      maxRoomCapacity: 3,
      idxLastItem: 999,
      algoRecommend: '1@3:5', // <SameFirst>@<Same>:<Different> Change to ENV
      sysUser: 'system',
      defaultImgUrl:
        'https://www.eainsurance.com.au/wp-content/uploads/2020/05/Travel1.jpg',
    },
    Country: [
      {
        name: 'Australia',
        state: ['ACT', 'NSW', 'QLD', 'VIC', 'WA', 'SA', 'NT', 'TAS'],
        validAddressType: ['street_address', 'establishment', 'locality'],
      },
    ],
    SocketChannel: {
      Action: {
        ADD_MEMBER: 'AddMember',
        UPDATE_PEOPLE: 'UpdatePeople',
        UPDATE_ROOMS: 'UpdateRooms',
        UPDATE_DATE: 'UpdateDate',
        USER_JOIN: 'UserJoin',
        USER_LEAVE: 'UserLeave',
      },
      Status: {
        OK: 'ok',
        INVALID_USER: 'InvalidUser',
        EXISTING_USER: 'ExistingUser',
        INVALID_INSTANCE: 'InvalidInstance',
        DB_ERROR: 'DatabaseError',
        NO_INSTANCE: 'NoInstance',
      },
    },
    Payment: {
      env: 'sandbox',
      sandbox:
        'AccQ-94B8S4NDVLV1VV41NY7LyLTw2MO61ToGTgSY1cn1CbMzam7ENF467LpojEFrO2h2ibVfni3K3Hf',
      production:
        'AccQ-94B8S4NDVLV1VV41NY7LyLTw2MO61ToGTgSY1cn1CbMzam7ENF467LpojEFrO2h2ibVfni3K3Hf',
      terms: 'I have read and agree to the Terms and Conditions.',
      currency: 'AUD',
      deposit: 200,
    },
    User: {
      Source: {
        WEB: 'Web',
        FACEBOOK: 'Facebook',
      },
    },
    Page: {
      MainPage: 'main-page',
      NewPlan: 'new-plan',
      ShowPlan: 'show-plan',
    },
    Instance: {
      status: {
        DRAFT: 'Draft',
        INITIATED: 'Initiated',
        IN_PROGRESS: 'InProgress',
        REVIEW_ITINERARY: 'ReviewItinerary',
        PENDING_PAYMENT: 'PendingPayment',
        DEPOSIT_PAID: 'DepositPaid',
        FULLY_PAID: 'FullyPaid',
        COMPLETED: 'Completed',
        ARCHIVED: 'Archived',
      },
    },
    TravelPackage: {
      status: {},
    },
    DataModel: {
      DestinationType: {
        COUNTRY: 'COUNTRY',
        REGION: 'REGION',
        CITY: 'CITY',
        TOWN: 'TOWN',
      },
      TravelPlanItemType: {
        PRODUCT: 'PRODUCT',
        ATTRACTION: 'ATTRACTION',
      },
    },
    Modal: {
      INVALID_DATE: {
        key: 'InvalidTravelDate',
        title: 'Travel start and end date cannot be empty',
        description:
          'Would you like to select your travel start and end date before locking your package?',
      },
      ZERO_OWNER: {
        key: 'ZeroOwner',
        title: 'Minimum #Min# People Required',
        description:
          'Would you like to tell us how many people to add to the booking before locking your package?',
      },
      LESS_THAN_MIN: {
        key: 'LessThanMin',
        title: 'Minimum #Min# People Required',
        description:
          'Would you like to tell us how many people to add to the booking before locking your package?',
      },
      ENABLE_DIY: {
        key: 'EnablePackageDiy',
        title: 'DIY your package',
        description:
          'Would you like to start DIY your trip? An extra fee will be applied.',
      },
      SUBMIT_PAYMENT: {
        key: 'SubmitPayment',
        title: 'Submit Payment',
        description: 'Would you like to pay the deposit?',
      },
      DELETE_ITINERARY: {
        key: 'DeleteItinerary',
        title: 'Delete #Day#',
        description:
          'Would you like to delete #Day#? Please Click Yes to continue.',
      },
      FAILED_DELETE_ITINERARY: {
        key: 'FailedDeleteItinerary',
        title: 'Failed to delete #Day#',
        description:
          '#Day# cannot be deleted, because #Attractions# cannot be skipped of the day.',
      },
      ADD_ITINERARY: {
        key: 'AddItinerary',
        title: 'Add one more day after #Day#',
        description:
          'Would you like to add one more day after #Day#? Please Click Yes to continue.',
      },
      FULL_ITINERARY: {
        key: 'FullItinerary',
        title: '#Day# fully booked',
        description:
          'Your itinerary of #Day# has been fully booked. Please add one more day.',
      },
      ONLY_ITINERARY: {
        key: 'OnlyItinerary',
        title: 'The only attraction cannot be deleted',
        description:
          'Your itinerary of #Day# has only one activity planned. Thus, it cannot be deleted.',
      },
      INVALID_MIN_PARTICIPANT: {
        key: 'InvalidMinParticipant',
        title: "The minimum hasn't been met",
        description: 'This tour needs to have #Min#.',
      },
      INVALID_MAX_PARTICIPANT: {
        key: 'InvalidMaxParticipant',
        title: 'The maximum has been exceeded',
        description: 'This tour can only have #Max#.',
      },
      button: {
        YES: 'Yes',
        NO: 'No',
        OK: 'Ok',
        CLOSE: 'Close',
        DIY: 'Customise',
      },
    },
  };
};

export default {
  get,
};
