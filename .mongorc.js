/*
 *
 * Mongo-Hacker
 * MongoDB Shell Enhancements for Hackers
 *
 * Tyler J. Brock - 2013 - 2016
 *
 * http://tylerbrock.github.com/mongo-hacker
 *
 */

mongo_hacker_config = {
  verbose_shell:  true,             // additional verbosity
  index_paranoia: false,            // querytime explain
  enhance_api:    true,             // additonal api extensions
  indent:         2,                // number of spaces for indent
  sort_keys:      false,            // sort the keys in documents when displayed
  uuid_type:      'default',        // 'java', 'c#', 'python' or 'default'
  banner_message: 'Mongo-Hacker ',  // banner message
  version:        '0.0.14',         // current mongo-hacker version
  show_banner:     true,            // show mongo-hacker version banner on startup
  windows_warning: true,            // show warning banner for windows
  force_color:     false,           // force color highlighting for Windows users
  count_deltas:    false,           // "count documents" shows deltas with previous counts
  column_separator:  '→',           // separator used when printing padded/aligned columns
  value_separator:   '/',           // separator used when merging padded/aligned values
  dbref: {
    extended_info: true,            // enable more informations on DBRef
    plain:         false,           // print DBRef as plain JSON object
    db_if_differs: false            // include $db only if is different than current one
  },

  // Shell Color Settings
  // Colors available: red, green, yellow, blue, magenta, cyan
  colors: {
    'key':       { color: 'gray' },
    'number':    { color: 'red' },
    'boolean':   { color: 'blue', bright: true },
    'null':      { color: 'red', bright: true },
    'undefined': { color: 'magenta', bright: true },
    'objectid':  { color: 'yellow', underline: true },
    'string':    { color: 'green' },
    'binData':   { color: 'green', bright: true },
    'function':  { color: 'magenta' },
    'date':      { color: 'blue' },
    'uuid':      { color: 'cyan' },
    'databaseNames':   { color: 'green', bright: true },
    'collectionNames': { color: 'blue',  bright: true }
  }
}

if (mongo_hacker_config['show_banner']) {
  print(mongo_hacker_config['banner_message'] + mongo_hacker_config['version']);
}

if (_isWindows() && mongo_hacker_config['windows_warning']) {
    print("\nMongoDB Shell Enhancements for Hackers does not support color highlighting in ");
    print("the default Windows Command Prompt. If you are using an alternative console ");
    print("such as ConEmu (https://github.com/Maximus5/ConEmu) you may wish to try enabling");
    print("highlighting in your mongo_hacker config by setting:");
    print("\n\tforce_color: true\n");
    print("You can hide this startup warning by setting:");
    print("\n\twindows_warning: false\n");
}

if (typeof db !== 'undefined') {
    var current_version = parseFloat(db.serverBuildInfo().version).toFixed(2)

    if (current_version < 2.4) {
        print("Sorry! MongoDB Shell Enhancements for Hackers is only compatible with Mongo 2.4+\n");
    }
}
//----------------------------------------------------------------------------
// Color Functions
//----------------------------------------------------------------------------
__ansi = {
    csi: String.fromCharCode(0x1B) + '[',
    reset:      '0',
    text_prop:  'm',
    foreground: '3',
    bright:     '1',
    underline:  '4',

    colors: {
        black:   '0',
        red:     '1',
        green:   '2',
        yellow:  '3',
        blue:    '4',
        magenta: '5',
        cyan:    '6',
        gray:    '7',
    }
};

function controlCode( parameters ) {
    if ( parameters === undefined ) {
        parameters = "";
    }
    else if (typeof(parameters) == 'object' && (parameters instanceof Array)) {
        parameters = parameters.join(';');
    }

    return __ansi.csi + String(parameters) + String(__ansi.text_prop);
};

function applyColorCode( string, properties, nocolor ) {
    // Allow global __colorize default to be overriden
    var applyColor = (null == nocolor) ? __colorize : !nocolor;

    return applyColor ? controlCode(properties) + String(string) + controlCode() : String(string);
};

function colorize( string, color, nocolor ) {

    var params = [];
    var code = __ansi.foreground + __ansi.colors[color.color];

    params.push(code);

    if ( color.bright === true ) params.push(__ansi.bright);
    if ( color.underline === true ) params.push(__ansi.underline);

    return applyColorCode( string, params, nocolor );
};

function colorizeAll( strings, color, nocolor ) {
    return strings.map(function(string) {
        return colorize( string, color, nocolor );
    });
};
__indent = Array(mongo_hacker_config.indent + 1).join(' ');
__colorize = (_isWindows() && !mongo_hacker_config['force_color']) ? false : true;

ObjectId.prototype.toString = function() {
    return this.str;
};

ObjectId.prototype.tojson = function(indent, nolint) {
    return tojson(this);
};

var dateToJson = Date.prototype.tojson;

Date.prototype.tojson = function(indent, nolint, nocolor) {
  var isoDateString = dateToJson.call(this);
  var dateString = isoDateString.substring(8, isoDateString.length-1);

  var isodate = colorize(dateString, mongo_hacker_config.colors.date, nocolor);
  return 'ISODate(' + isodate + ')';
};

Array.tojson = function( a , indent , nolint, nocolor ){
    var lineEnding = nolint ? " " : "\n";

    if (!indent)
        indent = "";

    if ( nolint )
        indent = "";

    if (a.length === 0) {
        return "[ ]";
    }

    var s = "[" + lineEnding;
    indent += __indent;
    for ( var i=0; i<a.length; i++){
        s += indent + tojson( a[i], indent , nolint, nocolor );
        if ( i < a.length - 1 ){
            s += "," + lineEnding;
        }
    }
    if ( a.length === 0 ) {
        s += indent;
    }

    indent = indent.substring(__indent.length);
    s += lineEnding+indent+"]";
    return s;
};

function surround(name, inside) {
    return [name, '(', inside, ')'].join('');
}

Number.prototype.commify = function() {
    // http://stackoverflow.com/questions/2901102
    return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

NumberLong.prototype.tojson = function(indent, nolint, nocolor) {
    var color = mongo_hacker_config.colors.number;
    var output = colorize('"' + this.toString().match(/-?\d+/)[0] + '"', color, nocolor);
    return surround('NumberLong', output);
};

NumberInt.prototype.tojson = function(indent, nolint, nocolor) {
    var color = mongo_hacker_config.colors.number;
    var output = colorize('"' + this.toString().match(/-?\d+/)[0] + '"', color, nocolor);
    return surround('NumberInt', output);
};

BinData.prototype.tojson = function(indent , nolint, nocolor) {
    var uuidType = mongo_hacker_config.uuid_type;
    var uuidColor = mongo_hacker_config.colors.uuid;
    var binDataColor = mongo_hacker_config.colors.binData;

    if (this.subtype() === 3) {
        var output = colorize('"' + uuidToString(this) + '"', uuidColor, nocolor) + ', '
        output += colorize('"' + uuidType + '"', uuidColor)
        return surround('UUID', output);
    } else if (this.subtype() === 4) {
        var output = colorize('"' + uuidToString(this, "default") + '"', uuidColor, nocolor) + ')'
        return surround('UUID', output);
    } else {
        var output = colorize(this.subtype(), {color: 'red'}) + ', '
        output += colorize('"' + this.base64() + '"', binDataColor, nocolor)
        return surround('BinData', output);
    }
};

DBQuery.prototype.shellPrint = function(){
    try {
        var start = new Date().getTime();
        var n = 0;
        while ( this.hasNext() && n < DBQuery.shellBatchSize ){
            var s = this._prettyShell ? tojson( this.next() ) : tojson( this.next() , "" , true );
            print( s );
            n++;
        }

        var output = [];

        if (typeof _verboseShell !== 'undefined' && _verboseShell) {
            var time = new Date().getTime() - start;
            var slowms = getSlowms();
            var fetched = "Fetched " + n + " record(s) in ";
            if (time > slowms) {
                fetched += colorize(time + "ms", { color: "red", bright: true });
            } else {
                fetched += colorize(time + "ms", { color: "green", bright: true });
            }
            output.push(fetched);
        }

        var paranoia = mongo_hacker_config.index_paranoia;

        if (typeof paranoia !== 'undefined' && paranoia) {
            var explain = this.clone();
            explain._ensureSpecial();
            explain._query.$explain = true;
            explain._limit = Math.abs(n) * -1;
            var result = explain.next();

            if (current_version < 3) {
                var type = result.cursor;

                if (type !== undefined) {
                    var index_use = "Index[";
                    if (type == "BasicCursor") {
                        index_use += colorize( "none", { color: "red", bright: true });
                    } else {
                        index_use += colorize( result.cursor.substring(12), { color: "green", bright: true });
                    }
                    index_use += "]";
                    output.push(index_use);
                }
            } else {
                var winningPlan = result.queryPlanner.winningPlan;
                var winningInputStage = winningPlan.inputStage.inputStage;

                if (winningPlan !== undefined) {
                    var index_use = "Index[";
                    if (winningPlan.inputStage.stage === "COLLSCAN" || (winningInputStage !== undefined && winningInputStage.stage !== "IXSCAN")) {
                        index_use += colorize( "none", { color: "red", bright: true });
                    } else {
                        var fullScan = false;
                        for (index in winningInputStage.keyPattern) {
                            if (winningInputStage.indexBounds[index][0] == "[MinKey, MaxKey]") {
                                fullScan = true;
                            }
                        }

                        if (fullScan) {
                            index_use += colorize( winningInputStage.indexName + " (full scan)", { color: "yellow", bright: true });
                        } else {
                            index_use += colorize( winningInputStage.indexName, { color: "green", bright: true });
                        }
                    }
                    index_use += "]";
                    output.push(index_use);
                }
            }
        }

        if ( this.hasNext() ) {
            ___it___  = this;
            output.push("More[" + colorize("true", { color: "green", bright: true }) + "]");
        }
        print(output.join(" -- "));
    }
    catch ( e ){
        print( e );
    }
};

function isInArray(array, value) {
    return array.indexOf(value) > -1;
}

tojsonObject = function( x, indent, nolint, nocolor, sort_keys ) {
    var lineEnding = nolint ? " " : "\n";
    var tabSpace = nolint ? "" : __indent;
    var sortKeys = (null == sort_keys) ? mongo_hacker_config.sort_keys : sort_keys;

    assert.eq( ( typeof x ) , "object" , "tojsonObject needs object, not [" + ( typeof x ) + "]" );

    if (!indent)
        indent = "";

    if ( typeof( x.tojson ) == "function" && x.tojson != tojson ) {
        return x.tojson( indent, nolint, nocolor );
    }

    if ( x.constructor && typeof( x.constructor.tojson ) == "function" && x.constructor.tojson != tojson ) {
        return x.constructor.tojson( x, indent , nolint, nocolor );
    }

    if ( x.toString() == "[object MaxKey]" )
        return "{ $maxKey : 1 }";
    if ( x.toString() == "[object MinKey]" )
        return "{ $minKey : 1 }";

    var s = "{" + lineEnding;

    // push one level of indent
    indent += tabSpace;

    var total = 0;
    for ( var k in x ) total++;
    if ( total === 0 ) {
        s += indent + lineEnding;
    }

    var keys = x;
    if ( typeof( x._simpleKeys ) == "function" )
        keys = x._simpleKeys();
    var num = 1;

    var keylist=[];

    for(var key in keys)
        keylist.push(key);

    if ( sortKeys ) {
        // Disable sorting if this object looks like an index spec
        if ( (isInArray(keylist, "v") && isInArray(keylist, "key") && isInArray(keylist, "name") && isInArray(keylist, "ns")) ) {
            sortKeys = false;
        } else {
            keylist.sort();
        }
    }

    for ( var i=0; i<keylist.length; i++) {
        var key=keylist[i];

        var val = x[key];
        if ( val == DB.prototype || val == DBCollection.prototype )
            continue;

        var color = mongo_hacker_config.colors.key;
        s += indent + colorize("\"" + key + "\"", color, nocolor) + ": " + tojson( val, indent , nolint, nocolor, sortKeys );
        if (num != total) {
            s += ",";
            num++;
        }
        s += lineEnding;
    }

    // pop one level of indent
    indent = indent.substring(__indent.length);
    return s + indent + "}";
};

tojson = function( x, indent , nolint, nocolor, sort_keys ) {

    var sortKeys = (null == sort_keys) ? mongo_hacker_config.sort_keys : sort_keys;

    if ( x === null )
        return colorize("null", mongo_hacker_config.colors['null'], nocolor);

    if ( x === undefined )
        return colorize("undefined", mongo_hacker_config.colors['undefined'], nocolor);

    if ( x.isObjectId ) {
        var color = mongo_hacker_config.colors['objectid'];
        return surround('ObjectId', colorize('"' + x.str + '"', color, nocolor));
    }

    if (!indent)
        indent = "";

    var s;
    switch ( typeof x ) {
    case "string": {
        s = "\"";
        for ( var i=0; i<x.length; i++ ){
            switch (x[i]){
                case '"': s += '\\"'; break;
                case '\\': s += '\\\\'; break;
                case '\b': s += '\\b'; break;
                case '\f': s += '\\f'; break;
                case '\n': s += '\\n'; break;
                case '\r': s += '\\r'; break;
                case '\t': s += '\\t'; break;

                default: {
                    var code = x.charCodeAt(i);
                    if (code < 0x20){
                        s += (code < 0x10 ? '\\u000' : '\\u00') + code.toString(16);
                    } else {
                        s += x[i];
                    }
                }
            }
        }
        s += "\"";
        return colorize(s, mongo_hacker_config.colors.string, nocolor);
    }
    case "number":
        return colorize(x, mongo_hacker_config.colors.number, nocolor);
    case "boolean":
        return colorize("" + x, mongo_hacker_config.colors['boolean'], nocolor);
    case "object": {
        s = tojsonObject( x, indent , nolint, nocolor, sortKeys );
        if ( ( nolint === null || nolint === true ) && s.length < 80 && ( indent === null || indent.length === 0 ) ){
            s = s.replace( /[\s\r\n ]+/gm , " " );
        }
        return s;
    }
    case "function":
        return colorize(x.toString(), mongo_hacker_config.colors['function'], nocolor);
    default:
        throw "tojson can't handle type " + ( typeof x );
    }

};


DBQuery.prototype._validate = function( o ){
    var firstKey = null;
    for (var k in o) { firstKey = k; break; }

    if (firstKey !== null && firstKey[0] == '$') {
        // for mods we only validate partially, for example keys may have dots
        this._validateObject( o );
    } else {
        // we're basically inserting a brand new object, do full validation
        this._validateForStorage( o );
    }
};

DBQuery.prototype._validateObject = function( o ){
    if (typeof(o) != "object")
        throw "attempted to save a " + typeof(o) + " value.  document expected.";

    if ( o._ensureSpecial && o._checkModify )
        throw "can't save a DBQuery object";
};

DBQuery.prototype._validateForStorage = function( o ){
    this._validateObject( o );
    for ( var k in o ){
        if ( k.indexOf( "." ) >= 0 ) {
            throw "can't have . in field names [" + k + "]" ;
        }

        if ( k.indexOf( "$" ) === 0 && ! DBCollection._allowedFields[k] ) {
            throw "field names cannot start with $ [" + k + "]";
        }

        if ( o[k] !== null && typeof( o[k] ) === "object" ) {
            this._validateForStorage( o[k] );
        }
    }
};

DBQuery.prototype._checkMulti = function(){
  if(this._limit > 0 || this._skip > 0){
    var ids = this.clone().select({_id: 1}).map(function(o){return o._id;});
    this._query['_id'] = {'$in': ids};
    return true;
  } else {
    return false;
  }
};

DBQuery.prototype.ugly = function(){
    this._prettyShell = false;
    return this;
}

DB.prototype.shutdownServer = function(opts) {
    if( "admin" != this._name ){
        return "shutdown command only works with the admin database; try 'use admin'";
    }

    cmd = {"shutdown" : 1};
    opts = opts || {};
    for (var o in opts) {
        cmd[o] = opts[o];
    }

    try {
        var res = this.runCommand(cmd);
        if( res )
            throw "shutdownServer failed: " + res.errmsg;
        throw "shutdownServer failed";
    }
    catch ( e ){
        assert( e.message.indexOf( "error doing query: failed" ) >= 0 , "unexpected error: " + tojson( e ) );
        print( "server should be down..." );
    }
}
//----------------------------------------------------------------------------
// Aggregation API Extensions
//----------------------------------------------------------------------------

// Inject aggregation extension while supporting base API
DBCollection.prototype.aggregate = function( ops, extraOpts ){
    if (hasDollar(ops) || (ops instanceof Array && hasDollar(ops[0]))){
        var arr = ops;

        if (!ops.length) {
            arr = [];
            for (var i=0; i<arguments.length; i++) {
                arr.push(arguments[i]);
            }
        }

        if (extraOpts === undefined) {
            extraOpts = {};
        }

        var cmd = {pipeline: arr};
        Object.extend(cmd, extraOpts);

        var res = this.runCommand("aggregate", cmd);
        if (!res.ok) {
            printStackTrace();
            throw "aggregate failed: " + tojson(res);
        }
        return res;
    } else {
        return new Aggregation( this ).match( ops || {} );
    }
};

// Helper method for determining if parameter has dollar signs
function hasDollar(fields){
    for (k in fields){
        if(k.indexOf('$') !== -1){
            return true;
        };
    };
    return false;
}

//----------------------------------------------------------------------------
// Aggregation Object
//----------------------------------------------------------------------------
Aggregation = function( collection, fields ){
    this._collection = collection;
    this._pipeline = [];
    this._options = {};
    this._shellBatchSize = 20;
};

Aggregation.prototype.has_next = function() {
    return (this._index < this._results.length);
};

Aggregation.prototype.next = function() {
    var next = this._results[this._index];
    this._index += 1;
    return next
};

Aggregation.prototype.execute = function() {
    // build the command
    var aggregation = { pipeline: this._pipeline };
    if ( this._readPreference ) {
        aggregation["$readPreference"] = this.readPreference;
    }
    Object.extend(aggregation, this._options);

    // run the command
    var res = this._collection.runCommand(
        "aggregate", aggregation
    );

    // check result
    if ( ! res.ok ) {
        printStackTrace();
        throw "aggregation failed: " + tojson(res);
    }

    // setup results as pseudo cursor
    this._index = 0;

    if (this._options["explain"] === true) {
        this._results = res.stages
    } else {
        this._results = res.result;
    }

    return this._results;
};

Aggregation.prototype.shellPrint = function() {
    if (this._results == undefined) {
        this.execute();
    }
    try {
        var i = 0;
        while (this.has_next() && i < this._shellBatchSize) {
            var result = this.next();
            printjson( result );
            i++;
        }
        if ( this.has_next() ) {
            print ( "Type \"it\" for more" );
            ___it___ = this;
        }
        else {
            ___it___ = null;
        }
    }
    catch ( e ) {
        print( e );
    }
};

Aggregation.prototype.project = function( fields ) {
    if ( ! fields ) {
        throw "project needs fields";
    }
    this._pipeline.push({ "$project": fields });
    return this;
};

Aggregation.prototype.find = function( criteria ) {
    if ( ! criteria ) {
        throw "match needs a query object";
    }
    this._pipeline.push({ "$match": criteria });
    return this;
};

Aggregation.prototype.match = function( criteria ) {
    if ( ! criteria ) {
        throw "match needs a query object";
    }
    this._pipeline.push({ "$match": criteria });
    return this;
};

Aggregation.prototype.limit = function( limit ) {
    if ( ! limit ) {
        throw "limit needs an integer indicating the limit";
    }
    this._pipeline.push({ "$limit": limit });
    return this;
};

Aggregation.prototype.skip = function( skip ) {
    if ( ! skip ) {
        throw "skip needs an integer indicating the number to skip";
    }
    this._pipeline.push({ "$skip": skip });
    return this;
};

Aggregation.prototype.unwind = function( field ) {
    if ( ! field ) {
        throw "unwind needs the key of an array field to unwind";
    }
    this._pipeline.push({ "$unwind": "$" + field });
    return this;
};

Aggregation.prototype.group = function( group_expression ) {
    if ( ! group_expression ) {
        throw "group needs an group expression";
    }
    this._pipeline.push({ "$group": group_expression });
    return this;
};

Aggregation.prototype.sort = function( sort ) {
    if ( ! sort ) {
        throw "sort needs a sort document";
    }
    this._pipeline.push({ "$sort": sort });
    return this;
};

Aggregation.prototype.geoNear = function( options ) {
    if ( ! options ) {
        throw "geo near requires options"
    }
    this._pipeline.push({ "$geoNear": options });
    return this;
};

Aggregation.prototype.readPreference = function( mode ) {
    this._readPreference = mode;
    return this;
};

Aggregation.prototype.explain = function( ) {
    this._options['explain'] = true;
    return this;
};
// Override group because map/reduce style is deprecated
DBCollection.prototype.agg_group = function( name, group_field, operation, op_value, filter ) {
    var ops = [];
    var group_op = { $group: { _id: '$' + group_field } };

    if (filter !== undefined) {
        ops.push({ '$match': filter });
    }

    group_op['$group'][name] = { };
    group_op['$group'][name]['$' + operation] = op_value;
    ops.push(group_op);

    return this.aggregate(ops);
};

// Function that groups and counts by group after applying filter
DBCollection.prototype.gcount = function( group_field, filter ) {
    return this.agg_group('count', group_field, 'sum', 1, filter);
};

// Function that groups and sums sum_field after applying filter
DBCollection.prototype.gsum = function( group_field, sum_field, filter ) {
    return this.agg_group('sum', group_field, 'sum', '$' + sum_field, filter);
};

// Function that groups and averages avg_feld after applying filter
DBCollection.prototype.gavg = function( group_field, avg_field, filter ) {
    return this.agg_group('avg', group_field, 'avg', '$' + avg_field, filter);
};
function base64ToHex(base64) {
    var base64Digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var hexDigits = "0123456789abcdef";
    var hex = "";
    for (var i = 0; i < 24; ) {
        var e1 = base64Digits.indexOf(base64[i++]);
        var e2 = base64Digits.indexOf(base64[i++]);
        var e3 = base64Digits.indexOf(base64[i++]);
        var e4 = base64Digits.indexOf(base64[i++]);
        var c1 = (e1 << 2) | (e2 >> 4);
        var c2 = ((e2 & 15) << 4) | (e3 >> 2);
        var c3 = ((e3 & 3) << 6) | e4;
        hex += hexDigits[c1 >> 4];
        hex += hexDigits[c1 & 15];
        if (e3 != 64) {
            hex += hexDigits[c2 >> 4];
            hex += hexDigits[c2 & 15];
        }
        if (e4 != 64) {
            hex += hexDigits[c3 >> 4];
            hex += hexDigits[c3 & 15];
        }
    }
    return hex;
}

function hexToBase64(hex) {
    var base64Digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var base64 = "";
    var group;
    for (var i = 0; i < 30; i += 6) {
        group = parseInt(hex.substr(i, 6), 16);
        base64 += base64Digits[(group >> 18) & 0x3f];
        base64 += base64Digits[(group >> 12) & 0x3f];
        base64 += base64Digits[(group >> 6) & 0x3f];
        base64 += base64Digits[group & 0x3f];
    }
    group = parseInt(hex.substr(30, 2), 16);
    base64 += base64Digits[(group >> 2) & 0x3f];
    base64 += base64Digits[(group << 4) & 0x3f];
    base64 += "==";
    return base64;
}

var platformSpecificUuidModifications = {
    "java": function (hex) {
        var msb = hex.substr(0, 16);
        var lsb = hex.substr(16, 16);
        msb = msb.substr(14, 2) + msb.substr(12, 2) + msb.substr(10, 2) + msb.substr(8, 2)
            + msb.substr(6, 2) + msb.substr(4, 2) + msb.substr(2, 2) + msb.substr(0, 2);
        lsb = lsb.substr(14, 2) + lsb.substr(12, 2) + lsb.substr(10, 2) + lsb.substr(8, 2)
            + lsb.substr(6, 2) + lsb.substr(4, 2) + lsb.substr(2, 2) + lsb.substr(0, 2);
        return msb + lsb;
    },
    "c#": function (hex) {
        return hex.substr(6, 2) + hex.substr(4, 2) + hex.substr(2, 2) + hex.substr(0, 2)
            + hex.substr(10, 2) + hex.substr(8, 2) + hex.substr(14, 2) + hex.substr(12, 2)
            + hex.substr(16, 16);
    },
    "python": function (hex) {
        return hex;
    },
    "default": function (hex) {
        return hex;
    }
};

function UUID(uuid, type) {
    var hex = uuid.replace(/[{}-]/g, "");
    var typeNum = 4;
    if (type != undefined) {
        typeNum = 3;
        hex = platformSpecificUuidModifications[type](hex);
    }
    return new BinData(typeNum, hexToBase64(hex));
}

function uuidToString(uuid, uuidType) {
    var uuidType = uuidType || mongo_hacker_config['uuid_type'];
    var hex = platformSpecificUuidModifications[uuidType](base64ToHex(uuid.base64()));
    return hex.substr(0, 8) + '-' + hex.substr(8, 4) + '-' + hex.substr(12, 4)
        + '-' + hex.substr(16, 4) + '-' + hex.substr(20, 12);
}
// Better show dbs
shellHelper.show = function () {
    var show = shellHelper.show;
    return function (what) {
        assert(typeof what == "string");

        if (what == "collections" || what == "tables") {
            var collectionNames = db.getCollectionNames();
            var collectionStats = collectionNames.map(function (name) {
                var stats = db.getCollection(name).stats();
                if (stats.ok) {
                var size = (stats.size / 1024 / 1024).toFixed(3);
                return (size + "MB");
                } else if (stats.code === 166) {
                return "VIEW";
                } else {
                return "ERR:" + stats.code;
                }
            });
            var collectionStorageSizes = collectionNames.map(function (name) {
                var stats = db.getCollection(name).stats();
                if (stats.ok) {
                var storageSize = (stats.storageSize / 1024 / 1024).toFixed(3);
                return (storageSize + "MB");
                }
                return "";
            });
            collectionNames = colorizeAll(collectionNames, mongo_hacker_config['colors']['collectionNames']);
            printPaddedColumns(collectionNames, collectionStats, collectionStorageSizes);
            return "";
        }

        if (what == "dbs" || what == "databases") {
            var databases = db.getMongo().getDBs().databases.sort(function(a, b) { return a.name.localeCompare(b.name) });
            var databaseNames = databases.map(function(db) {
                return db.name;
            });
            var databaseSizes = databases.map(function(db) {
                var sizeInGigaBytes = (db.sizeOnDisk / 1024 / 1024 / 1024).toFixed(3);
                return (db.sizeOnDisk > 1) ? (sizeInGigaBytes + "GB") : "(empty)";
            });
            databaseNames = colorizeAll(databaseNames, mongo_hacker_config['colors']['databaseNames']);
            printPaddedColumns(databaseNames, databaseSizes);
            return "";
        }

        return show(what);
    }
}();
//----------------------------------------------------------------------------
// findAndModify Helper
//----------------------------------------------------------------------------
DBQuery.prototype._findAndModify = function( options ) {
    var findAndModify = {
        'findandmodify': this._collection.getName(),
        'query': this._query,
        'new': true,
        'fields': this._fields,
        'upsert': this._upsert || false,
        'sort': this._query.orderby || {},
    };

    for (var key in options){
        findAndModify[key] = options[key];
    };

    var result = this._db.runCommand( findAndModify );
    if ( ! result.ok ){
        throw "findAndModifyFailed failed: " + tojson( result );
    };
    return result.value;
};

//----------------------------------------------------------------------------
// findAndModify Terminal Variants
//----------------------------------------------------------------------------
DBQuery.prototype.updateAndGet = function( update ) {
    return this._findAndModify({ 'update': update });
};

DBQuery.prototype.getAndUpdate = function( update ) {
    return this._findAndModify({ 'update': update, 'new': false });
};

DBQuery.prototype.replaceAndGet = function( replacement ) {
    return this._findAndModify({ 'update': replacement });
};

DBQuery.prototype.getAndReplace = function( replacement ) {
    return this._findAndModify({ 'update': replacement, 'new': false });
};

DBQuery.prototype.getAndRemove = function() {
    return this._findAndModify({ 'remove': true })
};// Improve the default prompt with hostname, process type, and version
prompt = function() {
    var serverstatus = db.serverStatus();
    var host = serverstatus.host.split('.')[0];
    var process = serverstatus.process;
    var version = db.serverBuildInfo().version;
    var repl_set = db._adminCommand({"replSetGetStatus": 1}).ok !== 0;
    var rs_state = '';
    if(repl_set) {
        var status = rs.status();
        var members = status.members;
        var rs_name = status.set;
        for(var i = 0; i<members.length; i++){
            if(members[i].self === true){
                rs_state = '[' + members[i].stateStr + ':' + rs_name + ']';
            }
        };
    }
    var state = isMongos() ? '[mongos]' : rs_state;
    return host + '(' + process + '-' + version + ')' + state + ' ' + db + '> ';
};

function listDbs(){
  return db.adminCommand("listDatabases").databases.map(function(d){return d.name});
}

this.__proto__.constructor.autocomplete = listDbs;DBRef.prototype.__toString = DBRef.prototype.toString;
DBRef.prototype.toString = function () {
  var org = this.__toString();
  var config = mongo_hacker_config.dbref;
  if (!config.extended_info) {
    return org;
  }
  var additional = {};
  var o = this;
  for (var p in o) {
    if (typeof o[p] === 'function') {
      continue;
    }
    if (!config.plain && (p === '$ref' || p === '$id')) {
      continue;
    }
    if (config.db_if_differs && p === '$db' && o[p] === db.getName()) {
      continue;
    }
    additional[p] = o[p];
  }
  if (config.plain) {
    return tojsonObject(additional, undefined, true);
  }
  return Object.keys(additional).length
    ? (org.slice(0, -1) + ", " + tojsonObject(additional, undefined, true) + ")")
    : org;
};
function runMatch(cmd, args, regexp) {
    clearRawMongoProgramOutput();
    if (args) {
        run(cmd, args);
    } else {
        run(cmd);
    }
    var output = rawMongoProgramOutput();
    return output.match(regexp);
};

function getEnv(env_var) {
    var env_regex = new RegExp(' ' + env_var + '=(.*)');
    return runMatch('env', '', env_regex)[1];
};

function getVersion() {
    var regexp = /version: (\d).(\d).(\d)/;
    return runMatch('mongo', '--version', regexp).slice(1, 4);
};

function isMongos() {
    return db.isMaster().msg == 'isdbgrid';
};

function getSlowms(){
    if(!isMongos()){
        return db.getProfilingStatus().slowms;
    } else {
        return 100;
    }
};

function maxLength(listOfNames) {
    return listOfNames.reduce(function(maxLength, name) {
        return (name.length > maxLength) ? name.length : maxLength ;
    }, 0);
};

function printPaddedColumns() {
    var columnWidths = Array.prototype.map.call(
      arguments,
      function(column) {
        return maxLength(column);
      }
    );

    for (i = 0; i < arguments[0].length; i++) {
        row = "";
        for (j = 0; j < arguments.length; j++) {
            var separator = ""
            var val = arguments[j][i].toString();
            if (!val && j >= arguments.length - 1) { continue; }
            val = val.pad(columnWidths[j], (j == 0));
            if (j > 0) {
                separator = " " + ((j == 1) ?
                    mongo_hacker_config['column_separator'] :
                    mongo_hacker_config['value_separator']
                ) + " ";
            }
            row += separator + val;
        }
        print(row);
    }

    return null;
};

function runOnDbs(regexp, callback) {
    var originalDb = db.getName();
    db.getMongo().getDBs().databases.filter(function(db) {
        return db.name.match(regexp); }
    ).forEach(function(dbEntry) {
        db = db.getSiblingDB(dbEntry.name);
        callback(db);
    });
    db = db.getSiblingDB(originalDb);
}
shellHelper.find = function (query) {
    assert(typeof query == "string");

    var args = query.split( /\s+/ );
    query = args[0];
    args = args.splice(1);

    if (query !== "") {
        var regexp = new RegExp(query, "i");
        var result = db.runCommand("listCommands");
        for (var command in result.commands) {
            var commandObj = result.commands[command];
            var help = commandObj.help;
            if (commandObj.help.indexOf('\n') != -1 ) {
                help = commandObj.help.substring(0, commandObj.help.lastIndexOf('\n'));
            }
            if (regexp.test(command) || regexp.test(help)) {
                var numSpaces = 30 - command.length;
                print(colorize(command, {color: 'green'}), Array(numSpaces).join(" "), "-", help);
            }
        }
    }
};

// Begin PS Hack
// Copyright (c) 2016, 2017 Andrew Young
// SPDX-License-Identifier: MIT

var psHack = {

    printTableRow: function(row, columnWidths) {
        var pad = function(x, i) {
            return x.pad(i).slice(-i).toString();
        };
        var line = "";
        for(c in columnWidths) {
            line = line + pad(row[c], columnWidths[c]) + " ";
        }
        print(line);
    },

    printTable: function(headers, rows) {
        // printTable(headers: Array[String], rows: Array[Array[String]])

        // Find column widths
    
        var columnWidths = [];

        for(c in headers) {
            columnWidths[c] = headers[c].length;
        }

        for(r in rows) {
            var row = rows[r];
            for (c in headers) {
                row[c] = row[c].toString();
                columnWidths[c] = Math.max(columnWidths[c], row[c].length);
            }
        }

        // Print Table
        var hr = function(l) {
            return new Array(l + 1).join("-");
        };
        var hrs = [];
        for(c in columnWidths) {
            hrs.push(hr(columnWidths[c]));
        }
        this.printTableRow(headers, columnWidths);
        this.printTableRow(hrs, columnWidths);

        var ptr = this.printTableRow;
        rows.forEach(function(row) { ptr(row, columnWidths); });
        
    },

    // This parses command line options
    argumentRegex: /(-|--)(\w+)|"([^"]+)"|'([^']+)'|(\S+)/g,
    
    parseOptions: function(argumentString) {
        var options = {};
        if(typeof(argumentString) == "string") {
            // Arguments outside of options will go here
            var optionName = "_args";
            options[optionName] = [];
            // If we get a -- by itself, we will stop processing arguments.
            var stopProcessingArguments = false;
            var match = this.argumentRegex.exec(argumentString);
            while (match != null) {
                if(stopProcessingArguments) {
                    options["_args"].push(match[0]);
                } else if(match[0] == "--") {
                    stopProcessingArguments = true;
                } else if(match[1] != undefined) {
                    // This is an option name
                    optionName = match[2];
                    if (options[optionName] == undefined) {
                        options[optionName] = [];
                    }
                } else {
                    for(var i = 3; i < 6; i++) {
                        // Find the first group that matched
                        if (match[i] != undefined) {
                            options[optionName].push(match[i]);
                            break;
                        }
                    }
                    optionName = "_args";
                }
                match = this.argumentRegex.exec(argumentString);
            }
        }
        return options;
    },

    getOptionsAsQuery: function(options, names, f) {
        // Returns a query for a given option
        values = undefined;

        if(typeof(options) == "object" && typeof(names) == "object") {
            names.forEach(function(x) {
                if (options[x] != undefined) {
                    if (values == undefined) {
                        values = [];
                    }
                    values = values.concat(options[x]);
                }
            });
            
            if (values != undefined && typeof(f) == "function") {
                values = values.map(f);
            }
        }
        
        if(values == undefined) {
            return undefined;
        } else if(values.length == 0) {
            return true;
        } else if (values.length == 1) {
            return values[0];
        }
        return { $or: values };
    },

    addOptionsToQuery: function(queryObject, queryName, options, names, f) {
        // Adds a given option to the query object
        var query = this.getOptionsAsQuery(options, names, f);
        if (query != undefined) {
            if (typeof(queryName) == "string") {
                queryObject[queryName] = query;
            }
        }
    },

    ps: function(db, argumentString) {
        var headers = [
            "Thread ID",
            "Description",
            "Connection",
            "Op ID",
            "App Name",
            "Client",
            "S",
            "Active",
            "Time",
            "WaitLock",
            "Operation",
            "Plan",
            "Namespace"
        ];
        
        
        var rows = [];

        var options = this.parseOptions(argumentString);

        if (options["h"] != undefined || options["help"] != undefined) {
            print("Usage: ps [options]");
            print("Options:")
            print("  -a | --all                       Show all operations (this overrides all other options)");
            print("  -c | --client <ip/hostname>      Show process for client*");
            print("  -d | --description <description> Show processes with description");
            print("  -A | --active                    Show only active processes");
            print("  -r | --running <seconds>         Show only processes which have been running for a certain time");
            print("  -o | --op <operation>            Show commands running a certain operation");
            print("  -n | --ns <namespace>            Show commands running against a certain namespace*");
            print("  -x | --app <app name>            Show commands with a matching app name*");
            print("  -l | --locks                     Show commands waiting for a lock");
            print("  -C | --collection <name>         Search the given collection instead of calling db.currentOp()");
            print("  -v | --verbose                   Print the query that is being run");
            print("Note: Options marked with * will return all operations that start with the provided value.");
            return;
        }

        var connectionOptions = {};
        if (options["a"] == undefined && options["all"] == undefined) {
            connectionOptions.connectionId = { $exists: true };
        } else {
            connectionOptions["$all"] = true;
        }
        this.addOptionsToQuery(connectionOptions, "desc", options, ["d","description","desc"]);
        this.addOptionsToQuery(connectionOptions, "active", options, ["A","active"]);
        this.addOptionsToQuery(connectionOptions, "secs_running", options, ["r","running"], function(x) { return { $gt: x }; });
        this.addOptionsToQuery(connectionOptions, "op", options, ["o","op"]);
        this.addOptionsToQuery(connectionOptions, "ns", options, ["n","ns"], function(x) { return { $regex: "^" + x.replace(/\$/g, "\\$") } });
        this.addOptionsToQuery(connectionOptions, "appName", options, ["x","app"], function(x) { return { $regex: new RegExp(x.replace(/\$/g, "\\$"), "i") } });
        this.addOptionsToQuery(connectionOptions, "waitingForLock", options, ["l","locks"]);
        var clientQuery = this.getOptionsAsQuery(options, ["c","client"], function(x) { return { $regex: "^" + x } });
        if (clientQuery != undefined) {
            // This one search two separate fields, which makes it more complicated
            var oldQueryString = JSON.stringify(connectionOptions);
            var q1 = JSON.parse(oldQueryString);
            var q2 = JSON.parse(oldQueryString);
            q1.client = clientQuery;
            q2.client_s = clientQuery;
            connectionOptions = { $or: [ q1, q2 ] };
        }

        if(options["v"] != undefined || options["verbose"] != undefined) {
            print("Query: " + tojson(connectionOptions));
        }

        var connections = [];
        var customCollection = (options["C"] || options["collection"] || [])[0];
        if (customCollection != undefined) {
            connections = db[customCollection].find(connectionOptions);
        } else {
            connections = db.currentOp(connectionOptions).inprog;
        }
        
        connections.forEach(function(op) {
            var threadId = op.threadId || "";
            var description = op.desc || "";
            var connectionId = op.connectionId || "";
            var opId = op.opid || "";
            var appName = op.appName || "";
            var client = op.client || op.client_s || "";
            var isMongos = op.client_s ? "S" : "";
            var active = op.active ? "Active" : "Idle";
            var time = op.secs_running || "";
            var waitingForLock = op.waitingForLock ? "Yes" : "No";
            var opName = op.op || "";
            var plan = op.planSummary || "";
            var ns = op.ns || "";
            
            rows.push([
                threadId,
                description,
                connectionId,
                opId,
                appName,
                client,
                isMongos,
                active,
                time,
                waitingForLock,
                opName,
                plan,
                ns
            ]);
        });
        
        this.printTable(headers, rows);
        
    },
    
    kill: function(db, opId) {
        return db.killOp(opId);
    },
};

function ps(argumentString) {
    psHack.ps(db, argumentString);
}

function kill(argumentString) {
    psHack.kill(db, argumentString);
}
    
shellHelper.ps = ps;
shellHelper.kill = kill;

// End PS Hack
setVerboseShell(mongo_hacker_config.verbose_shell);

DBQuery.prototype._prettyShell = true

DB.prototype._getExtraInfo = function(action) {
    if ( typeof _verboseShell === 'undefined' || !_verboseShell ) {
        __callLastError = true;
        return;
    }

    // explicit w:1 so that replset getLastErrorDefaults aren't used here which would be bad.
    var startTime = new Date().getTime();
    var res = this.getLastErrorCmd(1);
    if (res) {
        if (res.err !== undefined && res.err !== null) {
            // error occurred, display it
            print(res.err);
            return;
        }

        var info = action + " ";
        // hack for inserted because res.n is 0
        info += action != "Inserted" ? res.n : 1;
        if (res.n > 0 && res.updatedExisting !== undefined) info += " " + (res.updatedExisting ? "existing" : "new");
        info += " record(s) in ";
        var time = new Date().getTime() - startTime;
        var slowms = getSlowms();
        if (time > slowms) {
            info += colorize(time + "ms", { color: 'red', bright: true });
        } else {
            info += colorize(time + "ms", { color: 'green', bright: true });
        }
        print(info);
    }
};
//----------------------------------------------------------------------------
// Randomise API
//----------------------------------------------------------------------------

function randomWord(length, words, seed){
    /* Return a random word(s).
        length: length of each word (default is 5 letters).
        words: number of words (default is 1 word).
        seed: a word to be planted randomly amongst the word(s), good for search. (optional)
    */
    words = typeof words !== 'undefined' ? words : 1;
    length = typeof length !== 'undefined' ? length : 5;
    var seedOn = typeof seed !== 'undefined';
    var text = "";
    var possible ="abcdefghijklmnopqrstuvwxyz";
    var firstword = true;
    for (var j=0; j < words; j++){
        var word = "";
        for (var i=0; i < length; i++){
            word += possible.charAt(Random.randInt(possible.length));
        }
        /* Plant a seeded word */
        if (seedOn == true){
            var randomBool = Random.rand() >= 0.8;
            if (randomBool == true){
                if (firstword == true){ text = seed; firstword = false;}
                else {text += " " + seed;}
                seedOn = false;
            }
        }
        if (firstword == true){ text = word; firstword = false;}
        else {text += " " + word;}
    }
    return text;
};

function randomNumber(max){
    /* Return a random number
        max: highest random number (default is 100).
    */
    max = typeof max !== 'undefined' ? max : 100;
    return Random.randInt(max);
};

function randomDate(start, end){
    /* Return a random date between start and end values. 
       start: Date(), default 2 years ago. 
       end: Date(), default today.
    */
    end = typeof end !== 'undefined' ? end : new Date();
    if (typeof start === 'undefined') { 
        start = new Date(end.getTime());
        start.setYear(start.getFullYear() - 2);
    }
    return new Date(start.getTime() + Random.randInt(end.getTime() - start.getTime()));
};
//----------------------------------------------------------------------------
// API Additions
//----------------------------------------------------------------------------
DBQuery.prototype.fields = function( fields ) {
    this._fields = fields;
    return this;
};

DBQuery.prototype.select = function( fields ){
    this._fields = fields;
    return this;
};

DBQuery.prototype.one = function(){
    return this.limit(1)[0];
};

DBQuery.prototype.first = function(field){
    var field = field || "$natural";
    var sortBy = {};
    sortBy[field] = 1;
    return this.sort(sortBy).one();
}

DBQuery.prototype.reverse = function( field ){
    var field = field || "$natural";
    var sortBy = {};
    sortBy[field] = -1;
    return this.sort(sortBy);
}

DBQuery.prototype.last = function( field ){
    var field = field || "$natural";
    return this.reverse(field).one();
}

DB.prototype.rename = function(newName) {
    if(newName == this.getName() || newName.length === 0)
        return;

    this.copyDatabase(this.getName(), newName, "localhost");
    this.dropDatabase();
    db = this.getSiblingDB(newName);
};

DB.prototype.indexStats = function(collectionFilter, details){

    details = details || false;

    collectionNames = db.getCollectionNames().filter(function (collectionName) {
        // exclude "system" collections from "count" operation

        if (!collectionFilter) {
            return !collectionName.startsWith('system.');
        }

        if (collectionName == collectionFilter) {
            return !collectionName.startsWith('system.');
        }
    });
    documentIndexes = collectionNames.map(function (collectionName) {
        var count = db.getCollection(collectionName).count();
        return (count.commify() + " document(s)");
    });

    columnSeparator = mongo_hacker_config['column_separator'];

    assert(collectionNames.length == documentIndexes.length);

    maxKeyLength   = maxLength(collectionNames);
    maxValueLength = maxLength(documentIndexes);

    for (i = 0; i < collectionNames.length; i++) {
        print(
            colorize(collectionNames[i].pad(maxKeyLength, true), mongo_hacker_config['colors']['collectionNames'])
            + " " + columnSeparator + " "
            + documentIndexes[i].pad(maxValueLength)
        );

        var stats = db.getCollection(collectionNames[i]).stats();
        var totalIndexSize = (Math.round((stats.totalIndexSize / 1024 / 1024) * 10) / 10) + " MB";

        var indexNames = [];
        var indexSizes = [];
        for (indexName in stats.indexSizes) {
            indexSizes.push((Math.round((stats.indexSizes[indexName] / 1024 / 1024) * 10) / 10) + " MB");
            indexNames.push("  " + indexName);
        }

        maxIndexKeyLength   = maxLength(indexNames);
        maxIndexValueLength = maxLength(indexSizes);

        print(
            colorize("totalIndexSize".pad(maxKeyLength, true), mongo_hacker_config['colors']['string'])
            + " " + columnSeparator + " "
            + colorize(totalIndexSize.pad(maxValueLength), mongo_hacker_config['colors']['number'])
        );

        if (details) {
            for (var j = 0; j < indexSizes.length; j++) {
                print(
                    colorize("" + indexNames[j].pad(maxIndexKeyLength, true), mongo_hacker_config['colors']['string'])
                    + " " + columnSeparator + " "
                    + colorize(indexSizes[j].pad(maxIndexValueLength), mongo_hacker_config['colors']['binData'])
                );
            };
        }
    }

    return "";
}

Mongo.prototype.getDatabaseNames = function() {
    // this API addition gives us the following convenience function:
    //
    //   db.getMongo().getDatabaseNames()
    //
    // which is similar in use to:
    //
    //   db.getCollectionNames()
    //
    // mongo-hacker FTW :-)
    return this.getDBs().databases.reduce(function(names, db) {
        return names.concat(db.name);
    }, []);
}

//----------------------------------------------------------------------------
// API Modifications (additions and changes)
//----------------------------------------------------------------------------

// Add upsert method which has upsert set as true and multi as false
DBQuery.prototype.upsert = function( upsert ){
    assert( upsert , "need an upsert object" );

    this._validate(upsert);
    this._db._initExtraInfo();
    this._mongo.update( this._ns , this._query , upsert , true , false );
    this._db._getExtraInfo("Upserted");
};

// Updates are always multi and never an upsert
DBQuery.prototype.update = function( update ){
    assert( update , "need an update object" );

    this._checkMulti();
    this._validate(update);
    this._db._initExtraInfo();
    this._mongo.update( this._ns , this._query , update , false , true );
    this._db._getExtraInfo("Updated");
};

// Replace one document
DBQuery.prototype.replace = function( replacement ){
    assert( replacement , "need an update object" );

    this._validate(replacement);
    this._db._initExtraInfo();
    this._mongo.update( this._ns , this._query , replacement , false , false );
    this._db._getExtraInfo("Replaced");
};

// Remove is always multi
DBQuery.prototype.remove = function(){
    for ( var k in this._query ){
        if ( k == "_id" && typeof( this._query[k] ) == "undefined" ){
            throw "can't have _id set to undefined in a remove expression";
        }
    }

    this._checkMulti();
    this._db._initExtraInfo();
    this._mongo.remove( this._ns , this._query , false );
    this._db._getExtraInfo("Removed");
};

//----------------------------------------------------------------------------
// Full Text Search
//----------------------------------------------------------------------------
DBQuery.prototype.textSearch = function( search ) {
    var text = {
        text: this._collection.getName(),
        search: search,
        filter: this._query,
        project: this._fields,
        limit: this._limit
    }

    var result = this._db.runCommand( text );
    return result.results;
};
sh.getRecentMigrations = function () {
    var configDB = db.getSiblingDB("config");
    var yesterday = new Date( new Date() - 24 * 60 * 60 * 1000 );
    var result = [];
    result = result.concat(configDB.changelog.aggregate( [
        { $match : { time : { $gt : yesterday }, what : "moveChunk.from", "details.errmsg" : {
            "$exists" : false } } },
        { $group : { _id: { msg: "$details.errmsg" }, count : { "$sum":1 } } },
        { $project : { _id : { $ifNull: [ "$_id.msg", "Success" ] }, count : "$count" } }
    ] ).result);
    result = result.concat(configDB.changelog.aggregate( [
        { $match : { time : { $gt : yesterday }, what : "moveChunk.from", "details.errmsg" : {
            "$exists" : true } } },
        { $group : { _id: { msg: "$details.errmsg", from : "$details.from", to: "$details.to" },
            count : { "$sum":1 } } },
        { $project : { _id : "$_id.msg" , from : "$_id.from", to : "$_id.to" , count : "$count" } }
    ] ).result);
    return result;
};

printShardingStatus = function( configDB , verbose ){
    if (configDB === undefined)
        configDB = db.getSisterDB('config')

    var version = configDB.getCollection( "version" ).findOne();
    if ( version == null ){
        print( "printShardingStatus: this db does not have sharding enabled. be sure you are",
                "connecting to a mongos from the shell and not to a mongod." );
        return;
    }

    var raw = "";
    var output = function(s){
        raw += s + "\n";
    }
    output( "--- Sharding Status --- " );
    output( "  sharding version: " + tojson( configDB.getCollection( "version" ).findOne(), "  " ) );

    output( "  shards:" );
    configDB.shards.find().sort( { _id : 1 } ).forEach(
        function(z){
            output( "    " + tojsononeline( z ) );
        }
    );

    // All of the balancer information functions below depend on a connection to a liveDB
    // This isn't normally a problem, but can cause issues in testing and running with --nodb
    if ( typeof db !== "undefined" ) {
        output( "  balancer:" );

        //Is the balancer currently enabled
        output( "\tCurrently enabled:  " + ( sh.getBalancerState() ?
            colorize("yes", {color: "cyan"}) :
            colorize("no",  {color: "red"}) ) );

        //Is the balancer currently active
        output( "\tCurrently running:  " +
            colorize(( sh.isBalancerRunning() ? "yes" : "no" ), {color: "gray"}) );

        //Output details of the current balancer round
        var balLock = sh.getBalancerLockDetails();
        if ( balLock ) {
            output( "\t\tBalancer lock taken at " +
                colorize(balLock.when, {color: "gray"}) + " by " +
                colorize(balLock.who,  {color: "cyan"}) );
        }

        //Output the balancer window
        var balSettings = sh.getBalancerWindow();
        if ( balSettings ) {
            output( "\t\tBalancer active window is set between " +
                colorize(balSettings.start, {color: "gray"}) + " and " +
                colorize(balSettings.stop,  {color: "gray"}) + " server local time");
        }

        //Output the list of active migrations
        var activeMigrations = sh.getActiveMigrations();
        if (activeMigrations.length > 0 ){
            output("\tCollections with active migrations: ");
            activeMigrations.forEach( function(migration){
                output("\t\t" + 
                    colorize(migration._id,  {color: "cyan"})+ " started at " + 
                    colorize(migration.when, {color: "gray"}) );
            });
        }

        // Actionlog and version checking only works on 2.7 and greater
        var versionHasActionlog = false;
        var metaDataVersion = configDB.getCollection("version").findOne().currentVersion;
        if ( metaDataVersion > 5 ) {
            versionHasActionlog = true;
        }
        if ( metaDataVersion == 5 ) {
            var verArray = db.serverBuildInfo().versionArray;
            if (verArray[0] == 2 && verArray[1] > 6){
                versionHasActionlog = true;
            }
        }

        if ( versionHasActionlog ) {
            //Review config.actionlog for errors
            var actionReport = sh.getRecentFailedRounds();
            //Always print the number of failed rounds
            output( "\tFailed balancer rounds in last 5 attempts:  " + 
                colorize(actionReport.count, {color: "red"}) );

            //Only print the errors if there are any
            if ( actionReport.count > 0 ){
                output( "\tLast reported error:  "    + actionReport.lastErr );
                output( "\tTime of Reported error:  " + actionReport.lastTime );
            }

            output("\tMigration Results for the last 24 hours: ");
            var migrations = sh.getRecentMigrations();
            if(migrations.length > 0) {
                migrations.forEach( function(x) {
                    if (x._id === "Success"){
                        output( "\t\t" + colorize(x.count, {color: "gray"}) + 
                            " : "+ colorize(x._id, {color: "cyan"}));
                    } else {
                        output( "\t\t" + colorize(x.count, {color: "gray"}) + 
                            " : Failed with error '" + colorize(x._id, {color: "red"}) +
                        "', from " + x.from + " to " + x.to );
                    }
                });
            } else {
                    output( "\t\tNo recent migrations");
            }
        }
    }

    output( "  databases:" );
    configDB.databases.find().sort( { name : 1 } ).forEach(
        function(db){
            output( "    " + tojsononeline(db,"",true) );

            if (db.partitioned){
                configDB.collections.find( { _id : new RegExp( "^" +
                    RegExp.escape(db._id) + "\\." ) } ).
                    sort( { _id : 1 } ).forEach( function( coll ){
                        if ( coll.dropped == false ){
                            output( "    " + coll._id );
                            output( "      shard key: " + tojson(coll.key, 0, true) );
                            output( "      chunks:" );

                            res = configDB.chunks.aggregate(
                                { "$match": { ns: coll._id } },
                                { "$group": { _id: "$shard", nChunks: { "$sum": 1 } } },
                                { "$project" : { _id : 0 , shard : "$_id" , nChunks : "$nChunks" } },
                                { "$sort" : { shard : 1 } }
                            ).result

                            var totalChunks = 0;
                            res.forEach( function(z){
                                totalChunks += z.nChunks;
                                output( "        " + z.shard + ": " + z.nChunks );
                            } )

                            if ( totalChunks < 20 || verbose ){
                                configDB.chunks.find( { "ns" : coll._id } ).sort( { min : 1 } ).forEach(
                                    function(chunk){
                                        output( "        " +
                                            tojson( chunk.min, 0, true) + " -> " +
                                            tojson( chunk.max, 0, true ) +
                                            " on: " + colorize(chunk.shard, {color: 'cyan'}) + " " + tojson( chunk.lastmod ) + " " +
                                            ( chunk.jumbo ? "jumbo " : "" )
                                        );
                                    }
                                );
                            }
                            else {
                                output( "\t\t\ttoo many chunks to print, use verbose if you want to force print" );
                            }

                            configDB.tags.find( { ns : coll._id } ).sort( { min : 1 } ).forEach(
                                function( tag ) {
                                    output( "        tag: " + tag.tag + "  " + tojson( tag.min ) + " -> " + tojson( tag.max ) );
                                }
                            )
                        }
                    }
                )
            }
        }
    );

    print( raw );
}
// helper function to format delta counts
function delta(currentCount, previousCount) {
    var delta = Number(currentCount - previousCount);
    var formatted_delta;
    if (isNaN(delta)) {
      formatted_delta = colorize("(first count)", { color: 'blue' });
    } else if (delta == 0) {
      formatted_delta = colorize("(=)", { color: 'blue' });
    } else if (delta > 0) {
      formatted_delta = colorize("(+" + delta.commify() + ")", { color: 'green' });
    } else if (delta < 0) {
      formatted_delta = colorize("(" + delta.commify() + ")", { color: 'red' });
    } else {
      formatted_delta = (delta + " not supported");
    }
    return formatted_delta;
}

// global variable (to ensure "persistence" of document counts)
shellHelper.previousDocumentCount = {};

// "count documents", a bit akin to "show collections"
shellHelper.count = function (what) {
    assert(typeof what == "string");

    var args = what.split( /\s+/ );
    what = args[0]
    args = args.splice(1)

    if (what == "collections" || what == "tables") {
        databaseNames = db.getMongo().getDatabaseNames();
        collectionCounts = databaseNames.map(function (databaseName) {
            var count = db.getMongo().getDB(databaseName).getCollectionNames().length;
            return (count.commify() + " collection(s)");
        });
        databaseNames = colorizeAll(databaseNames, mongo_hacker_config['colors']['databaseNames']);
        printPaddedColumns(databaseNames, collectionCounts);
        return "";
    }

    if (what == "documents" || what == "docs") {
        collectionNames = db.getCollectionNames().filter(function (collectionName) {
            // exclude "system" collections from "count" operation
            return !collectionName.startsWith('system.');
        });
        documentCounts = collectionNames.map(function (collectionName) {
            var count = db.getCollection(collectionName).count();
            return (count.commify() + " document(s)");
        });
        deltaCounts = collectionNames.map(function (collectionName) {
            // retrieve the previous document count for this collection
            var previous = shellHelper.previousDocumentCount[collectionName];
            // determine the current document count for this collection
            var current = db.getCollection(collectionName).count();
            // update the stored document count for this collection
            shellHelper.previousDocumentCount[collectionName] = current;
            // format the delta since last count
            return delta(current, previous);
        });
        collectionNames = colorizeAll(collectionNames, mongo_hacker_config['colors']['collectionNames']);
        if (mongo_hacker_config['count_deltas']) {
            printPaddedColumns(collectionNames, documentCounts, deltaCounts);
        } else {
            printPaddedColumns(collectionNames, documentCounts);
        }

        return "";
    }

    if (what == "index" || what == "indexes") {
        db.indexStats("", 1);
        return ""
    }

    throw "don't know how to count [" + what + "]";

}
