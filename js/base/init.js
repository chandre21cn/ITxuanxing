seajs.config({
    base:'/js/',
    alias: {
        "$":"jquery/jquery",
        "ajaxform":"lib/ajaxform",
        "AutoComplete" : "lib/autocomplete",
        "datetimepicker":"lib/datetimepicker",
        "dialog":"lib/dialog",
        "flexslider":"lib/flexslider",
        "livequery":"lib/livequery",
        "placeholder":"lib/placeholder",
        "popup":"lib/popup",
        "scroll":"lib/scroll",
        "selectbox":"lib/selectbox",
        "switch":"lib/switch",
        "template":"lib/template",
        "validate":"lib/validate",
        "validate_methods":"src/validate_methods",
        "cookie" : "lib/cookie"
    },
    paths: {
        'jquery': '/js/sea-modules/jquery',
        'lib': '/js/sea-modules/lib',
    },
    preload:['$'],
    'map': [ //修改版本号
        [ /^(.*\.(?:css|js))(.*)$/i, "$1?20140912" ]
    ],
    charset: 'utf-8'
});

seajs.use('src/base');