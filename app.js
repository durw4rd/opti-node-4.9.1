const optimizelySDK = require('@optimizely/optimizely-sdk');
const { enums } = require('@optimizely/optimizely-sdk');
const {v4: uuidv4 } = require('uuid'); 

optimizelySDK.setLogger(optimizelySDK.logging.createLogger());
optimizelySDK.setLogLevel('error');

// define a custom logging function
const logMe = (message) => {
  console.log(`[CUSTOM LOG] ${message}`);
};

const sdkKey = 'Rkbq9RRmy9wDm1SBDG14u' // New Full Stack UI

// Initialize Optimizely client
const optiClient = optimizelySDK.createInstance({
  sdkKey,
  datafileOptions: {
    autoUpdate: true,
    updateInterval: 5000,  // 5 seconds in milliseconds
    urlTemplate: 'https://cdn.optimizely.com/datafiles/%s.json',
  },
  eventBatchSize: 1,          // max number of events to hold in the queue
  eventFlushInterval: 5000   // max duration an event can exist in the queue; 5 seconds in milliseconds
});

// specify the number of user IDs if you need more than one. Otherwise, make it null
const numberOfUsers = 100;   
if(!!numberOfUsers) {
    var userIds = [];
    for(i = 0; i < numberOfUsers; i++) {
        userIds.push(uuidv4());
    }
}

optiClient.onReady({ timeout: 3000 }).then((result) => {
  if (result.success === false) {
    logMe(`Failed to initialize the client instance. Reason: ${result.reason}`);
    process.exit()      // exit the app
  };

  // can be used for scenarios when in need of a lot of users
  if(!!numberOfUsers) {   
    console.log(`[CUSTOM LOG] Detecting MANY users. Total number of users evaluated:\t ${numberOfUsers}`);

    let [one, two, three, four] = [0,0,0,0];

    createOutput = (variationAssignment) => {
      switch (variationAssignment) {
        case 'one':
          one++;
          break;
        case 'two':
          two++;
          break;
        case 'three':
          three++;
          break;
        case 'four':
          four++;
          break;
        }
    } 

    userIds.forEach((userId) => {
      // -------------
      // DO STUFF HERE
      // -------------
      const user = optiClient.createUserContext(userId);
      // optiClient.setForcedVariation('forced_decisions_experiment', userId, 'two');
      const decision = user.decide('forced_decisions');

      // -------------
      // STOP TOUCHING MY STUFF
      // -------------
      createOutput(decision.variationKey);
    });

    console.log(`\n
      -----------------------------------\n
      [CUSTOM LOG] Results of bucketing decisions:\n
      Variation One:\t ${one}\n
      Variation Two:\t ${two}\n
      Variation Three:\t ${three}\n
      Variation Four:\t ${four}\n
      -----------------------------------
    `)
  }

  optiClient.close().then((result) => {
    if (result.success === false) {
      logMe(`Failed to close the client instance. Reason: ${result.reason}`);
    } else {
      logMe(`Safe to close the app: ${result.success}. Closing the app!`);
      process.exit()      // exit the app
    }
  });
});