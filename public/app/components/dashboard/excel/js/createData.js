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
function mapEntries(json, realrowlength, skip){
  if (!skip) skip = 0;
  var dataframe = new Array();

  var row = new Array();
  for (var i=0; i < json.feed.entry.length; i++) {
    var entry = json.feed.entry[i];
    if (entry.gs$cell.col == '1') {
      if (row != null) {
        if ((!realrowlength || row.length === realrowlength) && (skip  === 0)){
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
