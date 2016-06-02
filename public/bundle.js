"use strict";

angular.module("domoApp", ["ui.router", 'ui.bootstrap']);
"use strict";

angular.module("domoApp", ["ui.router", 'ui.bootstrap']).config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {

  $stateProvider.state('home', {
    url: '/home',
    templateUrl: './app/components/home/homeTmpl.html',
    controller: 'loginCtrl'
  }).state('dashboard', {
    url: '/dashboard',
    templateUrl: './app/components/dashboard/dashboardTmpl.html',
    controller: 'dashboardCtrl',
    resolve: {
      checkAuth: ["$state", "dashboardService", function checkAuth($state, dashboardService) {
        dashboardService.checkAuth().then(function (response) {
          console.log(response);
          if (response === 'unauthorized') {
            $state.go('home');
          }
          return response.data;
        });
      }]
    }
  });

  $urlRouterProvider.otherwise('/home');
}]);
"use strict";

angular.module("domoApp").controller("loginCtrl", ["$scope", "loginService", "$state", function ($scope, loginService, $state) {

  $scope.register = function () {
    loginService.register($scope.newUser).then(function (response) {
      clear();
    });
  };

  $scope.login = function () {
    loginService.login($scope.credentials).then(function (response) {
      $state.go('dashboard');
      $scope.user = response.data._id;
      $scope.credentials = null;
      alert("Welcome " + response.data.firstname + " " + response.data.lastname);
    });
  };

  var clear = function clear() {
    $scope.newUser = null;
    return alert("account creation successful");
  };
}]);
"use strict";

angular.module("domoApp").service("loginService", ["$http", function ($http) {

  this.register = function (user) {
    return $http({
      method: "POST",
      url: '/users',
      data: user
    }).then(function (response) {
      return response;
    });
  };

  this.login = function (user) {
    return $http({
      method: "POST",
      url: "/login",
      data: user
    }).then(function (response) {
      return response;
    });
  };

  this.getUsers = function () {
    return $http({
      method: 'GET',
      url: '/users'
    }).then(function (response) {
      return response;
    });
  };
}]);
'use strict';

angular.module('domoApp').directive('navDirective', function () {

  return {
    restrict: 'E',
    templateUrl: './app/shared/nav/navTmpl.html'
  };
});
'use strict';

angular.module('domoApp').controller('dashboardCtrl', ["$scope", "$log", "checkAuth", "mainService", "$state", function ($scope, $log, checkAuth, mainService, $state) {

    //drop down
    // $scope.appendToEl = angular.element(document.querySelector('#dropdown-long-content'));
    //create card
    $scope.createCard = function (newTitle) {
        console.log("working");
        mainService.createCard(newTitle).then(function (response) {
            $scope.readCard();
        });
    };
    $scope.readCard = function () {
        mainService.readCard().then(function (response) {
            $scope.cards = response;
        });
    };
    $scope.readCard();
    // $scope.user = user;

    $scope.getCardByUser = function () {
        mainService.getCardByUser(). /*$scope.user._id*/then(function (results) {
            $scope.userCards = results;
        });
    };
    $scope.getCardByUser();
}]);
'use strict';

angular.module('domoApp').service('dashboardService', ["$http", function ($http) {

  this.checkAuth = function () {
    console.log('service');
    return $http({
      method: 'GET',
      url: '/checkAuth'
    }).then(function (response) {
      return response.data;
    });
  };
}]);
'use strict';

angular.module('domoApp').service('mainService', ["$http", function ($http) {

    this.createCard = function (newTitle) {
        return $http({
            method: "POST",
            url: "/card",
            data: {
                title: newTitle
            }
        }).then(function (response) {
            return response.data;
        });
    };
    this.readCard = function () {
        return $http({
            method: "GET",
            url: "/card"
        }).then(function (response) {
            return response.data;
        });
    };
    this.getCardByUser = function (id) {
        return $http.get('/card?user=' + id).then(function (response) {
            return response.data;
        });
    };
}]);
'use strict';

angular.module('domoApp').controller('mainCtrl', ["$scope", function ($scope) {}]);
'use strict';

//this will parse data from JSON into usable data for D3.

/**
 * Maps the spreadsheet cells into a dataframe, consisting of an array of rows (i.e. a 2d array)
 * In many cases we have empty rows or incomplete rows, so you can skip those by including
 * the realrowlength parameter - it will skip any rows that don't have this length.
 * Alternatively, you can just choose to skip the first 'n' rows by setting the skip parameter.
 */

//to use this data, do var dataframe = mapEntries(data,row_length,skip); in the code
//  Where:
// data is the JSON object returned from the API
// row_length allows you to specify whether to restrict the data set to only rows with this number of cells (useful for ommitting summary rows), or set this to null to return rows of any number of cells.
// skip is the number of rows to skip at the beginning of the spreadsheet.
// The function will return an array of arrays (i.e. a two-dimensional array) representing the spreadsheet cells. This makes it much easier to then process the cells using D3js.
function mapEntries(json, realrowlength, skip) {
  if (!skip) skip = 0;
  var dataframe = new Array();

  var row = new Array();
  for (var i = 0; i < json.feed.entry.length; i++) {
    var entry = json.feed.entry[i];
    if (entry.gs$cell.col == '1') {
      if (row != null) {
        if ((!realrowlength || row.length === realrowlength) && skip === 0) {
          dataframe.push(row);
        } else {
          if (skip > 0) skip--;
        }
      }
      var row = new Array();
    }
    row.push(entry.content.$t);
  }
  dataframe.push(row);
  return dataframe;
}
"use strict";

/**
JSZip - A Javascript class for generating and reading zip files
<http://stuartk.com/jszip>
(c) 2009-2012 Stuart Knightley <stuart [at] stuartk.com>
Dual licenced under the MIT license or GPLv3. See LICENSE.markdown.
Usage:
   zip = new JSZip();
   zip.file("hello.txt", "Hello, World!").file("tempfile", "nothing");
   zip.folder("images").file("smile.gif", base64Data, {base64: true});
   zip.file("Xmas.txt", "Ho ho ho !", {date : new Date("December 25, 2007 00:00:01")});
   zip.remove("tempfile");
   base64zip = zip.generate();
**/
// We use strict, but it should not be placed outside of a function because
// the environment is shared inside the browser.
// "use strict";

/**
 * Representation a of zip file in js
 * @constructor
 * @param {String=|ArrayBuffer=|Uint8Array=|Buffer=} data the data to load, if any (optional).
 * @param {Object=} options the options for creating this objects (optional).
 */
var JSZip = function JSZip(data, options) {
   // object containing the files :
   // {
   //   "folder/" : {...},
   //   "folder/data.txt" : {...}
   // }
   this.files = {};

   // Where we are in the hierarchy
   this.root = "";

   if (data) {
      this.load(data, options);
   }
};

JSZip.signature = {
   LOCAL_FILE_HEADER: "\x50\x4b\x03\x04",
   CENTRAL_FILE_HEADER: "\x50\x4b\x01\x02",
   CENTRAL_DIRECTORY_END: "\x50\x4b\x05\x06",
   ZIP64_CENTRAL_DIRECTORY_LOCATOR: "\x50\x4b\x06\x07",
   ZIP64_CENTRAL_DIRECTORY_END: "\x50\x4b\x06\x06",
   DATA_DESCRIPTOR: "\x50\x4b\x07\x08"
};

// Default properties for a new file
JSZip.defaults = {
   base64: false,
   binary: false,
   dir: false,
   date: null,
   compression: null
};

/*
 * List features that require a modern browser, and if the current browser support them.
 */
JSZip.support = {
   // contains true if JSZip can read/generate ArrayBuffer, false otherwise.
   arraybuffer: function () {
      return typeof ArrayBuffer !== "undefined" && typeof Uint8Array !== "undefined";
   }(),
   // contains true if JSZip can read/generate nodejs Buffer, false otherwise.
   nodebuffer: function () {
      return typeof Buffer !== "undefined";
   }(),
   // contains true if JSZip can read/generate Uint8Array, false otherwise.
   uint8array: function () {
      return typeof Uint8Array !== "undefined";
   }(),
   // contains true if JSZip can read/generate Blob, false otherwise.
   blob: function () {
      // the spec started with BlobBuilder then replaced it with a construtor for Blob.
      // Result : we have browsers that :
      // * know the BlobBuilder (but with prefix)
      // * know the Blob constructor
      // * know about Blob but not about how to build them
      // About the "=== 0" test : if given the wrong type, it may be converted to a string.
      // Instead of an empty content, we will get "[object Uint8Array]" for example.
      if (typeof ArrayBuffer === "undefined") {
         return false;
      }
      var buffer = new ArrayBuffer(0);
      try {
         return new Blob([buffer], { type: "application/zip" }).size === 0;
      } catch (e) {}

      try {
         var BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
         var builder = new BlobBuilder();
         builder.append(buffer);
         return builder.getBlob('application/zip').size === 0;
      } catch (e) {}

      return false;
   }()
};

JSZip.prototype = function () {
   var textEncoder, textDecoder;
   if (JSZip.support.uint8array && typeof TextEncoder === "function" && typeof TextDecoder === "function") {
      textEncoder = new TextEncoder("utf-8");
      textDecoder = new TextDecoder("utf-8");
   }

   /**
    * Returns the raw data of a ZipObject, decompress the content if necessary.
    * @param {ZipObject} file the file to use.
    * @return {String|ArrayBuffer|Uint8Array|Buffer} the data.
    */
   var getRawData = function getRawData(file) {
      if (file._data instanceof JSZip.CompressedObject) {
         file._data = file._data.getContent();
         file.options.binary = true;
         file.options.base64 = false;

         if (JSZip.utils.getTypeOf(file._data) === "uint8array") {
            var copy = file._data;
            // when reading an arraybuffer, the CompressedObject mechanism will keep it and subarray() a Uint8Array.
            // if we request a file in the same format, we might get the same Uint8Array or its ArrayBuffer (the original zip file).
            file._data = new Uint8Array(copy.length);
            // with an empty Uint8Array, Opera fails with a "Offset larger than array size"
            if (copy.length !== 0) {
               file._data.set(copy, 0);
            }
         }
      }
      return file._data;
   };

   /**
    * Returns the data of a ZipObject in a binary form. If the content is an unicode string, encode it.
    * @param {ZipObject} file the file to use.
    * @return {String|ArrayBuffer|Uint8Array|Buffer} the data.
    */
   var getBinaryData = function getBinaryData(file) {
      var result = getRawData(file),
          type = JSZip.utils.getTypeOf(result);
      if (type === "string") {
         if (!file.options.binary) {
            // unicode text !
            // unicode string => binary string is a painful process, check if we can avoid it.
            if (textEncoder) {
               return textEncoder.encode(result);
            }
            if (JSZip.support.nodebuffer) {
               return new Buffer(result, "utf-8");
            }
         }
         return file.asBinary();
      }
      return result;
   };

   /**
    * Transform this._data into a string.
    * @param {function} filter a function String -> String, applied if not null on the result.
    * @return {String} the string representing this._data.
    */
   var dataToString = function dataToString(asUTF8) {
      var result = getRawData(this);
      if (result === null || typeof result === "undefined") {
         return "";
      }
      // if the data is a base64 string, we decode it before checking the encoding !
      if (this.options.base64) {
         result = JSZip.base64.decode(result);
      }
      if (asUTF8 && this.options.binary) {
         // JSZip.prototype.utf8decode supports arrays as input
         // skip to array => string step, utf8decode will do it.
         result = JSZip.prototype.utf8decode(result);
      } else {
         // no utf8 transformation, do the array => string step.
         result = JSZip.utils.transformTo("string", result);
      }

      if (!asUTF8 && !this.options.binary) {
         result = JSZip.prototype.utf8encode(result);
      }
      return result;
   };
   /**
    * A simple object representing a file in the zip file.
    * @constructor
    * @param {string} name the name of the file
    * @param {String|ArrayBuffer|Uint8Array|Buffer} data the data
    * @param {Object} options the options of the file
    */
   var ZipObject = function ZipObject(name, data, options) {
      this.name = name;
      this._data = data;
      this.options = options;
   };

   ZipObject.prototype = {
      /**
       * Return the content as UTF8 string.
       * @return {string} the UTF8 string.
       */
      asText: function asText() {
         return dataToString.call(this, true);
      },
      /**
       * Returns the binary content.
       * @return {string} the content as binary.
       */
      asBinary: function asBinary() {
         return dataToString.call(this, false);
      },
      /**
       * Returns the content as a nodejs Buffer.
       * @return {Buffer} the content as a Buffer.
       */
      asNodeBuffer: function asNodeBuffer() {
         var result = getBinaryData(this);
         return JSZip.utils.transformTo("nodebuffer", result);
      },
      /**
       * Returns the content as an Uint8Array.
       * @return {Uint8Array} the content as an Uint8Array.
       */
      asUint8Array: function asUint8Array() {
         var result = getBinaryData(this);
         return JSZip.utils.transformTo("uint8array", result);
      },
      /**
       * Returns the content as an ArrayBuffer.
       * @return {ArrayBuffer} the content as an ArrayBufer.
       */
      asArrayBuffer: function asArrayBuffer() {
         return this.asUint8Array().buffer;
      }
   };

   /**
    * Transform an integer into a string in hexadecimal.
    * @private
    * @param {number} dec the number to convert.
    * @param {number} bytes the number of bytes to generate.
    * @returns {string} the result.
    */
   var decToHex = function decToHex(dec, bytes) {
      var hex = "",
          i;
      for (i = 0; i < bytes; i++) {
         hex += String.fromCharCode(dec & 0xff);
         dec = dec >>> 8;
      }
      return hex;
   };

   /**
    * Merge the objects passed as parameters into a new one.
    * @private
    * @param {...Object} var_args All objects to merge.
    * @return {Object} a new object with the data of the others.
    */
   var extend = function extend() {
      var result = {},
          i,
          attr;
      for (i = 0; i < arguments.length; i++) {
         // arguments is not enumerable in some browsers
         for (attr in arguments[i]) {
            if (arguments[i].hasOwnProperty(attr) && typeof result[attr] === "undefined") {
               result[attr] = arguments[i][attr];
            }
         }
      }
      return result;
   };

   /**
    * Transforms the (incomplete) options from the user into the complete
    * set of options to create a file.
    * @private
    * @param {Object} o the options from the user.
    * @return {Object} the complete set of options.
    */
   var prepareFileAttrs = function prepareFileAttrs(o) {
      o = o || {};
      /*jshint -W041 */
      if (o.base64 === true && o.binary == null) {
         o.binary = true;
      }
      /*jshint +W041 */
      o = extend(o, JSZip.defaults);
      o.date = o.date || new Date();
      if (o.compression !== null) o.compression = o.compression.toUpperCase();

      return o;
   };

   /**
    * Add a file in the current folder.
    * @private
    * @param {string} name the name of the file
    * @param {String|ArrayBuffer|Uint8Array|Buffer} data the data of the file
    * @param {Object} o the options of the file
    * @return {Object} the new file.
    */
   var fileAdd = function fileAdd(name, data, o) {
      // be sure sub folders exist
      var parent = parentFolder(name),
          dataType = JSZip.utils.getTypeOf(data);
      if (parent) {
         folderAdd.call(this, parent);
      }

      o = prepareFileAttrs(o);

      if (o.dir || data === null || typeof data === "undefined") {
         o.base64 = false;
         o.binary = false;
         data = null;
      } else if (dataType === "string") {
         if (o.binary && !o.base64) {
            // optimizedBinaryString == true means that the file has already been filtered with a 0xFF mask
            if (o.optimizedBinaryString !== true) {
               // this is a string, not in a base64 format.
               // Be sure that this is a correct "binary string"
               data = JSZip.utils.string2binary(data);
            }
         }
      } else {
         // arraybuffer, uint8array, ...
         o.base64 = false;
         o.binary = true;

         if (!dataType && !(data instanceof JSZip.CompressedObject)) {
            throw new Error("The data of '" + name + "' is in an unsupported format !");
         }

         // special case : it's way easier to work with Uint8Array than with ArrayBuffer
         if (dataType === "arraybuffer") {
            data = JSZip.utils.transformTo("uint8array", data);
         }
      }

      var object = new ZipObject(name, data, o);
      this.files[name] = object;
      return object;
   };

   /**
    * Find the parent folder of the path.
    * @private
    * @param {string} path the path to use
    * @return {string} the parent folder, or ""
    */
   var parentFolder = function parentFolder(path) {
      if (path.slice(-1) == '/') {
         path = path.substring(0, path.length - 1);
      }
      var lastSlash = path.lastIndexOf('/');
      return lastSlash > 0 ? path.substring(0, lastSlash) : "";
   };

   /**
    * Add a (sub) folder in the current folder.
    * @private
    * @param {string} name the folder's name
    * @return {Object} the new folder.
    */
   var folderAdd = function folderAdd(name) {
      // Check the name ends with a /
      if (name.slice(-1) != "/") {
         name += "/"; // IE doesn't like substr(-1)
      }

      // Does this folder already exist?
      if (!this.files[name]) {
         fileAdd.call(this, name, null, { dir: true });
      }
      return this.files[name];
   };

   /**
    * Generate a JSZip.CompressedObject for a given zipOject.
    * @param {ZipObject} file the object to read.
    * @param {JSZip.compression} compression the compression to use.
    * @return {JSZip.CompressedObject} the compressed result.
    */
   var generateCompressedObjectFrom = function generateCompressedObjectFrom(file, compression) {
      var result = new JSZip.CompressedObject(),
          content;

      // the data has not been decompressed, we might reuse things !
      if (file._data instanceof JSZip.CompressedObject) {
         result.uncompressedSize = file._data.uncompressedSize;
         result.crc32 = file._data.crc32;

         if (result.uncompressedSize === 0 || file.options.dir) {
            compression = JSZip.compressions['STORE'];
            result.compressedContent = "";
            result.crc32 = 0;
         } else if (file._data.compressionMethod === compression.magic) {
            result.compressedContent = file._data.getCompressedContent();
         } else {
            content = file._data.getContent();
            // need to decompress / recompress
            result.compressedContent = compression.compress(JSZip.utils.transformTo(compression.compressInputType, content));
         }
      } else {
         // have uncompressed data
         content = getBinaryData(file);
         if (!content || content.length === 0 || file.options.dir) {
            compression = JSZip.compressions['STORE'];
            content = "";
         }
         result.uncompressedSize = content.length;
         result.crc32 = this.crc32(content);
         result.compressedContent = compression.compress(JSZip.utils.transformTo(compression.compressInputType, content));
      }

      result.compressedSize = result.compressedContent.length;
      result.compressionMethod = compression.magic;

      return result;
   };

   /**
    * Generate the various parts used in the construction of the final zip file.
    * @param {string} name the file name.
    * @param {ZipObject} file the file content.
    * @param {JSZip.CompressedObject} compressedObject the compressed object.
    * @param {number} offset the current offset from the start of the zip file.
    * @return {object} the zip parts.
    */
   var generateZipParts = function generateZipParts(name, file, compressedObject, offset) {
      var data = compressedObject.compressedContent,
          utfEncodedFileName = this.utf8encode(file.name),
          useUTF8 = utfEncodedFileName !== file.name,
          o = file.options,
          dosTime,
          dosDate;

      // date
      // @see http://www.delorie.com/djgpp/doc/rbinter/it/52/13.html
      // @see http://www.delorie.com/djgpp/doc/rbinter/it/65/16.html
      // @see http://www.delorie.com/djgpp/doc/rbinter/it/66/16.html

      dosTime = o.date.getHours();
      dosTime = dosTime << 6;
      dosTime = dosTime | o.date.getMinutes();
      dosTime = dosTime << 5;
      dosTime = dosTime | o.date.getSeconds() / 2;

      dosDate = o.date.getFullYear() - 1980;
      dosDate = dosDate << 4;
      dosDate = dosDate | o.date.getMonth() + 1;
      dosDate = dosDate << 5;
      dosDate = dosDate | o.date.getDate();

      var header = "";

      // version needed to extract
      header += "\x0A\x00";
      // general purpose bit flag
      // set bit 11 if utf8
      header += useUTF8 ? "\x00\x08" : "\x00\x00";
      // compression method
      header += compressedObject.compressionMethod;
      // last mod file time
      header += decToHex(dosTime, 2);
      // last mod file date
      header += decToHex(dosDate, 2);
      // crc-32
      header += decToHex(compressedObject.crc32, 4);
      // compressed size
      header += decToHex(compressedObject.compressedSize, 4);
      // uncompressed size
      header += decToHex(compressedObject.uncompressedSize, 4);
      // file name length
      header += decToHex(utfEncodedFileName.length, 2);
      // extra field length
      header += "\x00\x00";

      var fileRecord = JSZip.signature.LOCAL_FILE_HEADER + header + utfEncodedFileName;

      var dirRecord = JSZip.signature.CENTRAL_FILE_HEADER +
      // version made by (00: DOS)
      "\x14\x00" +
      // file header (common to file and central directory)
      header +
      // file comment length
      "\x00\x00" +
      // disk number start
      "\x00\x00" +
      // internal file attributes TODO
      "\x00\x00" + (
      // external file attributes
      file.options.dir === true ? "\x10\x00\x00\x00" : "\x00\x00\x00\x00") +
      // relative offset of local header
      decToHex(offset, 4) +
      // file name
      utfEncodedFileName;

      return {
         fileRecord: fileRecord,
         dirRecord: dirRecord,
         compressedObject: compressedObject
      };
   };

   /**
    * An object to write any content to a string.
    * @constructor
    */
   var StringWriter = function StringWriter() {
      this.data = [];
   };
   StringWriter.prototype = {
      /**
       * Append any content to the current string.
       * @param {Object} input the content to add.
       */
      append: function append(input) {
         input = JSZip.utils.transformTo("string", input);
         this.data.push(input);
      },
      /**
       * Finalize the construction an return the result.
       * @return {string} the generated string.
       */
      finalize: function finalize() {
         return this.data.join("");
      }
   };
   /**
    * An object to write any content to an Uint8Array.
    * @constructor
    * @param {number} length The length of the array.
    */
   var Uint8ArrayWriter = function Uint8ArrayWriter(length) {
      this.data = new Uint8Array(length);
      this.index = 0;
   };
   Uint8ArrayWriter.prototype = {
      /**
       * Append any content to the current array.
       * @param {Object} input the content to add.
       */
      append: function append(input) {
         if (input.length !== 0) {
            // with an empty Uint8Array, Opera fails with a "Offset larger than array size"
            input = JSZip.utils.transformTo("uint8array", input);
            this.data.set(input, this.index);
            this.index += input.length;
         }
      },
      /**
       * Finalize the construction an return the result.
       * @return {Uint8Array} the generated array.
       */
      finalize: function finalize() {
         return this.data;
      }
   };

   // return the actual prototype of JSZip
   return {
      /**
       * Read an existing zip and merge the data in the current JSZip object.
       * The implementation is in jszip-load.js, don't forget to include it.
       * @param {String|ArrayBuffer|Uint8Array|Buffer} stream  The stream to load
       * @param {Object} options Options for loading the stream.
       *  options.base64 : is the stream in base64 ? default : false
       * @return {JSZip} the current JSZip object
       */
      load: function load(stream, options) {
         throw new Error("Load method is not defined. Is the file jszip-load.js included ?");
      },

      /**
       * Filter nested files/folders with the specified function.
       * @param {Function} search the predicate to use :
       * function (relativePath, file) {...}
       * It takes 2 arguments : the relative path and the file.
       * @return {Array} An array of matching elements.
       */
      filter: function filter(search) {
         var result = [],
             filename,
             relativePath,
             file,
             fileClone;
         for (filename in this.files) {
            if (!this.files.hasOwnProperty(filename)) {
               continue;
            }
            file = this.files[filename];
            // return a new object, don't let the user mess with our internal objects :)
            fileClone = new ZipObject(file.name, file._data, extend(file.options));
            relativePath = filename.slice(this.root.length, filename.length);
            if (filename.slice(0, this.root.length) === this.root && // the file is in the current root
            search(relativePath, fileClone)) {
               // and the file matches the function
               result.push(fileClone);
            }
         }
         return result;
      },

      /**
       * Add a file to the zip file, or search a file.
       * @param   {string|RegExp} name The name of the file to add (if data is defined),
       * the name of the file to find (if no data) or a regex to match files.
       * @param   {String|ArrayBuffer|Uint8Array|Buffer} data  The file data, either raw or base64 encoded
       * @param   {Object} o     File options
       * @return  {JSZip|Object|Array} this JSZip object (when adding a file),
       * a file (when searching by string) or an array of files (when searching by regex).
       */
      file: function file(name, data, o) {
         if (arguments.length === 1) {
            if (JSZip.utils.isRegExp(name)) {
               var regexp = name;
               return this.filter(function (relativePath, file) {
                  return !file.options.dir && regexp.test(relativePath);
               });
            } else {
               // text
               return this.filter(function (relativePath, file) {
                  return !file.options.dir && relativePath === name;
               })[0] || null;
            }
         } else {
            // more than one argument : we have data !
            name = this.root + name;
            fileAdd.call(this, name, data, o);
         }
         return this;
      },

      /**
       * Add a directory to the zip file, or search.
       * @param   {String|RegExp} arg The name of the directory to add, or a regex to search folders.
       * @return  {JSZip} an object with the new directory as the root, or an array containing matching folders.
       */
      folder: function folder(arg) {
         if (!arg) {
            return this;
         }

         if (JSZip.utils.isRegExp(arg)) {
            return this.filter(function (relativePath, file) {
               return file.options.dir && arg.test(relativePath);
            });
         }

         // else, name is a new folder
         var name = this.root + arg;
         var newFolder = folderAdd.call(this, name);

         // Allow chaining by returning a new object with this folder as the root
         var ret = this.clone();
         ret.root = newFolder.name;
         return ret;
      },

      /**
       * Delete a file, or a directory and all sub-files, from the zip
       * @param {string} name the name of the file to delete
       * @return {JSZip} this JSZip object
       */
      remove: function remove(name) {
         name = this.root + name;
         var file = this.files[name];
         if (!file) {
            // Look for any folders
            if (name.slice(-1) != "/") {
               name += "/";
            }
            file = this.files[name];
         }

         if (file) {
            if (!file.options.dir) {
               // file
               delete this.files[name];
            } else {
               // folder
               var kids = this.filter(function (relativePath, file) {
                  return file.name.slice(0, name.length) === name;
               });
               for (var i = 0; i < kids.length; i++) {
                  delete this.files[kids[i].name];
               }
            }
         }

         return this;
      },

      /**
       * Generate the complete zip file
       * @param {Object} options the options to generate the zip file :
       * - base64, (deprecated, use type instead) true to generate base64.
       * - compression, "STORE" by default.
       * - type, "base64" by default. Values are : string, base64, uint8array, arraybuffer, blob.
       * @return {String|Uint8Array|ArrayBuffer|Buffer|Blob} the zip file
       */
      generate: function generate(options) {
         options = extend(options || {}, {
            base64: true,
            compression: "STORE",
            type: "base64"
         });

         JSZip.utils.checkSupport(options.type);

         var zipData = [],
             localDirLength = 0,
             centralDirLength = 0,
             writer,
             i;

         // first, generate all the zip parts.
         for (var name in this.files) {
            if (!this.files.hasOwnProperty(name)) {
               continue;
            }
            var file = this.files[name];

            var compressionName = file.options.compression || options.compression.toUpperCase();
            var compression = JSZip.compressions[compressionName];
            if (!compression) {
               throw new Error(compressionName + " is not a valid compression method !");
            }

            var compressedObject = generateCompressedObjectFrom.call(this, file, compression);

            var zipPart = generateZipParts.call(this, name, file, compressedObject, localDirLength);
            localDirLength += zipPart.fileRecord.length + compressedObject.compressedSize;
            centralDirLength += zipPart.dirRecord.length;
            zipData.push(zipPart);
         }

         var dirEnd = "";

         // end of central dir signature
         dirEnd = JSZip.signature.CENTRAL_DIRECTORY_END +
         // number of this disk
         "\x00\x00" +
         // number of the disk with the start of the central directory
         "\x00\x00" +
         // total number of entries in the central directory on this disk
         decToHex(zipData.length, 2) +
         // total number of entries in the central directory
         decToHex(zipData.length, 2) +
         // size of the central directory   4 bytes
         decToHex(centralDirLength, 4) +
         // offset of start of central directory with respect to the starting disk number
         decToHex(localDirLength, 4) +
         // .ZIP file comment length
         "\x00\x00";

         // we have all the parts (and the total length)
         // time to create a writer !
         switch (options.type.toLowerCase()) {
            case "uint8array":
            case "arraybuffer":
            case "blob":
            case "nodebuffer":
               writer = new Uint8ArrayWriter(localDirLength + centralDirLength + dirEnd.length);
               break;
            // case "base64" :
            // case "string" :
            default:
               writer = new StringWriter(localDirLength + centralDirLength + dirEnd.length);
               break;
         }

         for (i = 0; i < zipData.length; i++) {
            writer.append(zipData[i].fileRecord);
            writer.append(zipData[i].compressedObject.compressedContent);
         }
         for (i = 0; i < zipData.length; i++) {
            writer.append(zipData[i].dirRecord);
         }

         writer.append(dirEnd);

         var zip = writer.finalize();

         switch (options.type.toLowerCase()) {
            // case "zip is an Uint8Array"
            case "uint8array":
            case "arraybuffer":
            case "nodebuffer":
               return JSZip.utils.transformTo(options.type.toLowerCase(), zip);
            case "blob":
               return JSZip.utils.arrayBuffer2Blob(JSZip.utils.transformTo("arraybuffer", zip));

            // case "zip is a string"
            case "base64":
               return options.base64 ? JSZip.base64.encode(zip) : zip;
            default:
               // case "string" :
               return zip;
         }
      },

      /**
       *
       *  Javascript crc32
       *  http://www.webtoolkit.info/
       *
       */
      crc32: function crc32(input, crc) {
         if (typeof input === "undefined" || !input.length) {
            return 0;
         }

         var isArray = JSZip.utils.getTypeOf(input) !== "string";

         var table = [0x00000000, 0x77073096, 0xEE0E612C, 0x990951BA, 0x076DC419, 0x706AF48F, 0xE963A535, 0x9E6495A3, 0x0EDB8832, 0x79DCB8A4, 0xE0D5E91E, 0x97D2D988, 0x09B64C2B, 0x7EB17CBD, 0xE7B82D07, 0x90BF1D91, 0x1DB71064, 0x6AB020F2, 0xF3B97148, 0x84BE41DE, 0x1ADAD47D, 0x6DDDE4EB, 0xF4D4B551, 0x83D385C7, 0x136C9856, 0x646BA8C0, 0xFD62F97A, 0x8A65C9EC, 0x14015C4F, 0x63066CD9, 0xFA0F3D63, 0x8D080DF5, 0x3B6E20C8, 0x4C69105E, 0xD56041E4, 0xA2677172, 0x3C03E4D1, 0x4B04D447, 0xD20D85FD, 0xA50AB56B, 0x35B5A8FA, 0x42B2986C, 0xDBBBC9D6, 0xACBCF940, 0x32D86CE3, 0x45DF5C75, 0xDCD60DCF, 0xABD13D59, 0x26D930AC, 0x51DE003A, 0xC8D75180, 0xBFD06116, 0x21B4F4B5, 0x56B3C423, 0xCFBA9599, 0xB8BDA50F, 0x2802B89E, 0x5F058808, 0xC60CD9B2, 0xB10BE924, 0x2F6F7C87, 0x58684C11, 0xC1611DAB, 0xB6662D3D, 0x76DC4190, 0x01DB7106, 0x98D220BC, 0xEFD5102A, 0x71B18589, 0x06B6B51F, 0x9FBFE4A5, 0xE8B8D433, 0x7807C9A2, 0x0F00F934, 0x9609A88E, 0xE10E9818, 0x7F6A0DBB, 0x086D3D2D, 0x91646C97, 0xE6635C01, 0x6B6B51F4, 0x1C6C6162, 0x856530D8, 0xF262004E, 0x6C0695ED, 0x1B01A57B, 0x8208F4C1, 0xF50FC457, 0x65B0D9C6, 0x12B7E950, 0x8BBEB8EA, 0xFCB9887C, 0x62DD1DDF, 0x15DA2D49, 0x8CD37CF3, 0xFBD44C65, 0x4DB26158, 0x3AB551CE, 0xA3BC0074, 0xD4BB30E2, 0x4ADFA541, 0x3DD895D7, 0xA4D1C46D, 0xD3D6F4FB, 0x4369E96A, 0x346ED9FC, 0xAD678846, 0xDA60B8D0, 0x44042D73, 0x33031DE5, 0xAA0A4C5F, 0xDD0D7CC9, 0x5005713C, 0x270241AA, 0xBE0B1010, 0xC90C2086, 0x5768B525, 0x206F85B3, 0xB966D409, 0xCE61E49F, 0x5EDEF90E, 0x29D9C998, 0xB0D09822, 0xC7D7A8B4, 0x59B33D17, 0x2EB40D81, 0xB7BD5C3B, 0xC0BA6CAD, 0xEDB88320, 0x9ABFB3B6, 0x03B6E20C, 0x74B1D29A, 0xEAD54739, 0x9DD277AF, 0x04DB2615, 0x73DC1683, 0xE3630B12, 0x94643B84, 0x0D6D6A3E, 0x7A6A5AA8, 0xE40ECF0B, 0x9309FF9D, 0x0A00AE27, 0x7D079EB1, 0xF00F9344, 0x8708A3D2, 0x1E01F268, 0x6906C2FE, 0xF762575D, 0x806567CB, 0x196C3671, 0x6E6B06E7, 0xFED41B76, 0x89D32BE0, 0x10DA7A5A, 0x67DD4ACC, 0xF9B9DF6F, 0x8EBEEFF9, 0x17B7BE43, 0x60B08ED5, 0xD6D6A3E8, 0xA1D1937E, 0x38D8C2C4, 0x4FDFF252, 0xD1BB67F1, 0xA6BC5767, 0x3FB506DD, 0x48B2364B, 0xD80D2BDA, 0xAF0A1B4C, 0x36034AF6, 0x41047A60, 0xDF60EFC3, 0xA867DF55, 0x316E8EEF, 0x4669BE79, 0xCB61B38C, 0xBC66831A, 0x256FD2A0, 0x5268E236, 0xCC0C7795, 0xBB0B4703, 0x220216B9, 0x5505262F, 0xC5BA3BBE, 0xB2BD0B28, 0x2BB45A92, 0x5CB36A04, 0xC2D7FFA7, 0xB5D0CF31, 0x2CD99E8B, 0x5BDEAE1D, 0x9B64C2B0, 0xEC63F226, 0x756AA39C, 0x026D930A, 0x9C0906A9, 0xEB0E363F, 0x72076785, 0x05005713, 0x95BF4A82, 0xE2B87A14, 0x7BB12BAE, 0x0CB61B38, 0x92D28E9B, 0xE5D5BE0D, 0x7CDCEFB7, 0x0BDBDF21, 0x86D3D2D4, 0xF1D4E242, 0x68DDB3F8, 0x1FDA836E, 0x81BE16CD, 0xF6B9265B, 0x6FB077E1, 0x18B74777, 0x88085AE6, 0xFF0F6A70, 0x66063BCA, 0x11010B5C, 0x8F659EFF, 0xF862AE69, 0x616BFFD3, 0x166CCF45, 0xA00AE278, 0xD70DD2EE, 0x4E048354, 0x3903B3C2, 0xA7672661, 0xD06016F7, 0x4969474D, 0x3E6E77DB, 0xAED16A4A, 0xD9D65ADC, 0x40DF0B66, 0x37D83BF0, 0xA9BCAE53, 0xDEBB9EC5, 0x47B2CF7F, 0x30B5FFE9, 0xBDBDF21C, 0xCABAC28A, 0x53B39330, 0x24B4A3A6, 0xBAD03605, 0xCDD70693, 0x54DE5729, 0x23D967BF, 0xB3667A2E, 0xC4614AB8, 0x5D681B02, 0x2A6F2B94, 0xB40BBE37, 0xC30C8EA1, 0x5A05DF1B, 0x2D02EF8D];

         if (typeof crc == "undefined") {
            crc = 0;
         }
         var x = 0;
         var y = 0;
         var byte = 0;

         crc = crc ^ -1;
         for (var i = 0, iTop = input.length; i < iTop; i++) {
            byte = isArray ? input[i] : input.charCodeAt(i);
            y = (crc ^ byte) & 0xFF;
            x = table[y];
            crc = crc >>> 8 ^ x;
         }

         return crc ^ -1;
      },

      // Inspired by http://my.opera.com/GreyWyvern/blog/show.dml/1725165
      clone: function clone() {
         var newObj = new JSZip();
         for (var i in this) {
            if (typeof this[i] !== "function") {
               newObj[i] = this[i];
            }
         }
         return newObj;
      },

      /**
       * http://www.webtoolkit.info/javascript-utf8.html
       */
      utf8encode: function utf8encode(string) {
         // TextEncoder + Uint8Array to binary string is faster than checking every bytes on long strings.
         // http://jsperf.com/utf8encode-vs-textencoder
         // On short strings (file names for example), the TextEncoder API is (currently) slower.
         if (textEncoder) {
            var u8 = textEncoder.encode(string);
            return JSZip.utils.transformTo("string", u8);
         }
         if (JSZip.support.nodebuffer) {
            return JSZip.utils.transformTo("string", new Buffer(string, "utf-8"));
         }

         // array.join may be slower than string concatenation but generates less objects (less time spent garbage collecting).
         // See also http://jsperf.com/array-direct-assignment-vs-push/31
         var result = [],
             resIndex = 0;

         for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
               result[resIndex++] = String.fromCharCode(c);
            } else if (c > 127 && c < 2048) {
               result[resIndex++] = String.fromCharCode(c >> 6 | 192);
               result[resIndex++] = String.fromCharCode(c & 63 | 128);
            } else {
               result[resIndex++] = String.fromCharCode(c >> 12 | 224);
               result[resIndex++] = String.fromCharCode(c >> 6 & 63 | 128);
               result[resIndex++] = String.fromCharCode(c & 63 | 128);
            }
         }

         return result.join("");
      },

      /**
       * http://www.webtoolkit.info/javascript-utf8.html
       */
      utf8decode: function utf8decode(input) {
         var result = [],
             resIndex = 0;
         var type = JSZip.utils.getTypeOf(input);
         var isArray = type !== "string";
         var i = 0;
         var c = 0,
             c1 = 0,
             c2 = 0,
             c3 = 0;

         // check if we can use the TextDecoder API
         // see http://encoding.spec.whatwg.org/#api
         if (textDecoder) {
            return textDecoder.decode(JSZip.utils.transformTo("uint8array", input));
         }
         if (JSZip.support.nodebuffer) {
            return JSZip.utils.transformTo("nodebuffer", input).toString("utf-8");
         }

         while (i < input.length) {

            c = isArray ? input[i] : input.charCodeAt(i);

            if (c < 128) {
               result[resIndex++] = String.fromCharCode(c);
               i++;
            } else if (c > 191 && c < 224) {
               c2 = isArray ? input[i + 1] : input.charCodeAt(i + 1);
               result[resIndex++] = String.fromCharCode((c & 31) << 6 | c2 & 63);
               i += 2;
            } else {
               c2 = isArray ? input[i + 1] : input.charCodeAt(i + 1);
               c3 = isArray ? input[i + 2] : input.charCodeAt(i + 2);
               result[resIndex++] = String.fromCharCode((c & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
               i += 3;
            }
         }

         return result.join("");
      }
   };
}();

/*
 * Compression methods
 * This object is filled in as follow :
 * name : {
 *    magic // the 2 bytes indentifying the compression method
 *    compress // function, take the uncompressed content and return it compressed.
 *    uncompress // function, take the compressed content and return it uncompressed.
 *    compressInputType // string, the type accepted by the compress method. null to accept everything.
 *    uncompressInputType // string, the type accepted by the uncompress method. null to accept everything.
 * }
 *
 * STORE is the default compression method, so it's included in this file.
 * Other methods should go to separated files : the user wants modularity.
 */
JSZip.compressions = {
   "STORE": {
      magic: "\x00\x00",
      compress: function compress(content) {
         return content; // no compression
      },
      uncompress: function uncompress(content) {
         return content; // no compression
      },
      compressInputType: null,
      uncompressInputType: null
   }
};

(function () {
   JSZip.utils = {
      /**
       * Convert a string to a "binary string" : a string containing only char codes between 0 and 255.
       * @param {string} str the string to transform.
       * @return {String} the binary string.
       */
      string2binary: function string2binary(str) {
         var result = "";
         for (var i = 0; i < str.length; i++) {
            result += String.fromCharCode(str.charCodeAt(i) & 0xff);
         }
         return result;
      },
      /**
       * Create a Uint8Array from the string.
       * @param {string} str the string to transform.
       * @return {Uint8Array} the typed array.
       * @throws {Error} an Error if the browser doesn't support the requested feature.
       * @deprecated : use JSZip.utils.transformTo instead.
       */
      string2Uint8Array: function string2Uint8Array(str) {
         return JSZip.utils.transformTo("uint8array", str);
      },

      /**
       * Create a string from the Uint8Array.
       * @param {Uint8Array} array the array to transform.
       * @return {string} the string.
       * @throws {Error} an Error if the browser doesn't support the requested feature.
       * @deprecated : use JSZip.utils.transformTo instead.
       */
      uint8Array2String: function uint8Array2String(array) {
         return JSZip.utils.transformTo("string", array);
      },
      /**
       * Create a blob from the given ArrayBuffer.
       * @param {ArrayBuffer} buffer the buffer to transform.
       * @return {Blob} the result.
       * @throws {Error} an Error if the browser doesn't support the requested feature.
       */
      arrayBuffer2Blob: function arrayBuffer2Blob(buffer) {
         JSZip.utils.checkSupport("blob");

         try {
            // Blob constructor
            return new Blob([buffer], { type: "application/zip" });
         } catch (e) {}

         try {
            // deprecated, browser only, old way
            var BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
            var builder = new BlobBuilder();
            builder.append(buffer);
            return builder.getBlob('application/zip');
         } catch (e) {}

         // well, fuck ?!
         throw new Error("Bug : can't construct the Blob.");
      },
      /**
       * Create a blob from the given string.
       * @param {string} str the string to transform.
       * @return {Blob} the result.
       * @throws {Error} an Error if the browser doesn't support the requested feature.
       */
      string2Blob: function string2Blob(str) {
         var buffer = JSZip.utils.transformTo("arraybuffer", str);
         return JSZip.utils.arrayBuffer2Blob(buffer);
      }
   };

   /**
    * The identity function.
    * @param {Object} input the input.
    * @return {Object} the same input.
    */
   function identity(input) {
      return input;
   }

   /**
    * Fill in an array with a string.
    * @param {String} str the string to use.
    * @param {Array|ArrayBuffer|Uint8Array|Buffer} array the array to fill in (will be mutated).
    * @return {Array|ArrayBuffer|Uint8Array|Buffer} the updated array.
    */
   function stringToArrayLike(str, array) {
      for (var i = 0; i < str.length; ++i) {
         array[i] = str.charCodeAt(i) & 0xFF;
      }
      return array;
   }

   /**
    * Transform an array-like object to a string.
    * @param {Array|ArrayBuffer|Uint8Array|Buffer} array the array to transform.
    * @return {String} the result.
    */
   function arrayLikeToString(array) {
      // Performances notes :
      // --------------------
      // String.fromCharCode.apply(null, array) is the fastest, see
      // see http://jsperf.com/converting-a-uint8array-to-a-string/2
      // but the stack is limited (and we can get huge arrays !).
      //
      // result += String.fromCharCode(array[i]); generate too many strings !
      //
      // This code is inspired by http://jsperf.com/arraybuffer-to-string-apply-performance/2
      var chunk = 65536;
      var result = [],
          len = array.length,
          type = JSZip.utils.getTypeOf(array),
          k = 0;

      var canUseApply = true;
      try {
         switch (type) {
            case "uint8array":
               String.fromCharCode.apply(null, new Uint8Array(0));
               break;
            case "nodebuffer":
               String.fromCharCode.apply(null, new Buffer(0));
               break;
         }
      } catch (e) {
         canUseApply = false;
      }

      // no apply : slow and painful algorithm
      // default browser on android 4.*
      if (!canUseApply) {
         var resultStr = "";
         for (var i = 0; i < array.length; i++) {
            resultStr += String.fromCharCode(array[i]);
         }
         return resultStr;
      }

      while (k < len && chunk > 1) {
         try {
            if (type === "array" || type === "nodebuffer") {
               result.push(String.fromCharCode.apply(null, array.slice(k, Math.min(k + chunk, len))));
            } else {
               result.push(String.fromCharCode.apply(null, array.subarray(k, Math.min(k + chunk, len))));
            }
            k += chunk;
         } catch (e) {
            chunk = Math.floor(chunk / 2);
         }
      }
      return result.join("");
   }

   /**
    * Copy the data from an array-like to an other array-like.
    * @param {Array|ArrayBuffer|Uint8Array|Buffer} arrayFrom the origin array.
    * @param {Array|ArrayBuffer|Uint8Array|Buffer} arrayTo the destination array which will be mutated.
    * @return {Array|ArrayBuffer|Uint8Array|Buffer} the updated destination array.
    */
   function arrayLikeToArrayLike(arrayFrom, arrayTo) {
      for (var i = 0; i < arrayFrom.length; i++) {
         arrayTo[i] = arrayFrom[i];
      }
      return arrayTo;
   }

   // a matrix containing functions to transform everything into everything.
   var transform = {};

   // string to ?
   transform["string"] = {
      "string": identity,
      "array": function array(input) {
         return stringToArrayLike(input, new Array(input.length));
      },
      "arraybuffer": function arraybuffer(input) {
         return transform["string"]["uint8array"](input).buffer;
      },
      "uint8array": function uint8array(input) {
         return stringToArrayLike(input, new Uint8Array(input.length));
      },
      "nodebuffer": function nodebuffer(input) {
         return stringToArrayLike(input, new Buffer(input.length));
      }
   };

   // array to ?
   transform["array"] = {
      "string": arrayLikeToString,
      "array": identity,
      "arraybuffer": function arraybuffer(input) {
         return new Uint8Array(input).buffer;
      },
      "uint8array": function uint8array(input) {
         return new Uint8Array(input);
      },
      "nodebuffer": function nodebuffer(input) {
         return new Buffer(input);
      }
   };

   // arraybuffer to ?
   transform["arraybuffer"] = {
      "string": function string(input) {
         return arrayLikeToString(new Uint8Array(input));
      },
      "array": function array(input) {
         return arrayLikeToArrayLike(new Uint8Array(input), new Array(input.byteLength));
      },
      "arraybuffer": identity,
      "uint8array": function uint8array(input) {
         return new Uint8Array(input);
      },
      "nodebuffer": function nodebuffer(input) {
         return new Buffer(new Uint8Array(input));
      }
   };

   // uint8array to ?
   transform["uint8array"] = {
      "string": arrayLikeToString,
      "array": function array(input) {
         return arrayLikeToArrayLike(input, new Array(input.length));
      },
      "arraybuffer": function arraybuffer(input) {
         return input.buffer;
      },
      "uint8array": identity,
      "nodebuffer": function nodebuffer(input) {
         return new Buffer(input);
      }
   };

   // nodebuffer to ?
   transform["nodebuffer"] = {
      "string": arrayLikeToString,
      "array": function array(input) {
         return arrayLikeToArrayLike(input, new Array(input.length));
      },
      "arraybuffer": function arraybuffer(input) {
         return transform["nodebuffer"]["uint8array"](input).buffer;
      },
      "uint8array": function uint8array(input) {
         return arrayLikeToArrayLike(input, new Uint8Array(input.length));
      },
      "nodebuffer": identity
   };

   /**
    * Transform an input into any type.
    * The supported output type are : string, array, uint8array, arraybuffer, nodebuffer.
    * If no output type is specified, the unmodified input will be returned.
    * @param {String} outputType the output type.
    * @param {String|Array|ArrayBuffer|Uint8Array|Buffer} input the input to convert.
    * @throws {Error} an Error if the browser doesn't support the requested output type.
    */
   JSZip.utils.transformTo = function (outputType, input) {
      if (!input) {
         // undefined, null, etc
         // an empty string won't harm.
         input = "";
      }
      if (!outputType) {
         return input;
      }
      JSZip.utils.checkSupport(outputType);
      var inputType = JSZip.utils.getTypeOf(input);
      var result = transform[inputType][outputType](input);
      return result;
   };

   /**
    * Return the type of the input.
    * The type will be in a format valid for JSZip.utils.transformTo : string, array, uint8array, arraybuffer.
    * @param {Object} input the input to identify.
    * @return {String} the (lowercase) type of the input.
    */
   JSZip.utils.getTypeOf = function (input) {
      if (typeof input === "string") {
         return "string";
      }
      if (Object.prototype.toString.call(input) === "[object Array]") {
         return "array";
      }
      if (JSZip.support.nodebuffer && Buffer.isBuffer(input)) {
         return "nodebuffer";
      }
      if (JSZip.support.uint8array && input instanceof Uint8Array) {
         return "uint8array";
      }
      if (JSZip.support.arraybuffer && input instanceof ArrayBuffer) {
         return "arraybuffer";
      }
   };

   /**
    * Cross-window, cross-Node-context regular expression detection
    * @param  {Object}  object Anything
    * @return {Boolean}        true if the object is a regular expression,
    * false otherwise
    */
   JSZip.utils.isRegExp = function (object) {
      return Object.prototype.toString.call(object) === "[object RegExp]";
   };

   /**
    * Throw an exception if the type is not supported.
    * @param {String} type the type to check.
    * @throws {Error} an Error if the browser doesn't support the requested type.
    */
   JSZip.utils.checkSupport = function (type) {
      var supported = true;
      switch (type.toLowerCase()) {
         case "uint8array":
            supported = JSZip.support.uint8array;
            break;
         case "arraybuffer":
            supported = JSZip.support.arraybuffer;
            break;
         case "nodebuffer":
            supported = JSZip.support.nodebuffer;
            break;
         case "blob":
            supported = JSZip.support.blob;
            break;
      }
      if (!supported) {
         throw new Error(type + " is not supported by this browser");
      }
   };
})();

(function () {
   /**
    * Represents an entry in the zip.
    * The content may or may not be compressed.
    * @constructor
    */
   JSZip.CompressedObject = function () {
      this.compressedSize = 0;
      this.uncompressedSize = 0;
      this.crc32 = 0;
      this.compressionMethod = null;
      this.compressedContent = null;
   };

   JSZip.CompressedObject.prototype = {
      /**
       * Return the decompressed content in an unspecified format.
       * The format will depend on the decompressor.
       * @return {Object} the decompressed content.
       */
      getContent: function getContent() {
         return null; // see implementation
      },
      /**
       * Return the compressed content in an unspecified format.
       * The format will depend on the compressed conten source.
       * @return {Object} the compressed content.
       */
      getCompressedContent: function getCompressedContent() {
         return null; // see implementation
      }
   };
})();

/**
 *
 *  Base64 encode / decode
 *  http://www.webtoolkit.info/
 *
 *  Hacked so that it doesn't utf8 en/decode everything
 **/
JSZip.base64 = function () {
   // private property
   var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

   return {
      // public method for encoding
      encode: function encode(input, utf8) {
         var output = "";
         var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
         var i = 0;

         while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = (chr1 & 3) << 4 | chr2 >> 4;
            enc3 = (chr2 & 15) << 2 | chr3 >> 6;
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
               enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
               enc4 = 64;
            }

            output = output + _keyStr.charAt(enc1) + _keyStr.charAt(enc2) + _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
         }

         return output;
      },

      // public method for decoding
      decode: function decode(input, utf8) {
         var output = "";
         var chr1, chr2, chr3;
         var enc1, enc2, enc3, enc4;
         var i = 0;

         input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

         while (i < input.length) {

            enc1 = _keyStr.indexOf(input.charAt(i++));
            enc2 = _keyStr.indexOf(input.charAt(i++));
            enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));

            chr1 = enc1 << 2 | enc2 >> 4;
            chr2 = (enc2 & 15) << 4 | enc3 >> 2;
            chr3 = (enc3 & 3) << 6 | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
               output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
               output = output + String.fromCharCode(chr3);
            }
         }

         return output;
      }
   };
}();

// enforcing Stuk's coding style
// vim: set shiftwidth=3 softtabstop=3:
(function () {
   "use strict";

   if (!JSZip) {
      throw "JSZip not defined";
   }

   /*jshint -W004, -W018, -W030, -W032, -W033, -W034, -W037,-W040, -W055, -W056, -W061, -W064, -W093, -W117 */
   var context = {};
   (function () {

      // https://github.com/imaya/zlib.js
      // tag 0.1.6
      // file bin/deflate.min.js

      /** @license zlib.js 2012 - imaya [ https://github.com/imaya/zlib.js ] The MIT License */(function () {
         'use strict';
         var n = void 0,
             u = !0,
             aa = this;function ba(e, d) {
            var c = e.split("."),
                f = aa;!(c[0] in f) && f.execScript && f.execScript("var " + c[0]);for (var a; c.length && (a = c.shift());) {
               !c.length && d !== n ? f[a] = d : f = f[a] ? f[a] : f[a] = {};
            }
         };var C = "undefined" !== typeof Uint8Array && "undefined" !== typeof Uint16Array && "undefined" !== typeof Uint32Array;function K(e, d) {
            this.index = "number" === typeof d ? d : 0;this.d = 0;this.buffer = e instanceof (C ? Uint8Array : Array) ? e : new (C ? Uint8Array : Array)(32768);if (2 * this.buffer.length <= this.index) throw Error("invalid index");this.buffer.length <= this.index && ca(this);
         }function ca(e) {
            var d = e.buffer,
                c,
                f = d.length,
                a = new (C ? Uint8Array : Array)(f << 1);if (C) a.set(d);else for (c = 0; c < f; ++c) {
               a[c] = d[c];
            }return e.buffer = a;
         }
         K.prototype.a = function (e, d, c) {
            var f = this.buffer,
                a = this.index,
                b = this.d,
                k = f[a],
                m;c && 1 < d && (e = 8 < d ? (L[e & 255] << 24 | L[e >>> 8 & 255] << 16 | L[e >>> 16 & 255] << 8 | L[e >>> 24 & 255]) >> 32 - d : L[e] >> 8 - d);if (8 > d + b) k = k << d | e, b += d;else for (m = 0; m < d; ++m) {
               k = k << 1 | e >> d - m - 1 & 1, 8 === ++b && (b = 0, f[a++] = L[k], k = 0, a === f.length && (f = ca(this)));
            }f[a] = k;this.buffer = f;this.d = b;this.index = a;
         };K.prototype.finish = function () {
            var e = this.buffer,
                d = this.index,
                c;0 < this.d && (e[d] <<= 8 - this.d, e[d] = L[e[d]], d++);C ? c = e.subarray(0, d) : (e.length = d, c = e);return c;
         };
         var ga = new (C ? Uint8Array : Array)(256),
             M;for (M = 0; 256 > M; ++M) {
            for (var R = M, S = R, ha = 7, R = R >>> 1; R; R >>>= 1) {
               S <<= 1, S |= R & 1, --ha;
            }ga[M] = (S << ha & 255) >>> 0;
         }var L = ga;function ja(e) {
            this.buffer = new (C ? Uint16Array : Array)(2 * e);this.length = 0;
         }ja.prototype.getParent = function (e) {
            return 2 * ((e - 2) / 4 | 0);
         };ja.prototype.push = function (e, d) {
            var c,
                f,
                a = this.buffer,
                b;c = this.length;a[this.length++] = d;for (a[this.length++] = e; 0 < c;) {
               if (f = this.getParent(c), a[c] > a[f]) b = a[c], a[c] = a[f], a[f] = b, b = a[c + 1], a[c + 1] = a[f + 1], a[f + 1] = b, c = f;else break;
            }return this.length;
         };
         ja.prototype.pop = function () {
            var e,
                d,
                c = this.buffer,
                f,
                a,
                b;d = c[0];e = c[1];this.length -= 2;c[0] = c[this.length];c[1] = c[this.length + 1];for (b = 0;;) {
               a = 2 * b + 2;if (a >= this.length) break;a + 2 < this.length && c[a + 2] > c[a] && (a += 2);if (c[a] > c[b]) f = c[b], c[b] = c[a], c[a] = f, f = c[b + 1], c[b + 1] = c[a + 1], c[a + 1] = f;else break;b = a;
            }return { index: e, value: d, length: this.length };
         };function ka(e, d) {
            this.e = ma;this.f = 0;this.input = C && e instanceof Array ? new Uint8Array(e) : e;this.c = 0;d && (d.lazy && (this.f = d.lazy), "number" === typeof d.compressionType && (this.e = d.compressionType), d.outputBuffer && (this.b = C && d.outputBuffer instanceof Array ? new Uint8Array(d.outputBuffer) : d.outputBuffer), "number" === typeof d.outputIndex && (this.c = d.outputIndex));this.b || (this.b = new (C ? Uint8Array : Array)(32768));
         }var ma = 2,
             T = [],
             U;
         for (U = 0; 288 > U; U++) {
            switch (u) {case 143 >= U:
                  T.push([U + 48, 8]);break;case 255 >= U:
                  T.push([U - 144 + 400, 9]);break;case 279 >= U:
                  T.push([U - 256 + 0, 7]);break;case 287 >= U:
                  T.push([U - 280 + 192, 8]);break;default:
                  throw "invalid literal: " + U;}
         }ka.prototype.h = function () {
            var e,
                d,
                c,
                f,
                a = this.input;switch (this.e) {case 0:
                  c = 0;for (f = a.length; c < f;) {
                     d = C ? a.subarray(c, c + 65535) : a.slice(c, c + 65535);c += d.length;var b = d,
                         k = c === f,
                         m = n,
                         g = n,
                         p = n,
                         v = n,
                         x = n,
                         l = this.b,
                         h = this.c;if (C) {
                        for (l = new Uint8Array(this.b.buffer); l.length <= h + b.length + 5;) {
                           l = new Uint8Array(l.length << 1);
                        }l.set(this.b);
                     }m = k ? 1 : 0;l[h++] = m | 0;g = b.length;p = ~g + 65536 & 65535;l[h++] = g & 255;l[h++] = g >>> 8 & 255;l[h++] = p & 255;l[h++] = p >>> 8 & 255;if (C) l.set(b, h), h += b.length, l = l.subarray(0, h);else {
                        v = 0;for (x = b.length; v < x; ++v) {
                           l[h++] = b[v];
                        }l.length = h;
                     }this.c = h;this.b = l;
                  }break;case 1:
                  var q = new K(C ? new Uint8Array(this.b.buffer) : this.b, this.c);q.a(1, 1, u);q.a(1, 2, u);var t = na(this, a),
                      w,
                      da,
                      z;w = 0;for (da = t.length; w < da; w++) {
                     if (z = t[w], K.prototype.a.apply(q, T[z]), 256 < z) q.a(t[++w], t[++w], u), q.a(t[++w], 5), q.a(t[++w], t[++w], u);else if (256 === z) break;
                  }this.b = q.finish();this.c = this.b.length;break;case ma:
                  var B = new K(C ? new Uint8Array(this.b.buffer) : this.b, this.c),
                      ra,
                      J,
                      N,
                      O,
                      P,
                      Ia = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15],
                      W,
                      sa,
                      X,
                      ta,
                      ea,
                      ia = Array(19),
                      ua,
                      Q,
                      fa,
                      y,
                      va;ra = ma;B.a(1, 1, u);B.a(ra, 2, u);J = na(this, a);W = oa(this.j, 15);sa = pa(W);X = oa(this.i, 7);ta = pa(X);for (N = 286; 257 < N && 0 === W[N - 1]; N--) {}for (O = 30; 1 < O && 0 === X[O - 1]; O--) {}var wa = N,
                      xa = O,
                      F = new (C ? Uint32Array : Array)(wa + xa),
                      r,
                      G,
                      s,
                      Y,
                      E = new (C ? Uint32Array : Array)(316),
                      D,
                      A,
                      H = new (C ? Uint8Array : Array)(19);for (r = G = 0; r < wa; r++) {
                     F[G++] = W[r];
                  }for (r = 0; r < xa; r++) {
                     F[G++] = X[r];
                  }if (!C) {
                     r = 0;for (Y = H.length; r < Y; ++r) {
                        H[r] = 0;
                     }
                  }r = D = 0;for (Y = F.length; r < Y; r += G) {
                     for (G = 1; r + G < Y && F[r + G] === F[r]; ++G) {}s = G;if (0 === F[r]) {
                        if (3 > s) for (; 0 < s--;) {
                           E[D++] = 0, H[0]++;
                        } else for (; 0 < s;) {
                           A = 138 > s ? s : 138, A > s - 3 && A < s && (A = s - 3), 10 >= A ? (E[D++] = 17, E[D++] = A - 3, H[17]++) : (E[D++] = 18, E[D++] = A - 11, H[18]++), s -= A;
                        }
                     } else if (E[D++] = F[r], H[F[r]]++, s--, 3 > s) for (; 0 < s--;) {
                        E[D++] = F[r], H[F[r]]++;
                     } else for (; 0 < s;) {
                        A = 6 > s ? s : 6, A > s - 3 && A < s && (A = s - 3), E[D++] = 16, E[D++] = A - 3, H[16]++, s -= A;
                     }
                  }e = C ? E.subarray(0, D) : E.slice(0, D);ea = oa(H, 7);for (y = 0; 19 > y; y++) {
                     ia[y] = ea[Ia[y]];
                  }for (P = 19; 4 < P && 0 === ia[P - 1]; P--) {}ua = pa(ea);B.a(N - 257, 5, u);B.a(O - 1, 5, u);B.a(P - 4, 4, u);for (y = 0; y < P; y++) {
                     B.a(ia[y], 3, u);
                  }y = 0;for (va = e.length; y < va; y++) {
                     if (Q = e[y], B.a(ua[Q], ea[Q], u), 16 <= Q) {
                        y++;switch (Q) {case 16:
                              fa = 2;break;case 17:
                              fa = 3;break;case 18:
                              fa = 7;break;default:
                              throw "invalid code: " + Q;}B.a(e[y], fa, u);
                     }
                  }var ya = [sa, W],
                      za = [ta, X],
                      I,
                      Aa,
                      Z,
                      la,
                      Ba,
                      Ca,
                      Da,
                      Ea;Ba = ya[0];Ca = ya[1];Da = za[0];Ea = za[1];I = 0;for (Aa = J.length; I < Aa; ++I) {
                     if (Z = J[I], B.a(Ba[Z], Ca[Z], u), 256 < Z) B.a(J[++I], J[++I], u), la = J[++I], B.a(Da[la], Ea[la], u), B.a(J[++I], J[++I], u);else if (256 === Z) break;
                  }this.b = B.finish();this.c = this.b.length;break;default:
                  throw "invalid compression type";}return this.b;
         };
         function qa(e, d) {
            this.length = e;this.g = d;
         }
         var Fa = function () {
            function e(a) {
               switch (u) {case 3 === a:
                     return [257, a - 3, 0];case 4 === a:
                     return [258, a - 4, 0];case 5 === a:
                     return [259, a - 5, 0];case 6 === a:
                     return [260, a - 6, 0];case 7 === a:
                     return [261, a - 7, 0];case 8 === a:
                     return [262, a - 8, 0];case 9 === a:
                     return [263, a - 9, 0];case 10 === a:
                     return [264, a - 10, 0];case 12 >= a:
                     return [265, a - 11, 1];case 14 >= a:
                     return [266, a - 13, 1];case 16 >= a:
                     return [267, a - 15, 1];case 18 >= a:
                     return [268, a - 17, 1];case 22 >= a:
                     return [269, a - 19, 2];case 26 >= a:
                     return [270, a - 23, 2];case 30 >= a:
                     return [271, a - 27, 2];case 34 >= a:
                     return [272, a - 31, 2];case 42 >= a:
                     return [273, a - 35, 3];case 50 >= a:
                     return [274, a - 43, 3];case 58 >= a:
                     return [275, a - 51, 3];case 66 >= a:
                     return [276, a - 59, 3];case 82 >= a:
                     return [277, a - 67, 4];case 98 >= a:
                     return [278, a - 83, 4];case 114 >= a:
                     return [279, a - 99, 4];case 130 >= a:
                     return [280, a - 115, 4];case 162 >= a:
                     return [281, a - 131, 5];case 194 >= a:
                     return [282, a - 163, 5];case 226 >= a:
                     return [283, a - 195, 5];case 257 >= a:
                     return [284, a - 227, 5];case 258 === a:
                     return [285, a - 258, 0];default:
                     throw "invalid length: " + a;}
            }var d = [],
                c,
                f;for (c = 3; 258 >= c; c++) {
               f = e(c), d[c] = f[2] << 24 | f[1] << 16 | f[0];
            }return d;
         }(),
             Ga = C ? new Uint32Array(Fa) : Fa;
         function na(e, d) {
            function c(a, c) {
               var b = a.g,
                   d = [],
                   f = 0,
                   e;e = Ga[a.length];d[f++] = e & 65535;d[f++] = e >> 16 & 255;d[f++] = e >> 24;var g;switch (u) {case 1 === b:
                     g = [0, b - 1, 0];break;case 2 === b:
                     g = [1, b - 2, 0];break;case 3 === b:
                     g = [2, b - 3, 0];break;case 4 === b:
                     g = [3, b - 4, 0];break;case 6 >= b:
                     g = [4, b - 5, 1];break;case 8 >= b:
                     g = [5, b - 7, 1];break;case 12 >= b:
                     g = [6, b - 9, 2];break;case 16 >= b:
                     g = [7, b - 13, 2];break;case 24 >= b:
                     g = [8, b - 17, 3];break;case 32 >= b:
                     g = [9, b - 25, 3];break;case 48 >= b:
                     g = [10, b - 33, 4];break;case 64 >= b:
                     g = [11, b - 49, 4];break;case 96 >= b:
                     g = [12, b - 65, 5];break;case 128 >= b:
                     g = [13, b - 97, 5];break;case 192 >= b:
                     g = [14, b - 129, 6];break;case 256 >= b:
                     g = [15, b - 193, 6];break;case 384 >= b:
                     g = [16, b - 257, 7];break;case 512 >= b:
                     g = [17, b - 385, 7];break;case 768 >= b:
                     g = [18, b - 513, 8];break;case 1024 >= b:
                     g = [19, b - 769, 8];break;case 1536 >= b:
                     g = [20, b - 1025, 9];break;case 2048 >= b:
                     g = [21, b - 1537, 9];break;case 3072 >= b:
                     g = [22, b - 2049, 10];break;case 4096 >= b:
                     g = [23, b - 3073, 10];break;case 6144 >= b:
                     g = [24, b - 4097, 11];break;case 8192 >= b:
                     g = [25, b - 6145, 11];break;case 12288 >= b:
                     g = [26, b - 8193, 12];break;case 16384 >= b:
                     g = [27, b - 12289, 12];break;case 24576 >= b:
                     g = [28, b - 16385, 13];break;case 32768 >= b:
                     g = [29, b - 24577, 13];break;default:
                     throw "invalid distance";}e = g;d[f++] = e[0];d[f++] = e[1];d[f++] = e[2];var k, m;k = 0;for (m = d.length; k < m; ++k) {
                  l[h++] = d[k];
               }t[d[0]]++;w[d[3]]++;q = a.length + c - 1;x = null;
            }var f,
                a,
                b,
                k,
                m,
                g = {},
                p,
                v,
                x,
                l = C ? new Uint16Array(2 * d.length) : [],
                h = 0,
                q = 0,
                t = new (C ? Uint32Array : Array)(286),
                w = new (C ? Uint32Array : Array)(30),
                da = e.f,
                z;if (!C) {
               for (b = 0; 285 >= b;) {
                  t[b++] = 0;
               }for (b = 0; 29 >= b;) {
                  w[b++] = 0;
               }
            }t[256] = 1;f = 0;for (a = d.length; f < a; ++f) {
               b = m = 0;for (k = 3; b < k && f + b !== a; ++b) {
                  m = m << 8 | d[f + b];
               }g[m] === n && (g[m] = []);p = g[m];if (!(0 < q--)) {
                  for (; 0 < p.length && 32768 < f - p[0];) {
                     p.shift();
                  }if (f + 3 >= a) {
                     x && c(x, -1);b = 0;for (k = a - f; b < k; ++b) {
                        z = d[f + b], l[h++] = z, ++t[z];
                     }break;
                  }0 < p.length ? (v = Ha(d, f, p), x ? x.length < v.length ? (z = d[f - 1], l[h++] = z, ++t[z], c(v, 0)) : c(x, -1) : v.length < da ? x = v : c(v, 0)) : x ? c(x, -1) : (z = d[f], l[h++] = z, ++t[z]);
               }p.push(f);
            }l[h++] = 256;t[256]++;e.j = t;e.i = w;return C ? l.subarray(0, h) : l;
         }
         function Ha(e, d, c) {
            var f,
                a,
                b = 0,
                k,
                m,
                g,
                p,
                v = e.length;m = 0;p = c.length;a: for (; m < p; m++) {
               f = c[p - m - 1];k = 3;if (3 < b) {
                  for (g = b; 3 < g; g--) {
                     if (e[f + g - 1] !== e[d + g - 1]) continue a;
                  }k = b;
               }for (; 258 > k && d + k < v && e[f + k] === e[d + k];) {
                  ++k;
               }k > b && (a = f, b = k);if (258 === k) break;
            }return new qa(b, d - a);
         }
         function oa(e, d) {
            var c = e.length,
                f = new ja(572),
                a = new (C ? Uint8Array : Array)(c),
                b,
                k,
                m,
                g,
                p;if (!C) for (g = 0; g < c; g++) {
               a[g] = 0;
            }for (g = 0; g < c; ++g) {
               0 < e[g] && f.push(g, e[g]);
            }b = Array(f.length / 2);k = new (C ? Uint32Array : Array)(f.length / 2);if (1 === b.length) return a[f.pop().index] = 1, a;g = 0;for (p = f.length / 2; g < p; ++g) {
               b[g] = f.pop(), k[g] = b[g].value;
            }m = Ja(k, k.length, d);g = 0;for (p = b.length; g < p; ++g) {
               a[b[g].index] = m[g];
            }return a;
         }
         function Ja(e, d, c) {
            function f(a) {
               var b = g[a][p[a]];b === d ? (f(a + 1), f(a + 1)) : --k[b];++p[a];
            }var a = new (C ? Uint16Array : Array)(c),
                b = new (C ? Uint8Array : Array)(c),
                k = new (C ? Uint8Array : Array)(d),
                m = Array(c),
                g = Array(c),
                p = Array(c),
                v = (1 << c) - d,
                x = 1 << c - 1,
                l,
                h,
                q,
                t,
                w;a[c - 1] = d;for (h = 0; h < c; ++h) {
               v < x ? b[h] = 0 : (b[h] = 1, v -= x), v <<= 1, a[c - 2 - h] = (a[c - 1 - h] / 2 | 0) + d;
            }a[0] = b[0];m[0] = Array(a[0]);g[0] = Array(a[0]);for (h = 1; h < c; ++h) {
               a[h] > 2 * a[h - 1] + b[h] && (a[h] = 2 * a[h - 1] + b[h]), m[h] = Array(a[h]), g[h] = Array(a[h]);
            }for (l = 0; l < d; ++l) {
               k[l] = c;
            }for (q = 0; q < a[c - 1]; ++q) {
               m[c - 1][q] = e[q], g[c - 1][q] = q;
            }for (l = 0; l < c; ++l) {
               p[l] = 0;
            }1 === b[c - 1] && (--k[0], ++p[c - 1]);for (h = c - 2; 0 <= h; --h) {
               t = l = 0;w = p[h + 1];for (q = 0; q < a[h]; q++) {
                  t = m[h + 1][w] + m[h + 1][w + 1], t > e[l] ? (m[h][q] = t, g[h][q] = d, w += 2) : (m[h][q] = e[l], g[h][q] = l, ++l);
               }p[h] = 0;1 === b[h] && f(h);
            }return k;
         }
         function pa(e) {
            var d = new (C ? Uint16Array : Array)(e.length),
                c = [],
                f = [],
                a = 0,
                b,
                k,
                m,
                g;b = 0;for (k = e.length; b < k; b++) {
               c[e[b]] = (c[e[b]] | 0) + 1;
            }b = 1;for (k = 16; b <= k; b++) {
               f[b] = a, a += c[b] | 0, a <<= 1;
            }b = 0;for (k = e.length; b < k; b++) {
               a = f[e[b]];f[e[b]] += 1;m = d[b] = 0;for (g = e[b]; m < g; m++) {
                  d[b] = d[b] << 1 | a & 1, a >>>= 1;
               }
            }return d;
         };ba("Zlib.RawDeflate", ka);ba("Zlib.RawDeflate.prototype.compress", ka.prototype.h);var Ka = { NONE: 0, FIXED: 1, DYNAMIC: ma },
             V,
             La,
             $,
             Ma;if (Object.keys) V = Object.keys(Ka);else for (La in V = [], $ = 0, Ka) {
            V[$++] = La;
         }$ = 0;for (Ma = V.length; $ < Ma; ++$) {
            La = V[$], ba("Zlib.RawDeflate.CompressionType." + La, Ka[La]);
         }
      }).call(this); //@ sourceMappingURL=rawdeflate.min.js.map
   }).call(context);
   /*jshint +W004, +W018, +W030, +W032, +W033, +W034, +W037,+W040, +W055, +W056, +W061, +W064, +W093, +W117 */

   var compress = function compress(input) {
      var deflate = new context.Zlib.RawDeflate(input);
      return deflate.compress();
   };

   var USE_TYPEDARRAY = typeof Uint8Array !== 'undefined' && typeof Uint16Array !== 'undefined' && typeof Uint32Array !== 'undefined';

   // we add the compression method for JSZip
   if (!JSZip.compressions["DEFLATE"]) {
      JSZip.compressions["DEFLATE"] = {
         magic: "\x08\x00",
         compress: compress,
         compressInputType: USE_TYPEDARRAY ? "uint8array" : "array"
      };
   } else {
      JSZip.compressions["DEFLATE"].compress = compress;
      JSZip.compressions["DEFLATE"].compressInputType = USE_TYPEDARRAY ? "uint8array" : "array";
   }
})();

// enforcing Stuk's coding style
// vim: set shiftwidth=3 softtabstop=3:
(function () {
   "use strict";

   if (!JSZip) {
      throw "JSZip not defined";
   }

   /*jshint -W004, -W030, -W032, -W033, -W034, -W040, -W056, -W061, -W064, -W093 */
   var context = {};
   (function () {

      // https://github.com/imaya/zlib.js
      // tag 0.1.6
      // file bin/deflate.min.js

      /** @license zlib.js 2012 - imaya [ https://github.com/imaya/zlib.js ] The MIT License */(function () {
         'use strict';
         var l = void 0,
             p = this;function q(c, d) {
            var a = c.split("."),
                b = p;!(a[0] in b) && b.execScript && b.execScript("var " + a[0]);for (var e; a.length && (e = a.shift());) {
               !a.length && d !== l ? b[e] = d : b = b[e] ? b[e] : b[e] = {};
            }
         };var r = "undefined" !== typeof Uint8Array && "undefined" !== typeof Uint16Array && "undefined" !== typeof Uint32Array;function u(c) {
            var d = c.length,
                a = 0,
                b = Number.POSITIVE_INFINITY,
                e,
                f,
                g,
                h,
                k,
                m,
                s,
                n,
                t;for (n = 0; n < d; ++n) {
               c[n] > a && (a = c[n]), c[n] < b && (b = c[n]);
            }e = 1 << a;f = new (r ? Uint32Array : Array)(e);g = 1;h = 0;for (k = 2; g <= a;) {
               for (n = 0; n < d; ++n) {
                  if (c[n] === g) {
                     m = 0;s = h;for (t = 0; t < g; ++t) {
                        m = m << 1 | s & 1, s >>= 1;
                     }for (t = m; t < e; t += k) {
                        f[t] = g << 16 | n;
                     }++h;
                  }
               }++g;h <<= 1;k <<= 1;
            }return [f, a, b];
         };function v(c, d) {
            this.g = [];this.h = 32768;this.c = this.f = this.d = this.k = 0;this.input = r ? new Uint8Array(c) : c;this.l = !1;this.i = w;this.p = !1;if (d || !(d = {})) d.index && (this.d = d.index), d.bufferSize && (this.h = d.bufferSize), d.bufferType && (this.i = d.bufferType), d.resize && (this.p = d.resize);switch (this.i) {case x:
                  this.a = 32768;this.b = new (r ? Uint8Array : Array)(32768 + this.h + 258);break;case w:
                  this.a = 0;this.b = new (r ? Uint8Array : Array)(this.h);this.e = this.u;this.m = this.r;this.j = this.s;break;default:
                  throw Error("invalid inflate mode");
            }
         }var x = 0,
             w = 1;
         v.prototype.t = function () {
            for (; !this.l;) {
               var c = y(this, 3);c & 1 && (this.l = !0);c >>>= 1;switch (c) {case 0:
                     var d = this.input,
                         a = this.d,
                         b = this.b,
                         e = this.a,
                         f = l,
                         g = l,
                         h = l,
                         k = b.length,
                         m = l;this.c = this.f = 0;f = d[a++];if (f === l) throw Error("invalid uncompressed block header: LEN (first byte)");g = f;f = d[a++];if (f === l) throw Error("invalid uncompressed block header: LEN (second byte)");g |= f << 8;f = d[a++];if (f === l) throw Error("invalid uncompressed block header: NLEN (first byte)");h = f;f = d[a++];if (f === l) throw Error("invalid uncompressed block header: NLEN (second byte)");h |= f << 8;if (g === ~h) throw Error("invalid uncompressed block header: length verify");if (a + g > d.length) throw Error("input buffer is broken");switch (this.i) {case x:
                           for (; e + g > b.length;) {
                              m = k - e;g -= m;if (r) b.set(d.subarray(a, a + m), e), e += m, a += m;else for (; m--;) {
                                 b[e++] = d[a++];
                              }this.a = e;b = this.e();e = this.a;
                           }break;case w:
                           for (; e + g > b.length;) {
                              b = this.e({ o: 2 });
                           }break;default:
                           throw Error("invalid inflate mode");}if (r) b.set(d.subarray(a, a + g), e), e += g, a += g;else for (; g--;) {
                        b[e++] = d[a++];
                     }this.d = a;this.a = e;this.b = b;break;case 1:
                     this.j(z, A);break;case 2:
                     B(this);break;default:
                     throw Error("unknown BTYPE: " + c);}
            }return this.m();
         };
         var C = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15],
             D = r ? new Uint16Array(C) : C,
             E = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 258, 258],
             F = r ? new Uint16Array(E) : E,
             G = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 0, 0],
             H = r ? new Uint8Array(G) : G,
             I = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577],
             J = r ? new Uint16Array(I) : I,
             K = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13],
             L = r ? new Uint8Array(K) : K,
             M = new (r ? Uint8Array : Array)(288),
             N,
             O;N = 0;for (O = M.length; N < O; ++N) {
            M[N] = 143 >= N ? 8 : 255 >= N ? 9 : 279 >= N ? 7 : 8;
         }var z = u(M),
             P = new (r ? Uint8Array : Array)(30),
             Q,
             R;Q = 0;for (R = P.length; Q < R; ++Q) {
            P[Q] = 5;
         }var A = u(P);function y(c, d) {
            for (var a = c.f, b = c.c, e = c.input, f = c.d, g; b < d;) {
               g = e[f++];if (g === l) throw Error("input buffer is broken");a |= g << b;b += 8;
            }g = a & (1 << d) - 1;c.f = a >>> d;c.c = b - d;c.d = f;return g;
         }
         function S(c, d) {
            for (var a = c.f, b = c.c, e = c.input, f = c.d, g = d[0], h = d[1], k, m, s; b < h;) {
               k = e[f++];if (k === l) break;a |= k << b;b += 8;
            }m = g[a & (1 << h) - 1];s = m >>> 16;c.f = a >> s;c.c = b - s;c.d = f;return m & 65535;
         }
         function B(c) {
            function d(a, c, b) {
               var d, f, e, g;for (g = 0; g < a;) {
                  switch (d = S(this, c), d) {case 16:
                        for (e = 3 + y(this, 2); e--;) {
                           b[g++] = f;
                        }break;case 17:
                        for (e = 3 + y(this, 3); e--;) {
                           b[g++] = 0;
                        }f = 0;break;case 18:
                        for (e = 11 + y(this, 7); e--;) {
                           b[g++] = 0;
                        }f = 0;break;default:
                        f = b[g++] = d;}
               }return b;
            }var a = y(c, 5) + 257,
                b = y(c, 5) + 1,
                e = y(c, 4) + 4,
                f = new (r ? Uint8Array : Array)(D.length),
                g,
                h,
                k,
                m;for (m = 0; m < e; ++m) {
               f[D[m]] = y(c, 3);
            }g = u(f);h = new (r ? Uint8Array : Array)(a);k = new (r ? Uint8Array : Array)(b);c.j(u(d.call(c, a, g, h)), u(d.call(c, b, g, k)));
         }
         v.prototype.j = function (c, d) {
            var a = this.b,
                b = this.a;this.n = c;for (var e = a.length - 258, f, g, h, k; 256 !== (f = S(this, c));) {
               if (256 > f) b >= e && (this.a = b, a = this.e(), b = this.a), a[b++] = f;else {
                  g = f - 257;k = F[g];0 < H[g] && (k += y(this, H[g]));f = S(this, d);h = J[f];0 < L[f] && (h += y(this, L[f]));b >= e && (this.a = b, a = this.e(), b = this.a);for (; k--;) {
                     a[b] = a[b++ - h];
                  }
               }
            }for (; 8 <= this.c;) {
               this.c -= 8, this.d--;
            }this.a = b;
         };
         v.prototype.s = function (c, d) {
            var a = this.b,
                b = this.a;this.n = c;for (var e = a.length, f, g, h, k; 256 !== (f = S(this, c));) {
               if (256 > f) b >= e && (a = this.e(), e = a.length), a[b++] = f;else {
                  g = f - 257;k = F[g];0 < H[g] && (k += y(this, H[g]));f = S(this, d);h = J[f];0 < L[f] && (h += y(this, L[f]));b + k > e && (a = this.e(), e = a.length);for (; k--;) {
                     a[b] = a[b++ - h];
                  }
               }
            }for (; 8 <= this.c;) {
               this.c -= 8, this.d--;
            }this.a = b;
         };
         v.prototype.e = function () {
            var c = new (r ? Uint8Array : Array)(this.a - 32768),
                d = this.a - 32768,
                a,
                b,
                e = this.b;if (r) c.set(e.subarray(32768, c.length));else {
               a = 0;for (b = c.length; a < b; ++a) {
                  c[a] = e[a + 32768];
               }
            }this.g.push(c);this.k += c.length;if (r) e.set(e.subarray(d, d + 32768));else for (a = 0; 32768 > a; ++a) {
               e[a] = e[d + a];
            }this.a = 32768;return e;
         };
         v.prototype.u = function (c) {
            var d,
                a = this.input.length / this.d + 1 | 0,
                b,
                e,
                f,
                g = this.input,
                h = this.b;c && ("number" === typeof c.o && (a = c.o), "number" === typeof c.q && (a += c.q));2 > a ? (b = (g.length - this.d) / this.n[2], f = 258 * (b / 2) | 0, e = f < h.length ? h.length + f : h.length << 1) : e = h.length * a;r ? (d = new Uint8Array(e), d.set(h)) : d = h;return this.b = d;
         };
         v.prototype.m = function () {
            var c = 0,
                d = this.b,
                a = this.g,
                b,
                e = new (r ? Uint8Array : Array)(this.k + (this.a - 32768)),
                f,
                g,
                h,
                k;if (0 === a.length) return r ? this.b.subarray(32768, this.a) : this.b.slice(32768, this.a);f = 0;for (g = a.length; f < g; ++f) {
               b = a[f];h = 0;for (k = b.length; h < k; ++h) {
                  e[c++] = b[h];
               }
            }f = 32768;for (g = this.a; f < g; ++f) {
               e[c++] = d[f];
            }this.g = [];return this.buffer = e;
         };
         v.prototype.r = function () {
            var c,
                d = this.a;r ? this.p ? (c = new Uint8Array(d), c.set(this.b.subarray(0, d))) : c = this.b.subarray(0, d) : (this.b.length > d && (this.b.length = d), c = this.b);return this.buffer = c;
         };q("Zlib.RawInflate", v);q("Zlib.RawInflate.prototype.decompress", v.prototype.t);var T = { ADAPTIVE: w, BLOCK: x },
             U,
             V,
             W,
             X;if (Object.keys) U = Object.keys(T);else for (V in U = [], W = 0, T) {
            U[W++] = V;
         }W = 0;for (X = U.length; W < X; ++W) {
            V = U[W], q("Zlib.RawInflate.BufferType." + V, T[V]);
         }
      }).call(this); //@ sourceMappingURL=rawinflate.min.js.map
   }).call(context);
   /*jshint +W004, +W030, +W032, +W033, +W034, +W040, +W056, +W061, +W064, +W093 */

   var uncompress = function uncompress(input) {
      var inflate = new context.Zlib.RawInflate(input);
      return inflate.decompress();
   };

   var USE_TYPEDARRAY = typeof Uint8Array !== 'undefined' && typeof Uint16Array !== 'undefined' && typeof Uint32Array !== 'undefined';

   // we add the compression method for JSZip
   if (!JSZip.compressions["DEFLATE"]) {
      JSZip.compressions["DEFLATE"] = {
         magic: "\x08\x00",
         uncompress: uncompress,
         uncompressInputType: USE_TYPEDARRAY ? "uint8array" : "array"
      };
   } else {
      JSZip.compressions["DEFLATE"].uncompress = uncompress;
      JSZip.compressions["DEFLATE"].uncompressInputType = USE_TYPEDARRAY ? "uint8array" : "array";
   }
})();

// enforcing Stuk's coding style
// vim: set shiftwidth=3 softtabstop=3:
/**
JSZip - A Javascript class for generating and reading zip files
<http://stuartk.com/jszip>
(c) 2011 David Duponchel <d.duponchel@gmail.com>
Dual licenced under the MIT license or GPLv3. See LICENSE.markdown.
**/
/*global JSZip */
(function (root) {
   "use strict";

   var MAX_VALUE_16BITS = 65535;
   var MAX_VALUE_32BITS = -1; // well, "\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF" is parsed as -1

   /**
    * Prettify a string read as binary.
    * @param {string} str the string to prettify.
    * @return {string} a pretty string.
    */
   var pretty = function pretty(str) {
      var res = '',
          code,
          i;
      for (i = 0; i < (str || "").length; i++) {
         code = str.charCodeAt(i);
         res += '\\x' + (code < 16 ? "0" : "") + code.toString(16).toUpperCase();
      }
      return res;
   };

   /**
    * Find a compression registered in JSZip.
    * @param {string} compressionMethod the method magic to find.
    * @return {Object|null} the JSZip compression object, null if none found.
    */
   var findCompression = function findCompression(compressionMethod) {
      for (var method in JSZip.compressions) {
         if (!JSZip.compressions.hasOwnProperty(method)) {
            continue;
         }
         if (JSZip.compressions[method].magic === compressionMethod) {
            return JSZip.compressions[method];
         }
      }
      return null;
   };

   // class DataReader {{{
   /**
    * Read bytes from a source.
    * Developer tip : when debugging, a watch on pretty(this.reader.data.slice(this.reader.index))
    * is very useful :)
    * @constructor
    * @param {String|ArrayBuffer|Uint8Array|Buffer} data the data to read.
    */
   function DataReader(data) {
      this.data = null; // type : see implementation
      this.length = 0;
      this.index = 0;
   }
   DataReader.prototype = {
      /**
       * Check that the offset will not go too far.
       * @param {string} offset the additional offset to check.
       * @throws {Error} an Error if the offset is out of bounds.
       */
      checkOffset: function checkOffset(offset) {
         this.checkIndex(this.index + offset);
      },
      /**
       * Check that the specifed index will not be too far.
       * @param {string} newIndex the index to check.
       * @throws {Error} an Error if the index is out of bounds.
       */
      checkIndex: function checkIndex(newIndex) {
         if (this.length < newIndex || newIndex < 0) {
            throw new Error("End of data reached (data length = " + this.length + ", asked index = " + newIndex + "). Corrupted zip ?");
         }
      },
      /**
       * Change the index.
       * @param {number} newIndex The new index.
       * @throws {Error} if the new index is out of the data.
       */
      setIndex: function setIndex(newIndex) {
         this.checkIndex(newIndex);
         this.index = newIndex;
      },
      /**
       * Skip the next n bytes.
       * @param {number} n the number of bytes to skip.
       * @throws {Error} if the new index is out of the data.
       */
      skip: function skip(n) {
         this.setIndex(this.index + n);
      },
      /**
       * Get the byte at the specified index.
       * @param {number} i the index to use.
       * @return {number} a byte.
       */
      byteAt: function byteAt(i) {
         // see implementations
      },
      /**
       * Get the next number with a given byte size.
       * @param {number} size the number of bytes to read.
       * @return {number} the corresponding number.
       */
      readInt: function readInt(size) {
         var result = 0,
             i;
         this.checkOffset(size);
         for (i = this.index + size - 1; i >= this.index; i--) {
            result = (result << 8) + this.byteAt(i);
         }
         this.index += size;
         return result;
      },
      /**
       * Get the next string with a given byte size.
       * @param {number} size the number of bytes to read.
       * @return {string} the corresponding string.
       */
      readString: function readString(size) {
         return JSZip.utils.transformTo("string", this.readData(size));
      },
      /**
       * Get raw data without conversion, <size> bytes.
       * @param {number} size the number of bytes to read.
       * @return {Object} the raw data, implementation specific.
       */
      readData: function readData(size) {
         // see implementations
      },
      /**
       * Find the last occurence of a zip signature (4 bytes).
       * @param {string} sig the signature to find.
       * @return {number} the index of the last occurence, -1 if not found.
       */
      lastIndexOfSignature: function lastIndexOfSignature(sig) {
         // see implementations
      },
      /**
       * Get the next date.
       * @return {Date} the date.
       */
      readDate: function readDate() {
         var dostime = this.readInt(4);
         return new Date((dostime >> 25 & 0x7f) + 1980, // year
         (dostime >> 21 & 0x0f) - 1, // month
         dostime >> 16 & 0x1f, // day
         dostime >> 11 & 0x1f, // hour
         dostime >> 5 & 0x3f, // minute
         (dostime & 0x1f) << 1); // second
      }
   };

   /**
    * Read bytes from a string.
    * @constructor
    * @param {String} data the data to read.
    */
   function StringReader(data, optimizedBinaryString) {
      this.data = data;
      if (!optimizedBinaryString) {
         this.data = JSZip.utils.string2binary(this.data);
      }
      this.length = this.data.length;
      this.index = 0;
   }
   StringReader.prototype = new DataReader();
   /**
    * @see DataReader.byteAt
    */
   StringReader.prototype.byteAt = function (i) {
      return this.data.charCodeAt(i);
   };
   /**
    * @see DataReader.lastIndexOfSignature
    */
   StringReader.prototype.lastIndexOfSignature = function (sig) {
      return this.data.lastIndexOf(sig);
   };
   /**
    * @see DataReader.readData
    */
   StringReader.prototype.readData = function (size) {
      this.checkOffset(size);
      // this will work because the constructor applied the "& 0xff" mask.
      var result = this.data.slice(this.index, this.index + size);
      this.index += size;
      return result;
   };

   /**
    * Read bytes from an Uin8Array.
    * @constructor
    * @param {Uint8Array} data the data to read.
    */
   function Uint8ArrayReader(data) {
      if (data) {
         this.data = data;
         this.length = this.data.length;
         this.index = 0;
      }
   }
   Uint8ArrayReader.prototype = new DataReader();
   /**
    * @see DataReader.byteAt
    */
   Uint8ArrayReader.prototype.byteAt = function (i) {
      return this.data[i];
   };
   /**
    * @see DataReader.lastIndexOfSignature
    */
   Uint8ArrayReader.prototype.lastIndexOfSignature = function (sig) {
      var sig0 = sig.charCodeAt(0),
          sig1 = sig.charCodeAt(1),
          sig2 = sig.charCodeAt(2),
          sig3 = sig.charCodeAt(3);
      for (var i = this.length - 4; i >= 0; --i) {
         if (this.data[i] === sig0 && this.data[i + 1] === sig1 && this.data[i + 2] === sig2 && this.data[i + 3] === sig3) {
            return i;
         }
      }

      return -1;
   };
   /**
    * @see DataReader.readData
    */
   Uint8ArrayReader.prototype.readData = function (size) {
      this.checkOffset(size);
      var result = this.data.subarray(this.index, this.index + size);
      this.index += size;
      return result;
   };

   /**
    * Read bytes from a Buffer.
    * @constructor
    * @param {Buffer} data the data to read.
    */
   function NodeBufferReader(data) {
      this.data = data;
      this.length = this.data.length;
      this.index = 0;
   }
   NodeBufferReader.prototype = new Uint8ArrayReader();

   /**
    * @see DataReader.readData
    */
   NodeBufferReader.prototype.readData = function (size) {
      this.checkOffset(size);
      var result = this.data.slice(this.index, this.index + size);
      this.index += size;
      return result;
   };
   // }}} end of DataReader

   // class ZipEntry {{{
   /**
    * An entry in the zip file.
    * @constructor
    * @param {Object} options Options of the current file.
    * @param {Object} loadOptions Options for loading the data.
    */
   function ZipEntry(options, loadOptions) {
      this.options = options;
      this.loadOptions = loadOptions;
   }
   ZipEntry.prototype = {
      /**
       * say if the file is encrypted.
       * @return {boolean} true if the file is encrypted, false otherwise.
       */
      isEncrypted: function isEncrypted() {
         // bit 1 is set
         return (this.bitFlag & 0x0001) === 0x0001;
      },
      /**
       * say if the file has utf-8 filename/comment.
       * @return {boolean} true if the filename/comment is in utf-8, false otherwise.
       */
      useUTF8: function useUTF8() {
         // bit 11 is set
         return (this.bitFlag & 0x0800) === 0x0800;
      },
      /**
       * Prepare the function used to generate the compressed content from this ZipFile.
       * @param {DataReader} reader the reader to use.
       * @param {number} from the offset from where we should read the data.
       * @param {number} length the length of the data to read.
       * @return {Function} the callback to get the compressed content (the type depends of the DataReader class).
       */
      prepareCompressedContent: function prepareCompressedContent(reader, from, length) {
         return function () {
            var previousIndex = reader.index;
            reader.setIndex(from);
            var compressedFileData = reader.readData(length);
            reader.setIndex(previousIndex);

            return compressedFileData;
         };
      },
      /**
       * Prepare the function used to generate the uncompressed content from this ZipFile.
       * @param {DataReader} reader the reader to use.
       * @param {number} from the offset from where we should read the data.
       * @param {number} length the length of the data to read.
       * @param {JSZip.compression} compression the compression used on this file.
       * @param {number} uncompressedSize the uncompressed size to expect.
       * @return {Function} the callback to get the uncompressed content (the type depends of the DataReader class).
       */
      prepareContent: function prepareContent(reader, from, length, compression, uncompressedSize) {
         return function () {

            var compressedFileData = JSZip.utils.transformTo(compression.uncompressInputType, this.getCompressedContent());
            var uncompressedFileData = compression.uncompress(compressedFileData);

            if (uncompressedFileData.length !== uncompressedSize) {
               throw new Error("Bug : uncompressed data size mismatch");
            }

            return uncompressedFileData;
         };
      },
      /**
       * Read the local part of a zip file and add the info in this object.
       * @param {DataReader} reader the reader to use.
       */
      readLocalPart: function readLocalPart(reader) {
         var compression, localExtraFieldsLength;

         // we already know everything from the central dir !
         // If the central dir data are false, we are doomed.
         // On the bright side, the local part is scary  : zip64, data descriptors, both, etc.
         // The less data we get here, the more reliable this should be.
         // Let's skip the whole header and dash to the data !
         reader.skip(22);
         // in some zip created on windows, the filename stored in the central dir contains \ instead of /.
         // Strangely, the filename here is OK.
         // I would love to treat these zip files as corrupted (see http://www.info-zip.org/FAQ.html#backslashes
         // or APPNOTE#4.4.17.1, "All slashes MUST be forward slashes '/'") but there are a lot of bad zip generators...
         // Search "unzip mismatching "local" filename continuing with "central" filename version" on
         // the internet.
         //
         // I think I see the logic here : the central directory is used to display
         // content and the local directory is used to extract the files. Mixing / and \
         // may be used to display \ to windows users and use / when extracting the files.
         // Unfortunately, this lead also to some issues : http://seclists.org/fulldisclosure/2009/Sep/394
         this.fileNameLength = reader.readInt(2);
         localExtraFieldsLength = reader.readInt(2); // can't be sure this will be the same as the central dir
         this.fileName = reader.readString(this.fileNameLength);
         reader.skip(localExtraFieldsLength);

         if (this.compressedSize == -1 || this.uncompressedSize == -1) {
            throw new Error("Bug or corrupted zip : didn't get enough informations from the central directory " + "(compressedSize == -1 || uncompressedSize == -1)");
         }

         compression = findCompression(this.compressionMethod);
         if (compression === null) {
            // no compression found
            throw new Error("Corrupted zip : compression " + pretty(this.compressionMethod) + " unknown (inner file : " + this.fileName + ")");
         }
         this.decompressed = new JSZip.CompressedObject();
         this.decompressed.compressedSize = this.compressedSize;
         this.decompressed.uncompressedSize = this.uncompressedSize;
         this.decompressed.crc32 = this.crc32;
         this.decompressed.compressionMethod = this.compressionMethod;
         this.decompressed.getCompressedContent = this.prepareCompressedContent(reader, reader.index, this.compressedSize, compression);
         this.decompressed.getContent = this.prepareContent(reader, reader.index, this.compressedSize, compression, this.uncompressedSize);

         // we need to compute the crc32...
         if (this.loadOptions.checkCRC32) {
            this.decompressed = JSZip.utils.transformTo("string", this.decompressed.getContent());
            if (JSZip.prototype.crc32(this.decompressed) !== this.crc32) {
               throw new Error("Corrupted zip : CRC32 mismatch");
            }
         }
      },

      /**
       * Read the central part of a zip file and add the info in this object.
       * @param {DataReader} reader the reader to use.
       */
      readCentralPart: function readCentralPart(reader) {
         this.versionMadeBy = reader.readString(2);
         this.versionNeeded = reader.readInt(2);
         this.bitFlag = reader.readInt(2);
         this.compressionMethod = reader.readString(2);
         this.date = reader.readDate();
         this.crc32 = reader.readInt(4);
         this.compressedSize = reader.readInt(4);
         this.uncompressedSize = reader.readInt(4);
         this.fileNameLength = reader.readInt(2);
         this.extraFieldsLength = reader.readInt(2);
         this.fileCommentLength = reader.readInt(2);
         this.diskNumberStart = reader.readInt(2);
         this.internalFileAttributes = reader.readInt(2);
         this.externalFileAttributes = reader.readInt(4);
         this.localHeaderOffset = reader.readInt(4);

         if (this.isEncrypted()) {
            throw new Error("Encrypted zip are not supported");
         }

         this.fileName = reader.readString(this.fileNameLength);
         this.readExtraFields(reader);
         this.parseZIP64ExtraField(reader);
         this.fileComment = reader.readString(this.fileCommentLength);

         // warning, this is true only for zip with madeBy == DOS (plateform dependent feature)
         this.dir = this.externalFileAttributes & 0x00000010 ? true : false;
      },
      /**
       * Parse the ZIP64 extra field and merge the info in the current ZipEntry.
       * @param {DataReader} reader the reader to use.
       */
      parseZIP64ExtraField: function parseZIP64ExtraField(reader) {

         if (!this.extraFields[0x0001]) {
            return;
         }

         // should be something, preparing the extra reader
         var extraReader = new StringReader(this.extraFields[0x0001].value);

         // I really hope that these 64bits integer can fit in 32 bits integer, because js
         // won't let us have more.
         if (this.uncompressedSize === MAX_VALUE_32BITS) {
            this.uncompressedSize = extraReader.readInt(8);
         }
         if (this.compressedSize === MAX_VALUE_32BITS) {
            this.compressedSize = extraReader.readInt(8);
         }
         if (this.localHeaderOffset === MAX_VALUE_32BITS) {
            this.localHeaderOffset = extraReader.readInt(8);
         }
         if (this.diskNumberStart === MAX_VALUE_32BITS) {
            this.diskNumberStart = extraReader.readInt(4);
         }
      },
      /**
       * Read the central part of a zip file and add the info in this object.
       * @param {DataReader} reader the reader to use.
       */
      readExtraFields: function readExtraFields(reader) {
         var start = reader.index,
             extraFieldId,
             extraFieldLength,
             extraFieldValue;

         this.extraFields = this.extraFields || {};

         while (reader.index < start + this.extraFieldsLength) {
            extraFieldId = reader.readInt(2);
            extraFieldLength = reader.readInt(2);
            extraFieldValue = reader.readString(extraFieldLength);

            this.extraFields[extraFieldId] = {
               id: extraFieldId,
               length: extraFieldLength,
               value: extraFieldValue
            };
         }
      },
      /**
       * Apply an UTF8 transformation if needed.
       */
      handleUTF8: function handleUTF8() {
         if (this.useUTF8()) {
            this.fileName = JSZip.prototype.utf8decode(this.fileName);
            this.fileComment = JSZip.prototype.utf8decode(this.fileComment);
         }
      }
   };
   // }}} end of ZipEntry

   //  class ZipEntries {{{
   /**
    * All the entries in the zip file.
    * @constructor
    * @param {String|ArrayBuffer|Uint8Array|Buffer} data the binary data to load.
    * @param {Object} loadOptions Options for loading the data.
    */
   function ZipEntries(data, loadOptions) {
      this.files = [];
      this.loadOptions = loadOptions;
      if (data) {
         this.load(data);
      }
   }
   ZipEntries.prototype = {
      /**
       * Check that the reader is on the speficied signature.
       * @param {string} expectedSignature the expected signature.
       * @throws {Error} if it is an other signature.
       */
      checkSignature: function checkSignature(expectedSignature) {
         var signature = this.reader.readString(4);
         if (signature !== expectedSignature) {
            throw new Error("Corrupted zip or bug : unexpected signature " + "(" + pretty(signature) + ", expected " + pretty(expectedSignature) + ")");
         }
      },
      /**
       * Read the end of the central directory.
       */
      readBlockEndOfCentral: function readBlockEndOfCentral() {
         this.diskNumber = this.reader.readInt(2);
         this.diskWithCentralDirStart = this.reader.readInt(2);
         this.centralDirRecordsOnThisDisk = this.reader.readInt(2);
         this.centralDirRecords = this.reader.readInt(2);
         this.centralDirSize = this.reader.readInt(4);
         this.centralDirOffset = this.reader.readInt(4);

         this.zipCommentLength = this.reader.readInt(2);
         this.zipComment = this.reader.readString(this.zipCommentLength);
      },
      /**
       * Read the end of the Zip 64 central directory.
       * Not merged with the method readEndOfCentral :
       * The end of central can coexist with its Zip64 brother,
       * I don't want to read the wrong number of bytes !
       */
      readBlockZip64EndOfCentral: function readBlockZip64EndOfCentral() {
         this.zip64EndOfCentralSize = this.reader.readInt(8);
         this.versionMadeBy = this.reader.readString(2);
         this.versionNeeded = this.reader.readInt(2);
         this.diskNumber = this.reader.readInt(4);
         this.diskWithCentralDirStart = this.reader.readInt(4);
         this.centralDirRecordsOnThisDisk = this.reader.readInt(8);
         this.centralDirRecords = this.reader.readInt(8);
         this.centralDirSize = this.reader.readInt(8);
         this.centralDirOffset = this.reader.readInt(8);

         this.zip64ExtensibleData = {};
         var extraDataSize = this.zip64EndOfCentralSize - 44,
             index = 0,
             extraFieldId,
             extraFieldLength,
             extraFieldValue;
         while (index < extraDataSize) {
            extraFieldId = this.reader.readInt(2);
            extraFieldLength = this.reader.readInt(4);
            extraFieldValue = this.reader.readString(extraFieldLength);
            this.zip64ExtensibleData[extraFieldId] = {
               id: extraFieldId,
               length: extraFieldLength,
               value: extraFieldValue
            };
         }
      },
      /**
       * Read the end of the Zip 64 central directory locator.
       */
      readBlockZip64EndOfCentralLocator: function readBlockZip64EndOfCentralLocator() {
         this.diskWithZip64CentralDirStart = this.reader.readInt(4);
         this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8);
         this.disksCount = this.reader.readInt(4);
         if (this.disksCount > 1) {
            throw new Error("Multi-volumes zip are not supported");
         }
      },
      /**
       * Read the local files, based on the offset read in the central part.
       */
      readLocalFiles: function readLocalFiles() {
         var i, file;
         for (i = 0; i < this.files.length; i++) {
            file = this.files[i];
            this.reader.setIndex(file.localHeaderOffset);
            this.checkSignature(JSZip.signature.LOCAL_FILE_HEADER);
            file.readLocalPart(this.reader);
            file.handleUTF8();
         }
      },
      /**
       * Read the central directory.
       */
      readCentralDir: function readCentralDir() {
         var file;

         this.reader.setIndex(this.centralDirOffset);
         while (this.reader.readString(4) === JSZip.signature.CENTRAL_FILE_HEADER) {
            file = new ZipEntry({
               zip64: this.zip64
            }, this.loadOptions);
            file.readCentralPart(this.reader);
            this.files.push(file);
         }
      },
      /**
       * Read the end of central directory.
       */
      readEndOfCentral: function readEndOfCentral() {
         var offset = this.reader.lastIndexOfSignature(JSZip.signature.CENTRAL_DIRECTORY_END);
         if (offset === -1) {
            throw new Error("Corrupted zip : can't find end of central directory");
         }
         this.reader.setIndex(offset);
         this.checkSignature(JSZip.signature.CENTRAL_DIRECTORY_END);
         this.readBlockEndOfCentral();

         /* extract from the zip spec :
            4)  If one of the fields in the end of central directory
                record is too small to hold required data, the field
                should be set to -1 (0xFFFF or 0xFFFFFFFF) and the
                ZIP64 format record should be created.
            5)  The end of central directory record and the
                Zip64 end of central directory locator record must
                reside on the same disk when splitting or spanning
                an archive.
         */
         if (this.diskNumber === MAX_VALUE_16BITS || this.diskWithCentralDirStart === MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === MAX_VALUE_16BITS || this.centralDirRecords === MAX_VALUE_16BITS || this.centralDirSize === MAX_VALUE_32BITS || this.centralDirOffset === MAX_VALUE_32BITS) {
            this.zip64 = true;

            /*
            Warning : the zip64 extension is supported, but ONLY if the 64bits integer read from
            the zip file can fit into a 32bits integer. This cannot be solved : Javascript represents
            all numbers as 64-bit double precision IEEE 754 floating point numbers.
            So, we have 53bits for integers and bitwise operations treat everything as 32bits.
            see https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Operators/Bitwise_Operators
            and http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-262.pdf section 8.5
            */

            // should look for a zip64 EOCD locator
            offset = this.reader.lastIndexOfSignature(JSZip.signature.ZIP64_CENTRAL_DIRECTORY_LOCATOR);
            if (offset === -1) {
               throw new Error("Corrupted zip : can't find the ZIP64 end of central directory locator");
            }
            this.reader.setIndex(offset);
            this.checkSignature(JSZip.signature.ZIP64_CENTRAL_DIRECTORY_LOCATOR);
            this.readBlockZip64EndOfCentralLocator();

            // now the zip64 EOCD record
            this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir);
            this.checkSignature(JSZip.signature.ZIP64_CENTRAL_DIRECTORY_END);
            this.readBlockZip64EndOfCentral();
         }
      },
      prepareReader: function prepareReader(data) {
         var type = JSZip.utils.getTypeOf(data);
         if (type === "string" && !JSZip.support.uint8array) {
            this.reader = new StringReader(data, this.loadOptions.optimizedBinaryString);
         } else if (type === "nodebuffer") {
            this.reader = new NodeBufferReader(data);
         } else {
            this.reader = new Uint8ArrayReader(JSZip.utils.transformTo("uint8array", data));
         }
      },
      /**
       * Read a zip file and create ZipEntries.
       * @param {String|ArrayBuffer|Uint8Array|Buffer} data the binary string representing a zip file.
       */
      load: function load(data) {
         this.prepareReader(data);
         this.readEndOfCentral();
         this.readCentralDir();
         this.readLocalFiles();
      }
   };
   // }}} end of ZipEntries

   /**
    * Implementation of the load method of JSZip.
    * It uses the above classes to decode a zip file, and load every files.
    * @param {String|ArrayBuffer|Uint8Array|Buffer} data the data to load.
    * @param {Object} options Options for loading the data.
    *  options.base64 : is the data in base64 ? default : false
    */
   JSZip.prototype.load = function (data, options) {
      var files, zipEntries, i, input;
      options = options || {};
      if (options.base64) {
         data = JSZip.base64.decode(data);
      }

      zipEntries = new ZipEntries(data, options);
      files = zipEntries.files;
      for (i = 0; i < files.length; i++) {
         input = files[i];
         this.file(input.fileName, input.decompressed, {
            binary: true,
            optimizedBinaryString: true,
            date: input.date,
            dir: input.dir
         });
      }

      return this;
   };
})(undefined);
if (typeof exports !== 'undefined') exports.JSZip = JSZip;
// enforcing Stuk's coding style
// vim: set shiftwidth=3 softtabstop=3 foldmethod=marker:
'use strict';

(function (undefined) {
    'use strict';
    // Check if dependecies are available.

    if (typeof XLSX === 'undefined') {
        console.log('xlsx.js is required. Get it from https://github.com/SheetJS/js-xlsx');
        return;
    }

    if (typeof _ === 'undefined') {
        console.log('Lodash.js is required. Get it from http://lodash.com/');
        return;
    }

    // Baseline setup
    // --------------

    // Establish the root object, `window` in the browser, or `exports` on the server.
    var root = this;

    // Save the previous value of the `XLSXReader` variable.
    var previousXLSXReader = root.XLSXReader;

    // Create a safe reference to the XLSXReader object for use below.
    var XLSXReader = function XLSXReader(file, readCells, handler) {
        var obj = {};
        XLSXReader.utils.intializeFromFile(obj, file, readCells, handler);
        return obj;
    };

    // Export the XLSXReader object for **Node.js**, with
    // backwards-compatibility for the old `require()` API. If we're in
    // the browser, add `XLSXReader` as a global object via a string identifier,
    // for Closure Compiler 'advanced' mode.
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = XLSXReader;
        }
        exports.XLSXReader = XLSXReader;
    } else {
        root.XLSXReader = XLSXReader;
    }

    // Current version.
    XLSXReader.VERSION = '0.0.1';

    XLSXReader.utils = {
        'intializeFromFile': function intializeFromFile(obj, file, readCells, handler) {
            var reader = new FileReader();

            reader.onload = function (e) {
                var data = e.target.result;
                var workbook = XLSX.read(data, {
                    type: 'binary'
                });

                obj.sheets = XLSXReader.utils.parseWorkbook(workbook, readCells);
                handler(obj);
            };

            reader.readAsBinaryString(file);
        },
        'parseWorkbook': function parseWorkbook(workbook, readCells) {
            var sheets = {};

            _.forEachRight(workbook.SheetNames, function (sheetName) {
                var sheet = workbook.Sheets[sheetName];
                sheets[sheetName] = XLSXReader.utils.parseSheet(sheet, readCells);
            });

            return sheets;
        },
        'parseSheet': function parseSheet(sheet, readCells) {
            var range = XLSX.utils.decode_range(sheet['!ref']);
            var sheetData = [];

            if (readCells === true) {
                _.forEachRight(_.range(range.s.r, range.e.r + 1), function (row) {
                    var rowData = [];
                    _.forEachRight(_.range(range.s.c, range.e.c + 1), function (column) {
                        var cellIndex = XLSX.utils.encode_cell({
                            'c': column,
                            'r': row
                        });
                        var cell = sheet[cellIndex];
                        rowData[column] = cell ? cell.v : undefined;
                    });
                    sheetData[row] = rowData;
                });
            };

            return {
                'data': sheetData,
                'name': sheet.name,
                'col_size': range.e.c + 1,
                'row_size': range.e.r + 1
            };
        }
    };
}).call(undefined);
"use strict";

/* xlsx.js (C) 2013 SheetJS -- http://sheetjs.com */
/* vim: set ts=2: */
/*jshint eqnull:true */
/* Spreadsheet Format -- jump to XLSX for the XLSX code */
/* ssf.js (C) 2013 SheetJS -- http://sheetjs.com */
var SSF = {};
var make_ssf = function make_ssf(SSF) {
	String.prototype.reverse = function () {
		return this.split("").reverse().join("");
	};
	var _strrev = function _strrev(x) {
		return String(x).reverse();
	};
	function fill(c, l) {
		return new Array(l + 1).join(c);
	}
	function pad(v, d, c) {
		var t = String(v);return t.length >= d ? t : fill(c || 0, d - t.length) + t;
	}
	function rpad(v, d, c) {
		var t = String(v);return t.length >= d ? t : t + fill(c || 0, d - t.length);
	}
	/* Options */
	var opts_fmt = {};
	function fixopts(o) {
		for (var y in opts_fmt) {
			if (o[y] === undefined) o[y] = opts_fmt[y];
		}
	}
	SSF.opts = opts_fmt;
	opts_fmt.date1904 = 0;
	opts_fmt.output = "";
	opts_fmt.mode = "";
	var table_fmt = {
		1: '0',
		2: '0.00',
		3: '#,##0',
		4: '#,##0.00',
		9: '0%',
		10: '0.00%',
		11: '0.00E+00',
		12: '# ?/?',
		13: '# ??/??',
		14: 'm/d/yy',
		15: 'd-mmm-yy',
		16: 'd-mmm',
		17: 'mmm-yy',
		18: 'h:mm AM/PM',
		19: 'h:mm:ss AM/PM',
		20: 'h:mm',
		21: 'h:mm:ss',
		22: 'm/d/yy h:mm',
		37: '#,##0 ;(#,##0)',
		38: '#,##0 ;[Red](#,##0)',
		39: '#,##0.00;(#,##0.00)',
		40: '#,##0.00;[Red](#,##0.00)',
		45: 'mm:ss',
		46: '[h]:mm:ss',
		47: 'mmss.0',
		48: '##0.0E+0',
		49: '@'
	};
	var days = [['Sun', 'Sunday'], ['Mon', 'Monday'], ['Tue', 'Tuesday'], ['Wed', 'Wednesday'], ['Thu', 'Thursday'], ['Fri', 'Friday'], ['Sat', 'Saturday']];
	var months = [['J', 'Jan', 'January'], ['F', 'Feb', 'February'], ['M', 'Mar', 'March'], ['A', 'Apr', 'April'], ['M', 'May', 'May'], ['J', 'Jun', 'June'], ['J', 'Jul', 'July'], ['A', 'Aug', 'August'], ['S', 'Sep', 'September'], ['O', 'Oct', 'October'], ['N', 'Nov', 'November'], ['D', 'Dec', 'December']];
	var frac = function frac(x, D, mixed) {
		var sgn = x < 0 ? -1 : 1;
		var B = x * sgn;
		var P_2 = 0,
		    P_1 = 1,
		    P = 0;
		var Q_2 = 1,
		    Q_1 = 0,
		    Q = 0;
		var A = B | 0;
		while (Q_1 < D) {
			A = B | 0;
			P = A * P_1 + P_2;
			Q = A * Q_1 + Q_2;
			if (B - A < 0.0000000001) break;
			B = 1 / (B - A);
			P_2 = P_1;P_1 = P;
			Q_2 = Q_1;Q_1 = Q;
		}
		if (Q > D) {
			Q = Q_1;P = P_1;
		}
		if (Q > D) {
			Q = Q_2;P = P_2;
		}
		if (!mixed) return [0, sgn * P, Q];
		var q = Math.floor(sgn * P / Q);
		return [q, sgn * P - q * Q, Q];
	};
	var general_fmt = function general_fmt(v) {
		if (typeof v === 'boolean') return v ? "TRUE" : "FALSE";
		if (typeof v === 'number') {
			var o,
			    V = v < 0 ? -v : v;
			if (V >= 0.1 && V < 1) o = v.toPrecision(9);else if (V >= 0.01 && V < 0.1) o = v.toPrecision(8);else if (V >= 0.001 && V < 0.01) o = v.toPrecision(7);else if (V >= 0.0001 && V < 0.001) o = v.toPrecision(6);else if (V >= Math.pow(10, 10) && V < Math.pow(10, 11)) o = v.toFixed(10).substr(0, 12);else if (V > Math.pow(10, -9) && V < Math.pow(10, 11)) {
				o = v.toFixed(12).replace(/(\.[0-9]*[1-9])0*$/, "$1").replace(/\.$/, "");
				if (o.length > 11 + (v < 0 ? 1 : 0)) o = v.toPrecision(10);
				if (o.length > 11 + (v < 0 ? 1 : 0)) o = v.toExponential(5);
			} else {
				o = v.toFixed(11).replace(/(\.[0-9]*[1-9])0*$/, "$1");
				if (o.length > 11 + (v < 0 ? 1 : 0)) o = v.toPrecision(6);
			}
			o = o.replace(/(\.[0-9]*[1-9])0+e/, "$1e").replace(/\.0*e/, "e");
			return o.replace("e", "E").replace(/\.0*$/, "").replace(/\.([0-9]*[^0])0*$/, ".$1").replace(/(E[+-])([0-9])$/, "$1" + "0" + "$2");
		}
		if (typeof v === 'string') return v;
		throw "unsupported value in General format: " + v;
	};
	SSF._general = general_fmt;
	var parse_date_code = function parse_date_code(v, opts) {
		var date = Math.floor(v),
		    time = Math.round(86400 * (v - date)),
		    dow = 0;
		var dout = [],
		    out = { D: date, T: time, u: 86400 * (v - date) - time };fixopts(opts = opts || {});
		if (opts.date1904) date += 1462;
		if (date === 60) {
			dout = [1900, 2, 29];dow = 3;
		} else if (date === 0) {
			dout = [1900, 1, 0];dow = 6;
		} else {
			if (date > 60) --date;
			/* 1 = Jan 1 1900 */
			var d = new Date(1900, 0, 1);
			d.setDate(d.getDate() + date - 1);
			dout = [d.getFullYear(), d.getMonth() + 1, d.getDate()];
			dow = d.getDay();
			if (opts.mode === 'excel' && date < 60) dow = (dow + 6) % 7;
		}
		out.y = dout[0];out.m = dout[1];out.d = dout[2];
		out.S = time % 60;time = Math.floor(time / 60);
		out.M = time % 60;time = Math.floor(time / 60);
		out.H = time;
		out.q = dow;
		return out;
	};
	SSF.parse_date_code = parse_date_code;
	var write_date = function write_date(type, fmt, val) {
		if (val < 0) return "";
		switch (type) {
			case 'y':
				switch (fmt) {/* year */
					case 'y':case 'yy':
						return pad(val.y % 100, 2);
					default:
						return val.y;
				}break;
			case 'm':
				switch (fmt) {/* month */
					case 'm':
						return val.m;
					case 'mm':
						return pad(val.m, 2);
					case 'mmm':
						return months[val.m - 1][1];
					case 'mmmm':
						return months[val.m - 1][2];
					case 'mmmmm':
						return months[val.m - 1][0];
					default:
						throw 'bad month format: ' + fmt;
				}break;
			case 'd':
				switch (fmt) {/* day */
					case 'd':
						return val.d;
					case 'dd':
						return pad(val.d, 2);
					case 'ddd':
						return days[val.q][0];
					case 'dddd':
						return days[val.q][1];
					default:
						throw 'bad day format: ' + fmt;
				}break;
			case 'h':
				switch (fmt) {/* 12-hour */
					case 'h':
						return 1 + (val.H + 11) % 12;
					case 'hh':
						return pad(1 + (val.H + 11) % 12, 2);
					default:
						throw 'bad hour format: ' + fmt;
				}break;
			case 'H':
				switch (fmt) {/* 24-hour */
					case 'h':
						return val.H;
					case 'hh':
						return pad(val.H, 2);
					default:
						throw 'bad hour format: ' + fmt;
				}break;
			case 'M':
				switch (fmt) {/* minutes */
					case 'm':
						return val.M;
					case 'mm':
						return pad(val.M, 2);
					default:
						throw 'bad minute format: ' + fmt;
				}break;
			case 's':
				switch (fmt) {/* seconds */
					case 's':
						return val.S;
					case 'ss':
						return pad(val.S, 2);
					case 'ss.0':
						return pad(val.S, 2) + "." + Math.round(10 * val.u);
					default:
						throw 'bad second format: ' + fmt;
				}break;
			case 'Z':
				switch (fmt) {
					case '[h]':
						return val.D * 24 + val.H;
					default:
						throw 'bad abstime format: ' + fmt;
				}break;
			/* TODO: handle the ECMA spec format ee -> yy */
			case 'e':
				{
					return val.y;
				}break;
			case 'A':
				return (val.h >= 12 ? 'P' : 'A') + fmt.substr(1);
			default:
				throw 'bad format type ' + type + ' in ' + fmt;
		}
	};
	String.prototype.reverse = function () {
		return this.split("").reverse().join("");
	};
	var commaify = function commaify(s) {
		return s.reverse().replace(/.../g, "$&,").reverse().replace(/^,/, "");
	};
	var write_num = function write_num(type, fmt, val) {
		if (type === '(') {
			var ffmt = fmt.replace(/\( */, "").replace(/ \)/, "").replace(/\)/, "");
			if (val >= 0) return write_num('n', ffmt, val);
			return '(' + write_num('n', ffmt, -val) + ')';
		}
		var mul = 0,
		    o;
		fmt = fmt.replace(/%/g, function (x) {
			mul++;return "";
		});
		if (mul !== 0) return write_num(type, fmt, val * Math.pow(10, 2 * mul)) + fill("%", mul);
		if (fmt.indexOf("E") > -1) {
			var idx = fmt.indexOf("E") - fmt.indexOf(".") - 1;
			if (fmt == '##0.0E+0') {
				var ee = Number(val.toExponential(0).substr(3)) % 3;
				o = (val / Math.pow(10, ee % 3)).toPrecision(idx + 1 + ee % 3).replace(/^([+-]?)([0-9]*)\.([0-9]*)[Ee]/, function ($$, $1, $2, $3) {
					return $1 + $2 + $3.substr(0, ee) + "." + $3.substr(ee) + "E";
				});
			} else o = val.toExponential(idx);
			if (fmt.match(/E\+00$/) && o.match(/e[+-][0-9]$/)) o = o.substr(0, o.length - 1) + "0" + o[o.length - 1];
			if (fmt.match(/E\-/) && o.match(/e\+/)) o = o.replace(/e\+/, "e");
			return o.replace("e", "E");
		}
		if (fmt[0] === "$") return "$" + write_num(type, fmt.substr(fmt[1] == ' ' ? 2 : 1), val);
		var r,
		    ff,
		    aval = val < 0 ? -val : val,
		    sign = val < 0 ? "-" : "";
		if (r = fmt.match(/# (\?+) \/ (\d+)/)) {
			var den = Number(r[2]),
			    rnd = Math.round(aval * den),
			    base = Math.floor(rnd / den);
			var myn = rnd - base * den,
			    myd = den;
			return sign + (base ? base : "") + " " + (myn === 0 ? fill(" ", r[1].length + 1 + r[2].length) : pad(myn, r[1].length, " ") + "/" + pad(myd, r[2].length));
		}
		if (fmt.match(/^00*$/)) return (val < 0 ? "-" : "") + pad(Math.round(Math.abs(val)), fmt.length);
		if (fmt.match(/^####*$/)) return "dafuq";
		switch (fmt) {
			case "0":
				return Math.round(val);
			case "0.0":
				o = Math.round(val * 10);
				return String(o / 10).replace(/^([^\.]+)$/, "$1.0").replace(/\.$/, ".0");
			case "0.00":
				o = Math.round(val * 100);
				return String(o / 100).replace(/^([^\.]+)$/, "$1.00").replace(/\.$/, ".00").replace(/\.([0-9])$/, ".$1" + "0");
			case "0.000":
				o = Math.round(val * 1000);
				return String(o / 1000).replace(/^([^\.]+)$/, "$1.000").replace(/\.$/, ".000").replace(/\.([0-9])$/, ".$1" + "00").replace(/\.([0-9][0-9])$/, ".$1" + "0");
			case "#,##0":
				return sign + commaify(String(Math.round(aval)));
			case "#,##0.0":
				r = Math.round((val - Math.floor(val)) * 10);return val < 0 ? "-" + write_num(type, fmt, -val) : commaify(String(Math.floor(val))) + "." + r;
			case "#,##0.00":
				r = Math.round((val - Math.floor(val)) * 100);return val < 0 ? "-" + write_num(type, fmt, -val) : commaify(String(Math.floor(val))) + "." + (r < 10 ? "0" + r : r);
			case "# ? / ?":
				ff = frac(aval, 9, true);return sign + (ff[0] || "") + " " + (ff[1] === 0 ? "   " : ff[1] + "/" + ff[2]);
			case "# ?? / ??":
				ff = frac(aval, 99, true);return sign + (ff[0] || "") + " " + (ff[1] ? pad(ff[1], 2, " ") + "/" + rpad(ff[2], 2, " ") : "     ");
			case "# ??? / ???":
				ff = frac(aval, 999, true);return sign + (ff[0] || "") + " " + (ff[1] ? pad(ff[1], 3, " ") + "/" + rpad(ff[2], 3, " ") : "       ");
			default:
		}
		throw new Error("unsupported format |" + fmt + "|");
	};
	function split_fmt(fmt) {
		var out = [];
		var in_str = -1;
		for (var i = 0, j = 0; i < fmt.length; ++i) {
			if (in_str != -1) {
				if (fmt[i] == '"') in_str = -1;continue;
			}
			if (fmt[i] == "_" || fmt[i] == "*" || fmt[i] == "\\") {
				++i;continue;
			}
			if (fmt[i] == '"') {
				in_str = i;continue;
			}
			if (fmt[i] != ";") continue;
			out.push(fmt.slice(j, i));
			j = i + 1;
		}
		out.push(fmt.slice(j));
		if (in_str != -1) throw "Format |" + fmt + "| unterminated string at " + in_str;
		return out;
	}
	SSF._split = split_fmt;
	function eval_fmt(fmt, v, opts, flen) {
		var out = [],
		    o = "",
		    i = 0,
		    c = "",
		    lst = 't',
		    q = {},
		    dt;
		fixopts(opts = opts || {});
		var hr = 'H';
		/* Tokenize */
		while (i < fmt.length) {
			switch (c = fmt[i]) {
				case '"':
					/* Literal text */
					for (o = ""; fmt[++i] !== '"' && i < fmt.length;) {
						o += fmt[i];
					}out.push({ t: 't', v: o });++i;break;
				case '\\':
					var w = fmt[++i],
					    t = "()".indexOf(w) === -1 ? 't' : w;
					out.push({ t: t, v: w });++i;break;
				case '_':
					out.push({ t: 't', v: " " });i += 2;break;
				case '@':
					/* Text Placeholder */
					out.push({ t: 'T', v: v });++i;break;
				/* Dates */
				case 'm':case 'd':case 'y':case 'h':case 's':case 'e':
					if (v < 0) return "";
					if (!dt) dt = parse_date_code(v, opts);
					o = fmt[i];while (fmt[++i] === c) {
						o += c;
					}if (c === 's' && fmt[i] === '.' && fmt[i + 1] === '0') {
						o += '.';while (fmt[++i] === '0') {
							o += '0';
						}
					}
					if (c === 'm' && lst.toLowerCase() === 'h') c = 'M'; /* m = minute */
					if (c === 'h') c = hr;
					q = { t: c, v: o };out.push(q);lst = c;break;
				case 'A':
					if (!dt) dt = parse_date_code(v, opts);
					q = { t: c, v: "A" };
					if (fmt.substr(i, 3) === "A/P") {
						q.v = dt.H >= 12 ? "P" : "A";q.t = 'T';hr = 'h';i += 3;
					} else if (fmt.substr(i, 5) === "AM/PM") {
						q.v = dt.H >= 12 ? "PM" : "AM";q.t = 'T';i += 5;hr = 'h';
					} else q.t = "t";
					out.push(q);lst = c;break;
				case '[':
					/* TODO: Fix this -- ignore all conditionals and formatting */
					o = c;
					while (fmt[i++] !== ']') {
						o += fmt[i];
					}if (o == "[h]") out.push({ t: 'Z', v: o });
					break;
				/* Numbers */
				case '0':case '#':
					o = c;while ("0#?.,E+-%".indexOf(c = fmt[++i]) > -1) {
						o += c;
					}out.push({ t: 'n', v: o });break;
				case '?':
					o = fmt[i];while (fmt[++i] === c) {
						o += c;
					}q = { t: c, v: o };out.push(q);lst = c;break;
				case '*':
					++i;if (fmt[i] == ' ') ++i;break; // **
				case '(':case ')':
					out.push({ t: flen === 1 ? 't' : c, v: c });++i;break;
				case '1':case '2':case '3':case '4':case '5':case '6':case '7':case '8':case '9':
					o = fmt[i];while ("0123456789".indexOf(fmt[++i]) > -1) {
						o += fmt[i];
					}out.push({ t: 'D', v: o });break;
				case ' ':
					out.push({ t: c, v: c });++i;break;
				default:
					if ("$-+/():!^&'~{}<>=".indexOf(c) === -1) throw 'unrecognized character ' + fmt[i] + ' in ' + fmt;
					out.push({ t: 't', v: c });++i;break;
			}
		}

		/* walk backwards */
		for (i = out.length - 1, lst = 't'; i >= 0; --i) {
			switch (out[i].t) {
				case 'h':case 'H':
					out[i].t = hr;lst = 'h';break;
				case 'd':case 'y':case 's':case 'M':case 'e':
					lst = out[i].t;break;
				case 'm':
					if (lst === 's') out[i].t = 'M';break;
			}
		}

		/* replace fields */
		for (i = 0; i < out.length; ++i) {
			switch (out[i].t) {
				case 't':case 'T':case ' ':
					break;
				case 'd':case 'm':case 'y':case 'h':case 'H':case 'M':case 's':case 'A':case 'e':case 'Z':
					out[i].v = write_date(out[i].t, out[i].v, dt);
					out[i].t = 't';break;
				case 'n':case '(':
					var jj = i + 1;
					while (out[jj] && ("? D".indexOf(out[jj].t) > -1 || out[i].t == '(' && (out[jj].t == ')' || out[jj].t == 'n') || out[jj].t == 't' && (out[jj].v == '/' || out[jj].v == '$' || out[jj].v == ' ' && (out[jj + 1] || {}).t == '?'))) {
						if (out[jj].v !== ' ') out[i].v += ' ' + out[jj].v;
						delete out[jj];++jj;
					}
					out[i].v = write_num(out[i].t, out[i].v, v);
					out[i].t = 't';
					i = jj;break;
				default:
					throw "unrecognized type " + out[i].t;
			}
		}

		return out.map(function (x) {
			return x.v;
		}).join("");
	}
	SSF._eval = eval_fmt;
	function choose_fmt(fmt, v, o) {
		if (typeof fmt === 'number') fmt = table_fmt[fmt];
		if (typeof fmt === "string") fmt = split_fmt(fmt);
		var l = fmt.length;
		switch (fmt.length) {
			case 1:
				fmt = [fmt[0], fmt[0], fmt[0], "@"];break;
			case 2:
				fmt = [fmt[0], fmt[fmt[1] === "@" ? 0 : 1], fmt[0], "@"];break;
			case 4:
				break;
			default:
				throw "cannot find right format for |" + fmt + "|";
		}
		if (typeof v !== "number") return [fmt.length, fmt[3]];
		return [l, v > 0 ? fmt[0] : v < 0 ? fmt[1] : fmt[2]];
	}

	var format = function format(fmt, v, o) {
		fixopts(o = o || {});
		if (fmt === 0) return general_fmt(v, o);
		if (typeof fmt === 'number') fmt = table_fmt[fmt];
		var f = choose_fmt(fmt, v, o);
		return eval_fmt(f[1], v, o, f[0]);
	};

	SSF._choose = choose_fmt;
	SSF._table = table_fmt;
	SSF.load = function (fmt, idx) {
		table_fmt[idx] = fmt;
	};
	SSF.format = format;
};
make_ssf(SSF);
var XLSX = {};
(function (XLSX) {
	function parsexmltag(tag) {
		var words = tag.split(/\s+/);
		var z = { '0': words[0] };
		if (words.length === 1) return z;
		(tag.match(/(\w+)="([^"]*)"/g) || []).map(function (x) {
			var y = x.match(/(\w+)="([^"]*)"/);z[y[1]] = y[2];
		});
		return z;
	}

	var encodings = {
		'&quot;': '"',
		'&apos;': "'",
		'&gt;': '>',
		'&lt;': '<',
		'&amp;': '&'
	};

	// TODO: CP remap (need to read file version to determine OS)
	function unescapexml(text) {
		var s = text + '';
		for (var y in encodings) {
			s = s.replace(new RegExp(y, 'g'), encodings[y]);
		}return s.replace(/_x([0-9a-fA-F]*)_/g, function (m, c) {
			return _chr(parseInt(c, 16));
		});
	}

	function parsexmlbool(value, tag) {
		switch (value) {
			case '0':case 0:case 'false':case 'FALSE':
				return false;
			case '1':case 1:case 'true':case 'TRUE':
				return true;
			default:
				throw "bad boolean value " + value + " in " + (tag || "?");
		}
	}

	var utf8read = function utf8read(orig) {
		var out = "",
		    i = 0,
		    c = 0,
		    c1 = 0,
		    c2 = 0,
		    c3 = 0;
		while (i < orig.length) {
			c = orig.charCodeAt(i++);
			if (c < 128) out += _chr(c);else {
				c2 = orig.charCodeAt(i++);
				if (c > 191 && c < 224) out += _chr((c & 31) << 6 | c2 & 63);else {
					c3 = orig.charCodeAt(i++);
					out += _chr((c & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
				}
			}
		}
		return out;
	};

	// matches <foo>...</foo> extracts content
	function matchtag(f, g) {
		return new RegExp('<' + f + "(?: xml:space=\"preserve\")?>([^☃]*)</" + f + '>', (g || "") + "m");
	}

	function parseVector(data) {
		var h = parsexmltag(data);

		var matches = data.match(new RegExp("<vt:" + h.baseType + ">(.*?)</vt:" + h.baseType + ">", 'g')) || [];
		if (matches.length != h.size) throw "unexpected vector length " + matches.length + " != " + h.size;
		var res = [];
		matches.forEach(function (x) {
			var v = x.replace(/<[/]?vt:variant>/g, "").match(/<vt:([^>]*)>(.*)</);
			res.push({ v: v[2], t: v[1] });
		});
		return res;
	}

	function isval(x) {
		return typeof x !== "undefined" && x !== null;
	}
	/* 18.4 Shared String Table */
	var parse_sst = function () {
		var tregex = matchtag("t"),
		    rpregex = matchtag("rPr");
		/* Parse a list of <r> tags */
		var parse_rs = function () {
			/* 18.4.7 rPr CT_RPrElt */
			var parse_rpr = function parse_rpr(rpr, intro, outro) {
				var font = {};
				(rpr.match(/<[^>]*>/g) || []).forEach(function (x) {
					var y = parsexmltag(x);
					switch (y[0]) {
						/* 18.8.12 condense CT_BooleanProperty */
						/* ** not required . */
						case '<condense':
							break;
						/* 18.8.17 extend CT_BooleanProperty */
						/* ** not required . */
						case '<extend':
							break;
						/* 18.8.36 shadow CT_BooleanProperty */
						/* ** not required . */
						case '<shadow':
							break;

						/* 18.4.1 charset CT_IntProperty TODO */
						case '<charset':
							break;

						/* 18.4.2 outline CT_BooleanProperty TODO */
						case '<outline':
							break;

						/* 18.4.5 rFont CT_FontName */
						case '<rFont':
							font.name = y.val;break;

						/* 18.4.11 sz CT_FontSize */
						case '<sz':
							font.sz = y.val;break;

						/* 18.4.10 strike CT_BooleanProperty */
						case '<strike':
							if (!y.val) break;
						/* falls through */
						case '<strike/>':
							font.strike = 1;break;
						case '</strike>':
							break;

						/* 18.4.13 u CT_UnderlineProperty */
						case '<u':
							if (!y.val) break;
						/* falls through */
						case '<u/>':
							font.u = 1;break;
						case '</u>':
							break;

						/* 18.8.2 b */
						case '<b':
							if (!y.val) break;
						/* falls through */
						case '<b/>':
							font.b = 1;break;
						case '</b>':
							break;

						/* 18.8.26 i */
						case '<i':
							if (!y.val) break;
						/* falls through */
						case '<i/>':
							font.i = 1;break;
						case '</i>':
							break;

						/* 18.3.1.15 color CT_Color TODO: tint, theme, auto, indexed */
						case '<color':
							if (y.rgb) font.color = y.rgb.substr(2, 6);
							break;

						/* 18.8.18 family ST_FontFamily */
						case '<family':
							font.family = y.val;break;

						/* 18.4.14 vertAlign CT_VerticalAlignFontProperty TODO */
						case '<vertAlign':
							break;

						/* 18.8.35 scheme CT_FontScheme TODO */
						case '<scheme':
							break;

						default:
							if (y[0][2] !== '/') throw 'Unrecognized rich format ' + y[0];
					}
				});
				/* TODO: These should be generated styles, not inline */
				var style = [];
				if (font.b) style.push("font-weight: bold;");
				if (font.i) style.push("font-style: italic;");
				intro.push('<span style="' + style.join("") + '">');
				outro.push("</span>");
			};

			/* 18.4.4 r CT_RElt */
			function parse_r(r) {
				var terms = [[], "", []];
				/* 18.4.12 t ST_Xstring */
				var t = r.match(tregex);
				if (!isval(t)) return "";
				terms[1] = t[1];

				var rpr = r.match(rpregex);
				if (isval(rpr)) parse_rpr(rpr[1], terms[0], terms[2]);
				return terms[0].join("") + terms[1].replace(/\r\n/g, '<br/>') + terms[2].join("");
			}
			return function (rs) {
				return rs.replace(/<r>/g, "").split(/<\/r>/).map(parse_r).join("");
			};
		}();

		/* 18.4.8 si CT_Rst */
		var parse_si = function parse_si(x) {
			var z = {};
			if (!x) return z;
			var y;
			/* 18.4.12 t ST_Xstring (Plaintext String) */
			if (x[1] === 't') {
				z.t = utf8read(unescapexml(x.replace(/<[^>]*>/g, "")));
				z.raw = x;
				z.r = z.t;
			}
			/* 18.4.4 r CT_RElt (Rich Text Run) */
			else if (y = x.match(/<r>/)) {
					z.raw = x;
					/* TODO: properly parse (note: no other valid child can have body text) */
					z.t = utf8read(unescapexml(x.replace(/<[^>]*>/gm, "")));
					z.r = parse_rs(x);
				}
			/* 18.4.3 phoneticPr CT_PhoneticPr (TODO: needed for Asian support) */
			/* 18.4.6 rPh CT_PhoneticRun (TODO: needed for Asian support) */
			return z;
		};

		return function (data) {
			var s = [];
			/* 18.4.9 sst CT_Sst */
			var sst = data.match(new RegExp("<sst([^>]*)>([\\s\\S]*)<\/sst>", "m"));
			if (isval(sst)) {
				s = sst[2].replace(/<si>/g, "").split(/<\/si>/).map(parse_si);
				sst = parsexmltag(sst[1]);s.Count = sst.count;s.Unique = sst.uniqueCount;
			}
			return s;
		};
	}();

	var ct2type = {
		"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml": "workbooks",
		"application/vnd.openxmlformats-package.core-properties+xml": "coreprops",
		"application/vnd.openxmlformats-officedocument.extended-properties+xml": "extprops",
		"application/vnd.openxmlformats-officedocument.spreadsheetml.calcChain+xml": "calcchains",
		"application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml": "sheets",
		"application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml": "strs",
		"application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml": "styles",
		"application/vnd.openxmlformats-officedocument.theme+xml": "themes",
		"foo": "bar"
	};

	/* 18.2.28 (CT_WorkbookProtection) Defaults */
	var WBPropsDef = {
		allowRefreshQuery: '0',
		autoCompressPictures: '1',
		backupFile: '0',
		checkCompatibility: '0',
		codeName: '',
		date1904: '0',
		dateCompatibility: '1',
		//defaultThemeVersion: '0',
		filterPrivacy: '0',
		hidePivotFieldList: '0',
		promptedSolutions: '0',
		publishItems: '0',
		refreshAllConnections: false,
		saveExternalLinkValues: '1',
		showBorderUnselectedTables: '1',
		showInkAnnotation: '1',
		showObjects: 'all',
		showPivotChartFilter: '0'
		//updateLinks: 'userSet'
	};

	/* 18.2.30 (CT_BookView) Defaults */
	var WBViewDef = {
		activeTab: '0',
		autoFilterDateGrouping: '1',
		firstSheet: '0',
		minimized: '0',
		showHorizontalScroll: '1',
		showSheetTabs: '1',
		showVerticalScroll: '1',
		tabRatio: '600',
		visibility: 'visible'
		//window{Height,Width}, {x,y}Window
	};

	/* 18.2.19 (CT_Sheet) Defaults */
	var SheetDef = {
		state: 'visible'
	};

	/* 18.2.2  (CT_CalcPr) Defaults */
	var CalcPrDef = {
		calcCompleted: 'true',
		calcMode: 'auto',
		calcOnSave: 'true',
		concurrentCalc: 'true',
		fullCalcOnLoad: 'false',
		fullPrecision: 'true',
		iterate: 'false',
		iterateCount: '100',
		iterateDelta: '0.001',
		refMode: 'A1'
	};

	/* 18.2.3 (CT_CustomWorkbookView) Defaults */
	var CustomWBViewDef = {
		autoUpdate: 'false',
		changesSavedWin: 'false',
		includeHiddenRowCol: 'true',
		includePrintSettings: 'true',
		maximized: 'false',
		minimized: 'false',
		onlySync: 'false',
		personalView: 'false',
		showComments: 'commIndicator',
		showFormulaBar: 'true',
		showHorizontalScroll: 'true',
		showObjects: 'all',
		showSheetTabs: 'true',
		showStatusbar: 'true',
		showVerticalScroll: 'true',
		tabRatio: '600',
		xWindow: '0',
		yWindow: '0'
	};

	var XMLNS_CT = 'http://schemas.openxmlformats.org/package/2006/content-types';
	var XMLNS_WB = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main';

	var strs = {}; // shared strings
	var styles = {}; // shared styles
	var _ssfopts = {}; // spreadsheet formatting options

	/* 18.3 Worksheets */
	function parseSheet(data) {
		if (!data) return data;
		/* 18.3.1.99 worksheet CT_Worksheet */
		var s = {};

		/* 18.3.1.35 dimension CT_SheetDimension ? */
		var ref = data.match(/<dimension ref="([^"]*)"\s*\/>/);
		if (ref && ref.length == 2 && ref[1].indexOf(":") !== -1) s["!ref"] = ref[1];

		var refguess = { s: { r: 1000000, c: 1000000 }, e: { r: 0, c: 0 } };
		var q = ["v", "f"];
		var sidx = 0;
		/* 18.3.1.80 sheetData CT_SheetData ? */
		if (!data.match(/<sheetData *\/>/)) data.match(/<sheetData>([^\u2603]*)<\/sheetData>/m)[1].split("</row>").forEach(function (x) {
			if (x === "" || x.trim() === "") return;

			/* 18.3.1.73 row CT_Row */
			var row = parsexmltag(x.match(/<row[^>]*>/)[0]);
			if (refguess.s.r > row.r - 1) refguess.s.r = row.r - 1;
			if (refguess.e.r < row.r - 1) refguess.e.r = row.r - 1;

			/* 18.3.1.4 c CT_Cell */
			var cells = x.substr(x.indexOf('>') + 1).split(/<c/);
			cells.forEach(function (c, idx) {
				if (c === "" || c.trim() === "") return;
				var cref = c.match(/r="([^"]*)"/);
				c = "<c" + c;
				if (cref && cref.length == 2) {
					var cref_cell = decode_cell(cref[1]);
					idx = cref_cell.c;
				}
				if (refguess.s.c > idx) refguess.s.c = idx;
				if (refguess.e.c < idx) refguess.e.c = idx;
				var cell = parsexmltag((c.match(/<c[^>]*>/) || [c])[0]);delete cell[0];
				var d = c.substr(c.indexOf('>') + 1);
				var p = {};
				q.forEach(function (f) {
					var x = d.match(matchtag(f));if (x) p[f] = unescapexml(x[1]);
				});

				/* SCHEMA IS ACTUALLY INCORRECT HERE.  IF A CELL HAS NO T, EMIT "" */
				if (cell.t === undefined && p.v === undefined) {
					p.t = "str";p.v = undefined;
				} else p.t = cell.t ? cell.t : "n"; // default is "n" in schema
				switch (p.t) {
					case 'n':
						p.v = parseFloat(p.v);break;
					case 's':
						{
							sidx = parseInt(p.v, 10);
							p.v = strs[sidx].t;
							p.r = strs[sidx].r;
						}break;
					case 'str':
						if (p.v) p.v = utf8read(p.v);break; // normal string
					case 'inlineStr':
						p.t = 'str';p.v = unescapexml((d.match(matchtag('t')) || ["", ""])[1]);
						break; // inline string
					case 'b':
						switch (p.v) {
							case '0':case 'FALSE':case "false":case false:
								p.v = false;break;
							case '1':case 'TRUE':case "true":case true:
								p.v = true;break;
							default:
								throw "Unrecognized boolean: " + p.v;
						}break;
					/* in case of error, stick value in .raw */
					case 'e':
						p.raw = p.v;p.v = undefined;break;
					default:
						throw "Unrecognized cell type: " + p.t;
				}

				/* formatting */
				if (cell.s && styles.CellXf) {
					/* TODO: second check is a hacked guard */
					var cf = styles.CellXf[cell.s];
					if (cf && cf.numFmtId && cf.numFmtId !== 0) {
						p.raw = p.v;
						p.rawt = p.t;
						try {
							p.v = SSF.format(cf.numFmtId, p.v, _ssfopts);
							p.t = 'str';
						} catch (e) {
							p.v = p.raw;
						}
					}
				}

				s[cell.r] = p;
			});
		});
		if (!s["!ref"]) s["!ref"] = encode_range(refguess);
		return s;
	}

	function parseProps(data) {
		var p = { Company: '' },
		    q = {};
		var strings = ["Application", "DocSecurity", "Company", "AppVersion"];
		var bools = ["HyperlinksChanged", "SharedDoc", "LinksUpToDate", "ScaleCrop"];
		var xtra = ["HeadingPairs", "TitlesOfParts"];
		var xtracp = ["category", "contentStatus", "lastModifiedBy", "lastPrinted", "revision", "version"];
		var xtradc = ["creator", "description", "identifier", "language", "subject", "title"];
		var xtradcterms = ["created", "modified"];
		xtra = xtra.concat(xtracp.map(function (x) {
			return "cp:" + x;
		}));
		xtra = xtra.concat(xtradc.map(function (x) {
			return "dc:" + x;
		}));
		xtra = xtra.concat(xtradcterms.map(function (x) {
			return "dcterms:" + x;
		}));

		strings.forEach(function (f) {
			p[f] = (data.match(matchtag(f)) || [])[1];
		});
		bools.forEach(function (f) {
			p[f] = (data.match(matchtag(f)) || [])[1] == "true";
		});
		xtra.forEach(function (f) {
			var cur = data.match(new RegExp("<" + f + "[^>]*>(.*)<\/" + f + ">"));
			if (cur && cur.length > 0) q[f] = cur[1];
		});

		if (q.HeadingPairs && q.TitlesOfParts) {
			var v = parseVector(q.HeadingPairs);
			var j = 0,
			    widx = 0;
			for (var i = 0; i !== v.length; ++i) {
				switch (v[i].v) {
					case "Worksheets":
						widx = j;p.Worksheets = +v[++i];break;
					case "Named Ranges":
						++i;break; // TODO: Handle Named Ranges
				}
			}
			var parts = parseVector(q.TitlesOfParts).map(utf8read);
			p.SheetNames = parts.slice(widx, widx + p.Worksheets);
		}
		p.Creator = q["dc:creator"];
		p.LastModifiedBy = q["cp:lastModifiedBy"];
		p.CreatedDate = new Date(q["dcterms:created"]);
		p.ModifiedDate = new Date(q["dcterms:modified"]);
		return p;
	}

	/* 18.6 Calculation Chain */
	function parseDeps(data) {
		var d = [];
		var l = 0,
		    i = 1;
		(data.match(/<[^>]*>/g) || []).forEach(function (x) {
			var y = parsexmltag(x);
			switch (y[0]) {
				case '<?xml':
					break;
				/* 18.6.2  calcChain CT_CalcChain 1 */
				case '<calcChain':case '<calcChain>':case '</calcChain>':
					break;
				/* 18.6.1  c CT_CalcCell 1 */
				case '<c':
					delete y[0];if (y.i) i = y.i;else y.i = i;d.push(y);break;
			}
		});
		return d;
	}

	var ctext = {};

	function parseCT(data) {
		if (!data || !data.match) return data;
		var ct = { workbooks: [], sheets: [], calcchains: [], themes: [], styles: [],
			coreprops: [], extprops: [], strs: [], xmlns: "" };
		(data.match(/<[^>]*>/g) || []).forEach(function (x) {
			var y = parsexmltag(x);
			switch (y[0]) {
				case '<?xml':
					break;
				case '<Types':
					ct.xmlns = y.xmlns;break;
				case '<Default':
					ctext[y.Extension] = y.ContentType;break;
				case '<Override':
					if (y.ContentType in ct2type) ct[ct2type[y.ContentType]].push(y.PartName);
					break;
			}
		});
		if (ct.xmlns !== XMLNS_CT) throw new Error("Unknown Namespace: " + ct.xmlns);
		ct.calcchain = ct.calcchains.length > 0 ? ct.calcchains[0] : "";
		ct.sst = ct.strs.length > 0 ? ct.strs[0] : "";
		ct.style = ct.styles.length > 0 ? ct.styles[0] : "";
		delete ct.calcchains;
		return ct;
	}

	/* 18.2 Workbook */
	function parseWB(data) {
		var wb = { AppVersion: {}, WBProps: {}, WBView: [], Sheets: [], CalcPr: {}, xmlns: "" };
		var pass = false;
		data.match(/<[^>]*>/g).forEach(function (x) {
			var y = parsexmltag(x);
			switch (y[0]) {
				case '<?xml':
					break;

				/* 18.2.27 workbook CT_Workbook 1 */
				case '<workbook':
					wb.xmlns = y.xmlns;break;
				case '</workbook>':
					break;

				/* 18.2.13 fileVersion CT_FileVersion ? */
				case '<fileVersion':
					delete y[0];wb.AppVersion = y;break;
				case '<fileVersion/>':
					break;

				/* 18.2.12 fileSharing CT_FileSharing ? */
				case '<fileSharing':case '<fileSharing/>':
					break;

				/* 18.2.28 workbookPr CT_WorkbookPr ? */
				case '<workbookPr':
					delete y[0];wb.WBProps = y;break;
				case '<workbookPr/>':
					delete y[0];wb.WBProps = y;break;

				/* 18.2.29 workbookProtection CT_WorkbookProtection ? */
				case '<workbookProtection/>':
					break;

				/* 18.2.1  bookViews CT_BookViews ? */
				case '<bookViews>':case '</bookViews>':
					break;
				/* 18.2.30   workbookView CT_BookView + */
				case '<workbookView':
					delete y[0];wb.WBView.push(y);break;

				/* 18.2.20 sheets CT_Sheets 1 */
				case '<sheets>':case '</sheets>':
					break; // aggregate sheet
				/* 18.2.19   sheet CT_Sheet + */
				case '<sheet':
					delete y[0];y.name = utf8read(y.name);wb.Sheets.push(y);break;

				/* 18.2.15 functionGroups CT_FunctionGroups ? */
				case '<functionGroups':case '<functionGroups/>':
					break;
				/* 18.2.14   functionGroup CT_FunctionGroup + */
				case '<functionGroup':
					break;

				/* 18.2.9  externalReferences CT_ExternalReferences ? */
				case '<externalReferences':case '</externalReferences>':
					break;
				/* 18.2.8    externalReference CT_ExternalReference + */
				case '<externalReference':
					break;

				/* 18.2.6  definedNames CT_DefinedNames ? */
				case '<definedNames/>':
					break;
				case '<definedNames>':
					pass = true;break;
				case '</definedNames>':
					pass = false;break;
				/* 18.2.5    definedName CT_DefinedName + */
				case '<definedName':case '<definedName/>':case '</definedName>':
					break;

				/* 18.2.2  calcPr CT_CalcPr ? */
				case '<calcPr':
					delete y[0];wb.CalcPr = y;break;
				case '<calcPr/>':
					delete y[0];wb.CalcPr = y;break;

				/* 18.2.16 oleSize CT_OleSize ? (ref required) */
				case '<oleSize':
					break;

				/* 18.2.4  customWorkbookViews CT_CustomWorkbookViews ? */
				case '<customWorkbookViews>':case '</customWorkbookViews>':case '<customWorkbookViews':
					break;
				/* 18.2.3    customWorkbookView CT_CustomWorkbookView + */
				case '<customWorkbookView':case '</customWorkbookView>':
					break;

				/* 18.2.18 pivotCaches CT_PivotCaches ? */
				case '<pivotCaches>':case '</pivotCaches>':case '<pivotCaches':
					break;
				/* 18.2.17 pivotCache CT_PivotCache ? */
				case '<pivotCache':
					break;

				/* 18.2.21 smartTagPr CT_SmartTagPr ? */
				case '<smartTagPr':case '<smartTagPr/>':
					break;

				/* 18.2.23 smartTagTypes CT_SmartTagTypes ? */
				case '<smartTagTypes':case '<smartTagTypes>':case '</smartTagTypes>':
					break;
				/* 18.2.22   smartTagType CT_SmartTagType ? */
				case '<smartTagType':
					break;

				/* 18.2.24 webPublishing CT_WebPublishing ? */
				case '<webPublishing':case '<webPublishing/>':
					break;

				/* 18.2.11 fileRecoveryPr CT_FileRecoveryPr ? */
				case '<fileRecoveryPr':case '<fileRecoveryPr/>':
					break;

				/* 18.2.26 webPublishObjects CT_WebPublishObjects ? */
				case '<webPublishObjects>':case '<webPublishObjects':case '</webPublishObjects>':
					break;
				/* 18.2.25 webPublishObject CT_WebPublishObject ? */
				case '<webPublishObject':
					break;

				/* 18.2.10 extLst CT_ExtensionList ? */
				case '<extLst>':case '</extLst>':case '<extLst/>':
					break;
				/* 18.2.7    ext CT_Extension + */
				case '<ext':
					pass = true;break; //TODO: check with versions of excel
				case '</ext>':
					pass = false;break;

				/* Others */
				case '<mx:ArchID':
					break;
				case '<mc:AlternateContent':
					pass = true;break;
				case '</mc:AlternateContent>':
					pass = false;break;
			}
		});
		if (wb.xmlns !== XMLNS_WB) throw new Error("Unknown Namespace: " + wb.xmlns);

		var z;
		/* defaults */
		for (z in WBPropsDef) {
			if (typeof wb.WBProps[z] === 'undefined') wb.WBProps[z] = WBPropsDef[z];
		}for (z in CalcPrDef) {
			if (typeof wb.CalcPr[z] === 'undefined') wb.CalcPr[z] = CalcPrDef[z];
		}wb.WBView.forEach(function (w) {
			for (var z in WBViewDef) {
				if (typeof w[z] === 'undefined') w[z] = WBViewDef[z];
			}
		});
		wb.Sheets.forEach(function (w) {
			for (var z in SheetDef) {
				if (typeof w[z] === 'undefined') w[z] = SheetDef[z];
			}
		});

		_ssfopts.date1904 = parsexmlbool(wb.WBProps.date1904, 'date1904');

		return wb;
	}

	/* 18.8.31 numFmts CT_NumFmts */
	function parseNumFmts(t) {
		styles.NumberFmt = [];
		for (var y in SSF._table) {
			styles.NumberFmt[y] = SSF._table[y];
		}t[0].match(/<[^>]*>/g).forEach(function (x) {
			var y = parsexmltag(x);
			switch (y[0]) {
				case '<numFmts':case '</numFmts>':case '<numFmts/>':
					break;
				case '<numFmt':
					{
						var f = unescapexml(y.formatCode),
						    i = parseInt(y.numFmtId, 10);
						styles.NumberFmt[i] = f;SSF.load(f, i);
					}break;
				default:
					throw 'unrecognized ' + y[0] + ' in numFmts';
			}
		});
	}

	/* 18.8.10 cellXfs CT_CellXfs */
	function parseCXfs(t) {
		styles.CellXf = [];
		t[0].match(/<[^>]*>/g).forEach(function (x) {
			var y = parsexmltag(x);
			switch (y[0]) {
				case '<cellXfs':case '<cellXfs/>':case '</cellXfs>':
					break;

				/* 18.8.45 xf CT_Xf */
				case '<xf':
					if (y.numFmtId) y.numFmtId = parseInt(y.numFmtId, 10);
					styles.CellXf.push(y);break;
				case '</xf>':
					break;

				/* 18.8.1 alignment CT_CellAlignment */
				case '<alignment':
					break;

				/* 18.8.33 protection CT_CellProtection */
				case '<protection':case '</protection>':case '<protection/>':
					break;

				case '<extLst':case '</extLst>':
					break;
				case '<ext':
					break;
				default:
					throw 'unrecognized ' + y[0] + ' in cellXfs';
			}
		});
	}

	/* 18.8 Styles CT_Stylesheet*/
	function parseStyles(data) {
		/* 18.8.39 styleSheet CT_Stylesheet */
		var t;

		/* numFmts CT_NumFmts ? */
		if (t = data.match(/<numFmts([^>]*)>.*<\/numFmts>/)) parseNumFmts(t);

		/* fonts CT_Fonts ? */
		/* fills CT_Fills ? */
		/* borders CT_Borders ? */
		/* cellStyleXfs CT_CellStyleXfs ? */

		/* cellXfs CT_CellXfs ? */
		if (t = data.match(/<cellXfs([^>]*)>.*<\/cellXfs>/)) parseCXfs(t);

		/* dxfs CT_Dxfs ? */
		/* tableStyles CT_TableStyles ? */
		/* colors CT_Colors ? */
		/* extLst CT_ExtensionList ? */

		return styles;
	}

	function getdata(data) {
		if (!data) return null;
		if (data.data) return data.data;
		if (data._data && data._data.getContent) return Array.prototype.slice.call(data._data.getContent(), 0).map(function (x) {
			return String.fromCharCode(x);
		}).join("");
		return null;
	}

	function getzipfile(zip, file) {
		var f = file;if (zip.files[f]) return zip.files[f];
		f = file.toLowerCase();if (zip.files[f]) return zip.files[f];
		f = f.replace(/\//g, '\\');if (zip.files[f]) return zip.files[f];
		throw new Error("Cannot find file " + file + " in zip");
	}

	function parseZip(zip) {
		var entries = Object.keys(zip.files);
		var keys = entries.filter(function (x) {
			return x.substr(-1) != '/';
		}).sort();
		var dir = parseCT(getdata(getzipfile(zip, '[Content_Types].xml')));
		if (dir.workbooks.length === 0) throw new Error("Could not find workbook entry");
		strs = {};
		if (dir.sst) strs = parse_sst(getdata(getzipfile(zip, dir.sst.replace(/^\//, ''))));

		styles = {};
		if (dir.style) styles = parseStyles(getdata(getzipfile(zip, dir.style.replace(/^\//, ''))));

		var wb = parseWB(getdata(getzipfile(zip, dir.workbooks[0].replace(/^\//, ''))));
		var propdata = dir.coreprops.length !== 0 ? getdata(getzipfile(zip, dir.coreprops[0].replace(/^\//, ''))) : "";
		propdata += dir.extprops.length !== 0 ? getdata(getzipfile(zip, dir.extprops[0].replace(/^\//, ''))) : "";
		var props = propdata !== "" ? parseProps(propdata) : {};
		var deps = {};
		if (dir.calcchain) deps = parseDeps(getdata(getzipfile(zip, dir.calcchain.replace(/^\//, ''))));
		var sheets = {},
		    i = 0;
		if (!props.Worksheets) {
			/* Google Docs doesn't generate the appropriate metadata, so we impute: */
			var wbsheets = wb.Sheets;
			props.Worksheets = wbsheets.length;
			props.SheetNames = [];
			for (var j = 0; j != wbsheets.length; ++j) {
				props.SheetNames[j] = wbsheets[j].name;
			}
			for (i = 0; i != props.Worksheets; ++i) {
				try {
					/* TODO: remove these guards */
					sheets[props.SheetNames[i]] = parseSheet(getdata(getzipfile(zip, 'xl/worksheets/sheet' + (i + 1) + '.xml')));
				} catch (e) {}
			}
		} else {
			for (i = 0; i != props.Worksheets; ++i) {
				try {
					sheets[props.SheetNames[i]] = parseSheet(getdata(getzipfile(zip, dir.sheets[i].replace(/^\//, ''))));
				} catch (e) {}
			}
		}
		return {
			Directory: dir,
			Workbook: wb,
			Props: props,
			Deps: deps,
			Sheets: sheets,
			SheetNames: props.SheetNames,
			Strings: strs,
			Styles: styles,
			keys: keys,
			files: zip.files
		};
	}

	var _fs, jszip;
	if (typeof JSZip !== 'undefined') jszip = JSZip;
	if (typeof exports !== 'undefined') {
		if (typeof module !== 'undefined' && module.exports) {
			if (typeof jszip === 'undefined') jszip = require('./jszip').JSZip;
			_fs = require('fs');
		}
	}

	function readSync(data, options) {
		var zip,
		    d = data;
		var o = options || {};
		switch (o.type || "base64") {
			case "file":
				d = _fs.readFileSync(data).toString('base64');
			/* falls through */
			case "base64":
				zip = new jszip(d, { base64: true });break;
			case "binary":
				zip = new jszip(d, { base64: false });break;
		}
		return parseZip(zip);
	}

	function readFileSync(data, options) {
		var o = options || {};o.type = 'file';
		return readSync(data, o);
	}

	XLSX.read = readSync;
	XLSX.readFile = readFileSync;
	XLSX.parseZip = parseZip;
	return this;
})(XLSX);

var _chr = function _chr(c) {
	return String.fromCharCode(c);
};

function encode_col(col) {
	var s = "";for (++col; col; col = Math.floor((col - 1) / 26)) {
		s = _chr((col - 1) % 26 + 65) + s;
	}return s;
}
function encode_row(row) {
	return "" + (row + 1);
}
function encode_cell(cell) {
	return encode_col(cell.c) + encode_row(cell.r);
}

function decode_col(c) {
	var d = 0,
	    i = 0;for (; i !== c.length; ++i) {
		d = 26 * d + c.charCodeAt(i) - 64;
	}return d - 1;
}
function decode_row(rowstr) {
	return Number(rowstr) - 1;
}
function split_cell(cstr) {
	return cstr.replace(/(\$?[A-Z]*)(\$?[0-9]*)/, "$1,$2").split(",");
}
function decode_cell(cstr) {
	var splt = split_cell(cstr);return { c: decode_col(splt[0]), r: decode_row(splt[1]) };
}
function decode_range(range) {
	var x = range.split(":").map(decode_cell);return { s: x[0], e: x[x.length - 1] };
}
function encode_range(range) {
	return encode_cell(range.s) + ":" + encode_cell(range.e);
}
/**
 * Convert a sheet into an array of objects where the column headers are keys.
 **/
function sheet_to_row_object_array(sheet) {
	var val, rowObject, range, columnHeaders, emptyRow, C;
	var outSheet = [];
	if (sheet["!ref"]) {
		range = decode_range(sheet["!ref"]);

		columnHeaders = {};
		for (C = range.s.c; C <= range.e.c; ++C) {
			val = sheet[encode_cell({
				c: C,
				r: range.s.r
			})];
			if (val) {
				switch (val.t) {
					case 's':case 'str':
						columnHeaders[C] = val.v;break;
					case 'n':
						columnHeaders[C] = val.v;break;
				}
			}
		}

		for (var R = range.s.r + 1; R <= range.e.r; ++R) {
			emptyRow = true;
			//Row number is recorded in the prototype
			//so that it doesn't appear when stringified.
			rowObject = Object.create({ __rowNum__: R });
			for (C = range.s.c; C <= range.e.c; ++C) {
				val = sheet[encode_cell({
					c: C,
					r: R
				})];
				if (val !== undefined) switch (val.t) {
					case 's':case 'str':case 'b':case 'n':
						if (val.v !== undefined) {
							rowObject[columnHeaders[C]] = val.v;
							emptyRow = false;
						}
						break;
					case 'e':
						break; /* throw */
					default:
						throw 'unrecognized type ' + val.t;
				}
			}
			if (!emptyRow) {
				outSheet.push(rowObject);
			}
		}
	}
	return outSheet;
}

function sheet_to_csv(sheet) {
	var stringify = function stringify(val) {
		switch (val.t) {
			case 'n':
				return String(val.v);
			case 's':case 'str':
				if (typeof val.v === 'undefined') return "";
				return JSON.stringify(val.v);
			case 'b':
				return val.v ? "TRUE" : "FALSE";
			case 'e':
				return ""; /* throw out value in case of error */
			default:
				throw 'unrecognized type ' + val.t;
		}
	};
	var out = "";
	if (sheet["!ref"]) {
		var r = XLSX.utils.decode_range(sheet["!ref"]);
		for (var R = r.s.r; R <= r.e.r; ++R) {
			var row = [];
			for (var C = r.s.c; C <= r.e.c; ++C) {
				var val = sheet[XLSX.utils.encode_cell({ c: C, r: R })];
				row.push(val ? stringify(val).replace(/\\r\\n/g, "\n").replace(/\\t/g, "\t").replace(/\\\\/g, "\\").replace("\\\"", "\"\"") : "");
			}
			out += row.join(",") + "\n";
		}
	}
	return out;
}
var make_csv = sheet_to_csv;

function get_formulae(ws) {
	var cmds = [];
	for (var y in ws) {
		if (y[0] !== '!' && ws.hasOwnProperty(y)) {
			var x = ws[y];
			var val = "";
			if (x.f) val = x.f;else if (typeof x.v === 'number') val = x.v;else val = x.v;
			cmds.push(y + "=" + val);
		}
	}return cmds;
}

XLSX.utils = {
	encode_col: encode_col,
	encode_row: encode_row,
	encode_cell: encode_cell,
	encode_range: encode_range,
	decode_col: decode_col,
	decode_row: decode_row,
	split_cell: split_cell,
	decode_cell: decode_cell,
	decode_range: decode_range,
	sheet_to_csv: sheet_to_csv,
	make_csv: sheet_to_csv,
	get_formulae: get_formulae,
	sheet_to_row_object_array: sheet_to_row_object_array
};

if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
	exports.read = XLSX.read;
	exports.readFile = XLSX.readFile;
	exports.utils = XLSX.utils;
	exports.main = function (args) {
		var zip = XLSX.read(args[0], { type: 'file' });
		console.log(zip.Sheets);
	};
	if (typeof module !== 'undefined' && require.main === module) exports.main(process.argv.slice(2));
}