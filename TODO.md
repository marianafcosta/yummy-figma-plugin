# TODOs

* Change "paint" naming convention to "color"
* Instead of choosing one format per style, choose the format for all styles
* Include effects
* Fix letter spacing property parsing (values can be decimals and parseInt can't handle that)
* Add alerts for when
  * A merge request already exists
  * The request to create a branch fails for some reason other than the branch already existing
  * The request to create a file fails for some reason other than the file already existing
  * The request to update a file fails
* Simplify the way the download link is updated
* Instead of having a separate `downloadableCode` property, just use the existing one
* Clean up the HTML
* Implement the new UI
* Simplify the data flow for some of the messages
  * For example, create-merge-request-request -> create-merge-request-response
  * Even if the flow stays the same, there has to be some better naming convention for these
* Suggest some ways to deal with the automatic formatting of the files