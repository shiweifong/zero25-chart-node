module.exports = {
    main : {
        version : '0.0.1'
    }
    , forecast : {
        apiKey : null
    }
    , twilio : {
        sid : null
        , token : null
        , number : null
    }
    , sendgrid : {
        sendGridApiKey : null
        , fromName : null
        , from : null
        , adminEmail : null
    }
    , zendesk : {
        url : null
        , email : null
        , token : null
    }
    , google : {
        apiKey : null
        , apiBrowserKey : null
        , geocodingUrl : null
        , timezoneUrl : null
        , recaptchaSiteKey : null
        , recaptchaSiteSecret : null
    }
    , tz : {
        defaultAnalyticsTz : 'Asia/Singapore'
        , defaultTz : 'Asia/Singapore'
        , defaultCountry : 'Singapore'
        , defaultOffset : 'Singapore'
    }
    , maxmind : {
        userId : null
        , licenseKey : null
    }
    , awsS3 : {
        accessKeyId : null
        , accessKeySecret : null
        , s3Dns : null
        , bucket : null
    }
    , cloudinary : {
        cloudName : null
        , apiKey : null
        , apiSecret : null
    }
    , eyexPusher : {
        appId : null
        , key : null
        , secret : null
        , product : null
    }
    , shopify : {
        storeName : null
        , apiKey : null
        , apiSecret : null
        , sharedSecret : null
    }
    , uber : {
        appName : null
        , clientId : null
        , clientSecret : null
        , serverToken : null
        , redirectUri : null
        , sandbox : false
    }
    , paypal : {
        clientId : null
        , secret : null
    }
    , rollbar : {
        accessToken : null
        , localUsername : null
        , rollbarUsername : null
        , revision : null
        , environment : null
    }
    , stripe : {
        secretKey : null
        , publishableKey : null
    }
    , pushNotification : {
        gcmApiKey : ''
        , up : {
            apnsCert : __root + ''
            , apnsKey : __root + ''
            , apnsProduction : true
            , apnsPassphrase : ''
        }
    }
    , redis : {
        host : ''
        , port : null
        , ttl : null
        , password : ''
    }
    , mongo : {
        db : 'zero2-5'
        , dbUser : 'zero25admin'
        , password : 'r6xsQ5GUY68AJXj8'
        , replicaSet : 'zero2-5-shard-0'
        , secured : true
        , host : 'zero2-5-shard-00-00-kvbng.mongodb.net:27017,' + 'zero2-5-shard-00-01-kvbng.mongodb.net:27017,' + 'zero2-5-shard-00-02-kvbng.mongodb.net:27017'
        , authSource : 'admin'
        , mongoDbConfig : {}
    }
    , authorization : {
        100 : '/'
        , 300 : '/'
        , 350 : '/'
        , 400 : '/'
        , 410 : '/'
        , 411 : '/'
        , 412 : '/'
        , 440 : '/'
        , 450 : '/'
        , 490 : '/'
        , 500 : '/'
        , enterpriseWhiteList : []
    }
};
