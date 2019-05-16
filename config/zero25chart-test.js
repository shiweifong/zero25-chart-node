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
        gcmApiKey : 'AIzaSyDb_gIJVWBEWmJLZ-n83b5oAXHe-8M9mf4'
        , up : {
            apnsCert : __root + '/keys/lifecare.pem'
            , apnsKey : __root + '/keys/lifecare.pem'
            , apnsProduction : true
            , apnsPassphrase : 'astralink'
        }
    }
    , redis : {
        host : 'redis-18406.c1.ap-southeast-1-1.ec2.cloud.redislabs.com'
        , port : 18406
        , ttl : 120
        , password : 'Nk4BumpPW4Eh4lhnCHxgOQTHfceJXrK7'
    }
    , mongo : {
        db : 'up'
        , dbUser : 'shiweifong'
        , password : 's8944896d'
        , replicaSet : 'up-shard-0'
        , secured : true
        , host : 'up-shard-00-00-srthe.gcp.mongodb.net:27017,' + 'up-shard-00-01-srthe.gcp.mongodb.net:27017,' + 'up-shard-00-02-srthe.gcp.mongodb.net:27017'
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
